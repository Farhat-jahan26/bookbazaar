"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import { useCart } from "../../../context/CartContext";

export default function BookDetail() {
  const { id } = useParams();
  const router = useRouter();
  const { addToCart } = useCart();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [confirmation, setConfirmation] = useState("");

  useEffect(() => {
    async function fetchBook() {
      const docRef = doc(db, "books", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setBook({ id: docSnap.id, ...docSnap.data() });
      }
      setLoading(false);
    }
    fetchBook();
  }, [id]);

  function handleAddToCart() {
    addToCart(book, quantity);
    setConfirmation(`${quantity} ${quantity === 1 ? "copy" : "copies"} added to cart ✅`);
    setTimeout(() => setConfirmation(""), 2000);
    setQuantity(1);
  }

  if (loading) return <p style={{ textAlign: "center", marginTop: "50px" }}>Loading...</p>;
  if (!book) return <p style={{ textAlign: "center", marginTop: "50px" }}>Book not found.</p>;

  return (
    <div style={{ maxWidth: "800px", margin: "40px auto", padding: "20px" }}>
      <button
        onClick={() => router.push("/")}
        style={{ marginBottom: "20px", padding: "8px 16px", cursor: "pointer" }}
      >
        ← Back
      </button>
      <div style={{ display: "flex", gap: "30px", flexWrap: "wrap" }}>
        <img
          src={book.imageUrl}
          alt={book.title}
          onError={(e) => { e.target.onerror = null; e.target.src = "https://via.placeholder.com/250x350?text=No+Cover"; }}
          style={{ width: "250px", height: "350px", objectFit: "cover", borderRadius: "8px" }}
        />
        <div style={{ flex: 1, minWidth: "250px" }}>
          <h1>{book.title}</h1>
          <p style={{ color: "#555", fontSize: "18px" }}>by {book.author}</p>
          <p style={{ fontSize: "14px", color: "#888" }}>Category: {book.category}</p>
          <p style={{ fontSize: "22px", fontWeight: "bold", margin: "15px 0" }}>₹{book.price}</p>
          <p style={{ lineHeight: "1.6" }}>{book.description}</p>
          <p style={{ marginTop: "10px", color: book.stock > 0 ? "green" : "red" }}>
            {book.stock > 0 ? `In Stock (${book.stock} left)` : "Out of Stock"}
          </p>

          {book.stock > 0 && (
            <>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginTop: "20px" }}>
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  style={{ padding: "6px 14px", cursor: "pointer", fontSize: "16px" }}
                >
                  -
                </button>
                <span style={{ fontSize: "16px", minWidth: "20px", textAlign: "center" }}>{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => Math.min(book.stock, q + 1))}
                  style={{ padding: "6px 14px", cursor: "pointer", fontSize: "16px" }}
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                style={{
                  marginTop: "15px",
                  padding: "12px 24px",
                  backgroundColor: "#1F3A5F",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: "16px",
                }}
              >
                Add to Cart
              </button>

              {confirmation && (
                <p style={{ color: "green", marginTop: "10px", fontWeight: "bold" }}>{confirmation}</p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}