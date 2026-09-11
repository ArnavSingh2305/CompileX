import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

export const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
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
      setError(
        err.response?.data?.message ||
          "Unable to process your request."
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
          Forgot Password
        </h2>

        <p className="text-sm text-slate-500 text-center mb-6">
          Enter your email and we'll send you a password reset link.
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
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border p-2 rounded mb-4"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded disabled:opacity-50"
        >
          {loading ? "Sending..." : "Send Reset Link"}
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