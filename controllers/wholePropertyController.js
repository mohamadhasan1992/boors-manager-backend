const WholeProperty = require('../models/wholePropertyModel');
const catchAsync = require('../utils/catchAsync');

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};
exports.getWholeProperty = catchAsync(async (req, res,next) => {
  const property = await WholeProperty.find();
    res.status(200).json({
      status:"success",
      data:{
          property
      }
        
  })
});

exports.createWholeProperty = catchAsync(async(req,res,next) => {
    // req.body.user = req.user.id;
    const wholeProperty = await WholeProperty.create(req.body);
    res.status(201).json({
        status:"success",
        data:{
            wholeProperty
        }
    })
});
exports.updateWholeProperty = catchAsync(async (req, res, next) => {
  const filteredBody = filterObj(req.body, "initialValue", "difficulty");
  //find the whole property that belongs to logged in user and update
  const updatedProperty = await WholeProperty.findByIdAndUpdate(req.params.id, filteredBody, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    status: "success",
    data: {
      updatedProperty,
    },
  });
});