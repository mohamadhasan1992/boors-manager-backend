const mongoose = require('mongoose');

const dailyPropertySchema = new mongoose.Schema(
  {
    day: {
      type: String,
      required: [true, "a dailyProperty must have a Day"],
    },
    date: {
      type: String,
      required: [true, "a dailyProperty must have a Date"],
    },
    value: {
      type: Number,
      required: [true, "a dailyProperty must have a Value"],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const DailyProperty = mongoose.model('DailyProperty',dailyPropertySchema);
module.exports = DailyProperty;