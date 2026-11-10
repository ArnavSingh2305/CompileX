import { Link } from "react-router-dom";
import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";

const links = [
  { to: "/problems", label: "Problems" },
  { to: "/learn", label: "Learn" },
  { to: "/code-lab", label: "Code Lab" },
];

export const PublicNavbar = () => (
  <header className="sticky top-0 z-40 border-b border-fg/[0.08] bg-bg/85 backdrop-blur">
    <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-5">
      <div className="flex items-center gap-6">
        <Link to="/" className="flex items-center gap-2 font-semibold">
          <Logo size={24} />
          CompileX
        </Link>
        <nav className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="rounded-md px-3 py-1.5 text-sm font-medium text-fg/65 transition-colors hover:bg-fg/5 hover:text-fg"
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="flex items-center gap-1.5">
        <ThemeToggle />
        <Link to="/login" className="btn btn-ghost">
          Login
        </Link>
        <Link to="/register" className="btn btn-primary">
          Get Started
        </Link>
      </div>
    </div>
  </header>
);
