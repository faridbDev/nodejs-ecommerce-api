export const globalErrorHandler = (err, req, res , next) => {
  // stack
  // message
  // status code
  const stack = err?.stack;
  const message = err?.message;
  const statusCode = err?.statusCode ? err?.statusCode : 500;
  res.status(statusCode).json({ stack, message });
};

// 404 handler
export const notFoundHandler = (req, res, next) => {
  const err = new Error(`404! Route ${req.originalUrl} not found`);
  err.statusCode = 404;
  next(err);
};