import { Router } from "express";
// remove multer import here — we will use our middleware
// import multer from "multer";

import {
 register,
 login,
 logout,
 getProfile,
 forgotPassword,
 resetPassword,
 changePassword,
 updateUser,
 adminChangePassword,
 verifyEmail,
 resendVerificationEmail,
} from "../controllers/user.controller.js";
import { authorizedRoles, isLoggedIn } from "../middlewares/auth.middlewares.js";
import upload from "../middlewares/multer.middleware.js"; // use this

const router = Router();

/**
 * @route POST /register
 * @desc Registers a new user and uploads their avatar.
 */
router.post("/register", upload.single("avatar"), register);

/**
 * @route POST /login
 */
router.post("/login", login);

/**
 * @route POST /logout
 */
router.post("/logout", logout);

/**
 * @route GET /me
 */
router.get("/me", isLoggedIn, getProfile);

/**
 * @route POST /reset
 */
router.post("/reset", forgotPassword);

/**
 * @route POST /reset/:resetToken
 */
router.post("/reset/:resetToken", resetPassword);

/**
 * @route POST /verify-email/:token
 */
router.post("/verify-email/:token", verifyEmail);

/**
 * @route POST /resend-verification
 */
router.post("/resend-verification", resendVerificationEmail);

/**
 * @route POST /change-password
 */
router.post("/change-password", isLoggedIn, changePassword);

/**
 * @route PUT /update
 */
router.put("/update", isLoggedIn, upload.single("avatar"), updateUser);




/**
 * @route POST /admin/change-password
 */
router.post("/admin/change-password", isLoggedIn, authorizedRoles('ADMIN'), adminChangePassword);

export default router;
