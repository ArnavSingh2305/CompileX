import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = "CompileX <onboarding@resend.dev>";

export const sendVerificationEmail = async (
  to: string,
  token: string
) => {
  const link = `${process.env.CLIENT_URL}/verify-email?token=${token}`;

  const { data, error } = await resend.emails.send({
    from: FROM_EMAIL,
    to: [to],
    subject: "Verify your CompileX account",
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>Welcome to CompileX!</h2>

        <p>
          Thanks for creating your CompileX account.
        </p>

        <p>
          Click the button below to verify your email address:
        </p>

        <a
          href="${link}"
          style="
            display: inline-block;
            padding: 12px 20px;
            background: #6366f1;
            color: white;
            text-decoration: none;
            border-radius: 6px;
          "
        >
          Verify Email
        </a>

        <p style="margin-top: 20px;">
          Or copy and paste this link into your browser:
        </p>

        <p>${link}</p>

        <p>
          This verification link expires in 24 hours.
        </p>
      </div>
    `,
  });

  if (error) {
    console.error("Resend verification email error:", error);
    throw new Error(error.message);
  }

  console.log("Verification email sent:", data?.id);
};

export const sendPasswordResetEmail = async (
  to: string,
  token: string
) => {
  const link = `${process.env.CLIENT_URL}/reset-password?token=${token}`;

  const { data, error } = await resend.emails.send({
    from: FROM_EMAIL,
    to: [to],
    subject: "Reset your CompileX password",
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>Reset your CompileX password</h2>

        <p>
          We received a request to reset your CompileX password.
        </p>

        <p>
          Click the button below to reset your password:
        </p>

        <a
          href="${link}"
          style="
            display: inline-block;
            padding: 12px 20px;
            background: #6366f1;
            color: white;
            text-decoration: none;
            border-radius: 6px;
          "
        >
          Reset Password
        </a>

        <p style="margin-top: 20px;">
          Or copy and paste this link into your browser:
        </p>

        <p>${link}</p>

        <p>
          This link expires in 1 hour.
        </p>

        <p>
          If you didn't request this password reset, you can safely ignore
          this email.
        </p>
      </div>
    `,
  });

  if (error) {
    console.error("Resend password reset email error:", error);
    throw new Error(error.message);
  }

  console.log("Password reset email sent:", data?.id);
};