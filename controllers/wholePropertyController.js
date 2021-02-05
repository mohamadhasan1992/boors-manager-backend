const WholeProperty = require('../models/wholePropertyModel');
const catchAsync = require('../utils/catchAsync');


exports.getWholeProperty = catchAsync(async (req, res) => {
  res.status(200).json({
      status:"fail",
      message:"this route had not implemented yet"
  })
});

exports.getWholePropertyById = catchAsync(async(req,res) => {
        const wholeProperty = await WholeProperty.findById(req.params.id);
        res.status(200).json({
            status:"success",
            data:{
                wholeProperty
            }
        })
   
});
exports.createWholeProperty = catchAsync(async(req,res) => {
        const wholeProperty = await WholeProperty.create(req.body);
        res.status(200).json({
            status:"success",
            data:{
                wholeProperty
            }
        })
});