import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import morgan from 'morgan';
import dbConnect from '../config/dbConnect.js';
import usersRouter from '../routes/usersRouter.js';
import productsRouter from '../routes/productsRouter.js';
import categoriesRouter from '../routes/categoriesRouter.js';
import brandsRouter from '../routes/brandsRouter.js';
import colorsRouter from '../routes/colorsRouter.js';
import reviewsRouter from '../routes/reviewsRouter.js';
import ordersRouter from '../routes/ordersRouter.js';
import couponsRouter from '../routes/couponsRouter.js';
import { globalErrorHandler, notFoundHandler } from '../middlewares/globalErrorHandler.js';



// mongodb connect
dbConnect();
const app = express();

app.use(morgan('dev'));
app.use(express.json()); // pass incoming data

// routes
app.use('/api/v1/users', usersRouter);
app.use('/api/v1/products', productsRouter);
app.use('/api/v1/categories', categoriesRouter);
app.use('/api/v1/brands', brandsRouter);
app.use('/api/v1/colors', colorsRouter);
app.use('/api/v1/reviews', reviewsRouter);
app.use('/api/v1/orders', ordersRouter);
app.use('/api/v1/coupons', couponsRouter);


// error middlewares
app.use(notFoundHandler); // comes before globalErrorHandler
app.use(globalErrorHandler);


export default app;