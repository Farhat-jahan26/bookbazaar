# BookBazaar 📚

BookBazaar is a full-stack online book store where users can browse books by category, add them to a cart, sign up/login, place orders, and view their order history. It demonstrates authentication, database management, state management, dynamic routing, and a complete e-commerce workflow.

This is a demo store — orders are saved in the database, but no real payment is taken.

## Live Demo
[(https://bookbazaar-taupe.vercel.app/)]

## Features
- Browse books by category
- Book detail page with description, price, and stock
- Shopping cart (add, remove, update quantity) with persistent state
- User authentication (Signup/Login) with Firebase
- Checkout and order placement
- My Orders page (user-specific order history)
- Responsive design

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

## Author
Farhat Jahan — [GitHub](https://github.com/Farhat-jahan26)