import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  BookOpen,
  LayoutDashboard,
  ListChecks,
  LogOut,
  Menu,
  Settings,
  Terminal,
  Trophy,
  User,
  X,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/problems", label: "Problems", icon: ListChecks },
  { to: "/learn", label: "Learn", icon: BookOpen },
  { to: "/code-lab", label: "Code Lab", icon: Terminal },
  { to: "/leaderboard", label: "Leaderboard", icon: Trophy },
];

const itemClass = (active: boolean) =>
  `flex w-full items-center gap-2.5 rounded-md px-2.5 py-1.5 text-sm transition-colors ${
    active ? "bg-fg/[0.08] font-medium text-fg" : "text-fg/65 hover:bg-fg/5 hover:text-fg"
  }`;

const SidebarContent = ({ onNavigate }: { onNavigate?: () => void }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    onNavigate?.();
    logout();
    navigate("/login");
  };

  const isActive = (path: string) => location.pathname.startsWith(path);

  return (
    <div className="flex h-full flex-col">
      <Link
        to="/dashboard"
        onClick={onNavigate}
        className="mx-2 mt-3 flex items-center gap-2.5 rounded-md px-2 py-1.5 font-semibold transition-colors hover:bg-fg/5"
      >
        <Logo size={22} />
        CompileX
      </Link>

      <nav className="mt-4 flex flex-1 flex-col gap-0.5 px-2">
        <p className="px-2.5 pb-1 text-xs font-medium text-fg/40">Workspace</p>
        {navItems.map(({ to, label, icon: Icon }) => (
          <Link key={to} to={to} onClick={onNavigate} className={itemClass(isActive(to))}>
            <Icon size={18} className={isActive(to) ? "text-fg" : "text-fg/50"} />
            {label}
          </Link>
        ))}
      </nav>

      <div className="flex flex-col gap-0.5 border-t border-fg/[0.08] px-2 py-2">
        <Link to="/profile" onClick={onNavigate} className={itemClass(isActive("/profile"))}>
          <User size={18} className={isActive("/profile") ? "text-fg" : "text-fg/50"} />
          Profile
        </Link>
        <Link to="/settings" onClick={onNavigate} className={itemClass(isActive("/settings"))}>
          <Settings size={18} className={isActive("/settings") ? "text-fg" : "text-fg/50"} />
          Settings
        </Link>
        <button
          type="button"
          onClick={handleLogout}
          className={`${itemClass(false)} text-left hover:text-[rgb(var(--t-red-fg))]`}
        >
          <LogOut size={18} className="text-fg/50" />
          Logout
        </button>

        {user && (
          <div className="mt-1 flex items-center gap-2 rounded-md px-2 py-1.5">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-fg/10 text-xs font-semibold">
              {user.name?.[0]?.toUpperCase() || "?"}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-medium leading-4">{user.name}</p>
              <p className="truncate text-[11px] text-fg/50">{user.email}</p>
            </div>
            <ThemeToggle />
          </div>
        )}
      </div>
    </div>
  );
};

export const AppSidebar = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen w-60 shrink-0 border-r border-fg/[0.08] bg-side md:block">
        <SidebarContent />
      </aside>

      {/* Mobile top bar + drawer */}
      <div className="sticky top-0 z-40 flex h-12 items-center justify-between border-b border-fg/[0.08] bg-side px-3 md:hidden">
        <Link to="/dashboard" className="flex items-center gap-2 font-semibold">
          <Logo size={22} />
          CompileX
        </Link>
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          className="inline-flex h-8 w-8 items-center justify-center rounded-md text-fg/70 hover:bg-fg/5"
        >
          <Menu size={20} />
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 md:hidden" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-72 animate-fade-in bg-side shadow-pop">
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="absolute right-2 top-2 inline-flex h-8 w-8 items-center justify-center rounded-md text-fg/60 hover:bg-fg/5"
            >
              <X size={18} />
            </button>
            <SidebarContent onNavigate={() => setOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
};
