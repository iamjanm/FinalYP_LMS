import { Schema, model } from 'mongoose';

const questionSchema = new Schema({
  question: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctOption: { type: Number, required: true },
  marks: { type: Number, default: 1 },
});

const quizSchema = new Schema(
  {
    title: { type: String, required: [true, 'Title is required'], trim: true },
    description: { type: String, trim: true },
    questions: [questionSchema],
    createdBy: { type: String, required: true },
  },
  { timestamps: true }
);

const Quiz = model('Quiz', quizSchema);
export default Quiz;