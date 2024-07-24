import { getTokenFromHeader } from "../utils/getTokenFromHeader.js"
import { verifyToken } from "../utils/verifyToken.js"

export const isLoggedIn = (req, res, next) => {
  // get token from header
  const token = getTokenFromHeader(req);
  // verify token
  const decodedUser = verifyToken(token);
  
  if (!decodedUser) {
    throw new Error("Invalid/Expired Token, Please Login Again");
  } else {
    // save the user into req obj
    req.userAuthId = decodedUser?.userId;
    next();
  }
};