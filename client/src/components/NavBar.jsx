import { Link, NavLink } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCart } from "@/context/CartContext";
import { BsCart2 } from "react-icons/bs";
import { toast } from "react-toastify";

function NavBar({ isAuthenticated, user, logout }) {
  const { cart } = useCart();

  const itemcart = cart.reduce((total, item) => total + item.quantity, 0);

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
      <div className="container mx-auto flex items-center gap-4 rounded-2xl bg-gray-300 px-4 py-3">
        {/* Left side: Logo + NavLinks */}
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-extrabold text-gray-800">SHOPPER</h1>
          <ul className="hidden gap-x-6 text-gray-700 md:flex">
            <li>
              <NavLink to="/" className={activeLink}>
                Home
              </NavLink>
            </li>
            <li>
              <NavLink to="/about" className={activeLink}>
                About
              </NavLink>
            </li>
            <li>
              <NavLink to="/product" className={activeLink}>
                Product
              </NavLink>
            </li>
            <li>
              <NavLink to="/contact" className={activeLink}>
                Contact
              </NavLink>
            </li>
          </ul>
        </div>

        {/* Center: Search */}
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search..."
            className="w-full rounded-full bg-gray-100 p-2 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        {/* Right side: User actions */}
        <div className="flex items-center gap-3">
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
                      {user?.username || "ผู้ใช้"}!
                    </span>
                    <svg
                      className="h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
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
                      <NavLink to="/admin" className="cursor-pointer">
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

export default NavBar;
