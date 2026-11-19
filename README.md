# 🏁 VELGGARAGE — Premium Automotive Wheel Catalog PWA

> **REAL WHEELS. REAL BRANDS. PURE STYLE.**

VelgGarage is a production-quality **Progressive Web Application (PWA)** developed as an individual final project for **Praktikum Pengembangan dan Pemrograman Berbasis Platform (PPB) 2026**.

The application serves as a curated catalog of authentic aftermarket automotive wheels from world-renowned manufacturers, engineered with a luxury minimalist black-and-white editorial aesthetic (`#080808` dark theme).

---

## 📋 Project Information

- **Student / Developer:** Kevin Novan
- **Course:** Praktikum Pengembangan dan Pemrograman Berbasis Platform (PPB) 2026
- **Application Type:** Progressive Web Application (PWA) & Full-Stack REST Catalog
- **Platform Compatibility:** Mobile (360px–430px), Tablet, Laptop (1366px), Desktop (1920px+)

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | JavaScript (ES6+), React 18, Vite 5, React Router DOM v6, Tailwind CSS v3, Framer Motion, Lucide React, Axios |
| **PWA Engine** | Vite Plugin PWA (`vite-plugin-pwa`), Workbox (`injectManifest`), Web App Manifest, Service Worker |
| **Backend** | Node.js, Express.js, REST API architecture (Routes, Controllers, Services, Middleware) |
| **Database** | Supabase (PostgreSQL) with relational schema + automated fallback mock mode |
| **Hosting & Deploy** | Vercel (Frontend), Render (Backend), Supabase (Database) |

---

## 📱 Core Features

1. **Editorial Landing Page (`/`)**: Full-screen hero section, featured wheels collection, authentic brand highlights, wheel type taxonomy, and dynamic editorial banner.
2. **Wheels Catalog (`/wheels`)**: Responsive multi-column grid with live search, brand filtering, diameter filtering, construction type filtering, and sorting (name, newest, featured).
3. **Brand Directory (`/brands`)**: Complete list of authentic manufacturers (BBS, RAYS, Enkei, WORK Wheels, OZ Racing, ADVAN Racing) with country, heritage, and website links.
4. **Brand Collection View (`/brands/:id`)**: Dedicated brand showcase displaying verified manufacturer details and corresponding wheels.
5. **Product Detail Page (`/wheels/:id`)**: High-resolution photography/vector renders, specifications table (diameter, width, PCD, offset, finish, material), official manufacturer sources, and related wheels.
6. **Favorites / Wishlist (`/favorites`)**: LocalStorage persistence, quick remove, toggle from any card or detail view, and empty state CTA.
7. **About & Academic Profile (`/about`)**: Full project documentation, academic compliance, developer credentials, and technical architecture specifications.
8. **Fixed Mobile Bottom Navigation**: Bottom navigation bar designed for mobile touch ergonomics with active state indicators (Home, Wheels, Brands, Favorites, About).
9. **Progressive Web Application (PWA)**:
   - Web App Manifest with standalone display mode.
   - Offline fallback page (`/offline`) and cached static assets.
   - Network-First caching strategy for catalog data.
   - Installable prompt on Android, iOS, and Chromium desktop.

---

## 🗄️ Database Architecture (Supabase PostgreSQL)

The database schema utilizes three relational tables with cascading foreign keys and indexes:

```
[ brands ]
    ├── id (PK, SERIAL)
    ├── name, slug, country, founded_year, website_url, logo_url, description
    │
    └──< [ products ] (FK: brand_id)
             ├── id (PK, SERIAL)
             ├── name, slug, model, category, construction_type, material
             ├── description, image_url, image_source_url, manufacturer_source_url, is_featured
             │
             └──< [ product_specifications ] (FK: product_id)
                      ├── id (PK, SERIAL)
                      ├── diameter, width, pcd, offset_range, finish, weight_kg, load_rating
```

SQL scripts are provided in `backend/database/`:
- `schema.sql`: Table definitions, foreign keys, and indexes.
- `seed.sql`: Authentic seed dataset featuring 6 global manufacturers and 10 verified wheel models.

---

## 🌐 REST API Endpoints

Base URL: `http://localhost:5000` (or production backend URL)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/health` | API health check status |
| `GET` | `/api/products` | Get all wheels (supports `?brand`, `?category`, `?diameter`, `?sort`, `?q`) |
| `GET` | `/api/products/search?q={keyword}` | Full-text search by name, model, brand |
| `GET` | `/api/products/brand/:brandId` | Filter wheels by brand ID |
| `GET` | `/api/products/category/:category` | Filter wheels by category |
| `GET` | `/api/products/:id` | Get single wheel with joined specifications and brand info |
| `GET` | `/api/brands` | Get all manufacturers with product counts |
| `GET` | `/api/brands/:id` | Get single manufacturer with its product catalog |
| `GET` | `/api/categories` | Get distinct categories list |

*Note: The backend features an intelligent fallback mock mode (`src/config/mockData.js`). If Supabase credentials are not provided in `.env`, the API automatically serves authentic mock data without breaking.*

---

## 🚀 Getting Started Locally

### Prerequisites
- Node.js (v18.0.0 or higher)
- npm (v9.0.0 or higher)

### 1. Clone the Repository
```bash
git clone https://github.com/kevinnovan/VelgGarage.git
cd VelgGarage
```

### 2. Setup & Run Backend
```bash
cd backend
npm install
cp .env.example .env
# Optional: fill SUPABASE_URL & SUPABASE_ANON_KEY in .env
npm run dev
# Backend runs at http://localhost:5000
```

### 3. Setup & Run Frontend
```bash
cd ../frontend
npm install
cp .env.example .env
npm run dev
# Frontend runs at http://localhost:5173
```

### 4. Build for Production
```bash
# Frontend production build (generates PWA service worker in dist/)
cd frontend
npm run build
npm run preview
```

---

## 📦 Project Directory Structure

```
VelgGarage/
├── backend/
│   ├── database/
│   │   ├── schema.sql           # PostgreSQL table definitions
│   │   └── seed.sql             # Authentic wheel & brand records
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.js      # Supabase client initialization
│   │   │   └── mockData.js      # Reliable fallback dataset
│   │   ├── controllers/
│   │   │   ├── brandController.js
│   │   │   ├── categoryController.js
│   │   │   └── productController.js
│   │   ├── middleware/
│   │   │   └── errorHandler.js
│   │   ├── routes/
│   │   │   ├── brands.js
│   │   │   ├── categories.js
│   │   │   └── products.js
│   │   ├── services/
│   │   │   ├── brandService.js
│   │   │   └── productService.js
│   │   └── server.js            # Express app entry point
│   ├── .env.example
│   ├── package.json
│   └── README.md
│
├── frontend/
│   ├── public/
│   │   ├── assets/
│   │   │   ├── brands/          # Vector manufacturer logos
│   │   │   └── wheels/          # Authentic spoke vector renders & jpg
│   │   ├── icons/               # PWA icons (192x192, 512x512)
│   │   ├── favicon.ico
│   │   └── manifest.webmanifest
│   ├── src/
│   │   ├── components/
│   │   │   ├── BottomNav.jsx    # Required mobile navigation bar
│   │   │   ├── BrandCard.jsx
│   │   │   ├── FilterPanel.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── HeroSection.jsx
│   │   │   ├── LoadingSkeleton.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── ProductCard.jsx
│   │   │   └── SearchBar.jsx
│   │   ├── context/
│   │   │   └── FavoritesContext.jsx
│   │   ├── hooks/
│   │   │   ├── useBrands.js
│   │   │   ├── useFavorites.js
│   │   │   └── useProducts.js
│   │   ├── layouts/
│   │   │   └── MainLayout.jsx
│   │   ├── pages/
│   │   │   ├── About.jsx
│   │   │   ├── BrandDetail.jsx
│   │   │   ├── Brands.jsx
│   │   │   ├── Favorites.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── Offline.jsx
│   │   │   ├── WheelDetail.jsx
│   │   │   └── Wheels.jsx
│   │   ├── services/
│   │   │   └── api.js           # Axios API service
│   │   ├── utils/
│   │   │   └── helpers.js
│   │   ├── App.jsx
│   │   ├── index.css
│   │   ├── main.jsx
│   │   └── sw.js                # Workbox custom service worker
│   ├── index.html
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## 🎯 Academic Requirements Verification Checklist

| Requirement | Implementation Details | Status |
|---|---|:---:|
| **Pure JavaScript (No TypeScript)** | Only `.js` and `.jsx` used throughout backend and frontend | ✅ Passed |
| **Progressive Web Application (PWA)** | Web App Manifest, Service Worker (`sw.js`), installable, offline page | ✅ Passed |
| **Self-Developed REST API** | Node.js + Express REST API with full CRUD/search/filter architecture | ✅ Passed |
| **Fixed Mobile Bottom Navigation** | Fixed responsive bottom navigation with active Lucide icons on mobile | ✅ Passed |
| **At least 5 Pages** | 7 pages implemented: Home, Wheels, Brands, Detail, BrandDetail, Favorites, About | ✅ Passed |
| **At least 2 Main List Pages** | Wheels Catalog (`/wheels`) and Brands Directory (`/brands`) | ✅ Passed |
| **Clickable Wheel Detail Pages** | Every product card routes to `/wheels/:id` with complete specifications | ✅ Passed |
| **Clickable Brand Collection Pages** | Every brand card routes to `/brands/:id` showing manufacturer products | ✅ Passed |
| **About / Profile Page** | Comprehensive academic profile, tech stack, and documentation at `/about` | ✅ Passed |
| **Frontend Consumes Own API** | Axios client in `frontend/src/services/api.js` queries Express backend | ✅ Passed |
| **Authentic Wheel Data** | 10 verified real wheel products from BBS, RAYS, Enkei, WORK, OZ, ADVAN | ✅ Passed |
| **No Fake Checkout/E-commerce** | Strictly a product catalog; official distributor referral instead of fake cart | ✅ Passed |
| **GitHub Ready** | Clean directory structure, `.gitignore`, `.env.example`, build passed | ✅ Passed |

---

## 📄 License & Academic Integrity

This project is developed for educational and academic evaluation purposes in **Praktikum Pengembangan dan Pemrograman Berbasis Platform (PPB) 2026**. All wheel and brand trademarks belong to their respective manufacturers.
