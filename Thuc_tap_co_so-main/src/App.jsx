import React from 'react'
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import Login from './pages/public/Login'
import Header from './pages/public/Header'
import Home from './pages/public/Home'
import Product from './pages/public/Product'
import Cart from './pages/public/Cart'
import ShopList from './pages/public/ShopList';
import Shop from './pages/public/Shop'
const MainLayout = () => {
  return (
    <>
      <Header />
      <Outlet />
    </>
  )
}

const NoLayout = () => {
  return <Outlet />
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<NoLayout />}>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
        </Route>

        <Route element={<MainLayout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/product/:id" element={<Product />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/shop" element={<ShopList />} />
          <Route path="/shop/:id" element={<Shop />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}