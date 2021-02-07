const AppError = require("../utils/AppError");

const validationError = () => new AppError('your password and confirm password is not the same',401);
const handleJWTError = () => new AppError('invalid token. please login again',401);
const handleJWTExpiredError = () => new AppError('your token has been expired',401);
const sendErrDev = (err,res)=>{
  res.status(err.statusCode).json({
    status: err.statusCode,
    error: err,
    message: err.message,
    stack: err.stack,
  });
}
const sendErrProd=(err,res)=>{
  if(err.isOperational){
    res.status(err.statusCode).json({
      status: err.statusCode,
      message: err.message,
    });
  }else{
    console.log('ERROR',err);
    res.status(500).json({
      status: 'error',
      message: 'something wents wrong',
    });
  }
}
module.exports = (err, req, res, next) => {
  //default error status code
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  
  if(process.env.NODE_ENV === 'development'){
    sendErrDev(err,res);
  }else if (process.env.NODE_ENV === "production"){
    let error = {...err};
    if(error.name === 'JsonWebTokenError') error = handleJWTError()
    if(error.name === 'TokenExpiredError'){
      error = handleJWTExpiredError();
    }
    if(error.name === 'ValidateError'){
      error.handleValidationError();
    }
    sendErrProd(error,res);
  }
    
};
