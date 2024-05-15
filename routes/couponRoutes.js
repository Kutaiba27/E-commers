import { Router } from "express";
import { 
   createCoupon,
   deleteCoupon,
   getCoupon,
   getCoupons,
   updateCoupon 
   } from "../services/couponServices.js";
import { allowTo, protect } from "../services/authServices.js";

const router = Router();

router.use(protect,allowTo('user','maneger',"admin"));

router.route('/')
   .get(getCoupons)
   .post(createCoupon)

router.route('/:id')
   .get(getCoupon)
   .put(updateCoupon)
   .delete(deleteCoupon)

   export { router as CouponRouter } 