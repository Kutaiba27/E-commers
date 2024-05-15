import { Schema, model } from "mongoose";

const repoShema = new Schema({
   currantQuantity: {
      type: Number,
      required: true
   },
   totalQuantity: {
      type:Number,
      required:true
   },
   lastAddQuantity: {
      type: Number,
      default:0,
      required:true
   },
   price: {
      type: Number
   },
   salesQuantity: {
      type: Number,
      default:0,
      required: true
   },
   supplier: {
      type: Schema.ObjectId,
      ref: 'supplier'
   },
   productId: {
      type: Schema.ObjectId,
      ref: 'product'
   },
   invoice : {
      type: Schema.ObjectId,
      ref: 'invoice'
   },
   netIncome:{
      type: Number,
   }
},
{
   timestamps: true,
})


export const RepositoryModel = model('repository', repoShema)