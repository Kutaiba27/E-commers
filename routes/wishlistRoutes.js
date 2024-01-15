import { Router } from "express";
import { addProductToWishList, getWishList, removeProductToWishList } from "../services/wishlistServices.js";
import { protect, allowTo } from "../services/authServices.js";
const router = Router();

router.use(protect, allowTo('user'));


router.route('/')
   .post(addProductToWishList)
   .get(getWishList)

router.delete('/:idProduct',removeProductToWishList)

export { router as WishListRouter }