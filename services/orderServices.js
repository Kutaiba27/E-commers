/* eslint-disable no-undef */

import { Stripe } from 'stripe'
import asyncHandler from 'express-async-handler'

import { UserModel } from '../models/userModel.js'
import { CartModel } from '../models/cartModel.js';
import { OrderModel } from '../models/orderModel.js';
import { ApiError } from '../utility/apiError.js';
// import { ProductModel } from '../models/productModel.js';
import { getAll, getItem } from './handerFactory.js';
import { RepositoryModel } from '../models/repoModel.js'
import { InvoicesModel } from '../models/invoicesModel.js';
import { sendEmail } from '../utility/sendEmail.js';



export const createCashOrder = asyncHandler(async (req, res) => {

   let shippingPrice = 0, taxPrice = 0;

   const cart = await CartModel.findOne({ _id: req.params.cartId });
   if (!cart) {
      throw new ApiError(" there is no cart")
   }
   const cartPrice = cart.totalPriceAfterDiscount ? cart.totalPriceAfterDiscount : cart.totalPrice;
   const totalOrderPrice = cartPrice + shippingPrice + taxPrice;
   const order = await OrderModel.create({
      user: req.user._id,
      cartItems: cart.cartItems,
      totalPrice: totalOrderPrice,
      shippingAddress: req.body.shippingAddress,
   })

   if (order) {
      const bulkOption = cart.cartItems.map((item) => ({
         updateOne: {
            filter: { _id: item.product },
            update: { $inc: { currantQuantity: -item.quantity, salesQuantity: +item.quantity } }
         }
      }))
      await RepositoryModel.bulkWrite(bulkOption, {})
      await CartModel.findByIdAndDelete(req.params.id)
   }
   res.status(201).json({ stauts: " successfully" })
})

export const filterOrderOr = (req, res, next) => {
   if (req.user.role == 'user') {
      req.filterSub = { user: req.user._id }
   }
   next()
}

export const getAllOrders = getAll(OrderModel)

export const getOneOrder = getItem(OrderModel)

export const updateDeliverOrder = asyncHandler(async (req, res) => {
   let order = await OrderModel.findById(req.params.OrderId)
   if (!order) {
      throw new ApiError("there is no order with id", 404)
   }
   order.status = req.body.status;
   if(req.body.status == "delivered") {
      order.deliveredDate = Date.now();
   }
   const user = await UserModel.findById(order.user)
   await sendEmail({
      email: user.email, 
      subject: "Order updated status",
      text: `Order status update to ${req.body.status}`
   })
   order = await order.save();
   res.status(201).json({ data: order })
})

export const updatePayOrder = asyncHandler(async (req, res) => {
   let order = await OrderModel.findById(req.params.OrderId)
   if (!order) {
      throw new ApiError("there is no order with id", 404)
   }
   order.isPaid = true;
   order.paidDate = Date.now();
   order = await order.save();
   res.status(201).json({ data: order })
})

// export const checkoutSession = asyncHandler(async (req, res) => {
//    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

//    let shippingPrice = 0, taxPrice = 0;

//    const cart = await CartModel.findOne({ _id: req.params.cartId });
//    if (!cart) {
//       throw new ApiError(" there is no cart")
//    }
//    const cartPrice = cart.totalPriceAfterDiscount ? cart.totalPriceAfterDiscount : cart.totalPrice;
//    const totalOrderPrice = cartPrice + shippingPrice + taxPrice;
//    const session = await stripe.checkout.sessions.create({
//       line_items: [
//          {
//             price_data: {
//                unit_amount: totalOrderPrice * 100,
//                currency: 'egp',
//                product_data: {
//                   name: req.user.name,
//                }
//             },
//             quantity: 1,
//          },
//       ],
//       mode: 'payment',
//       success_url: `${req.protocol}://${req.get('host')}/api/v1/order`,
//       cancel_url: `${req.protocol}://${req.get('host')}/api/v1/cart`,
//       customer_email: req.user.email,
//       client_reference_id: req.params.cartId,
//       metadata: req.body.shippingAddress,
//    });
//    res.status(200).json({ status: 'success', data: session })
// })
export const checkoutSession = asyncHandler(async (req,res)=>{
      let shippingPrice = 0, taxPrice = 0;
   
   const cart = await CartModel.findOne({ _id: req.params.cartId });
   if (!cart) {
      throw new ApiError(" there is no cart")
   }
   const user = await UserModel.findById(req.user.id)
   const cartPrice = cart.totalPriceAfterDiscount ? cart.totalPriceAfterDiscount : cart.totalPrice;
   const totalOrderPrice = cartPrice + shippingPrice + taxPrice;
   const orderInfo = {
      cartId: cart._id,
      amount_total:totalOrderPrice,
      customer_email: user.email,
      customer_id: user._id
   }
   const result = await createCardOrder(orderInfo)
   res.status(200).json({data:{
      message:" order create successfully",
      result
   }})
})

const createCardOrder = async (session) => {
   
   const cartId = session.cartId;
   const shippingAddress = session.metadata;
   const oderPrice = session.amount_total ;
   const cart = await CartModel.findById(cartId);
   const user = await UserModel.findOne({ email: session.customer_email });
   const order = await OrderModel.create({
      user: user._id,
      cartItems: cart.cartItems,
      shippingAddress,
      totalOrderPrice: oderPrice,
      isPaid: true,
      paidAt: Date.now(),
      status: "initail",
      paymentMethodType: 'card',
   });
   await UserModel.findOneAndUpdate({_id: session.customer_id},{totalPurchases: user.totalPurchases + oderPrice})
   console.log(cart)
   if (order) {
      const bulkOptionPromises = cart.cartItems.map(async (item) => {
         const priceInInvoice = await InvoicesModel.findOne({productId: item.product}).select('price');
         const income = item.price - priceInInvoice.price;
         const product = await RepositoryModel.findOne({productId:item.product});
         const remainBox = (product.currantQuantity - item.quantity) / product.productInBox;
         return {
            updateOne: {
               filter: { productId: item.product },
               update: { 
                     currantQuantity: product.currantQuantity-item.quantity, 
                     salesQuantity: product.salesQuantity+item.quantity, 
                     netIncome: income,
                     numberOfBox: product.numberOfBox - Math.floor(remainBox),
               },
            },
         };
      });
      
      const bulkOption = await Promise.all(bulkOptionPromises);
      console.log(bulkOption)
      await RepositoryModel.bulkWrite(bulkOption, {});
      await CartModel.findByIdAndDelete(cartId);
      return {order: order, result: true};
   }
};

export const webhookCheckout = asyncHandler(async (req, res) => {
   const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

   const sig = req.headers['stripe-signature'];
   let event;
   try {
      event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
   } catch (err) {
      return res.status(400).send(`Webhook Error: ${err.message}`);
   }
   if( event.type == 'checkout.session.completed'){
      createCardOrder(event.data.object)
   }
   res.status(200).json({ received: true });

})

