const express  = require('express')
const router = express.Router()
const Teacher = require('../db/modals/teachers')
const Coaching = require('../db/modals/coaching')


router.get('/coaching',async (req,res)=>{
    const coaching = await Coaching.find({},{teachers:0,students:0,'xi.Assignment':0,'xi.students':0,'xi.notes':0}).populate('xi.Teacher','name')
    res.render('coaching',{coaching})
})

router.get('/teacher',async (req,res)=>{
    try {
        const teacher = await Teacher.find({})
        res.render('teacher',{teacher})
        
    } catch (error) {
        res.flash('error_message',error.message)
        res.redirect('/')
    }
})


module.exports = router