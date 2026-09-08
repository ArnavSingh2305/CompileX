import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
});

export const sendVerificationEmail = async (to: string, token: string) => {
  const link = `${process.env.CLIENT_URL}/verify-email?token=${token}`;
  await transporter.sendMail({
    from: `"CompileX" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Verify your CompileX account",
    html: `<p>Welcome to CompileX! Click below to verify your email:</p>
           <a href="${link}">${link}</a>
           <p>This link expires in 24 hours.</p>`,
  });
};

export const sendPasswordResetEmail = async (to: string, token: string) => {
  const link = `${process.env.CLIENT_URL}/reset-password?token=${token}`;
  await transporter.sendMail({
    from: `"CompileX" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Reset your CompileX password",
    html: `<p>Click below to reset your password:</p>
           <a href="${link}">${link}</a>
           <p>This link expires in 1 hour. If you didn't request this, ignore this email.</p>`,
  });
};