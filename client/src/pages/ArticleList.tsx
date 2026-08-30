import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getArticles, getArticleCategories } from "../api/articles";
import type { ArticleSummary } from "../api/articles";

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
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Learn</h1>

      <div className="flex gap-2 mb-6 flex-wrap">
        <button
          onClick={() => setActiveCategory("")}
          className={`px-3 py-1 rounded text-sm ${!activeCategory ? "bg-blue-600 text-white" : "bg-slate-100"}`}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1 rounded text-sm ${activeCategory === cat ? "bg-blue-600 text-white" : "bg-slate-100"}`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid gap-4">
        {articles.map((article) => (
          <Link
            key={article._id}
            to={`/learn/${article.slug}`}
            className="block bg-white shadow rounded-lg p-4 hover:shadow-md transition"
          >
            <div className="flex justify-between items-start mb-1">
              <h3 className="font-semibold">{article.title}</h3>
              <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded">{article.category}</span>
            </div>
            <p className="text-slate-600 text-sm">{article.summary}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};