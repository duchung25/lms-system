import { useEffect, useState } from "react";
import { courseService } from "../service/course.service";
import { getErrorMessage } from "../helpers/error.helper.js";

export const useCourses = ({ q, category, level, published, deleted, role }) => {
  const [courses, setCourses] = useState([]);
  const [pendingCount, setPendingCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const params = {
          q,
          category,
          level,
          ...(role === "admin" && published && { published }),
          ...(role === "admin" && deleted && { deleted }),
        };

        const result = await courseService.getCourses(params);

        setCourses(result.list);
        setPendingCount(result.pendingCount);

      } catch (err) {
        setCourses([]);
        console.error( getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [q, category, level, published, deleted, role]);

  return { courses, pendingCount, loading };
};

export const useCourseDetail = (courseId) => {
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if(!courseId) {
      setCourse(null);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        const result = await courseService.getCourseDetail(courseId);
        setCourse(result);
      }catch (err) {
        setCourse(null);
        console.error(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    },[courseId]);

  return { course, setCourse, loading };
}

export const useCourseForm = (initialValue = null) => {
  const [formData, setFormData] = useState(
    initialValue || {
    title: "",
    description: "",
    category: "",
    level: "beginner",
    price: 0,
    thumbnail: ""  
    }
  );
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState("");

  const updateField = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleThumbnailChange = (file) => {
    const preview = URL.createObjectURL(file);
    setThumbnailFile(file);
    setThumbnailPreview(preview);
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      category: "",
      level: "beginner",
      price: 0,
      thumbnail: ""
    });
    setThumbnailFile(null);
    setThumbnailPreview("");
  };
  return { formData, setFormData, updateField, resetForm, thumbnailFile, setThumbnailFile, thumbnailPreview, setThumbnailPreview, handleThumbnailChange };
}

export const useCreateCourse = () => {
  const [loading, setLoading] = useState(false);

  const createCourse = async (courseData) => {
    setLoading(true);
    try{
      const course = await courseService.createCourse(courseData);
      return course;
      }catch (err) {
        throw new Error(getErrorMessage(err));
    }finally {
      setLoading(false);
    }
  };
  return { createCourse, loading };
}

export const useUpdateCourse = (courseId) => {
  const [loading, setLoading] = useState(false);

  const updateCourse = async (updateData) => {
    if (!courseId) throw new Error("courseId is required");
    setLoading(true);
    try {
      return await courseService.updateCourse(courseId, updateData);
    } catch (err) {
      throw new Error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return { updateCourse, loading};
};

export const useDeleteCourse = () => {
  const [loading, setLoading] = useState(false);

  const deleteCourse = async (courseId) => {
    setLoading(true);
    try {
      return await courseService.deleteCourse(courseId);
    } catch (err) {
      throw new Error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return { deleteCourse, loading };
};

export const useRestoreCourse = () => {
  const [loading, setLoading] = useState(false);

  const restoreCourse = async (courseId) => {
    setLoading(true);
    try {
      return await courseService.restoreCourse(courseId);
    } catch (err) {
      throw new Error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return { restoreCourse, loading };
};

export const usePublishCourse = () => {
  const [loading, setLoading] = useState(false);

  const publishCourse = async (courseId) => {
    setLoading(true);
    try {
      return await courseService.publishCourse(courseId);
    } catch (err) {
      throw new Error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return { publishCourse, loading };
};

export const useUnpublishCourse = () => {
  const [loading, setLoading] = useState(false);

  const unpublishCourse = async (courseId) => {
    setLoading(true);
    try {
      const unpublishedCourse = await courseService.unpublishCourse(courseId);
      return unpublishedCourse;
    } catch (err) {
      throw new Error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return { unpublishCourse, loading };
};

export const useEnrollCourse = () => {
  const [loading, setLoading] = useState(false);

  const enrollCourse = async (courseId) => {
    setLoading(true);
    try {
      return await courseService.enrollCourse(courseId);
    } catch (err) {
      throw new Error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return { enrollCourse, loading };
};

export const useUnenrollCourse = () => {
  const [loading, setLoading] = useState(false);

  const unenrollCourse = async (courseId) => {
    setLoading(true);
    try {
      return await courseService.unenrollCourse(courseId);
    } catch (err) {
      throw new Error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return { unenrollCourse, loading };
};

export const useCoursesByTeacher = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCourses = async (teacherId) => {
    setLoading(true);
    try {
      const data = await courseService.getCourseByTeacherId(teacherId);
      setCourses(data);
      return data;
    } catch (err) {
      setCourses([]);
      console.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return { courses, loading, fetchCourses };
};

  