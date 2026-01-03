import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import axiosInstance from "../Helpers/axiosinstance";
import HomeLayout from "../Layouts/HomeLayout";

function VerifyEmail() {
 const { token } = useParams();
 const navigate = useNavigate();
 const [loading, setLoading] = useState(true);
 const [verified, setVerified] = useState(false);

 useEffect(() => {
  const verifyEmail = async () => {
   try {
    const response = await axiosInstance.post(`user/verify-email/${token}`);
    if (response.data.success) {
     setVerified(true);
     toast.success(response.data.message);
     setTimeout(() => {
      navigate("/login");
     }, 3000);
    }
   } catch (error) {
    toast.error(error?.response?.data?.message || "Verification failed");
    navigate("/login");
   } finally {
    setLoading(false);
   }
  };

  if (token) {
   verifyEmail();
  }
 }, [token, navigate]);

 return (
  <HomeLayout>
   <div className="flex items-center justify-center min-h-screen bg-gray-100">
    <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
     <h2 className="text-2xl font-bold text-center mb-6">Email Verification</h2>

     {loading ? (
      <div className="text-center">
       <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
       <p className="mt-4 text-gray-600">Verifying your email...</p>
      </div>
     ) : verified ? (
      <div className="text-center">
       <div className="text-green-500 text-4xl mb-4">✓</div>
       <p className="text-gray-700 mb-4">Email verified successfully!</p>
       <p className="text-sm text-gray-500">Redirecting to login page...</p>
      </div>
     ) : (
      <div className="text-center">
       <div className="text-red-500 text-4xl mb-4">✗</div>
       <p className="text-gray-700 mb-4">Verification failed</p>
       <button
        onClick={() => navigate("/login")}
        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
       >
        Go to Login
       </button>
      </div>
     )}
    </div>
   </div>
  </HomeLayout>
 );
}

export default VerifyEmail;