import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import { Spinner } from "../components/ui/Spinner";

export const OAuthSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();

  const exchangedRef = useRef(false);

  useEffect(() => {
    if (exchangedRef.current) return;

    const code = searchParams.get("code");

    if (!code) {
      navigate("/login");
      return;
    }

    exchangedRef.current = true;

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
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 text-fg/60">
      <Spinner className="h-6 w-6" />
      <p className="text-sm">Signing you in…</p>
    </div>
  );
};
