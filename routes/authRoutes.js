import { Router } from "express";

import { signUp, logIn, protect } from '../services/authServices.js'
import { signUserValidator, loginUserValidator } from "../utility/validators/authValidation.js";
const router = Router();

router.route('/signup').post(signUserValidator,signUp)
router.route('/login').post(loginUserValidator,logIn)
router.route('/protect').post(protect)

export { router as AuthRouter}