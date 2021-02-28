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
    const propertiesSum = properties.map(item => item.propertySum).reduce((prev,cur) => prev + cur,0);
    console.log(`propertiesSum: ${propertiesSum}`);
    const data = { properties , wholeProperty, propertiesSum};

    res.status(200).json({
        status:'success',
        data
    })
});
