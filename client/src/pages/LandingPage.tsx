import { Link } from "react-router-dom";
import { Code2, ChartNoAxesCombined, Sparkles } from "lucide-react";
import { CountUp } from "../components/CountUp";
import { ScrollReveal } from "../components/ScrollReveal";
import { Logo } from "../components/Logo";
import { Tag } from "../components/ui/Tag";

type Tok = [cls: string, text: string];

// Hero snippet (same program as before), tokenised for colouring
const heroCode: Tok[][] = [
  [["syn-kw", "#include"], ["", " "], ["syn-str", "<iostream>"]],
  [["syn-kw", "using namespace"], ["", " std;"]],
  [],
  [["syn-kw", "int"], ["", " "], ["syn-fn", "main"], ["", "() {"]],
  [["", "    cout << "], ["syn-str", '"Hello, CompileX!"'], ["", ";"]],
  [["", "    "], ["syn-kw", "return"], ["", " "], ["syn-num", "0"], ["", ";"]],
  [["", "}"]],
];

const labCode: Tok[][] = [
  [["syn-kw", "int"], ["", " a = "], ["syn-num", "10"], ["", ", b = "], ["syn-num", "20"], ["", ";"]],
  [["", "cout << "], ["syn-str", '"Output: "'], ["", " << a + b;"]],
];

const CodeLines = ({ lines, className = "" }: { lines: Tok[][]; className?: string }) => (
  <div className={`font-mono text-[13px] leading-6 ${className}`}>
    {lines.map((tokens, i) => (
      <div key={i} className="flex">
        <span className="w-7 shrink-0 select-none text-right pr-3 text-fg/30">{i + 1}</span>
        <span className="whitespace-pre">
          {tokens.length === 0
            ? " "
            : tokens.map(([cls, text], j) => (
                <span key={j} className={cls}>
                  {text}
                </span>
              ))}
        </span>
      </div>
    ))}
  </div>
);

const stats = [
  { end: 33, suffix: "+", label: "Problems" },
  { end: 5, suffix: "", label: "Learning Articles" },
  { end: 2, suffix: "", label: "Languages" },
  { end: 100, suffix: "%", label: "Free to Use" },
];

const features = [
  {
    icon: Code2,
    tone: "tone-blue",
    title: "Real Code Execution",
    description: "Write and run C++ or Python instantly with a full Monaco editor experience.",
  },
  {
    icon: ChartNoAxesCombined,
    tone: "tone-green",
    title: "Track Real Progress",
    description:
      "Difficulty breakdowns, topic mastery, and progress that reflect your actual coding journey.",
  },
  {
    icon: Sparkles,
    tone: "tone-purple",
    title: "AI Built Into the Workflow",
    description:
      "Contextual hints, explanations, debugging, and complexity analysis right where you're solving.",
  },
];

const topicBars = [
  { label: "Arrays", value: 80 },
  { label: "Strings", value: 65 },
  { label: "Binary Search", value: 55 },
  { label: "Dynamic Programming", value: 40 },
];

const sidebarMock = ["Dashboard", "Problems", "Learn", "Code Lab", "Leaderboard"];

const LandingPage = () => {
  return (
    <main className="overflow-x-clip">
      {/* HERO */}
      <section className="mx-auto max-w-6xl px-5 pb-10 pt-16 text-center md:pt-24">
        <ScrollReveal>
          <span className="inline-flex items-center rounded-full border border-fg/10 px-3 py-1 text-xs font-medium text-fg/60">
            Code · Learn · Grow
          </span>

          <h1 className="mx-auto mt-6 max-w-3xl font-serif text-[44px] font-bold leading-[1.05] tracking-tight md:text-[72px]">
            Turn Ideas Into Better Code.
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-fg/65 md:text-xl md:leading-9">
            Practice DSA, learn development, and build your coding skills with one focused developer
            platform.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link to="/register" className="btn btn-primary btn-lg">
              Get Started Free →
            </Link>
            <Link to="/problems" className="btn btn-secondary btn-lg">
              Explore Problems
            </Link>
          </div>
        </ScrollReveal>
      </section>

      {/* PRODUCT WINDOW */}
      <section className="mx-auto max-w-5xl px-5 pb-20">
        <ScrollReveal delay={100}>
          <div className="overflow-hidden rounded-xl border border-fg/10 bg-bg shadow-pop">
            <div className="flex items-center gap-1.5 border-b border-fg/10 bg-side px-4 py-2.5">
              <span className="h-2.5 w-2.5 rounded-full bg-fg/15" />
              <span className="h-2.5 w-2.5 rounded-full bg-fg/15" />
              <span className="h-2.5 w-2.5 rounded-full bg-fg/15" />
              <span className="ml-3 truncate text-xs text-fg/45">CompileX / Problems / Two Sum</span>
            </div>

            <div className="grid text-left md:grid-cols-[170px_1fr_1.15fr]">
              <div className="hidden border-r border-fg/[0.08] bg-side p-3 md:block">
                <div className="mb-3 flex items-center gap-2 px-1.5 text-sm font-semibold">
                  <Logo size={20} />
                  CompileX
                </div>
                {sidebarMock.map((item) => (
                  <div
                    key={item}
                    className={`rounded-md px-2 py-1.5 text-[13px] ${
                      item === "Problems" ? "bg-fg/[0.08] font-medium" : "text-fg/60"
                    }`}
                  >
                    {item}
                  </div>
                ))}
              </div>

              <div className="border-fg/[0.08] p-5 md:border-r">
                <p className="text-xl font-bold tracking-tight">Two Sum</p>
                <div className="mt-2 flex flex-wrap gap-1">
                  <Tag tone="green">Easy</Tag>
                  <Tag tone="blue">Arrays</Tag>
                  <Tag tone="purple">Hashing</Tag>
                </div>
                <p className="mt-4 text-[13px] leading-6 text-fg/70">
                  Given an array of integers and a target, return the indices of the two numbers
                  that add up to the target.
                </p>
                <div className="callout tone-blue mt-4 !p-3 text-[13px]">
                  <span>📖</span>
                  <span>Related learning: Two Pointers Technique</span>
                </div>
              </div>

              <div className="bg-code p-4">
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex gap-1">
                    <span className="rounded-md bg-fg/[0.08] px-2 py-0.5 text-xs font-medium">C++</span>
                    <span className="rounded-md px-2 py-0.5 text-xs text-fg/50">Python</span>
                  </div>
                  <span className="rounded-md bg-accent px-2.5 py-1 text-xs font-medium text-accent-fg">
                    Submit
                  </span>
                </div>
                <CodeLines lines={heroCode} />
                <div className="mt-4 flex items-center gap-2 border-t border-fg/10 pt-3">
                  <Tag tone="green">✓ Accepted</Tag>
                  <span className="text-xs text-fg/50">3/3 passed</span>
                </div>
              </div>
            </div>
          </div>
          <p className="mt-3 text-center text-xs text-fg/40">Preview of the CompileX interface</p>
        </ScrollReveal>
      </section>

      {/* STATS */}
      <ScrollReveal>
        <section className="mx-auto grid max-w-4xl grid-cols-2 gap-8 border-y border-fg/10 px-5 py-12 text-center md:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label}>
              <p className="text-4xl font-semibold tracking-tight">
                <CountUp end={stat.end} suffix={stat.suffix} />
              </p>
              <p className="mt-1 text-sm text-fg/55">{stat.label}</p>
            </div>
          ))}
        </section>
      </ScrollReveal>

      {/* WHY COMPILEX */}
      <ScrollReveal>
        <section className="mx-auto max-w-5xl px-5 py-24">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-medium text-fg/50">Built for developers</p>
            <h2 className="mt-2 font-serif text-4xl font-bold tracking-tight md:text-5xl">
              Why CompileX?
            </h2>
            <p className="mt-4 text-lg leading-8 text-fg/65">
              Everything you need to practice, learn, and improve — without jumping between
              different platforms.
            </p>
          </div>

          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {features.map(({ icon: Icon, tone, title, description }) => (
              <div key={title} className="card p-6">
                <span
                  className={`${tone} inline-flex h-10 w-10 items-center justify-center rounded-lg bg-[rgb(var(--tone-bg))] text-[rgb(var(--tone-fg))]`}
                >
                  <Icon size={20} />
                </span>
                <h3 className="mt-4 text-base font-semibold">{title}</h3>
                <p className="mt-1.5 text-sm leading-6 text-fg/60">{description}</p>
              </div>
            ))}
          </div>
        </section>
      </ScrollReveal>

      {/* FEATURE: CODE LAB */}
      <ScrollReveal>
        <section className="mx-auto grid max-w-5xl items-center gap-12 px-5 py-16 md:grid-cols-2">
          <div>
            <p className="text-sm font-medium text-fg/50">Code without limits</p>
            <h3 className="mt-2 font-serif text-3xl font-bold leading-tight tracking-tight md:text-4xl">
              A Real Code Lab, Not a Toy Editor.
            </h3>
            <p className="mt-4 leading-7 text-fg/65">
              Write, run, and experiment with real code in a full Monaco editor. Switch between
              languages, provide input, and see your output instantly.
            </p>
            <div className="mt-5 flex flex-wrap gap-1.5">
              <Tag tone="blue">Monaco Editor</Tag>
              <Tag tone="orange">C++</Tag>
              <Tag tone="green">Python</Tag>
            </div>
          </div>

          <div className="overflow-hidden rounded-xl border border-fg/10 shadow-card">
            <div className="flex items-center justify-between border-b border-fg/10 bg-fg/[0.03] px-3 py-2">
              <span className="text-xs text-fg/55">playground.cpp</span>
              <span className="rounded-md bg-accent px-2.5 py-1 text-xs font-medium text-accent-fg">
                ▶ Run Code
              </span>
            </div>
            <div className="bg-code p-4">
              <CodeLines lines={labCode} />
            </div>
            <div className="border-t border-fg/10 px-4 py-3 font-mono text-[13px]">
              <span className="text-fg/45">Output: </span>30
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* FEATURE: PROGRESS */}
      <ScrollReveal>
        <section className="mx-auto grid max-w-5xl items-center gap-12 px-5 py-16 md:grid-cols-2">
          <div className="order-2 rounded-xl border border-fg/10 p-5 shadow-card md:order-1">
            <div className="mb-4 flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold">Topic Proficiency</p>
                <p className="text-xs text-fg/50">Your current progress</p>
              </div>
              <Tag tone="blue">68% overall</Tag>
            </div>

            <div className="space-y-3">
              {topicBars.map((t) => (
                <div key={t.label}>
                  <div className="mb-1 flex justify-between text-xs">
                    <span>{t.label}</span>
                    <span className="text-fg/50">{t.value}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-fg/10">
                    <div className="h-full rounded-full bg-accent" style={{ width: `${t.value}%` }} />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 flex gap-2 border-t border-fg/10 pt-4">
              <Tag tone="green">18 Easy</Tag>
              <Tag tone="orange">11 Medium</Tag>
              <Tag tone="red">4 Hard</Tag>
            </div>
          </div>

          <div className="order-1 md:order-2">
            <p className="text-sm font-medium text-fg/50">Know what to practice next</p>
            <h3 className="mt-2 font-serif text-3xl font-bold leading-tight tracking-tight md:text-4xl">
              See Exactly Where You Stand.
            </h3>
            <p className="mt-4 leading-7 text-fg/65">
              Topic-by-topic progress, difficulty breakdowns, and proficiency insights help you
              understand your strengths and identify the concepts that need more practice.
            </p>
            <div className="mt-5 flex flex-wrap gap-1.5">
              <Tag tone="blue">Topic Proficiency</Tag>
              <Tag tone="purple">Difficulty Breakdown</Tag>
              <Tag tone="green">Progress Tracking</Tag>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* FINAL CTA */}
      <ScrollReveal>
        <section className="mx-auto max-w-5xl px-5 py-16">
          <div className="rounded-2xl bg-code px-6 py-16 text-center">
            <p className="text-sm font-medium text-fg/50">Start building better habits</p>
            <h2 className="mx-auto mt-2 max-w-xl font-serif text-4xl font-bold tracking-tight md:text-5xl">
              Ready to build better code?
            </h2>
            <p className="mx-auto mt-4 max-w-md text-lg text-fg/65">
              Practice, learn, and improve with CompileX — completely free.
            </p>
            <Link to="/register" className="btn btn-primary btn-lg mt-8">
              Get Started Free →
            </Link>
          </div>
        </section>
      </ScrollReveal>

      {/* FOOTER */}
      <footer className="border-t border-fg/10">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 px-5 py-8 text-sm md:flex-row">
          <div className="flex items-center gap-2 font-semibold">
            <Logo size={20} />
            CompileX
          </div>
          <nav className="flex items-center gap-5 text-fg/60">
            <Link to="/problems" className="transition-colors hover:text-fg">
              Problems
            </Link>
            <Link to="/learn" className="transition-colors hover:text-fg">
              Learn
            </Link>
            <Link to="/code-lab" className="transition-colors hover:text-fg">
              Code Lab
            </Link>
          </nav>
          <p className="text-xs text-fg/40">© {new Date().getFullYear()} CompileX</p>
        </div>
      </footer>
    </main>
  );
};

export default LandingPage;
