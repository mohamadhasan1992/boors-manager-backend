const DailyProperty = require("../models/dailyPropertiesModel");
const catchAsync = require('../utils/catchAsync');


exports.getDailyProperties = catchAsync(async(req,res,next)=>{
    const userId = req.user.id;
    const dailyProperties = await DailyProperty.find();
    res.status(200).json({
        status:"success",
        data:{
            dailyProperties
        }
    })
});

exports.createDailyProperties = catchAsync(async (req, res, next) => {
    req.body.user = req.user._id;
  const dailyProperty = await DailyProperty.create(req.body);
  res.status(201).json({
    status: "success",
    data: {
      dailyProperty,
    },
  });
});

