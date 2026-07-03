import { useCallback, useEffect, useState, useRef } from "react";
import { commentService } from "../service/comment.service";
import { getErrorMessage } from "../helpers/error.helper";
import getSocket from "../socket";

// helpers to update tree immutably
const addCommentToTree = (tree, comment) => {
  // comment may be a reply if parentCommentId exists
  if (!comment) return tree;
  const parentId = comment.parentCommentId ? String(comment.parentCommentId) : null;

  if (!parentId) {
    return [...tree, { ...comment, replies: [] }];
  }

  const recurse = (nodes) => {
    return nodes.map((node) => {
      if (String(node._id) === parentId) {
        const nextReplies = Array.isArray(node.replies) ? [...node.replies, { ...comment, replies: [] }] : [{ ...comment, replies: [] }];
        return { ...node, replies: nextReplies, replyCount: (node.replyCount || 0) + 1 };
      }

      if (node.replies && node.replies.length > 0) {
        return { ...node, replies: recurse(node.replies) };
      }

      return node;
    });
  };

  return recurse(tree);
};

const updateCommentInTree = (tree, comment) => {
  if (!comment) return tree;

  const recurse = (nodes) =>
    nodes.map((node) => {
      if (String(node._id) === String(comment._id)) {
        // preserve existing replies if present
        return { ...node, ...comment, replies: node.replies || comment.replies || [] };
      }

      if (node.replies && node.replies.length > 0) {
        return { ...node, replies: recurse(node.replies) };
      }

      return node;
    });

  return recurse(tree);
};

const removeCommentFromTree = (tree, commentId) => {
  const recurse = (nodes) => {
    const result = [];
    for (const node of nodes) {
      if (String(node._id) === String(commentId)) {
        // skip this node (and its subtree)
        continue;
      }

      if (node.replies && node.replies.length > 0) {
        const newReplies = recurse(node.replies);
        // if a direct child was removed, decrement replyCount accordingly
        const removedCount = (node.replies.length - newReplies.length) || 0;
        const updatedNode = { ...node, replies: newReplies };
        if (removedCount > 0) {
          updatedNode.replyCount = Math.max(0, (node.replyCount || 0) - removedCount);
        }
        result.push(updatedNode);
      } else {
        result.push(node);
      }
    }
    return result;
  };

  return recurse(tree);
};

export const useComments = (courseId, lessonId) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const socketRef = useRef(null);

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

  // setup socket on mount for this lesson
  useEffect(() => {
    if (!lessonId) return undefined;

    const socket = getSocket();
    socketRef.current = socket;

    const onCreated = (comment) => {
      setComments((prev) => addCommentToTree(prev, comment));
    };

    const onUpdated = (comment) => {
      setComments((prev) => updateCommentInTree(prev, comment));
    };

    const onDeleted = ({ commentId: deletedId }) => {
      setComments((prev) => removeCommentFromTree(prev, deletedId));
    };

    socket.on("comment:created", onCreated);
    socket.on("comment:updated", onUpdated);
    socket.on("comment:deleted", onDeleted);

    // join the lesson room
    socket.emit("join_lesson", lessonId);

    return () => {
      // leave room and remove listeners
      try {
        socket.emit("leave_lesson", lessonId);
      } catch (e) {
        // ignore
      }
      socket.off("comment:created", onCreated);
      socket.off("comment:updated", onUpdated);
      socket.off("comment:deleted", onDeleted);
    };
  }, [lessonId]);

  const createComment = async (content) => {
    const comment = await commentService.createComment(courseId, lessonId, content);
    // do not fetch; rely on socket event to update local state
    return comment;
  };

  const createReply = async (commentId, content) => {
    const comment = await commentService.createReply(courseId, lessonId, commentId, content);
    return comment;
  };

  const updateComment = async (commentId, content) => {
    const comment = await commentService.updateComment(courseId, lessonId, commentId, content);
    return comment;
  };

  const deleteComment = async (commentId) => {
    await commentService.deleteComment(courseId, lessonId, commentId);
    return;
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
