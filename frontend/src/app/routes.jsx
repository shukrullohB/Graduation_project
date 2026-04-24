import { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ProtectedRoute from "../components/ProtectedRoute";
import LoadingSpinner from "../components/LoadingSpinner";

const LoginPage = lazy(() => import("../pages/LoginPage"));
const RegisterPage = lazy(() => import("../pages/RegisterPage"));
const StudentDashboard = lazy(() => import("../pages/StudentDashboard"));
const TeacherDashboard = lazy(() => import("../pages/TeacherDashboard"));
const QuestionPage = lazy(() => import("../pages/QuestionPage"));
const AnswerSubmitPage = lazy(() => import("../pages/AnswerSubmitPage"));
const MyAnswersPage = lazy(() => import("../pages/MyAnswersPage"));
const TeacherReviewPage = lazy(() => import("../pages/TeacherReviewPage"));
const CreateQuestionPage = lazy(() => import("../pages/CreateQuestionPage"));
const AnalyticsDashboard = lazy(() => import("../pages/AnalyticsDashboard"));
const NotFoundPage = lazy(() => import("../pages/NotFoundPage"));

export default function AppRoutes() {
  const { user } = useAuth();

  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-6xl px-4 py-20 md:px-8">
          <LoadingSpinner text="Loading page..." />
        </div>
      }
    >
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route element={<ProtectedRoute allowedRoles={["student"]} />}>
          <Route path="/student" element={<StudentDashboard />} />
          <Route path="/student/question/:id" element={<QuestionPage />} />
          <Route path="/student/submit/:id" element={<AnswerSubmitPage />} />
          <Route path="/student/my-answers" element={<MyAnswersPage />} />
          <Route path="/student/analytics" element={<AnalyticsDashboard />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={["teacher"]} />}>
          <Route path="/teacher" element={<TeacherDashboard />} />
          <Route
            path="/teacher/create-question"
            element={<CreateQuestionPage />}
          />
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
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}
