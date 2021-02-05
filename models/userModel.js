const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    username:{
        type:String,
        required:[true,"a user must have a username"],
    },
    email:{
        type:String,
        required:[true,"a user must have an email"],
        unique:true,
        lowercase:true,
        validate:[validator.isEmail,'please provide a valid email']
    },
    password:{
        type:String,
        required:[true,"a user must have a Password"],
        minlength:8,
        select:false
    },
    passwordConfirm:{
        type:String,
        required:[true,"you should confrim your password"],
        validate:{
            validator: function(el){
                return el === this.password;
            }
        }
    },
    photo:{
        type:String,

    },
    passwordChangedAt:Date,
    roles:{
        type:String,
        enum:['user','admin'],
        default:'user'
    }

});
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

const User = mongoose.model('User',userSchema);
module.exports = User;