/* eslint-disable no-undef */

import mongoose from 'mongoose'

const mongoConnection = ()=>{

   mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1/e-commerce')
      .then(() => {
         console.log(`connected to database `);
      })
      .catch((error) => {
         console.log("Error In DataBase ", error);
         process.exit(1);
      });
}

export { mongoConnection }


