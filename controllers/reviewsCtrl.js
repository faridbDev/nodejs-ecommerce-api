import Product from '../model/Product.js';
import Review from '../model/Review.js';
import asyncHandler from 'express-async-handler';


// @desc   Create New Review
// @route  POST /api/v1/reviews/:productID
// @access Public
export const createReviewCtrl = asyncHandler(async (req, res) => {
  const { message, rating } = req.body;
  // find the product
  const { productID } = req.params;
  const productFound = await Product.findById(productID).populate('reviews');
  if (!productFound) {
    throw new Error("Product Not Found");
  }
  // check if user already reviewd this product
  const hasReviewed = productFound?.reviews?.find((review) => {
    return review?.user?.toString() === req?.userAuthId?.toString();
  });
  if (hasReviewed) {
    throw new Error("You Have Already Reviewed This Product");
  }
  // create review
  const review = await Review.create({ message, rating, product: productFound?._id, user: req.userAuthId });

  // push review into product
  productFound.reviews.push(review?._id);
  // resave
  await productFound.save();
  res.status(201).json({ status: "success", message: "Review Created Successfully", review });
});