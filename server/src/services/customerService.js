const Customer = require('../models/Customer');
const { AppError } = require('../middleware/errorHandler');

class CustomerService {
  async getCustomers(search) {
    const query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { city: { $regex: search, $options: 'i' } }
      ];
    }
    return await Customer.find(query).sort({ createdAt: -1 });
  }

  async createCustomer(data) {
    if (data.phone && !data.phone.startsWith('+91')) {
      data.phone = `+91 ${data.phone}`;
    }
    return await Customer.create(data);
  }

  async updateCustomer(id, data) {
    const customer = await Customer.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    if (!customer) throw new AppError('Customer not found', 404);
    return customer;
  }

  async deleteCustomer(id) {
    const customer = await Customer.findByIdAndDelete(id);
    if (!customer) throw new AppError('Customer record not found', 404);
    return customer;
  }
}

module.exports = new CustomerService();
