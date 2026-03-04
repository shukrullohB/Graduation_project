import { Navigate, Route, Routes } from "react-router-dom";
import AnalyticsDashboard from "../pages/AnalyticsDashboard";
import AnswerSubmitPage from "../pages/AnswerSubmitPage";
import LoginPage from "../pages/LoginPage";
import QuestionPage from "../pages/QuestionPage";
import StudentDashboard from "../pages/StudentDashboard";
import TeacherDashboard from "../pages/TeacherDashboard";
import TeacherReviewPage from "../pages/TeacherReviewPage";
import ProtectedRoute from "../components/ProtectedRoute";
import { isStudent, isTeacher, useAuth } from "../store/authStore";

const HomeRedirect = () => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (isTeacher(user)) return <Navigate to="/teacher/review" replace />;
  if (isStudent(user)) return <Navigate to="/student" replace />;
  return <Navigate to="/login" replace />;
};

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<HomeRedirect />} />
    <Route path="/login" element={<LoginPage />} />
    <Route
      path="/student"
      element={
        <ProtectedRoute allowedRoles={["student"]}>
          <StudentDashboard />
        </ProtectedRoute>
      }
    />
    <Route
      path="/questions/:id"
      element={
        <ProtectedRoute allowedRoles={["student"]}>
          <QuestionPage />
        </ProtectedRoute>
      }
    />
    <Route
      path="/questions/:id/answer"
      element={
        <ProtectedRoute allowedRoles={["student"]}>
          <AnswerSubmitPage />
        </ProtectedRoute>
      }
    />
    <Route
      path="/teacher"
      element={
        <ProtectedRoute allowedRoles={["teacher"]}>
          <TeacherDashboard />
        </ProtectedRoute>
      }
    />
    <Route
      path="/teacher/review"
      element={
        <ProtectedRoute allowedRoles={["teacher"]}>
          <TeacherReviewPage />
        </ProtectedRoute>
      }
    />
    <Route
      path="/teacher/analytics"
      element={
        <ProtectedRoute allowedRoles={["teacher"]}>
          <AnalyticsDashboard />
        </ProtectedRoute>
      }
    />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

export default AppRoutes;
