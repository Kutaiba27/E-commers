/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const sendErrorForDev = (err, res) =>
   res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
   });

const sendErrorForProd = (err, res) =>
   res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
   });

export const globalError = (err, req, res, next) => {
   err.statusCode = err.statusCode || 500;
   err.status = err.status || 'error';
   if (process.env.NODE_ENV || 'development' === 'development') {
      sendErrorForDev(err, res);
   } else {
      if (err.name === 'JsonWebTokenError') err = handleJwtInvalidSignature();
      if (err.name === 'TokenExpiredError') err = handleJwtExpired();
      sendErrorForProd(err, res);
   }
};