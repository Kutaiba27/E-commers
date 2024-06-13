
import asyncHandler from "express-async-handler";
import { CartModel } from "../models/cartModel.js";
import { ProductModel } from "../models/productModel.js";
import { CouponModel } from "../models/couponModel.js";
import { RepositoryModel } from "../models/repoModel.js";

const cartCalculator = async (cart,coupon)=>{
   let total = 0;
   cart.cartItems.forEach((item)=>{
      const totalPriceForItem = item.price * item.quantity;
      total += totalPriceForItem ;
   })
   cart.totalPrice = total;
   if(coupon){
      const coup = await CouponModel.findOne({name: coupon, expaired: {$gt: Date.now()}})
      if(!coup){
         cart.couponStatus = " the coupon is not available or expired "
         return;
      }
      console.log(coup.discount/100)
      console.log(total * 0.25)
      cart.totalPriceAfterDiscount = (total -  total * (coup.discount / 100)).toFixed(2);
   }
}

export const addProductToCart = asyncHandler(async (req, res)=>{
   const { productId, color } = req.body
   const product = await ProductModel.findOne({_id: productId})
   const prodRepo = await RepositoryModel.findOne({productId: product._id})
   let cart = await CartModel.findOne({user: req.user._id})
   if(!cart){
      cart = await CartModel.create({
         cartItems: [{product: product._id, color: color, price:prodRepo.price}],
         user: req.user._id
      })
      // cart.cartItems.push({product: product._id, color: color, price:product.price})
   }else {
      const productIndex = cart.cartItems.findIndex((item)=> item.product.toString() == productId && item.color.toString() == color)
      if( productIndex >= 0 ){
         cart.cartItems[productIndex].quantity += 1 ; 
      }else{
         cart.cartItems.push({product: product._id, color: color, price:prodRepo.price})
      }
   }
   await cartCalculator(cart,req.body.coupon)
   await cart.save();
   res.status(200).json({ numberOfItem: cart.cartItems.length, data: cart })

}) 

export const getProductInCart = asyncHandler( async (req,res)=>{
   const cart = await CartModel.findOne({user: req.user._id})
   if(!cart){
      res.status(404).json({message:"you have no cart"})
   }
   res.status(200).json({ numberOfItem: cart.cartItems.length, data: cart })
})

export const removeItemFromTheCart = asyncHandler( async (req, res)=>{
   let cart = await CartModel.findOneAndUpdate(
      {user: req.user._id},
      {$pull: {cartItems: {_id: req.params.id}}},
      {new: true,})
   await cartCalculator(cart,req.body.coupon)
   cart = await cart.save()
   res.status(200).json({ numberOfItem: cart.cartItems.length, data: cart })
}) 

export const clearCart = asyncHandler( async (req, res)=>{ 
   await CartModel.findOneAndDelete({user: req.user._id})
   res.status(204).json()
} )

export const updateItemQuantity = asyncHandler( async (req, res)=>{{
   const { quantity } = req.body;
   let cart = await CartModel.findOne({user: req.user._id})
   if(!cart){
      res.status(404).json({message: 'this item is not exists in cart'})
   }
   const cartItemIndex = cart.cartItems.findIndex((item)=> item._id.toString() == req.params.id)
   cart.cartItems[cartItemIndex].quantity = quantity;
   await cartCalculator(cart,req.body.coupon)
   cart = await cart.save()
   res.status(200).json({ numberOfItem: cart.cartItems.length, data: cart })

}})