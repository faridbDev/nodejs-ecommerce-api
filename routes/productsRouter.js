import express from 'express';
import { createProductCtrl, getProductsCtrl, getProductCtrl, updateProductCtrl,
deleteProductCtrl } from '../controllers/productsCtrl.js';
import { isLoggedIn } from '../middlewares/isLoggedIn.js';
import { isAdmin } from '../middlewares/isAdmin.js';
import productImageupload from '../config/productImageUpload.js';

const productsRouter = express.Router();

productsRouter.post('/', isLoggedIn, isAdmin, productImageupload.array('image'), createProductCtrl);
productsRouter.get('/', getProductsCtrl);
productsRouter.get('/:id', getProductCtrl);
productsRouter.put('/:id/update', isLoggedIn, isAdmin, updateProductCtrl);
productsRouter.delete('/:id/delete', isLoggedIn, isAdmin, deleteProductCtrl);


export default productsRouter;