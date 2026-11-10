import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import api from "../api/axios";
import { AuthLayout } from "../components/AuthLayout";
import { Callout } from "../components/ui/Callout";
import type { FormEvent } from "react";

export const ResetPassword = () => {
  const [searchParams] = useSearchParams();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const token = searchParams.get("token");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (!token) {
      setError("Invalid or missing reset token.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      const res = await api.post("/auth/reset-password", {
        token,
        newPassword: password,
      });

      setMessage(res.data.message);
      setPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      setError(err.response?.data?.message || "Unable to reset your password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <h1 className="text-2xl font-semibold tracking-tight">Reset password</h1>
      <p className="mt-1 text-sm text-fg/60">Choose a new password for your account.</p>

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

      {message ? (
        <Link to="/login" className="btn btn-primary btn-lg btn-block mt-4">
          Continue to Login
        </Link>
      ) : (
        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-fg/60">New password</span>
            <input
              type="password"
              placeholder="At least 6 characters"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input"
              required
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-xs font-medium text-fg/60">Confirm password</span>
            <input
              type="password"
              placeholder="Re-enter your password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="input"
              required
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary btn-lg btn-block !mt-5"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      )}

      <p className="mt-6 text-center text-sm">
        <Link to="/login" className="font-medium text-link hover:underline">
          ← Back to Login
        </Link>
      </p>
    </AuthLayout>
  );
};
