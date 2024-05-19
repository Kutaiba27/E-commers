import { Schema, model } from "mongoose";

const couponSchema = new Schema({
   name:{
      type: String,
      trim: true,
      required: [true, "the name must be required"],
      unique: true
   },
   expaired : {
      type: Date,
      required: [true, "the date must be required"]
   },
   discount : {
      type: Number,
      required: [true, "the discount must be required"]
   }
},{timeseries: true})

export const CouponModel = model("Coupon", couponSchema)