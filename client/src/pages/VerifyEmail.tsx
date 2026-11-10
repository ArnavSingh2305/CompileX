import { useEffect, useRef, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import api from "../api/axios";
import { AuthLayout } from "../components/AuthLayout";
import { Spinner } from "../components/ui/Spinner";

export const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  // The verification token is single-use. Guard against React StrictMode
  // running this effect twice in development, which would burn the token on
  // the first call and show a false "Verification failed" on the second.
  const requestedRef = useRef(false);

  useEffect(() => {
    if (requestedRef.current) return;

    const token = searchParams.get("token");

    if (!token) {
      setStatus("error");
      setMessage("No verification token provided.");
      return;
    }

    requestedRef.current = true;

    api
      .get("/auth/verify-email", {
        params: { token },
      })
      .then((res) => {
        setStatus("success");
        setMessage(res.data.message);
      })
      .catch((err) => {
        setStatus("error");
        setMessage(err.response?.data?.message || "Verification failed.");
      });
  }, [searchParams]);

  return (
    <AuthLayout>
      <div className="text-center">
        {status === "loading" && (
          <>
            <div className="mb-4 flex justify-center text-fg/50">
              <Spinner className="h-6 w-6" />
            </div>
            <h1 className="text-2xl font-semibold tracking-tight">Verifying your email…</h1>
            <p className="mt-2 text-sm text-fg/60">This only takes a moment.</p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="mb-4 text-5xl">✅</div>
            <h1 className="text-2xl font-semibold tracking-tight">Email verified</h1>
            <p className="mt-2 text-sm leading-6 text-fg/60">{message}</p>
            <Link to="/login" className="btn btn-primary btn-lg mt-6">
              Go to Login
            </Link>
          </>
        )}

        {status === "error" && (
          <>
            <div className="mb-4 text-5xl">⚠️</div>
            <h1 className="text-2xl font-semibold tracking-tight">Verification failed</h1>
            <p className="mt-2 text-sm leading-6 text-fg/60">{message}</p>
            <Link to="/login" className="btn btn-secondary btn-lg mt-6">
              Back to Login
            </Link>
          </>
        )}
      </div>
    </AuthLayout>
  );
};
