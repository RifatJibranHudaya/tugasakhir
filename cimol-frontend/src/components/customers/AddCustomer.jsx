import React, { useState } from "react";
import api from "../../services/api";

const AddCustomer = ({ authToken }) => {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    api.post("/customers", form, {
      headers: { Authorization: `Bearer ${authToken}` },
    })
      .then(() => window.location.href = "/customers");
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      <h2>Tambah Customer</h2>

      <input placeholder="Nama" value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />

      <input placeholder="Telepon" value={form.phone}
        onChange={(e) => setForm({ ...form, phone: e.target.value })}
      />

      <input placeholder="Alamat" value={form.address}
        onChange={(e) => setForm({ ...form, address: e.target.value })}
      />

      <button type="submit" className="btn">Simpan</button>
    </form>
  );
};

export default AddCustomer;
