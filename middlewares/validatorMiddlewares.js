import { validationResult } from "express-validator";

export const validatorMiddleware =  (req, res,next) => {
   const error = validationResult(req);
   if (!error.isEmpty()) {
      return res.status(400).json({error: error.array()});
   }
   next();
}