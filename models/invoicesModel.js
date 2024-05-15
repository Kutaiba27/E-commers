import { Schema, model } from 'mongoose'

const invoiceShcema = new Schema({
   productId: {
      type: Schema.ObjectId,
      red: 'product'
   },
   supplierId: {
      type: Schema.ObjectId,
      ref: 'supplier'
   },
   quantity: {
      type: Number,
      required: true
   },
   price: {
      type: Number,
      required: true
   },
   totalPrice: {
      type: Number,
      required: true
   }
},{
   timestamps: true,
})

export const InvoicesModel = model('invoice',invoiceShcema)