import { useState } from "react";
import toast from "react-hot-toast";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { FaEyeSlash, FaRegEye } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import { isPassword } from "../../Helpers/regexMatcher";
import HomeLayout from "../../Layouts/HomeLayout";
import { changePassword } from "../../Redux/Slices/AuthSlice";

function ChangePassword() {
    const [checkpass, setCheckpass] = useState("password");
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [userPassword, setUserPassword] = useState({
        oldPassword: "",
        newPassword: "",
    });

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setUserPassword({ ...userPassword, [name]: value });
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        if (!userPassword.oldPassword || !userPassword.newPassword) {
            toast.error("All fields are mandatory");
            return;
        }

        if (!isPassword(userPassword.newPassword)) {
            toast.error("Password must be 6–16 chars with number & special character");
            return;
        }

        const response = dispatch(changePassword(userPassword));

        if (response?.payload?.success) {
            toast.success("Password updated successfully");
            navigate("/user/profile");
            setUserPassword({ oldPassword: "", newPassword: "" });
        }
    };

    const seePass = () => {
        setCheckpass(prev => (prev === "password" ? "text" : "password"));
    };

    return (
        <HomeLayout>
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900 px-4">

                <form
                    onSubmit={handleFormSubmit}
                    className="w-full max-w-md rounded-2xl bg-white/10 backdrop-blur-lg p-6 shadow-2xl border border-white/20 text-white space-y-6"
                >
                    <h1 className="text-3xl font-bold text-center tracking-wide">
                        🔒 Change Password
                    </h1>

                    {/* Old Password */}
                    <div>
                        <label className="text-sm font-medium">Old Password</label>
                        <div className="mt-2 flex items-center rounded-lg border border-white/20 focus-within:border-yellow-500 transition">
                            <input
                                type={checkpass}
                                name="oldPassword"
                                placeholder="Enter old password"
                                value={userPassword.oldPassword}
                                onChange={handlePasswordChange}
                                className="w-full bg-transparent px-3 py-2 outline-none"
                            />
                            <button
                                type="button"
                                onClick={seePass}
                                className="px-3 text-xl text-gray-300 hover:text-yellow-400 transition"
                            >
                                {checkpass === "text" ? <FaRegEye /> : <FaEyeSlash />}
                            </button>
                        </div>
                    </div>

                    {/* New Password */}
                    <div>
                        <label className="text-sm font-medium">New Password</label>
                        <div className="mt-2 flex items-center rounded-lg border border-white/20 focus-within:border-yellow-500 transition">
                            <input
                                type={checkpass}
                                name="newPassword"
                                placeholder="Enter new password"
                                value={userPassword.newPassword}
                                onChange={handlePasswordChange}
                                className="w-full bg-transparent px-3 py-2 outline-none"
                            />
                            <button
                                type="button"
                                onClick={seePass}
                                className="px-3 text-xl text-gray-300 hover:text-yellow-400 transition"
                            >
                                {checkpass === "text" ? <FaRegEye /> : <FaEyeSlash />}
                            </button>
                        </div>
                    </div>

                    {/* Back */}
                    <Link
                        to="/user/profile"
                        className="flex items-center justify-center gap-2 text-sm text-yellow-400 hover:text-yellow-300 transition"
                    >
                        <AiOutlineArrowLeft /> Back to Profile
                    </Link>

                    {/* Submit */}
                    <button
                        type="submit"
                        className="w-full py-2 rounded-lg font-semibold text-lg bg-gradient-to-r from-yellow-500 to-yellow-700 hover:scale-[1.02] transition-transform shadow-lg"
                    >
                        Change Password
                    </button>
                </form>
            </div>
        </HomeLayout>
    );
}

export default ChangePassword;
