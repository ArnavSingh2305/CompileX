import type { ReactNode } from "react";
import { toneClass, type Tone } from "./tones";

interface CalloutProps {
  tone?: Tone;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
  role?: "alert" | "status";
}

export const Callout = ({ tone, icon, children, className = "", role }: CalloutProps) => (
  <div role={role} className={`callout ${tone ? toneClass[tone] : ""} ${className}`}>
    {icon && <span className="shrink-0 text-lg leading-6">{icon}</span>}
    <div className="min-w-0 flex-1">{children}</div>
  </div>
);
