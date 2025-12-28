// src/App.jsx

import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import Login from "./components/Login.jsx";
import ProductList from "./components/ProductList.jsx";

import CustomerList from "./components/customers/CustomerList.jsx";
import AddCustomer from "./components/customers/AddCustomer.jsx";
import EditCustomer from "./components/customers/EditCustomer.jsx";

import OrderList from "./components/orders/OrderList.jsx";
import AddOrder from "./components/orders/AddOrder.jsx";
import EditOrder from "./components/orders/EditOrder.jsx";

import api from "./services/api";
import "./App.css";

function App() {
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem("user");
        return storedUser ? JSON.parse(storedUser) : null;
    });

    const handleLoginSuccess = (userData, newToken) => {
        setToken(newToken);
        setUser(userData);
        localStorage.setItem("token", newToken);
        localStorage.setItem("user", JSON.stringify(userData));
    };

    const handleLogout = async () => {
        try {
            await api.post("/logout");
        } catch (e) {
            console.error(e);
        }
        setToken(null);
        setUser(null);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
    };

    // Jika belum login
    if (!token) return <Login onLoginSuccess={handleLoginSuccess} />;

    return (
        <Router>
            <div className="container">

                {/* ---------------- MENU NAVIGASI ---------------- */}
                <nav className="menu-bar">
                    <Link to="/products">Produk</Link>
                    <Link to="/customers">Customer</Link>
                    <Link to="/orders">Order</Link>
                    <button onClick={handleLogout} className="btn-logout">Logout</button>
                </nav>

                <h1 className="title">Sistem Penjualan Cimol Stick Kentang</h1>
                <p>Selamat Datang, <b>{user?.name}</b></p>

                {/* ---------------- ROUTES HALAMAN ---------------- */}
                <Routes>
                    {/* Produk */}
                    <Route
                        path="/products"
                        element={<ProductList authToken={token} user={user} />}
                    />

                    {/* Customer */}
                    <Route
                        path="/customers"
                        element={<CustomerList authToken={token} />}
                    />
                    <Route
                        path="/add-customer"
                        element={<AddCustomer authToken={token} />}
                    />
                    <Route
                        path="/edit-customer/:id"
                        element={<EditCustomer authToken={token} />}
                    />

                    {/* Order */}
                    <Route
                        path="/orders"
                        element={<OrderList authToken={token} />}
                    />
                    <Route
                        path="/add-order"
                        element={<AddOrder authToken={token} />}
                    />
                    <Route
                        path="/edit-order/:id"
                        element={<EditOrder authToken={token} />}
                    />

                    {/* Default direct to products */}
                    <Route
                        path="*"
                        element={<ProductList authToken={token} user={user} />}
                    />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
