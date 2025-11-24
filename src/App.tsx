import { Routes, Route } from "react-router-dom";
import VerifyToken from "@/pages/Verify";
import DashboardLayout from "@/components/DashboardLayout";
import NotFound from "@/components/Notfound";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function App() {
  return (
    <Routes>
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

      {/* pretty 404 */}
      <Route path="/404" element={<NotFound />} />

      {/* fallback for everything else */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

// // src/App.tsx
// import { Routes, Route } from "react-router-dom";
// import VerifyToken from "@/pages/Verify";
// import DashboardLayout from "@/components/DashboardLayout";
// import NotFound from "@/components/Notfound";

// export default function App() {
//   return (
//     <Routes>
//       {/* token verification */}
//       <Route path="/verify" element={<VerifyToken />} />

//       {/* main dashboard (default route) */}
//       <Route path="/dashboard" element={<DashboardLayout />} />

//       {/* fallback for unknown routes */}
//       <Route path="*" element={<NotFound />} />
//     </Routes>
//   );
// }
