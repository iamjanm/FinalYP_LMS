import { Router } from 'express';
import {
  getAllQuizzes,
  getQuizById,
  createQuiz,
  updateQuiz,
  removeQuiz,
  submitQuiz,
} from '../controllers/quiz.controllers.js';

import { isLoggedIn, authorizedRoles } from '../middlewares/auth.middlewares.js';

const router = Router();

// Public
router.get('/', getAllQuizzes);
router.get('/:id', getQuizById);
router.post('/:id/submit', submitQuiz);

// Admin protected
router.post('/', isLoggedIn, authorizedRoles('ADMIN'), createQuiz);
router.put('/:id', isLoggedIn, authorizedRoles('ADMIN'), updateQuiz);
router.delete('/:id', isLoggedIn, authorizedRoles('ADMIN'), removeQuiz);

export default router;
