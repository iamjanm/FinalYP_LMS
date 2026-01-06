import asyncHandler from "../middlewares/asyncHAndler.middleware.js";
import Quiz from "../models/quiz.model.js";
import AppError from "../utils/error.util.js";

/**
 * @GET_ALL_QUIZZES - Public
 */
export const getAllQuizzes = asyncHandler(async (req, res, next) => {
  const quizzes = await Quiz.find({}).select("title description createdAt");
  res.status(200).json({ success: true, quizzes });
});

/**
 * @GET_QUIZ_BY_ID - returns quiz without answers for students
 */
export const getQuizById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const quiz = await Quiz.findById(id);
  if (!quiz) return next(new AppError("Quiz not found", 404));

  // If admin, return full quiz (including correctOption)
  if (req.user && String(req.user.role).toUpperCase() === "ADMIN") {
    return res.status(200).json({ success: true, quiz });
  }

  // For students, omit correctOption
  const safeQuiz = quiz.toObject();
  safeQuiz.questions = safeQuiz.questions.map((q) => ({
    _id: q._id,
    question: q.question,
    options: q.options,
    marks: q.marks,
  }));

  res.status(200).json({ success: true, quiz: safeQuiz });
});

/**
 * @CREATE_QUIZ - Admin
 */
export const createQuiz = asyncHandler(async (req, res, next) => {
  const { title, description, questions, createdBy } = req.body;

  if (!title || !questions || !Array.isArray(questions) || questions.length === 0 || !createdBy) {
    return next(new AppError("Title, questions and createdBy are required", 400));
  }

  const quiz = await Quiz.create({ title, description, questions, createdBy });
  res.status(201).json({ success: true, message: "Quiz created", quiz });
});

/**
 * @UPDATE_QUIZ - Admin
 */
export const updateQuiz = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const quiz = await Quiz.findById(id);
  if (!quiz) return next(new AppError("Quiz not found", 404));

  Object.assign(quiz, req.body);
  await quiz.save();

  res.status(200).json({ success: true, message: "Quiz updated", quiz });
});

/**
 * @DELETE_QUIZ - Admin
 */
export const removeQuiz = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const quiz = await Quiz.findById(id);
  if (!quiz) return next(new AppError("Quiz not found", 404));

  await Quiz.findByIdAndDelete(id);
  res.status(200).json({ success: true, message: "Quiz removed" });
});

/**
 * @SUBMIT_QUIZ - grade a student's answers
 * Expects body: { answers: [{ qIndex: 0, selectedOption: 1 }, ...] }
 */
export const submitQuiz = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { answers } = req.body;
  if (!Array.isArray(answers)) return next(new AppError("Answers array is required", 400));

  const quiz = await Quiz.findById(id);
  if (!quiz) return next(new AppError("Quiz not found", 404));

  let totalMarks = 0;
  let obtainedMarks = 0;
  const details = [];

  quiz.questions.forEach((q, idx) => {
    totalMarks += q.marks || 1;
    const userAns = answers.find((a) => a.qIndex === idx);
    const selected = userAns ? userAns.selectedOption : null;
    const correct = q.correctOption;
    const correctFlag = selected !== null && selected === correct;
    if (correctFlag) obtainedMarks += q.marks || 1;
    details.push({ qIndex: idx, selected, correct, correctFlag });
  });

  res.status(200).json({ success: true, totalMarks, obtainedMarks, details });
});