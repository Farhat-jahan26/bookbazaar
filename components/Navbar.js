"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../lib/firebase";
import { useCart } from "../context/CartContext";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { totalItems } = useCart();
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  async function handleLogout() {
    await signOut(auth);
    router.push("/");
  }

  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "15px 30px",
        borderBottom: "1px solid #ddd",
      }}
    >
      <Link href="/" style={{ textDecoration: "none", color: "#1F3A5F", fontWeight: "bold", fontSize: "22px" }}>
        BookBazaar
      </Link>
      <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
        <Link href="/" style={{ textDecoration: "none", color: "#333" }}>
          Home
        </Link>
        <Link href="/cart" style={{ textDecoration: "none", color: "#333" }}>
          Cart ({totalItems})
        </Link>
        {user && (
          <Link href="/orders" style={{ textDecoration: "none", color: "#333" }}>
            My Orders
          </Link>
        )}
        {user ? (
          <>
            <span style={{ color: "#555", fontSize: "14px" }}>{user.email}</span>
            <button
              onClick={handleLogout}
              style={{ padding: "6px 14px", cursor: "pointer", border: "1px solid #1F3A5F", borderRadius: "4px", background: "none", color: "#1F3A5F" }}
            >
              Logout
            </button>
          </>
        ) : (
          <Link href="/login" style={{ textDecoration: "none", color: "#333" }}>
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}