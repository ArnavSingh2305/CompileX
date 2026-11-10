import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import { AuthLayout } from "../components/AuthLayout";
import { GoogleButton } from "../components/GoogleButton";
import { Callout } from "../components/ui/Callout";
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
        <div className="text-center">
          <div className="mb-4 text-5xl">📬</div>
          <h1 className="text-2xl font-semibold tracking-tight">Check your email</h1>
          <p className="mt-2 text-sm leading-6 text-fg/60">
            We sent a verification link to{" "}
            <strong className="font-semibold text-fg">{email}</strong>. Click it to activate your
            account, then come back and log in.
          </p>
          <Link to="/login" className="btn btn-secondary btn-lg mt-6">
            Back to Login
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <h1 className="text-2xl font-semibold tracking-tight">Create your account</h1>
      <p className="mt-1 text-sm text-fg/60">Join thousands of developers</p>

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
          <span className="mb-1 block text-xs font-medium text-fg/60">Name</span>
          <input
            type="text"
            placeholder="Your name"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input"
            required
          />
        </label>

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
            placeholder="At least 6 characters"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input"
            required
            minLength={6}
          />
        </label>

        <button type="submit" disabled={loading} className="btn btn-primary btn-lg btn-block !mt-5">
          {loading ? "Creating account..." : "Create Account"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-fg/60">
        Already have an account?{" "}
        <Link to="/login" className="font-medium text-link hover:underline">
          Login
        </Link>
      </p>
    </AuthLayout>
  );
};
