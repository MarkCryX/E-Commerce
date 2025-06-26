// routes/AppRoutes.jsx
import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";

import HomePage from "../pages/HomePage";
import MainLayout from "../layouts/MainLayout";
import AboutPage from "../pages/AboutPage";
// import LearnPage from "./pages/LearnPage";
import NotFoundPage from "../pages/NotFoundPage";
// import EcomPage from "./pages/EcomPage";
import Register from "../pages/RegisterPage";
import ProductPage from "../pages/ProductPage";
import LoginPage from "../pages/LoginPage";
import { AuthProvider } from "../context/AuthContext"; // Import AuthProvider
import PrivateRoute from "./PrivateRoute";
import ProfilePage from "../pages/user/ProfilePage";
import AdminLayout from "../layouts/AdminLayout";
import ManageProductsPage from "../pages/admin/products/ManageProductsPage";
import AdminPage from "../pages/admin/AdminPage";
import PublicOnlyRoute from "./PublicOnlyRoute";
import DashboardPage from "../pages/admin/dashboard/DashboardPage";
import ManageUserPage from "../pages/admin/users/ManageUserPage";
import ManageOrders from "../pages/admin/orders/ManageOrders";
import CreateProduct from "@/pages/admin/products/CreateProduct";
import ManageCategory from "@/pages/admin/category/ManageCategory";
import EditProduct from "@/pages/admin/products/EditProduct";


function AppRoutes() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/product" element={<ProductPage />} />
          <Route path="/register" element={<PublicOnlyRoute> <Register /> </PublicOnlyRoute>} />
          <Route path="/login" element={<PublicOnlyRoute> <LoginPage /> </PublicOnlyRoute>} />
          <Route path="/profile" element={ <PrivateRoute> <ProfilePage /> </PrivateRoute>} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>

        <Route path="/admin" element={ <PrivateRoute roles={["admin"]}> <AdminLayout/> </PrivateRoute> }>
            <Route index element={<AdminPage/>} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="manage-user" element={<ManageUserPage />} />
            <Route path="manage-orders" element={<ManageOrders />} />
            <Route path="manage-product" element={<ManageProductsPage />} />
            <Route path="create-product" element={<CreateProduct />} />
            <Route path="edit-product/:id" element={<EditProduct />} />
            <Route path="manage-category" element={<ManageCategory />} />


            <Route path="*" element={<NotFoundPage />} />
        </Route>
      </>
    )
  );

  return (
    <AuthProvider>
      <RouterProvider router={router}></RouterProvider>
    </AuthProvider>
  );
}

export default AppRoutes;
