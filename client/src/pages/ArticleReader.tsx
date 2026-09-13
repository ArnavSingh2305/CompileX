import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import Editor from "@monaco-editor/react";
import { getArticleBySlug } from "../api/articles";
import type { ArticleDetail } from "../api/articles";
import { ScrollReveal } from "../components/ScrollReveal";

const difficultyStyle: Record<string, string> = {
  Easy: "text-green-600 bg-green-50 dark:bg-green-500/10 dark:text-green-400",
  Medium: "text-yellow-600 bg-yellow-50 dark:bg-yellow-500/10 dark:text-yellow-400",
  Hard: "text-red-600 bg-red-50 dark:bg-red-500/10 dark:text-red-400",
};

export const ArticleReader = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [article, setArticle] = useState<ArticleDetail | null>(null);

  useEffect(() => {
    if (!slug) return;
    getArticleBySlug(slug).then(setArticle).catch(() => {});
  }, [slug]);

  const openInCodeLab = (code: string, language: string) => {
    navigate("/code-lab", { state: { prefillCode: code, prefillLanguage: language } });
  };

  if (!article) return <div className="p-8 text-slate-400">Loading...</div>;

  return (
    <div className="min-h-screen bg-ivory dark:bg-navy-950 p-8">
      <div className="max-w-2xl mx-auto">
        <ScrollReveal>
          <Link to="/learn" className="text-accent-purple hover:underline text-sm">← Back to Learn</Link>

          <span className="inline-block text-xs bg-slate-100 dark:bg-white/5 text-slate-500 px-2.5 py-1 rounded-full mt-4 mb-2">
            {article.category}
          </span>
          <h1 className="text-3xl font-bold mb-6">{article.title}</h1>
        </ScrollReveal>

        <ScrollReveal delay={100}>
          <article className="prose dark:prose-invert max-w-none mb-8 prose-headings:font-semibold prose-p:text-slate-600 dark:prose-p:text-slate-300 prose-p:leading-relaxed">
            <ReactMarkdown>{article.content}</ReactMarkdown>
          </article>
        </ScrollReveal>

        {article.codeExamples.map((ex, i) => (
          <ScrollReveal key={i} delay={150}>
            <div className="mb-6">
              {ex.caption && <p className="text-sm text-slate-400 mb-2">{ex.caption}</p>}
              <div className="rounded-xl overflow-hidden border border-slate-200/60 dark:border-white/5">
                <Editor
                  height="250px"
                  language={ex.language}
                  value={ex.code}
                  theme="vs-dark"
                  options={{ readOnly: true, fontSize: 13, minimap: { enabled: false } }}
                />
              </div>
              <button
                onClick={() => openInCodeLab(ex.code, ex.language)}
                className="mt-2 text-sm text-accent-purple hover:underline font-medium"
              >
                Open in CodeLab →
              </button>
            </div>
          </ScrollReveal>
        ))}

        {article.relatedProblems.length > 0 && (
          <ScrollReveal delay={200}>
            <div className="mt-8">
              <h2 className="font-semibold mb-3">Practice</h2>
              <div className="flex flex-col gap-2">
                {article.relatedProblems.map((p) => (
                  <Link
                    key={p._id}
                    to={`/problems/${p.slug}`}
                    className="flex justify-between items-center glass-card rounded-xl p-3 hover:border-accent-purple/40 transition"
                  >
                    <span>{p.title}</span>
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${difficultyStyle[p.difficulty]}`}>
                      {p.difficulty}
                    </span>
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