# Grocery Delivery Web Application

A full-stack grocery delivery platform built with React, Node.js, and MongoDB.

## Admin Credentials

To access the admin dashboard, use the following credentials on the login page:

- **Email:** `admin@grocery.com`
- **Password:** `Admin@123`

## Quick Start

### 1. Setup Backend
```bash
cd server
npm install
npm run dev
```

### 2. Setup Frontend
```bash
cd client
npm install
npm run dev
```

## Features

- **Customer:** Browse products, search/filter, add to cart, and place orders.
- **Admin:** Add, edit, and delete products; manage customer orders.
- **Docker:** Ready-to-use Docker configuration for local and production deployment.

## Environment Variables

### Backend (.env)
- `MONGODB_URI`: Your MongoDB Atlas connection string
- `JWT_SECRET`: Secret key for authentication
- `PORT`: Server port (default: 3100)

### Frontend (.env)
- `VITE_API_URL`: URL of the backend server (default: http://localhost:3100)
