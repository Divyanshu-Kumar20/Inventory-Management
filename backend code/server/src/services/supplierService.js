const Supplier = require('../models/Supplier');
const { AppError } = require('../middleware/errorHandler');

class SupplierService {
  async getSuppliers(search) {
    const query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    return await Supplier.find(query).sort({ createdAt: -1 });
  }

  async createSupplier(data) {
    return await Supplier.create(data);
  }

  async updateSupplier(id, data) {
    const supplier = await Supplier.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    if (!supplier) throw new AppError('Supplier not found', 404);
    return supplier;
  }

  async deleteSupplier(id) {
    const supplier = await Supplier.findByIdAndDelete(id);
    if (!supplier) throw new AppError('Supplier not found', 404);
    return supplier;
  }
}

module.exports = new SupplierService();
