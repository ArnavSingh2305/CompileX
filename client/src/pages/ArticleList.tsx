import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getArticles, getArticleCategories } from "../api/articles";
import type { ArticleSummary } from "../api/articles";
import { ScrollReveal } from "../components/ScrollReveal";

const categoryIcon: Record<string, string> = {
  DSA: "🧩",
  DBMS: "🗄️",
  "Operating Systems": "⚙️",
};

export const ArticleList = () => {
  const [articles, setArticles] = useState<ArticleSummary[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState("");

  useEffect(() => {
    getArticleCategories().then(setCategories).catch(() => {});
  }, []);

  useEffect(() => {
    getArticles(activeCategory || undefined).then(setArticles).catch(() => {});
  }, [activeCategory]);

  return (
    <div className="min-h-screen bg-ivory dark:bg-navy-950 p-8">
      <div className="max-w-4xl mx-auto">
        <ScrollReveal>
          <h1 className="text-3xl font-bold mb-1">Learn</h1>
          <p className="text-slate-500 dark:text-slate-400 mb-6">
            Structured resources to help you understand what you're coding — not just solve it.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={100}>
          <div className="flex gap-2 mb-8 flex-wrap">
            <button
              onClick={() => setActiveCategory("")}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
                !activeCategory ? "bg-gradient-brand text-white" : "glass-card text-slate-600 dark:text-slate-300"
              }`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
                  activeCategory === cat ? "bg-gradient-brand text-white" : "glass-card text-slate-600 dark:text-slate-300"
                }`}
              >
                {categoryIcon[cat] || "📄"} {cat}
              </button>
            ))}
          </div>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 gap-4">
          {articles.map((article, i) => (
            <ScrollReveal key={article._id} delay={Math.min(i * 60, 300)}>
              <Link
                to={`/learn/${article.slug}`}
                className="group block glass-card rounded-2xl p-5 hover:-translate-y-1 hover:shadow-lg transition-all h-full"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs bg-slate-100 dark:bg-white/5 text-slate-500 px-2.5 py-1 rounded-full">
                    {categoryIcon[article.category] || "📄"} {article.category}
                  </span>
                </div>
                <h3 className="font-semibold mb-1.5 group-hover:text-accent-purple transition-colors">
                  {article.title}
                </h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{article.summary}</p>
              </Link>
            </ScrollReveal>
          ))}
        </div>

        {articles.length === 0 && (
          <p className="text-slate-400 text-sm">No articles in this category yet.</p>
        )}
      </div>
    </div>
  );
};