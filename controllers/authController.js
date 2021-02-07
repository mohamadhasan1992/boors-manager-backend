const {promisify} = require('util');
const User = require('../models/userModel');
const AppError = require('../utils/AppError');
const crypto = require('crypto');
const catchAsync = require('../utils/catchAsync');
const jwt = require('jsonwebtoken');

const cookieOptions = {
  expires: new Date(
    Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
  ),
  httpOnly: true,
};

const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
}
//create and sending token 
const createAndSendToken = (user,statusCode,res) => {
  const token = signToken(user._id);

  if(process.env.NODE_ENV === "production") cookieOptions.secure = true;
  res.cookie("jwt", token, cookieOptions);

  user.password = undefined;
  
  res.status(statusCode).json({
    status:'success',
    token,
    data:{user}
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
        createAndSendToken(newUser,201,res);
        
});
exports.login = catchAsync(async(req,res,next) => {
        const {email, password} = req.body;
        //check if email and password exist
        if(!email || !password){
            return next(new AppError('you are not signed up',401));
        }
        //if the user exist and if the password correct
        const user = await User.findOne({email}).select('+password'); //not contain the password so by selecting
        //check if the password that passed is equal to password that saved at database
        if (!user || !(await user.correctPassword(password, user.password))) {
          return next(new AppError('your password is not matched',401));
        }
        //if ok send to token to client
        createAndSendToken(user, 200, res);
        

});

//authentication
exports.protect = catchAsync(async(req,res,next) => {
  //get token and check if exist
  let token;
  if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
    token = req.headers.authorization.split(' ')[1];
  }
  if(!token){
    return next(new AppError("you are not logged in please log in to get access",401));
    
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
exports.restrict = (...roles) => {
  return(req,res,next) => {
    if(!roles.includes(req.user.role)){
      return next(new AppError('you dont have permission'),403);
    }
    next();

  }
} 

//password Reset function
exports.forgotPassword = catchAsync(async(req,res,next) => {
  //get user by email
  const user = await User.findOne({email:req.body.email});
  if(!user){
    return next(new AppError("there is no user with this email address",404));
  }
  //generate random token 
  //create an instance method on model
  const resetToken = user.createPasswordResetToken();
  await user.save({validateBeforeSave: false});

  //send token to user via email

  //create reset url
  
  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/user/resetPassword/${resetToken}`;
  console.log(resetUrl);

  const message = `send a new password to ${resetUrl}.`;

  //then send email with nodemailer

  res.status(200).json({
    status:'success',
    message:'Token sent to email'
  })

  

})


exports.resetPassword = catchAsync(async (req, res, next) => {
  //get user based on token
  //encrypt token on url tand compare it to data base
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
  const user = await User.findOne({ passwordResetToken: hashedToken });
  //check the expiration
  if (!user || !user.passwordResetExpires.getTime() > Date.now()) {
    return next(
      new AppError("there isnt any user or your token had been expired", 400)
    );
  }
  //grab data from user and change password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  //set reset attribute to undefined
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  //save ne password in DB
  await user.save();

  //send JWT to user for logging in
  createAndSendToken(user, 200, res);
  
});

  //allow loged ion user to update password
exports.updatePassword = catchAsync(async (req, res, next) => {
  //get user by id that passed when was logging in
  const user = await User.findById(req.user.id).select("+password");
  //get user password and check corrrectness
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError("password is not correct", 401));
  }

  //update currently logged in users password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();
  //log user in
  createAndSendToken(user, 200, res);
  
});



