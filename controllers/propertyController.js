const Property = require('../models/propertyModel');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');


exports.updateProperty = catchAsync(async(req,res,next) => {
        const property = await Property.findByIdAndUpdate(req.params.id, req.body, {
            new:true,
            runValidators:true
        });
        console.log(property);
        res.status(200).json({
            status:"success",
            data:{
                property
            }
        })

});
exports.deleteProperty= catchAsync(async(req,res,next)=>{
        const propertyId = req.params.id;
        const deletedProperty = await Property.findByIdAndDelete(req.params.id);
        res.status(200).json({
            status:"success",
            message:`${propertyId} had been deleted`
        })
});

exports.getProperty = catchAsync(async(req,res,next)=>{
        const propertyId = req.params.id;
        const property = await Property.findById(propertyId);
        if(!property){
            return next(new AppError('cant find property that matching information passed',401));
        }
        res.status(200).json({
            status:"success",
            data:{
                property
            }
        }) 
       
});
exports.getAllProperties = catchAsync(async(req,res,next) => {
    const properties = await Property.find();
    if(!properties){
        return next(new AppError('cant find any property',404));
    }
    res.status(200).json({
            status:"success",
            data:{
                properties
            }
        })
    });
exports.createProperty = catchAsync(async(req,res,next) => {
    //req.body.user = req.user._id;
        const property = await Property.create(req.body);
        console.log(property);
        res.status(200).json({
          status: "success",
          data: {
            property,
          },
        });
    
});