import { NavLink } from "react-router-dom";
import { FaRegUser } from "react-icons/fa6";
import { FiMapPin, FiLock, FiShoppingBag } from "react-icons/fi";

const SidebarUser = () => {
  const navItemClass = ({ isActive }) =>
    `flex items-center gap-2 rounded px-3 py-2 transition-colors ${
      isActive
        ? "bg-blue-100 text-blue-700 font-semibold"
        : "text-gray-700 hover:bg-gray-200"
    }`;

  return (
    <div className="my-8 w-full max-w-xs rounded-lg p-6">
      <p className="mb-4 flex items-center gap-2 text-lg font-bold text-gray-700">
        <FaRegUser className="text-blue-500" />
        บัญชีของฉัน
      </p>
      <nav className="flex flex-col space-y-2 text-sm">
        <NavLink to="profile" className={navItemClass}>
          <FaRegUser /> ประวัติ
        </NavLink>
        <NavLink to="address" className={navItemClass}>
          <FiMapPin /> ที่อยู่
        </NavLink>
        <NavLink to="password" className={navItemClass}>
          <FiLock /> เปลี่ยนรหัสผ่าน
        </NavLink>
        <NavLink to="orders" className={navItemClass}>
          <FiShoppingBag /> คำสั่งซื้อของฉัน
        </NavLink>
      </nav>
    </div>
  );
};

export default SidebarUser;
