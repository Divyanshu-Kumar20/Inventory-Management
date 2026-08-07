const supplierService = require('../services/supplierService');
const asyncHandler = require('../utils/asyncHandler');

const getSuppliers = asyncHandler(async (req, res) => {
  const suppliers = await supplierService.getSuppliers(req.query.search);
  res.status(200).json({ success: true, count: suppliers.length, data: suppliers });
});

const createSupplier = asyncHandler(async (req, res) => {
  const supplier = await supplierService.createSupplier(req.body);
  res.status(201).json({ success: true, message: 'Supplier created successfully', data: supplier });
});

const updateSupplier = asyncHandler(async (req, res) => {
  const supplier = await supplierService.updateSupplier(req.params.id, req.body);
  res.status(200).json({ success: true, message: 'Supplier updated successfully', data: supplier });
});

const deleteSupplier = asyncHandler(async (req, res) => {
  await supplierService.deleteSupplier(req.params.id);
  res.status(200).json({ success: true, message: 'Supplier deleted successfully' });
});

module.exports = { getSuppliers, createSupplier, updateSupplier, deleteSupplier };
