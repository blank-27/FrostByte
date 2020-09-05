const router = require('express').Router()
const Student = require('../db/modals/students')
const Teacher = require('../db/modals/teachers')
const Coaching = require('../db/modals/coaching')
const Assignment = require('../db/modals/assignment')
const Qna = require('../db/modals/qna')
const Ans = require('../db/modals/ans')
const{checkAuthenticated,isVerified} = require('./middlewares/auth')


const cloudinary = require('cloudinary')
require('./middlewares/cloudinary')
const upload = require('./middlewares/multer')



router.get('/qna/public',checkAuthenticated, async (req,res)=>{
    try {
        const qna = await Qna.find({ })
          .populate('user', 'name avatar')
          .sort({ createdAt: 'desc' })
          .lean()
        res.render('qna', {
          qna
        })
      } catch (err) {
        console.error(err)
        res.render('error/500')
      } 

})

router.get('/qna/:_id',checkAuthenticated, async (req,res)=>{
    try {
        const id = req.params._id
        const qna = await Qna.findById(id)
          .populate('user','name avatar')
          .lean()
        const answers =await Ans.find({"question":id}).populate('user','name avatar').lean()
        res.render('qna-and-ans', {
          qna,answers
        })
      } catch (err) {
        console.error(err)
        res.render('error/500')
      } 

})

router.post('/qna/public', checkAuthenticated, upload.single('image'), async (req, res) => {
    try {
      if(req.file){
      const result = await cloudinary.v2.uploader.upload(req.file.path);
      req.body.image = result.secure_url}
      req.body.user = req.user.id
      await Qna.create(req.body)
      res.redirect('/qna/public')
    } catch (err) {
      console.error(err)
      res.render('error/500')
    }
})

router.post('/answer/:_id', checkAuthenticated, async (req, res) => {
    try {
        const id = req.params._id  
      req.body.user = req.user.id
      req.body.question = id
      await Ans.create(req.body)
      res.redirect('/qna/' + id)
    } catch (err) {
      console.error(err)
      res.render('error/500')
    }
})


module.exports = router; 