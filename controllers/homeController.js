const catchAsync = require('../utils/catchAsync');
const Property = require('../models/propertyModel');
const WholeProperty = require('../models/wholePropertyModel');
const AppError = require('../utils/AppError');


exports.getFirstPageData = catchAsync(async(req,res,next)=>{
    const properties = await Property.find();
    if (!properties) {
      return next(new AppError("cant find any property", 404));
    };
    const wholeProperty = await WholeProperty.find();
    if(!wholeProperty){
        return next(new AppError("cant find any wholeProperty",404));
    }
    const data = { properties , wholeProperty};

    res.status(200).json({
        status:'success',
        data
    })
});
