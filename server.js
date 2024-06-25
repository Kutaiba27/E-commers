/* eslint-disable no-undef */
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';

import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import cors from 'cors';
import rateLimit from "express-rate-limit";
import compression from 'compression';
import hpp from 'hpp'
import mongoSanitize from 'express-mongo-sanitize'
import xss from 'xss-clean'

import { mongoConnection } from './configuration/dbConnection.js';
import { ApiError } from "./utility/apiError.js";
import { globalError } from "./middlewares/errorMiddlewares.js";
import { mountRoutes } from './routes/index.js';
import { webhookCheckout } from './services/orderServices.js'

dotenv.config({ path: 'config.env' });
mongoConnection();

const app = express();
const limiter = rateLimit({
   windowMs: 15 * 60 * 1000,
   max: 100,
   message: " Too mush requests, Please tray again after one hour"
})

app.use('/api', limiter)
app.use(cors());
app.options("*",cors());
app.use(compression());
app.use(express.json({limit: "20000k"}));
//clean the request from the noSQL Injection and the script and the 
app.use(mongoSanitize())
app.use(xss())
app.use(hpp({whitelist: ["price"]}))
app.use(express.static(path.join(dirname(fileURLToPath(import.meta.url)), '/uploads/')));




app.use(express.static(path.join(dirname(fileURLToPath(import.meta.url)), '/uploads/')));
if (process.env.NODE_ENV === "development") {
   app.use(morgan("dev"));
}
app.post('/webhook-checkout',express.raw({type: 'application/json'}),webhookCheckout)

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
      console.log('shutting down application');
      process.exit(1);
   });
})




