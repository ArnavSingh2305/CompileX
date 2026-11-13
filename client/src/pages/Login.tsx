import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { AuthLayout } from "../components/AuthLayout";
import { GoogleButton } from "../components/GoogleButton";
import { Callout } from "../components/ui/Callout";
import type { FormEvent } from "react";
import { getDashboardPath } from "../utils/roleRedirect";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.post("/auth/login", { email, password });
      login(res.data.user, res.data.token);

      if (res.data.user.mustChangePassword) {
        navigate("/change-password", { replace: true });
      } else {
        navigate(getDashboardPath(res.data.user.role), { replace: true });
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
      <p className="mt-1 text-sm text-fg/60">Continue your coding journey</p>

      <div className="mt-6">
        <GoogleButton />
      </div>

      <div className="my-5 flex items-center gap-3 text-xs text-fg/40">
        <span className="h-px flex-1 bg-fg/10" />
        OR
        <span className="h-px flex-1 bg-fg/10" />
      </div>

      {error && (
        <Callout tone="red" icon="⚠️" role="alert" className="mb-4">
          {error}
        </Callout>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-fg/60">Email</span>
          <input
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input"
            required
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-xs font-medium text-fg/60">Password</span>
          <input
            type="password"
            placeholder="Enter your password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input"
            required
          />
        </label>

        <div className="flex justify-end">
          <Link to="/forgot-password" className="text-xs text-link hover:underline">
            Forgot password?
          </Link>
        </div>

        <button type="submit" disabled={loading} className="btn btn-primary btn-lg btn-block">
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-fg/60">
        Don't have an account?{" "}
        <Link to="/register" className="font-medium text-link hover:underline">
          Register
        </Link>
      </p>
    </AuthLayout>
  );
};
