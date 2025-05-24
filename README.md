# 🍲 Recipe Book App

A user-friendly full-stack Recipe Book App that allows users to discover, add, manage, and interact with delicious recipes. Built with **React**, **Firebase**, **Express.js**, and **MongoDB**, the app includes features like top recipes, wishlist, user authentication, like system, and more — tailored for food lovers.

🔗 **Live Website:** [https://assignment-10-auth-1f744.web.app](https://assignment-10-auth-1f744.web.app)  
📦 **Client Repository:** [GitHub Client](https://github.com/Programming-Hero-Web-Course4/b11a10-client-side-Developer-Soriful)  
🛠️ **Server Repository:** [GitHub Server](https://github.com/Programming-Hero-Web-Course4/b11a10-server-side-Developer-Soriful)

---

## 🌟 Key Features

- 🔐 **Authentication System** with Firebase (Email/Password + Google Sign-In)
- 🍽️ **Add, Update & Delete Recipes** with form validation & private route protection
- ❤️ **Like Functionality** with real-time like count updates (excluding own recipes)
- 🌍 **Filter Recipes by Cuisine** type (e.g., Indian, Italian, Mexican)
- 🏆 **Top Recipes Section** sorted by most liked recipes
- 🌙 **Dark/Light Theme Toggle** support on the homepage
- 🎨 **Stunning UI** using **Tailwind CSS** and animation libraries like:
  - `react-awesome-reveal`
  - `react-simple-typewriter`
- 📱 **Fully Responsive Design** (Mobile, Tablet & Desktop)
- ☁️ **Client hosted on Firebase**, **Server on Vercel**

---

## 📚 Pages Overview

### 📌 Public Routes:
- **Home Page**
  - Banner/Slider
  - Top Recipes Section (6 most liked)
  - Extra Food-Themed Static Sections
- **All Recipes Page**
  - Grid layout with filtering by Cuisine Type
- **Login Page**
- **Register Page**
- **404 Not Found Page** (Food-themed, no navbar/footer)

### 🔒 Private Routes:
- **Add Recipe Page**
- **My Recipes Page** (CRUD operations only on user's own recipes)
- **Recipe Details Page** (Like functionality and recipe info)

---

## 🔧 Tech Stack

| Frontend         | Backend       | Auth           | Database  | Deployment |
|------------------|----------------|----------------|-----------|------------|
| React, Tailwind  | Express.js     | Firebase Auth  | MongoDB   | Firebase (client), Vercel (server) |

---

## ⚙️ Environment Variables Used

- `VITE_API_URL` – for server connection
- `VITE_FIREBASE_API_KEY`, `VITE_AUTH_DOMAIN`, etc. – Firebase config
- `MONGODB_URI` – MongoDB URI (hidden in `.env`)

---

## 📁 Folder Structure (Client)

