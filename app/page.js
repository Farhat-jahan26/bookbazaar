"use client";

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../lib/firebase";
import Link from "next/link";

export default function Home() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBooks() {
      const snapshot = await getDocs(collection(db, "books"));
      const booksList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setBooks(booksList);
      setLoading(false);
    }
    fetchBooks();
  }, []);

  if (loading) return <p style={{ textAlign: "center", marginTop: "50px" }}>Loading books...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ textAlign: "center" }}>BookBazaar</h1>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: "20px",
          marginTop: "30px",
        }}
      >
        {books.map((book) => (
          <Link
            key={book.id}
            href={`/books/${book.id}`}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <div
              style={{
                border: "1px solid #ddd",
                borderRadius: "8px",
                padding: "10px",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  width: "100%",
                  aspectRatio: "2 / 3",
                  overflow: "hidden",
                  borderRadius: "4px",
                  backgroundColor: "#f5f5f5",
                }}
              >
                <img
                  src={book.imageUrl}
                  alt={book.title}
                  onError={(e) => { e.target.onerror = null; e.target.src = "https://via.placeholder.com/220x330?text=No+Cover"; }}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
              <h3 style={{ fontSize: "16px", margin: "10px 0 5px" }}>{book.title}</h3>
              <p style={{ fontSize: "14px", color: "#555", margin: "0 0 5px" }}>{book.author}</p>
              <p style={{ fontWeight: "bold" }}>₹{book.price}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}