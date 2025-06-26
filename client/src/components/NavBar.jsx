import { Link, NavLink } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function NavBar({ isAuthenticated, user, logout }) {
  const activeLink = ({ isActive }) =>
    isActive
      ? "bg-blue-700 bg-opacity-60 rounded px-3 py-2 font-semibold text-white"
      : "hover:bg-blue-700 hover:bg-opacity-60 rounded px-3 py-2 font-semibold";

  return (
    <nav className="py-3 bg-white shadow-md">
      <div className="container mx-auto flex items-center gap-4">
        {/* Left side: Logo + NavLinks */}
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-extrabold text-gray-800">SHOPPER</h1>
          <ul className="hidden md:flex gap-x-6 text-gray-700">
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
          </ul>
        </div>

        {/* Center: Search */}
        <div className="flex-1">
          <input
            type="text"
            placeholder="ค้นหาสินค้า..."
            className="bg-gray-100 p-2 rounded-full w-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Right side: User actions */}
        <div className="flex gap-3 items-center">
          {isAuthenticated ? (
            <>
              <Link to="/cart">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="25"
                  height="25"
                  viewBox="0 0 24 24"
                  className="text-gray-600 hover:text-blue-500 transition-colors cursor-pointer"
                >
                  <path
                    fill="currentColor"
                    fillRule="evenodd"
                    d="M1.566 4a.75.75 0 0 1 .75-.75h1.181a2.25 2.25 0 0 1 2.228 1.937l.061.435h13.965a2.25 2.25 0 0 1 2.063 3.148l-2.668 6.128a2.25 2.25 0 0 1-2.063 1.352H7.722a2.25 2.25 0 0 1-2.228-1.937L4.24 5.396a.75.75 0 0 0-.743-.646h-1.18a.75.75 0 0 1-.75-.75m4.431 3.122l.982 6.982a.75.75 0 0 0 .743.646h9.361a.75.75 0 0 0 .688-.45l2.667-6.13a.75.75 0 0 0-.687-1.048z"
                    clipRule="evenodd"
                  />
                  <path
                    fill="currentColor"
                    d="M6.034 19.5a1.75 1.75 0 1 1 3.5 0a1.75 1.75 0 0 1-3.5 0m10.286-1.75a1.75 1.75 0 1 0 0 3.5a1.75 1.75 0 0 0 0-3.5"
                  />
                </svg>
              </Link>

              {/* Dropdown Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-1 text-gray-700 font-semibold cursor-pointer">
                    <img 
                    src={user?.profileImage} 
                    alt="profile" 
                    className="w-8 h-8 object-fill rounded-full border-2 border-gray-400"
                    />
                    <span className="hidden md:inline">
                      {user?.username || "ผู้ใช้"}!
                    </span>
                    <svg
                      className="w-4 h-4"
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
                  className="bg-white rounded-md border shadow-md w-40 mt-2 z-50"
                  align="end"
                >
                  <DropdownMenuLabel>บัญชีของฉัน</DropdownMenuLabel>
                  <DropdownMenuSeparator />

                  <DropdownMenuItem asChild>
                    <NavLink to="/profile" className="w-full text-left cursor-pointer">
                      โปรไฟล์
                    </NavLink>
                  </DropdownMenuItem>
                  {user?.role === "admin" && (
                    <DropdownMenuItem asChild>
                      <NavLink to="/admin" className="cursor-pointer">แผงผู้ดูแล</NavLink>
                    </DropdownMenuItem>
                  )}

                  <DropdownMenuItem
                    onClick={logout}
                    className="text-red-500 cursor-pointer"
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
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200 text-sm md:text-base"
              >
                เข้าสู่ระบบ
              </Link>
              <Link
                to="/register"
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200 text-sm md:text-base"
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
