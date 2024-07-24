import Coupon from "../model/Coupon.js";
import asyncHandler from 'express-async-handler';

// @desc   Create New Coupon
// @route  POST /api/v1/coupons
// @access Private/Admin
export const createCouponCtrl = asyncHandler(async (req, res) => {
  const { code, startDate, endDate, discount } = req.body;
  // check if coupon exists
  const couponFound = await Coupon.findOne({ code });
  if(couponFound) {
    throw new Error("Coupon Already exists");
  }
  // check if discount is a number
  if(isNaN(discount)) {
    throw new Error("Discount Value Must Be A Number");
  }
  // create the coupon
  const coupon = await Coupon.create({ code: code?.toUpperCase(), startDate, endDate, discount, user: req.userAuthId });

  res.status(201).json({ status: "success", message: "Coupon Created Successfully", coupon });
});

// @desc   Get All Coupons
// @route  GET /api/v1/coupons
// @access Private/Admin
export const getAllCouponsCtrl = asyncHandler(async (req, res) => {
  const coupons = await Coupon.find();
  res.status(200).json({ status: "success", message: "Coupons Fetched Successfully", coupons });
});

// @desc   Get Single Coupon
// @route  GET /api/v1/coupons/:id
// @access Private/Admin
export const getSingleCouponCtrl = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findById(req.params.id);
  res.status(200).json({ status: "success", message: "Coupon Fetched Successfully", coupon });
});

// @desc   Update Coupon
// @route  PUT /api/v1/coupons/:id/update
// @access Private/Admin
export const updateCouponCtrl = asyncHandler(async (req, res) => {
  const { code, startDate, endDate, discount } = req.body;
  // update
  const coupon = await Coupon.findByIdAndUpdate(req.params.id, { code: code?.toUpperCase(), discount,
  startDate, endDate }, { new: true });
  res.status(200).json({ status: "success", message: "Coupon Updated Successfully", coupon });
});

// @desc   Delete Coupon
// @route  DELETE /api/v1/coupons/:id/delete
// @access Private/Admin
export const deleteCouponCtrl = asyncHandler(async (req, res) => {
  const couponFound = await Coupon.findById(req.params.id);
  if (!couponFound) {
    throw new Error("Coupon Not Found");
  }
  await Coupon.findByIdAndDelete(req.params.id);
  res.status(200).json({ status: "success", message: "Coupon Deleted Successfully"});
});