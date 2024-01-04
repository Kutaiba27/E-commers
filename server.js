/* eslint-disable no-undef */
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';

import express from 'express'
import dotenv from 'dotenv'
import morgan from 'morgan'

import { mongoConnection } from './configuration/dbConnection.js'
import { CategoryRouter } from './routes/categoryRouters.js'
import { SubCategoryRouter } from './routes/subCategoryRouters.js'
import { BrandRouter } from './routes/brandRoutes.js'
import { ProductRouter } from './routes/productRoutes.js'
import { ApiError } from "./utility/apiError.js";
import { globalError } from "./middlewares/errorMiddlewares.js";
import { UserRouter } from './routes/userRoutes.js'
import { AuthRouter } from './routes/authRoutes.js';

dotenv.config({ path: 'config.env' });
mongoConnection()

const app = express()
app.use(express.json())
app.use(express.static(path.join(dirname(fileURLToPath(import.meta.url)), '/uploads/')))

if (process.env.NODE_ENV === "development") {
   app.use(morgan("dev"))
}

app.use("/api/v1/categories", CategoryRouter);
app.use("/api/v1/subcategories", SubCategoryRouter);
app.use("/api/v1/brand", BrandRouter);
app.use("/api/v1/product", ProductRouter);
app.use("/api/v1/user", UserRouter);
app.use("/api/v1/auth", AuthRouter)

app.all('*', (req, res, next) => {
   next(new ApiError(`Can't find this route: ${req.originalUrl}`, 400));
});

app.use(globalError)

const server = app.listen(process.env.PORT, () => {
   console.log(`running on port ${process.env.PORT}`)
})

process.on('unhandledRejection', (error) => {
   console.log(`unhandledRejection ${error.name} ${error.message}`)
   server.close(() => {
      console.log('shuting down application')
      process.exit(1)
   })
})




