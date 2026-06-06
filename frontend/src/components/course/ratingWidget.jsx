import { useState } from "react";
import { FaStar } from "react-icons/fa6";
import { useAuth } from "../../auth/useAuth";
import { useRating } from "../../hook/useRating";

const StarRow = ({ value, onSelect, disabled }) => {
  return (
    <div className="d-flex gap-1">
      {Array.from({ length: 5 }, (_, index) => {
        const starValue = index + 1;
        const filled = starValue <= value;

        return (
          <button
            key={starValue}
            type="button"
            className="btn p-0 border-0 bg-transparent"
            onClick={() => onSelect(starValue)}
            disabled={disabled}
            aria-label={`Rate ${starValue} star${starValue > 1 ? "s" : ""}`}
          >
            <FaStar
              size={22}
              color={filled ? "#f5b301" : "#d7d7d7"}
              style={{ opacity: disabled ? 0.6 : 1 }}
            />
          </button>
        );
      })}
    </div>
  );
};

export default function RatingWidget({
  courseId,
  averageRating = 0,
  ratingCount = 0,
  initialRating = null,
  isEnrolled = false,
  onRatingSaved,
}) {
  const { user } = useAuth();
  const { saveRating, loading, error } = useRating();
  const [rating, setRating] = useState(Number(initialRating || 0));
  const isStudent = user?.role === "student";

  const handleSave = async () => {
    const result = await saveRating(courseId, rating);
    onRatingSaved?.(result);
  };

  const canRate = isStudent && isEnrolled;

  return (
    <div className="border p-3 rounded bg-white shadow-sm mt-3">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <strong>Course rating</strong>
        <span className="text-muted small">
          {ratingCount} rating{ratingCount === 1 ? "" : "s"}
        </span>
      </div>

      <div className="d-flex align-items-center gap-2 mb-2">
        <span className="fw-semibold">{Number(averageRating || 0).toFixed(1)}</span>
        <span className="text-muted small">average rating</span>
      </div>

      <div className="mb-2">
        <StarRow value={rating} onSelect={setRating} disabled={!canRate || loading} />
      </div>

      {canRate ? (
        <button
          type="button"
          className="btn btn-outline-primary btn-sm"
          onClick={handleSave}
          disabled={!rating || loading}
        >
          {loading ? "Saving..." : initialRating ? "Update rating" : "Save rating"}
        </button>
      ) : isStudent ? (
        <div className="text-muted small">Enroll in the course to rate it.</div>
      ) : (
        <div className="text-muted small">Only students can rate courses.</div>
      )}

      {error && <div className="alert alert-danger py-2 mt-2 mb-0">{error}</div>}
    </div>
  );
}
