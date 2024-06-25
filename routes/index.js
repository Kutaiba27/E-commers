
import { CategoryRouter } from './categoryRouters.js'
import { SubCategoryRouter } from './subCategoryRouters.js'
import { BrandRouter } from './brandRoutes.js'
import { ProductRouter } from './productRoutes.js'
import { UserRouter } from './userRoutes.js'
import { AuthRouter } from './authRoutes.js';
import { ReviewRouter } from './reviewRoutes.js';
import { WishListRouter } from './wishlistRoutes.js';
import { AddressRouter } from './addressRoutes.js';
import { CouponRouter } from './couponRoutes.js';
import { CartRouter } from './cartRoutes.js';
import { OrderRouter } from './orderRoutes.js'
import { SupplierRouter } from './supplierRoutes.js'
import { InvoicesRouter } from './invoiceRoutes.js'
import { RepositoryRouter } from './repoRouter.js'
import { dashbourdRouter } from './dashbourdRouter.js'

// import  data from "../utility/dummyData/products.json" assert { type: "json" };

export const mountRoutes = (app)=>{
   app.use("/api/v1/categories", CategoryRouter);
   app.use("/api/v1/supplier", SupplierRouter);
   app.use("/api/v1/brand", BrandRouter);
   app.use("/api/v1/product", ProductRouter);
   app.use("/api/v1/subcategories", SubCategoryRouter);
   app.use("/api/v1/user", UserRouter);
   app.use("/api/v1/auth", AuthRouter)
   app.use("/api/v1/review", ReviewRouter);
   app.use("/api/v1/wishlist",WishListRouter)
   app.use("/api/v1/address",AddressRouter);
   app.use("/api/v1/coupon", CouponRouter);
   app.use("/api/v1/cart", CartRouter);
   app.use("/api/v1/order", OrderRouter);
   app.use("/api/v1/repo", RepositoryRouter);
   app.use("/api/v1/invoice", InvoicesRouter);
   app.use("/api/v1/dashbourd", dashbourdRouter);

}