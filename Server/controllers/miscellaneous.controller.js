import asyncHandler from '../middlewares/asyncHAndler.middleware.js';
import AppError from '../utils/error.util.js';

/**
 * @CONTACT_US
 * Handles the submission of the "Contact Us" form by the user.
 */
export const contactUs = asyncHandler(async (req, res, next) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return next(new AppError('Name, Email, Message are required'));
    }

    // Removed email sending part

    res.status(200).json({
        success: true,
        message: 'Your request has been submitted successfully',
    });
});

/**
 * @USER_STATS
 * Fetches the statistics of the users (total users and active subscribers).
 */
export const userStats = asyncHandler(async (req, res, next) => {
    const allUsersCount = await User.countDocuments();

    const subscribedUsersCount = await User.countDocuments({
        'subscription.status': 'active', // subscription.status inside quotes
    });

    res.status(200).json({
        success: true,
        message: 'All registered users count',
        allUsersCount,
        subscribedUsersCount,
    });
});
