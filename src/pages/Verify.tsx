import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import NotFound from "../components/Notfound";

export default function VerifyToken() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isValid, setIsValid] = useState<boolean | null>(null);

  useEffect(() => {
    const token = searchParams.get("token");
    console.log("token", token);

    if (!token) {
      setIsValid(false);
      setLoading(false);
      return;
    }

    // Store token only for this browser session
    sessionStorage.setItem("auth_token", token);

    setIsValid(true);
    setLoading(false);

    setTimeout(() => {
      navigate("/dashboard", { replace: true });
    }, 300);
  }, [searchParams, navigate]);

  if (loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center text-gray-700">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-gray-500 mb-4"></div>
        <p>Checking token...</p>
      </div>
    );
  }

  if (isValid === false) {
    return <NotFound />;
  }

  return null;
}
