/* eslint-disable no-undef */
import { Schema, model } from "mongoose";

const ProductShcema = new Schema({
   title: {
      type: String,
      required: true,
      trim: true,
      minlength: [3, "To Shourt Titile"],
      maxlength: [100, "To Long Titile"]
   },
   slug: {
      type: String,
      required: true,
      lowercase: true
   },
   description: {
      type: String,
      required: true,
      minlength: [20, "To Shourt Description"],
   },
   // quantity: {
   //    type: Number,
   //    required: true,
   // },
   // sold: {
   //    type: Number,
   //    default: 0
   // },
   // price: {
   //    type: Number,
   //    trim: true,
   //    required: true,
   //    max: [20000, "To Long price"],
   // },
   priceAfterDiscount: {
      type: Number,
   },
   colors: {
      type: [String]
   },
   images: {
      type: [String],
   },
   imageCovered: {
      type: String,
      required: [true, 'Prudect Image Caver Is Required']
   },
   category: {
      type: Schema.ObjectId,
      ref: "category",
      required: [true, " Prodect Must Belongs To Category"],
   },
   repoInfo:{
      type: Schema.ObjectId,
      ref:"repository"
   }
   ,
   subCategory: {
      type: [Schema.ObjectId],
      ref: "subCategory",
   },
   brand: {
      type: Schema.ObjectId,
      ref: "brand",
   },
   ratingsAverage: {
      type: Number,
      min: [0, "Rating Must be above Or equal 0"],
      max: [5, "Rating Must be below or equal 5"],
      default: 0
   },
   ratingsQuantity: {
      type: Number,
      default: 0
   }
}, {
      timestamp: true,
      toJSON : { virtuals: true },
      toObject: { virtuals: true}
   }
)

ProductShcema.virtual("reviews", {
   ref: "review",
   foreignField: "product",
   localField: "_id"
})

const setProdactImage = (doc)=>{
   if(doc.imageCovered){
      const imageUrl = `${process.env.BASE_URL}/products/${doc.imageCovered}`
      doc.imageCovered = imageUrl;
   }
   if(doc.images){
      const imagesList = [];
      doc.images.forEach((image)=>{
         const imageUrl = `${process.env.BASE_URL}/products/${image}`
         imagesList.push(imageUrl);
      })
      doc.images = imagesList
   }
}

ProductShcema.post('init',(doc)=>{
   setProdactImage(doc)
})

ProductShcema.post('save',(doc)=>{
   setProdactImage(doc)
})

ProductShcema.pre(/^find/, function (next){
   this.populate({path: 'category', select: "name _id"})
   next()
})

export const ProductModel = model("product", ProductShcema);
