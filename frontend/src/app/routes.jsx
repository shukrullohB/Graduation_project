import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ProtectedRoute from "../components/ProtectedRoute";
import LoginPage from "../pages/LoginPage";
import StudentDashboard from "../pages/StudentDashboard";
import TeacherDashboard from "../pages/TeacherDashboard";
import QuestionPage from "../pages/QuestionPage";
import AnswerSubmitPage from "../pages/AnswerSubmitPage";
import TeacherReviewPage from "../pages/TeacherReviewPage";
import AnalyticsDashboard from "../pages/AnalyticsDashboard";

export default function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route element={<ProtectedRoute allowedRoles={["student"]} />}>
        <Route path="/student" element={<StudentDashboard />} />
        <Route path="/student/question/:id" element={<QuestionPage />} />
        <Route path="/student/submit/:id" element={<AnswerSubmitPage />} />
        <Route path="/student/analytics" element={<AnalyticsDashboard />} />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={["teacher"]} />}>
        <Route path="/teacher" element={<TeacherDashboard />} />
        <Route
          path="/teacher/review/:answerId"
          element={<TeacherReviewPage />}
        />
        <Route path="/teacher/analytics" element={<AnalyticsDashboard />} />
      </Route>

      <Route
        path="/"
        element={
          user?.role === "teacher" ? (
            <Navigate to="/teacher" replace />
          ) : user?.role === "student" ? (
            <Navigate to="/student" replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
