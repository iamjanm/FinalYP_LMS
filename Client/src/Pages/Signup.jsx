import { useState } from "react";
import { toast } from 'react-hot-toast'
import { BsPersonCircle } from "react-icons/bs";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import { isEmail, isPassword } from "../Helpers/regexMatcher";
import HomeLayout from "../Layouts/HomeLayout";
import { creatAccount } from "../Redux/Slices/AuthSlice";
import { Eye, EyeOff } from "lucide-react";

function Signup() {

    const dispatch = useDispatch();
    const navigate = useNavigate();


    const [prevImage, setPrevImage] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [signupData, setSignupData] = useState({
        fullName: "",
        email: "",
        password: "",
        avatar: "",
    });

    function handleUserInput(e) {
        const { name, value } = e.target;
        setSignupData({
            ...signupData,
            [name]: value
        })
    }

    function getImage(event) {
        event.preventDefault();

        //getting image
        const uploadedImage = event.target.files[0];

        if (uploadedImage) {
            setSignupData({
                ...signupData,
                avatar: uploadedImage
            });
            const fileReader = new FileReader();
            fileReader.readAsDataURL(uploadedImage);
            fileReader.addEventListener("load", function () {
                console.log(this.result);
                setPrevImage(this.result);
            })
        }
    }

    async function createNewAccount(event) {
        event.preventDefault();
        if (!signupData.email) {
            toast.error("Email is required");
            return;
        }
        if (!signupData.fullName) {
            toast.error("Full name is required");
            return;
        }
        if (!signupData.avatar) {
            toast.error("Profile picture is required");
            return;
        }
        if (!signupData.password) {
            toast.error("Password is required");
            return;
        }
if (signupData.password.length < 6) {
            toast.error("Password should be at least 6 characters long");
            return;
        }
        //checking name filed 
        if (signupData.fullName.length < 5) {
            toast.error("Name should be atleast of 5characters ")
            return;
        }


        if (!isEmail(signupData.email)) {
            toast.error("Invaild email id  ")
            return;
        }

        //checking password
        if (!isPassword(signupData.password)) {
            toast.error("Password should be 6 - 16 character long with atleast a number and special character",error.message);
            return;
        }

        const formData = new FormData();
        formData.append("fullName", signupData.fullName);
        formData.append("email", signupData.email);
        formData.append("password", signupData.password);
        formData.append("avatar", signupData.avatar);

        console.log("creatAccount", creatAccount);

        // dispatch create account action
        const response = await dispatch(creatAccount(formData));
        console.log("register Response", response);

        // If server returned validation errors or other failures, show them as toast(s)
        if (response?.error) {
            const payload = response.payload;

            // If the server sent an errors array (validation errors), show each
            if (payload && Array.isArray(payload.errors) && payload.errors.length) {
                payload.errors.forEach((errMsg) => toast.error(errMsg));
                return;
            }

            // Otherwise show the single message
            const msg = payload?.message || response.error?.message || 'Registration failed';
            toast.error(msg);
            return;
        }

        if (response?.payload?.success) {
            toast.success("Account created successfully! Please check your email to verify your account.");
            navigate("/user/profile");
        }
    }
    return (
        <HomeLayout>
         <div className="flex items-center justify-center min-h-[90vh] bg-gradient-to-br from-gray-900 to-gray-800">
  <form
    noValidate
    onSubmit={createNewAccount}
    className="flex flex-col gap-5 px-6 py-2 w-96 bg-gray-900/90 border border-gray-700 rounded-xl shadow-xl backdrop-blur-sm"
  >
    <h1 className="text-center text-3xl font-bold text-yellow-500 mb-4">
      Registration
    </h1>

    {/* Profile Image */}
    <label htmlFor="image_uploads" className="cursor-pointer">
      {prevImage ? (
        <img
          className="w-24 h-24 rounded-full mx-auto object-cover border-2 border-yellow-500"
          src={prevImage}
        />
      ) : (
        <BsPersonCircle className="w-24 h-24 rounded-full mx-auto text-gray-400 border-2 border-gray-600" />
      )}
    </label>
    <input
      className="hidden"
      type="file"
      name="image_uploads"
      id="image_uploads"
      accept=".jpg, .jpeg, .png, .svg"
      onChange={getImage}
    />

    {/* Full Name */}
    <div className="flex flex-col gap-1">
      <label htmlFor="fullName" className="font-semibold text-gray-200">
        Name
      </label>
      <input
        type="text"
        required
        name="fullName"
        id="fullName"
        placeholder="Enter your full name..."
        className="bg-gray-800 text-gray-100 px-3 py-2 rounded-md border border-gray-700 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 outline-none transition-all"
        onChange={handleUserInput}
        value={signupData.fullName}
      />
    </div>

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
        value={signupData.email}
      />
    </div>

    {/* Password with Eye Toggle */}
    <div className="flex flex-col gap-1">
      <label htmlFor="password" className="font-semibold text-gray-200">
        Password
      </label>
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          required
          name="password"
          id="password"
          placeholder="Enter your password..."
          className="bg-gray-800 text-gray-100 px-3 py-2 rounded-md border border-gray-700 w-full pr-10 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 outline-none transition-all"
          onChange={handleUserInput}
          value={signupData.password}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-yellow-400 transition-colors"
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
      Create Account
    </button>

    <p className="text-center text-gray-300 mt-2">
      Already have an account?{" "}
      <Link
        to="/login"
        className="text-yellow-400 hover:text-yellow-300 transition-colors"
      >
        Login
      </Link>
    </p>
  </form>
</div>

        </HomeLayout>
    )
}
export default Signup;