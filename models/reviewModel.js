
import { Schema, model } from "mongoose";
import { ProductModel } from "./productModel.js";
// import { ProductModel } from "./productModel.js";

const reviewSchema = new Schema({
   description: {
      type: String,
   },
   rate: {
      type: Number,
      min: [1,"the rate must be smaller than 1"],
      max: [5,"the rate must be greater than 5"],
   },
   user: {
      type: Schema.ObjectId,
      ref: "user",
      required: [true, "the review must be belongs to some user"]
   },
   product: {
      type: Schema.ObjectId,
      ref: "product",
      required: [true, "review must be belong to product"]
   }
}, { timestamps: true})

reviewSchema.pre(/^find/, function(next){
   this.populate({path: "user", select: "name _id"})
   next()
})

reviewSchema.statics.calcAverageRatingsAndQuantity = async function(idProcduct){
   const result = await this.aggregate([
      {$match: { product: idProcduct }},
      {$group: {
         _id: "product",
         avgRatings: { $avg: '$rate' },
         ratingsQuantity: { $count: {}},
      }}
   ])
   if(result.length > 0){
      await ProductModel.findByIdAndUpdate(idProcduct,{
         ratingsAverage: result[0].avgRatings,
         ratingsQuantity: result[0].ratingsQuantity
      })
   }else {
      await ProductModel.findByIdAndUpdate(idProcduct,{
         ratingsAverage: 0,
         ratingsQuantity: 0
      })
   }
}

reviewSchema.post('save', async function () {
   await this.constructor.calcAverageRatingsAndQuantity(this.product);
});

reviewSchema.post('remove', async function () {
   await this.constructor.calcAverageRatingsAndQuantity(this.product);
});

export const ReviewModel = model('review', reviewSchema);