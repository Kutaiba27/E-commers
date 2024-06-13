
import { Router } from "express";

import {
   createUser,
   deleteUser,
   getUser,
   getUsers,
   resizingUserImage,
   updateUser,
   uploadUserImages,
   changePassword,
} from "../services/userServices.js"

import {
   createUserValidator,
   deleteUserValidator,
   getUserValidator,
   updateUserValidator,
   changUserPasswordValidator
} from "../utility/validators/userValidation.js"

import { protect, allowTo } from "../services/authServices.js";

const router = Router({ mergeParams: true });

router.put('/changePassword/:id',changUserPasswordValidator,changePassword)

router.route('/')
   .get(
      protect,
      allowTo("admin","maneger"),
      getUsers
      )
   .post(
      protect,
		allowTo('manger'),
      uploadUserImages,
      resizingUserImage,
      createUserValidator, 
      createUser
      )
   .delete(
      protect, 
      allowTo('manger'), 
      deleteUser
      );

router.route('/:id')
   .get(
      protect,
		allowTo('manger'),
      getUserValidator, 
      getUser
      )
   .put(
      protect,
		allowTo('manger'),
      uploadUserImages, 
      resizingUserImage, 
      updateUserValidator, 
      updateUser
      );

export { router as UserRouter };