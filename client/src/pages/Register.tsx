import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import { AuthLayout } from "../components/AuthLayout";
import type { FormEvent } from "react";

export const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.post("/auth/register", { name, email, password });
      setSubmitted(true);
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <AuthLayout>
        <div className="w-full max-w-sm text-center animate-fade-up">
          <div className="text-4xl mb-4">📬</div>
          <h1 className="text-xl font-bold mb-2">Check your email</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            We sent a verification link to <strong className="text-navy-900 dark:text-white">{email}</strong>. Click it to activate your account, then come back and log in.
          </p>
          <Link to="/login" className="text-accent-purple hover:underline text-sm block mt-6 font-medium">
            Back to Login
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <div className="w-full max-w-sm animate-fade-up">
        <h1 className="text-2xl font-bold mb-1">Create Account</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">Join thousands of developers</p>

        {error && (
          <div className="bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 p-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full glass-card rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent-purple/40 transition"
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full glass-card rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent-purple/40 transition"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full glass-card rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent-purple/40 transition"
            required
            minLength={6}
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-brand text-white py-3 rounded-xl font-medium hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100 transition-transform"
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-slate-200 dark:bg-white/10" />
          <span className="text-xs text-slate-400">OR</span>
          <div className="flex-1 h-px bg-slate-200 dark:bg-white/10" />
        </div>

        <a
          href={`${import.meta.env.VITE_API_URL || "http://localhost:5000/api"}/auth/google`}
          className="w-full flex items-center justify-center gap-2 glass-card py-3 rounded-xl text-sm font-medium hover:bg-slate-50 dark:hover:bg-white/5 transition"
        >
          Continue with Google
        </a>

        <p className="text-sm text-center mt-6 text-slate-500">
          Already have an account? <Link to="/login" className="text-accent-purple font-medium hover:underline">Login</Link>
        </p>
      </div>
    </AuthLayout>
  );
};