import { Link } from "react-router-dom";
import {
  Code2,
  ChartNoAxesCombined,
  Sparkles,
} from "lucide-react";
import { CountUp } from "../components/CountUp";
import { ScrollReveal } from "../components/ScrollReveal";

const codeSnippet = `#include <iostream>
using namespace std;

int main() {
    cout << "Hello, CompileX!";
    return 0;
}`;

const LandingPage = () => {
  return (
    <main className="bg-ivory dark:bg-navy-950 overflow-hidden">
      {/* HERO */}
      <section className="relative bg-grid min-h-[calc(100vh-4rem)] flex items-center">
        {/* Background glow */}
        <div
          className="absolute top-1/4 left-1/4 w-72 h-72 bg-accent-pink/20 rounded-full blur-3xl animate-blob"
          aria-hidden="true"
        />

        <div
          className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-accent-purple/20 rounded-full blur-3xl animate-blob"
          style={{ animationDelay: "4s" }}
          aria-hidden="true"
        />

        <div className="relative max-w-7xl mx-auto w-full px-6 py-20">
          <div className="grid md:grid-cols-2 gap-14 items-center">
            {/* Hero Content */}
            <div>
              <span className="inline-flex items-center text-xs font-medium px-3 py-1.5 rounded-full bg-white/60 dark:bg-white/5 border border-slate-200/70 dark:border-white/10 text-slate-600 dark:text-slate-300 mb-6">
                Code · Learn · Grow
              </span>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.05] tracking-tight text-navy-900 dark:text-white">
                Turn Ideas Into{" "}
                <span className="bg-gradient-brand bg-clip-text text-transparent">
                  Better Code.
                </span>
              </h1>

              <p className="mt-6 text-lg md:text-xl leading-relaxed text-slate-600 dark:text-slate-300 max-w-xl">
                Practice DSA, learn development, and build your coding skills
                with one focused developer platform.
              </p>

              <div className="flex flex-wrap gap-4 mt-9">
                <Link
                  to="/register"
                  className="px-6 py-3.5 rounded-xl bg-gradient-brand text-white font-medium shadow-lg shadow-accent-purple/20 hover:-translate-y-0.5 hover:shadow-xl transition-all duration-200"
                >
                  Get Started Free →
                </Link>

                <Link
                  to="/problems"
                  className="px-6 py-3.5 rounded-xl border border-slate-300 dark:border-white/10 bg-white/40 dark:bg-white/5 font-medium text-navy-900 dark:text-white hover:-translate-y-0.5 hover:bg-white/70 dark:hover:bg-white/10 transition-all duration-200"
                >
                  Explore Problems
                </Link>
              </div>
            </div>

            {/* Code Window */}
            <div className="relative animate-float">
              <div className="rounded-2xl overflow-hidden shadow-2xl border border-slate-200/50 dark:border-white/10 bg-navy-900">
                {/* Editor Header */}
                <div className="flex items-center gap-1.5 px-4 py-3 bg-navy-900/80">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                  <span className="w-2.5 h-2.5 rounded-full bg-green-400" />

                  <span className="ml-3 text-xs text-slate-400">
                    main.cpp
                  </span>
                </div>

                {/* Code */}
                <pre className="p-5 text-sm text-slate-200 font-mono leading-relaxed overflow-x-auto">
                  {codeSnippet}
                </pre>

                {/* Execution Result */}
                <div className="px-5 py-3 bg-navy-900/60 border-t border-white/5 text-green-400 text-sm font-medium">
                  ✓ Accepted
                </div>
              </div>

              {/* Floating labels */}
              <span className="absolute -top-6 -left-6 text-xs font-medium px-3 py-1.5 rounded-full bg-white dark:bg-navy-900 text-navy-900 dark:text-white shadow-md border border-slate-200/60 dark:border-white/10 animate-float-delayed">
                DSA
              </span>

              <span className="absolute -bottom-6 -right-4 text-xs font-medium px-3 py-1.5 rounded-full bg-white dark:bg-navy-900 text-navy-900 dark:text-white shadow-md border border-slate-200/60 dark:border-white/10 animate-float">
                Learn
              </span>
            </div>
          </div>
        </div>
      </section>
      {/* STATS */}
        <ScrollReveal>
        <section className="max-w-5xl mx-auto px-6 py-16">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
                { end: 33, suffix: "+", label: "Problems" },
                { end: 5, suffix: "", label: "Learning Articles" },
                { end: 2, suffix: "", label: "Languages" },
                { end: 100, suffix: "%", label: "Free to Use" },
            ].map((stat) => (
                <div key={stat.label}>
                <p className="text-3xl md:text-4xl font-extrabold bg-gradient-brand bg-clip-text text-transparent">
                    <CountUp end={stat.end} suffix={stat.suffix} />
                </p>

                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                    {stat.label}
                </p>
                </div>
            ))}
            </div>
        </section>
        </ScrollReveal>
        {/* WHY COMPILEX */}
        <ScrollReveal>
        <section className="max-w-5xl mx-auto px-6 py-20">
            <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="text-sm font-medium text-accent-purple mb-3">
                Built for developers
            </p>

            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-navy-900 dark:text-white">
                Why CompileX?
            </h2>

            <p className="mt-4 text-slate-600 dark:text-slate-400">
                Everything you need to practice, learn, and improve — without
                jumping between different platforms.
            </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
            {[
                {
                icon: Code2,
                title: "Real Code Execution",
                description:
                    "Write and run C++ or Python instantly with a full Monaco editor experience.",
                },
                {
                icon: ChartNoAxesCombined,
                title: "Track Real Progress",
                description:
                    "Difficulty breakdowns, topic mastery, and progress that reflect your actual coding journey.",
                },
                {
                icon: Sparkles,
                title: "AI Built Into the Workflow",
                description:
                    "Contextual hints, explanations, debugging, and complexity analysis right where you're solving.",
                },
            ].map((feature) => {
                const Icon = feature.icon;

                return (
                <div
                    key={feature.title}
                    className="glass-card rounded-2xl p-7 hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
                >
                    <div className="w-11 h-11 rounded-xl bg-gradient-brand flex items-center justify-center text-white mb-5">
                    <Icon size={21} strokeWidth={1.8} />
                    </div>

                    <h3 className="text-lg font-semibold text-navy-900 dark:text-white mb-3">
                    {feature.title}
                    </h3>

                    <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                    {feature.description}
                    </p>
                </div>
                );
            })}
            </div>
        </section>
        </ScrollReveal>
        {/* CODE LAB PREVIEW */}
        <ScrollReveal>
        <section className="max-w-6xl mx-auto px-6 py-20">
            <div className="grid md:grid-cols-2 gap-12 items-center">
            
            {/* Text */}
            <div>
                <p className="text-sm font-medium text-accent-purple mb-3">
                Code without limits
                </p>

                <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-navy-900 dark:text-white">
                A Real Code Lab,
                <br />
                Not a Toy Editor.
                </h2>

                <p className="mt-5 text-slate-600 dark:text-slate-400 leading-relaxed max-w-lg">
                Write, run, and experiment with real code in a full Monaco
                editor. Switch between languages, provide input, and see your
                output instantly.
                </p>

                <div className="mt-7 flex flex-wrap gap-3">
                <span className="px-3 py-1.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300">
                    Monaco Editor
                </span>

                <span className="px-3 py-1.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300">
                    C++
                </span>

                <span className="px-3 py-1.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-white/5 text-slate-300">
                    Python
                </span>
                </div>
            </div>

            {/* Editor Preview */}
            <div className="glass-card rounded-2xl overflow-hidden shadow-xl">
                
                {/* Editor Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200/60 dark:border-white/5">
                <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                    <span className="w-2.5 h-2.5 rounded-full bg-green-400" />
                </div>

                <span className="text-xs text-slate-400 font-mono">
                    playground.cpp
                </span>

                <span className="text-xs text-green-500 font-medium">
                    C++
                </span>
                </div>

                {/* Language Tabs */}
                <div className="flex gap-1 px-4 py-2 border-b border-slate-200/60 dark:border-white/5">
                <span className="px-3 py-1 rounded-md text-xs font-medium bg-navy-900 text-white">
                    C++
                </span>

                <span className="px-3 py-1 rounded-md text-xs text-slate-500 dark:text-slate-400">
                    Python
                </span>
                </div>

                {/* Code */}
                <pre className="bg-navy-950 text-slate-200 p-5 min-h-52 text-xs md:text-sm font-mono leading-relaxed overflow-x-auto">
        {`#include <iostream>
        using namespace std;

        int main() {
            int a = 10;
            int b = 20;

            cout << a + b << endl;

            return 0;
        }`}
                </pre>

                {/* Bottom Bar */}
                <div className="flex items-center justify-between px-4 py-3 bg-white/60 dark:bg-white/5 border-t border-slate-200/60 dark:border-white/5">
                <span className="text-xs text-slate-500 dark:text-slate-400">
                    Output: 30
                </span>

                <button
                    type="button"
                    className="px-4 py-1.5 rounded-lg bg-gradient-brand text-white text-xs font-medium"
                >
                    Run Code
                </button>
                </div>
            </div>
            </div>
        </section>
        </ScrollReveal>
        {/* PROGRESS & ANALYTICS PREVIEW */}
        <ScrollReveal>
        <section className="max-w-6xl mx-auto px-6 py-20">
            <div className="grid md:grid-cols-2 gap-12 items-center">

            {/* Analytics Preview */}
            <div className="order-2 md:order-1 glass-card rounded-2xl p-6 shadow-lg">
                <div className="flex items-center justify-between mb-6">
                <div>
                    <p className="text-sm font-semibold text-navy-900 dark:text-white">
                    Topic Proficiency
                    </p>

                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Your current progress
                    </p>
                </div>

                <span className="text-xs font-medium text-accent-purple">
                    68% overall
                </span>
                </div>

                <div className="space-y-5">
                {/* Arrays */}
                <div>
                    <div className="flex items-center justify-between text-xs mb-2">
                    <span className="text-slate-600 dark:text-slate-300">
                        Arrays
                    </span>

                    <span className="text-slate-400">
                        80%
                    </span>
                    </div>

                    <div className="w-full h-2 bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden">
                    <div className="w-4/5 h-full bg-gradient-brand rounded-full" />
                    </div>
                </div>

                {/* Strings */}
                <div>
                    <div className="flex items-center justify-between text-xs mb-2">
                    <span className="text-slate-600 dark:text-slate-300">
                        Strings
                    </span>

                    <span className="text-slate-400">
                        65%
                    </span>
                    </div>

                    <div className="w-full h-2 bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden">
                    <div className="w-[65%] h-full bg-gradient-brand rounded-full" />
                    </div>
                </div>

                {/* Binary Search */}
                <div>
                    <div className="flex items-center justify-between text-xs mb-2">
                    <span className="text-slate-600 dark:text-slate-300">
                        Binary Search
                    </span>

                    <span className="text-slate-400">
                        55%
                    </span>
                    </div>

                    <div className="w-full h-2 bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden">
                    <div className="w-[55%] h-full bg-gradient-brand rounded-full" />
                    </div>
                </div>

                {/* Dynamic Programming */}
                <div>
                    <div className="flex items-center justify-between text-xs mb-2">
                    <span className="text-slate-600 dark:text-slate-300">
                        Dynamic Programming
                    </span>

                    <span className="text-slate-400">
                        40%
                    </span>
                    </div>

                    <div className="w-full h-2 bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden">
                    <div className="w-2/5 h-full bg-gradient-brand rounded-full" />
                    </div>
                </div>
                </div>

                {/* Difficulty summary */}
                <div className="mt-7 pt-5 border-t border-slate-200/60 dark:border-white/5">
                <div className="grid grid-cols-3 gap-3 text-center">
                    <div>
                    <p className="text-lg font-bold text-green-500">
                        18
                    </p>

                    <p className="text-[11px] text-slate-400">
                        Easy
                    </p>
                    </div>

                    <div>
                    <p className="text-lg font-bold text-yellow-500">
                        11
                    </p>

                    <p className="text-[11px] text-slate-400">
                        Medium
                    </p>
                    </div>

                    <div>
                    <p className="text-lg font-bold text-red-500">
                        4
                    </p>

                    <p className="text-[11px] text-slate-400">
                        Hard
                    </p>
                    </div>
                </div>
                </div>
            </div>

            {/* Text */}
            <div className="order-1 md:order-2">
                <p className="text-sm font-medium text-accent-purple mb-3">
                Know what to practice next
                </p>

                <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-navy-900 dark:text-white">
                See Exactly Where
                <br />
                You Stand.
                </h2>

                <p className="mt-5 text-slate-600 dark:text-slate-400 leading-relaxed max-w-lg">
                Topic-by-topic progress, difficulty breakdowns, and
                proficiency insights help you understand your strengths
                and identify the concepts that need more practice.
                </p>

                <div className="mt-7 flex flex-wrap gap-3">
                <span className="px-3 py-1.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300">
                    Topic Proficiency
                </span>

                <span className="px-3 py-1.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300">
                    Difficulty Breakdown
                </span>

                <span className="px-3 py-1.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300">
                    Progress Tracking
                </span>
                </div>
            </div>
            </div>
        </section>
        </ScrollReveal>
        {/* FINAL CTA */}
        <ScrollReveal>
        <section className="relative mt-10 bg-gradient-brand py-20 overflow-hidden">
            {/* Decorative glow */}
            <div
            className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-white/10 blur-3xl"
            aria-hidden="true"
            />

            <div
            className="absolute -bottom-24 -right-24 w-72 h-72 rounded-full bg-white/10 blur-3xl"
            aria-hidden="true"
            />

            <div className="relative max-w-3xl mx-auto px-6 text-center">
            <p className="text-sm font-medium text-white/70 mb-4">
                Start building better habits
            </p>

            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white">
                Ready to build better code?
            </h2>

            <p className="mt-5 text-white/80 text-base md:text-lg max-w-xl mx-auto">
                Practice, learn, and improve with CompileX — completely free.
            </p>

            <Link
                to="/register"
                className="inline-flex items-center mt-8 px-7 py-3.5 rounded-xl bg-white text-navy-900 font-semibold shadow-lg hover:-translate-y-0.5 hover:shadow-xl transition-all duration-200"
            >
                Get Started Free →
            </Link>
            </div>
        </section>
        </ScrollReveal>
        {/* FOOTER */}
        <footer className="py-8 border-t border-slate-200/60 dark:border-white/5">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-md bg-gradient-brand flex items-center justify-center text-white text-xs">
                {"</>"}
            </span>

            <span className="text-sm font-semibold text-navy-900 dark:text-white">
                CompileX
            </span>
            </div>

            <p className="text-xs text-slate-400 text-center">
            © {new Date().getFullYear()} CompileX — Code · Learn · Build · Grow
            </p>

            <div className="flex items-center gap-5 text-xs text-slate-500 dark:text-slate-400">
            <Link
                to="/problems"
                className="hover:text-navy-900 dark:hover:text-white transition-colors"
            >
                Problems
            </Link>

            <Link
                to="/learn"
                className="hover:text-navy-900 dark:hover:text-white transition-colors"
            >
                Learn
            </Link>

            <Link
                to="/code-lab"
                className="hover:text-navy-900 dark:hover:text-white transition-colors"
            >
                Code Lab
            </Link>
            </div>
        </div>
        </footer>
    </main>
  );
};

export default LandingPage;