import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";

function MainLayout() {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <>
      <div className="font-kanit flex min-h-screen flex-col overflow-y-auto">
        <Navbar isAuthenticated={isAuthenticated} user={user} logout={logout} />

        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
      </div>
    </>
  );
}

export default MainLayout;
