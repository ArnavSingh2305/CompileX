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

import { ThemeProvider } from "./context/ThemeContext";
import { PublicNavbar } from "./components/PublicNavbar";
import { AppSidebar } from "./components/AppSidebar";

const AUTH_PAGES = [
  "/login",
  "/register",
  "/verify-email",
  "/forgot-password",
  "/reset-password",
  "/oauth-success",
];

const AppShell = () => {
  const { token } = useAuth();
  const location = useLocation();

  const isAuthPage = AUTH_PAGES.includes(location.pathname);

  const showSidebar = Boolean(token) && !isAuthPage;
  const showPublicNavbar = !token && !isAuthPage;

  return (
    <div className="flex min-h-screen">
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
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/code-lab"
            element={
              <ProtectedRoute>
                <CodeLab />
              </ProtectedRoute>
            }
          />

          <Route
            path="/problems"
            element={
              <ProtectedRoute>
                <ProblemList />
              </ProtectedRoute>
            }
          />

          <Route
            path="/problems/:slug"
            element={
              <ProtectedRoute>
                <ProblemDetail />
              </ProtectedRoute>
            }
          />

          <Route
            path="/submissions/:id"
            element={
              <ProtectedRoute>
                <SubmissionDetail />
              </ProtectedRoute>
            }
          />

          <Route
            path="/learn"
            element={
              <ProtectedRoute>
                <ArticleList />
              </ProtectedRoute>
            }
          />

          <Route
            path="/learn/:slug"
            element={
              <ProtectedRoute>
                <ArticleReader />
              </ProtectedRoute>
            }
          />

          <Route
            path="/leaderboard"
            element={
              <ProtectedRoute>
                <Leaderboard />
              </ProtectedRoute>
            }
          />
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