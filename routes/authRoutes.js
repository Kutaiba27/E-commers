import { Router } from "express";
import {
   signUp,
   logIn,
   forgetPassword,
   verifyResetPasswordCode,
   setNewPassword,
   logOut,
   protect
} from '../services/authServices.js'

import {
   signUserValidator,
   loginUserValidator
} from "../utility/validators/authValidation.js";
const router = Router();

router.post('/signup', signUserValidator, signUp)
router.post('/login', loginUserValidator, logIn)
router.post('/forgetpassword', forgetPassword)
router.post('/veriryresetcode', verifyResetPasswordCode)
router.put('/setnewpassword', setNewPassword)
router.get('/logOut',protect, logOut)

export { router as AuthRouter }