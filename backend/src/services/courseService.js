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
            const courses = await Course.find().populate("teacherId", "username email avatar").lean();
            return courses.map(course => ({
                ...course,
                studentCount: course.students.length
            }));
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
            return {
                ...course.toObject(),
                studentCount: course.students.length
            };
        }
        catch(error){
            throw new Error("Failed to get course: " + error.message);  
        }
    },
    async updateCourse(courseId, updateData){
        try{
            const course = await Course.findByIdAndUpdate(
                courseId,
                updateData,
                { new: true, runValidators: true }
            ).populate("teacherId", "username email");
            if(!course){
                throw new Error("Course not found");
            }
            return course;
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
            if(!course){
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
            const courses = await Course.find({ teacherId })
            .populate("teacherId", "username email avatar")
            .lean();
            return courses.map(course => ({
                ...course,
                studentCount: course.students.length
            }));
        }
        catch(error){
            throw new Error("Failed to get courses by teacher: " + error.message);
        }
    },
    async enrollStudent(courseId, studentId){
        try{
            const course = await Course.findById(courseId);
            if(!course){
                throw new Error("Course not found");
            }
            if(course.students.includes(studentId)){
                throw new Error("Student already enrolled in this course");
            }
            course.students.push(studentId);
            await course.save();
            return await course.populate("teacherId", "username email avatar");
        }
        catch(error){
            throw new Error("Failed to enroll student: " + error.message);
        }
    },
    async unenrollStudent(courseId, studentId){ 
        try{
            const course = await Course.findById(courseId);
            if(!course){
                throw new Error("Course not found");
            }
            if(!course.students.includes(studentId)){
                throw new Error("Student is not enrolled in this course");
            }
            course.students = course.students.filter(id => id.toString() !== studentId.toString());
            await course.save();
            return await course.populate("teacherId", "username email avatar");
        }
        catch(error){
            throw new Error("Failed to unenroll student: " + error.message);
        }
    }
}

export default courseService;