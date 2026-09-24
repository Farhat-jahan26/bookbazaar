"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";
import { auth, db } from "../../lib/firebase";
import Link from "next/link";

export default function Orders() {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const q = query(collection(db, "orders"), where("userId", "==", currentUser.uid));
        const snapshot = await getDocs(q);
        const ordersList = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setOrders(ordersList);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) return <p style={{ textAlign: "center", marginTop: "50px" }}>Loading...</p>;

  if (!user) {
    return (
      <div style={{ textAlign: "center", marginTop: "60px" }}>
        <h2>Please login to see your orders</h2>
        <Link href="/login">
          <button style={{ marginTop: "20px", padding: "10px 20px", cursor: "pointer" }}>
            Login
          </button>
        </Link>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div style={{ textAlign: "center", marginTop: "60px" }}>
        <h2>No orders yet</h2>
        <Link href="/">
          <button style={{ marginTop: "20px", padding: "10px 20px", cursor: "pointer" }}>
            Browse Books
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "700px", margin: "40px auto", padding: "20px" }}>
      <h1>My Orders</h1>
      {orders.map((order) => (
        <div
          key={order.id}
          style={{ border: "1px solid #ddd", borderRadius: "8px", padding: "15px", marginBottom: "15px" }}
        >
          <p style={{ margin: "0 0 5px", fontWeight: "bold" }}>Order ID: {order.id}</p>
          <p style={{ margin: "0 0 10px", color: "green", textTransform: "capitalize" }}>
            Status: {order.status}
          </p>
          {order.items.map((item, idx) => (
            <div key={idx} style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", margin: "4px 0" }}>
              <span>{item.title} x {item.quantity}</span>
              <span>₹{item.price * item.quantity}</span>
            </div>
          ))}
          <p style={{ marginTop: "10px", fontWeight: "bold", textAlign: "right" }}>
            Total: ₹{order.totalAmount}
          </p>
        </div>
      ))}
    </div>
  );
}