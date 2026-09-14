import { useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { ScrollReveal } from "../components/ScrollReveal";
import api from "../api/axios";
import type { FormEvent } from "react";

export const Settings = () => {
  const { mode, setMode } = useTheme();
  const { user } = useAuth();

  const [fontSize, setFontSize] = useState(() => Number(localStorage.getItem("editor-font-size")) || 14);
  const [tabSize, setTabSize] = useState(() => Number(localStorage.getItem("editor-tab-size")) || 4);
  const [wordWrap, setWordWrap] = useState(() => localStorage.getItem("editor-word-wrap") === "true");

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordMsg, setPasswordMsg] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const updateFontSize = (val: number) => {
    setFontSize(val);
    localStorage.setItem("editor-font-size", String(val));
  };
  const updateTabSize = (val: number) => {
    setTabSize(val);
    localStorage.setItem("editor-tab-size", String(val));
  };
  const updateWordWrap = (val: boolean) => {
    setWordWrap(val);
    localStorage.setItem("editor-word-wrap", String(val));
  };

  const handleChangePassword = async (e: FormEvent) => {
    e.preventDefault();
    setPasswordMsg("");
    setPasswordError("");
    try {
      // Note: this assumes a change-password endpoint exists (differs from reset-password,
      // which is for forgotten passwords). If not built yet, this is a small addition —
      // flagging rather than silently faking it.
      await api.post("/auth/change-password", { oldPassword, newPassword });
      setPasswordMsg("Password updated successfully.");
      setOldPassword("");
      setNewPassword("");
    } catch (err: any) {
      setPasswordError(err.response?.data?.message || "Failed to update password");
    }
  };

  return (
    <div className="min-h-screen bg-ivory dark:bg-navy-950 p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <ScrollReveal>
          <h1 className="text-2xl font-bold mb-1">Settings</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">Manage your account, preferences and theme.</p>
        </ScrollReveal>

        <ScrollReveal delay={100}>
          <section className="glass-card rounded-2xl p-5">
            <h2 className="font-semibold mb-4">Appearance</h2>
            <div className="flex gap-2">
              {(["light", "dark", "system"] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-medium capitalize transition ${
                    mode === m ? "bg-gradient-brand text-white" : "bg-slate-100 dark:bg-white/5 text-slate-500"
                  }`}
                >
                  {m === "light" ? "☀️ Light" : m === "dark" ? "🌙 Dark" : "💻 System"}
                </button>
              ))}
            </div>
          </section>
        </ScrollReveal>

        <ScrollReveal delay={150}>
          <section className="glass-card rounded-2xl p-5">
            <h2 className="font-semibold mb-4">Editor</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Font Size</span><span className="text-slate-400">{fontSize}px</span>
                </div>
                <input type="range" min={12} max={20} value={fontSize} onChange={(e) => updateFontSize(Number(e.target.value))} className="w-full" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Tab Size</span><span className="text-slate-400">{tabSize}</span>
                </div>
                <input type="range" min={2} max={8} step={2} value={tabSize} onChange={(e) => updateTabSize(Number(e.target.value))} className="w-full" />
              </div>
              <label className="flex items-center justify-between text-sm">
                <span>Word Wrap</span>
                <input type="checkbox" checked={wordWrap} onChange={(e) => updateWordWrap(e.target.checked)} className="w-4 h-4" />
              </label>
            </div>
          </section>
        </ScrollReveal>

        <ScrollReveal delay={200}>
          <section className="glass-card rounded-2xl p-5">
            <h2 className="font-semibold mb-4">Account</h2>
            <p className="text-sm text-slate-500 mb-1">Email</p>
            <p className="text-sm mb-4">{user?.email}</p>

            <form onSubmit={handleChangePassword} className="space-y-2">
              <p className="text-sm text-slate-500 mb-1">Change Password</p>
              {passwordMsg && <p className="text-green-600 text-sm">{passwordMsg}</p>}
              {passwordError && <p className="text-red-500 text-sm">{passwordError}</p>}
              <input
                type="password"
                placeholder="Current password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="w-full glass-card rounded-lg px-3 py-2 text-sm"
              />
              <input
                type="password"
                placeholder="New password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full glass-card rounded-lg px-3 py-2 text-sm"
              />
              <button type="submit" className="text-sm bg-gradient-brand text-white px-4 py-2 rounded-lg font-medium">
                Update Password
              </button>
            </form>
          </section>
        </ScrollReveal>
      </div>
    </div>
  );
};