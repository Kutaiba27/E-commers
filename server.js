/* eslint-disable no-undef */
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';

import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import cors from 'cors';
import compression from 'compression';
import { mongoConnection } from './configuration/dbConnection.js';
import { ApiError } from "./utility/apiError.js";
import { globalError } from "./middlewares/errorMiddlewares.js";
import { mountRoutes } from './routes/index.js';
import { webhookCheckout } from './services/orderServices.js'


dotenv.config({ path: 'config.env' });
mongoConnection();

const app = express();
app.use(cors());
app.options("*",cors());
app.use(compression());
app.use(express.json({limit: "2000k"}));
app.use(express.static(path.join(dirname(fileURLToPath(import.meta.url)), '/uploads/')));

if (process.env.NODE_ENV === "development") {
   app.use(morgan("dev"));
}

app.post('/webhook-checkout',(req,res)=>{console.log("dkjkdj")},express.raw({type: 'application/json'}),webhookCheckout)

mountRoutes(app)

app.all('*', (req, res, next) => {
   next(new ApiError(`Can't find this route: ${req.originalUrl}`, 400));
});

app.use(globalError);

const server = app.listen(process.env.PORT, () => {
   console.log(`running on port ${process.env.PORT}`);
})

process.on('unhandledRejection', (error) => {
   console.log(`unhandledRejection ${error.name} ${error.message}`);
   server.close(() => {
      console.log('shuting down application');
      process.exit(1);
   });
})




