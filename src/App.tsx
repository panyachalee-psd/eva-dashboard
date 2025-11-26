import { Routes, Route, Navigate } from "react-router-dom";
import VerifyToken from "@/pages/Verify";
import DashboardLayout from "@/components/DashboardLayout";
import NotFound from "@/components/Notfound";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function App() {
  return (
    <Routes>
      {/* root redirect */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      {/* token verification */}
      <Route path="/verify" element={<VerifyToken />} />

      {/* protected dashboard */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      />

      <Route path="/404" element={<NotFound />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
