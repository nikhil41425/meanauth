const express=require('express')
const router=express.Router()
const jwt=require('jsonwebtoken')
const passport = require('passport');
const config=require('../config/database')
const User=require('../models/user')

router.post('/register',(req,res,next)=>{

    let newUser=new User({
        name:req.body.name,
        email:req.body.email,
        username:req.body.username,
        password:req.body.password
    })

    User.addUser(newUser,(err,user)=>{
        if(err){
            res.json({success:false,message:'Registration Failed'})
        }else{
            res.json({success:true,message:"Registration Successfull"})
        }
    })

})
router.post('/authenticate',(req,res,next)=>{
    const username=req.body.username
    const password=req.body.password

    User.getUserByUsername(username,(err,user)=>{
        if(err) throw err;
        if(!user){
            return res.json({success:false,message:"user not found"})
        }

        User.comparePassword(password,user.password,(err,isMatch)=>{
            if(err) throw err;
            if(isMatch){
                const token=jwt.sign({data: user},config.secret,{
                    expiresIn:604800   //1 week
                })
                res.json({
                    success:true,
                    token:token,
                    user:{
                        id:user._id,
                        name:user.name,
                        username:user.username,
                        email:user.email
                    }
                })
            }else{
                return res.json({success:false,message:"wrong password"})
            }

           
        })
    })
})
// Profile
router.get('/profile', passport.authenticate('jwt', {session:false}), (req, res, next) => {
    res.json({user: req.user});
  });

module.exports=router


