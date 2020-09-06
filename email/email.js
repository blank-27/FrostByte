const nodemailer = require('nodemailer')



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
        subject:'Please verify your email for coaching',
        html:`<a href="https://target-frostbyte.herokuapp.com/verify/coaching/${id}">Click here</a>`
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
        subject:'Please verify your email for Student',
        html:`<a href="https://target-frostbyte.herokuapp.com/verify/student/${id}">Click here</a>`
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
        subject:'Please verify your email for Teacher',
        html:`<a href="https://target-frostbyte.herokuapp.com/verify/teacher/${id}">Click here</a>`
    }
    transporter.sendMail(mailOption,(err,info)=>{
        if(err)
        console.log('email not sent',err)
        else
        console.log('email sent',info)
    })

}

module.exports = {coachingVerify,teacherVerify,studentVerify}