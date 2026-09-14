import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import {
  LayoutDashboard,
  Code2,
  BookOpen,
  Terminal,
  Trophy,
  User,
  Settings,
  LogOut,
} from "lucide-react";


const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/problems", label: "Problems", icon: Code2 },
  { to: "/learn", label: "Learn", icon: BookOpen },
  { to: "/code-lab", label: "Code Lab", icon: Terminal },
  { to: "/leaderboard", label: "Leaderboard", icon: Trophy },
];

export const AppSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path: string) => location.pathname.startsWith(path);

  return (
    <aside className="w-56 shrink-0 h-screen sticky top-0 bg-white dark:bg-navy-950 border-r border-slate-200/60 dark:border-white/5 flex flex-col">
      {/* Logo */}
      <Link
        to="/dashboard"
        className="flex items-center gap-2 font-bold text-lg px-5 h-16 border-b border-slate-200/60 dark:border-white/5 text-navy-900 dark:text-white"
      >
        <span className="w-7 h-7 rounded-lg bg-gradient-brand flex items-center justify-center text-white text-sm">
          {"</>"}
        </span>

        CompileX
      </Link>

      {/* Main Navigation */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
        {navItems.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition ${
              isActive(item.to)
                ? "bg-gradient-brand text-white"
                : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5"
            }`}
          >
            <item.icon size={18} strokeWidth={1.8} />
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Account Navigation */}
      <div className="px-3 py-3 border-t border-slate-200/60 dark:border-white/5 flex flex-col gap-1">
        <Link
          to="/profile"
          className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition ${
            isActive("/profile")
              ? "bg-gradient-brand text-white"
              : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5"
          }`}
        >
          <User size={18} strokeWidth={1.8} />
            Profile
        </Link>

        <Link
          to="/settings"
          className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition ${
            isActive("/settings")
              ? "bg-gradient-brand text-white"
              : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5"
          }`}
        >
          <Settings size={18} strokeWidth={1.8} />
            Settings
        </Link>
                
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition text-left"
        >
          <LogOut size={18} strokeWidth={1.8} />
          Logout
        </button>

        {user && (
          <div className="px-3 pt-2 text-xs text-slate-400 truncate">
            {user.email}
          </div>
        )}
      </div>
    </aside>
  );
};