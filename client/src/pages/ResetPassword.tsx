import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import api from "../api/axios";

export const ResetPassword = () => {
  const [searchParams] = useSearchParams();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const token = searchParams.get("token");

  const handleSubmit = async (e: React.FormEvent) => {
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
      setError(
        err.response?.data?.message ||
          "Unable to reset your password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold mb-2 text-center">
          Reset Password
        </h2>

        <p className="text-sm text-slate-500 text-center mb-6">
          Enter your new password below.
        </p>

        {message && (
          <div className="bg-green-100 text-green-700 p-2 rounded mb-4 text-sm">
            {message}
          </div>
        )}

        {error && (
          <div className="bg-red-100 text-red-700 p-2 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <input
          type="password"
          placeholder="New password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border p-2 rounded mb-3"
          minLength={6}
          required
        />

        <input
          type="password"
          placeholder="Confirm new password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full border p-2 rounded mb-4"
          minLength={6}
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded disabled:opacity-50"
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>

        <p className="text-sm text-center mt-4">
          <Link
            to="/login"
            className="text-blue-600 hover:underline"
          >
            Back to Login
          </Link>
        </p>
      </form>
    </div>
  );
};