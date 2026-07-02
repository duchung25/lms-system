import apiClient from "./apiClient";

const categoryApi = {
  getCategories: () => {
    return apiClient.get("/categories");
  },

  getCategoryBySlug: (slug) => {
    return apiClient.get(`/categories/${slug}`);
  },

  getCategoryStats: () => {
    return apiClient.get("/categories/stats/summary");
  },

  createCategory: (data) => {
    return apiClient.post("/categories", data);
  },

  updateCategory: (id, data) => {
    return apiClient.put(`/categories/${id}`, data);
  },

  deleteCategory: (id) => {
    return apiClient.delete(`/categories/${id}`);
  },

  updateCategoryStatus: (id, data) => {
    return apiClient.patch(`/categories/${id}/status`, data);
  },
};

export default categoryApi;