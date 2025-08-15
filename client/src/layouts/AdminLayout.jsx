// src/layouts/AdminLayout.jsx
import { Outlet, Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth"; // เพื่อใช้ logout
import { FaTachometerAlt, FaUsers, FaBox, FaSignOutAlt } from "react-icons/fa"; // ตัวอย่างไอคอน
import SidebarAdmin from "../components/SidebarAdmin";
import { useEffect } from "react";

const AdminLayout = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    // ตรวจสอบ role เมื่อ component โหลด
    if (user?.role !== "admin") {
      navigate("/user/profile");
    }
  }, [user, navigate]);

  return (
    <div className="font-kanit flex min-h-screen bg-gray-100">
      <SidebarAdmin logout={logout} user={user} />

      <main className="flex-1 overflow-y-auto p-6">
        <Outlet /> {/* เนื้อหาของ /admin */}
      </main>
    </div>
  );
};

export default AdminLayout;
