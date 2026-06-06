import { useCallback, useEffect, useState } from "react";
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

export const useUnlockedLessons = (courseId, enabled = true) => {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchLessons = useCallback(async () => {
    if (!courseId || !enabled) {
      setLessons([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const data = await lessonService.getUnlockedLessons(courseId);
      setLessons(data);
    } catch (err) {
      setLessons([]);
      setError(getErrorMessage(err) || "Đã có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  }, [courseId, enabled]);

  useEffect(() => {
    fetchLessons();
  }, [fetchLessons]);

  return { lessons, loading, error, refreshLessons: fetchLessons };
};

export const useCourseProgress = (courseId, enabled = true) => {
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchProgress = useCallback(async () => {
    if (!courseId || !enabled) {
      setProgress(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const data = await lessonService.getCourseProgress(courseId);
      setProgress(data);
    } catch (err) {
      setProgress(null);
      setError(getErrorMessage(err) || "Đã có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  }, [courseId, enabled]);

  useEffect(() => {
    fetchProgress();
  }, [fetchProgress]);

  return { progress, loading, error, refreshProgress: fetchProgress };
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