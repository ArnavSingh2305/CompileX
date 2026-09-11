import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import api from "../api/axios";

export const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      setStatus("error");
      setMessage("No verification token provided.");
      return;
    }

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
        setMessage(
          err.response?.data?.message || "Verification failed."
        );
      });
  }, [searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm text-center">
        {status === "loading" && (
          <p className="text-slate-500">
            Verifying your email...
          </p>
        )}

        {status === "success" && (
          <>
            <h2 className="text-xl font-bold text-green-600 mb-2">
              Verified!
            </h2>

            <p className="text-slate-600 text-sm mb-4">
              {message}
            </p>

            <Link
              to="/login"
              className="text-blue-600 hover:underline"
            >
              Go to Login
            </Link>
          </>
        )}

        {status === "error" && (
          <>
            <h2 className="text-xl font-bold text-red-600 mb-2">
              Verification Failed
            </h2>

            <p className="text-slate-600 text-sm mb-4">
              {message}
            </p>

            <Link
              to="/login"
              className="text-blue-600 hover:underline"
            >
              Back to Login
            </Link>
          </>
        )}
      </div>
    </div>
  );
};