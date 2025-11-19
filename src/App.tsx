// src/App.tsx
import { Routes, Route } from "react-router-dom";
import VerifyToken from "@/pages/Verify";
import DashboardLayout from "@/components/DashboardLayout";
import NotFound from "@/components/Notfound";

export default function App() {
  return (
    <Routes>
      {/* token verification */}
      <Route path="/verify" element={<VerifyToken />} />

      {/* main dashboard (default route) */}
      <Route path="/dashboard" element={<DashboardLayout />} />

      {/* fallback for unknown routes */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
