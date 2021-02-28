const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const propertySchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "each property should have a name"],
    },
    buyDate: {
      type: String,
      required: [true, "each property should have a name"],
    },
    buyValue: {
      type: Number,
      required: [true, "each property should have a buyValue"],
    },
    buyPrice: {
      type: Number,
      required: [true, "each property should have a buyPrice"],
    },
    buyPurpose: {
      type: String,
      required: [true, "each property should have a buyPurpose"],
    },
    propertySum:{
      type:Number
    },
    sellDate: {
      type: String,
    },
    sellValue: {
      type: Number,
    },
    sellPrice: {
      type: Number,
    },
    sellPurpose: {
      type: String,
    },
    edit:false,
    complete:false
    // user: {
    //   type: mongoose.Schema.ObjectId,
    //   ref: "User",
    //   required: [true, "each property should connect to a user"],
    // },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
propertySchema.pre("save", async function (next) {
  this.propertySum = this.buyValue * this.buyPrice;
  next();
});

const Property = mongoose.model('Property',propertySchema);
module.exports = Property;