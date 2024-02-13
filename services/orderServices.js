/* eslint-disable no-undef */

import { Stripe } from 'stripe'
import asyncHandler from 'express-async-handler'

import { CartModel } from '../models/cartModel.js';
import { OrderModel } from '../models/orderModel.js';
import { ApiError } from '../utility/apiError.js';
import { ProductModel } from '../models/productModel.js';
import { getAll, getItem } from './handerFactory.js';



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
            update: { $inc: { quantity: -item.quantity, sold: +item.quantity } }
         }
      }))
      await ProductModel.bulkWrite(bulkOption, {})
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
   order.isDelivered = true;
   order.deliveredDate = Date.now();
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

export const checkoutSession = asyncHandler(async (req, res) => {
   const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

   let shippingPrice = 0, taxPrice = 0;

   const cart = await CartModel.findOne({ _id: req.params.cartId });
   if (!cart) {
      throw new ApiError(" there is no cart")
   }
   const cartPrice = cart.totalPriceAfterDiscount ? cart.totalPriceAfterDiscount : cart.totalPrice;
   const totalOrderPrice = cartPrice + shippingPrice + taxPrice;

   const session = await stripe.checkout.sessions.create({
      line_items: [
         {
            price_data: {
               unit_amount: totalOrderPrice * 100,
               currency: 'egp',
               product_data: {
                  name: req.user.name,
               }
            },
            quantity: 1,
         },
      ],
      mode: 'payment',
      success_url: `${req.protocol}://${req.get('host')}/api/v1/order`,
      cancel_url: `${req.protocol}://${req.get('host')}/api/v1/cart`,
      customer_email: req.user.email,
      client_reference_id: req.params.cartId,
      metadata: req.body.shippingAddress,
   });
   res.status(200).json({ status: 'success', data: session })
})
const createCardOrder = async (session) => {
   const cartId = session.client_reference_id;
   const shippingAddress = session.metadata;
   const oderPrice = session.amount_total / 100;

   const cart = await Cart.findById(cartId);
   const user = await User.findOne({ email: session.customer_email });

   // 3) Create order with default paymentMethodType card
   const order = await Order.create({
      user: user._id,
      cartItems: cart.cartItems,
      shippingAddress,
      totalOrderPrice: oderPrice,
      isPaid: true,
      paidAt: Date.now(),
      paymentMethodType: 'card',
   });

   // 4) After creating order, decrement product quantity, increment product sold
   if (order) {
      const bulkOption = cart.cartItems.map((item) => ({
         updateOne: {
            filter: { _id: item.product },
            update: { $inc: { quantity: -item.quantity, sold: +item.quantity } },
         },
      }));
      await Product.bulkWrite(bulkOption, {});

      // 5) Clear cart depend on cartId
      await Cart.findByIdAndDelete(cartId);
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

