import jwt from 'jsonwebtoken';

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_KEY, { expiresIn: '3d' });
};

export default generateToken;