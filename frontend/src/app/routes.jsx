import { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ProtectedRoute from "../components/ProtectedRoute";
import LoadingSpinner from "../components/LoadingSpinner";
import Navbar from "../components/Navbar";
import NavigateByRole from "../components/NavigateByRole";

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
          <Route path="/student" element={<Navbar role="student" />}>
            <Route index element={<StudentDashboard />} />
            <Route path="question/:id" element={<QuestionPage />} />
            <Route path="submit/:id" element={<AnswerSubmitPage />} />
            <Route path="my-answers" element={<MyAnswersPage />} />
            <Route path="analytics" element={<AnalyticsDashboard />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute allowedRoles={["teacher"]} />}>
          <Route path="/teacher" element={<Navbar role="teacher" />}>
            <Route index element={<TeacherDashboard />} />
            <Route path="create-question" element={<CreateQuestionPage />} />
            <Route path="review/:answerId" element={<TeacherReviewPage />} />
            <Route path="analytics" element={<AnalyticsDashboard />} />
          </Route>
        </Route>

        <Route path="/" element={<NavigateByRole />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}
