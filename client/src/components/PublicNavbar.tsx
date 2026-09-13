import { Link } from "react-router-dom";

export const PublicNavbar = () => {
  return (
    <nav className="sticky top-0 z-40 bg-white/70 dark:bg-navy-950/70 backdrop-blur-xl border-b border-slate-200/50 dark:border-white/5">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 font-bold text-lg text-navy-900 dark:text-white"
        >
          <span className="w-7 h-7 rounded-lg bg-gradient-brand flex items-center justify-center text-white text-sm">
            {"</>"}
          </span>

          CompileX
        </Link>

        {/* Main Navigation */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600 dark:text-slate-300">
          <Link
            to="/problems"
            className="hover:text-navy-900 dark:hover:text-white transition-colors duration-200"
          >
            Problems
          </Link>

          <Link
            to="/learn"
            className="hover:text-navy-900 dark:hover:text-white transition-colors duration-200"
          >
            Learn
          </Link>

          <Link
            to="/code-lab"
            className="hover:text-navy-900 dark:hover:text-white transition-colors duration-200"
          >
            Code Lab
          </Link>
        </div>

        {/* Auth Actions */}
        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="text-sm font-medium px-4 py-2 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5 transition-all duration-200"
          >
            Login
          </Link>

          <Link
            to="/register"
            className="text-sm font-medium px-4 py-2.5 rounded-lg bg-navy-900 text-white dark:bg-white dark:text-navy-900 hover:opacity-90 transition-all duration-200"
          >
            Get Started
          </Link>
        </div>

      </div>
    </nav>
  );
};