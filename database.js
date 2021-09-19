const mongoose = require('mongoose');
const mongoUri = "mongodb://localhost:27017/personalDiary?readPreference=primary&appname=MongoDB%20Compass&ssl=false";

const connectToMongo = ()=>{
    mongoose.connect(mongoUri,()=>{
        console.log("connected to database successfully");
    })
}

module.exports =connectToMongo;
