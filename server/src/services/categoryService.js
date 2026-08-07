const Category = require('../models/Category');
const { AppError } = require('../middleware/errorHandler');

class CategoryService {
  async getCategories() {
    return await Category.find().sort({ name: 1 });
  }

  async createCategory(data) {
    const existing = await Category.findOne({ name: { $regex: new RegExp(`^${data.name}$`, 'i') } });
    if (existing) {
      throw new AppError(`Category '${data.name}' already exists. Duplicate categories are not allowed.`, 400);
    }
    return await Category.create(data);
  }

  async updateCategory(id, data) {
    const category = await Category.findById(id);
    if (!category) throw new AppError('Category not found', 404);
    Object.assign(category, data);
    return await category.save();
  }

  async deleteCategory(id) {
    const category = await Category.findByIdAndDelete(id);
    if (!category) throw new AppError('Category not found', 404);
    return category;
  }
}

module.exports = new CategoryService();
