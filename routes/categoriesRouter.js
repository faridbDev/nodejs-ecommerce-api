import express from 'express';
import { createCategoryCtrl, getAllCategoriesCtrl, getSingleCategoryCtrl, updateCategoryCtrl,
deleteCategoryCtrl } from '../controllers/categoriesCtrl.js';
import { isLoggedIn } from '../middlewares/isLoggedIn.js';
import { isAdmin } from '../middlewares/isAdmin.js';
import categoryImageupload from '../config/categoryImageUpload.js';

const categoriesRouter = express.Router();

categoriesRouter.post('/', isLoggedIn, isAdmin, categoryImageupload.single('image'), createCategoryCtrl);
categoriesRouter.get('/', getAllCategoriesCtrl);
categoriesRouter.get('/:id', getSingleCategoryCtrl);
categoriesRouter.put('/:id/update', isLoggedIn, isAdmin, updateCategoryCtrl);
categoriesRouter.delete('/:id/delete', isLoggedIn, isAdmin, deleteCategoryCtrl);

export default categoriesRouter;