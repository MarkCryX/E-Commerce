// src/components/PublicOnlyRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PublicOnlyRoute = ({ children }) => {
  const { isAuthenticated, loading, user } = useAuth();

 
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

  // ถ้าล็อกอินแล้ว:
  if (isAuthenticated) {
    // ใช้ state จาก location เพื่อป้องกันการ redirect ซ้อน
    const from = location.state?.from?.pathname || 
                 (user?.role === 'admin' ? '/admin/dashboard' : '/');
    return <Navigate to={from} replace />;
  }

  return children;
};

export default PublicOnlyRoute;
