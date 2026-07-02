import Certificate from '../models/Certificate.js';
import Enrollment from '../models/Enrollment.js';
import LessonProgress from '../models/LessonProgress.js';
import Course from '../models/Course.js';
import Lesson from '../models/Lesson.js';
import crypto from 'crypto';
import AppError from '../utils/AppError.js';
import notificationService from './notificationService.js';

const buildCertificateNumber = () =>
    `CERT-${crypto.randomBytes(4).toString('hex').toUpperCase()}-${Date.now().toString().slice(-4)}`;

const buildVerificationCode = () => crypto.randomBytes(16).toString('hex');

const getCompletionSnapshot = async (userId, courseId) => {
    const [course, enrollment, publishedLessons] = await Promise.all([
        Course.findOneWithDeleted({ _id: courseId, status: "PUBLISHED" }).lean(),
        Enrollment.findOne({ studentId: userId, courseId, status: "active" }).lean(),
        Lesson.find({ courseId, isPublished: true }).select("_id title").lean(),
    ]);

    if (!course) {
        throw new AppError("Course not found", 404);
    }

    if (!enrollment) {
        throw new AppError("Student is not enrolled in this course", 400);
    }

    if (publishedLessons.length === 0) {
        throw new AppError("Course has no published lessons yet", 400);
    }

    const lessonIds = publishedLessons.map((lesson) => lesson._id);
    const completedLessonsCount = await LessonProgress.countDocuments({
        studentId: userId,
        courseId,
        lessonId: { $in: lessonIds },
    });

    const isCourseCompleted =
        enrollment.progressPercent === 100 &&
        completedLessonsCount >= publishedLessons.length;

    if (!isCourseCompleted) {
        throw new AppError("Course must be 100% completed to generate a certificate", 400);
    }

    return {
        course,
        enrollment,
        publishedLessons,
        completedLessonsCount,
    };
};

const certificateService = {
    async generateCertificate(userId, courseId) {
        const existing = await Certificate.findOne({ userId, courseId });
        if (existing) {
            return Certificate.findById(existing._id)
                .populate("userId", "username email avatar")
                .populate("courseId", "title thumbnail")
                .lean();
        }

        await getCompletionSnapshot(userId, courseId);

        const certificateNumber = buildCertificateNumber();
        const verificationCode = buildVerificationCode();

        const certificate = await Certificate.create({
            userId,
            courseId,
            certificateNumber,
            verificationCode,
            pdfUrl: "",
        });

        certificate.pdfUrl = `/certificates/${certificate._id}/print`;
        await certificate.save();

        await notificationService.createNotification({
            userId,
            title: "Chứng chỉ đã được cấp",
            message: "Bạn đã hoàn thành khóa học và nhận được chứng chỉ mới.",
            type: "CERTIFICATE_ISSUED",
            link: `/certificates/${certificate._id}/print`,
            referenceId: String(certificate._id),
            referenceType: "Certificate",
        });

        return Certificate.findById(certificate._id)
            .populate("userId", "username email avatar")
            .populate("courseId", "title thumbnail")
            .lean();
    },
    
    async getStudentCertificates(userId) {
        return await Certificate.find({ userId })
            .populate('courseId', 'title thumbnail')
            .sort({ issueDate: -1 });
    },

    async getCertificateById(certificateId, user) {
        const certificate = await Certificate.findById(certificateId)
            .populate("userId", "username email avatar")
            .populate("courseId", "title thumbnail level")
            .lean();

        if (!certificate) {
            throw new AppError("Certificate not found", 404);
        }

        const isOwner = certificate.userId?._id?.toString() === user?.userId?.toString();
        const isAdmin = user?.role === "admin";

        if (!isOwner && !isAdmin) {
            throw new AppError("You do not have permission to view this certificate", 403);
        }

        return certificate;
    },

    async getAllCertificates(options = {}) {
        const { page = 1, limit = 10, search, status } = options;
        const query = {};
        if (status) {
            query.status = status;
        }
        const skip = (page - 1) * limit;
        const [list, total, allCertificates] = await Promise.all([
            Certificate.find(query)
                .populate('userId', 'username email')
                .populate('courseId', 'title')
                .sort({ issueDate: -1 })
                .skip(skip)
                .limit(limit),
            Certificate.countDocuments(query),
            search ? Certificate.find(query)
                .populate('userId', 'username email')
                .populate('courseId', 'title')
                .sort({ issueDate: -1 })
                .lean() : [],
        ]);

        let filteredList = list;
        if (search) {
            const keyword = search.toLowerCase().trim();
            filteredList = allCertificates.filter((cert) => {
                const certificateNumber = cert.certificateNumber?.toLowerCase() || "";
                const username = cert.userId?.username?.toLowerCase() || "";
                const email = cert.userId?.email?.toLowerCase() || "";
                const courseTitle = cert.courseId?.title?.toLowerCase() || "";

                return (
                    certificateNumber.includes(keyword) ||
                    username.includes(keyword) ||
                    email.includes(keyword) ||
                    courseTitle.includes(keyword)
                );
            });
        }

        return {
            list: search ? filteredList.slice(skip, skip + Number(limit)) : list,
            page: Number(page),
            limit: Number(limit),
            total: search ? filteredList.length : total,
            totalPages: Math.ceil((search ? filteredList.length : total) / limit),
        };
    },

    async verifyCertificate(verificationCode) {
        const cert = await Certificate.findOne({ verificationCode })
            .populate('userId', 'username')
            .populate('courseId', 'title');
        
        if (!cert) {
            throw new AppError("Invalid verification code", 404);
        }
        
        return cert;
    },

    async revokeCertificate(certificateId) {
        const cert = await Certificate.findById(certificateId);
        if (!cert) throw new AppError("Certificate not found", 404);
        
        cert.status = 'REVOKED';
        await cert.save();
        return cert;
    },
};

export default certificateService;
