import { useState } from "react";
import { ratingService } from "../service/rating.service";
import { getErrorMessage } from "../helpers/error.helper";

export const useRating = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const saveRating = async (courseId, rating) => {
    setLoading(true);
    setError("");

    try {
      return await ratingService.upsertRating(courseId, rating);
    } catch (err) {
      const message = getErrorMessage(err) || "Đã có lỗi xảy ra. Vui lòng thử lại.";
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  return { saveRating, loading, error };
};
