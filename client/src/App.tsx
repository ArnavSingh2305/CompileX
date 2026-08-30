import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Navbar } from "./components/Navbar";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { Dashboard } from "./pages/Dashboard";
import { CodeLab } from "./pages/CodeLab";
import { ProblemList } from "./pages/ProblemList";
import { ProblemDetail } from "./pages/ProblemDetail";
import { SubmissionDetail } from "./pages/SubmissionDetail";
import { ArticleList } from "./pages/ArticleList";
import { ArticleReader } from "./pages/ArticleReader";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
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
          <Route path="/learn" element={<ProtectedRoute><ArticleList /></ProtectedRoute>} />
          <Route path="/learn/:slug" element={<ProtectedRoute><ArticleReader /></ProtectedRoute>} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;