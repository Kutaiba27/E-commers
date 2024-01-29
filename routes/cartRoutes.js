import { Router } from "express";
import { 
   addProductToCart,
   getProductInCart,
   removeItemFromTheCart,
   clearCart,
   updateItemQuantity
} from "../services/cartServices.js";
import { protect, allowTo } from "../services/authServices.js";
const router = Router();

router.use(protect, allowTo('user'));


router.route('/')
   .post(addProductToCart)
   .get(getProductInCart)
   .delete(clearCart)

router.route('/:id')
   .delete(removeItemFromTheCart)
   .put(updateItemQuantity)


export { router as CartRouter }