const express = require('express');
const propertyRouter = require('./routers/propertyRouter');
const wholePropertyRouter = require('./routers/wholePropertyRouter');
const userRouter = require('./routers/userRouter');
const AppError = require('./utils/AppError');
const globalErrorHandler = require('./controllers/errorController');

const app = express();
//middleware for posting
app.use(express.json());
//creating a new property
app.use('/api/v1/property',propertyRouter);
app.use('/api/v1/wholeproperty',wholePropertyRouter);
app.use("/api/v1/user", userRouter);


//handling all unimplemented route
app.all('*',(req,res,next)=>{
    console.log('inside *');
    return next(new AppError(`cant find ${req.originalUrl} on this server`, 404));
})
app.use(globalErrorHandler);

module.exports = app;