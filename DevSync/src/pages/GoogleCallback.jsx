import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../App";
import { getProfile } from "../utils/api";

export default function GoogleCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuth();

  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      localStorage.setItem('token', token);
      getProfile().then(profileRes => {
        login(profileRes.data, token);
        navigate("/dashboard");
      }).catch(() => {
        navigate("/auth?error=profile_fetch_failed");
      });
    } else {
      navigate("/auth?error=missing_token");
    }
  }, [navigate, searchParams, login]);

  return <div>Logging you in...</div>;
}
