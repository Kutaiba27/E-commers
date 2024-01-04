/* eslint-disable no-undef */
import asyncHandler from "express-async-handler"
import jwt from 'jsonwebtoken'
import bycrpt from "bcryptjs"
import { UserModel } from '../models/userModel.js'
import { ApiError } from "../utility/apiError.js"

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

export const logIn = asyncHandler( async (req, res) => {

   const user = await UserModel.findOne({email: req.body.email})

   if(!user || !(await bycrpt.compare(req.body.password, user.password))){
      return next(new ApiError("Incorrect password or email"))
   }
   const token = generateToken(user.email,user.id)
   res.status(201).json({user: user, token: token})
}) 

export const protect = asyncHandler( async (req, res,next)=>{
   
   let token;
   if( req.headers['authorization'] || (req.headers['authorization'].startsWith('bearer'))){
      token = req.headers['authorization'].split(' ')[1]
   }
   if( !token ){
      return next(new Error('you not logedin please login first and try again'),401);
   }
   console.log(token)
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