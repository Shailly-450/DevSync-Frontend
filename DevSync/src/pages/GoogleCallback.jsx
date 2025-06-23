import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../App";
import { getProfile } from "../utils/api";

export default function GoogleCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuth();
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleGoogleLogin = async () => {
      const token = searchParams.get("token");
      const errorParam = searchParams.get("error");
      
      if (errorParam) {
        setError(errorParam);
        return;
      }
      
      if (token) {
        try {
          localStorage.setItem('token', token);
          
          const profileRes = await getProfile();

          login(profileRes.data, token);

          navigate("/dashboard");
        } catch (err) {
          console.error("Error during google callback", err);
          setError("Failed to complete login. Please try again.");
        }
      } else {
        setError("No authentication token received. Please try again.");
      }
    };

    handleGoogleLogin();
  }, [navigate, searchParams, login]);

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Authentication Error</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">{error}</p>
          <button
            onClick={() => navigate('/auth')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-600 mx-auto mb-4"></div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">Finalizing your login...</h2>
        <p className="text-gray-600 dark:text-gray-400">Please wait while we securely log you in.</p>
      </div>
    </div>
  );
}
