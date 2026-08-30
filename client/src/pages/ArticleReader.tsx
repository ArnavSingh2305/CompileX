import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import Editor from "@monaco-editor/react";
import { getArticleBySlug } from "../api/articles";
import type { ArticleDetail } from "../api/articles";

const difficultyColor: Record<string, string> = {
  Easy: "text-green-600 bg-green-50",
  Medium: "text-yellow-600 bg-yellow-50",
  Hard: "text-red-600 bg-red-50",
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
    // pass code via navigation state so CodeLab can pre-fill it
    navigate("/code-lab", { state: { prefillCode: code, prefillLanguage: language } });
  };

  if (!article) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded">{article.category}</span>
      <h1 className="text-2xl font-bold mt-2 mb-4">{article.title}</h1>

      <article className="prose max-w-none mb-8">
        <ReactMarkdown>{article.content}</ReactMarkdown>
      </article>

      {article.codeExamples.map((ex, i) => (
        <div key={i} className="mb-6">
          {ex.caption && <p className="text-sm text-slate-500 mb-1">{ex.caption}</p>}
          <div className="border rounded overflow-hidden">
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
            className="mt-2 text-sm text-blue-600 hover:underline"
          >
            Open in CodeLab →
          </button>
        </div>
      ))}

      {article.relatedProblems.length > 0 && (
        <div className="mt-8">
          <h2 className="font-semibold mb-3">Practice</h2>
          <div className="flex flex-col gap-2">
            {article.relatedProblems.map((p) => (
              <Link
                key={p._id}
                to={`/problems/${p.slug}`}
                className="flex justify-between items-center bg-white shadow rounded p-3 hover:bg-slate-50"
              >
                <span>{p.title}</span>
                <span className={`text-xs font-medium px-2 py-1 rounded ${difficultyColor[p.difficulty]}`}>
                  {p.difficulty}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};