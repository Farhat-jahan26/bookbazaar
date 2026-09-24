"use client";

import Link from "next/link";
import { useCart } from "../../context/CartContext";

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, totalAmount } = useCart();

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
    <div style={{ maxWidth: "700px", margin: "40px auto", padding: "20px" }}>
      <h1>Your Cart</h1>
      {cart.map((item) => (
        <div
          key={item.id}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "15px",
            borderBottom: "1px solid #ddd",
            padding: "15px 0",
          }}
        >
          <img
            src={item.imageUrl}
            alt={item.title}
            style={{ width: "60px", height: "90px", objectFit: "cover", borderRadius: "4px" }}
          />
          <div style={{ flex: 1 }}>
            <h3 style={{ margin: "0 0 5px" }}>{item.title}</h3>
            <p style={{ margin: "0 0 5px", color: "#555" }}>₹{item.price}</p>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <button
                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                style={{ padding: "4px 10px", cursor: "pointer" }}
              >
                -
              </button>
              <span>{item.quantity}</span>
              <button
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                style={{ padding: "4px 10px", cursor: "pointer" }}
              >
                +
              </button>
              <button
                onClick={() => removeFromCart(item.id)}
                style={{ marginLeft: "15px", color: "red", cursor: "pointer", border: "none", background: "none" }}
              >
                Remove
              </button>
            </div>
          </div>
          <p style={{ fontWeight: "bold" }}>₹{item.price * item.quantity}</p>
        </div>
      ))}

      <div style={{ marginTop: "20px", textAlign: "right" }}>
        <h2>Total: ₹{totalAmount}</h2>
        <Link href="/checkout">
          <button
            style={{
              padding: "12px 24px",
              backgroundColor: "#1F3A5F",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "16px",
            }}
          >
            Proceed to Checkout
          </button>
        </Link>
      </div>
    </div>
  );
}