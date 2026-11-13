import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";

import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { Dashboard } from "./pages/Dashboard";
import { CodeLab } from "./pages/CodeLab";
import { ProblemList } from "./pages/ProblemList";
import { ProblemDetail } from "./pages/ProblemDetail";
import { SubmissionDetail } from "./pages/SubmissionDetail";
import { ArticleList } from "./pages/ArticleList";
import { ArticleReader } from "./pages/ArticleReader";
import { VerifyEmail } from "./pages/VerifyEmail";
import { ForgotPassword } from "./pages/ForgotPassword";
import { ResetPassword } from "./pages/ResetPassword";
import { OAuthSuccess } from "./pages/OAuthSuccess";
import { Leaderboard } from "./pages/Leaderboard";
import LandingPage from "./pages/LandingPage";
import { AdminDashboard } from "./pages/AdminDashboard";
import { TeacherDashboard } from "./pages/TeacherDashboard";

import { ThemeProvider } from "./context/ThemeContext";
import { PublicNavbar } from "./components/PublicNavbar";
import { AppSidebar } from "./components/AppSidebar";
import { Profile } from "./pages/Profile";
import { Settings } from "./pages/Settings";
import { ChangePassword } from "./pages/ChangePassword";

const AUTH_PAGES = [
  "/login",
  "/register",
  "/verify-email",
  "/forgot-password",
  "/reset-password",
  "/oauth-success",
  "/change-password",
];

const AppShell = () => {
  const { token, user } = useAuth();
  const location = useLocation();

  const isLandingPage = location.pathname === "/";
  const isAuthPage = AUTH_PAGES.includes(location.pathname);

  const showSidebar =
  Boolean(token) &&
  user?.role === "user" &&
  !isAuthPage &&
  !isLandingPage;

  const showPublicNavbar =
    (!token || isLandingPage) && !isAuthPage;

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      {showSidebar && <AppSidebar />}

      <div className="flex-1 flex flex-col min-w-0">
        {showPublicNavbar && <PublicNavbar />}

        <Routes>
          <Route path="/" element={<LandingPage />} />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/oauth-success" element={<OAuthSuccess />} />
          <Route
              path="/change-password"
              element={
                <ProtectedRoute>
                  <ChangePassword />
                </ProtectedRoute>
              }
            />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={["user"]}>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/teacher/dashboard"
            element={
              <ProtectedRoute allowedRoles={["teacher"]}>
                <TeacherDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/code-lab"
            element={
              <ProtectedRoute allowedRoles={["user"]}>
                <CodeLab />
              </ProtectedRoute>
            }
          />

          <Route
            path="/problems"
            element={
              <ProtectedRoute allowedRoles={["user"]}>
                <ProblemList />
              </ProtectedRoute>
            }
          />

          <Route
            path="/problems/:slug"
            element={
              <ProtectedRoute allowedRoles={["user"]}>
                <ProblemDetail />
              </ProtectedRoute>
            }
          />

          <Route
            path="/submissions/:id"
            element={
              <ProtectedRoute allowedRoles={["user"]}>
                <SubmissionDetail />
              </ProtectedRoute>
            }
          />

          <Route
            path="/learn"
            element={
              <ProtectedRoute allowedRoles={["user"]}>
                <ArticleList />
              </ProtectedRoute>
            }
          />

          <Route
            path="/learn/:slug"
            element={
              <ProtectedRoute allowedRoles={["user"]}>
                <ArticleReader />
              </ProtectedRoute>
            }
          />

          <Route
            path="/leaderboard"
            element={
              <ProtectedRoute allowedRoles={["user"]}>
                <Leaderboard />
              </ProtectedRoute>
            }
          />
          <Route path="/profile" element={<ProtectedRoute allowedRoles={["user"]}><Profile /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute allowedRoles={["user"]}><Settings /></ProtectedRoute>} />
        </Routes>
      </div>
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <AppShell />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;