import React, { useEffect, useState } from "react";
import api from "../../services/api";

const AddOrder = ({ authToken }) => {
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);

  const [form, setForm] = useState({
    customer_id: "",
    product_id: "",
    qty: 1,
  });

  useEffect(() => {
    api.get("/customers", { headers: { Authorization: `Bearer ${authToken}` } })
      .then((res) => setCustomers(res.data));

    api.get("/products", { headers: { Authorization: `Bearer ${authToken}` } })
      .then((res) => setProducts(res.data));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    api.post("/orders", form, {
      headers: { Authorization: `Bearer ${authToken}` },
    })
      .then(() => window.location.href = "/orders");
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      <h2>Tambah Order</h2>

      <select value={form.customer_id}
        onChange={(e) => setForm({ ...form, customer_id: e.target.value })}>
        <option>Pilih Customer</option>
        {customers.map((c) => (
          <option key={c.id} value={c.id}>{c.name}</option>
        ))}
      </select>

      <select value={form.product_id}
        onChange={(e) => setForm({ ...form, product_id: e.target.value })}>
        <option>Pilih Produk</option>
        {products.map((p) => (
          <option key={p.id} value={p.id}>{p.name}</option>
        ))}
      </select>

      <input type="number" value={form.qty} min="1"
        onChange={(e) => setForm({ ...form, qty: e.target.value })} />

      <button className="btn">Simpan</button>
    </form>
  );
};

export default AddOrder;
