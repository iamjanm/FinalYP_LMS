import cookieParser from 'cookie-parser';
import cors from 'cors';
import { config } from 'dotenv';
import express from 'express';
import morgan from 'morgan';
import errorMiddlware from './middlewares/error.middleware.js';
import courseRoutes from './routes/course.Routes.js'
import miscRoutes from './routes/miscellanous.routes.js'
import noticeRoutes from './routes/notice.routes.js'
import quizRoutes from './routes/quiz.Routes.js'
import assessmentRoutes from './routes/assessment.Routes.js'
// import paymentRoutes from './routes/payment.routes.js'
import userRoutes from './routes/user.Routes.js'
import { adminRouter } from './routes/admin.Routes.js';

config();

const app = express();

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

// const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
// console.log("FRONTEND_URL",FRONTEND_URL);

// app.use(
//   cors({
//     origin: FRONTEND_URL,
//     credentials: false,
//     methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
//   })
// );






// const allowedOrigins = [
//   'http://localhost:5173',
//   process.env.FRONTEND_URL
// ].filter(Boolean);

app.use(
  cors({
    origin: true,          
    credentials: true,     
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  })
);


// Disable caching for API responses to avoid 304 Not Modified responses that return no body
// This ensures clients always receive the JSON payload instead of relying on conditional GETs
app.use('/api/v1', (req, res, next) => {
  res.set('Cache-Control', 'no-store');
  next();
});
// app.options('*', cors({ origin: FRONTEND_URL, credentials: false }));

app.use(cookieParser());

app.use(morgan('dev'));

app.use('/ping', function (_req, res) {
    res.send('Pong');
})
// app.use("/", (_req, res) => {
//     res.send("Server is running")
// });
app.use('/api/v1/user', userRoutes)
app.use("/api/v1/admin", adminRouter);
app.use('/api/v1/course', courseRoutes)
app.use('/api/v1/notices', noticeRoutes)
app.use('/api/v1/quiz', quizRoutes)
app.use('/api/v1/assessments', assessmentRoutes)
// app.use('/api/v1/payments', paymentRoutes)
app.use('/api/v1', miscRoutes);
app.all('*', (_req, res) => {
    res.status(404).send('OOPS!!  404 page not found ')
})
app.use(errorMiddlware);

export default app;