/**
 * @errorMiddleware - Global error handling middleware.
 * Formats common errors (AppError, Mongoose validation, duplicate keys) into
 * a consistent JSON response that includes a message and optional errors array.
 * NOTE: The stack trace is not returned to the client for security/clarity.
 */
const errorMiddleware = (err, req, res, next) => {
    let statusCode = err.statusCode || 500;
    let message = err.message || 'Something went wrong';
    let errors = undefined;

    // Mongoose validation errors
    if (err.name === 'ValidationError') {
        statusCode = 400;
        errors = Object.values(err.errors).map((e) => e.message);
        message = errors.join(', ');
    }

    // Duplicate key (e.g., unique index) error
    if (err.code === 11000 && err.keyValue) {
        statusCode = 409;
        const field = Object.keys(err.keyValue)[0];
        message = `${field} already exists`;
    }

    // Map known Multer / file upload errors to 400 (Bad Request)
    if (err.name === 'MulterError' || (err.message && err.message.toLowerCase().includes('unsupported file type'))) {
        statusCode = 400;
        message = err.message || 'Unsupported file upload';
    }

    // Log full error server-side for debugging, but don't leak stack to clients
    console.error(err.stack);

    // Default AppError or other errors fall back to message/statusCode above
    res.status(statusCode).json({
        success: false,
        message,
        ...(errors ? { errors } : {}),
    });
};
export default errorMiddleware;