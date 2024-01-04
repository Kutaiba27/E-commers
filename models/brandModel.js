

import { Schema, model } from "mongoose";


const BrandShcema = new Schema({
   name: {
      type:String,
      trim:true,
      unique: [true, "Brand Must Be Unique"],
      minlength: [2, "To Short Brand Name"],
      maxlength: [32,"To Long Brand Name"]
   },
   slug: {
      type:String,
      lowercase:true,
   },
   image: String
},{timeseries:true})

const imageUrlModified = (doc)=>{
   if(doc.image){
      // eslint-disable-next-line no-undef
      const imageUrl = `${process.env.BASE_URL}/brand/${doc.image}`
      doc.image = imageUrl;
   }
}

BrandShcema.post('init',(doc)=>{
   imageUrlModified(doc)
})

BrandShcema.post('save',(doc)=>{
   imageUrlModified(doc)
})


const BrandModel = model("Brand", BrandShcema)

export { BrandModel }