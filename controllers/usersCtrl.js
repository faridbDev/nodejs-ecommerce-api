import User from "../model/User.js";
import bcrypt from 'bcryptjs';
import asyncHandler from 'express-async-handler';
import generateToken from "../utils/generateToken.js";
import { getTokenFromHeader } from "../utils/getTokenFromHeader.js";
import { verifyToken } from "../utils/verifyToken.js";

// @desc   Register User
// @route  POST /api/v1/users/register
// @access Private
export const registerUserCtrl = asyncHandler(async (req, res) => {
  const { fullname, email, password } = req.body;
  // check if user exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    throw new Error("User Already Exists");
  }

  // hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  // create user
  const user = await User.create({ fullname, email, password: hashedPassword });
  res.status(201).json({ status: "success", message: "User Registered Successfully", data: user });
});

// @desc   Login User
// @route  POST /api/v1/users/login
// @access Public
export const loginUserCtrl = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  // find the user in db by email only
  const userFound = await User.findOne({ email });
  if (userFound && await bcrypt.compare(password, userFound?.password)) {
    res.status(200).json({ status: "success", message: "User Logged In Successfully",
    userFound, token: generateToken(userFound._id) });
  } else {
    throw new Error("Invalid Login Credentials");
  }
});

// @desc   User Profile
// @route  GET /api/v1/users/profile
// @access Private
export const getUserProfileCtrl = asyncHandler(async (req, res) => {
  const user = await User.findById(req.userAuthId).populate('orders');
  res.status(200).json({ status: "success", message: "User Profile Fetched Successfully", user });
});

// @desc   Update user shipping address
// @route  PUT /api/v1/users/update/shipping
// @access Private
export const updateShippingAddressCtrl = asyncHandler(async (req, res) => {
  const { firstName, lastName, address, city, postalCode, province, country, phone } = req.body;
  const user = await User.findByIdAndUpdate(req.userAuthId, {
  shippingAddress: { firstName, lastName, address, city, postalCode, province, country, phone }, hasShippingAddress: true },
  { new: true });
  res.status(200).json({ status: "success", message: "User Shipping Address Updated Successfully", user });
});