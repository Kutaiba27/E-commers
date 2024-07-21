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
   numberOfBox: {
      type: Number,
   },
   productInBox: {
      type: Number
   },
   supplier: {
      type: Schema.ObjectId,
      ref: 'supplier'
   },
   productId: {
      type: Schema.ObjectId,
      ref: 'product'
   },
   invoice : [{
      type: Schema.ObjectId,
      ref: 'invoice'
   }],
   netIncome:{
      type: Number,
   }
},
{
   timestamps: true,
   toJSON : { virtuals: true },
   toObject: { virtuals: true}
})


export const RepositoryModel = model('repository', repoShema)