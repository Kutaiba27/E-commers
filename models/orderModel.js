import { Schema, model } from "mongoose";

const orderSchema = new Schema({
   user: {
      type: Schema.ObjectId,
      ref: "User",
      required: [true, "the user must be required"]
   },
   cartItems: [
      {
         product:  {
            type: Schema.ObjectId,
            ref: 'product'
         },
         price: Number,
         quantity: Number,
         color: String
      }
   ],
   totalPrice: Number,
   shippingAddress: {
      details: String,
      phone: String,
      city: String,
      postMessage: String
   },
   taxPrice: {
      type: Number,
      default: 0
   },
   shippingPrice: {
      type: Number,
      default: 0
   },
   paymentMethods: {
      type: String,
      enum:["cash", "cart" ],
      default: "cash",
   },
   isPaid: {
      type: Boolean,
      default: false
   },
   paidDate: Date,
   isDelivered: {
      type: Boolean,
      default: false
   },
   deliveredDate: Date,
},{timestamps: true});

orderSchema.pre(/^find/, function(next){
   this.populate({path: 'user', select: 'name profileImage email phone'})
      .populate({path: 'cartItems.product', select: 'title imageCovered'})
   next()
})

export const OrderModel = model('Order', orderSchema);
