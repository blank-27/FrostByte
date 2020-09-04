const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const schema = mongoose.Schema


const teacherSchema = new schema({
    name:{
        type:String,
        required:true
    },
    userType:{
        type:String,
        default:'Teacher'
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    contacts:{
        type:String
    },
    password:{
        type:String,
        trim:true,
        required:true
    },
    class:{
        type:String,
        required:true
    },
    address:String,
    avatar:Buffer,
    subject:String,
    coaching:{
        type:String,
        required:true
    }
})

teacherSchema.pre('save',async function(next){
    var user = this;
    if(!user.isModified('password')){
        return next();
    }
    user.password = await bcrypt.hash(user.password,10);
    next();
})

const Teacher = mongoose.model('Teacher',teacherSchema)

module.exports = Teacher