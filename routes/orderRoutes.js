
import { Router } from "express";

import {
   createCashOrder,
   filterOrderOr,
   getAllOrders,
   getOneOrder,
   updateDeliverOrder,
   updatePayOrder,
   checkoutSession
} from "../services/orderServices.js"

import { protect, allowTo } from "../services/authServices.js";

const router = Router()

router.route('/checkout-session/:cartId').post(protect, allowTo('user'), checkoutSession)

// router.use(protect, allowTo("user","admin","manger"))

router.route('/:cartId')
   .post(protect, allowTo("user"), createCashOrder)

router.route('/')
   .get(filterOrderOr, getAllOrders )

router.route("/:id")
.get(getOneOrder)

router.put("/:OrderId/pay", protect, allowTo("user","admin","manger"), updatePayOrder)
router.put("/:OrderId/deliverd", protect, allowTo("user","admin", "manger"), updateDeliverOrder)

export { router as OrderRouter }