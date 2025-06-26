import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function MainLayout() {
  const { isAuthenticated, user, logout } = useAuth();
  return (
    <>
      <div className="flex flex-col justify-between min-h-screen bg-gray-100 overflow-y-auto">
        <Navbar isAuthenticated={isAuthenticated} user={user} logout={logout} />
        <Outlet />
        <Footer />
      </div>
    </>
  );
}

export default MainLayout;
