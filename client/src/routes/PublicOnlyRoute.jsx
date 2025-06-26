// src/components/PublicOnlyRoute.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PublicOnlyRoute = ({ children }) => {
    const { isAuthenticated, loading ,user} = useAuth();

    // if (loading) {
    //     return <div>กำลังโหลด...</div>; 
    // }

     // ถ้าล็อกอินแล้ว:
    if (isAuthenticated) {
        // ตรวจสอบ role เพื่อ redirect ไปยังหน้าที่ถูกต้อง
        if (user && user.role === "admin") { // ต้องตรวจสอบ user และ user.role ด้วย
            return <Navigate to="/admin/manage-orders" />; // <--- redirect ตรงนี้!
        }
        return <Navigate to="/profile" />; // <--- redirect ตรงนี้!
    }

    return children; 
};

export default PublicOnlyRoute;