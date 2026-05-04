import { useEffect, useState } from "react";
import { lessonService } from "../service/lesson.service";
import { getErrorMessage } from "../helpers/error.helper";

export const useLessons = (courseId) => {
  const [lessons, setLessons] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!courseId) return;

    const fetchData = async () => {
      setLoading(true);
      setError("");

      try {
        const result = await lessonService.getLessons(courseId);
        setLessons(result.list);
        setTotal(result.total);
      } catch (err) {
        setLessons([]);
        setError(
          getErrorMessage(err) ||
            "Đã có lỗi xảy ra. Vui lòng thử lại."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [courseId]);

  return { lessons, total, loading, error };
};

export const useLessonDetail = (courseId, lessonId) => {
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!courseId || !lessonId) {
      setLesson(null);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError("");

      try {
        const result = await lessonService.getLesson(courseId, lessonId);
        setLesson(result);
      } catch (err) {
        setLesson(null);
        setError(
          getErrorMessage(err) ||
            "Đã có lỗi xảy ra. Vui lòng thử lại."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [courseId, lessonId]);

  return { lesson, loading, error };
};

export const useCreateLesson = () => {
  const [loading, setLoading] = useState(false);

  const createLesson = async (courseId, lessonData) => {
    setLoading(true);
    try {
      return await lessonService.createLesson(courseId, lessonData);
    } catch (err) {
      throw new Error(
        getErrorMessage(err) ||
          "Đã có lỗi xảy ra. Vui lòng thử lại."
      );
    } finally {
      setLoading(false);
    }
  };

  return { createLesson, loading };
};

export const useUpdateLesson = () => {
  const [loading, setLoading] = useState(false);

  const updateLesson = async (courseId, lessonId, updateData) => {
    setLoading(true);
    try {
      return await lessonService.updateLesson(
        courseId,
        lessonId,
        updateData
      );
    } catch (err) {
      throw new Error(
        getErrorMessage(err) ||
          "Đã có lỗi xảy ra. Vui lòng thử lại."
      );
    } finally {
      setLoading(false);
    }
  };

  return { updateLesson, loading };
};

export const useDeleteLesson = () => {
  const [loading, setLoading] = useState(false);

  const deleteLesson = async (courseId, lessonId) => {
    setLoading(true);
    try {
      return await lessonService.deleteLesson(courseId, lessonId);
    } catch (err) {
      throw new Error(
        getErrorMessage(err) ||
          "Đã có lỗi xảy ra. Vui lòng thử lại."
      );
    } finally {
      setLoading(false);
    }
  };

  return { deleteLesson, loading };
};