import { useState, useEffect } from "react";
import { categoryService } from "../service/category.service.js";
import { getErrorMessage } from "../helpers/error.helper.js";

//
// Query Hooks
//

export const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      setError("");

      try {
        const data = await categoryService.getCategories();
        setCategories(data);
      } catch (err) {
        setCategories([]);
        setError(
          getErrorMessage(err) ||
            "Đã có lỗi xảy ra. Vui lòng thử lại."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return { categories, loading, error };
};

export const useCategoryBySlug = (slug) => {
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!slug) {
      setCategory(null);
      return;
    }

    const fetchCategory = async () => {
      setLoading(true);
      setError("");

      try {
        const data = await categoryService.getCategoryBySlug(slug);
        setCategory(data);
      } catch (err) {
        setCategory(null);
        setError(
          getErrorMessage(err) ||
            "Đã có lỗi xảy ra. Vui lòng thử lại."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [slug]);

  return { category, loading, error };
};

export const useCategoryStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError("");

      try {
        const data = await categoryService.getCategoryStats();
        setStats(data);
      } catch (err) {
        setStats(null);
        setError(
          getErrorMessage(err) ||
            "Đã có lỗi xảy ra. Vui lòng thử lại."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return { stats, loading, error };
};

//
// Mutation Hooks
//

export const useCreateCategory = () => {
  const [loading, setLoading] = useState(false);

  const createCategory = async (data) => {
    setLoading(true);

    try {
      return await categoryService.createCategory(data);
    } catch (err) {
      throw new Error(
        getErrorMessage(err) ||
          "Đã có lỗi xảy ra. Vui lòng thử lại."
      );
    } finally {
      setLoading(false);
    }
  };

  return { createCategory, loading };
};

export const useUpdateCategory = () => {
  const [loading, setLoading] = useState(false);

  const updateCategory = async (id, data) => {
    setLoading(true);

    try {
      return await categoryService.updateCategory(id, data);
    } catch (err) {
      throw new Error(
        getErrorMessage(err) ||
          "Đã có lỗi xảy ra. Vui lòng thử lại."
      );
    } finally {
      setLoading(false);
    }
  };

  return { updateCategory, loading };
};

export const useDeleteCategory = () => {
  const [loading, setLoading] = useState(false);

  const deleteCategory = async (id) => {
    setLoading(true);

    try {
      return await categoryService.deleteCategory(id);
    } catch (err) {
      throw new Error(
        getErrorMessage(err) ||
          "Đã có lỗi xảy ra. Vui lòng thử lại."
      );
    } finally {
      setLoading(false);
    }
  };

  return { deleteCategory, loading };
};

export const useUpdateCategoryStatus = () => {
  const [loading, setLoading] = useState(false);

  const updateCategoryStatus = async (id, data) => {
    setLoading(true);

    try {
      return await categoryService.updateCategoryStatus(id, data);
    } catch (err) {
      throw new Error(
        getErrorMessage(err) ||
          "Đã có lỗi xảy ra. Vui lòng thử lại."
      );
    } finally {
      setLoading(false);
    }
  };

  return { updateCategoryStatus, loading };
};