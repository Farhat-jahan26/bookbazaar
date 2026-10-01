"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { collection, addDoc, doc, updateDoc, increment, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../../lib/firebase";
import { useCart } from "../../context/CartContext";
import { useEffect } from "react";
import Link from "next/link";

export default function Checkout() {
  const { cart, totalAmount, clearCart } = useCart();
  const [user, setUser] = useState(null);
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  async function handlePlaceOrder() {
    if (!user) {
      router.push("/login");
      return;
    }
    setPlacing(true);
    setError("");
    try {
      await addDoc(collection(db, "orders"), {
        userId: user.uid,
        userEmail: user.email,
        items: cart.map((item) => ({
          bookId: item.id,
          title: item.title,
          price: item.price,
          quantity: item.quantity,
        })),
        totalAmount: totalAmount,
        status: "placed",
        createdAt: serverTimestamp(),
      });
      // Stock ghatao har book ka
      for (const item of cart) {
        await updateDoc(doc(db, "books", item.id), {
          stock: increment(-item.quantity),
        });
      }
      clearCart();
      router.push("/orders");
    } catch (err) {
      setError(err.message);
    }
    setPlacing(false);
  }

  if (cart.length === 0) {
    return (
      <div style={{ textAlign: "center", marginTop: "60px" }}>
        <h2>Your cart is empty</h2>
        <Link href="/">
          <button style={{ marginTop: "20px", padding: "10px 20px", cursor: "pointer" }}>
            Browse Books
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "600px", margin: "40px auto", padding: "20px" }}>
      <h1>Checkout</h1>
      {cart.map((item) => (
        <div
          key={item.id}
          style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #eee" }}
        >
          <span>{item.title} x {item.quantity}</span>
          <span>₹{item.price * item.quantity}</span>
        </div>
      ))}
      <h2 style={{ textAlign: "right", marginTop: "15px" }}>Total: ₹{totalAmount}</h2>

      {!user && (
        <p style={{ color: "red" }}>
          You need to <Link href="/login">login</Link> to place an order.
        </p>
      )}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <button
        onClick={handlePlaceOrder}
        disabled={placing}
        style={{
          marginTop: "20px",
          padding: "12px 24px",
          backgroundColor: "#1F3A5F",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          fontSize: "16px",
          width: "100%",
        }}
      >
        {placing ? "Placing Order..." : "Place Order"}
      </button>
    </div>
  );
}