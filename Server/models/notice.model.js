import { Schema, model } from "mongoose";

const noticeSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      minLength: [5, "Title must be at least 5 characters"],
      maxLength: [100, "Title must be less than 100 characters"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      minLength: [10, "Description must be at least 10 characters"],
      maxLength: [500, "Description must be less than 500 characters"],
      trim: true,
    },
    image: {
      public_id: {
        type: String,
        default: "Dummy",
      },
      secure_url: {
        type: String,
        default: "Dummy",
      },
    },
    createdBy: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Notice = model("Notice", noticeSchema);

export default Notice;
