const express  = require('express')
const router = express.Router()
const Teacher = require('../db/modals/teachers')
const Coaching = require('../db/modals/coaching')


router.get('/coaching',async (req,res)=>{
    const coaching = await Coaching.find()
    res.render('coaching',{coaching})
})

router.get('/teacher',async (req,res)=>{
    try {
        const teacher = await Teacher.find({})
        console.log(teacher)
        res.render('teacher',{teacher})
        
    } catch (error) {
        res.flash('error_message',error.message)
        res.redirect('/')
    }
})


module.exports = router