const mongoose = require('mongoose');

const dailyPropertySchema = new mongoose.Schema({
  day: {
    type: String,
    required: [true, "a dailyProperty must have a Day"],
  },
  date: {
    type: Date,
    required: [true, "a dailyProperty must have a Date"],
  },
  value: {
    type: Number,
    required: [true, "a dailyProperty must have a Value"],
  },
});