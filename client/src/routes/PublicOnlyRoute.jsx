// src/components/PublicOnlyRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PublicOnlyRoute = ({ children }) => {
  const { isAuthenticated, loading, user } = useAuth();

 

  // ถ้าล็อกอินแล้ว:
  if (isAuthenticated) {
    // ใช้ state จาก location เพื่อป้องกันการ redirect ซ้อน
    const from = location.state?.from?.pathname || 
                 (user?.role === 'admin' ? '/admin/dashboard' : '/profile');
    return <Navigate to={from} replace />;
  }

  return children;
};

export default PublicOnlyRoute;
