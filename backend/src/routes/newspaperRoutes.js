import express from 'express';
import { getNewspapers, createNewspaper, updateNewspaper, deleteNewspaper } from '../controllers/newspaperController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getNewspapers)
  .post(protect, createNewspaper);

router.route('/:id')
  .put(protect, updateNewspaper)
  .delete(protect, deleteNewspaper);

export default router;
