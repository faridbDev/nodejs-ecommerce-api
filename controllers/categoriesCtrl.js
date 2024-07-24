import Category from "../model/Category.js";
import asyncHandler from 'express-async-handler';
import fs from 'fs';

// @desc   Create New Category
// @route  POST /api/v1/categories
// @access Private/Admin
export const createCategoryCtrl = asyncHandler(async (req, res) => {
  const { name } = req.body;
  // check if category exists
  const categoryFound = await Category.findOne({ name });
  if (categoryFound) {
    throw new Error("Category Already exists");
  }

  let mimeType = '';
  if (req.file.mimetype === 'image/png') {
    mimeType = 'image/png';
  } else if (req.file.mimetype === 'image.jpg') {
    mimeType = 'image/jpg';
  } else if (req.file.mimetype === 'image.jpeg') {
    mimeType = 'image.jpeg';
  }
  // create category image
  const image = {
    data: fs.readFileSync(process.cwd() + '\\uploads\\categories\\' + req.file.filename),
    contentType: mimeType
  };
  // create
  const category = await Category.create({ name: name.toLowerCase(), user: req.userAuthId, image: image });
  res.status(201).json({ status: "success", message: "Category Created Successfully", category });
});

// @desc   Get All Categories
// @route  GET /api/v1/categories
// @access Public
export const getAllCategoriesCtrl = asyncHandler(async (req, res) => {
  const categories = await Category.find();
  res.status(200).json({ status: "success", message: "Categories Fetched Successfully", categories });
});

// @desc   Get Single Category
// @route  GET /api/v1/categories/:id
// @access Public
export const getSingleCategoryCtrl = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  res.status(200).json({ status: "success", message: "Category Fetched Successfully", category });
});

// @desc   Update Category
// @route  PUT /api/v1/categories/:id/update
// @access Private/Admin
export const updateCategoryCtrl = asyncHandler(async (req, res) => {
  const { name } = req.body;
  // update
  const category = await Category.findByIdAndUpdate(req.params.id, { name: name.toLowerCase() }, { new: true });
  res.status(200).json({ status: "success", message: "Category Updated Successfully", category });
});

// @desc   Delete Category
// @route  DELETE /api/v1/categories/:id/update
// @access Private/Admin
export const deleteCategoryCtrl = asyncHandler(async (req, res) => {
  const categoryFound = await Category.findById(req.params.id);
  if (!categoryFound) {
    throw new Error("Category Not Found");
  }
  await Category.findByIdAndDelete(req.params.id);
  res.status(200).json({ status: "success", message: "Category Deleted Successfully"});
});