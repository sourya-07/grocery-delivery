# Sequence Diagrams — Grocery Delivery Web Application

## Overview
These diagrams illustrate the step-by-step interactions between the **Client (React)**, **Server (Express API)**, **Middleware (JWT Auth)**, and **Database (MongoDB)** for the core application flows.

---

## 1. User Registration

```mermaid
sequenceDiagram
    actor Customer
    participant React as React Client
    participant API as Express Server
    participant DB as MongoDB

    Customer->>React: Fill registration form (name, email, password)
    React->>API: POST /api/user/register {name, email, password}
    API->>API: Validate input fields
    API->>DB: Check if email already exists
    DB-->>API: Result (exists / not found)
    alt Email already registered
        API-->>React: 409 Conflict — "User already exists"
        React-->>Customer: Show error message
    else New user
        API->>API: Hash password with bcrypt
        API->>DB: Save new User document
        DB-->>API: User created
        API->>API: Generate JWT token
        API-->>React: 201 Created — {token, user}
        React->>React: Store token in localStorage
        React-->>Customer: Redirect to Home Page
    end
```

---

## 2. User Login

```mermaid
sequenceDiagram
    actor Customer
    participant React as React Client
    participant API as Express Server
    participant DB as MongoDB

    Customer->>React: Enter email & password
    React->>API: POST /api/user/login {email, password}
    API->>DB: Find user by email
    DB-->>API: User document (or null)
    alt User not found
        API-->>React: 401 Unauthorized — "Invalid credentials"
        React-->>Customer: Show error
    else User found
        API->>API: Compare password with bcrypt
        alt Password mismatch
            API-->>React: 401 Unauthorized — "Invalid credentials"
            React-->>Customer: Show error
        else Password match
            API->>API: Generate JWT token
            API-->>React: 200 OK — {token, user}
            React->>React: Store token in localStorage
            React-->>Customer: Redirect to Home / Dashboard
        end
    end
```

---

## 3. Browse & Add to Cart

```mermaid
sequenceDiagram
    actor Customer
    participant React as React Client
    participant API as Express Server
    participant Auth as JWT Middleware
    participant DB as MongoDB

    Customer->>React: Open Products Page
    React->>API: GET /api/product/list
    API->>DB: Fetch all products
    DB-->>API: Product list
    API-->>React: 200 OK — products[]
    React-->>Customer: Display product cards

    Customer->>React: Click "Add to Cart" on a product
    React->>API: POST /api/cart/update {productId, qty} + JWT header
    API->>Auth: Verify JWT token
    Auth-->>API: userId extracted
    API->>DB: Update user's cartData
    DB-->>API: Cart updated
    API-->>React: 200 OK — updated cart
    React->>React: Update CartContext state
    React-->>Customer: Show updated cart badge
```

---

## 4. Checkout & Place Order

```mermaid
sequenceDiagram
    actor Customer
    participant React as React Client
    participant API as Express Server
    participant Auth as JWT Middleware
    participant DB as MongoDB

    Customer->>React: Go to Cart → Click "Checkout"
    React-->>Customer: Show address selection / add form

    Customer->>React: Add new delivery address
    React->>API: POST /api/address/add {address fields} + JWT
    API->>Auth: Verify JWT
    Auth-->>API: userId
    API->>DB: Save Address document
    DB-->>API: Address saved
    API-->>React: 200 OK — address

    Customer->>React: Select address → Click "Place Order"
    React->>API: POST /api/order/place {items, address, amount, paymentMethod} + JWT
    API->>Auth: Verify JWT
    Auth-->>API: userId
    API->>DB: Create Order document
    DB-->>API: Order created
    API->>DB: Clear user's cartData
    DB-->>API: Cart cleared
    API-->>React: 201 Created — order confirmation
    React->>React: Clear CartContext
    React-->>Customer: Show order confirmation page
```

---

## 5. Admin — Manage Products

```mermaid
sequenceDiagram
    actor Admin
    participant React as React Client
    participant API as Express Server
    participant Auth as JWT Middleware
    participant DB as MongoDB

    Admin->>React: Navigate to Admin Dashboard
    React->>API: GET /api/product/list
    API->>DB: Fetch all products
    DB-->>API: Product list
    API-->>React: 200 OK — products[]
    React-->>Admin: Display product management table

    Admin->>React: Fill "Add Product" form & submit
    React->>API: POST /api/product/add {product data} + JWT
    API->>Auth: Verify JWT + check admin role
    Auth-->>API: Admin verified
    API->>DB: Insert new Product document
    DB-->>API: Product saved
    API-->>React: 201 Created — product
    React-->>Admin: Show success & refresh list

    Admin->>React: Click "Delete" on a product
    React->>API: DELETE /api/product/remove {productId} + JWT
    API->>Auth: Verify JWT + check admin role
    Auth-->>API: Admin verified
    API->>DB: Delete Product document
    DB-->>API: Product deleted
    API-->>React: 200 OK
    React-->>Admin: Remove product from list
```

---

## 6. Admin — Update Order Status

```mermaid
sequenceDiagram
    actor Admin
    participant React as React Client
    participant API as Express Server
    participant Auth as JWT Middleware
    participant DB as MongoDB

    Admin->>React: Navigate to Orders Management
    React->>API: GET /api/order/all + JWT
    API->>Auth: Verify JWT + admin role
    Auth-->>API: Admin verified
    API->>DB: Fetch all orders
    DB-->>API: Orders list
    API-->>React: 200 OK — orders[]
    React-->>Admin: Display orders table

    Admin->>React: Change status dropdown (e.g., "Shipped")
    React->>API: PUT /api/order/status {orderId, status} + JWT
    API->>Auth: Verify JWT + admin role
    Auth-->>API: Admin verified
    API->>DB: Update order status field
    DB-->>API: Order updated
    API-->>React: 200 OK — updated order
    React-->>Admin: Reflect new status in UI
```
