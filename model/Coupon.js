import mongoose from "mongoose";

const Schema = mongoose.Schema;

const CouponSchema = new Schema(
  {
    code: {
      type: String,
      required: true
    },
    startDate: {
      type: Date,
      required: true
    },
    endDate: {
      type: Date,
      required: true
    },
    discount: {
      type: Number,
      required: true,
      default: 0
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true }
  }
);
// Virtuals
// coupon is expired
CouponSchema.virtual('isExpired').get(function() {
  return this.endDate < Date.now();
});
// days left
CouponSchema.virtual('daysLeft').get(function() {
  const daysLeft = Math.ceil((this.endDate - Date.now()) / (1000 * 60 * 60 * 24)) + " "+ 'Days Left';
  return daysLeft;
});

// Validation
CouponSchema.pre('validate', function(next) {
  if (this.endDate < this.startDate) {
    next(new Error("End Date Cannot Be Less Than Start Date"));
  }
  next();
});

CouponSchema.pre('validate', function(next) {
  if (this.startDate < Date.now()) {
    next(new Error("Start Date Cannot be Less Than Today Date"));
  }
  next();
});

CouponSchema.pre('validate', function(next) {
  if (this.endDate < Date.now()) {
    next(new Error("End Date Cannot be Less Than Today Date"));
  }
  next();
});

CouponSchema.pre('validate', function(next) {
  if (this.discount <= 0 || this.discount > 100) {
    next(new Error("Discount Cannot Be Less Than 0 Or Greater Than 100"));
  }
  next();
});


// Compile the schema to model
const Coupon = mongoose.model("Coupon", CouponSchema);

export default Coupon;