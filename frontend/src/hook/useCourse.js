import { useEffect, useState } from "react";
import { courseService } from "../service/course.service";

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
        setError(err.message || "Failed to fetch courses");
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
    if(!courseId) {
      setCourse(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError("");

      try {
        const result = await courseService.getCourseDetail(courseId);
        setCourse(result);
      }catch (err) {
        setCourse(null);
        setError(err.message || "Failed to fetch course details");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    },[courseId]);

  return { course, loading, error };
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
    setThumbnailFile(file);
    setThumbnailPreview(URL.createObjectURL(file));
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
  const [error, setError] = useState("");

  const createCourse = async (courseData) => {
    setLoading(true);
    setError("");
    try{
      const course = await courseService.createCourse(courseData);
      return course;
    }catch (err) {
      setError(err.message || "Failed to create course");
      return null;
    }finally {
      setLoading(false);
    }
  };
  return { createCourse, loading, error };
}

export const useUpdateCourse = (courseId) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const updateCourse = async (updateData) => {
    if (!courseId) throw new Error("courseId is required");
    setLoading(true);
    setError("");
    try {
      return await courseService.updateCourse(courseId, updateData);
    } catch (err) {
      const message = err.message || "Failed to update course";
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  return { updateCourse, loading, error };
};


  