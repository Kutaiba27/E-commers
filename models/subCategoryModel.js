import { Schema, model } from "mongoose";


const SubCategoryShcema = new Schema({
   name: {
      type:String,
      trim:true,
      unique: [true, "SubCategory Must Be Unique"],
      minlength: [2, "To Short SubCategory Name"],
      maxlength: [32,"To Long SubCategory Name"]
   },
   slug: {
      type:String,
      lowercase:true,
   },
   category: {
      type: Schema.ObjectId,
      ref:'Category',
      required:[true, "SubCategort Must Be Belong To Parant Category"]
   }
},{timeseries:true})

const SubCategoryModel = model("SubCategory", SubCategoryShcema)

export { SubCategoryModel }