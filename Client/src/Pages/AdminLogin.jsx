  import { useState } from "react";
import { toast } from 'react-hot-toast'
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import HomeLayout from "../Layouts/HomeLayout";
import { adminLogin } from "../Redux/Slices/AuthSlice";
import { Eye, EyeOff } from "lucide-react";

function AdminLogin() {

 const dispatch = useDispatch();
 const navigate = useNavigate();
const [showPassword, setShowPassword] = useState(false);

 const [loginData, setloginData] = useState({
  email: "",
  password: "",
 });

 function handleUserInput(e) {
  const { name, value } = e.target;
  setloginData({
   ...loginData,
   [name]: value
  })
 }

 async function onLogin(event) {
  event.preventDefault();
  if (!loginData.email || !loginData.password) {
   toast.error("Please fill all the details ");
   return;
  }


  //dispatch admin login action
  const response = await dispatch(adminLogin(loginData));
  if (response?.payload?.success) {
   const token = response?.payload?.token;
   if (token) {
     localStorage.setItem('token', token);
     try {
       // set axios header immediately so subsequent requests work
       import('../Helpers/axiosinstance').then(mod => {
         mod.default.defaults.headers.common['Authorization'] = `Bearer ${token}`;
       });
     } catch (e) {
       console.warn('Failed to set axios header', e);
     }
   }
   navigate("/admin/deshboard");
   setloginData({
    email: "",
    password: "",
   })
  }
 }
 return (
  <HomeLayout>
   
      <div className="flex items-center justify-center min-h-[90vh] bg-gradient-to-br from-gray-900 to-gray-800">
        <form
          noValidate
          onSubmit={onLogin}
          className="flex flex-col gap-5 p-6 w-96 bg-gray-900/90 border border-gray-700 rounded-xl shadow-xl backdrop-blur-sm"
        >
          <h1 className="text-center text-3xl font-bold text-yellow-500 mb-4">
            Admin Login
          </h1>

          {/* Email */}
          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="font-semibold text-gray-200">
              Email
            </label>
            <input
              type="email"
              required
              name="email"
              id="email"
              placeholder="Enter your email..."
              className="bg-gray-800 text-gray-100 px-3 py-2 rounded-md border border-gray-700 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 outline-none transition-all"
              onChange={handleUserInput}
              value={loginData.email}
            />
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1">
            <label htmlFor="password" className="font-semibold text-gray-200">
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              required
              name="password"
              id="password"
              placeholder="Enter your password..."
              className="bg-gray-800 text-gray-100 px-3 py-2 rounded-md border border-gray-700 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 outline-none transition-all"
              onChange={handleUserInput}
              value={loginData.password}
            />
            <div
              className="absolute right-8 mt-10  cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <span className="text-gray-400 hover:text-gray-200"><Eye size={20} /></span>
              ) : (
                <span className="text-gray-400 hover:text-gray-200"><EyeOff size={20} /></span>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="mt-3 bg-yellow-600 hover:bg-yellow-500 text-gray-900 font-semibold py-2 rounded-md shadow-md transition-all"
          >
            Login
          </button>

          {/* Link to User Login */}
          <p className="text-center text-gray-300 mt-2">
            <Link
              to="/login"
              className="text-yellow-400 hover:text-yellow-300 transition-colors"
            >
              User Login
            </Link>
          </p>
        </form>
      </div>
  </HomeLayout>
 )
}
export default AdminLogin;