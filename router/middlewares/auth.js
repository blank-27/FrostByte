const checkAuthenticated =(req,res,next)=>{
    if(req.isAuthenticated())
    {
        res.set('Cache-control','no-cache,private,no-store,must-revalidate,post-check=0,pre-check=0');
        return next();
    }
    else{
        res.redirect('/login');
    }
}

const loginCheck = (req,res,next)=>{
    if(req.isAuthenticated())
    {
        if(req.user.userType=="Teacher")
        res.redirect('/home/teacher')
        else
        res.redirect('/home/student')
    }
    else{
        return next()
    }
}

const isVerified = (req,res,next)=>{
    // if(req.user.isVerified)
    next()
    // else
    // res.redirect('/verify')
}



module.exports = {checkAuthenticated,loginCheck,isVerified}