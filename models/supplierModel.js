
import { Schema, model } from 'mongoose'

const supplierSchema = new Schema({
   name: {
      type: String,
      required: true,
   },
   email: {
      type: String,
      required: true
   },
   phone: {
      type: String,
      required: true
   },
   counters: {
      type: String,
      required: true
   },
   supplierDescription :{
      type: String,
      required: true
   }
})

export const SupplierModel = model("supplier", supplierSchema)


