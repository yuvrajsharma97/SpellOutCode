import { Routes, Route } from "react-router-dom";
import PublicLayout from "../components/layout/PublicLayout";
import AuthLayout from "../components/layout/AuthLayout";
import DashboardLayout from "../components/layout/DashboardLayout";
import ProtectedRoute from "../routes/ProtectedRoute";

import LandingPage from "../pages/LandingPage";
import ProfilePage from "../pages/ProfilePage";
import ProjectDetailPage from "../pages/ProjectDetailPage";
import UpdateDetailPage from "../pages/UpdateDetailPage";

import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import ForgotPasswordPage from "../pages/ForgotPasswordPage";
import ResetPasswordPage from "../pages/ResetPasswordPage";

import DashboardPage from "../pages/DashboardPage";
import DashboardProjectsPage from "../pages/DashboardProjectsPage";
import DashboardUpdatesPage from "../pages/DashboardUpdatesPage";
import DashboardSettingsPage from "../pages/DashboardSettingsPage";

import NotFoundPage from "../pages/NotFoundPage";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route element={<PublicLayout />}>
        <Route index element={<LandingPage />} />
        <Route path=":username" element={<ProfilePage />} />
        <Route
          path=":username/projects/:slug"
          element={<ProjectDetailPage />}
        />
        <Route
          path=":username/projects/:slug/updates/:updateId"
          element={<UpdateDetailPage />}
        />
      </Route>

      {/* Auth */}
      <Route element={<AuthLayout />}>
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="forgot-password" element={<ForgotPasswordPage />} />
        <Route path="reset-password/:token" element={<ResetPasswordPage />} />
      </Route>

      {/* Protected Dashboard */}
      <Route
        path="dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }>
        <Route index element={<DashboardPage />} />
        <Route path="projects" element={<DashboardProjectsPage />} />
        <Route
          path="projects/:projectId/updates"
          element={<DashboardUpdatesPage />}
        />
        <Route path="settings" element={<DashboardSettingsPage />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
