const mongoose = require('mongoose');

const wholePropertySchema = new mongoose.Schema(
  {
    initialProperty: {
      type: Number,
      required: [true, "each user should have initial property value"],
    },
    difficulty: {
      type: String, //medium
      required: [true, "each user should set a difficulty level"],
    },
    //refrence to user id
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "wholeProperty must belong to a user"],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const WholeProperty = mongoose.model('WholeProperty',wholePropertySchema);
module.exports = WholeProperty;