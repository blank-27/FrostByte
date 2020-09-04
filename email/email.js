const nodemailer = require('nodemailer')
const e = require('express')


const transporter = nodemailer.createTransport({
    service:'gmail',
    auth:{
        user:process.env.USER,
        pass:process.env.PASS
    }
})



const coachingVerify = (email,id)=>{
    const mailOption = {
        to:email,
        from:process.env.USER,
        subject:'Please verify your email for teacher',
        html:`<a href="/verify/coaching/${id}">Click here</a>`
    }
    transporter.sendMail(mailOption,(err,info)=>{
        if(err)
        console.log('email not sent',err)
        else
        console.log('email sent',info)
    })
}

const studentVerify =  (email,id)=>{
    const mailOption = {
        to:email,
        from:process.env.USER,
        subject:'Please verify your email for teacher',
        html:`<a href="/verify/student/${id}">Click here</a>`
    }
    transporter.sendMail(mailOption,(err,info)=>{
        if(err)
        console.log('email not sent',err)
        else
        console.log('email sent',info)
    })
}

const teacherVerify =  (email,id)=>{
    const mailOption = {
        to:email,
        from:process.env.USER,
        subject:'Please verify your email for teacher',
        html:`<a href="/verify/teacher/${id}">Click here</a>`
    }
    transporter.sendMail(mailOption,(err,info)=>{
        if(err)
        console.log('email not sent',err)
        else
        console.log('email sent',info)
    })

}

module.exports = {coachingVerify,teacherVerify,studentVerify}