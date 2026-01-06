
import './App.css'

import { Route, Routes } from 'react-router-dom'

import RequireAuth from './Compontents/Auth/RequireAuth.jsx'
import AboutUs from './Pages/AboutUs.jsx'
import AdminLogin from './Pages/AdminLogin.jsx'
import Contact from './Pages/Contact.jsx'
import CourseDescripition from './Pages/Course/CourseDescription.jsx'
import CourseList from './Pages/Course/CourseList.jsx'
import CreateCourse from './Pages/Course/CreateCourse.jsx'
import EditCourse from './Pages/Course/EditCourse.jsx'
// import Denied from './Pages/Denied.jsx' 
import AddCourseLectures from './Pages/Deshboard/AddLectures.jsx'
import AdminDeshboard from './Pages/Deshboard/AdminDeshboard.jsx'
import Displaylectures from './Pages/Deshboard/DisplayLectures.jsx'
import HomePage from './Pages/HomePage.jsx'
import Login from './Pages/Login.jsx'
import NotFound from './Pages/NotFound.jsx'
import ChangePassword from './Pages/Password/ChangePassword.jsx'
import ForgetPassword from './Pages/Password/ForgetPassword.jsx'
import ResetPassword from './Pages/Password/ResetPassword.jsx'
import Signup from './Pages/Signup.jsx'
import EditProfile from './Pages/User/EditProfile.jsx'
import Profile from './Pages/User/Profile.jsx'
import Notice from './Pages/Notice/Notice.jsx'
import CreateNotice from './Pages/Notice/CreateNotice.jsx'
import EditNotice from './Pages/Notice/EditNotice.jsx'
import QuizList from './Pages/Quiz/QuizList.jsx'
import QuizTake from './Pages/Quiz/QuizTake.jsx'
import QuizResult from './Pages/Quiz/QuizResult.jsx'
import AdminCreateQuiz from './Pages/Quiz/AdminCreateQuiz.jsx'

import AssessmentList from './Pages/Assessment/AssessmentList.jsx'
import AssessmentTake from './Pages/Assessment/AssessmentTake.jsx'
import AssessmentResult from './Pages/Assessment/AssessmentResult.jsx'
import AdminCreateAssessment from './Pages/Assessment/AdminCreateAssessment.jsx'
import SubmissionList from './Pages/Assessment/SubmissionList.jsx'
function App() {
  return (
    <>
      <Routes>
        <Route path='/' element={<HomePage />}></Route>
        <Route path='/about' element={<AboutUs />}></Route>
        <Route path='/courses' element={<CourseList />}></Route>
        <Route path='/contact' element={<Contact />}></Route>
        <Route path='/notice' element={<Notice />}></Route>

        <Route path='/quizzes' element={<QuizList />}></Route>
        <Route path='/quiz/:id' element={<QuizTake />}></Route>
        <Route path='/quiz/result/:id' element={<QuizResult />}></Route>

        <Route path='/assessments' element={<AssessmentList />}></Route>
        <Route path='/assessment/:id' element={<AssessmentTake />}></Route>
        <Route path='/assessment/result/:id' element={<AssessmentResult />}></Route>

        <Route element={<RequireAuth allowedRoles={["ADMIN"]} />}>
          <Route path='/notice/create' element={<CreateNotice />}></Route>
          <Route path='/notice/edit/:id' element={<EditNotice />}></Route>
          <Route path='/quiz/create' element={<AdminCreateQuiz />}></Route>
          <Route path='/assessment/create' element={<AdminCreateAssessment />}></Route>
          <Route path='/assessment/:id/submissions' element={<SubmissionList />}></Route>
        </Route>

        {/* <Route path='/denied' element={<Denied />}></Route> */}
        <Route path='/course/description' element={<CourseDescripition />}></Route>

        <Route path='/signup' element={<Signup />}></Route>
        <Route path='/login' element={<Login />}></Route>
        <Route path='/admin/login' element={<AdminLogin />}></Route>
        <Route path='/forget-password' element={<ForgetPassword />}></Route>
        <Route path="/reset-password/:resetToken" element={<ResetPassword />} />

        <Route element={<RequireAuth allowedRoles={["ADMIN"]} />}>
          <Route path='/course/create' element={<CreateCourse />}></Route>
          <Route path='/course/edit/:id' element={<EditCourse />}></Route>
          <Route path='/course/addlecture' element={<AddCourseLectures />}></Route>
          <Route path='/admin/deshboard' element={<AdminDeshboard />}></Route>
        </Route>

        <Route element={<RequireAuth allowedRoles={["ADMIN", 'USER']} />}>
          <Route path='/user/profile' element={<Profile />}></Route>
          <Route path='/user/editprofile' element={<EditProfile />}></Route>
          <Route path='/change-password' element={<ChangePassword />}></Route>
          <Route path='/course/displaylecture' element={<Displaylectures />}></Route>
          <Route path='/course/edit' element={<EditCourse />}></Route>
        </Route>

        <Route path='*' element={<NotFound />}></Route>
      </Routes>
    </>
  )
}

export default App
