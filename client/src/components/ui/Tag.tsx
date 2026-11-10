import type { ReactNode } from "react";
import { toneClass, type Tone } from "./tones";

interface TagProps {
  tone?: Tone;
  children: ReactNode;
  className?: string;
}

export const Tag = ({ tone = "gray", children, className = "" }: TagProps) => (
  <span className={`tag ${toneClass[tone]} ${className}`}>{children}</span>
);
