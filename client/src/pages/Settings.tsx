import { useState } from "react";
import type { ReactNode } from "react";
import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { ScrollReveal } from "../components/ScrollReveal";
import api from "../api/axios";
import type { FormEvent } from "react";
import { Page } from "../components/ui/Page";
import { Callout } from "../components/ui/Callout";

const themeOptions = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
] as const;

const Row = ({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) => (
  <div className="flex items-center justify-between gap-6 border-b border-fg/[0.07] py-3.5 last:border-b-0">
    <div className="min-w-0">
      <p className="text-sm font-medium">{title}</p>
      {description && <p className="mt-0.5 text-xs text-fg/50">{description}</p>}
    </div>
    <div className="shrink-0">{children}</div>
  </div>
);

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
      await api.post("/auth/change-password", { oldPassword, newPassword });
      setPasswordMsg("Password updated successfully.");
      setOldPassword("");
      setNewPassword("");
    } catch (err: any) {
      setPasswordError(err.response?.data?.message || "Failed to update password");
    }
  };

  return (
    <Page
      icon="⚙️"
      title="Settings"
      description="Manage your account, preferences and theme."
      width="sm"
    >
      <ScrollReveal delay={50}>
        <section className="mb-8">
          <h2 className="mb-3 text-base font-semibold">Appearance</h2>
          <div className="grid grid-cols-3 gap-3">
            {themeOptions.map(({ value, label, icon: Icon }) => (
              <button
                type="button"
                key={value}
                onClick={() => setMode(value)}
                aria-pressed={mode === value}
                className={`flex flex-col items-center gap-2 rounded-lg border px-3 py-4 text-sm font-medium transition-colors ${
                  mode === value
                    ? "border-accent bg-accent/[0.06] text-fg"
                    : "border-fg/10 text-fg/60 hover:bg-fg/[0.04] hover:text-fg"
                }`}
              >
                <Icon size={20} />
                {label}
              </button>
            ))}
          </div>
        </section>
      </ScrollReveal>

      <ScrollReveal delay={100}>
        <section className="mb-8">
          <h2 className="mb-1 text-base font-semibold">Editor</h2>
          <div>
            <Row title="Font size" description={`${fontSize}px`}>
              <input
                type="range"
                min={12}
                max={20}
                value={fontSize}
                onChange={(e) => updateFontSize(Number(e.target.value))}
                className="w-40"
                aria-label="Font size"
              />
            </Row>

            <Row title="Tab size" description={`${tabSize} spaces`}>
              <input
                type="range"
                min={2}
                max={8}
                step={2}
                value={tabSize}
                onChange={(e) => updateTabSize(Number(e.target.value))}
                className="w-40"
                aria-label="Tab size"
              />
            </Row>

            <Row title="Word wrap" description="Wrap long lines instead of scrolling sideways">
              <button
                type="button"
                role="switch"
                aria-checked={wordWrap}
                aria-label="Word wrap"
                onClick={() => updateWordWrap(!wordWrap)}
                className={`relative h-5 w-9 rounded-full transition-colors ${
                  wordWrap ? "bg-accent" : "bg-fg/20"
                }`}
              >
                <span
                  className={`absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${
                    wordWrap ? "translate-x-4" : ""
                  }`}
                />
              </button>
            </Row>
          </div>
        </section>
      </ScrollReveal>

      <ScrollReveal delay={150}>
        <section>
          <h2 className="mb-1 text-base font-semibold">Account</h2>

          <Row title="Email">
            <span className="text-sm text-fg/60">{user?.email}</span>
          </Row>

          <form onSubmit={handleChangePassword} className="mt-5 space-y-3">
            <p className="text-sm font-medium">Change password</p>

            {passwordMsg && (
              <Callout tone="green" icon="✅" role="status">
                {passwordMsg}
              </Callout>
            )}
            {passwordError && (
              <Callout tone="red" icon="⚠️" role="alert">
                {passwordError}
              </Callout>
            )}

            <input
              type="password"
              placeholder="Current password"
              autoComplete="current-password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className="input"
            />
            <input
              type="password"
              placeholder="New password"
              autoComplete="new-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="input"
            />
            <button type="submit" className="btn btn-primary">
              Update Password
            </button>
          </form>
        </section>
      </ScrollReveal>
    </Page>
  );
};
