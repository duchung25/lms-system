import { useCallback, useEffect, useState } from "react";
import { commentService } from "../service/comment.service";
import { getErrorMessage } from "../helpers/error.helper";

export const useComments = (courseId, lessonId) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchComments = useCallback(async () => {
    if (!courseId || !lessonId) {
      setComments([]);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const data = await commentService.getComments(courseId, lessonId);
      setComments(data);
    } catch (err) {
      setComments([]);
      setError(getErrorMessage(err) || "Đã có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  }, [courseId, lessonId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const createComment = async (content) => {
    const comment = await commentService.createComment(courseId, lessonId, content);
    setComments((prev) => [...prev, comment]);
    return comment;
  };

  const updateComment = async (commentId, content) => {
    const comment = await commentService.updateComment(courseId, lessonId, commentId, content);
    setComments((prev) => prev.map((item) => (item._id === comment._id ? comment : item)));
    return comment;
  };

  const deleteComment = async (commentId) => {
    await commentService.deleteComment(courseId, lessonId, commentId);
    setComments((prev) => prev.filter((item) => item._id !== commentId));
  };

  return {
    comments,
    loading,
    error,
    createComment,
    updateComment,
    deleteComment,
    refreshComments: fetchComments,
  };
};
