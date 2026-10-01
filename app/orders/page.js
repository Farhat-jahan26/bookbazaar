"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { collection, query, where, orderBy, getDocs, doc, updateDoc, increment } from "firebase/firestore";
import { auth, db } from "../../lib/firebase";
import Link from "next/link";

export default function Orders() {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        await fetchOrders(currentUser.uid);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  async function fetchOrders(uid) {
    const q = query(collection(db, "orders"), where("userId", "==", uid), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    const ordersList = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setOrders(ordersList);
  }

  async function handleCancel(order) {
    setCancellingId(order.id);
    try {
      await updateDoc(doc(db, "orders", order.id), { status: "Cancelled" });

      for (const item of order.items) {
        await updateDoc(doc(db, "books", item.bookId), {
          stock: increment(item.quantity),
        });
      }

      setOrders((prev) =>
        prev.map((o) => (o.id === order.id ? { ...o, status: "Cancelled" } : o))
      );
    } catch (err) {
      alert("Error cancelling order: " + err.message);
    }
    setCancellingId(null);
  }

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
          <p
            style={{
              margin: "0 0 10px",
              fontWeight: "bold",
              textTransform: "capitalize",
              color:
                order.status === "Cancelled" ? "red" :
                order.status === "Delivered" ? "green" :
                order.status === "Shipped" ? "#1F3A5F" : "#888",
            }}
          >
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

          {order.status === "placed" || order.status === "Placed" ? (
            <button
              onClick={() => handleCancel(order)}
              disabled={cancellingId === order.id}
              style={{
                marginTop: "10px",
                padding: "8px 16px",
                backgroundColor: "white",
                color: "red",
                border: "1px solid red",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              {cancellingId === order.id ? "Cancelling..." : "Cancel Order"}
            </button>
          ) : null}
        </div>
      ))}
    </div>
  );
}