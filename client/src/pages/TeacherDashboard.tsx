
import { useCallback, useEffect, useMemo, useState } from "react";
import api from "../api/axios";
import { ThemeToggle } from "../components/ThemeToggle";

interface Student {
  _id: string;
  name: string;
  email: string;
  isActive: boolean;
  totalSolved: number;
  totalPoints: number;
  createdAt: string;
}

interface DifficultyBreakdown {
  Easy: number;
  Medium: number;
  Hard: number;
}

interface StudentProgress {
  totalSubmissions: number;
  acceptedSubmissions: number;
  problemsSolved: number;
  acceptanceRate: number;
  difficultyBreakdown: DifficultyBreakdown;
  totalPoints: number;
}

interface RecentSubmission {
  _id: string;
  status: string;
  language: string;
  createdAt: string;
  problem?: {
    title: string;
    slug: string;
    difficulty: "Easy" | "Medium" | "Hard";
  } | null;
}

interface StudentReport {
  student: Student;
  progress: StudentProgress;
  recentSubmissions: RecentSubmission[];
}

const getInitials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

export const TeacherDashboard = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [totalStudents, setTotalStudents] = useState(0);
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [report, setReport] = useState<StudentReport | null>(null);

  const [loading, setLoading] = useState(true);
  const [reportLoading, setReportLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const loadStudents = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/teacher/students");
      const studentList: Student[] = response.data.students || [];

      setStudents(studentList);
      setTotalStudents(response.data.totalStudents || 0);

      if (
        selectedStudentId &&
        !studentList.some((student) => student._id === selectedStudentId)
      ) {
        setSelectedStudentId("");
        setReport(null);
      }
    } catch (err: unknown) {
      const message = (
        err as { response?: { data?: { message?: string } } }
      ).response?.data?.message;

      setError(message || "Failed to load assigned students.");
    } finally {
      setLoading(false);
    }
  }, [selectedStudentId]);

  const loadStudentReport = useCallback(async (studentId: string) => {
    try {
      setReportLoading(true);
      setError("");

      const response = await api.get(
        `/teacher/students/${studentId}/progress`
      );

      setReport(response.data);
    } catch (err: unknown) {
      const message = (
        err as { response?: { data?: { message?: string } } }
      ).response?.data?.message;

      setReport(null);
      setError(message || "Failed to load student progress.");
    } finally {
      setReportLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadStudents();
  }, [loadStudents]);

  useEffect(() => {
    if (selectedStudentId) {
      void loadStudentReport(selectedStudentId);
    } else {
      setReport(null);
    }
  }, [selectedStudentId, loadStudentReport]);

  const handleRefresh = async () => {
    await loadStudents();

    if (selectedStudentId) {
      await loadStudentReport(selectedStudentId);
    }
  };

  const filteredStudents = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return students;

    return students.filter(
      (student) =>
        student.name.toLowerCase().includes(query) ||
        student.email.toLowerCase().includes(query)
    );
  }, [students, search]);

  const activeStudents = students.filter(
    (student) => student.isActive
  ).length;

  const inactiveStudents = students.length - activeStudents;

  if (loading) {
    return (
      <main className="min-h-screen bg-bg p-5 md:p-8">
        <div className="mx-auto max-w-7xl animate-pulse space-y-6">
          <div className="h-9 w-64 rounded-lg bg-fg/10" />
          <div className="h-4 w-80 rounded bg-fg/10" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="h-32 rounded-2xl border border-border bg-card"
              />
            ))}
          </div>
          <div className="h-64 rounded-2xl border border-border bg-card" />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-bg px-4 py-6 text-fg sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">

        {/* Header */}
        <header className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm font-medium text-accent">
              <span className="h-2 w-2 rounded-full bg-accent" />
              COMPILEX / TEACHER
            </div>

            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Teacher Dashboard
            </h1>

            <p className="mt-2 text-sm text-fg/55 sm:text-base">
              Monitor your students and track their learning progress.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle className="h-11 w-11 rounded-xl border border-border bg-card text-fg shadow-sm hover:bg-fg/5" />

            <button
              type="button"
              onClick={() => void handleRefresh()}
              disabled={loading || reportLoading}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 text-sm font-semibold shadow-sm transition hover:bg-fg/5 disabled:opacity-50"
            >
              <span>↻</span>
              Refresh data
            </button>
          </div>
        </header>

        {/* Error */}
        {error && (
          <div
            role="alert"
            className="flex items-start gap-3 rounded-xl border border-red-500/25 bg-red-500/10 p-4 text-sm text-red-600"
          >
            <span className="font-bold">!</span>
            <span>{error}</span>
            <button
              type="button"
              onClick={() => setError("")}
              className="ml-auto font-semibold"
              aria-label="Dismiss error"
            >
              ×
            </button>
          </div>
        )}

        {/* Overview */}
        <section>
          <div className="mb-4">
            <h2 className="text-lg font-bold">Overview</h2>
            <p className="mt-1 text-sm text-fg/50">
              Your assigned student statistics.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <article className="rounded-2xl border border-border bg-card p-5 shadow-sm transition hover:-translate-y-1">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-fg/55">
                  Assigned Students
                </p>
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 font-bold text-blue-600">
                  S
                </span>
              </div>
              <p className="mt-4 text-3xl font-bold">
                {totalStudents}
              </p>
              <p className="mt-1 text-xs text-fg/45">
                Total students assigned to you
              </p>
            </article>

            <article className="rounded-2xl border border-border bg-card p-5 shadow-sm transition hover:-translate-y-1">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-fg/55">
                  Active Students
                </p>
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-500/10 font-bold text-green-600">
                  ✓
                </span>
              </div>
              <p className="mt-4 text-3xl font-bold">
                {activeStudents}
              </p>
              <p className="mt-1 text-xs text-fg/45">
                Currently active accounts
              </p>
            </article>

            <article className="rounded-2xl border border-border bg-card p-5 shadow-sm transition hover:-translate-y-1">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-fg/55">
                  Inactive Students
                </p>
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10 font-bold text-red-600">
                  !
                </span>
              </div>
              <p className="mt-4 text-3xl font-bold">
                {inactiveStudents}
              </p>
              <p className="mt-1 text-xs text-fg/45">
                Currently inactive accounts
              </p>
            </article>
          </div>
        </section>

        {/* Students */}
        <section className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          <div className="space-y-4 border-b border-border p-5 sm:p-6">
            <div>
              <h2 className="text-lg font-bold">My Students</h2>
              <p className="mt-1 text-sm text-fg/50">
                Select a student to view their detailed performance.
              </p>
            </div>

            {students.length > 0 && (
              <div className="relative max-w-md">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-fg/40">
                  ⌕
                </span>
                <input
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search students by name or email..."
                  className="input h-11 rounded-xl pl-9"
                />
              </div>
            )}
          </div>

          {students.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-fg/[0.05] text-2xl text-fg/40">
                ♙
              </div>
              <h3 className="mt-4 font-semibold">
                No students assigned yet
              </h3>
              <p className="mt-2 text-sm text-fg/50">
                Students assigned to you by an admin will appear here.
              </p>
            </div>
          ) : filteredStudents.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <h3 className="font-semibold">No matching students</h3>
              <p className="mt-1 text-sm text-fg/50">
                Try another name or email address.
              </p>
              <button
                type="button"
                onClick={() => setSearch("")}
                className="mt-3 text-sm font-semibold text-accent hover:underline"
              >
                Clear search
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2 sm:p-6 xl:grid-cols-3">
              {filteredStudents.map((student) => {
                const selected = selectedStudentId === student._id;

                return (
                  <button
                    key={student._id}
                    type="button"
                    onClick={() => setSelectedStudentId(student._id)}
                    aria-pressed={selected}
                    className={`rounded-2xl border p-5 text-left transition duration-200 hover:-translate-y-1 hover:shadow-md ${
                      selected
                        ? "border-accent bg-accent/[0.05] shadow-sm"
                        : "border-border bg-bg hover:border-accent/50"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-sm font-bold text-accent">
                          {getInitials(student.name)}
                        </div>

                        <div className="min-w-0">
                          <h3 className="truncate font-semibold">
                            {student.name}
                          </h3>
                          <p className="mt-1 break-all text-xs text-fg/50">
                            {student.email}
                          </p>
                        </div>
                      </div>

                      <span
                        className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${
                          student.isActive
                            ? "bg-green-500/10 text-green-600"
                            : "bg-red-500/10 text-red-500"
                        }`}
                      >
                        {student.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>

                    <div className="mt-6 grid grid-cols-2 gap-3">
                      <div className="rounded-xl bg-fg/[0.035] p-3">
                        <p className="text-xs text-fg/50">
                          Problems solved
                        </p>
                        <p className="mt-1 text-2xl font-bold">
                          {student.totalSolved}
                        </p>
                      </div>

                      <div className="rounded-xl bg-fg/[0.035] p-3">
                        <p className="text-xs text-fg/50">
                          Total points
                        </p>
                        <p className="mt-1 text-2xl font-bold">
                          {student.totalPoints}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-xs font-semibold text-accent">
                        {selected ? "Currently selected" : "View progress"}
                      </span>
                      <span className="text-accent">
                        {selected ? "✓" : "→"}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </section>

        {/* Student report */}
        {selectedStudentId && (
          <section className="space-y-5">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-accent">
                Student analytics
              </div>
              <h2 className="mt-1 text-xl font-bold">
                Progress Report
              </h2>
              <p className="mt-1 text-sm text-fg/50">
                Detailed learning activity and coding performance.
              </p>
            </div>

            {reportLoading ? (
              <div className="animate-pulse rounded-2xl border border-border bg-card p-8">
                <div className="h-5 w-48 rounded bg-fg/10" />
                <div className="mt-5 grid grid-cols-2 gap-4 md:grid-cols-4">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <div
                      key={index}
                      className="h-24 rounded-xl bg-fg/10"
                    />
                  ))}
                </div>
              </div>
            ) : report ? (
              <>
                {/* Student identity and metrics */}
                <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
                  <div className="flex flex-col gap-4 border-b border-border p-5 sm:flex-row sm:items-center sm:p-6">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10 text-lg font-bold text-accent">
                      {getInitials(report.student.name)}
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="text-lg font-bold">
                        {report.student.name}
                      </h3>
                      <p className="mt-1 break-all text-sm text-fg/50">
                        {report.student.email}
                      </p>
                    </div>

                    <span
                      className={`w-fit rounded-full px-3 py-1.5 text-xs font-semibold ${
                        report.student.isActive
                          ? "bg-green-500/10 text-green-600"
                          : "bg-red-500/10 text-red-500"
                      }`}
                    >
                      {report.student.isActive ? "Active account" : "Inactive account"}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-px bg-border md:grid-cols-4">
                    {[
                      {
                        label: "Problems solved",
                        value: report.progress.problemsSolved,
                        color: "text-fg",
                      },
                      {
                        label: "Submissions",
                        value: report.progress.totalSubmissions,
                        color: "text-fg",
                      },
                      {
                        label: "Accepted",
                        value: report.progress.acceptedSubmissions,
                        color: "text-green-600",
                      },
                      {
                        label: "Acceptance rate",
                        value: `${report.progress.acceptanceRate}%`,
                        color: "text-accent",
                      },
                    ].map((metric) => (
                      <div
                        key={metric.label}
                        className="bg-card p-4 sm:p-5"
                      >
                        <p className="text-xs font-medium text-fg/50">
                          {metric.label}
                        </p>
                        <p
                          className={`mt-2 text-2xl font-bold ${metric.color}`}
                        >
                          {metric.value}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Difficulty breakdown */}
                <div className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
                  <div>
                    <h3 className="text-lg font-bold">
                      Solved Problems by Difficulty
                    </h3>
                    <p className="mt-1 text-sm text-fg/50">
                      Distribution of successfully solved problems.
                    </p>
                  </div>

                  <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
                    {(
                      ["Easy", "Medium", "Hard"] as const
                    ).map((difficulty) => {
                      const value =
                        report.progress.difficultyBreakdown[difficulty];

                      const percentage =
                        report.progress.problemsSolved > 0
                          ? (value / report.progress.problemsSolved) * 100
                          : 0;

                      const color =
                        difficulty === "Easy"
                          ? "bg-green-500"
                          : difficulty === "Medium"
                            ? "bg-yellow-500"
                            : "bg-red-500";

                      const textColor =
                        difficulty === "Easy"
                          ? "text-green-600"
                          : difficulty === "Medium"
                            ? "text-yellow-600"
                            : "text-red-500";

                      return (
                        <div
                          key={difficulty}
                          className="rounded-xl border border-border bg-bg p-5"
                        >
                          <div className="flex items-center justify-between">
                            <span className={`text-sm font-semibold ${textColor}`}>
                              {difficulty}
                            </span>
                            <span className="text-xs text-fg/45">
                              {Math.round(percentage)}%
                            </span>
                          </div>

                          <p className="mt-3 text-3xl font-bold">
                            {value}
                          </p>

                          <div className="mt-4 h-2 overflow-hidden rounded-full bg-fg/10">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${color}`}
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Recent submissions */}
                <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
                  <div className="border-b border-border p-5 sm:p-6">
                    <h3 className="text-lg font-bold">
                      Recent Submissions
                    </h3>
                    <p className="mt-1 text-sm text-fg/50">
                      Latest coding activity from this student.
                    </p>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[650px] text-left text-sm">
                      <thead className="bg-fg/[0.025] text-xs uppercase tracking-wider text-fg/45">
                        <tr>
                          <th className="px-5 py-4 font-semibold">Problem</th>
                          <th className="px-4 py-4 font-semibold">Difficulty</th>
                          <th className="px-4 py-4 font-semibold">Language</th>
                          <th className="px-4 py-4 font-semibold">Status</th>
                          <th className="px-5 py-4 font-semibold">Date</th>
                        </tr>
                      </thead>

                      <tbody className="divide-y divide-border">
                        {report.recentSubmissions.map((submission) => (
                          <tr
                            key={submission._id}
                            className="transition-colors hover:bg-fg/[0.025]"
                          >
                            <td className="px-5 py-4 font-medium">
                              {submission.problem?.title || "Problem unavailable"}
                            </td>

                            <td className="px-4 py-4 text-fg/65">
                              {submission.problem?.difficulty || "—"}
                            </td>

                            <td className="px-4 py-4 capitalize text-fg/65">
                              {submission.language}
                            </td>

                            <td className="px-4 py-4">
                              <span
                                className={`rounded-lg px-2.5 py-1.5 text-xs font-semibold ${
                                  submission.status === "Accepted"
                                    ? "bg-green-500/10 text-green-600"
                                    : "bg-red-500/10 text-red-500"
                                }`}
                              >
                                {submission.status}
                              </span>
                            </td>

                            <td className="whitespace-nowrap px-5 py-4 text-fg/55">
                              {formatDate(submission.createdAt)}
                            </td>
                          </tr>
                        ))}

                        {report.recentSubmissions.length === 0 && (
                          <tr>
                            <td
                              colSpan={5}
                              className="px-5 py-12 text-center text-fg/50"
                            >
                              No submissions yet.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            ) : (
              <div className="rounded-2xl border border-border bg-card p-8 text-center">
                <p className="font-semibold">Unable to display report</p>
                <p className="mt-1 text-sm text-fg/50">
                  Try selecting the student again or refreshing the dashboard.
                </p>
                <button
                  type="button"
                  onClick={() => void loadStudentReport(selectedStudentId)}
                  className="mt-4 rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-accent-fg"
                >
                  Retry
                </button>
              </div>
            )}
          </section>
        )}

        <footer className="flex flex-col justify-between gap-2 border-t border-border pt-5 text-xs text-fg/40 sm:flex-row">
          <p>CompileX Teacher Portal</p>
          <p>Track progress. Support learning. Build better developers.</p>
        </footer>
      </div>
    </main>
  );
};
