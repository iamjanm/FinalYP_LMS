import { Router } from 'express';
import {
  getAllAssessments,
  getAssessmentById,
  createAssessment,
  updateAssessment,
  removeAssessment,
  submitAssessment,
  getSubmissions,
  gradeSubmission,
} from '../controllers/assessment.controllers.js';

import { isLoggedIn, authorizedRoles } from '../middlewares/auth.middlewares.js';
import upload from '../middlewares/multer.middleware.js';

const router = Router();

// Public
router.get('/', getAllAssessments);
router.get('/:id', isLoggedIn, getAssessmentById);

// Student submit (with optional file)
router.post('/:id/submit', isLoggedIn, upload.single('file'), submitAssessment);

// Admin protected
router.post('/', isLoggedIn, authorizedRoles('ADMIN'), createAssessment);
router.put('/:id', isLoggedIn, authorizedRoles('ADMIN'), updateAssessment);
router.delete('/:id', isLoggedIn, authorizedRoles('ADMIN'), removeAssessment);
router.get('/:id/submissions', isLoggedIn, authorizedRoles('ADMIN'), getSubmissions);
router.post('/:id/grade', isLoggedIn, authorizedRoles('ADMIN'), gradeSubmission);

export default router;