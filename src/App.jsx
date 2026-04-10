import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
// import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from './pages/Landing-Page';
import Login from "./pages/Login-Page";
import RegisterUser from './pages/user_page/Register-User-Page';
import VerifyEmail from './pages/Verify-Email-Page';
import DashboardUser from './pages/user_page/Dashboard-User-Page';
import DashboardAdmin from './pages/admin_page/Dashboard-Admin-Page';
import Unauthorized from './pages/Unauthorized-Page';
import UserShopPage from './pages/user_page/User-Shop-Page';
import CreateShopPage from './pages/user_page/Create-Shop-Page';
import CreateProductPage from './pages/user_page/Create-Product-Page';
import UserProductPage from './pages/user_page/User-Product-Page';
import PublicShopPage from './pages/public_page/Public-Shop-Page'
import OrderFormPage from './pages/public_page/Order-Form-Page';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register-user" element={<RegisterUser/>} />
        <Route path="/unauthorized" element={<Unauthorized/>} />
        <Route path="/verify-email" element={<VerifyEmail/>} />
        {/* user */}
        <Route path="/dashboard-user" element={<DashboardUser/>} />
        <Route path="/dashboard-user/shop/:id" element={<UserShopPage/>} />
        <Route path="/dashboard-user/shop/create-shop" element={<CreateShopPage/>} />
        <Route path="/dashboard-user/shop/:shop_id/create-product" element={<CreateProductPage />} />
        <Route path="/dashboard-user/shop/:shop_id/product/:id" element={<UserProductPage />} />
        {/* admin */}
        <Route path="/dashboard-admin" element={<DashboardAdmin/>} />
        {/* public */}
        <Route path="/shop/:shop_slug" element={<PublicShopPage/>} />
        <Route path="/shop/:shop_slug/order" element={<OrderFormPage/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App
