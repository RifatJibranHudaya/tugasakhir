import React, { useEffect, useState } from "react";
import api from "../../services/api";
import { useParams } from "react-router-dom";

const EditOrder = ({ authToken }) => {
  const { id } = useParams();

  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);

  const [form, setForm] = useState({
    customer_id: "",
    product_id: "",
    qty: 1,
  });

  useEffect(() => {
    api.get(`/orders/${id}`, {
      headers: { Authorization: `Bearer ${authToken}` },
    }).then((res) => setForm(res.data));

    api.get("/customers", {
      headers: { Authorization: `Bearer ${authToken}` },
    }).then((res) => setCustomers(res.data));

    api.get("/products", {
      headers: { Authorization: `Bearer ${authToken}` },
    }).then((res) => setProducts(res.data));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    api.put(`/orders/${id}`, form, {
      headers: { Authorization: `Bearer ${authToken}` },
    })
      .then(() => window.location.href = "/orders");
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      <h2>Edit Order</h2>

      <select value={form.customer_id}
        onChange={(e) => setForm({ ...form, customer_id: e.target.value })}>
        {customers.map((c) => (
          <option key={c.id} value={c.id}>{c.name}</option>
        ))}
      </select>

      <select value={form.product_id}
        onChange={(e) => setForm({ ...form, product_id: e.target.value })}>
        {products.map((p) => (
          <option key={p.id} value={p.id}>{p.name}</option>
        ))}
      </select>

      <input type="number" min="1" value={form.qty}
        onChange={(e) => setForm({ ...form, qty: e.target.value })} />

      <button className="btn">Update</button>
    </form>
  );
};

export default EditOrder;
