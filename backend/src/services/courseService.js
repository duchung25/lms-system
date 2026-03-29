import Course from '../models/Course.js';

const courseService = {
    async createCourse(courseData) {
      try{
        const {title, description, category, level, price, teacherId} = courseData;
        const course = await Course.create(courseData);
        return await course.populate("teacherId", "username email avatar");
      }
      catch(error){
        throw new Error("Failed to create course: " + error.message);
      }  
    },
    async getAllCourse(){
        try{
            return await Course.find()
            .populate("teacherId", "username email avatar")
            .lean();
        }
        catch(error){
            throw new Error("Failed to get courses: " + error.message);
        }
    },
    async getCourseById(courseId){
        try{
            const course = await Course.findById(courseId)
            .populate("teacherId", "username email avatar");
            if(!course){
                throw new Error("Course not found");
            }
            return course;
        }
        catch(error){
            throw new Error("Failed to get course: " + error.message);  
        }
    },
    async updateCourse(courseId, updateData, currentUser){
        try{
            const course = await Course.findById(courseId);
            if(!course){
                throw new Error("Course not found");
            }
            if(currentUser.role === "teacher"){
                if(currentUser.userId.toString() !== course.teacherId.toString()){
                    throw new Error("You are not the owner of this course");
                }
            }
            Object.assign(course, updateData);
            return await course.save().populate("teacherId", "username email avatar");
        }
        catch(error){
            throw new Error("Failed to update course: " + error.message);
        }
    },
    async deleteCourse(courseId){
        try{
            const course = await Course.findById(courseId);
            if(!course) {
                throw new Error("Course not found")
            }
            await course.delete();
            return {
                message: "Course deleted successfully",
                deletedCourseId: courseId
            }
        }
        catch(error){
            throw new Error("Failed to delete course: " + error.message);
        }
    },
    async restoreCourse(courseId){
        try{
            const course = await Course.findWithDeleted({ _id: courseId });
            if(!course || course.length === 0){
                throw new Error("Course not found");
            }
            await Course.restore({ _id: courseId });
            return {
                message: "Course restored successfully",
                restoredCourseId: courseId
            }
        }
        catch(error){
            throw new Error("Failed to restore course: " + error.message);
        }
    },
    async getCourseByTeacherId(teacherId){
        try{
            return await Course.find({ teacherId })
            .populate("teacherId", "username email avatar")
            .lean();
        }
        catch(error){
            throw new Error("Failed to get courses by teacher: " + error.message);
        }
    },
}

export default courseService;