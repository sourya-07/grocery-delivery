# Class Diagram — Grocery Delivery Web Application

## Overview
This diagram represents the data models, their attributes, methods, and relationships used across the backend (Mongoose schemas) and frontend (React contexts & services).

---

```mermaid
classDiagram
    class User {
        +String _id
        +String name
        +String email
        +String password
        +String role
        +Object cartData
        +register()
        +login()
        +getCart()
        +updateCart()
    }

    class Product {
        +String _id
        +String name
        +String category
        +Number price
        +Number offerPrice
        +String[] image
        +String[] description
        +Boolean inStock
        +addProduct()
        +updateProduct()
        +removeProduct()
        +listProducts()
    }

    class Order {
        +String _id
        +ObjectId userId
        +OrderItem[] items
        +Object address
        +Number amount
        +String status
        +String paymentMethod
        +Date date
        +placeOrder()
        +getUserOrders()
        +getAllOrders()
        +updateStatus()
    }

    class OrderItem {
        +ObjectId productId
        +String name
        +Number price
        +Number quantity
    }

    class Address {
        +String _id
        +ObjectId userId
        +String firstName
        +String lastName
        +String email
        +String street
        +String city
        +String state
        +String zipcode
        +String country
        +String phone
        +addAddress()
        +getAddresses()
    }

    class AuthMiddleware {
        +verifyToken(req, res, next)
        +isAdmin(req, res, next)
    }

    class AuthContext {
        +String token
        +Object user
        +login(email, password)
        +register(name, email, password)
        +logout()
    }

    class CartContext {
        +Object cartItems
        +Number cartTotal
        +addToCart(productId)
        +updateQuantity(productId, qty)
        +removeFromCart(productId)
        +clearCart()
    }

    %% Relationships
    User "1" --> "0..*" Order : places
    User "1" --> "0..*" Address : has
    User "1" --> "1" CartContext : manages cart via
    Order "1" --> "1..*" OrderItem : contains
    OrderItem "0..*" --> "1" Product : references
    Order "1" --> "1" Address : delivered to
    AuthMiddleware ..> User : authenticates
    AuthContext ..> User : manages session for
```

---

## Relationships Summary

| Relationship | Type | Description |
|---|---|---|
| User → Order | One-to-Many | A user can place multiple orders |
| User → Address | One-to-Many | A user can save multiple delivery addresses |
| Order → OrderItem | One-to-Many | Each order contains one or more items |
| OrderItem → Product | Many-to-One | Each order item references a product |
| Order → Address | One-to-One | Each order is linked to one delivery address |
| AuthMiddleware → User | Dependency | Middleware verifies JWT to identify the user |
| AuthContext → User | Dependency | Frontend context manages login state for a user |
| User → CartContext | Association | Each user's cart is managed via CartContext |
