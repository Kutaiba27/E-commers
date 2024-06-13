

import { Router } from "express";

import { addRepository, deleteRepository, getAllRepository, updateRepository, aggregation, getItemRepo  } from '../services/repoServices.js'


const router = Router();

router.route('/')
      .get(getAllRepository)
      .post(addRepository)
      
router.get('/aggregation',aggregation)

router.route('/:id')
      .get(getItemRepo)
      .put(updateRepository)
      .delete(deleteRepository)

export {router as RepositoryRouter}
