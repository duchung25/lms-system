import { useCallback, useEffect, useState } from "react";
import { courseService } from "../service/course.service";
import { getErrorMessage } from "../helpers/error.helper.js";

export const useCourses = ({ q, category, level, published, deleted, role }) => {
  const [courses, setCourses] = useState([]);
  const [pendingCount, setPendingCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");

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
        setError(
          getErrorMessage(err) ||
            "Đã có lỗi xảy ra. Vui lòng thử lại."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [q, category, level, published, deleted, role]);

  return { courses, pendingCount, loading, error };
};

export const useCourseDetail = (courseId) => {
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!courseId) {
      setCourse(null);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError("");

      try {
        const result = await courseService.getCourseDetail(courseId);
        setCourse(result);
      } catch (err) {
        setCourse(null);
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [courseId]);

  return { course, setCourse, loading, error };
};

export const useCoursesByTeacher = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchCourses = async (teacherId) => {
    setLoading(true);
    setError("");

    try {
      const data = await courseService.getCourseByTeacherId(teacherId);
      setCourses(data);
      return data;
    } catch (err) {
      setCourses([]);
      setError(
        getErrorMessage(err) ||
          "Đã có lỗi xảy ra. Vui lòng thử lại."
      );
    } finally {
      setLoading(false);
    }
  };

  return { courses, loading, fetchCourses, error };
};

export const useMyCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMyCourses = async () => {
      setLoading(true);
      setError("");

      try {
        const data = await courseService.getMyCourses();
        setCourses(data);
      } catch (err) {
        setCourses([]);
        setError(
          getErrorMessage(err) ||
            "Đã có lỗi xảy ra. Vui lòng thử lại."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMyCourses();
  }, []);

  return { courses, loading, error };
};

export const useCourseForm = (initialValue = null) => {
  const [formData, setFormData] = useState(
    initialValue || {
      title: "",
      description: "",
      category: "",
      level: "beginner",
      price: 0,
      thumbnail: "",
    }
  );

  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState("");

  const updateField = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
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
      thumbnail: "",
    });
    setThumbnailFile(null);
    setThumbnailPreview("");
  };

  return {
    formData,
    setFormData,
    updateField,
    resetForm,
    thumbnailFile,
    setThumbnailFile,
    thumbnailPreview,
    setThumbnailPreview,
    handleThumbnailChange,
  };
};


export const useCreateCourse = () => {
  const [loading, setLoading] = useState(false);

  const createCourse = async (courseData) => {
    setLoading(true);
    try {
      return await courseService.createCourse(courseData);
    } catch (err) {
      throw new Error(
        getErrorMessage(err) ||
          "Đã có lỗi xảy ra. Vui lòng thử lại."
      );
    } finally {
      setLoading(false);
    }
  };

  return { createCourse, loading };
};

export const useUpdateCourse = (courseId) => {
  const [loading, setLoading] = useState(false);

  const updateCourse = async (updateData) => {
    if (!courseId) throw new Error("courseId is required");

    setLoading(true);
    try {
      return await courseService.updateCourse(courseId, updateData);
    } catch (err) {
      throw new Error(
        getErrorMessage(err) ||
          "Đã có lỗi xảy ra. Vui lòng thử lại."
      );
    } finally {
      setLoading(false);
    }
  };

  return { updateCourse, loading };
};

export const useDeleteCourse = () => {
  const [loading, setLoading] = useState(false);

  const deleteCourse = async (courseId) => {
    setLoading(true);
    try {
      return await courseService.deleteCourse(courseId);
    } catch (err) {
      throw new Error(
        getErrorMessage(err) ||
          "Đã có lỗi xảy ra. Vui lòng thử lại."
      );
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
      throw new Error(
        getErrorMessage(err) ||
          "Đã có lỗi xảy ra. Vui lòng thử lại."
      );
    } finally {
      setLoading(false);
    }
  };

  return { restoreCourse, loading };
};


export const useSetPublishCourse = () => {
  const [loading, setLoading] = useState(false);
  const setPublishCourse = async (courseId, status) => {
    setLoading(true);
    try {
      return await courseService.setPublishCourse(courseId, status);
    } catch (err) {
      throw new Error(
        getErrorMessage(err) ||
          "Đã có lỗi xảy ra. Vui lòng thử lại."
      );
    } finally {
      setLoading(false);
    }
  };

  return { setPublishCourse, loading };
}

export const useEnrollCourse = () => {
  const [loading, setLoading] = useState(false);

  const enrollCourse = async (courseId) => {
    setLoading(true);
    try {
      return await courseService.enrollCourse(courseId);
    } catch (err) {
      throw new Error(
        getErrorMessage(err) ||
          "Đã có lỗi xảy ra. Vui lòng thử lại."
      );
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
      throw new Error(
        getErrorMessage(err) ||
          "Đã có lỗi xảy ra. Vui lòng thử lại."
      );
    } finally {
      setLoading(false);
    }
  };

  return { unenrollCourse, loading };
};

export const useUpdateLearningProgress = () => {
  const [loading, setLoading] = useState(false);

  const updateLearningProgress = useCallback(async (courseId, lessonId) => {
    setLoading(true);
    try {
      return await courseService.updateLearningProgress(courseId, lessonId);
    } catch (err) {
      throw new Error(
        getErrorMessage(err) ||
          "Đã có lỗi xảy ra. Vui lòng thử lại."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  return { updateLearningProgress, loading };
};

export const useCompleteLesson = () => {
  const [loading, setLoading] = useState(false);

  const completeLesson = useCallback(async (courseId, lessonId) => {
    setLoading(true);
    try {
      return await courseService.completeLesson(courseId, lessonId);
    } catch (err) {
      throw new Error(
        getErrorMessage(err) ||
          "Đã có lỗi xảy ra. Vui lòng thử lại."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  return { completeLesson, loading };
};

export const useEnrolledCourses = (enabled = true) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!enabled) {
      setCourses([]);
      setLoading(false);
      return;
    }

    const fetchEnrolledCourses = async () => {
      setLoading(true);
      setError("");

      try{
        const data = await courseService.getEnrolledCourses();
        setCourses(data);
      } catch (err) {
        setCourses([]);
        setError(getErrorMessage(err) || "Đã có lỗi xảy ra. Vui lòng thử lại.");
      } finally {
        setLoading(false);
      }
    };

    fetchEnrolledCourses();
  }, [enabled]);

  return { courses, loading, error };
};
