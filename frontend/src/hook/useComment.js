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
    await fetchComments();
    return comment;
  };

  const createReply = async (commentId, content) => {
    const comment = await commentService.createReply(courseId, lessonId, commentId, content);
    await fetchComments();
    return comment;
  };

  const updateComment = async (commentId, content) => {
    const comment = await commentService.updateComment(courseId, lessonId, commentId, content);
    await fetchComments();
    return comment;
  };

  const deleteComment = async (commentId) => {
    await commentService.deleteComment(courseId, lessonId, commentId);
    await fetchComments();
  };

  return {
    comments,
    loading,
    error,
    createComment,
    createReply,
    updateComment,
    deleteComment,
    refreshComments: fetchComments,
  };
};
