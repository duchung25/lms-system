import { useMemo, useState } from "react";
import {
  FiChevronDown,
  FiChevronUp,
  FiCornerDownRight,
  FiEdit2,
  FiMessageCircle,
  FiTrash2,
} from "react-icons/fi";

import { useAuth } from "../../auth/useAuth";
import { useComments } from "../../hook/useComment";

const formatRelativeTime = (value) => {
  if (!value) return "";

  const diffMs = Date.now() - new Date(value).getTime();
  const diffMinutes = Math.round(diffMs / 60000);
  const diffHours = Math.round(diffMinutes / 60);
  const diffDays = Math.round(diffHours / 24);
  const diffMonths = Math.round(diffDays / 30);
  const diffYears = Math.round(diffDays / 365);

  if (Math.abs(diffMinutes) < 60) {
    return diffMinutes <= 1 ? "Vừa xong" : `${diffMinutes} phút trước`;
  }

  if (Math.abs(diffHours) < 24) {
    return diffHours <= 1 ? "1 giờ trước" : `${diffHours} giờ trước`;
  }

  if (Math.abs(diffDays) < 30) {
    return diffDays <= 1 ? "Hôm qua" : `${diffDays} ngày trước`;
  }

  if (Math.abs(diffMonths) < 12) {
    return diffMonths <= 1 ? "1 tháng trước" : `${diffMonths} tháng trước`;
  }

  return diffYears <= 1 ? "1 năm trước" : `${diffYears} năm trước`;
};

const roleCanReply = (role) => ["student", "teacher", "admin"].includes(role);

const CommentNode = ({
  comment,
  depth,
  currentUser,
  myUserId,
  editingCommentId,
  editingContent,
  replyingCommentId,
  replyContent,
  collapsedReplies,
  onStartEdit,
  onChangeEdit,
  onSaveEdit,
  onCancelEdit,
  onStartReply,
  onChangeReply,
  onSendReply,
  onDelete,
  onToggleReplies,
}) => {
  const authorId = comment.authorId?._id || comment.authorId;
  const isOwner = Boolean(myUserId && authorId && myUserId === authorId);
  const isEditing = editingCommentId === comment._id;
  const isReplying = replyingCommentId === comment._id;
  const canDelete = isOwner || ["teacher", "admin"].includes(currentUser?.role);
  const canReply = Boolean(currentUser) && roleCanReply(currentUser.role);
  const replies = Array.isArray(comment.replies) ? comment.replies : [];
  const hasReplies = replies.length > 0 || (comment.replyCount || 0) > 0;
  const isCollapsed = collapsedReplies[comment._id] ?? false;

  return (
    <div className={`lesson-comment-thread${depth > 0 ? " is-reply" : ""}`} style={{ marginLeft: depth > 0 ? 24 : 0 }}>
      <div className="lesson-comment-card">
        <div className="lesson-comment-head">
          <div className="lesson-comment-author">
            <div className="lesson-comment-avatar">
              {(comment.authorName || "U").slice(0, 1).toUpperCase()}
            </div>
            <div>
              <div className="lesson-comment-meta">
                <strong>{comment.authorName || comment.authorId?.username || "Unknown"}</strong>
                <span>{formatRelativeTime(comment.createdAt)}</span>
                {comment.editedAt && <span className="lesson-comment-edited">Đã chỉnh sửa</span>}
              </div>
              <div className="lesson-comment-role">{comment.authorRole || "student"}</div>
            </div>
          </div>

          <div className="lesson-comment-actions">
            {isOwner && currentUser?.role === "student" && !isEditing && (
              <button
                type="button"
                className="lesson-comment-action-btn"
                onClick={() => onStartEdit(comment)}
              >
                <FiEdit2 />
                Sửa
              </button>
            )}
            {canDelete && (
              <button
                type="button"
                className="lesson-comment-action-btn danger"
                onClick={() => onDelete(comment._id)}
              >
                <FiTrash2 />
                Xóa
              </button>
            )}
          </div>
        </div>

        {isEditing ? (
          <div className="lesson-comment-editor">
            <textarea
              className="lesson-comment-textarea"
              rows={3}
              value={editingContent}
              onChange={(event) => onChangeEdit(event.target.value)}
            />
            <div className="lesson-comment-editor-actions">
              <button
                type="button"
                className="lesson-comment-primary-btn"
                onClick={() => onSaveEdit(comment._id)}
              >
                Lưu
              </button>
              <button
                type="button"
                className="lesson-comment-secondary-btn"
                onClick={onCancelEdit}
              >
                Hủy
              </button>
            </div>
          </div>
        ) : (
          <div className="lesson-comment-content">
            {comment.content}
          </div>
        )}

        <div className="lesson-comment-footer">
          <div className="lesson-comment-footer-actions">
            {canReply && (
              <button
                type="button"
                className="lesson-comment-reply-link"
                onClick={() => onStartReply(comment)}
              >
                <FiCornerDownRight />
                Trả lời
              </button>
            )}

            {hasReplies && (
              <button
                type="button"
                className="lesson-comment-expand-btn"
                onClick={() => onToggleReplies(comment._id)}
              >
                {isCollapsed ? <FiChevronDown /> : <FiChevronUp />}
                {isCollapsed ? "Expand Replies" : "Collapse Replies"}
                <span className="lesson-comment-reply-count">{comment.replyCount || replies.length}</span>
              </button>
            )}
          </div>

          {canReply && (
            <span className="lesson-comment-inline-hint">
              <FiMessageCircle />
              Nhấn Trả lời để phản hồi ngay dưới bình luận này
            </span>
          )}
        </div>

        {isReplying && (
          <form
            className="lesson-comment-reply-form"
            onSubmit={(event) => onSendReply(comment._id, event)}
          >
            <textarea
              className="lesson-comment-textarea"
              rows={3}
              value={replyContent}
              onChange={(event) => onChangeReply(event.target.value)}
              placeholder={`Trả lời ${comment.authorName || "bình luận"}...`}
            />
            <div className="lesson-comment-editor-actions">
              <button type="submit" className="lesson-comment-primary-btn">
                Gửi trả lời
              </button>
              <button
                type="button"
                className="lesson-comment-secondary-btn"
                onClick={onCancelEdit}
              >
                Hủy
              </button>
            </div>
          </form>
        )}
      </div>

      {hasReplies && !isCollapsed && replies.length > 0 && (
        <div className="lesson-comment-children">
          {replies.map((reply) => (
            <CommentNode
              key={reply._id}
              comment={reply}
              depth={depth + 1}
              currentUser={currentUser}
              myUserId={myUserId}
              editingCommentId={editingCommentId}
              editingContent={editingContent}
              replyingCommentId={replyingCommentId}
              replyContent={replyContent}
              collapsedReplies={collapsedReplies}
              onStartEdit={onStartEdit}
              onChangeEdit={onChangeEdit}
              onSaveEdit={onSaveEdit}
              onCancelEdit={onCancelEdit}
              onStartReply={onStartReply}
              onChangeReply={onChangeReply}
              onSendReply={onSendReply}
              onDelete={onDelete}
              onToggleReplies={onToggleReplies}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default function CommentSection({ courseId, lessonId }) {
  const { user } = useAuth();
  const {
    comments,
    loading,
    error,
    createComment,
    createReply,
    updateComment,
    deleteComment,
  } = useComments(courseId, lessonId);

  const [content, setContent] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingContent, setEditingContent] = useState("");
  const [replyingCommentId, setReplyingCommentId] = useState(null);
  const [replyContent, setReplyContent] = useState("");
  const [actionError, setActionError] = useState("");
  const [actionMessage, setActionMessage] = useState("");
  const [collapsedReplies, setCollapsedReplies] = useState({});

  const isStudent = user?.role === "student";
  const myUserId = useMemo(() => user?._id || user?.id || "", [user]);

  const clearTransientState = () => {
    setActionError("");
    setActionMessage("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const trimmed = content.trim();

    if (!trimmed) {
      setActionError("Comment content is required");
      return;
    }

    try {
      clearTransientState();
      await createComment(trimmed);
      setContent("");
      setActionMessage("Đã đăng bình luận");
    } catch (err) {
      setActionError(err.message);
    }
  };

  const handleEdit = (comment) => {
    setEditingCommentId(comment._id);
    setEditingContent(comment.content || "");
    setReplyingCommentId(null);
    setReplyContent("");
    clearTransientState();
  };

  const handleUpdate = async (commentId) => {
    const trimmed = editingContent.trim();

    if (!trimmed) {
      setActionError("Comment content is required");
      return;
    }

    try {
      clearTransientState();
      await updateComment(commentId, trimmed);
      setEditingCommentId(null);
      setEditingContent("");
      setActionMessage("Đã cập nhật bình luận");
    } catch (err) {
      setActionError(err.message);
    }
  };

  const handleDelete = async (commentId) => {
    try {
      clearTransientState();
      await deleteComment(commentId);
      setActionMessage("Đã xóa bình luận");
    } catch (err) {
      setActionError(err.message);
    }
  };

  const handleStartReply = (comment) => {
    setReplyingCommentId(comment._id);
    setReplyContent("");
    setEditingCommentId(null);
    setEditingContent("");
    clearTransientState();
  };

  const handleSendReply = async (commentId, event) => {
    event.preventDefault();

    const trimmed = replyContent.trim();
    if (!trimmed) {
      setActionError("Reply content is required");
      return;
    }

    try {
      clearTransientState();
      await createReply(commentId, trimmed);
      setReplyingCommentId(null);
      setReplyContent("");
      setActionMessage("Đã gửi trả lời");
    } catch (err) {
      setActionError(err.message);
    }
  };

  const handleToggleReplies = (commentId) => {
    setCollapsedReplies((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };

  return (
    <div className="card border-0 shadow-sm mt-4 lesson-comments-card">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h5 className="mb-1">Discussion</h5>
            <div className="text-muted small">Hỗ trợ comment dạng cây, reply trực tiếp bên dưới từng bình luận</div>
          </div>
          <span className="text-muted small">{comments.length} top-level</span>
        </div>

        {loading && <div className="text-muted small mb-3">Loading comments...</div>}
        {error && <div className="alert alert-danger py-2">{error}</div>}
        {actionError && <div className="alert alert-danger py-2">{actionError}</div>}
        {actionMessage && <div className="alert alert-success py-2">{actionMessage}</div>}

        {isStudent ? (
          <form onSubmit={handleSubmit} className="lesson-comment-compose">
            <label className="form-label fw-medium">Add a comment</label>
            <textarea
              className="lesson-comment-textarea"
              rows="3"
              value={content}
              onChange={(event) => setContent(event.target.value)}
              placeholder="Write your thoughts about this lesson..."
            />
            <button type="submit" className="lesson-comment-primary-btn align-self-end">
              Post Comment
            </button>
          </form>
        ) : (
          <div className="alert alert-info py-2 mb-4">
            Students can create top-level comments. Teachers and admins can reply, delete, and moderate.
          </div>
        )}

        <div className="lesson-comment-list">
          {comments.length === 0 ? (
            <div className="text-muted">No comments yet.</div>
          ) : (
            comments.map((comment) => (
              <CommentNode
                key={comment._id}
                comment={comment}
                depth={0}
                currentUser={user}
                myUserId={myUserId}
                editingCommentId={editingCommentId}
                editingContent={editingContent}
                replyingCommentId={replyingCommentId}
                replyContent={replyContent}
                collapsedReplies={collapsedReplies}
                onStartEdit={handleEdit}
                onChangeEdit={setEditingContent}
                onSaveEdit={handleUpdate}
                onCancelEdit={() => {
                  setEditingCommentId(null);
                  setEditingContent("");
                  setReplyingCommentId(null);
                  setReplyContent("");
                }}
                onStartReply={handleStartReply}
                onChangeReply={setReplyContent}
                onSendReply={handleSendReply}
                onDelete={handleDelete}
                onToggleReplies={handleToggleReplies}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
