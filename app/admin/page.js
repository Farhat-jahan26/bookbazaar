"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection, getDocs, addDoc, updateDoc, deleteDoc, doc, increment,
} from "firebase/firestore";
import { auth, db } from "../../lib/firebase";
import Link from "next/link";

const ADMIN_EMAIL = "farhatfam10704@gmail.com"; // <-- apna email daalo

export default function AdminPanel() {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);
  const [books, setBooks] = useState([]);
  const [orders, setOrders] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  const [newBook, setNewBook] = useState({
    title: "", author: "", price: "", category: "", description: "", imageUrl: "", stock: "",
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setChecking(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user && user.email === "farhatfam10704@gmail.com") {
      loadBooks();
      loadOrders();
    }
  }, [user]);

  async function loadBooks() {
    const snapshot = await getDocs(collection(db, "books"));
    setBooks(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
  }

  async function loadOrders() {
    const snapshot = await getDocs(collection(db, "orders"));
    setOrders(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
  }

  async function handleAddBook(e) {
    e.preventDefault();
    await addDoc(collection(db, "books"), {
      title: newBook.title,
      author: newBook.author,
      price: Number(newBook.price),
      category: newBook.category,
      description: newBook.description,
      imageUrl: newBook.imageUrl,
      stock: Number(newBook.stock),
    });
    setNewBook({ title: "", author: "", price: "", category: "", description: "", imageUrl: "", stock: "" });
    loadBooks();
  }

  function startEdit(book) {
    setEditingId(book.id);
    setEditData(book);
  }

  async function saveEdit(id) {
    await updateDoc(doc(db, "books", id), {
      title: editData.title,
      author: editData.author,
      price: Number(editData.price),
      category: editData.category,
      description: editData.description,
      imageUrl: editData.imageUrl,
      stock: Number(editData.stock),
    });
    setEditingId(null);
    loadBooks();
  }

  async function handleDeleteBook(id) {
    if (!confirm("Delete this book?")) return;
    await deleteDoc(doc(db, "books", id));
    loadBooks();
  }

  async function handleStatusChange(order, newStatus) {
    await updateDoc(doc(db, "orders", order.id), { status: newStatus });
    setOrders((prev) => prev.map((o) => (o.id === order.id ? { ...o, status: newStatus } : o)));
  }

  async function handleAdminCancel(order) {
    if (!confirm("Cancel this order and restore stock?")) return;
    await updateDoc(doc(db, "orders", order.id), { status: "Cancelled" });
    for (const item of order.items) {
      await updateDoc(doc(db, "books", item.bookId), { stock: increment(item.quantity) });
    }
    setOrders((prev) => prev.map((o) => (o.id === order.id ? { ...o, status: "Cancelled" } : o)));
  }

  if (checking) return <p style={{ textAlign: "center", marginTop: "50px" }}>Checking access...</p>;

  if (!user || user.email !== ADMIN_EMAIL) {
    return (
      <div style={{ textAlign: "center", marginTop: "60px" }}>
        <h2>Access Denied</h2>
        <p>You are not authorized to view this page.</p>
        <Link href="/"><button style={{ marginTop: "15px", padding: "10px 20px", cursor: "pointer" }}>Go Home</button></Link>
      </div>
    );
  }

  const inputStyle = { padding: "8px", border: "1px solid #ccc", borderRadius: "4px", width: "100%", boxSizing: "border-box" };

  return (
    <div style={{ maxWidth: "1000px", margin: "30px auto", padding: "20px" }}>
      <h1>Admin Panel</h1>

      {/* Add Book */}
      <h2 style={{ marginTop: "30px" }}>Add New Book</h2>
      <form onSubmit={handleAddBook} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", maxWidth: "700px" }}>
        <input style={inputStyle} placeholder="Title" value={newBook.title} onChange={(e) => setNewBook({ ...newBook, title: e.target.value })} required />
        <input style={inputStyle} placeholder="Author" value={newBook.author} onChange={(e) => setNewBook({ ...newBook, author: e.target.value })} required />
        <input style={inputStyle} placeholder="Price" type="number" value={newBook.price} onChange={(e) => setNewBook({ ...newBook, price: e.target.value })} required />
        <input style={inputStyle} placeholder="Category" value={newBook.category} onChange={(e) => setNewBook({ ...newBook, category: e.target.value })} required />
        <input style={inputStyle} placeholder="Stock" type="number" value={newBook.stock} onChange={(e) => setNewBook({ ...newBook, stock: e.target.value })} required />
        <input style={inputStyle} placeholder="Image URL" value={newBook.imageUrl} onChange={(e) => setNewBook({ ...newBook, imageUrl: e.target.value })} required />
        <textarea style={{ ...inputStyle, gridColumn: "1 / 3" }} placeholder="Description" value={newBook.description} onChange={(e) => setNewBook({ ...newBook, description: e.target.value })} required />
        <button type="submit" style={{ gridColumn: "1 / 3", padding: "10px", backgroundColor: "#1F3A5F", color: "white", border: "none", borderRadius: "6px", cursor: "pointer" }}>
          Add Book
        </button>
      </form>

      {/* Books List */}
      <h2 style={{ marginTop: "40px" }}>All Books ({books.length})</h2>
      {books.map((book) => (
        <div key={book.id} style={{ border: "1px solid #ddd", borderRadius: "8px", padding: "12px", marginBottom: "10px" }}>
          {editingId === book.id ? (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
              <input style={inputStyle} value={editData.title} onChange={(e) => setEditData({ ...editData, title: e.target.value })} />
              <input style={inputStyle} value={editData.author} onChange={(e) => setEditData({ ...editData, author: e.target.value })} />
              <input style={inputStyle} type="number" value={editData.price} onChange={(e) => setEditData({ ...editData, price: e.target.value })} />
              <input style={inputStyle} value={editData.category} onChange={(e) => setEditData({ ...editData, category: e.target.value })} />
              <input style={inputStyle} type="number" value={editData.stock} onChange={(e) => setEditData({ ...editData, stock: e.target.value })} />
              <input style={inputStyle} value={editData.imageUrl} onChange={(e) => setEditData({ ...editData, imageUrl: e.target.value })} />
              <textarea style={{ ...inputStyle, gridColumn: "1 / 3" }} value={editData.description} onChange={(e) => setEditData({ ...editData, description: e.target.value })} />
              <div style={{ gridColumn: "1 / 3", display: "flex", gap: "10px" }}>
                <button onClick={() => saveEdit(book.id)} style={{ padding: "8px 16px", cursor: "pointer" }}>Save</button>
                <button onClick={() => setEditingId(null)} style={{ padding: "8px 16px", cursor: "pointer" }}>Cancel</button>
              </div>
            </div>
          ) : (
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
              <div>
                <strong>{book.title}</strong> by {book.author} — ₹{book.price} — {book.category} — Stock: {book.stock}
              </div>
              <div style={{ display: "flex", gap: "8px" }}>
                <button onClick={() => startEdit(book)} style={{ padding: "6px 12px", cursor: "pointer" }}>Edit</button>
                <button onClick={() => handleDeleteBook(book.id)} style={{ padding: "6px 12px", cursor: "pointer", color: "red" }}>Delete</button>
              </div>
            </div>
          )}
        </div>
      ))}

      {/* All Orders */}
      <h2 style={{ marginTop: "40px" }}>All Orders ({orders.length})</h2>
      {orders.map((order) => (
        <div key={order.id} style={{ border: "1px solid #ddd", borderRadius: "8px", padding: "12px", marginBottom: "10px" }}>
          <p style={{ margin: "0 0 5px" }}><strong>Order:</strong> {order.id}</p>
          <p style={{ margin: "0 0 5px" }}><strong>User:</strong> {order.userEmail}</p>
          {order.items.map((item, idx) => (
            <p key={idx} style={{ margin: "2px 0", fontSize: "14px" }}>{item.title} x {item.quantity} — ₹{item.price * item.quantity}</p>
          ))}
          <p style={{ margin: "5px 0", fontWeight: "bold" }}>Total: ₹{order.totalAmount}</p>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "8px" }}>
            <select
              value={order.status}
              onChange={(e) => handleStatusChange(order, e.target.value)}
              disabled={order.status === "Cancelled"}
              style={{ padding: "6px", borderRadius: "4px" }}
            >
              <option value="Placed">Placed</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
            {order.status !== "Cancelled" && (
              <button onClick={() => handleAdminCancel(order)} style={{ padding: "6px 12px", cursor: "pointer", color: "red" }}>
                Cancel Order
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}