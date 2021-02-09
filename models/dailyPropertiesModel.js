const mongoose = require('mongoose');

const dailyPropertySchema = new mongoose.Schema({
  day: {
    type: String,
    required: [true, "a dailyProperty must have a Day"],
  },
  date: {
    type: Number,
    required: [true, "a dailyProperty must have a Date"],
  },
  value: {
    type: Number,
    required: [true, "a dailyProperty must have a Value"],
  },
  user:{
    type:mongoose.Schema.ObjectId,
    ref:'User',
    required:[true,'DailyProperty must belong to a user']
  }
});