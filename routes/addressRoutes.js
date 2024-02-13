import { Router } from "express";
import { 
   addAddress,
   getAddress,
   removAddress
} from "../services/addressServices.js";

import { protect, allowTo } from "../services/authServices.js";
const router = Router();

router.use(protect, allowTo('user'));


router.route('/')
   .post(addAddress)
   .get(getAddress)

router.delete('/:idAddress',removAddress)

export { router as AddressRouter }