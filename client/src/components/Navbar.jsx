import { Link, NavLink } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BsCart2 } from "react-icons/bs";
import { toast } from "react-toastify";
import { useCart } from "@/hooks/useCart";
import { useState } from "react";
import { FaSearch, FaAlignJustify } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";
import { IoIosArrowDown } from "react-icons/io";

function Navbar({ isAuthenticated, user, logout }) {
  const { cart } = useCart();
  const itemcart = cart.reduce((total, item) => total + item.quantity, 0);
  const [showSearch, setShowSearch] = useState(false);
  const [openBurger, setOpenBurger] = useState(false);
  const handleLogout = async () => {
    const result = await logout(); // เรียกใช้ logout จาก AuthContext
    toast.success(result);
  };

  const activeLink = ({ isActive }) =>
    isActive
      ? "border-b-2 border-blue-500"
      : "border-b-2 border-transparent hover:border-blue-500 transition-all duration-300";

  return (
    <nav className="py-3">
      <div className="container mx-auto flex items-center justify-between gap-4 rounded-2xl bg-gray-300 px-4 py-3">
        {/* Left side: Logo + NavLinks */}
        <div className="flex items-center gap-4">
          <div className="block md:hidden">
            {openBurger ? (
              <aside className="fixed top-0 left-0 z-99 h-full bg-gray-100 pt-10 pr-16 pl-8">
                <RxCross2
                  size={25}
                  className="absolute top-4 right-4"
                  onClick={() => setOpenBurger(false)}
                />
                <ul className="space-y-5 text-xl text-gray-700 mt-4">
                  <li>
                    <NavLink to="/" className={activeLink}>
                      หน้าหลัก
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/product" className={activeLink}>
                      สินค้า
                    </NavLink>
                  </li>
                </ul>
              </aside>
            ) : (
              <FaAlignJustify
                size={20}
                className="text-gray-600 cursor-pointer"
                onClick={() => setOpenBurger(true)}
              />
            )}
          </div>

          <h1 className="text-2xl font-extrabold text-gray-800">SHOPPER</h1>
          <ul className="hidden gap-x-6 text-gray-700 md:flex">
            <li>
              <NavLink to="/" className={activeLink}>
                หน้าหลัก
              </NavLink>
            </li>
            <li>
              <NavLink to="/product" className={activeLink}>
                สินค้า
              </NavLink>
            </li>
          </ul>
        </div>

        {/* ค้นหาสำหรับหน้าจอใหญ่กว่ามือถือ */}
        <div className="hidden flex-1 md:block">
          <input
            type="text"
            placeholder="ค้นหาสินค้า..."
            className="w-full rounded-full bg-gray-100 p-2 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        {/* ค้นหาเต็มหน้าจอ (มือถือ)*/}
        {showSearch && (
          <div className="fixed inset-0 z-50 bg-white p-4">
            <div className="flex items-center gap-2">
              <input
                type="text"
                autoFocus
                placeholder="ค้นหาสินค้า..."
                className="flex-1 rounded-lg border px-4 py-2 focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={() => setShowSearch(false)}
                className="text-gray-600"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Right */}
        <div className="flex items-center gap-3">
          {/* ปุ่มค้นหาสำหรับมือถือ*/}
          <div className="mt-1 flex md:hidden">
            <button onClick={() => setShowSearch(true)}>
              <FaSearch size={20} className="text-gray-700" />
            </button>
          </div>
          {isAuthenticated ? (
            <>
              <Link to="/cart">
                <div className="relative">
                  {cart.length > 0 ? (
                    <div className="absolute bottom-3 left-3 flex h-4 w-4 items-center justify-center rounded-full bg-red-500">
                      <p className="text-sm text-white">{itemcart}</p>
                    </div>
                  ) : (
                    <div className="absolute bottom-3 left-3 flex h-4 w-4"></div>
                  )}

                  <BsCart2 className="text-2xl" />
                </div>
              </Link>

              {/* Dropdown Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex cursor-pointer items-center gap-1 font-semibold text-gray-700">
                    <img
                      src={user?.profileImage}
                      alt="profile"
                      className="h-8 w-8 rounded-full border-2 border-gray-400 object-fill"
                    />
                    <span className="hidden md:inline">
                      {user?.username || "ผู้ใช้"}
                    </span>
                    <IoIosArrowDown />
                  </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  className="z-50 mt-2 w-40 rounded-md border bg-white shadow-md"
                  align="end"
                >
                  <DropdownMenuLabel>Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />

                  <DropdownMenuItem asChild>
                    <NavLink
                      to="/user/profile"
                      className="w-full cursor-pointer text-left"
                    >
                      บัญชีของฉัน
                    </NavLink>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <NavLink
                      to="/user/orders"
                      className="w-full cursor-pointer text-left"
                    >
                      คำสั่งซื้อของฉัน
                    </NavLink>
                  </DropdownMenuItem>
                  {user?.role === "admin" && (
                    <DropdownMenuItem asChild>
                      <NavLink to="/admin/dashboard" className="cursor-pointer">
                        แผงผู้ดูแล
                      </NavLink>
                    </DropdownMenuItem>
                  )}

                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="cursor-pointer text-red-500"
                  >
                    ออกจากระบบ
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="rounded-lg px-4 py-2 text-sm font-semibold transition-colors duration-200 hover:bg-blue-600 hover:text-white md:text-base"
              >
                เข้าสู่ระบบ
              </Link>
              <Link
                to="/register"
                className="rounded-lg px-4 py-2 text-sm font-semibold transition-colors duration-200 hover:bg-green-600 hover:text-white md:text-base"
              >
                สมัครสมาชิก
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
