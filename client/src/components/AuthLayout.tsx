import type { ReactNode } from "react";

export const AuthLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="min-h-screen grid md:grid-cols-2">
      {/* Left: brand panel */}
      <div className="hidden md:flex relative bg-gradient-dark items-center justify-center overflow-hidden bg-grid">
        <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-accent-pink/20 rounded-full blur-3xl animate-blob" />
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-accent-blue/20 rounded-full blur-3xl animate-blob" style={{ animationDelay: "5s" }} />

        <div className="relative text-center px-10">
          <span className="inline-flex items-center gap-2 text-white/90 font-bold text-xl mb-8">
            <span className="w-8 h-8 rounded-lg bg-gradient-brand flex items-center justify-center text-sm">{"</>"}</span>
            CompileX
          </span>
          <h2 className="text-4xl font-extrabold text-white leading-tight mb-3">
            Build better.<br />Learn smarter.
          </h2>
          <p className="text-white/60 max-w-xs mx-auto">
            One focused platform to practice, learn, and track your growth as a developer.
          </p>
        </div>
      </div>

      {/* Right: auth card */}
      <div className="flex items-center justify-center bg-ivory dark:bg-navy-950 p-6">
        {children}
      </div>
    </div>
  );
};