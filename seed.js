const { initializeApp } = require("firebase/app");
const { getFirestore, collection, addDoc } = require("firebase/firestore");
require("dotenv").config({ path: ".env.local" });

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const books = [
  { title: "Atomic Habits", author: "James Clear", price: 399, category: "Self-Help", description: "A guide to building good habits and breaking bad ones.", imageUrl: "https://covers.openlibrary.org/b/isbn/0735211299-L.jpg", stock: 10 },
  { title: "Rich Dad Poor Dad", author: "Robert Kiyosaki", price: 350, category: "Self-Help", description: "Lessons on money and financial independence.", imageUrl: "https://covers.openlibrary.org/b/isbn/1612680194-L.jpg", stock: 10 },
  { title: "The Power of Now", author: "Eckhart Tolle", price: 320, category: "Self-Help", description: "A guide to spiritual enlightenment and living in the present.", imageUrl: "https://covers.openlibrary.org/b/isbn/1577314808-L.jpg", stock: 10 },
  { title: "The Alchemist", author: "Paulo Coelho", price: 299, category: "Fiction", description: "A shepherd's journey to find his personal legend.", imageUrl: "https://covers.openlibrary.org/b/isbn/0062315005-L.jpg", stock: 10 },
  { title: "The Kite Runner", author: "Khaled Hosseini", price: 350, category: "Fiction", description: "A story of friendship and redemption set in Afghanistan.", imageUrl: "https://covers.openlibrary.org/b/isbn/1594480001-L.jpg", stock: 10 },
  { title: "Wings of Fire", author: "A. P. J. Abdul Kalam", price: 250, category: "Fiction", description: "The autobiography of India's Missile Man.", imageUrl: "https://covers.openlibrary.org/b/isbn/8173711466-L.jpg", stock: 10 },
  { title: "Clean Code", author: "Robert C. Martin", price: 550, category: "Technology", description: "A handbook of agile software craftsmanship.", imageUrl: "https://covers.openlibrary.org/b/isbn/0132350882-L.jpg", stock: 10 },
  { title: "The Pragmatic Programmer", author: "Andrew Hunt and David Thomas", price: 600, category: "Technology", description: "Practical advice for becoming a better programmer.", imageUrl: "https://covers.openlibrary.org/b/isbn/020161622X-L.jpg", stock: 10 },
  { title: "Cracking the Coding Interview", author: "Gayle Laakmann McDowell", price: 650, category: "Technology", description: "189 programming interview questions and solutions.", imageUrl: "https://covers.openlibrary.org/b/isbn/0984782857-L.jpg", stock: 10 },
  { title: "Harry Potter and the Sorcerer's Stone", author: "J. K. Rowling", price: 450, category: "Fantasy", description: "A young boy discovers he is a wizard.", imageUrl: "https://covers.openlibrary.org/b/isbn/0439708184-L.jpg", stock: 10 },
  { title: "The Hobbit", author: "J. R. R. Tolkien", price: 400, category: "Fantasy", description: "A hobbit's unexpected adventure to reclaim a treasure.", imageUrl: "https://covers.openlibrary.org/b/isbn/0547928227-L.jpg", stock: 10 },
  { title: "Percy Jackson: The Lightning Thief", author: "Rick Riordan", price: 380, category: "Fantasy", description: "A boy discovers he is the son of a Greek god.", imageUrl: "https://covers.openlibrary.org/b/isbn/0786838655-L.jpg", stock: 10 },
];

async function seed() {
  for (const book of books) {
    await addDoc(collection(db, "books"), book);
    console.log("Added:", book.title);
  }
  console.log("Done! All books added.");
  process.exit(0);
}

seed();