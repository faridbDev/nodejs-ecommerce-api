import express from 'express';
import { registerUserCtrl, loginUserCtrl, getUserProfileCtrl, updateShippingAddressCtrl } from '../controllers/usersCtrl.js';
import { isLoggedIn } from '../middlewares/isLoggedIn.js';

const usersRouter = express.Router();

usersRouter.post('/register', registerUserCtrl);
usersRouter.post('/login', loginUserCtrl);
usersRouter.get('/profile', isLoggedIn, getUserProfileCtrl);
usersRouter.put('/update/shipping', isLoggedIn, updateShippingAddressCtrl);

export default usersRouter;
