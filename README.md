# Malagu Cosmetics

Malagu Cosmetics is a modern, full-stack e-commerce catalog web application built to deliver a seamless beauty shopping experience with dynamic multi-level filtering, persistent category states, secure Google OAuth & JWT authentication, and smart cart session handling.

---

## How Malagu Cosmetics Works

- **Shoppers (Frontend UI):** Users explore a curated beauty catalog, filter products through persistent main categories (_Eyes, Face, Lips_) and subcategories (_Eyeliner, Lip Oil, etc._), sort by price, and manage their shopping session.
- **Authentication, JWT & Cart Sync:** Users authenticate securely via Google Cloud OAuth, which issues a secure **JWT (JSON Web Token)** for stateless API authorization. When a guest logs in, their temporary local cart seamlessly merges into their user account's active database cart (or initializes a new one if none exists).
- **Backend & Database (PHP / MySQL):** Powers product data retrieval, catalog queries, JWT validation middleware, user sessions, and cart storage.

---

## System Structure

<pre>
malagu-cosmetics/
├── 📁 front-end/        # React & TypeScript client application
│   ├── 📁 src/
│   │   ├── 📁 api/      # Axios client configurations & interceptors
│   │   ├── 📁 layouts/  # Structural page layouts & wrappers
│   │   ├── 📁 pages/    # Route views 
│   │   ├── 📁 services/ # API service abstractions
│   │   ├── 📁 store/    # Global state management
│   │   ├── 📁 utils/    # Helper utilities 
│   │   ├── App.tsx      # Main application router
│   │   └── main.tsx     # App entry point
│   └── index.html       # HTML with SEO meta tags & favicon
└── backend-api/         # PHP / MySQL backend endpoints 
</pre>

---

## Key Features

### Catalog & Dynamic Filtering

- **Persistent Main Categories:** Main category filter pills remain active and highlighted even when granular subcategories are selected, providing clear structural context.
- **Dynamic Price Sorting:** Single-selection dropdown sorting for _Featured_, _Price: Low to High_, and _Price: High to Low_.
- **Unified Product Cards:** Restructured layout placing pricing alongside subcategories and titles for a clean, retail-grade presentation.

### Smart Cart & Secure Authentication

- **Guest-to-User Cart Migration:** Automatically merges local guest cart items into the user's active database cart upon successful login, preventing lost selections.
- **Google OAuth & JWT Protection:** Configured via Google Cloud Console under the "Malagu Cosmetics" app identity, paired with JWT-secured API endpoints for safe, authenticated transactions and session handling.

## Tech Stack & Tools

- **Frontend:** React (Vite), TypeScript, Tailwind CSS, React Router DOM, Motion (Framer Motion)
- **Backend & Database:** PHP, MySQL, Firebase JWT (`firebase/php-jwt`)
- **Tools & Protocols:** Git, NPM, Vite, Composer, Google Cloud Console (OAuth)
