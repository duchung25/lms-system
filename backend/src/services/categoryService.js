import Category from '../models/Category.js';
import Course from '../models/Course.js';
import AppError from '../utils/AppError.js';

const categoryService = {
    async createCategory(categoryData) {
        return await Category.create(categoryData);
    },

    async getAllCategories(options = {}) {
        const { status, sort = '-createdAt', page, limit } = options;
        const filter = {};
        
        if (status && status !== 'all') {
            filter.status = status;
        }

        const sortOpt = {};
        if (sort.startsWith('-')) {
            sortOpt[sort.slice(1)] = -1;
        } else {
            sortOpt[sort] = 1;
        }

        if (page && limit) {
            const skip = (page - 1) * limit;
            const [list, total] = await Promise.all([
                Category.find(filter).sort(sortOpt).skip(skip).limit(Number(limit)),
                Category.countDocuments(filter)
            ]);
            return { list, total, page: Number(page), limit: Number(limit), totalPages: Math.ceil(total / limit) };
        }

        const list = await Category.find(filter).sort(sortOpt);
        return { list, total: list.length };
    },

    async getCategoryBySlug(slug) {
        const category = await Category.findOne({ slug });
        if (!category) throw new AppError("Category not found", 404);
        return category;
    },

    async updateCategory(id, updateData) {
        const category = await Category.findById(id);
        if (!category) throw new AppError("Category not found", 404);

        const allowedFields = ["name", "description", "image", "status"];
        for (const key of allowedFields) {
            if (key in updateData) {
                category[key] = updateData[key];
            }
        }
        
        await category.save();
        return category;
    },

    async deleteCategory(id) {
        const category = await Category.findById(id);
        if (!category) throw new AppError("Category not found", 404);

        const courseCount = await Course.countDocuments({ categoryId: id });
        if (courseCount > 0) {
            throw new AppError("Cannot delete category because it has courses linked to it.", 409);
        }

        await Category.delete({ _id: id });
        return { message: "Category deleted successfully" };
    },

    async updateCategoryStatus(id, status) {
        const category = await Category.findById(id);
        if (!category) throw new AppError("Category not found", 404);
        
        if (!['ACTIVE', 'INACTIVE'].includes(status)) {
            throw new AppError("Invalid status", 400);
        }

        category.status = status;
        await category.save();
        return category;
    },

    async getCategoryStats() {
        const stats = await Course.aggregate([
            {
                $group: {
                    _id: "$categoryId",
                    courseCount: { $sum: 1 }
                }
            },
            {
                $lookup: {
                    from: "categories",
                    localField: "_id",
                    foreignField: "_id",
                    as: "categoryDetails"
                }
            },
            {
                $unwind: "$categoryDetails"
            },
            {
                $project: {
                    _id: 1,
                    name: "$categoryDetails.name",
                    slug: "$categoryDetails.slug",
                    status: "$categoryDetails.status",
                    courseCount: 1
                }
            },
            {
                $sort: { courseCount: -1 }
            }
        ]);
        return stats;
    }
};

export default categoryService;
