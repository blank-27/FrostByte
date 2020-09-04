const User = require('./db/modals/students')
const Teacher = require('./db/modals/teachers')
const bcrypt = require('bcrypt')

module.exports = function(passport){
    var localStrategy = require('passport-local').Strategy
 passport.use('user',new localStrategy({usernameField:'email'},(username,password,done)=>{
    User.findOne({email:username},(err,data)=>{
        if(err) throw err;
        if(!data)
        {
            return done(null,false,{message:"no such user is exited"})
        }
        bcrypt.compare(password,data.password,(err,match)=>{
            if(err)
            {
                return done(null,false);
            }
            else if (!match)
            {
                return done(null,false,{message:"password doesn't matched"})
            }
            if(match)
            {
                return done(null,data);
            }
        })
    })
 }))
 passport.use('teacher',new localStrategy({usernameField:'email'},(username,password,done)=>{
    Teacher.findOne({email:username},(err,data)=>{
        if(err) throw err;
        if(!data)
        {
            return done(null,false,{message:"no such user is exited"})
        }
        bcrypt.compare(password,data.password,(err,match)=>{
            if(err)
            {
                return done(null,false);
            }
            else if (!match)
            {
                return done(null,false,{message:"password doesn't matched"})
            }
            if(match)
            {
                return done(null,data);
            }
        })
    })
 }))

 passport.serializeUser((user,cb)=>{
     key={
         id:user.id,
         type:user.userType
     }
     console.log(user.userType)
     cb(null,key)
 })

 passport.deserializeUser((key,cb)=>{
     var Model =key.type === 'Student'?User:Teacher;
     Model.findById(key.id,(err,user)=>{
         cb(err,user)
     })
 })
}