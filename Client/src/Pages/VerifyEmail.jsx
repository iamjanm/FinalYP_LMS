import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

function VerifyEmail() {
  const navigate = useNavigate();

  useEffect(() => {
    toast.info("Email verification has been disabled.");
    navigate("/login");
  }, [navigate]);

  return null;
}

export default VerifyEmail;