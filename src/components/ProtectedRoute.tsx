import { Navigate } from "react-router-dom";
import React from "react";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem("auth_token");

    // allow access in test/preview environment
  const isPreview = import.meta.env.VITE_APP_IS_PREVIEW === "true";

  if (isPreview) return children;

  if (!token) {
    return <Navigate to="/404" replace />;
  }

  return <>{children}</>;
}
