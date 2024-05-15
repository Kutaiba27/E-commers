import { Router } from "express";
import { addProductToWishList, getWishList, removeProductToWishList } from "../services/wishlistServices.js";
import { addWishListValidator, removeWishListValidator} from "../utility/validators/wishListValidation.js"
import { protect, allowTo } from "../services/authServices.js";

const router = Router();

router.use(protect, allowTo('user'));


router.route('/')
   .post(addWishListValidator, addProductToWishList)
   .get(getWishList)

router.delete('/:idProduct',removeWishListValidator, removeProductToWishList)

export { router as WishListRouter }