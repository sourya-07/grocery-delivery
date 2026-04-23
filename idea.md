# Grocery Delivery Web Application

## Overview
A full-stack grocery delivery platform where customers can browse and order groceries online, and admins can manage products and orders through a dedicated dashboard.

---

## Tech Stack

| Layer          | Technology              |
|----------------|-------------------------|
| Frontend       | React (Vite)            |
| Backend        | Node.js + Express.js    |
| Database       | MongoDB + Mongoose      |
| Authentication | JWT + bcrypt            |

---

## Pages & Features

### Authentication
- **Login Page** — Email & password login with JWT token
- **Register Page** — New user signup with password hashing (bcrypt)
- Role-based access: `admin` and `customer`

### Home Page
- Hero banner with promotions
- Browse by category (Vegetables, Fruits, Dairy, Drinks, Instant, Bakery, Grains)
- Featured / best-selling products
- Trust badges (Fast Delivery, Freshness, Affordable Prices)
- Footer with quick links

### Customer Dashboard
- **Products Page** — Browse all products, filter by category, search
- **Product Detail** — View images, description, price, add to cart
- **Cart** — View items, update quantity, remove items, see total
- **Checkout** — Add/select delivery address, place order
- **My Orders** — Track order status (Processing → Shipped → Delivered)

### Admin Dashboard
- **Add Product** — Name, category, price, offer price, images, description, stock status
- **Product List** — View all products, edit, delete, toggle stock
- **Orders Management** — View all customer orders, update order status

---

## Database Models

### User
- name, email, password (hashed), role (admin/customer), cartData

### Product
- name, category, price, offerPrice, image[], description[], inStock

### Order
- userId, items[], address, amount, status, paymentMethod, date

### Address
- userId, firstName, lastName, email, street, city, state, zipcode, country, phone

---

## API Endpoints

### Auth
- `POST /api/user/register` — Register new user
- `POST /api/user/login` — Login & get JWT token

### Products
- `GET /api/product/list` — Get all products
- `POST /api/product/add` — Add product (admin)
- `PUT /api/product/update` — Update product (admin)
- `DELETE /api/product/remove` — Delete product (admin)

### Cart
- `POST /api/cart/update` — Add/update cart items
- `GET /api/cart/get` — Get user's cart

### Orders
- `POST /api/order/place` — Place a new order
- `GET /api/order/user` — Get user's orders
- `GET /api/order/all` — Get all orders (admin)
- `PUT /api/order/status` — Update order status (admin)

### Address
- `POST /api/address/add` — Add delivery address
- `GET /api/address/get` — Get user's addresses

---

## Folder Structure

```
grocery-delivery/
├── client/                  # React Frontend (Vite)
│   ├── src/
│   │   ├── assets/          # Images, icons (from cart_assets)
│   │   ├── components/      # Navbar, Footer, ProductCard, etc.
│   │   ├── context/         # AuthContext, CartContext
│   │   ├── pages/           # Home, Login, Register, Cart, Orders, Admin pages
│   │   └── App.jsx
│   └── package.json
│
├── server/                  # Node.js + Express Backend
│   ├── config/              # DB connection
│   ├── controllers/         # Business logic
│   ├── middleware/           # Auth middleware (JWT verify)
│   ├── models/              # Mongoose schemas
│   ├── routes/              # API route definitions
│   ├── server.js            # Entry point
│   └── package.json
│
└── cart_assets/             # Product images & icons (existing)
```

---

## Flow

1. User visits **Home Page** → browses categories and products
2. User **Registers / Logs in** → gets JWT token stored in localStorage
3. User adds items to **Cart** → proceeds to **Checkout**
4. User enters **Delivery Address** → places **Order**
5. User can view order status in **My Orders**
6. **Admin** logs in → manages products via **Add/Edit/Delete**
7. **Admin** views all orders → updates status (Processing → Shipped → Delivered)