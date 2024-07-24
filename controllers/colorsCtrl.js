import Color from '../model/Color.js';
import asyncHandler from 'express-async-handler';


// @desc   Create New Color
// @route  POST /api/v1/colors
// @access Private/Admin
export const createColorCtrl = asyncHandler(async (req, res) => {
  const { name } = req.body;
  // check if brand exists
  const colorFound = await Color.findOne({ name });
  if (colorFound) {
    throw new Error("Color Already exists");
  }
  // create
  const color = await Color.create({ name: name.toLowerCase(), user: req.userAuthId });
  res.status(201).json({ status: "success", message: "Color Created Successfully", color });
});

// @desc   Get All Colors
// @route  GET /api/v1/colors
// @access Public
export const getAllColorsCtrl = asyncHandler(async (req, res) => {
  const colors = await Color.find();
  res.status(200).json({ status: "success", message: "Colors Fetched Successfully", colors });
});

// @desc   Get Single Color
// @route  GET /api/v1/colors/:id
// @access Public
export const getSingleColorCtrl = asyncHandler(async (req, res) => {
  const color = await Color.findById(req.params.id);
  res.status(200).json({ status: "success", message: "Color Fetched Successfully", color });
});

// @desc   Update Color
// @route  PUT /api/v1/colors/:id/update
// @access Private/Admin
export const updateColorCtrl = asyncHandler(async (req, res) => {
  const { name } = req.body;
  // update
  const color = await Color.findByIdAndUpdate(req.params.id, { name: name.toLowerCase() }, { new: true });
  res.status(200).json({ status: "success", message: "Color Updated Successfully", color });
});

// @desc   Delete Color
// @route  DELETE /api/v1/colors/:id/update
// @access Private/Admin
export const deleteColorCtrl = asyncHandler(async (req, res) => {
  const colorFound = await Color.findById(req.params.id);
  if (!colorFound) {
    throw new Error("Color Not Found");
  }
  await Color.findByIdAndDelete(req.params.id);
  res.status(200).json({ status: "success", message: "Color Deleted Successfully"});
});