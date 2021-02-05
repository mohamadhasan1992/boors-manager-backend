const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const propertySchema = new Schema({
  id: {
    type: String,
    required: [true, "each property should have an ID"],
    unique:true
  },
  name: {
    type: String,
    required: [true, "each property should have a name"],
  },
  buyDate: {
    type: Number,
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
  sellDate: {
    type: Number,
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
 
});

const Property = mongoose.model('Property',propertySchema);
module.exports = Property;