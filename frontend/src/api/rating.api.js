import apiClient from "./apiClient";

export const ratingApi = {
  upsertRating: (courseId, payload) => {
    return apiClient.post(`/courses/${courseId}/ratings`, payload);
  },
};
