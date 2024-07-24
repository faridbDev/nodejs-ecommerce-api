import Order from '../model/Order.js';
import asyncHandler from 'express-async-handler';
import User from '../model/User.js';
import Product from '../model/Product.js';
import Coupon from '../model/Coupon.js';
import ZarinpalPayment from 'zarinpal-pay';
import dotenv from 'dotenv';
dotenv.config();

// zarinpal instance
const zarinpal = new ZarinpalPayment (process.env.ZARINPAL_KEY);

// @desc   Create Orders
// @route  POST /api/v1/orders
// @access Private/Admin
export const createOrderCtrl = asyncHandler(async (req, res) => {
  // get the coupon (Its optional)
  const { coupon } = req?.query;
  const couponFound = await Coupon.findOne({ code: coupon?.toUpperCase() });
  if (couponFound?.isExpired) {
    throw new Error("Coupon Has Expired");
  }

  if (couponFound) {
    throw new Error("Coupon Is Not Exists");
  }
  // get discount
  const discount = couponFound?.discount / 100;

  // get the payload
  const { orderItems, shippingAddress, totalPrice } = req.body;

  // find the user
  const user = await User.findById(req.userAuthId);
  
  // check if user has shipping address
  if (!user?.hasShippingAddress) {
    throw new Error("Please Provide Shipping Address");
  }

  // check if order is not empty
  if (orderItems?.length <= 0) {
    throw new Error("No Order Items");
  }
  // place/create order - save into DB
  const order = await Order.create({ user: user?._id, orderItems, shippingAddress,
  totalPrice: couponFound ? totalPrice - (totalPrice * discount) : totalPrice });
  
  // update product qty
  const products = await Product.find({ _id: { $in: orderItems }});
  
  orderItems?.map(async (order) => {
    const product = products?.find((product) => {
      return product?._id?.toString() === order?._id?.toString();
    });
    if (product) {
      product.totalSold += order.qty;
    }
    await product.save();
  });
  // push the order into user & save
  user.orders.push(order?._id);
  await user.save();
  
  // make payment (Zarinpal)
  await zarinpal.create({
    amount: Number(order.totalPrice),
    description: order.orderItems[0].name,
    callback_url: `http://localhost:2030/api/v1/orders/verify?orderID=${order?._id}`,
    mobile: "09301112233",
    email: "nodejsecommerce@gmail.com",
    // order_id: toString(order.orderNumber)
  })
  .then(result => {
    res.send({ url: result.data.link})
  });
});

// @desc   Verify Orders(Zarinpal)
// @route  GET /api/v1/orders/verify?orderID=x
// @access Public
export const verifyOrderCtrl = asyncHandler(async (req, res) => {
  const orderID = req.query.orderID;
  // find the order
  const orderFound = await Order.findById(orderID);
  // check if order exists
  if (!orderFound) {
    throw new Error("Verifying Cancelled, No Order Found");
  }
  // find the user
  const user = await User.findById(orderFound.user.toHexString());
  // for updating product if verification or payment failed
  const products = await Product.find({ _id: { $in: orderFound?.orderItems }});

  if (req.query.Status === 'OK') {
    await zarinpal.verify({
      authority: req.query.Authority,
      amount: orderFound.totalPrice
    })
    .then(async (result) => {
      if (result.data.code === 100 || result.data.code === 101) {
        await Order.findByIdAndUpdate(orderID,{ currency: "IRR", paymentMethod: "Card", paymentStatus: "Paid" }, { new: true });
        res.send("OK");
      } else {
        orderFound?.orderItems?.map(async (order) => {
          const product = products?.find((product) => {
            return product?._id?.toString() === order?._id?.toString();
          });
          if (product) {
            product.totalSold -= order.qty;
          }
          await product.save();
        });
        // pop the order from the user & save
        user.orders.pop();
        await user.save();

        await Order.findByIdAndDelete(orderID);
        res.send("Payment Process Confronted With Problem. Not Verified.");
      }
    });
  } else {
    orderFound?.orderItems?.map(async (order) => {
      const product = products?.find((product) => {
        return product?._id?.toString() === order?._id?.toString();
      });
      if (product) {
        product.totalSold -= order.qty;
      }
      await product.save();
    });
    // pop the order from user & save
    user.orders.pop();
    await user.save();

    await Order.findByIdAndDelete(orderID);
    res.send("Payment Process Confronted With Problem. NOK");
  }
});

// @desc   Get All Orders
// @route  GET /api/v1/orders
// @access Private/Admin
export const getAllOrdersCtrl = asyncHandler(async (req, res) => {
  // find all orders
  const orders = await Order.find();
  res.json({ status: "success", message: "Orders Fetched Successfully", orders });
});

// @desc   Get Single Order
// @route  GET /api/v1/orders/:id
// @access Private/Admin
export const getSingleOrderCtrl = asyncHandler(async (req, res) => {
  // find the order
  const order = await Order.findById(req.params.id);
  res.json({ status: "success", message: "Order Fetched Successfully", order });
});

// @desc   Update Order To Delivered
// @route  GET /api/v1/orders/update/:id
// @access Private/Admin
export const updateOrderCtrl = asyncHandler(async (req, res) => {
  const updatedOrder = await Order.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
  res.json({ status: "success", message: "Order Updated Successfully", updatedOrder });
});

// @desc   Get Sales Som Of Orders
// @route  GET /api/v1/orders/sales/stats
// @access Private/Admin
export const getOrderStatsCtrl = asyncHandler(async (req, res) => {
  // get orders statistics
  const Orders = await Order.aggregate([
    {
      $group: {
        _id: null,
        minimumSale: {
          $min: "$totalPrice",
        },
        maximumSale: {
          $max: "$totalPrice",
        },
        totalSales: {
          $sum: "$totalPrice"
        },
        averageSale: {
          $avg: "$totalPrice"
        }
      }
    }
  ]);
  // get the date
  const date = new Date();
  const today = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const salesToday = await Order.aggregate([
    {
      $match: {
        createdAt: {
          $gte: today
        }
      }
    },
    {
      $group: {
        _id: null,
        totalSales: {
          $sum: "$totalPrice"
        }
      }
    }
  ]);

  res.status(200).json({ status: "success", message: "Sum Of Orders Fetched Successfully", Orders, salesToday });
});