import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
// import api from "@/utils/axios"; // your axios instance
import NotFound from "../components/Notfound";

export default function VerifyToken() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const verify = async () => {
      const token = searchParams.get("token");
      console.log("token", token);

      if (!token) {
        setError("Missing token");
        setLoading(false);
        return;
      } else {
        navigate("/dashboard", { replace: true });
      }

      //   try {
      //     const res = await api.get(`/auth/verify?token=${token}`);

      //     if (res.data.valid) {
      //       localStorage.setItem("auth_token", token);
      //       navigate("/dashboard", { replace: true });
      //     } else {
      //       setError("Invalid or expired token");
      //     }
      //   } catch (err) {
      //     setError("Token verification failed");
      //   } finally {
      //     setLoading(false);
      //   }
    };

    verify();
  }, [searchParams, navigate]);

  // 🌀 Loading State
  if (loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center text-gray-700">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-gray-500 mb-4"></div>
        <p>Verifying token...</p>
      </div>
    );
  }

  // ❌ Error State
  if (error) {
    return (
      //   <div className="h-screen flex flex-col items-center justify-center text-red-600">
      //     <h1 className="text-2xl font-bold mb-2">404</h1>
      //     <p>{error}</p>
      //   </div>
      <NotFound />
    );
  }

  // You’ll rarely reach this since you navigate on success
  return null;
}
