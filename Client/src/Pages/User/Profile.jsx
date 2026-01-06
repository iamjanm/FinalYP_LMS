import toast from "react-hot-toast";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import HomeLayout from "../../Layouts/HomeLayout";
import { getuserData, adminChangePassword, logout } from "../../Redux/Slices/AuthSlice";
// import { cancelCourseBundle } from "../../Redux/Slices/RazorpaySlice";

function Profile() {
    const userData = useSelector((state) => state?.auth?.data);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [showModal, setShowModal] = useState(false);
    const [adminData, setAdminData] = useState({
        newEmail: userData?.email || "",
        newPassword: "",
    });

    function handleAdminInput(e) {
        const { name, value } = e.target;
        setAdminData({
            ...adminData,
            [name]: value
        });
    }

    async function handleAdminChange() {
        if (!adminData.newEmail && !adminData.newPassword) {
            toast.error("Please provide at least new email or new password");
            return;
        }
        const res = await dispatch(adminChangePassword(adminData));
        if (res?.payload?.success) {
            setShowModal(false);
            setAdminData({ newEmail: "", newPassword: "" });
            // Log out the admin to force re-login with new credentials
            await dispatch(logout());
            navigate("/login");
        }
    }

    async function handleCancelation() {
        if (window.confirm("Are you Sure Want Cancel Subscription ?")) {
            toast("Initiating cancellation..");
            await dispatch(cancelCourseBundle());
            await dispatch(getuserData());
            toast.success("Cancellation completed!");
            navigate("/");
        }
    }

    return (
        <HomeLayout>

            <div className="min-h-[90vh] flex items-center justify-center bg-[#171C22] backdrop-blur-sm">
                <div className="my-10 flex flex-col gap-6 rounded-2xl p-6 text-white w-[90vw] sm:w-[420px] bg-gradient-to-b from-[#171C22] to-[#171C22] shadow-[0_0_25px_rgba(0,0,0,0.5)] border border-white/10 transition-all">



                    {/* Avatar */}
                    <div className="flex justify-center">
                        <img
                            className="w-36 h-36 object-cover rounded-full border-4 border-yellow-500 shadow-lg"
                            src={userData?.avatar?.secure_url}
                        />
                    </div>

                    {/* Name */}
                    <h3 className="text-2xl font-bold text-center tracking-wide capitalize">
                        {userData?.fullName}
                    </h3>

                    {/* Details */}
                    <div className="grid grid-cols-2 gap-3 text-sm sm:text-base bg-white/5 p-4 rounded-xl border border-white/10">
                        <p className="font-semibold text-gray-300">Email:</p>
                        <p className="text-gray-200 break-all">{userData?.email}</p>

                        <p className="font-semibold text-gray-300">Role:</p>
                        <p className="text-gray-200">{userData?.role}</p>

                        <p className="font-semibold text-gray-300">Subscription:</p>
                        <p
                            className={`${userData?.subscription?.status === "active"
                                ? "text-green-400"
                                : "text-red-400"
                                } font-semibold`}
                        >
                            {userData?.subscription?.status === "active"
                                ? "Active"
                                : "Inactive"}
                        </p>
                    </div>

                    {/* Buttons */}
                    <div className="flex items-center justify-between gap-3">
                        <Link
                            to="/change-password"
                            className="w-1/2 bg-yellow-600/90 hover:bg-yellow-500 transition-all text-center duration-300 rounded-lg font-semibold py-2 shadow-md"
                        >
                            Change Password
                        </Link>

                        {userData?.role === 'ADMIN' ? (
                            <button
                                onClick={() => setShowModal(true)}
                                className="w-1/2 bg-yellow-600/90 hover:bg-yellow-500 transition-all text-center duration-300 rounded-lg font-semibold py-2 shadow-md"
                            >
                                Change Credentials
                            </button>
                        ) : (
                            <Link
                                to="/user/editprofile"
                                className="w-1/2 bg-yellow-600/90 hover:bg-yellow-500 transition-all text-center duration-300 rounded-lg font-semibold py-2 shadow-md"
                            >
                                Edit Profile
                            </Link>
                        )}
                    </div>

                    {/* Cancel Button */}
                    {userData?.subscription?.status === "active" && (
                        <button
                            onClick={handleCancelation}
                            className="w-full bg-red-600/90 hover:bg-red-500 transition-all duration-300 rounded-lg font-semibold py-2 shadow-md mt-2"
                        >
                            Cancel Subscription
                        </button>
                    )}
                </div>

                {/* Admin Change Credentials Modal */}
                {showModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-gray-800 p-6 rounded-lg w-96">
                            <h3 className="text-xl font-bold mb-4 text-white">Change Admin Credentials</h3>
                            <div className="mb-4">
                                <label className="block text-gray-300 mb-2">New Email</label>
                                <input
                                    type="email"
                                    name="newEmail"
                                    value={adminData.newEmail}
                                    onChange={handleAdminInput}
                                    className="w-full p-2 bg-gray-700 text-white rounded"
                                    placeholder="Enter new email"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-300 mb-2">New Password</label>
                                <input
                                    type="password"
                                    name="newPassword"
                                    value={adminData.newPassword}
                                    onChange={handleAdminInput}
                                    className="w-full p-2 bg-gray-700 text-white rounded"
                                    placeholder="Enter new password"
                                />
                            </div>
                            <div className="flex justify-end gap-2">
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleAdminChange}
                                    className="px-4 py-2 bg-yellow-600 hover:bg-yellow-500 rounded"
                                >
                                    Change
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </HomeLayout>
    );
}

export default Profile;
