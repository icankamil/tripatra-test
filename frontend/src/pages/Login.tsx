// src/components/Login.tsx
import React, { useEffect } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "@/context/index";
import { jwtDecode } from "jwt-decode"; // Import jwt_decode
import { useNavigate } from "react-router-dom";

const Login: React.FC = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate(); // Initialize useNavigate
  // Check if the user is already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/"); // Redirect to home if authenticated
    }
  }, [isAuthenticated, navigate]);
  const handleLoginSuccess = (credentialResponse: any) => {
    const userObject = jwtDecode(credentialResponse.credential); // Decode the JWT token
    console.log(userObject);
    login(userObject); // Store user data in context
    navigate("/");
  };

  const handleLoginFailure = (error: any) => {
    console.error("Login failed:", error);
    alert(`Login failed: ${error}`);
  };

  return (
    <div>
      <h2>Login</h2>
      <GoogleLogin
        onSuccess={handleLoginSuccess}
        onFailure={handleLoginFailure}
        cookiePolicy={"single_host_origin"}
      />
    </div>
  );
};

export default Login;
