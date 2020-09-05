const mongoose = require('mongoose')

const AnsSchema = new mongoose.Schema({
    answer:{
        type:String,
        required:true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
    },
    question:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Qna'
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
})


const Ans = mongoose.model('Ans',AnsSchema);

module.exports = Ans;
