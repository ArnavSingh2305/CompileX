import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

export const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
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
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm text-center">
          <h2 className="text-xl font-bold mb-3">Check your email</h2>
          <p className="text-slate-600 text-sm">
            We sent a verification link to <strong>{email}</strong>. Click it to activate your account, then come back and log in.
          </p>
          <Link to="/login" className="text-blue-600 hover:underline text-sm block mt-4">
            Back to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center">Create Account</h2>

        {error && <div className="bg-red-100 text-red-700 p-2 rounded mb-4 text-sm">{error}</div>}

        <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} className="w-full border p-2 rounded mb-3" required />
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border p-2 rounded mb-3" required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full border p-2 rounded mb-4" required minLength={6} />

        <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded disabled:opacity-50">
          {loading ? "Creating account..." : "Register"}
        </button>

        <div className="flex items-center gap-2 my-4">
        <div className="flex-1 h-px bg-slate-200" />
        <span className="text-xs text-slate-400">OR</span>
        <div className="flex-1 h-px bg-slate-200" />
      </div>

      <a
        href="http://localhost:5000/api/auth/google"
        className="w-full flex items-center justify-center gap-2 border py-2 rounded hover:bg-slate-50 text-sm"
      >
        Continue with Google
      </a>

      <p className="text-sm text-center mt-4">
        Already have an account?{" "}
        <Link to="/login" className="text-blue-600 hover:underline">
          Login
        </Link>
      </p>
      </form>
    </div>
  );
};