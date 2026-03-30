const canAccessCourse = async (req, res, next) => {
    const courseId = req.params.courseId;
    const userId = req.user.userId;

    const enrollment = await Enrollment.findOne({
        courseId,
        studentId: userId,
        status: "active"
    });

    if (!enrollment && req.user.role !== "admin") {
        return res.status(403).json({ message: "Not enrolled" });
    }

    next();
};