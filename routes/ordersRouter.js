import express from 'express';
import { createOrderCtrl, verifyOrderCtrl, getAllOrdersCtrl, getSingleOrderCtrl,
updateOrderCtrl, getOrderStatsCtrl } from '../controllers/ordersCtrl.js';
import { isLoggedIn } from '../middlewares/isLoggedIn.js';
import { isAdmin } from '../middlewares/isAdmin.js';

const ordersRouter = express.Router();

ordersRouter.post('/', isLoggedIn, createOrderCtrl);

ordersRouter.get('/verify', verifyOrderCtrl);

ordersRouter.get('/', isLoggedIn, getAllOrdersCtrl);

ordersRouter.get('/:id', isLoggedIn, getSingleOrderCtrl);

ordersRouter.put('/update/:id', isLoggedIn, updateOrderCtrl);

ordersRouter.get('/sales/stats', isLoggedIn, isAdmin, getOrderStatsCtrl);

export default ordersRouter;






