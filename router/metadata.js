const express  = require('express')
const router = express.Router()
const Teacher = require('../db/modals/teachers')


router.get('/coaching',(req,res)=>{

    res.render('coaching')
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