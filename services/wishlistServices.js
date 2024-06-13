import { UserModel } from "../models/userModel.js";
import asyncHandler from "express-async-handler";

export const addProductToWishList = asyncHandler(async (req, res) => {
   const user = await UserModel.findByIdAndUpdate(req.user._id,
      {
         $addToSet: { wishlist: req.body.product }
      },
      {new: true}
   )
   res.status(200).json({
      status: "successfully",
      message: "Product Add To WishList ",
      wishlist: user.wishlist
   })
})

export const removeProductToWishList = asyncHandler(async (req, res) => {
   const user = await UserModel.findByIdAndUpdate(req.user._id,
      {
         $pull: { wishlist: req.params.idProduct }
      },
      { new: true }
   )
   res.status(200).json({
      status: "successfull",
      message: "Procduct Removed From WishList",
      wishlist: user.wishlist
   })
})

export const getWishList = asyncHandler( async ( req, res ) => {
   const wishlist = await UserModel.findById(req.user._id).populate('wishlist')
   res.status(200).json({
      status: "successfull",
      data: wishlist
   })
})