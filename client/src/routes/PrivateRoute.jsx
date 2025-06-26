// routes/PrivateRoute.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children, roles }) => {
    const { isAuthenticated, user, loading } = useAuth();

    if (loading) {
        return <div>Loading...</div>; // หรือ Spinner
    }

    if (!isAuthenticated) {
        // ไม่ได้ล็อกอิน, พาไปหน้า Login
        return <Navigate to="/login" replace />;
    }

    if (roles && roles.length > 0) {
        if (!user || !user.role || !roles.includes(user.role)) {
            return <Navigate to="/profile" />; // <--- ตรวจสอบว่าตรงนี้คุณไม่ได้ถูกเด้งกลับไป Profile
        }
    }

    return children; // อนุญาตให้เข้าถึง Component ลูก
};

export default PrivateRoute;