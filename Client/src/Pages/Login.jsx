import { useState } from "react";
import { toast } from 'react-hot-toast'
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import HomeLayout from "../Layouts/HomeLayout";
import { login } from "../Redux/Slices/AuthSlice";
import { Eye, EyeOff } from "lucide-react";

function Login() {

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
        if (!loginData.email) {
            toast.error("Email is required");
            return;
        }
        if (!loginData.password) {
            toast.error("Password is required");
            return;
        }
      
if(loginData.password !== loginData.password ){
toast.error("Incorrect password");
return
}

        //dispatch create account action
        const response = await dispatch(login(loginData));
        if (response?.payload?.success) {
            const role = response?.payload?.user?.role;
            if (role === 'ADMIN') {
                navigate("/admin/deshboard");
            } else {
                navigate("/courses");
            }
            setloginData({
                email: "",
                password: "",
            })
        }
    }
    return (
        <HomeLayout>
            <div className=" flex items-center justify-center h-[90vh]">
                <div className="flex items-center justify-center min-h-[90vh] ">
    <form 
        noValidate 
        onSubmit={onLogin} 
        className="flex flex-col gap-5 p-6 w-96 bg-gray-900/90 border border-gray-700 rounded-xl shadow-xl backdrop-blur-sm"
    >
        <h1 className="text-center text-3xl font-bold text-yellow-500 mb-4">Login</h1>

        {/* Email Field */}
        <div className="flex flex-col gap-1">
            <label htmlFor="email" className="font-semibold text-gray-200">Email</label>
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

        {/* Password Field with Eye Toggle */}
        <div className="flex flex-col gap-1">
            <label htmlFor="password" className="font-semibold text-gray-200">Password</label>
            <div className="relative">
                <input
                    type={showPassword ? "text" : "password"}
                    required
                    name="password"
                    id="password"
                    placeholder="Enter your password..."
                    className="bg-gray-800 text-gray-100 px-3 py-2 rounded-md border border-gray-700 w-full pr-10 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 outline-none transition-all"
                    onChange={handleUserInput}
                    value={loginData.password}
                />
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-yellow-500 transition-colors"
                >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
            </div>
        </div>

        {/* Submit Button */}
        <button 
            type="submit" 
            className="mt-3 bg-yellow-600 hover:bg-yellow-500 text-gray-900 font-semibold py-2 rounded-md shadow-md transition-all"
        >
            Login
        </button>

        {/* Links */}
        <div className="flex flex-col gap-2 mt-2 text-center">
            <Link to="/forget-password" className="text-yellow-400 hover:text-yellow-300 transition-colors">
                Forget Password?
            </Link>
            <p className="text-gray-300">
                Don’t have an account?{" "}
                <Link to="/signup" className="text-yellow-400 hover:text-yellow-300 transition-colors">
                    Signup
                </Link>
            </p>
        </div>
    </form>
</div>

            </div>
        </HomeLayout>
    )
}
export default Login;