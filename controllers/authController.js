const {promisify} = require('util');
const User = require('../models/userModel');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const jwt = require('jsonwebtoken');



const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
}

exports.signup = catchAsync(async(req,res,next) =>{
        const { username, email, password, passwordConfirm, photo } = req.body;
        const newUser = await User.create({
          username,
          email,
          password,
          passwordConfirm,
          photo, 
        });
        //create jwt
        const token = signToken(newUser._id);
        res.status(201).json({
          status: "success",
          token,
          data: {
            user: newUser,
          },
        });
});
exports.login = catchAsync(async(req,res,next) => {
        const {email, password} = req.body;
        //check if email and password exist
        if(!email || !password){
            return next(new AppError('you are not signed up',401));
        }
        //if the user exist and if the password correct
        const user = await User.findOne({email}).select('+password'); //not contain the password so by selecting
        console.log(user);
        //check if the password that passed is equal to password that saved at database
        if (!user || !(await user.correctPassword(password, user.password))) {
          return next(new AppError('your password is not matched',401));
        }
        //if ok send to token to client
        const token= signToken(user._id);
        res.status(200).json({
            status:'success',
            token
        })

});

//authentication
exports.protect = catchAsync(async(req,res,next) => {
  //get token and check if exist
  let token;
  if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
    token = req.headers.authorization.split(' ')[1];
  }
  if(!token){
    return next(new AppError("you are not logged in",401));
    
  }
  //validate token 
  const decoded = await promisify(jwt.verify)(token,process.env.JWT_SECRET);
  const protectUser = await User.findById(decoded.id);
  //if user still exist
  if(!protectUser){
    return next(new AppError('the user does not exist',401));
  }

  //if user changed password after the jwt issued // should create an instance method on the modle
  if(protectUser.changedPasswordAfter(decoded.iat)){
    next(new AppError('password had been changed'),401);
  };
  //then grant access
  req.user=protectUser;
  next();
});
//roll based authorization
exports.restrict() = (...roles) => {
  return(req,res,next) => {
    if(!roles.includes(req.user.role)){
      return next(new AppError('you dont have permission'),403);
    }
    next();

  }
} 

//password Reset function
