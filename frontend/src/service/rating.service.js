import { ratingApi } from "../api/rating.api";

export const ratingService = {
  async upsertRating(courseId, rating) {
    const res = await ratingApi.upsertRating(courseId, { rating });
    return res.data?.data ?? null;
  },
  async getRatingByCourse(courseId) {
    const res = await ratingApi.getRatingByCourse(courseId);
    return res.data?.data ?? null;
  },
};
