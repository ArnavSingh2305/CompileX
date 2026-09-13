import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

interface ScrollRevealProps {
  children: ReactNode;
  delay?: number;
}

export const ScrollReveal = ({
  children,
  delay = 0,
}: ScrollRevealProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.15,
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{
        animationDelay: visible ? `${delay}ms` : undefined,
      }}
      className={visible ? "animate-fade-up" : "opacity-0"}
    >
      {children}
    </div>
  );
};