const catchAsync = require('../utils/catchAsync');
const User = require('../models/userModel');
const AppError = require('../utils/AppError');
//update currently logged in users DATA

const filterObj = (obj, ...allowedFields)=>{
    const newObj = {};
    Object.keys(obj).forEach(el => {
        if(allowedFields.includes(el)) newObj[el] = obj[el];
    });
    return newObj;

};
exports.getAllUser = catchAsync(async(req,res,next)=>{
    const users = await User.find();
    res.status(200).json({
        status:"success",
        users
    })
});
exports.getUser = catchAsync(async(req,res,next) => {
    const user = await User.find({_id:req.params.id}).populate('wholeProperty').populate('properties').populate('dailyProperties');
    res.status(200).json({
        status:'success',
        user
    })
})

exports.updateMe = catchAsync(async(req,res,next) => {
    //if user send password res error
    if(req.body.password || req.passwordConfirm){
        return next(new AppError('you cant update password use another route',401));
    }
    //find the logged in user
    const filteredBody = filterObj(req.body, 'username','email');
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      filteredBody,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      status: "success",
      updatedUser,
    });
});
//deleting the logged in user
exports.deleteMe = catchAsync(async(req,res,next)=>{
    await User.findByIdAndUpdate(req.user.id,{active:false});
    console.log("deletting");
    res.status(204).json({
        status:"success",
        message:null
    })
})
