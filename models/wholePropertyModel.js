const mongoose = require('mongoose');

const wholePropertySchema = new mongoose.Schema({
    initialProperty:{
        type:Number, //12000000
        required:[true,"each user should have initial property value"]
    },difficulty:{
        type:String, //medium
        required:[true,'each user should set a difficulty level']
    }
})

const WholeProperty = mongoose.model('WholeProperty',wholePropertySchema);
module.exports = WholeProperty;