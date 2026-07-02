import categoryService from "../services/categoryService.js";
import AppError from "../utils/AppError.js";

const categoryController = {
  async createCategory(req, res, next) {
    try {
      const category = await categoryService.createCategory(req.body);

      res.status(201).json({
        status: "success",
        data: category,
      });
    } catch (error) {
      next(error);
    }
  },

  async getAllCategories(req, res, next) {
    try {
      const result = await categoryService.getAllCategories(req.query);

      res.status(200).json({
        status: "success",
        data:  result ,
      });
    } catch (error) {
      next(error);
    }
  },

  async getCategoryBySlug(req, res, next) {
    try {
      const category = await categoryService.getCategoryBySlug(req.params.slug);

      res.status(200).json({
        status: "success",
        data: category,
      });
    } catch (error) {
      next(error);
    }
  },

  async updateCategory(req, res, next) {
    try {
      const category = await categoryService.updateCategory(
        req.params.id,
        req.body
      );

      res.status(200).json({
        status: "success",
        data: category,
      });
    } catch (error) {
      next(error);
    }
  },

  async deleteCategory(req, res, next) {
    try {
      await categoryService.deleteCategory(req.params.id);

      res.status(200).json({
        status: "success",
        message: "Category deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  },

  async updateCategoryStatus(req, res, next) {
    try {
      const { status } = req.body;

      if (!status) {
        throw new AppError("Please provide status", 400);
      }

      const category = await categoryService.updateCategoryStatus(
        req.params.id,
        status
      );

      res.status(200).json({
        status: "success",
        data: category,
      });
    } catch (error) {
      next(error);
    }
  },

  async getCategoryStats(req, res, next) {
    try {
      const stats = await categoryService.getCategoryStats();

      res.status(200).json({
        status: "success",
        data: stats,
      });
    } catch (error) {
      next(error);
    }
  },
};

export default categoryController;