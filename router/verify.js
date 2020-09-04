const router = require('express').Router()
const Student = require('../db/modals/students')
const Teacher = require('../db/modals/teachers')
const Coaching = require('../db/modals/coaching')
const Assignment = require('../db/modals/assignment')
const {} = require('./auth')

router.get('/verify',(req,res)=>{
    res.render('verify',{err:res.locals.error_messages})
})


router.get('/verify/teacher/:id',async (req,res)=>{
    try {
        const teacher = await Teacher.findById(req.params.id);
        if(teacher.isVerified)
        return res.redirect('/home/teacher')
        else{
            teacher.isVerified=true
            await teacher.save()
            res.redirect('/home/teacher')
            
        }
    } catch (error) {
        res.send({error})
        throw new Error(error)
    }
})


router.get('/verify/coaching/:id',async (req,res)=>{
    try {
        const coaching = await Coaching.findById(req.params.id);
        if(coaching.isVerified)
        return res.redirect('/home/coaching')
        else{
            coaching.isVerified=true
            await coaching.save()
            res.redirect('/home/coaching')
            
        }
    } catch (error) {

        res.send(error)
        throw new Error(error)
    }
})


router.get('/verify/student/:id',async (req,res)=>{
    try {
        const student = await Student.findById(req.params.id);
        if(student.isVerified)
        return res.redirect('/home/student')
        else{
            student.isVerified=true
            await student.save()
            res.redirect('/home/student')
            
        }
    } catch (error) {
        
    }
})

module.exports = router