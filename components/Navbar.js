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
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  async function handleLogout() {
    await signOut(auth);
    setMenuOpen(false);
    router.push("/");
  }

  return (
    <nav style={{ borderBottom: "1px solid #ddd" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "15px 20px",
        }}
      >
        <Link href="/" style={{ textDecoration: "none", color: "#1F3A5F", fontWeight: "bold", fontSize: "22px" }}>
          BookBazaar
        </Link>

        {/* Hamburger button - sirf mobile pe dikhega */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="navbar-toggle"
          style={{
            display: "none",
            background: "none",
            border: "1px solid #ccc",
            borderRadius: "4px",
            fontSize: "20px",
            padding: "4px 10px",
            cursor: "pointer",
          }}
        >
          ☰
        </button>

        {/* Links - desktop pe hamesha dikhenge */}
        <div className="navbar-links" style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <Link href="/" style={{ textDecoration: "none", color: "#333" }}>Home</Link>
          <Link href="/cart" style={{ textDecoration: "none", color: "#333" }}>Cart ({totalItems})</Link>
          {user && (
            <Link href="/orders" style={{ textDecoration: "none", color: "#333" }}>My Orders</Link>
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
            <Link href="/login" style={{ textDecoration: "none", color: "#333" }}>Login</Link>
          )}
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div
          className="navbar-mobile-menu"
          style={{
            display: "none",
            flexDirection: "column",
            gap: "15px",
            padding: "15px 20px",
            borderTop: "1px solid #eee",
          }}
        >
          <Link href="/" onClick={() => setMenuOpen(false)} style={{ textDecoration: "none", color: "#333" }}>Home</Link>
          <Link href="/cart" onClick={() => setMenuOpen(false)} style={{ textDecoration: "none", color: "#333" }}>Cart ({totalItems})</Link>
          {user && (
            <Link href="/orders" onClick={() => setMenuOpen(false)} style={{ textDecoration: "none", color: "#333" }}>My Orders</Link>
          )}
          {user ? (
            <>
              <span style={{ color: "#555", fontSize: "14px" }}>{user.email}</span>
              <button
                onClick={handleLogout}
                style={{ padding: "8px 14px", cursor: "pointer", border: "1px solid #1F3A5F", borderRadius: "4px", background: "none", color: "#1F3A5F", width: "fit-content" }}
              >
                Logout
              </button>
            </>
          ) : (
            <Link href="/login" onClick={() => setMenuOpen(false)} style={{ textDecoration: "none", color: "#333" }}>Login</Link>
          )}
        </div>
      )}

      <style>{`
        @media (max-width: 640px) {
          .navbar-links { display: none !important; }
          .navbar-toggle { display: block !important; }
          .navbar-mobile-menu { display: flex !important; }
        }
      `}</style>
    </nav>
  );
}