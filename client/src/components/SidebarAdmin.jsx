import { Link } from "react-router-dom";
import {
  FaTachometerAlt,
  FaUsers,
  FaBox,
  FaSignOutAlt,
  FaShopify,
  FaHome,
  FaLayerGroup,
} from "react-icons/fa";
import { useState, useEffect, useRef } from "react";

const SidebarAdmin = ({ logout, user }) => {
  const [isOpen, setIsOpen] = useState(true);
  const sidebarRef = useRef(null);
  const toggleButtonRef = useRef(null);
  useEffect(() => {
  const handleClickOutside = (event) => {
    if (
      sidebarRef.current &&
      !sidebarRef.current.contains(event.target) &&
      toggleButtonRef.current &&
      !toggleButtonRef.current.contains(event.target)
    ) {
      setIsOpen(false); // หุบ ถ้าไม่ได้คลิกใน sidebar หรือปุ่ม toggle
    }
  };

  if (isOpen) {
    document.addEventListener("mousedown", handleClickOutside);
  }

  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, [isOpen]);

  return (
    <>
      {/* Sidebar แบบ fixed */}
      <aside
        ref={sidebarRef}
        className={`fixed top-0 left-0 h-full w-64 bg-gray-800 text-white flex flex-col p-4 shadow-lg z-40 transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="text-2xl font-bold mb-8 text-center">
          <Link to="/admin" className="hover:text-blue-300 transition-colors">
            แผงผู้ดูแล
          </Link>
        </div>
        <nav className="flex-grow flex flex-col justify-between">
          <ul className="space-y-2">
            <li>
              <Link
                to="/admin/dashboard"
                className="flex items-center p-3 rounded-lg hover:bg-gray-700 transition-colors text-lg"
              >
                <FaTachometerAlt className="mr-3" /> แดชบอร์ด
              </Link>
            </li>
            <li>
              <Link
                to="/admin/manage-user"
                className="flex items-center p-3 rounded-lg hover:bg-gray-700 transition-colors text-lg"
              >
                <FaUsers className="mr-3" /> จัดการผู้ใช้
              </Link>
            </li>
            <li>
              <Link
                to="/admin/manage-product"
                className="flex items-center p-3 rounded-lg hover:bg-gray-700 transition-colors text-lg"
              >
                <FaBox className="mr-3" /> จัดการสินค้า
              </Link>
            </li>
            <li>
              <Link
                to="/admin/manage-category"
                className="flex items-center p-3 rounded-lg hover:bg-gray-700 transition-colors text-lg"
              >
                <FaLayerGroup className="mr-3" /> จัดการหมวดหมู่สินค้า
              </Link>
            </li>
            <li>
              <Link
                to="/admin/manage-orders"
                className="flex items-center p-3 rounded-lg hover:bg-gray-700 transition-colors text-lg"
              >
                <FaShopify className="mr-3" /> ออเดอร์สินค้า
              </Link>
            </li>
          </ul>
          <ul className="space-y-2">
            <li>
              <Link
                to="/"
                className="flex items-center p-3 rounded-lg hover:bg-gray-700 transition-colors text-lg"
              >
                <FaHome className="mr-3" /> ไปหน้าร้านค้า
              </Link>
            </li>
          </ul>
        </nav>

        <div className="mt-auto pt-4 border-t border-gray-700">
          <div className="text-gray-400 text-sm mb-2 text-center">
            ชื่อ:{" "}
            <span className="font-semibold text-blue-300 mr-3">
              {user?.username || "Admin"}
            </span>
            role:{" "}
            <span className="font-semibold text-blue-300">
              {user?.role === "superadmin" ? "ผู้ดูแล" : "พนักงาน"}
            </span>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center justify-center p-3 rounded-lg bg-red-600 hover:bg-red-700 transition-colors text-lg font-semibold"
          >
            <FaSignOutAlt className="mr-2" /> ออกจากระบบ
          </button>
        </div>
      </aside>

      {/* ปุ่ม Toggle (Hamburger / X) */}
      <button
        ref={toggleButtonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 py-2 px-2 text-white bg-gray-700 rounded-md hover:bg-gray-600 transition-colors font-bold text-2xl"
      >
        {isOpen ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        )}
      </button>
    </>
  );
};

export default SidebarAdmin;
