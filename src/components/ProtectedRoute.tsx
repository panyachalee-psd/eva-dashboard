import React from "react";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  // 1️⃣ Check for token in sessionStorage
  const token = sessionStorage.getItem("auth_token");

  // 2️⃣ Check if we are in preview mode
  const isPreview = import.meta.env.VITE_APP_IS_PREVIEW === "true";

  // Debug log
  console.log("Preview mode:", import.meta.env.VITE_APP_IS_PREVIEW);
  console.log("Token:", token);

  // 3️⃣ Allow access if in preview mode
  if (isPreview) {
    return <>{children}</>; // ✅ wrap in fragment
  }

  // 4️⃣ Redirect to 404 if token is missing
  if (!token) {
    return <Navigate to="/404" replace />;
  }

  // 5️⃣ Token exists → allow access
  return <>{children}</>;
}

// import { Navigate } from "react-router-dom";
// import React from "react";

// export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
//   const token = sessionStorage.getItem("auth_token");

//     // allow access in test/preview environment
//   const isPreview = import.meta.env.VITE_APP_IS_PREVIEW === "true";
//   console.log("Preview mode:", import.meta.env.VITE_APP_IS_PREVIEW);

//   if (isPreview) return children;

//   if (!token) {
//     return <Navigate to="/404" replace />;
//   }

//   return <>{children}</>;
// }
