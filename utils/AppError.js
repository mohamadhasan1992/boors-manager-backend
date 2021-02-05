class AppError extends Error{
    constructor(message,statusCode){
        super(message);

        this.statusCode=statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail':'error' ; //fail or error and depends on status code
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports=AppError;