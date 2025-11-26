import { Navigate } from "react-router-dom";
import React from "react";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = sessionStorage.getItem("auth_token");

  // allow access on preview, development, or tester mode
  const allowPublic = import.meta.env.VITE_APP_ALLOW_PUBLIC_ACCESS === "true";

  if (allowPublic) {
    console.log("Public access mode enabled");
    return children; // skip token check
  }

  if (!token) {
    return <Navigate to="/404" replace />;
  }

  return <>{children}</>;
}

// import { Navigate } from "react-router-dom";
// import React from "react";

// export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
//   const token = sessionStorage.getItem("auth_token");

//   if (!token) {
//     return <Navigate to="/404" replace />;
//   }

//   return <>{children}</>;
// }
