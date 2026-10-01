# BookBazaar 📚

BookBazaar is a full-stack online book store where users can browse books by category, search by title/author, add them to a cart, sign up/login, place orders, and view or cancel their order history. It also includes an admin panel for managing books and orders. This project demonstrates authentication, database management, state management, dynamic routing, and a complete e-commerce workflow.

This is a demo store — orders are saved in the database, but no real payment is taken.

## Live Demo
[https://bookbazaar-taupe.vercel.app/]

## Features

**User Side**
- Browse books by category, with real-time search by title or author
- Book detail page with description, price, and stock
- Quantity selector and confirmation message when adding to cart
- Shopping cart (add, remove, update quantity) with persistent state (localStorage)
- User authentication (Signup/Login) with Firebase
- Checkout and order placement, with automatic stock reduction
- My Orders page showing order history in latest-first (LIFO) order
- Cancel Order (only while status is "Placed"), which restores book stock
- Responsive design with a mobile-friendly navbar

**Admin Panel** (`/admin`, restricted to the admin account)
- Add, edit, and delete books
- View all orders from every user
- Update order status (Placed → Shipped → Delivered)
- Cancel any order as an admin override

## Tech Stack
- **Frontend:** Next.js (App Router), React
- **Authentication:** Firebase Authentication
- **Database:** Firebase Firestore
- **State Management:** React Context API + localStorage
- **Styling:** Inline CSS
- **Deployment:** Vercel

## Getting Started

1. Clone the repository

git clone https://github.com/Farhat-jahan26/bookbazaar.git
cd bookbazaar

2. Install dependencies

npm install

3. Create a `.env.local` file in the root with your Firebase config:

NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

4. Run the development server

npm run dev

5. Open http://localhost:3000

## Database Structure

**books collection:** title, author, price, category, description, imageUrl, stock

**orders collection:** userId, userEmail, items, totalAmount, status, createdAt

## Security
Firestore Security Rules control access at the database level:
- Books are publicly readable; only the admin account can create or delete them
- Orders can only be created and read by the user who owns them (or by the admin)
- A composite index (userId + createdAt) powers the latest-first order history query

## Author
Farhat Jahan — [GitHub](https://github.com/Farhat-jahan26)