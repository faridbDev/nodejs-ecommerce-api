import Brand from "../model/Brand.js";
import Category from "../model/Category.js";
import Product from "../model/Product.js";
import asyncHandler from 'express-async-handler';
import fs from 'fs';

// @desc   Create New Product
// @route  POST /api/v1/products
// @access Private/Admin
export const createProductCtrl = asyncHandler(async (req, res) => {
  const { name, description, brand, category, sizes, colors, price, totalQty } = req.body;

  // check if the product exists
  const productExists = await Product.findOne({ name });
  if (productExists) {
    throw new Error("Product Already Exists");
  }
  // find the category
  const categoryFound = await Category.findOne({ name: category });
  if (!categoryFound) {
    throw new Error("Category Not found, Please Create Category Or Check Category Name");
  }
  // find the brand
  const brandFound = await Brand.findOne({ name: brand?.toLowerCase() });
  if (!brandFound) {
    throw new Error("Brand Not found, Please Create Brand Or Check Brand Name");
  }

  let images = [];
  for (let i = 0; i < req.files?.length; i++) {
    let mimeType = '';
    if (req.files[i].mimetype === 'image/png') {
      mimeType = 'image/png';
    } else if (req.file?.mimetype === 'image.jpg') {
      mimeType = 'image/jpg';
    } else if (req.file?.mimetype === 'image.jpeg') {
      mimeType = 'image.jpeg';
    }
    // create product image
    const image = {
      data: fs.readFileSync(process.cwd() + '\\uploads\\products\\' + req.files[i].filename),
      contentType: mimeType
    };
    console.log(`A${i}: `, image);
    images.push(image);
  }

  // create the product
  const product = await Product.create({ name, description, brand, category, sizes, colors,
  user: req.userAuthId, price, totalQty, images: images });

  // push the product into category and save
  categoryFound.products.push(product._id);

  await categoryFound.save();

  // push the product into brand and save
  brandFound.products.push(product._id);
  await brandFound.save();

  res.status(201).json({ status: "success", message: "Product Created Successfully", product });
});

// @desc   Get All Products
// @route  GET /api/v1/products/name=x&brand=x&category=x&color=x&size=x&price=x-y&page=x&limit=y
// @access Public
export const getProductsCtrl = asyncHandler(async (req, res) => {
  // query
  let productQuery = Product.find();
  // search by name
  if (req.query.name) {
    productQuery = productQuery.find({ name: { $regex: req.query.name, $options: 'i' }});
  }
  // filter by brand
  if (req.query.brand) {
    productQuery = productQuery.find({ brand: { $regex: req.query.brand, $options: 'i' }});
  }
  // filter by category
  if (req.query.category) {
    productQuery = productQuery.find({ category: { $regex: req.query.category, $options: 'i' }});
  }
  // filter by color
  if (req.query.color) {
    productQuery = productQuery.find({ colors: { $regex: req.query.color, $options: 'i' }});
  }
  // filter by size
  if (req.query.size) {
    productQuery = productQuery.find({ sizes: { $regex: req.query.size, $options: 'i' }});
  }
  // filter by price range
  if (req.query.price) {
    const priceRange = req.query.price.split('-');
    // gte: greater than or equal to
    // lte: less than or equal to
    productQuery = productQuery.find({ price: { $gte: priceRange[0], $lte: priceRange[1] }});
  }
  // pagination
  // page
  const page = parseInt(req.query.page) ?  parseInt(req.query.page) : 1;
  // limit
  const limit = parseInt(req.query.limit) ? parseInt(req.query.limit) : 10;
  // startIndex - endIndex
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  // total
  const total = await Product.countDocuments();

  productQuery = productQuery.skip(startIndex).limit(limit);
  // pagination result
  const pagination = {};
  if (endIndex < total) {
    pagination.next = { page: page + 1, limit };
  }
  if (startIndex > 0) {
    pagination.previous = { page: page -1, limit };
  }

  // await the query
  const products = await productQuery.populate('reviews');

  res.status(200).json({ status: "success", total, results: products.length, pagination,
  message: "Products Fetched Successfully", products });
});

// @desc   Get Single Product
// @route  GET /api/v1/products/:id
// @access Public
export const getProductCtrl = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).populate('reviews');
  if (!product) {
    throw new Error("Product Not Found");
  }

  res.status(200).json({ status: "success", message: "Product Fetched Successfully", product });
});

// @desc   Update Product
// @route  PUT /api/v1/products/:id/update
// @access Private/Admin
export const updateProductCtrl = asyncHandler(async (req, res) => {
  const { name, description, brand, category, sizes, colors, user, price, totalQty } = req.body;
  // update
  const product = await Product.findByIdAndUpdate(req.params.id, { name, description, brand, category, sizes, colors,
  user, price, totalQty }, { new: true });

  res.status(200).json({ status: "success", message: "Product Updated Successfully", product });
});

// @desc   Delete Product
// @route  DELETE /api/v1/products/:id/delete
// @access Private/Admin
export const deleteProductCtrl = asyncHandler(async (req, res) => {
  const productFound = await Product.findById(req.params.id);
  if (!productFound) {
    throw new Error("Product Not Found");
  }
  await Product.findByIdAndDelete(req.params.id);
  
  res.status(200).json({ status: "success", message: "Product Deleted Successfully" });
});