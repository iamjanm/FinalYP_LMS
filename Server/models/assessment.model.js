import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const SubmissionSchema = new Schema(
  {
    student: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    submissionText: { type: String },
    submissionFile: {
      public_id: String,
      secure_url: String,
    },
    marksAwarded: { type: Number, default: null },
    gradedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    gradedAt: { type: Date },
  },
  { timestamps: true }
);

const AssessmentSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    type: { type: String, enum: ['ASSIGNMENT', 'MCQ'], default: 'ASSIGNMENT' },
    dueDate: { type: Date },
    totalMarks: { type: Number, default: 100 },
    createdBy: { type: String },
    submissions: [SubmissionSchema],
  },
  { timestamps: true }
);

const Assessment = model('Assessment', AssessmentSchema);
export default Assessment;