// src/layouts/AdminLayout.jsx
import { Outlet, Link,useNavigate  } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // เพื่อใช้ logout
import { FaTachometerAlt, FaUsers, FaBox, FaSignOutAlt } from 'react-icons/fa'; // ตัวอย่างไอคอน
import SidebarAdmin from '../components/SidebarAdmin';
import { useEffect } from 'react';

const AdminLayout = () => {
  const { logout, user } = useAuth(); 
  const navigate = useNavigate();
   useEffect(() => {
    // ตรวจสอบ role เมื่อ component โหลด
    if (user?.role !== 'admin') {
      navigate('/profile');
    }
  }, [user, navigate]);

  return (
    <div className="flex min-h-screen bg-gray-100 font-kanit">
      <SidebarAdmin logout={logout} user={user}/>

   
      <main className="flex-1 p-6 overflow-y-auto">
        <Outlet /> {/* เนื้อหาของ /admin */}
      </main>
    </div>
  );
};

export default AdminLayout;