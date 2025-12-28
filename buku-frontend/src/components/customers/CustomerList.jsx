import React, { useEffect, useState } from "react";
import api from "../../services/api";

const CustomerList = ({ authToken }) => {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    api
      .get("/customers", {
        headers: { Authorization: `Bearer ${authToken}` },
      })
      .then((res) => setCustomers(res.data))
      .catch((err) => console.error(err));
  }, []);

  const deleteCustomer = (id) => {
    if (!confirm("Hapus customer ini?")) return;

    api
      .delete(`/customers/${id}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      })
      .then(() => setCustomers(customers.filter((c) => c.id !== id)));
  };

  return (
    <div>
      <h2>Daftar Customer</h2>
      <a href="/add-customer" className="btn">+ Tambah Customer</a>

      <table>
        <thead>
          <tr>
            <th>ID</th><th>Nama</th><th>Telepon</th><th>Alamat</th><th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((c) => (
            <tr key={c.id}>
              <td>{c.id}</td>
              <td>{c.name}</td>
              <td>{c.phone}</td>
              <td>{c.address}</td>
              <td>
                <a href={`/edit-customer/${c.id}`} className="btn">Edit</a>
                <button onClick={() => deleteCustomer(c.id)} className="btn-red">Hapus</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CustomerList;
