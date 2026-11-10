import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import { AuthLayout } from "../components/AuthLayout";
import { Callout } from "../components/ui/Callout";
import type { FormEvent } from "react";

export const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    setMessage("");
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/auth/forgot-password", {
        email,
      });

      setMessage(res.data.message);
    } catch (err: any) {
      setError(err.response?.data?.message || "Unable to process your request.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <h1 className="text-2xl font-semibold tracking-tight">Forgot password</h1>
      <p className="mt-1 text-sm text-fg/60">
        Enter your email and we'll send you a password reset link.
      </p>

      <div className="mt-6 space-y-3">
        {message && (
          <Callout tone="green" icon="✅" role="status">
            {message}
          </Callout>
        )}
        {error && (
          <Callout tone="red" icon="⚠️" role="alert">
            {error}
          </Callout>
        )}
      </div>

      <form onSubmit={handleSubmit} className="mt-4 space-y-3">
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

        <button type="submit" disabled={loading} className="btn btn-primary btn-lg btn-block">
          {loading ? "Sending..." : "Send Reset Link"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm">
        <Link to="/login" className="font-medium text-link hover:underline">
          ← Back to Login
        </Link>
      </p>
    </AuthLayout>
  );
};
