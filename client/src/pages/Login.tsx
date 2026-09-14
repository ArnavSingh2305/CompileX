import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { AuthLayout } from "../components/AuthLayout";
import type { FormEvent } from "react";

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
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="w-full max-w-sm animate-fade-up">
        <h1 className="text-2xl font-bold mb-1">Welcome Back</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">Continue your coding journey</p>

        {error && (
          <div className="bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 p-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full glass-card rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent-purple/40 transition"
            required
          />
          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full glass-card rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent-purple/40 transition"
              required
            />
            <Link to="/forgot-password" className="text-xs text-accent-purple hover:underline block mt-2 text-right">
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-brand text-white py-3 rounded-xl font-medium hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100 transition-transform"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-slate-200 dark:bg-white/10" />
          <span className="text-xs text-slate-400">OR</span>
          <div className="flex-1 h-px bg-slate-200 dark:bg-white/10" />
        </div>

        <a
          href="http://localhost:5000/api/auth/google"
          className="w-full flex items-center justify-center gap-2 glass-card py-3 rounded-xl text-sm font-medium hover:bg-slate-50 dark:hover:bg-white/5 transition"
        >
          Continue with Google
        </a>

        <p className="text-sm text-center mt-6 text-slate-500">
          Don't have an account? <Link to="/register" className="text-accent-purple font-medium hover:underline">Register</Link>
        </p>
      </div>
    </AuthLayout>
  );
};