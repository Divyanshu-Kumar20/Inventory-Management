const Product = require('../models/Product');

/**
 * Service Layer: Encapsulates all Database Queries & Business Logic
 * (No Express req/res objects here)
 */
class ProductService {
  async getAllProducts(filters = {}, options = {}) {
    const query = {};
    if (filters.category) query.category = filters.category;
    if (filters.status) query.status = filters.status;
    if (filters.search) {
      query.$or = [
        { name: { $regex: filters.search, $options: 'i' } },
        { sku: { $regex: filters.search, $options: 'i' } }
      ];
    }

    return await Product.find(query).sort({ createdAt: -1 });
  }

  async getProductById(id) {
    return await Product.findById(id);
  }

  async createProduct(productData) {
    const product = new Product(productData);
    return await product.save();
  }

  async updateProduct(id, updateData) {
    const product = await Product.findById(id);
    if (!product) return null;

    Object.assign(product, updateData);
    return await product.save();
  }

  async deleteProduct(id) {
    return await Product.findByIdAndDelete(id);
  }
}

module.exports = new ProductService();
