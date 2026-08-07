const customerService = require('../services/customerService');
const asyncHandler = require('../utils/asyncHandler');

const getCustomers = asyncHandler(async (req, res) => {
  const customers = await customerService.getCustomers(req.query.search);
  res.status(200).json({ success: true, count: customers.length, data: customers });
});

const createCustomer = asyncHandler(async (req, res) => {
  const customer = await customerService.createCustomer(req.body);
  res.status(201).json({ success: true, message: 'Customer registered successfully', data: customer });
});

const updateCustomer = asyncHandler(async (req, res) => {
  const customer = await customerService.updateCustomer(req.params.id, req.body);
  res.status(200).json({ success: true, message: 'Customer updated successfully', data: customer });
});

const deleteCustomer = asyncHandler(async (req, res) => {
  await customerService.deleteCustomer(req.params.id);
  res.status(200).json({ success: true, message: 'Customer record removed successfully' });
});

module.exports = { getCustomers, createCustomer, updateCustomer, deleteCustomer };
