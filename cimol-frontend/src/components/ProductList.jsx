// src/components/ProductList.jsx

import React, { useState, useEffect } from 'react';
import api from '../services/api';
import "./ProductList.css";

const ProductList = ({ authToken, user, onLogout }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentProduct, setCurrentProduct] = useState(null);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        stock: ''
    });

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.get('/products');
            setProducts(Array.isArray(response.data) ? response.data : []);
        } catch (err) {
            setError("Gagal memuat produk dari server.");
            setProducts([]);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!authToken) {
            alert("401: Anda tidak login");
            return;
        }

        try {
            if (currentProduct) {
                await api.put(`/products/${currentProduct.id}`, formData);
            } else {
                await api.post('/products', formData);
            }

            fetchProducts();
            closeModal();

        } catch (err) {
            alert("Gagal menyimpan produk.");
        }
    };

    const handleDelete = async (productId) => {
        if (!window.confirm("Hapus produk ini?")) return;

        try {
            await api.delete(`/products/${productId}`);
            fetchProducts();
        } catch (err) {
            alert("Gagal menghapus produk.");
        }
    };

    const openModal = (product = null) => {
        setCurrentProduct(product);

        setFormData(
            product
                ? {
                    name: product.name,
                    description: product.description || "",
                    price: product.price,
                    stock: product.stock
                }
                : { name: '', description: '', price: '', stock: '' }
        );

        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setCurrentProduct(null);
        setFormData({ name: '', description: '', price: '', stock: '' });
    };


    return (
        <div className="product-container">
            <div className="user-card neon-border">
                <p>Selamat Datang, <b>{user?.name || "Admin"}</b></p>
                <button className="btn-red" onClick={onLogout}>Logout</button>
            </div>

            <div className="header-section">
                <h2 className="neon-text">📦 Daftar Produk</h2>

                {authToken && (
                    <button className="btn-green" onClick={() => openModal()}>
                        + Tambah Produk Baru
                    </button>
                )}
            </div>

            {loading && <p className="loading-text">Memuat produk...</p>}
            {error && <p className="error-text">{error}</p>}

            {products.length === 0 ? (
                <p className="empty-text">Tidak ada produk.</p>
            ) : (
                <table className="neon-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nama</th>
                            <th>Deskripsi</th>
                            <th>Harga</th>
                            <th>Stok</th>
                            <th>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product) => (
                            <tr key={product.id}>
                                <td>{product.id}</td>
                                <td>{product.name}</td>
                                <td>{product.description || "-"}</td>
                                <td>Rp{parseFloat(product.price).toLocaleString("id-ID")}</td>
                                <td>{product.stock}</td>
                                <td className="action-buttons">
                                    <button className="btn-blue" onClick={() => openModal(product)}>Edit</button>
                                    <button className="btn-red" onClick={() => handleDelete(product.id)}>Hapus</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {/* MODAL */}
            {isModalOpen && (
                <Modal onClose={closeModal}>
                    <h3 className="modal-title">
                        {currentProduct ? "Edit Produk" : "Tambah Produk Baru"}
                    </h3>

                    <form onSubmit={handleSubmit} className="modal-form">
                        <input
                            type="text"
                            name="name"
                            placeholder="Nama Produk"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="input-field"
                        />

                        <textarea
                            name="description"
                            placeholder="Deskripsi Produk"
                            value={formData.description}
                            onChange={handleChange}
                            className="input-field"
                        />

                        <input
                            type="number"
                            name="price"
                            placeholder="Harga"
                            min="0"
                            value={formData.price}
                            onChange={handleChange}
                            required
                            className="input-field"
                        />

                        <input
                            type="number"
                            name="stock"
                            placeholder="Stok"
                            min="0"
                            value={formData.stock}
                            onChange={handleChange}
                            required
                            className="input-field"
                        />

                        <button className="btn-green" type="submit">
                            {currentProduct ? "Simpan Perubahan" : "Tambah Produk"}
                        </button>
                    </form>
                </Modal>
            )}
        </div>
    );
};

// MODAL
const Modal = ({ children, onClose }) => {
    return (
        <div className="modal-overlay">
            <div className="modal-content neon-border">
                <button className="modal-close" onClick={onClose}>
                    &times;
                </button>
                {children}
            </div>
        </div>
    );
};

export default ProductList;
