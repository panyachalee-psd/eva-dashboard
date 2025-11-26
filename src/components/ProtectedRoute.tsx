import React from "react";
import { Navigate } from "react-router-dom";

// interface ProtectedRouteProps {
//   children: React.ReactNode;
// }

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = sessionStorage.getItem("auth_token");

  const isPreview =
    import.meta.env.VITE_APP_IS_PREVIEW === "true" ||
    window.location.hostname.includes("vercel.app");

  console.log("ProtectedRoute Preview mode:", isPreview);
  console.log("Token:", token);

  if (isPreview) return <>{children}</>;
  if (!token) return <Navigate to="/404" replace />;
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
