import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";

export const AuthLayout = ({ children }: { children: ReactNode }) => (
  <div className="relative flex min-h-screen flex-col items-center justify-center px-5 py-14">
    <div className="absolute right-4 top-4">
      <ThemeToggle />
    </div>

    <Link to="/" className="mb-10 flex items-center gap-2.5">
      <Logo size={30} />
      <span className="text-xl font-semibold tracking-tight">CompileX</span>
    </Link>

    <div className="w-full max-w-[340px] animate-fade-up">{children}</div>

    <p className="mt-12 text-xs text-fg/40">Code · Learn · Build · Grow</p>
  </div>
);
