import { Schema, model } from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new Schema({
   name:{
      type: String,
      trim: true,
      required: [true, "User Must Be Required"]
   },
   slug:{
      type: String,
      lowercase: true,
   },
   email: {
      type: String,
      trim:true,
      required: [true, "Email Must Be Required"],
      unique: true,
      lowercase: true
   },
   phone: String,
   profileImage: String,
   password: {
      type: String,
      required: [true, "Password Must Be Required"],
      minlength:[8, "Password must be at least"]
   },
   passwordChangeAt: {
      type: Date,
      default: Date.now()
   },
   role: {
      type: String,
      enum: ["admin", "user"],
      default: "user"
   },
   active: {
      type: Boolean,
      default: true
   }
},{timeseries:true})

userSchema.pre('save', async function(next){
   if(!this.isModified) return next();
   this.password = await bcrypt.hash(this.password, 12)
   next();
})

export const UserModel = model("User",userSchema)