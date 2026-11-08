# Zenith | Cinematic Essentials

<p align="center">
  <img src="./assets/logo-navbar.png" alt="Zenith Logo" width="300" />
</p>

> **Zenith** is a full-stack, single-page e-commerce anthology designed around a "silent luxury" and archival aesthetic. Built using a decoupled architecture, Zenith pairs a high-performance Vanilla JavaScript frontend with an enterprise-grade Java Spring Boot REST backend.

---

## 🌟 Key Features

* **Cinematic Minimalist UI:** Built with Vanilla JavaScript modules and Tailwind CSS for hardware-accelerated animations, scroll-reveals, and high-fidelity rendering without heavy frontend frameworks.
* **Stateless JWT Authentication:** Secure role-based access control (`CUSTOMER` and `ADMIN`) using JSON Web Tokens.
* **Dynamic Gallery & Catalog:** Real-time search, sorting, detailed product views, and category filtering.
* **Integrated Merchant Checkout:** Seamless payment workflows using the Razorpay SDK alongside traditional Cash on Delivery options.
* **Cloud-Native Media Storage:** Integrated with Cloudinary API for optimized, instant image delivery and dynamic uploads.
* **Seller / Admin Dashboard:** Administrative control panel for inventory metrics, real-time sales reporting (Chart.js integration), and order fulfillment tracking.
* **Single-Page Application (SPA) Engine:** Custom lightweight routing logic managing dynamic DOM transitions without full page reloads.

---

## 🛠️ Technology Stack

### Backend
* **Language & Framework:** Java 17+, Spring Boot
* **Security:** Spring Security, Stateless JWT
* **Persistence & DB:** Spring Data JPA, Hibernate, MySQL Database
* **Media Management:** Cloudinary Java SDK
* **Build Tool:** Maven

### Frontend
* **Core Technology:** Vanilla JavaScript (ES6 Modules)
* **Styling:** Tailwind CSS, Custom CSS Variables & Animations
* **SDKs & Libraries:** Razorpay Checkout SDK, Chart.js

---

## 🏗️ Architecture & Project Structure

Zenith follows a strictly decoupled layered architecture.

```text
Zenith/
├── backend/
│   └── src/main/java/com/zenith/
│       ├── config/          # Spring Security, CORS, JWT Filters
│       ├── controllers/     # REST Endpoints (Auth, Products, Cart, Orders)
│       ├── dto/             # Data Transfer Objects
│       ├── models/          # JPA Entities (User, Product, Order, OrderItem)
│       ├── repositories/    # Spring Data JPA interfaces
│       └── services/        # Business logic & payment processing
│
└── frontend/
    ├── index.html           # Single entry point
    ├── css/
    │   └── style.css        # Global luxury styles & media queries
    ├── js/
    │   ├── app.js           # Main application controller & router
    │   └── api.js           # Centralized fetch client with Auth headers
    └── pages/               # Modular view renderers
        ├── home.js
        ├── shop.js
        ├── cart.js
        ├── checkout.js
        ├── sellerDashboard.js
        └── legal.js
```

---

## 🚀 Getting Started

### Prerequisites
* Java Development Kit (JDK 17 or higher)
* MySQL Server
* Maven
* Node.js / Live Server (optional, for frontend static serving)

---

### Backend Setup

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/your-username/zenith-ecommerce.git
   cd zenith-ecommerce/backend
   ```

2. **Configure Database & Secrets:**
   Update `src/main/resources/application.properties` with your database and Cloudinary credentials:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/zenith_db?createDatabaseIfNotExist=true
   spring.datasource.username=YOUR_DB_USER
   spring.datasource.password=YOUR_DB_PASSWORD
   spring.jpa.hibernate.ddl-auto=update

   # JWT Configuration
   jwt.secret=YOUR_64_CHARACTER_SECRET_KEY

   # Cloudinary Setup
   cloudinary.cloud_name=YOUR_CLOUD_NAME
   cloudinary.api_key=YOUR_API_KEY
   cloudinary.api_secret=YOUR_API_SECRET
   ```

3. **Run the Backend:**
   ```bash
   ./mvnw spring-boot:run
   ```
   The backend API will run at `http://localhost:8080/api`.

---

### Frontend Setup

1. **Navigate to Frontend Directory:**
   ```bash
   cd ../frontend
   ```

2. **Run via Live Server:**
   Launch `index.html` using VS Code's **Live Server** plugin or any static web server running on `http://127.0.0.1:5500`.

---

## 🔒 Known Limitations & Roadmap

* **Mobile Optimizations:** While fully responsive, complex archival grids are best experienced on desktop displays.
* **External Image Assets:** Product media utilizes external CDN endpoints; broken links may occur if remote assets are modified.
* **Social Proofing:** Customer reviews and rating modules are currently planned for upcoming releases.
* **Real-Time Logistics:** Order status updates reflect database milestones rather than live GPS carrier integration.

---

## 📄 License

This project is created for educational and archival portfolio purposes. All proprietary implementations remain the intellectual property of the project developer.
