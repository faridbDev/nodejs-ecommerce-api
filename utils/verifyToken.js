import jwt from 'jsonwebtoken';

export const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
    if (err) {
      return false;
    } else {
      // decoded is the actual user(id of the user)
      return decoded;
    }
  });
};