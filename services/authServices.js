/* eslint-disable no-undef */
import asyncHandler from "express-async-handler"
import jwt from 'jsonwebtoken'
import bycrpt from "bcryptjs"
import { createHash } from "crypto"
import { UserModel } from '../models/userModel.js'
import { ApiError } from "../utility/apiError.js"
import { sendEmail } from "../utility/sendEmail.js"

const generateToken = (userEmail,userId)=> jwt.sign(
   {userEmail,userId},
   process.env.SECRET_KEY,
   {expiresIn: '1d' || process.env.EXPIRED_DATE} )

export const signUp = asyncHandler( async (req, res) => {
   const user = await UserModel.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
   })

   const token = generateToken(user.email,user._id)
   res.status(201).json({user: user, token: token})
}) 

export const logIn = asyncHandler( async (req, res, next) => {

   const user = await UserModel.findOne({email: req.body.email})

   if(!user || !(await bycrpt.compare(req.body.password, user.password))){
      return next(new ApiError("Incorrect password or email"))
   }
   const token = generateToken(user.email,user.id)
   res.status(201).json({user: user, token: token})
}) 

export const logOut = asyncHandler(async (req, res)=>{

   res.status(204).setHeader("authorization", "").json()
})

export const protect = asyncHandler( async (req, res,next)=>{
   
   let token ;

   if( req.headers['authorization'] || (req.headers['authorization'].startsWith('bearer'))){
      token = req.headers['authorization'].split(' ')[1]
   }
   if( !token || token == "null"){
      return next(new Error('you not logedin please login first and try again'),401);
   }   
   const decoded = jwt.verify(token, process.env.SECRET_KEY)
   const user = await UserModel.findById(decoded.userId)
   if( !user ){
      return next(new Error('you not logedin please login first and try'),401)
   }

   const timeChangedPassword = parseInt(user.passwordChangeAt.getTime()/1000,10)

   if(timeChangedPassword>=decoded.iat){
      return next(new Error('user resuntly changed password , please login angain'),401)
   }
   req.user = user
   next()

})

export const allowTo = (...roles)=>
   asyncHandler(
      (req,res,next)=>{
         if(!roles.includes(req.user.role)){
            return next(new ApiError('you are not allowed to access this route'),403)
         }
         next()
   })

export const forgetPassword = asyncHandler(async ( req, res, next )=>{
   let user = await UserModel.findOne({email: req.body.email})
   if (!user){
      return next(new ApiError("cant found this email please put the correct email"),404)
   }
   const resetCode = Math.floor(100000 + Math.random() * 900000).toString()
   const numberHashed = createHash('sha256').update(resetCode).digest('hex')
   user.resetPasswordHash = numberHashed
   user.resetPasswordExpiration = Date.now() + 10 * 60 * 1000
   user.resetPasswordVerification = false
   user = await user.save()

   const message = `hi Dear ${user.name} you reset code is ${resetCode} \n you welcome `

   try {
      await sendEmail({
         email: user.email,
         subject: "reset code for reset password and this code is valid for(10 minutes)",
         message
      })
   } catch (error) {
      user.resetPasswordHash = undefined
      user.resetPasswordExpiration = undefined
      user.resetPasswordVerification = undefined

      await user.save()
      return next(new ApiError("there is an error trying to send an email", 500))
   }
   res.status(200).json({status: "successfuly", message:" we send the reset code to you check your email please"})
})

export const verifyResetPasswordCode = asyncHandler( async (req, res)=>{

   const resetCode = req.body.resetCode;
   const hashedResetPassword = createHash('sha256').update(resetCode).digest('hex');

   const user = await UserModel.findOne({
      resetPasswordHash: hashedResetPassword,
      resetPasswordExpiration: { $gt: Date.now()}
   })
   if(!user){
      throw new ApiError("invalid reset code or expiration",400)
   }

   user.resetPasswordVerification = true
   await user.save();
   res.status(200).json({status: "successfuly", message:" verfiy the reset code is successfully"})
})

export const setNewPassword = asyncHandler( async (req, res)=> {

   const user = await UserModel.findOne({email: req.body.email})
   if(!user){
      throw new ApiError("in correct email",404)
   }
   if(!user.resetPasswordVerification){
      throw new ApiError("invalid rest code verfiction", 400)
   }
   user.resetPasswordExpiration = undefined; 
   user.resetPasswordHash = undefined; 
   user.resetPasswordVerification= undefined; 

   user.password = req.body.newpassword;

   await user.save();
   const token = generateToken(user.email, user.id)
   res.status(200).json({status: "successfuly", message:"change password successfully please login ", token})

})
