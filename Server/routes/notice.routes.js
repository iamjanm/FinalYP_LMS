import { Router } from "express";

import {
  getAllNotices,
  getNoticeById,
  createNotice,
  updateNotice,
  removeNotice,
} from "../controllers/notice.controllers.js";

import {
  isLoggedIn,
  authorizedRoles,
} from "../middlewares/auth.middlewares.js";

import upload from "../middlewares/multer.middleware.js";

const router = Router();

/**
 * @route GET /notices
 * @access Public
 */
router.get("/", getAllNotices);

/**
 * @route POST /notices
 * @access Admin
 */
router.post(
  "/",
  isLoggedIn,
  authorizedRoles("ADMIN"),
  upload.single("image"),
  createNotice
);

/**
 * @route GET, PUT, DELETE /notices/:id
 * @access Admin
 */
router
  .route("/:id")
  .get(getNoticeById)
  .put(
    isLoggedIn,
    authorizedRoles("ADMIN"),
    upload.single("image"),
    updateNotice
  )
  .delete(isLoggedIn, authorizedRoles("ADMIN"), removeNotice);

export default router;
