import { useState, useEffect } from "react";

export interface EditorSettings {
  fontSize: number;
  tabSize: number;
  wordWrap: boolean;
}

const readSettings = (): EditorSettings => ({
  fontSize: Number(localStorage.getItem("editor-font-size")) || 14,
  tabSize: Number(localStorage.getItem("editor-tab-size")) || 4,
  wordWrap: localStorage.getItem("editor-word-wrap") === "true",
});

export const useEditorSettings = (): EditorSettings => {
  const [settings, setSettings] = useState<EditorSettings>(readSettings());

  useEffect(() => {
    // storage event fires when another tab changes localStorage — not this one,
    // so we also poll on focus to catch changes made in Settings within the same tab session
    const refresh = () => setSettings(readSettings());
    window.addEventListener("storage", refresh);
    window.addEventListener("focus", refresh);
    return () => {
      window.removeEventListener("storage", refresh);
      window.removeEventListener("focus", refresh);
    };
  }, []);

  return settings;
};