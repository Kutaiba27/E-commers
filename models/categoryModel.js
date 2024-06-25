import { Schema, model } from "mongoose";

const CategorySchema = new Schema({
   name:{
      type: String,
      required: [true, "The Category Required"],
      unique: [true, "name mest be unique"],
      minlength: [3, "Too Short Category Name"],
      maxlength: [32, "Too long Category Name"]
   },
   slug:{
      type: String,
      lowercase: true
   },
   image: String
},{
   timestamps: true
})

const setCategoryImage = (doc)=>{
   if(doc.image){
      // eslint-disable-next-line no-undef
      const imageUrl = `${process.env.BASE_URL}/category/${doc.image}`
      doc.image = imageUrl;
   }
}

CategorySchema.post('init',(doc)=>{
   setCategoryImage(doc)
})

CategorySchema.post('save',(doc)=>{
   setCategoryImage(doc)
})

const CategoryModel = model('category',CategorySchema)

export { CategoryModel }