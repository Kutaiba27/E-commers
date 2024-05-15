import { v4 as uuidV4 } from 'uuid'
import sharp from 'sharp'
import asyncHandler from 'express-async-handler'
import bcrypt from 'bcryptjs'

import { uploadSingleImage } from '../middlewares/uploadImageMiddlewares.js'
import { ApiError } from '../utility/apiError.js'
import { UserModel } from "../models/userModel.js" 
import { createItem, getItem, getAll } from './handerFactory.js'

export const uploadUserImages = uploadSingleImage("profileImage")

export const resizingUserImage = asyncHandler( async (req, res, next)=>{

   const filename = `user-${uuidV4()}-${Date.now()}.jpeg`

   if(req.file){
      await sharp(req.file.buffer)
         . resize(600, 600)
         .toFormat("jpeg")
         .jpeg({quality: 90})
         .toFile(`uploads/user/${filename}`)
      req.body.profileImage = filename;
   }
   next();
})

export const createUser = createItem(UserModel)

export const getUsers = getAll(UserModel)

export const getUser = getItem(UserModel)

export const updateUser = asyncHandler(async (req, res, next) => {

   const document = await UserModel.findOneAndUpdate(
      { _id: req.params.id },
      {
         name: req.body.name,
         slug: req.body.slug,
         phone: req.body.phone,
         email: req.body.email,
         profileImage : req.body.profileImage,
         role: req.body.role
      },
      { new: true }
   );
   if (!document) {
      return next(new ApiError("There Are Problem Or This item Is Not Exist", 400))
   }
   res.status(200).json({ data: document });
})

export const changePassword = asyncHandler( async (req, res, next)=>{
   const document = await UserModel.findOneAndUpdate(
      { _id: req.params.id },
      {
         password: await bcrypt.hash(req.body.newPassword, 12),
         passwordChangeAt: Date.now()
      },
      { new: true }
   );
   if (!document) {
      return next(new ApiError("There Are Problem In Update The Password ", 500))
   }
   res.status(201).json({message: "Password Updated Successfully"})
})

export const deleteUser = asyncHandler(async(req,res)=>{
   const result = await UserModel.deleteOne({email:req.body.email})
   if(!result){
      throw new ApiError("invalit email for delete user", 404 )
   }
   res.status(200).json({message:"delete done successfully"})
})



