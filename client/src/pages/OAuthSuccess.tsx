import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

export const OAuthSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      navigate("/login");
      return;
    }

    // Store the JWT so the axios interceptor can authenticate /auth/me
    localStorage.setItem("token", token);

    api
      .get("/auth/me")
      .then((res) => {
        login(res.data, token);
        navigate("/dashboard");
      })
      .catch((error) => {
        console.error("OAuth authentication failed:", error);
        localStorage.removeItem("token");
        navigate("/login");
      });
  }, [navigate, searchParams, login]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <p className="text-slate-500">Signing you in...</p>
    </div>
  );
};