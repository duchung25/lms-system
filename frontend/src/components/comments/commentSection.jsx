import { useMemo, useState } from "react";
import { useAuth } from "../../auth/useAuth";
import { useComments } from "../../hook/useComment";

const formatDate = (value) => {
  if (!value) return "";
  return new Date(value).toLocaleDateString("vi-VN");
};

export default function CommentSection({ courseId, lessonId }) {
  const { user } = useAuth();
  const { comments, loading, error, createComment, updateComment, deleteComment } = useComments(courseId, lessonId);
  const [content, setContent] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingContent, setEditingContent] = useState("");
  const [actionError, setActionError] = useState("");
  const [actionMessage, setActionMessage] = useState("");

  const isStudent = user?.role === "student";

  const myUserId = useMemo(() => user?._id || user?.id || "", [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = content.trim();
    if (!trimmed) {
      setActionError("Comment content is required");
      return;
    }

    try {
      setActionError("");
      setActionMessage("");
      await createComment(trimmed);
      setContent("");
      setActionMessage("Comment posted successfully");
    } catch (err) {
      setActionError(err.message);
    }
  };

  const handleEdit = (comment) => {
    setEditingCommentId(comment._id);
    setEditingContent(comment.content || "");
    setActionError("");
    setActionMessage("");
  };

  const handleUpdate = async (commentId) => {
    const trimmed = editingContent.trim();
    if (!trimmed) {
      setActionError("Comment content is required");
      return;
    }

    try {
      setActionError("");
      setActionMessage("");
      await updateComment(commentId, trimmed);
      setEditingCommentId(null);
      setEditingContent("");
      setActionMessage("Comment updated successfully");
    } catch (err) {
      setActionError(err.message);
    }
  };

  const handleDelete = async (commentId) => {
    try {
      setActionError("");
      setActionMessage("");
      await deleteComment(commentId);
      setActionMessage("Comment deleted successfully");
    } catch (err) {
      setActionError(err.message);
    }
  };

  return (
    <div className="card border-0 shadow-sm mt-4">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="mb-0">Comments</h5>
          <span className="text-muted small">{comments.length} comments</span>
        </div>

        {loading && <div className="text-muted small mb-3">Loading comments...</div>}
        {error && <div className="alert alert-danger py-2">{error}</div>}
        {actionError && <div className="alert alert-danger py-2">{actionError}</div>}
        {actionMessage && <div className="alert alert-success py-2">{actionMessage}</div>}

        {isStudent ? (
          <form onSubmit={handleSubmit} className="mb-4">
            <label className="form-label fw-medium">Add a comment</label>
            <textarea
              className="form-control"
              rows="3"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your thoughts about this lesson..."
            />
            <button type="submit" className="btn btn-primary mt-3">
              Post Comment
            </button>
          </form>
        ) : (
          <div className="alert alert-info py-2">Comments can be posted by students only.</div>
        )}

        <div className="d-flex flex-column gap-3">
          {comments.length === 0 ? (
            <div className="text-muted">No comments yet.</div>
          ) : (
            comments.map((comment) => {
              const authorId = comment.authorId?._id || comment.authorId;
              const isOwner = Boolean(myUserId && authorId && myUserId === authorId);
              const canDelete = isOwner || ["teacher", "admin"].includes(user?.role);
              const isEditing = editingCommentId === comment._id;

              return (
                <div key={comment._id} className="border rounded p-3">
                  <div className="d-flex justify-content-between gap-2 mb-2">
                    <div>
                      <div className="fw-semibold">{comment.authorName || comment.authorId?.username || "Unknown"}</div>
                      <div className="text-muted small">{formatDate(comment.createdAt)}</div>
                    </div>
                    <div className="d-flex gap-2">
                      {isOwner && isStudent && !isEditing && (
                        <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => handleEdit(comment)}>
                          Edit
                        </button>
                      )}
                      {canDelete && (
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDelete(comment._id)}
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </div>

                  {isEditing ? (
                    <div>
                      <textarea
                        className="form-control"
                        rows="3"
                        value={editingContent}
                        onChange={(e) => setEditingContent(e.target.value)}
                      />
                      <div className="d-flex gap-2 mt-2">
                        <button type="button" className="btn btn-primary btn-sm" onClick={() => handleUpdate(comment._id)}>
                          Save
                        </button>
                        <button
                          type="button"
                          className="btn btn-outline-secondary btn-sm"
                          onClick={() => {
                            setEditingCommentId(null);
                            setEditingContent("");
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="mb-0" style={{ whiteSpace: "pre-line" }}>
                      {comment.content}
                    </p>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
