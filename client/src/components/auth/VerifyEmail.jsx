import { USER_API_END_POINT } from '@/utils/constant'
import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const VerifyEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await axios.get(`${USER_API_END_POINT}/verify-email/${token}`);
        console.log(response)
        alert(response.data.message); 
        navigate("/login"); 
      } catch (error) {
        console.error(error.response.data.message);
        alert("Email verification failed. Please try again.");
        navigate("/"); 
      }
    };

    verifyEmail();
  }, [token, navigate]);

  return (
    <div>
      <h1>Verifying your email...</h1>
    </div>
  );
};

export default VerifyEmail;
