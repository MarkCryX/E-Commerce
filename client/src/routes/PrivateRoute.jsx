// routes/PrivateRoute.jsx
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PrivateRoute = ({ children, roles }) => {
  const {
    isAuthenticated,
    user,
    loading,
    hasLoggedOut,
    hasRefreshTokenFailed,
  } = useAuth();


  // ถ้ายัง loading อยู่หรือกำลังเช็ค auth
  if (loading) {
    return (
      <div className="full-page-loading">
        <div className="flex min-h-screen items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-blue-500"></div>
          <span className="ml-3">กำลังตรวจสอบสิทธิ์...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || hasLoggedOut || hasRefreshTokenFailed) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (roles && !roles.includes(user?.role)) {
    return <Navigate to="/" replace />;
  }

  return children; // อนุญาตให้เข้าถึง Component ลูก
};

export default PrivateRoute;
