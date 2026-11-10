import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getArticles, getArticleCategories } from "../api/articles";
import type { ArticleSummary } from "../api/articles";
import { ScrollReveal } from "../components/ScrollReveal";
import { Page } from "../components/ui/Page";
import { Tag } from "../components/ui/Tag";
import { categoryTone } from "../components/ui/tones";

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
    <Page
      icon="📚"
      title="Learn"
      description="Structured resources to help you understand what you're coding — not just solve it."
    >
      <ScrollReveal delay={50}>
        <div className="mb-6 flex flex-wrap gap-1 border-b border-fg/10 pb-3">
          <button
            type="button"
            onClick={() => setActiveCategory("")}
            className={`chip ${!activeCategory ? "chip-active" : ""}`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              type="button"
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`chip ${activeCategory === cat ? "chip-active" : ""}`}
            >
              {categoryIcon[cat] || "📄"} {cat}
            </button>
          ))}
        </div>
      </ScrollReveal>

      <div className="grid gap-3 md:grid-cols-2">
        {articles.map((article, i) => (
          <ScrollReveal key={article._id} delay={Math.min(i * 50, 250)}>
            <Link
              to={`/learn/${article.slug}`}
              className="card card-hover group block h-full p-4"
            >
              <div className="mb-2 flex items-center justify-between gap-2">
                <Tag tone={categoryTone(article.category)}>
                  {categoryIcon[article.category] || "📄"} {article.category}
                </Tag>
              </div>
              <h3 className="mb-1 text-[15px] font-semibold leading-snug">{article.title}</h3>
              <p className="line-clamp-3 text-sm leading-6 text-fg/60">{article.summary}</p>
            </Link>
          </ScrollReveal>
        ))}
      </div>

      {articles.length === 0 && (
        <p className="text-sm text-fg/50">No articles in this category yet.</p>
      )}
    </Page>
  );
};
