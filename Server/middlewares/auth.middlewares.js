import jwt from "jsonwebtoken";

import User from '../models/usermodel.js'
import AppError from "../utils/error.util.js";

/**
 * @isLoggedIn - Middleware to check if the user is authenticated.
 * Accepts token from cookie (`token`) or Authorization header (`Bearer <token>`).
 * Verifies token, ensures user still exists, and attaches normalized `req.user`.
 */
const isLoggedIn = async (req, res, next) => {
    try {
        // Support token in cookie or Authorization header
        let token = req.cookies?.token;
        if (!token) {
            const authHeader = req.headers?.authorization;
            if (authHeader && authHeader.startsWith('Bearer ')) {
                token = authHeader.split(' ')[1];
            }
        }

        if (!token) {
            return next(new AppError('Unauthenticated, please login again', 401));
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // If token is admin token (id === 'admin'), attach role
        if (decoded.id === 'admin') {
            req.user = { id: 'admin', role: 'ADMIN' };
            return next();
        }

        // Verify referenced user exists
        const user = await User.findById(decoded.id).select('+role subscription');
        if (!user) return next(new AppError('Unauthenticated, user not found', 401));

        req.user = { id: user._id.toString(), role: user.role, subscription: user.subscription };
        return next();
    } catch (err) {
        return next(new AppError('Unauthenticated, please login again', 401));
    }
}

/**
 * @authorizedRoles - Middleware to check if the user has authorized roles.
 * Accepts roles as arguments and does case-insensitive comparison.
 */
const authorizedRoles = (...roles) => async (req, res, next) => {
    if (!req.user) return next(new AppError('Unauthenticated, please login first', 401));

    const currentUserRole = String(req.user.role || '').toUpperCase();
    const allowed = roles.map(r => String(r).toUpperCase()).includes(currentUserRole);

    if (!allowed) {
        return next(new AppError("You do not have permission to access this route", 403));
    }

    next();
}

/**
 * @authorizedSubscriber - Middleware to check if the user has an active subscription.
 * If the user is not an admin and does not have an active subscription, it returns a "Forbidden" error.
 */
const authorizedSubscriber = async (req, res, next) => {
    try {
        if (!req.user) return next(new AppError('Unauthenticated, please login first', 401));

        // Admin bypass
        if (String(req.user.role).toUpperCase() === 'ADMIN') return next();

        const user = await User.findById(req.user.id);
        if (!user) return next(new AppError('User not found', 404));

        const subscription = user.subscription?.status || 'inactive';
        if (subscription !== 'active') {
            return next(new AppError('Please subscribe to access this resource', 403));
        }

        next();
    } catch (err) {
        return next(new AppError('Failed to verify subscription', 500));
    }
}
export {
    isLoggedIn,
    authorizedRoles,
    authorizedSubscriber,
}

