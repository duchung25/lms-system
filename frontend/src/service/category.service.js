import categoryApi from "../api/category.api.js";

export const categoryService = {
  // Public

  getCategories: async () => {
    const res = await categoryApi.getCategories();
    return res.data?.data?.list ?? [];
  },

  getCategoryBySlug: async (slug) => {
    const res = await categoryApi.getCategoryBySlug(slug);
    return res.data?.data ?? null;
  },

  // Admin

  getCategoryStats: async () => {
    const res = await categoryApi.getCategoryStats();
    return res.data?.data ?? null;
  },

  createCategory: async (data) => {
    const res = await categoryApi.createCategory(data);
    return res.data?.data ?? null;
  },

  updateCategory: async (id, data) => {
    const res = await categoryApi.updateCategory(id, data);
    return res.data?.data ?? null;
  },

  deleteCategory: async (id) => {
    const res = await categoryApi.deleteCategory(id);
    return res.data?.data ?? null;
  },

  updateCategoryStatus: async (id, data) => {
    const res = await categoryApi.updateCategoryStatus(id, data);
    return res.data?.data ?? null;
  },
};