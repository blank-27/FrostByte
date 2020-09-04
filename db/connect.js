const mongoose = require('mongoose')

mongoose.connect(process.env.MONGO_URL,{useUnifiedTopology:true,useNewUrlParser:true,useCreateIndex:true},(err)=>{
    if(!err)
    console.log('database is connected')
    else
    console.log('database has not connected');
})