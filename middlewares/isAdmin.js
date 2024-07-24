import User from "../model/User.js";

export const isAdmin = async (req, res, next) => {
  // find the logged in user
  const user = await User.findById(req.userAuthId);
  // check if user is admin
  if (user?.isAdmin) {
    next();
  } else {
    next(new Error("Access Denied, Admin Only!"));
  }
};