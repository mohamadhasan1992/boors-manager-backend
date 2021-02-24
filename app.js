const express = require('express');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const homeRouter = require('./routers/homeRouter');
const propertyRouter = require('./routers/propertyRouter');
const wholePropertyRouter = require('./routers/wholePropertyRouter');
const userRouter = require('./routers/userRouter');
const dailyPropertyRouter = require('./routers/dailyPropertyRouter');
const AppError = require('./utils/AppError');
const globalErrorHandler = require('./controllers/errorController');

const app = express();

//security http headers
app.use(helmet());


//limit eq from smae ip
//limit 100 req from a certain ip in 1 hour
const limiter = rateLimit({
    max: 100,
    windowMx: 60 * 60 *1000,
    message:"too many request please try again later"
});
app.use('/api',limiter);


//body parser middleware reading data from body into req.body
app.use(express.json({ limit:'10kb' }));

//DATA SANITIZATION against noSQL querry injection 
app.use(mongoSanitize());

//DATA SANITIZATION against XSS
app.use(xss());

//parametr pollution
app.use(hpp({
    whitelist:[]
}));

//ROUTES
app.use('/api/v1/home', homeRouter);
app.use('/api/v1/property',propertyRouter);
app.use('/api/v1/wholeproperty',wholePropertyRouter);
app.use("/api/v1/user", userRouter); 
app.use("/api/v1/dailyproperty", dailyPropertyRouter);


//handling all unimplemented route
app.all('*',(req,res,next)=>{
    console.log('inside *');
    return next(new AppError(`cant find ${req.originalUrl} on this server`, 404));
})

//error handling middleware
app.use(globalErrorHandler);

module.exports = app;