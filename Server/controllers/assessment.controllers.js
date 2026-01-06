import asyncHandler from '../middlewares/asyncHAndler.middleware.js';
import Assessment from '../models/assessment.model.js';
import AppError from '../utils/error.util.js';
import cloudinary from 'cloudinary';
import mongoose from 'mongoose';

/**
 * @GET_ALL_ASSESSMENTS - Public
 */
export const getAllAssessments = asyncHandler(async (req, res, next) => {
  const assessments = await Assessment.find({}).select('title description type dueDate totalMarks createdAt');
  res.status(200).json({ success: true, assessments });
});

/**
 * @GET_ASSESSMENT_BY_ID - returns assessment details including submissions for admin
 */
export const getAssessmentById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const assessment = await Assessment.findById(id);
  if (!assessment) return next(new AppError('Assessment not found', 404));

  // if admin, return full object including submissions
  if (req.user && String(req.user.role).toUpperCase() === 'ADMIN') {
    return res.status(200).json({ success: true, assessment });
  }

  // else, don't include other students' submissions
  const safe = assessment.toObject();
  safe.submissions = safe.submissions.filter((s) => String(s.student) === String(req.user?.id));

  res.status(200).json({ success: true, assessment: safe });
});

/**
 * @CREATE_ASSESSMENT - Admin
 */
export const createAssessment = asyncHandler(async (req, res, next) => {
  const { title, description, type, dueDate, totalMarks, createdBy } = req.body;
  if (!title) return next(new AppError('Title is required', 400));

  const assessment = await Assessment.create({ title, description, type: type || 'ASSIGNMENT', dueDate, totalMarks, createdBy });
  res.status(201).json({ success: true, message: 'Assessment created', assessment });
});

/**
 * @UPDATE_ASSESSMENT - Admin
 */
export const updateAssessment = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const assessment = await Assessment.findById(id);
  if (!assessment) return next(new AppError('Assessment not found', 404));
  Object.assign(assessment, req.body);
  await assessment.save();
  res.status(200).json({ success: true, message: 'Assessment updated', assessment });
});

/**
 * @DELETE_ASSESSMENT - Admin
 */
export const removeAssessment = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const assessment = await Assessment.findById(id);
  if (!assessment) return next(new AppError('Assessment not found', 404));
  await Assessment.findByIdAndDelete(id);
  res.status(200).json({ success: true, message: 'Assessment removed' });
});

/**
 * @SUBMIT_ASSESSMENT - Student submits an assignment (file or text)
 * Accepts: multipart/form-data with field 'file' OR 'submissionText'
 */
export const submitAssessment = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const assessment = await Assessment.findById(id);
  if (!assessment) return next(new AppError('Assessment not found', 404));

  // Ensure the requester is a student (not the admin token) and has a valid ObjectId
  if (!req.user || !req.user.id) return next(new AppError('Unauthenticated: please login to submit', 401));
  if (String(req.user.role).toUpperCase() === 'ADMIN') return next(new AppError('Admins cannot submit assessments', 403));

  const studentId = req.user.id;
  if (!mongoose.Types.ObjectId.isValid(studentId)) return next(new AppError('Invalid student id', 400));

  const { submissionText } = req.body;

  const existing = assessment.submissions.find((s) => String(s.student) === String(studentId));
  if (existing) return next(new AppError('You have already submitted this assessment', 400));

  const submission = { student: new mongoose.Types.ObjectId(studentId), submissionText };

  if (req.file) {
    // ensure Cloudinary is configured
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      return next(new AppError('Server upload configuration missing (Cloudinary keys). Please contact the administrator.', 500));
    }

    // Upload to Cloudinary with explicit error handling
    try {
      const result = await cloudinary.v2.uploader.upload(req.file.path, {
        folder: 'assessments',
      });
      submission.submissionFile = { public_id: result.public_id, secure_url: result.secure_url };
    } catch (uploadErr) {
      console.error('Cloudinary upload failed:', uploadErr);
      return next(new AppError('File upload failed: ' + (uploadErr.message || 'Unknown upload error'), 502));
    }

    // try to cleanup local file
    try { await import('fs/promises').then((m) => m.rm(`uploads/${req.file.filename}`, { force: true })); } catch (e) {}
  }

  assessment.submissions.push(submission);
  await assessment.save();

  res.status(201).json({ success: true, message: 'Assessment submitted', submission });
});

/**
 * @GET_SUBMISSIONS - Admin: get all submissions for an assessment
 */
export const getSubmissions = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const assessment = await Assessment.findById(id).populate('submissions.student', 'fullName email');
  if (!assessment) return next(new AppError('Assessment not found', 404));
  res.status(200).json({ success: true, submissions: assessment.submissions });
});

/**
 * @GRADE_SUBMISSION - Admin grades a student's submission
 * Body: { submissionId, marksAwarded }
 */
export const gradeSubmission = asyncHandler(async (req, res, next) => {
  const { id } = req.params; // assessment id
  const { submissionId, marksAwarded } = req.body;
  const assessment = await Assessment.findById(id);
  if (!assessment) return next(new AppError('Assessment not found', 404));

  const sub = assessment.submissions.id(submissionId);
  if (!sub) return next(new AppError('Submission not found', 404));

  sub.marksAwarded = marksAwarded;
  sub.gradedBy = req.user.id;
  sub.gradedAt = new Date();

  await assessment.save();
  res.status(200).json({ success: true, message: 'Submission graded', submission: sub });
});

export default {
  getAllAssessments,
  getAssessmentById,
  createAssessment,
  updateAssessment,
  removeAssessment,
  submitAssessment,
  getSubmissions,
  gradeSubmission,
};