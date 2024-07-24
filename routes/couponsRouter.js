import express from 'express';
import { createCouponCtrl, getAllCouponsCtrl, getSingleCouponCtrl, updateCouponCtrl,
deleteCouponCtrl } from '../controllers/couponsCtrl.js';
import { isLoggedIn } from '../middlewares/isLoggedIn.js';
import { isAdmin } from '../middlewares/isAdmin.js';

const couponsRouter = express.Router();

couponsRouter.post('/', isLoggedIn, isAdmin, createCouponCtrl);

couponsRouter.get('/', isLoggedIn, getAllCouponsCtrl);

couponsRouter.get('/:id', isLoggedIn, getSingleCouponCtrl);

couponsRouter.put('/:id/update', isLoggedIn, isAdmin, updateCouponCtrl);

couponsRouter.delete('/:id/delete', isLoggedIn, isAdmin, deleteCouponCtrl);

export default couponsRouter;