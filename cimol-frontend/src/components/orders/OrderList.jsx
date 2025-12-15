import React, { useEffect, useState } from "react";
import api from "../../services/api";

const OrderList = ({ authToken }) => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    api.get("/orders", {
      headers: { Authorization: `Bearer ${authToken}` },
    })
      .then((res) => setOrders(res.data));
  }, []);

  const deleteOrder = (id) => {
    if (!confirm("Hapus data order?")) return;

    api.delete(`/orders/${id}`, {
      headers: { Authorization: `Bearer ${authToken}` },
    })
      .then(() => setOrders(orders.filter((o) => o.id !== id)));
  };

  return (
    <div>
      <h2>Daftar Order</h2>
      <a href="/add-order" className="btn">+ Tambah Order</a>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Customer</th>
            <th>Produk</th>
            <th>Qty</th>
            <th>Total Harga</th>
            <th>Aksi</th>
          </tr>
        </thead>

        <tbody>
          {orders.map((o) => (
            <tr key={o.id}>
              <td>{o.id}</td>
              <td>{o.customer?.name}</td>
              <td>{o.product?.name}</td>
              <td>{o.qty}</td>
              <td>Rp{Number(o.total_price).toLocaleString('id-ID')}</td>
              <td>
                <a href={`/edit-order/${o.id}`} className="btn">Edit</a>
                <button onClick={() => deleteOrder(o.id)} className="btn-red">Hapus</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
};

export default OrderList;
