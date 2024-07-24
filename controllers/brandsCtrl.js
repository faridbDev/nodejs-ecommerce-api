import Brand from "../model/Brand.js";
import asyncHandler from 'express-async-handler';

// @desc   Create New Brand
// @route  POST /api/v1/brands
// @access Private/Admin
export const createBrandCtrl = asyncHandler(async (req, res) => {
  const { name } = req.body;
  // check if brand exists
  const brandFound = await Brand.findOne({ name });
  if (brandFound) {
    throw new Error("Brand Already exists");
  }
  // create
  const brand = await Brand.create({ name: name.toLowerCase(), user: req.userAuthId });
  res.status(201).json({ status: "success", message: "Brand Created Successfully", brand });
});

// @desc   Get All Brands
// @route  GET /api/v1/brands
// @access Public
export const getAllBrandsCtrl = asyncHandler(async (req, res) => {
  const brands = await Brand.find();
  res.status(200).json({ status: "success", message: "Brands Fetched Successfully", brands });
});

// @desc   Get Single Brand
// @route  GET /api/v1/brands/:id
// @access Public
export const getSingleBrandCtrl = asyncHandler(async (req, res) => {
  const brand = await Brand.findById(req.params.id);
  res.status(200).json({ status: "success", message: "Brand Fetched Successfully", brand });
});

// @desc   Update Brand
// @route  PUT /api/v1/brands/:id/update
// @access Private/Admin
export const updateBrandCtrl = asyncHandler(async (req, res) => {
  const { name } = req.body;
  // update
  const brand = await Brand.findByIdAndUpdate(req.params.id, { name: name.toLowerCase() }, { new: true });
  res.status(200).json({ status: "success", message: "Brand Updated Successfully", brand });
});

// @desc   Delete Brand
// @route  DELETE /api/v1/brands/:id/delete
// @access Private/Admin
export const deleteBrandCtrl = asyncHandler(async (req, res) => {
  const brandFound = await Brand.findById(req.params.id);
  if (!brandFound) {
    throw new Error("Brand Not Found");
  }
  await Brand.findByIdAndDelete(req.params.id);
  res.status(200).json({ status: "success", message: "Brand Deleted Successfully"});
});