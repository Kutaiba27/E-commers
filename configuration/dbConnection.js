/* eslint-disable no-undef */

import mongoose from 'mongoose'

const mongoConnection = ()=>{

   mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/e-commerce',{
      serverApi:{
         version: "1",
         deprecationErrors: true,
         strict: true
      },
   })
      .then(() => {
         console.log(`connected to database `);
      })
      .catch((error) => {
         console.log("Error In DataBase ", error);
         process.exit(1);
      });
}

export { mongoConnection }


