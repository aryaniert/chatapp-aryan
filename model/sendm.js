const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
    user:{
        type:String,
        required:true
    },
    message:{
        type:String,
        required:true
    }
});

const sendm = new mongoose.model("sendm",messageSchema);

module.exports = sendm;