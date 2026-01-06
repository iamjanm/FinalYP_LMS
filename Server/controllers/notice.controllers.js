import cloudinary from "cloudinary";
import fs from "fs/promises";

import asyncHandler from "../middlewares/asyncHAndler.middleware.js";
import Notice from "../models/notice.model.js";
import AppError from "../utils/error.util.js";

/**
 * @GET_ALL_NOTICES
 */
export const getAllNotices = asyncHandler(async (req, res, next) => {
  const notices = await Notice.find({}).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    message: "All notices fetched successfully",
    notices,
  });
});

/**
 * @GET_NOTICE_BY_ID
 */
export const getNoticeById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const notice = await Notice.findById(id);
  if (!notice) {
    return next(new AppError("Notice not found", 404));
  }

  res.status(200).json({
    success: true,
    notice,
  });
});

/**
 * @CREATE_NOTICE
 */
export const createNotice = asyncHandler(async (req, res, next) => {
  const { title, description, createdBy } = req.body;

  if (!title || !description || !createdBy) {
    return next(new AppError("All fields are required", 400));
  }

  const notice = await Notice.create({
    title,
    description,
    createdBy,
  });

  if (req.file) {
    try {
      const result = await cloudinary.v2.uploader.upload(req.file.path, {
        folder: "lms/notices",
      });

      notice.image.public_id = result.public_id;
      notice.image.secure_url = result.secure_url;

      await fs.rm(`uploads/${req.file.filename}`, { force: true });
      await notice.save();
    } catch (error) {
      return next(new AppError(error.message, 500));
    }
  }

  res.status(201).json({
    success: true,
    message: "Notice created successfully",
    notice,
  });
});

/**
 * @UPDATE_NOTICE
 */
export const updateNotice = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const notice = await Notice.findById(id);
  if (!notice) {
    return next(new AppError("Notice not found", 404));
  }

  Object.assign(notice, req.body);

  if (req.file) {
    if (notice.image.public_id !== "Dummy") {
      await cloudinary.v2.uploader.destroy(notice.image.public_id);
    }

    const result = await cloudinary.v2.uploader.upload(req.file.path, {
      folder: "lms/notices",
    });

    notice.image.public_id = result.public_id;
    notice.image.secure_url = result.secure_url;

    await fs.rm(`uploads/${req.file.filename}`, { force: true });
  }

  await notice.save();

  res.status(200).json({
    success: true,
    message: "Notice updated successfully",
  });
});

/**
 * @DELETE_NOTICE
 */
export const removeNotice = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const notice = await Notice.findById(id);
  if (!notice) {
    return next(new AppError("Notice not found", 404));
  }

  if (notice.image.public_id !== "Dummy") {
    await cloudinary.v2.uploader.destroy(notice.image.public_id);
  }

  await Notice.findByIdAndDelete(id);

  res.status(200).json({
    success: true,
    message: "Notice removed successfully",
  });
});
