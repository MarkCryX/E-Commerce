// src/layouts/UserLayout.jsx
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";
import SidebarUser from "@/components/UserAccount/SidebarUser";

const UserLayout = () => {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <>
      <div className="font-kanit flex min-h-screen flex-col overflow-y-auto">
        <Navbar isAuthenticated={isAuthenticated} user={user} logout={logout} />

        <main className="container mx-auto grid flex-1 grid-cols-[1fr_6fr]">
          <SidebarUser />
          <Outlet />
        </main>

        <Footer />
      </div>
    </>
  );
};

export default UserLayout;
