
import { useCallback, useEffect, useMemo, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { ThemeToggle } from "../components/ThemeToggle";

interface AdminStats {
  totalUsers: number;
  totalStudents: number;
  totalTeachers: number;
  totalAdmins: number;
  activeUsers: number;
  totalSubmissions: number;
  acceptedSubmissions: number;
}

interface AdminUser {
  _id: string;
  name: string;
  email: string;
  role: "user" | "admin" | "teacher";
  isActive: boolean;
  teacherId?: string | null;
  totalSolved: number;
  totalPoints: number;
  createdAt: string;
}

interface TeacherForm {
  name: string;
  email: string;
  password: string;
}

type RoleFilter = "all" | "user" | "teacher" | "admin";
type StatusFilter = "all" | "active" | "inactive";

const roleLabels: Record<string, string> = {
  user: "Student",
  teacher: "Teacher",
  admin: "Admin",
};

const getInitials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");

export const AdminDashboard = () => {
  const { user: currentUser } = useAuth();

  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [creatingTeacher, setCreatingTeacher] = useState(false);
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);
  const [showTeacherForm, setShowTeacherForm] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const [teacherForm, setTeacherForm] = useState<TeacherForm>({
    name: "",
    email: "",
    password: "",
  });

  const loadData = useCallback(async (showLoader = false) => {
    try {
      if (showLoader) setLoading(true);
      setError("");

      const [statsResponse, usersResponse] = await Promise.all([
        api.get("/admin/stats"),
        api.get("/admin/users"),
      ]);

      setStats(statsResponse.data.stats);
      setUsers(usersResponse.data.users);
    } catch (err: unknown) {
      const message = (
        err as { response?: { data?: { message?: string } } }
      ).response?.data?.message;

      setError(message || "Failed to load admin dashboard.");
    } finally {
      if (showLoader) setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadData(true);
  }, [loadData]);

  const teachers = users.filter(
    (user) => user.role === "teacher" && user.isActive
  );

  const filteredUsers = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return users.filter((user) => {
      const matchesSearch =
        !normalizedSearch ||
        user.name.toLowerCase().includes(normalizedSearch) ||
        user.email.toLowerCase().includes(normalizedSearch);

      const matchesRole =
        roleFilter === "all" || user.role === roleFilter;

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && user.isActive) ||
        (statusFilter === "inactive" && !user.isActive);

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, search, roleFilter, statusFilter]);

  const statCards = [
    {
      label: "Total Accounts",
      value: stats?.totalUsers,
      detail: "All registered accounts",
      symbol: "U",
      color: "text-blue-600",
      bg: "bg-blue-500/10",
    },
    {
      label: "Students",
      value: stats?.totalStudents,
      detail: "Registered learners",
      symbol: "S",
      color: "text-violet-600",
      bg: "bg-violet-500/10",
    },
    {
      label: "Teachers",
      value: stats?.totalTeachers,
      detail: "Teaching accounts",
      symbol: "T",
      color: "text-emerald-600",
      bg: "bg-emerald-500/10",
    },
    {
      label: "Active Accounts",
      value: stats?.activeUsers,
      detail: "Currently enabled",
      symbol: "A",
      color: "text-amber-600",
      bg: "bg-amber-500/10",
    },
    {
      label: "Administrators",
      value: stats?.totalAdmins,
      detail: "Platform administrators",
      symbol: "AD",
      color: "text-pink-600",
      bg: "bg-pink-500/10",
    },
    {
      label: "Submissions",
      value: stats?.totalSubmissions,
      detail: "Total code submissions",
      symbol: "C",
      color: "text-cyan-600",
      bg: "bg-cyan-500/10",
    },
    {
      label: "Accepted",
      value: stats?.acceptedSubmissions,
      detail: "Successfully accepted",
      symbol: "✓",
      color: "text-green-600",
      bg: "bg-green-500/10",
    },
  ];

  const handleCreateTeacher = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    try {
      setCreatingTeacher(true);
      setError("");
      setSuccess("");

      await api.post("/admin/teachers", teacherForm);

      setSuccess("Teacher account created successfully.");
      setTeacherForm({ name: "", email: "", password: "" });
      setShowTeacherForm(false);

      await loadData();
    } catch (err: unknown) {
      const message = (
        err as { response?: { data?: { message?: string } } }
      ).response?.data?.message;

      setError(message || "Failed to create teacher account.");
    } finally {
      setCreatingTeacher(false);
    }
  };

  const handleAssignTeacher = async (
    studentId: string,
    teacherId: string
  ) => {
    try {
      setUpdatingUserId(studentId);
      setError("");
      setSuccess("");

      await api.patch(`/admin/users/${studentId}/teacher`, {
        teacherId: teacherId || null,
      });

      setSuccess(
        teacherId
          ? "Student assigned successfully."
          : "Student unassigned successfully."
      );

      await loadData();
    } catch (err: unknown) {
      const message = (
        err as { response?: { data?: { message?: string } } }
      ).response?.data?.message;

      setError(message || "Failed to update student assignment.");
      await loadData();
    } finally {
      setUpdatingUserId(null);
    }
  };

  const handleToggleStatus = async (account: AdminUser) => {
    const action = account.isActive ? "deactivate" : "activate";

    const confirmed = window.confirm(
      `Are you sure you want to ${action} ${account.name}'s account?`
    );

    if (!confirmed) return;

    try {
      setUpdatingUserId(account._id);
      setError("");
      setSuccess("");

      await api.patch(`/admin/users/${account._id}/status`, {
        isActive: !account.isActive,
      });

      setSuccess(
        `${account.name}'s account has been ${action}d successfully.`
      );

      await loadData();
    } catch (err: unknown) {
      const message = (
        err as { response?: { data?: { message?: string } } }
      ).response?.data?.message;

      setError(message || "Failed to update account status.");
      await loadData();
    } finally {
      setUpdatingUserId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-bg p-5 md:p-8">
        <div className="mx-auto max-w-7xl animate-pulse space-y-6">
          <div className="h-9 w-64 rounded-lg bg-fg/10" />
          <div className="h-4 w-80 max-w-full rounded bg-fg/10" />
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="h-32 rounded-2xl border border-border bg-card"
              />
            ))}
          </div>
          <div className="h-72 rounded-2xl border border-border bg-card" />
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-bg px-4 py-6 text-fg sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">

        {/* Page heading */}
        <header className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm font-medium text-accent">
              <span className="h-2 w-2 rounded-full bg-accent" />
              COMPILEX / ADMINISTRATION
            </div>

            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Dashboard Overview
            </h1>

            <p className="mt-2 text-sm text-fg/55 sm:text-base">
              Manage your platform, users and learning activity.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle className="h-11 w-11 rounded-xl border border-border bg-card text-fg shadow-sm hover:bg-fg/5" />

            <button
                type="button"
                onClick={() => void loadData(true)}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 text-sm font-semibold shadow-sm transition hover:bg-fg/5"
            >
                <span>↻</span>
                Refresh data
            </button>
            </div>
        </header>

        {/* Notifications */}
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
            >
              ×
            </button>
          </div>
        )}

        {success && (
          <div
            role="status"
            className="flex items-start gap-3 rounded-xl border border-green-500/25 bg-green-500/10 p-4 text-sm text-green-600"
          >
            <span className="font-bold">✓</span>
            <span>{success}</span>
            <button
              type="button"
              onClick={() => setSuccess("")}
              className="ml-auto font-semibold"
            >
              ×
            </button>
          </div>
        )}

        {/* Statistics */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold">Platform statistics</h2>
              <p className="mt-1 text-sm text-fg/50">
                A snapshot of your platform activity.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {statCards.map((card) => (
              <article
                key={card.label}
                className="group rounded-2xl border border-border bg-card p-4 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-card sm:p-5"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="text-xs font-medium text-fg/55 sm:text-sm">
                    {card.label}
                  </span>

                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-xs font-bold ${card.bg} ${card.color}`}
                  >
                    {card.symbol}
                  </span>
                </div>

                <p className="mt-4 text-2xl font-bold tracking-tight sm:text-3xl">
                  {card.value?.toLocaleString() ?? "—"}
                </p>

                <p className="mt-1 text-xs text-fg/45">
                  {card.detail}
                </p>
              </article>
            ))}
          </div>
        </section>

        {/* Teacher management */}
        <section className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          <div className="flex flex-col justify-between gap-4 border-b border-border p-5 sm:flex-row sm:items-center sm:p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10 text-lg font-bold text-emerald-600">
                T
              </div>

              <div>
                <h2 className="text-lg font-bold">Teacher management</h2>
                <p className="mt-1 text-sm text-fg/50">
                  {teachers.length} active teachers available for assignment
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowTeacherForm((value) => !value)}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-accent px-5 text-sm font-semibold text-accent-fg shadow-sm transition hover:bg-accent-hover"
            >
              <span className="text-lg">
                {showTeacherForm ? "−" : "+"}
              </span>
              {showTeacherForm ? "Close form" : "Create teacher"}
            </button>
          </div>

          {showTeacherForm && (
            <form
              onSubmit={handleCreateTeacher}
              className="space-y-4 border-b border-border bg-fg/[0.02] p-5 sm:p-6"
            >
              <div>
                <h3 className="font-semibold">New teacher account</h3>
                <p className="mt-1 text-sm text-fg/50">
                  Create a teacher account with temporary login credentials.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <label className="space-y-2">
                  <span className="text-xs font-semibold text-fg/65">
                    Full name
                  </span>
                  <input
                    type="text"
                    placeholder="Enter teacher name"
                    required
                    minLength={2}
                    value={teacherForm.name}
                    onChange={(e) =>
                      setTeacherForm({
                        ...teacherForm,
                        name: e.target.value,
                      })
                    }
                    className="input h-11 rounded-xl"
                  />
                </label>

                <label className="space-y-2">
                  <span className="text-xs font-semibold text-fg/65">
                    Email address
                  </span>
                  <input
                    type="email"
                    placeholder="teacher@example.com"
                    required
                    value={teacherForm.email}
                    onChange={(e) =>
                      setTeacherForm({
                        ...teacherForm,
                        email: e.target.value,
                      })
                    }
                    className="input h-11 rounded-xl"
                  />
                </label>

                <label className="space-y-2">
                  <span className="text-xs font-semibold text-fg/65">
                    Temporary password
                  </span>
                  <input
                    type="password"
                    placeholder="Minimum 8 characters"
                    minLength={8}
                    required
                    value={teacherForm.password}
                    onChange={(e) =>
                      setTeacherForm({
                        ...teacherForm,
                        password: e.target.value,
                      })
                    }
                    className="input h-11 rounded-xl"
                  />
                </label>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs text-fg/50">
                  The teacher must change this password after their first login.
                </p>

                <button
                  type="submit"
                  disabled={creatingTeacher}
                  className="h-11 rounded-xl bg-accent px-6 text-sm font-semibold text-accent-fg transition hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {creatingTeacher ? "Creating account..." : "Create account"}
                </button>
              </div>
            </form>
          )}

          {!showTeacherForm && (
            <div className="flex flex-wrap items-center gap-3 bg-emerald-500/[0.04] px-5 py-4 text-sm">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 font-bold text-emerald-600">
                ✓
              </span>
              <span className="text-fg/65">
                Only active teachers appear in student assignment options.
              </span>
            </div>
          )}
        </section>

        {/* User management */}
        <section className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          <div className="space-y-5 border-b border-border p-5 sm:p-6">
            <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
              <div>
                <h2 className="text-lg font-bold">User management</h2>
                <p className="mt-1 text-sm text-fg/50">
                  Manage accounts, permissions and teacher assignments.
                </p>
              </div>

              <span className="w-fit rounded-lg bg-fg/[0.05] px-3 py-1.5 text-xs font-semibold text-fg/65">
                {filteredUsers.length} of {users.length} accounts
              </span>
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              {/* Search */}
              <div className="relative md:col-span-1">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-fg/40">
                  ⌕
                </span>

                <input
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search name or email..."
                  className="input h-11 rounded-xl pl-9"
                />
              </div>

              {/* Role filter */}
              <select
                value={roleFilter}
                onChange={(e) =>
                  setRoleFilter(e.target.value as RoleFilter)
                }
                className="select h-11 rounded-xl"
                aria-label="Filter by role"
              >
                <option value="all">All roles</option>
                <option value="user">Students</option>
                <option value="teacher">Teachers</option>
                <option value="admin">Admins</option>
              </select>

              {/* Status filter */}
              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value as StatusFilter)
                }
                className="select h-11 rounded-xl"
                aria-label="Filter by account status"
              >
                <option value="all">All statuses</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          {/* Desktop table */}
          <div className="hidden overflow-x-auto lg:block">
            <table className="w-full min-w-[1050px] text-left text-sm">
              <thead className="bg-fg/[0.025] text-xs uppercase tracking-wider text-fg/45">
                <tr>
                  <th className="px-6 py-4 font-semibold">Account</th>
                  <th className="px-4 py-4 font-semibold">Role</th>
                  <th className="px-4 py-4 font-semibold">Status</th>
                  <th className="px-4 py-4 font-semibold">Solved</th>
                  <th className="px-4 py-4 font-semibold">Teacher assignment</th>
                  <th className="px-6 py-4 text-right font-semibold">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-border">
                {filteredUsers.map((account) => {
                  const isCurrentAdmin = account._id === currentUser?.id;

                  const assignedTeacher = teachers.find(
                    (teacher) => teacher._id === account.teacherId
                  );

                  return (
                    <tr
                      key={account._id}
                      className="transition-colors hover:bg-fg/[0.025]"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-xs font-bold text-accent">
                            {getInitials(account.name)}
                          </div>

                          <div className="min-w-0">
                            <p className="font-semibold text-fg">
                              {account.name}
                              {isCurrentAdmin && (
                                <span className="ml-2 text-xs font-normal text-fg/40">
                                  You
                                </span>
                              )}
                            </p>
                            <p className="mt-0.5 truncate text-xs text-fg/50">
                              {account.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-4">
                        <span className="rounded-lg bg-fg/[0.06] px-2.5 py-1.5 text-xs font-semibold">
                          {roleLabels[account.role]}
                        </span>
                      </td>

                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex items-center gap-2 text-xs font-semibold ${
                            account.isActive
                              ? "text-green-600"
                              : "text-red-500"
                          }`}
                        >
                          <span
                            className={`h-2 w-2 rounded-full ${
                              account.isActive
                                ? "bg-green-500"
                                : "bg-red-500"
                            }`}
                          />
                          {account.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>

                      <td className="px-4 py-4 font-semibold tabular-nums">
                        {account.totalSolved.toLocaleString()}
                      </td>

                      <td className="px-4 py-4">
                        {account.role === "user" ? (
                          <div className="space-y-1">
                            <select
                              value={account.teacherId || ""}
                              disabled={
                                updatingUserId === account._id ||
                                (!account.teacherId && teachers.length === 0)
                              }
                              onChange={(e) =>
                                void handleAssignTeacher(
                                  account._id,
                                  e.target.value
                                )
                              }
                              className="select max-w-[200px] disabled:opacity-50"
                              aria-label={`Assign teacher to ${account.name}`}
                            >
                              <option value="">
                                {teachers.length === 0
                                  ? "No active teachers"
                                  : "Unassigned"}
                              </option>

                              {teachers.map((teacher) => (
                                <option
                                  key={teacher._id}
                                  value={teacher._id}
                                >
                                  {teacher.name}
                                </option>
                              ))}
                            </select>

                            {account.teacherId && !assignedTeacher && (
                              <p className="text-xs text-amber-600">
                                Assigned teacher unavailable
                              </p>
                            )}
                          </div>
                        ) : (
                          <span className="text-fg/30">Not applicable</span>
                        )}
                      </td>

                      <td className="px-6 py-4 text-right">
                        <button
                          type="button"
                          disabled={
                            isCurrentAdmin ||
                            updatingUserId === account._id
                          }
                          onClick={() => void handleToggleStatus(account)}
                          className={`rounded-lg px-3 py-2 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-40 ${
                            account.isActive
                              ? "bg-red-500/10 text-red-600 hover:bg-red-500/20"
                              : "bg-green-500/10 text-green-600 hover:bg-green-500/20"
                          }`}
                        >
                          {updatingUserId === account._id
                            ? "Updating..."
                            : account.isActive
                              ? "Deactivate"
                              : "Activate"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile account cards */}
          <div className="divide-y divide-border lg:hidden">
            {filteredUsers.map((account) => {
              const isCurrentAdmin = account._id === currentUser?.id;
              const assignedTeacher = teachers.find(
                (teacher) => teacher._id === account.teacherId
              );

              return (
                <article key={account._id} className="space-y-4 p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-sm font-bold text-accent">
                      {getInitials(account.name)}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold">
                        {account.name}
                        {isCurrentAdmin && (
                          <span className="ml-1 text-xs text-fg/40">
                            (You)
                          </span>
                        )}
                      </p>
                      <p className="truncate text-xs text-fg/50">
                        {account.email}
                      </p>
                    </div>

                    <span
                      className={`shrink-0 rounded-lg px-2 py-1 text-xs font-semibold ${
                        account.isActive
                          ? "bg-green-500/10 text-green-600"
                          : "bg-red-500/10 text-red-500"
                      }`}
                    >
                      {account.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="rounded-lg bg-fg/[0.06] px-2.5 py-1.5 font-semibold">
                      {roleLabels[account.role]}
                    </span>
                    <span className="rounded-lg bg-fg/[0.06] px-2.5 py-1.5 text-fg/65">
                      {account.totalSolved} solved
                    </span>
                  </div>

                  {account.role === "user" && (
                    <div>
                      <label className="mb-1.5 block text-xs font-semibold text-fg/55">
                        Teacher assignment
                      </label>

                      <select
                        value={account.teacherId || ""}
                        disabled={
                          updatingUserId === account._id ||
                          (!account.teacherId && teachers.length === 0)
                        }
                        onChange={(e) =>
                          void handleAssignTeacher(
                            account._id,
                            e.target.value
                          )
                        }
                        className="select h-10 w-full rounded-xl"
                      >
                        <option value="">
                          {teachers.length === 0
                            ? "No active teachers"
                            : "Unassigned"}
                        </option>

                        {teachers.map((teacher) => (
                          <option key={teacher._id} value={teacher._id}>
                            {teacher.name}
                          </option>
                        ))}
                      </select>

                      {account.teacherId && !assignedTeacher && (
                        <p className="mt-1 text-xs text-amber-600">
                          Assigned teacher unavailable
                        </p>
                      )}
                    </div>
                  )}

                  <div className="flex justify-end">
                    <button
                      type="button"
                      disabled={
                        isCurrentAdmin ||
                        updatingUserId === account._id
                      }
                      onClick={() => void handleToggleStatus(account)}
                      className={`rounded-lg px-4 py-2 text-xs font-semibold disabled:opacity-40 ${
                        account.isActive
                          ? "bg-red-500/10 text-red-600"
                          : "bg-green-500/10 text-green-600"
                      }`}
                    >
                      {updatingUserId === account._id
                        ? "Updating..."
                        : account.isActive
                          ? "Deactivate account"
                          : "Activate account"}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>

          {/* Empty state */}
          {filteredUsers.length === 0 && (
            <div className="px-6 py-16 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-fg/[0.05] text-2xl text-fg/40">
                ⌕
              </div>

              <h3 className="mt-4 font-semibold">No accounts found</h3>

              <p className="mt-1 text-sm text-fg/50">
                Try changing your search or filters.
              </p>

              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setRoleFilter("all");
                  setStatusFilter("all");
                }}
                className="mt-4 text-sm font-semibold text-accent hover:underline"
              >
                Clear filters
              </button>
            </div>
          )}

          <footer className="border-t border-border bg-fg/[0.02] px-5 py-3 text-xs text-fg/45">
            Showing {filteredUsers.length} of {users.length} accounts
          </footer>
        </section>

        {/* Footer */}
        <footer className="flex flex-col justify-between gap-2 border-t border-border pt-5 text-xs text-fg/40 sm:flex-row">
          <p>CompileX Administration</p>
          <p>Manage your learning platform securely.</p>
        </footer>
      </div>
    </main>
  );
};
