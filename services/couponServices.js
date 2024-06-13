
import { deleteItem, updateItem, createItem, getItem, getAll } from './handerFactory.js'
import { CouponModel } from '../models/couponModel.js'

export const createCoupon = createItem(CouponModel)

export const getCoupons = getAll(CouponModel)

export const getCoupon = getItem(CouponModel)

export const updateCoupon = updateItem(CouponModel)

export const deleteCoupon = deleteItem(CouponModel)
