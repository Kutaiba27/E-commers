

import { UserModel } from "../models/userModel.js";
import asyncHandler from "express-async-handler";

export const addAddress = asyncHandler(async (req, res) => {
   const user = await UserModel.findByIdAndUpdate(req.user._id,
      {
         $addToSet: { address: req.body }
      },
      { new: true }
   )
   res.status(200).json({
      status: "successfull",
      message: "Address Add To WishList ",
      address: user.address
   })
})

export const removAddress = asyncHandler(async (req, res) => {
   const user = await UserModel.findByIdAndUpdate(req.user._id,
      {
         $pull: { address: { _id: req.params.idAddress }}
      },
      { new: true }
   )
   res.status(200).json({
      status: "successfull",
      message: "Address Removed From WishList",
      address: user.address
   })
})

export const getAddress = asyncHandler( async ( req, res ) => {
   const address = await UserModel.findById(req.user._id).populate('address')
   res.status(200).json({
      status: "successfull",
      data: address
   })
})