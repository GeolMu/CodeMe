import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { apiClient } from "../services/api";

const AuthCallbackPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");

    if (token) {
      apiClient.setToken(token);
    }

    navigate("/", { replace: true });
  }, [location.search, navigate]);

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      로그인 처리 중입니다...
    </div>
  );
};

export default AuthCallbackPage;
