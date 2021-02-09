const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const WholeProperty = require("./wholePropertyModel");

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    username: {
      type: String,
    },
    email: {
      type: String,
      required: [true, "a user must have an email"],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, "please provide a valid email"],
    },
    password: {
      type: String,
      required: [true, "a user must have a Password"],
      minlength: 8,
      select: false,
    },
    passwordConfirm: {
      type: String,
      required: [true, "you should confrim your password"],
      validate: {
        validator: function (el) {
          return el === this.password;
        },
      },
    },
    photo: {
      type: String,
    },
    passwordChangedAt: Date,
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    passwordResetToken: {
      type: String,
    },
    passwordResetExpires: Date,
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
/// virtual populate
userSchema.virtual('wholeProperty',{
    ref:'WholeProperty',
    foreignField:'user',
    localField:'_id'
})
//creating a querry middleware when searching for find 
userSchema.pre(/^find/,function(next){
    this.find({active:{ $ne: false}});
    next();
})

//set the changed at password attribute when modifing password
userSchema.pre('save',function(next){
    if(!this.isModified('password') || this.isNew) return next();
    this.passwordChangedAt = Date.now() - 1000;
    next();
})
//implementin authentication using documnet middleware
userSchema.pre('save',async function(next){
    //if password hasnt modified go to the next middleware
    if(!this.isModified('password')) return next();
    //else if it isnt modified encrypt password and then save it to DB
    this.password =await bcrypt.hash(this.password,12);
    //delete the passwordConfirm from DB
    this.passwordConfirm = undefined;
    next();

})
//checking for password confirmation for login process
userSchema.methods.correctPassword = async function(candidatePassword, userPassword){
    return await bcrypt.compare(candidatePassword,userPassword);
}
userSchema.methods.changedPasswordAfter = function(JWTTimestamp){
    if(this.passwordChangedAt){
        const changedTimestamp = parseInt(this.passwordChangedAt.getTime()/1000,10);
        return changedTimestamp > JWTTimestamp;
        
    }
    return false;
}
//generating random token for resetting password
userSchema.methods.createPasswordResetToken = function(){
    //creating reset token 
    const resetToken = crypto.randomBytes(32).toString('hex');
    //hashing reset token to save to database
    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    this.passwordResetExpires = Date.now()+10*60*1000;
    return resetToken;
}
const User = mongoose.model('User',userSchema);
module.exports = User;