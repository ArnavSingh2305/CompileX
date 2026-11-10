import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import Editor from "@monaco-editor/react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { getArticleBySlug } from "../api/articles";
import type { ArticleDetail } from "../api/articles";
import { ScrollReveal } from "../components/ScrollReveal";
import { useTheme } from "../context/ThemeContext";
import { defineEditorThemes, editorThemeName } from "../lib/monacoThemes";
import { Tag } from "../components/ui/Tag";
import { categoryTone, difficultyTone } from "../components/ui/tones";

export const ArticleReader = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { resolvedTheme } = useTheme();
  const [article, setArticle] = useState<ArticleDetail | null>(null);

  useEffect(() => {
    if (!slug) return;
    getArticleBySlug(slug).then(setArticle).catch(() => {});
  }, [slug]);

  const openInCodeLab = (code: string, language: string) => {
    navigate("/code-lab", { state: { prefillCode: code, prefillLanguage: language } });
  };

  if (!article) {
    return (
      <div className="mx-auto w-full max-w-3xl space-y-3 px-5 py-16 md:px-12">
        <div className="skeleton h-4 w-24" />
        <div className="skeleton h-10 w-2/3" />
        <div className="skeleton h-4 w-full" />
        <div className="skeleton h-4 w-5/6" />
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mx-auto max-w-3xl px-5 pb-24 pt-10 md:px-12 md:pt-16">
        <ScrollReveal>
          <Link
            to="/learn"
            className="inline-flex items-center gap-1.5 text-sm text-fg/55 transition-colors hover:text-fg"
          >
            <ArrowLeft size={14} />
            Back to Learn
          </Link>

          <div className="mt-6">
            <Tag tone={categoryTone(article.category)}>{article.category}</Tag>
          </div>
          <h1 className="mb-8 mt-3 text-4xl font-bold leading-tight tracking-tight">
            {article.title}
          </h1>
        </ScrollReveal>

        <ScrollReveal delay={50}>
          <article className="prose prose-notion mb-10 max-w-none leading-relaxed">
            <ReactMarkdown>{article.content}</ReactMarkdown>
          </article>
        </ScrollReveal>

        {article.codeExamples.map((ex, i) => (
          <ScrollReveal key={i} delay={100}>
            <div className="mb-8">
              {ex.caption && <p className="mb-2 text-sm text-fg/55">{ex.caption}</p>}
              <div className="overflow-hidden rounded-lg border border-fg/10">
                <Editor
                  height="250px"
                  language={ex.language}
                  value={ex.code}
                  theme={editorThemeName(resolvedTheme)}
                  beforeMount={defineEditorThemes}
                  options={{
                    readOnly: true,
                    fontSize: 13,
                    minimap: { enabled: false },
                    scrollBeyondLastLine: false,
                    padding: { top: 12 },
                  }}
                />
              </div>
              <button
                type="button"
                onClick={() => openInCodeLab(ex.code, ex.language)}
                className="btn btn-secondary mt-3"
              >
                Open in CodeLab
                <ArrowRight size={14} />
              </button>
            </div>
          </ScrollReveal>
        ))}

        {article.relatedProblems.length > 0 && (
          <ScrollReveal delay={150}>
            <div className="mt-12">
              <h2 className="mb-3 text-xl font-semibold">Practice</h2>
              <div className="card divide-y divide-fg/[0.07] overflow-hidden">
                {article.relatedProblems.map((p) => (
                  <Link
                    key={p._id}
                    to={`/problems/${p.slug}`}
                    className="card-hover flex items-center justify-between gap-3 px-4 py-3"
                  >
                    <span className="text-sm font-medium">{p.title}</span>
                    <Tag tone={difficultyTone(p.difficulty)}>{p.difficulty}</Tag>
                  </Link>
                ))}
              </div>
            </div>
          </ScrollReveal>
        )}
      </div>
    </div>
  );
};
