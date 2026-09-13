import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

export const OAuthSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const code = searchParams.get("code");

    if (!code) {
      navigate("/login");
      return;
    }

    api
      .post("/auth/oauth/exchange", { code })
      .then((res) => {
        login(res.data.user, res.data.token);
        navigate("/dashboard");
      })
      .catch((error) => {
        console.error("OAuth authentication failed:", error);
        navigate("/login");
      });
  }, [navigate, searchParams, login]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <p className="text-slate-500">Signing you in...</p>
    </div>
  );
};