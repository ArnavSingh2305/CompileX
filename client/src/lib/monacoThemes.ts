import type { Monaco } from "@monaco-editor/react";

// Custom Monaco themes that match the Notion-style page colours, so the
// editor blends into the page instead of being a hard black box in light mode.
export const defineEditorThemes = (monaco: Monaco) => {
  monaco.editor.defineTheme("compilex-light", {
    base: "vs",
    inherit: true,
    rules: [],
    colors: {
      "editor.background": "#F7F6F3",
      "editorGutter.background": "#F7F6F3",
      "editor.lineHighlightBackground": "#EFEEEA",
      "editorLineNumber.foreground": "#B4B2AC",
      "editorLineNumber.activeForeground": "#6B6A67",
      "editor.selectionBackground": "#2383E233",
      "editorCursor.foreground": "#37352F",
    },
  });

  monaco.editor.defineTheme("compilex-dark", {
    base: "vs-dark",
    inherit: true,
    rules: [],
    colors: {
      "editor.background": "#252525",
      "editorGutter.background": "#252525",
      "editor.lineHighlightBackground": "#2E2E2E",
      "editorLineNumber.foreground": "#5C5C5C",
      "editorLineNumber.activeForeground": "#B0B0B0",
      "editor.selectionBackground": "#2383E255",
      "editorCursor.foreground": "#E6E6E6",
    },
  });
};

export const editorThemeName = (resolved: "light" | "dark") =>
  resolved === "dark" ? "compilex-dark" : "compilex-light";
