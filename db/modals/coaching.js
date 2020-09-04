const mongoose = require('mongoose')
const schema = mongoose.Schema


const coachingSchema = new schema({
    name:{
        type:String,
        trim:true,
        unique:true
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    email:String,
    avatar:Buffer,
    address:String,
    students:[{type:schema.Types.ObjectId,ref:'Student'}],
    teachers:[{type:schema.Types.ObjectId,ref:'Teacher'}],
    xi:{type:[{
        subject:String,
        Assignment:[{type:schema.Types.ObjectId,ref:'Assignment'}],
        link:String,
        students:[{type:schema.Types.ObjectId,ref:'Student'}],
        notes:{type:[{fileName:String,
            file:Buffer}]},
        Teacher:{type:schema.Types.ObjectId,ref:'Teacher'},
    }],
        default:[{
            subject:'Physics'
        },
        {subject:'Chemistry'},
        {subject:'Maths'}
    ]},

    xii:{type:[{
        subject:String,
        Assignment:[{type:schema.Types.ObjectId,ref:'Assignment'}],
        link:String,
        students:[{type:schema.Types.ObjectId,ref:'Student'}],
        notes:{type:[{fileName:String,
        file:Buffer}]},
        Teacher:{type:schema.Types.ObjectId,ref:'Teacher'},
    }],
default:[{
    subject:'Physics'
},{subject:'Chemistry'},{subject:'Maths'}]}

})

coachingSchema.methods.toJSON = function()
{
    const coaching = this
    const coachingObject = coaching.toObject()
    delete coachingObject.students
    return coachingObject
}

const Coaching = mongoose.model('Coaching',coachingSchema);
module.exports = Coaching;
