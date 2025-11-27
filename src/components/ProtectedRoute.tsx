import { Navigate } from "react-router-dom";
import React from "react";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = sessionStorage.getItem("auth_token");

  const allowPublic = import.meta.env.VITE_APP_ALLOW_PUBLIC_ACCESS === "true";

  // console.log("VITE_APP_ALLOW_PUBLIC_ACCESS =", import.meta.env.VITE_APP_ALLOW_PUBLIC_ACCESS);
  // console.log("allowPublic =", allowPublic);

  if (allowPublic) {
    return children;
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
