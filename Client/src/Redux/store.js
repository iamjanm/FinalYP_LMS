import { configureStore } from "@reduxjs/toolkit";

import AuthSliceReducer from "./Slices/AuthSlice";
import CourseSliceReducer from "./Slices/CourseSlice";
import LecturesReducer from './Slices/LectureSlice'
import  RazorpayReducer from './Slices/RazorpaySlice';
import  StatReducer from './Slices/StatSlice';
import NoticeReducer from './Slices/NoticeSlice';
import QuizReducer from './Slices/QuizSlice';
import AssessmentReducer from './Slices/AssessmentSlice';

const store = configureStore({
    reducer:{
        auth:AuthSliceReducer,
        course: CourseSliceReducer, 
        razorpay: RazorpayReducer,
        lecture:LecturesReducer,
        stat:StatReducer,
        notice: NoticeReducer,
        quiz: QuizReducer,
        assessment: AssessmentReducer,
    },
    devTools: true
})
export default store;