# 🛒 Grocery Delivery App

A full-stack grocery delivery web application built with **React + Vite** on the frontend and **Express + TypeScript + MongoDB** on the backend.

---

## 📁 Project Structure

```
grocery-delivery/
├── client/                  # React + Vite frontend
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── context/         # React Context (auth, cart, etc.)
│   │   ├── pages/           # Route pages
│   │   │   ├── Home.jsx
│   │   │   ├── Products.jsx
│   │   │   ├── ProductDetail.jsx
│   │   │   ├── Cart.jsx
│   │   │   ├── Checkout.jsx
│   │   │   ├── MyOrders.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   └── admin/       # Admin dashboard pages
│   │   └── utils/           # Helper functions
│   ├── Dockerfile
│   ├── nginx.conf
│   └── vite.config.js
│
├── server/                  # Express + TypeScript backend
│   ├── config/              # DB connection
│   ├── controllers/         # Route handlers
│   ├── interfaces/          # TypeScript interfaces
│   ├── middleware/          # Auth & error middleware
│   ├── models/              # Mongoose models
│   ├── routes/              # API routes
│   ├── uploads/             # Uploaded product images
│   ├── seedAdmin.ts         # Seed initial admin user
│   ├── server.ts            # Entry point
│   └── Dockerfile
│
├── docker-compose.yml       # Local development (includes MongoDB)
├── docker-compose.prod.yml  # Production (pre-built images)
├── vercel.json              # Vercel serverless deployment config
└── .github/workflows/ci.yml # GitHub Actions CI pipeline
```

---

## 🚀 Tech Stack

| Layer      | Technology                                      |
|------------|-------------------------------------------------|
| Frontend   | React 19, React Router DOM 7, Vite 8            |
| Backend    | Node.js 20, Express 4, TypeScript 5             |
| Database   | MongoDB (Atlas for production / local for dev)  |
| Auth       | JWT (jsonwebtoken) + bcryptjs                   |
| File Upload| Multer                                          |
| Styling    | Vanilla CSS                                     |
| CI/CD      | GitHub Actions                                  |
| Deployment | Docker, Docker Compose, Vercel                  |

---

## ⚙️ Prerequisites

- **Node.js** >= 20
- **npm** >= 10
- **MongoDB** — local instance **or** [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) URI
- **Docker & Docker Compose** *(optional, for containerised setup)*

---

## 🔧 Local Development Setup

### 1. Clone the repository

```bash
git clone https://github.com/<your-username>/grocery-delivery.git
cd grocery-delivery
```

---

### 2. Configure environment variables

#### Server (`server/.env`)

Copy the example file and fill in your values:

```bash
cp server/.env.example server/.env
```

```env
MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.xxxx.mongodb.net/grocery-delivery
JWT_SECRET=replace_with_a_strong_random_secret
PORT=4000
NODE_ENV=development
```

#### Client (`client/.env`)

```bash
# client/.env
VITE_API_URL=http://localhost:4000
```

---

### 3. Install dependencies

**Backend:**

```bash
cd server
npm install
```

**Frontend:**

```bash
cd client
npm install
```

---

### 4. Seed the admin user *(first-time setup)*

```bash
cd server
npx ts-node seedAdmin.ts
```

---

### 5. Start the development servers

**Backend** (runs on `http://localhost:4000`):

```bash
cd server
npm run dev
# Uses nodemon + ts-node for hot-reload
```

**Frontend** (runs on `http://localhost:5173`):

```bash
cd client
npm run dev
```

> Open **http://localhost:5173** in your browser.

---

## 📦 Available Scripts

### Server (`/server`)

| Command           | Description                              |
|-------------------|------------------------------------------|
| `npm run dev`     | Start dev server with nodemon + ts-node  |
| `npm run build`   | Compile TypeScript → `dist/`             |
| `npm start`       | Run compiled production build            |

### Client (`/client`)

| Command           | Description                              |
|-------------------|------------------------------------------|
| `npm run dev`     | Start Vite dev server                    |
| `npm run build`   | Build production bundle → `dist/`        |
| `npm run preview` | Preview production build locally         |
| `npm run lint`    | Run ESLint                               |

---

## 🐳 Docker Setup

### Local development (includes local MongoDB)

```bash
# From project root
docker compose up --build
```

| Service  | URL                    |
|----------|------------------------|
| Frontend | http://localhost:80    |
| Backend  | http://localhost:3100  |
| MongoDB  | mongodb://localhost:27017 |

---

### Production (pre-built images from Docker Hub)

```bash
# Requires DOCKERHUB_USERNAME, MONGODB_URI, JWT_SECRET in environment
docker compose -f docker-compose.prod.yml up -d
```

---

## 🌐 API Endpoints

All routes are prefixed with `/api`.

### Auth / Users — `/api/user`

| Method | Path              | Description              | Auth |
|--------|-------------------|--------------------------|------|
| POST   | `/register`       | Register a new user      | ❌   |
| POST   | `/login`          | Login, returns JWT token | ❌   |
| GET    | `/profile`        | Get current user profile | ✅   |

### Products — `/api/product`

| Method | Path       | Description             | Auth    |
|--------|------------|-------------------------|---------|
| GET    | `/`        | Get all products        | ❌      |
| GET    | `/:id`     | Get product by ID       | ❌      |
| POST   | `/`        | Create product (admin)  | ✅ Admin |
| PUT    | `/:id`     | Update product (admin)  | ✅ Admin |
| DELETE | `/:id`     | Delete product (admin)  | ✅ Admin |

### Cart — `/api/cart`

| Method | Path       | Description             | Auth |
|--------|------------|-------------------------|------|
| GET    | `/`        | Get user's cart         | ✅   |
| POST   | `/`        | Add item to cart        | ✅   |
| PUT    | `/:id`     | Update cart item qty    | ✅   |
| DELETE | `/:id`     | Remove item from cart   | ✅   |

### Orders — `/api/order`

| Method | Path       | Description             | Auth    |
|--------|------------|-------------------------|---------|
| GET    | `/`        | Get user's orders       | ✅      |
| POST   | `/`        | Place a new order       | ✅      |
| GET    | `/all`     | Get all orders (admin)  | ✅ Admin |
| PUT    | `/:id`     | Update order status     | ✅ Admin |

### Addresses — `/api/address`

| Method | Path       | Description             | Auth |
|--------|------------|-------------------------|------|
| GET    | `/`        | Get saved addresses     | ✅   |
| POST   | `/`        | Add new address         | ✅   |
| DELETE | `/:id`     | Remove an address       | ✅   |

### Health Check

```
GET /api/health
→ { "success": true, "message": "Grocery Delivery API is running" }
```

---

## 🚢 Deployment

### Vercel (Serverless)

The `vercel.json` at project root configures:
- **Backend** → `server/server.ts` via `@vercel/node`
- **Frontend** → `client/` static build via `@vercel/static-build`
- API calls proxied via rewrites: `/api/*` → serverless function

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from project root
vercel
```

Set the following **Environment Variables** in the Vercel dashboard:

```
MONGODB_URI=...
JWT_SECRET=...
NODE_ENV=production
```

---

### EC2 / VPS

Use the provided setup script:

```bash
chmod +x setup_ec2.sh
./setup_ec2.sh
```

Then deploy with Docker Compose:

```bash
docker compose -f docker-compose.prod.yml up -d
```

---

## 🔄 CI/CD Pipeline (GitHub Actions)

Located at `.github/workflows/ci.yml`. Triggers on every push / PR to `main` and `develop`.

| Job                  | Steps                                        |
|----------------------|----------------------------------------------|
| **Server CI**        | Install → TypeScript type-check → Build      |
| **Client CI**        | Install → ESLint → Vite production build     |
| **Docker Smoke Test**| Build server & client Docker images (no push)|

---

## 📝 Environment Variables Reference

| Variable            | Location        | Required | Description                        |
|---------------------|-----------------|----------|------------------------------------|
| `MONGODB_URI`       | `server/.env`   | ✅       | MongoDB connection string           |
| `JWT_SECRET`        | `server/.env`   | ✅       | Secret key for signing JWTs        |
| `PORT`              | `server/.env`   | ✅       | Server port (default: `4000`)      |
| `NODE_ENV`          | `server/.env`   | ✅       | `development` or `production`       |
| `VITE_API_URL`      | `client/.env`   | ✅       | Backend base URL for Axios calls   |
| `DOCKERHUB_USERNAME`| Docker / CI env | ⚠️       | Required for production Docker deploy|
| `IMAGE_TAG`         | Docker / CI env | ❌       | Docker image tag (defaults to `latest`)|

---

## 📄 License

ISC
