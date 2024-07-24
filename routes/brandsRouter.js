import express from 'express';
import { createBrandCtrl, getAllBrandsCtrl, getSingleBrandCtrl, updateBrandCtrl,
deleteBrandCtrl } from '../controllers/brandsCtrl.js';
import { isLoggedIn } from '../middlewares/isLoggedIn.js';
import { isAdmin } from '../middlewares/isAdmin.js';

const brandsRouter = express.Router();

brandsRouter.post('/', isLoggedIn, isAdmin, createBrandCtrl);
brandsRouter.get('/', getAllBrandsCtrl);
brandsRouter.get('/:id', getSingleBrandCtrl);
brandsRouter.put('/:id/update', isLoggedIn, isAdmin, updateBrandCtrl);
brandsRouter.delete('/:id/delete', isLoggedIn, isAdmin, deleteBrandCtrl);

export default brandsRouter;