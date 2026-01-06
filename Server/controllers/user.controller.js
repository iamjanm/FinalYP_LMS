import cloudinary from "cloudinary"
import crypto from 'crypto';
import fs from 'fs/promises'
import jwt from 'jsonwebtoken';
import path from 'path'

import asyncHandler from "../middlewares/asyncHAndler.middleware.js";
import User from "../models/usermodel.js";
import AppError from "../utils/error.util.js";
import { log } from "console";
// email sending removed — sendEmail no longer used

const cookieOptions = {
  maxAge: 7 * 24 * 60 * 60 * 1000,
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
};

// Frontend URL helper — provides a safe fallback and warns if env var is missing
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
if (!process.env.FRONTEND_URL) {
    console.warn('FRONTEND_URL is not set. Falling back to', FRONTEND_URL);
}
const buildFrontendUrl = (p) => {
    try {
        return new URL(p, FRONTEND_URL).toString();
    } catch (e) {
        return `${String(FRONTEND_URL).replace(/\/$/, '')}/${String(p).replace(/^\//, '')}`;
    }
};

/**
 * @REGISTER - Registers a new user
 */
export const register = async (req, res, next) => {
    try {
        const { fullName, email, password } = req.body;
        console.log("req.body", req.body);

        if (!fullName || !email || !password) {
            return next(new AppError('All fields are required', 400));
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            return next(new AppError('Email already exists', 409));
        }
        let role = 'USER';
        let user = await User.create({
            fullName,
            email,
            role: role,
            password,
            avatar: {
                public_id: email,
                secure_url:
                    'https://res.cloudinary.com/du9jzqlpt/image/upload/v1674647316/avatar_drzgxv.jpg',
            }
        });
        console.log("user", user);
        

        if (req.file) {
            const result = await cloudinary.v2.uploader.upload(req.file.path, {
                folder: 'lms',
                width: 250,
                height: 250,
                gravity: 'faces',
                crop: 'fill',
            });

            user.avatar.public_id = result.public_id;
            user.avatar.secure_url = result.secure_url;
            await user.save();

            await fs.rm(`uploads/${req.file.filename}`, { force: true });
        }

        const token = await user.generateJWTToken();
        user.password = undefined;

        res.cookie('token', token, cookieOptions);

        // Redirect user to frontend profile courses page after successful registration
        const redirectUrl = buildFrontendUrl('/user/profilecourse');
        res.set('Location', redirectUrl);

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            user: { fullName: user.fullName, role:'USER', email: user.email },
            redirect: redirectUrl,
        });

    } catch (err) {
        console.log("🔥 ERROR IN REGISTER API ===>");
        console.log(err);
        return next(new AppError(err.message, 500));
    }
};



/**
 * @LOGIN - Logs in an existing user
 */
export const login = asyncHandler(async (req, res, next) => {

    try {

        const { email, password } = req.body;

        if (!email || !password) {
            return next(new AppError('Email and Password are required ', 400));
        }

        const user = await User.findOne({
            email
        }).select('+password');

        if (!(user && (await user.comparePassword(password)))) {
            return next(
                new AppError('Email or password does not match ', 400)
            );
        }


        const token = await user.generateJWTToken();
        user.password = undefined;


        // Use cookieOptions which already sets `sameSite` appropriately based on NODE_ENV
// Set cookie and also return token in response to support header-based auth (useful for local dev)
    res.cookie('token', token, cookieOptions);

    res.status(200).json({
        success: true,
        message: 'User logged in Successfully',
        user,
        token,
        })

    } catch (e) {
        return next(new
            AppError(e.message, 500));
    }


});
/**
 * @LOGOUT - Logs out the user by clearing the token cookie
 */
export const logout = asyncHandler(async (req, res, next) => {
    // Clear cookie — use same security rules as when setting it
    res.cookie('token', null, { ...cookieOptions, maxAge: 0 });

    res.status(200).json({
        success: true,
        message: 'User logged out  Successfully',
    })
});
/**
 * @LOGGED_IN_USER_DETAILS - Fetches details of the logged-in user
 */
export const getProfile = asyncHandler(async (req, res, next) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId);

        res.status(200).json({
            success: true,
            message: 'User details ',
            user,
        })
    } catch (e) {
        return next(new AppError('Failed to fetch profile ', 500));
    }

});
/**
 * @GET_ALL_USERS - Fetches all users (admin only)
 */
export const getAllUsers = asyncHandler(async (req, res, next) => {
    try {
        const users = await User.find({}).select('fullName email subscription');

        res.status(200).json({
            success: true,
            message: 'All users fetched successfully',
            users,
        });
    } catch (e) {
        return next(new AppError('Failed to fetch users', 500));
    }
});
/**
 * @FORGOT_PASSWORD - Sends a password reset token to the user's email
 */
export const forgotPassword = asyncHandler(async (req, res, next) => {

    const { email } = req.body;

    if (!email) {
        return next(new AppError('Email is required ', 400)
        );
    }

    const user = await User.findOne({ email });
    if (!user) {
        return next(new AppError('Email  not registered ', 400)
        );
    }

    const resetToken = await user.generatePasswordResetToken();

    await user.save();

    const resetPasswordUrl = buildFrontendUrl(`/reset-password/${resetToken}`);

    const subject = 'Reset Password';
    const message = `You can reset your password by clicking <a href="${resetPasswordUrl}" target="_blank">Reset your password</a>\nIf the above link does not work for some reason then copy paste this link in new tab ${resetPasswordUrl}.\n If you have not requested this, kindly ignore.`;

    // Email sending removed — return reset URL and token in response for frontend to handle delivery
    const resetInfo = {
        resetPasswordUrl,
        resetToken
    };

    res.status(200).json({
        success: true,
        message: `Reset password token generated successfully`,
        reset: resetInfo,
    });
});
/**
 * @RESET_PASSWORD - Resets the password using a valid token
 */
export const resetPassword = asyncHandler(async (req, res, next) => {
    const { resetToken } = req.params;

    const { password } = req.body;

    const forgotPasswordToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

    const user = await User.findOne(
        {
            forgotPasswordToken,
            forgotPasswordExpiry: { $gt: Date.now() }
        }
    );

    if (!user) {
        return next(new AppError("Token is invailid or expired , please try again", 400))

    }

    user.password = password;
    user.forgotPasswordExpiry = undefined;
    user.forgotPasswordToken = undefined;

    user.save();

    res.status(200).json({
        success: true,
        message: `Password Changed Sucessfully`,
    })
});
/**
 * @CHANGE_PASSWORD - Changes the current password for the logged-in user
 */
export const changePassword = asyncHandler(async (req, res, next) => {
    const { oldPassword, newPassword } = req.body;
    const { id } = req.user;

    if (!oldPassword || !newPassword) {
        return next(new AppError("All fields are manddatory", 400))
    }

    const user = await User.findById(id).select('+password');
    if (!user) {
        return next(new AppError("user does not exist", 400))
    }

    const isPasswordValid = await user.comparePassword(oldPassword);

    if (!isPasswordValid) {
        return next(new AppError("Invalid old password", 400))
    }

    user.password = newPassword;

    await user.save();

    user.password = undefined;

    res.status(200).json({
        success: true,
        message: `Password  changed Sucessfully`,
    })
})
/**
 * @UPDATE_USER - Updates the user details (name and avatar)
 */
export const updateUser = asyncHandler(async (req, res, next) => {

    const { fullName } = req.body;
    const { id } = req.user;
    console.log(id)

    const user = await User.findById(id);

    if (!user) {
        return next(new AppError("user does not exist", 400))
    }

    if (fullName) {
        user.fullName = fullName;
    }

    if (req.file) {

        await cloudinary.v2.uploader.destroy(user.avatar.public_id);

        try {
            const result = await cloudinary.v2.uploader.upload(req.file.path, {
                folder: 'lms',
                width: 250,
                height: 250,
                gravity: 'faces',
                crop: 'fill'

            });
            if (result) {
                user.avatar.public_id = result.public_id;
                user.avatar.secure_url = result.secure_url;
                await fs.rm(`uploads/${req.file.filename}`, { force: true });
            }

        } catch (e) {
            return next(
                new AppError(e || 'File not uploaded , please try again ', 500)
            )
        }
    }
    await user.save();

    res.status(200).json({
        success: true,
        message: `User details updated  Sucessfully`,
    })
})



/**
 * @ADMIN_LOGIN - Logs in the admin
 */
export const adminLogin = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new AppError('Email and Password are required', 400));
    }

    if (email !== process.env.ADMIN_EMAIL || password !== process.env.ADMIN_PASSWORD) {
        return next(new AppError('Invalid admin credentials', 400));
    }

    const token = jwt.sign({ id: 'admin', role: 'ADMIN' }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRY,
    });

    // Set cookie and also return token in response body so clients can use header-based auth in dev
    res.cookie('token', token, cookieOptions);

    res.status(200).json({
        success: true,
        message: 'Admin logged in successfully',
        user: { id: 'admin', email, role: 'ADMIN', fullName: 'Admin' },
        token,
    });
});

/**
 * @ADMIN_CHANGE_CREDENTIALS - Changes the admin email and/or password
 */
export const adminChangePassword = asyncHandler(async (req, res, next) => {
    const { newPassword, newEmail } = req.body;

    if (!newPassword && !newEmail) {
        return next(new AppError('At least new password or new email is required', 400));
    }

    const envPath = path.join(process.cwd(), '.env');
    let envContent = fs.readFileSync(envPath, 'utf8');
    const lines = envContent.split('\n');
    const updatedLines = lines.map(line => {
        if (newPassword && line.startsWith('ADMIN_PASSWORD=')) {
            return `ADMIN_PASSWORD=${newPassword}`;
        }
        if (newEmail && line.startsWith('ADMIN_EMAIL=')) {
            return `ADMIN_EMAIL=${newEmail}`;
        }
        return line;
    });
    fs.writeFileSync(envPath, updatedLines.join('\n'));

    res.status(200).json({
        success: true,
        message: 'Admin credentials changed successfully'
    });
});
