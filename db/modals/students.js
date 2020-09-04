const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const schema = mongoose.Schema


const studentSchema = new schema({
    name:{
        type:String,
        required:true,
        required:true,
        lowercase:true
    },
    userType:{
        type:String,
        default:"Student"
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true
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
    isVerified:{
        type:Boolean,
        default:false
    },
    avatar:Buffer,
    coaching:String,
    data:[{
        coaching:String,
        subjects:[{type:String}]
    }],
    assignments:[{type:schema.Types.ObjectId,ref:'Assignment'}]
})

studentSchema.pre('save',async function(next){
    var user = this;
    if(!user.isModified('password')){
        return next();
    }
    user.password = await bcrypt.hash(user.password,10);
    next();
})

studentSchema.methods.toJSON = function(){
    const user = this
    const userObject = user.toObject()
    delete userObject.password

    return userObject
}


const Student = mongoose.model('Student',studentSchema)
module.exports = Student