import { courseApi } from "../api/course.api";

const handleError = (err) => {
  throw new Error(
    err.response?.data?.message ||
    err.message ||
    "Something went wrong"
  );
};

export const courseService = {
    async getCourses(params) {
        try{
            const res = await courseApi.getCourses(params);
            const payLoad = res.data?.data || {};
            return {
                list: Array.isArray(payLoad.list) ? payLoad.list : [],
                pendingCount: payLoad.pendingCount ?? 0,
            };
        }
        catch (err) {
            handleError(err);
        }
    },
    async getCourseDetail(courseId) {
        try{
            const res = await courseApi.getCourseDetail(courseId);
            return res.data?.data?.course || null;
        }catch (err) {
            handleError(err);
        }
    },
    async createCourse(courseData) {
        try{
            const res = await courseApi.createCourse(courseData);
            return res.data?.data?.course || null;
        }catch (err) {
            handleError(err);
        }
    },
    async updateCourse(courseId, updateData) {
        try{
            const res = await courseApi.updateCourse(courseId, updateData);
            return res.data?.data?.course || null;
        }catch (err) {
            handleError(err);
        }
    },
    async deleteCourse(courseId) {
        try{
            const res = await courseApi.deleteCourse(courseId);
            return res.data?.data?.course || null;
        }catch (err) {
            handleError(err);
        }
    },
    async restoreCourse(courseId) {
        try{
            const res = await courseApi.restoreCourse(courseId);
            return res.data?.data?.course || null;
        }catch (err) {
            handleError(err);
        }
    },
    async getCourseByTeacherId(teacherId) {
        try{
            const res = await courseApi.getCourseByTeacherId(teacherId);
            return Array.isArray(res.data?.data?.courses) ? res.data.data.courses : [];
        }catch (err) {
            handleError(err);
        }
    },
    async publishCourse(courseId) {
        try{
            const res = await courseApi.publishCourse(courseId);
            return res.data?.data?.course || null;
        }catch (err) {
            handleError(err);
        }
    },
    async unpublishCourse(courseId) {
        try{
            const res = await courseApi.unpublishCourse(courseId);
            return res.data?.data?.course || null;
        }catch (err) {
            handleError(err);
        }
    },
    async enrollCourse(courseId) {
        try{
            const res = await courseApi.enrollCourse(courseId);
            return res.data?.data || null;
        }catch (err) {
            handleError(err);
        }
    },
    async unenrollCourse(courseId) {
        try{
            const res = await courseApi.unenrollCourse(courseId);
            return res.data?.data || null;
        }catch (err) {
            handleError(err);
        }
    }

};