import React, { useEffect, useState } from "react";
import api from "../../services/api";
import { useParams } from "react-router-dom";

const EditCustomer = ({ authToken }) => {
  const { id } = useParams();
  const [form, setForm] = useState({ name: "", phone: "", address: "" });

  useEffect(() => {
    api.get(`/customers/${id}`, {
      headers: { Authorization: `Bearer ${authToken}` },
    })
      .then((res) => setForm(res.data));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    api.put(`/customers/${id}`, form, {
      headers: { Authorization: `Bearer ${authToken}` },
    })
      .then(() => window.location.href = "/customers");
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      <h2>Edit Customer</h2>

      <input value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })} />

      <input value={form.phone}
        onChange={(e) => setForm({ ...form, phone: e.target.value })} />

      <input value={form.address}
        onChange={(e) => setForm({ ...form, address: e.target.value })} />

      <button type="submit" className="btn">Update</button>
    </form>
  );
};

export default EditCustomer;
