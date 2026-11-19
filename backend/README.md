# VelgGarage Backend API

A Node.js + Express REST API for the VelgGarage Premium Automotive Wheel Catalog PWA, backed by Supabase PostgreSQL.

## Setup

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env
# Edit .env with your Supabase credentials

# 3. Run the database schema & seed in Supabase SQL editor
#    backend/database/schema.sql  → create tables
#    backend/database/seed.sql    → insert data

# 4. Start the server
npm start

# Development (auto-restart)
npm run dev
```

> **Mock mode**: If `SUPABASE_URL` / `SUPABASE_ANON_KEY` are not set, the API automatically serves hardcoded mock data with the same 10 products and 6 brands. All endpoints remain fully functional.

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | Health check |
| GET | `/api/products` | All products (filterable) |
| GET | `/api/products/search?q=` | Full-text search |
| GET | `/api/products/brand/:brandId` | Products by brand |
| GET | `/api/products/category/:category` | Products by category |
| GET | `/api/products/:id` | Single product with brand + specs |
| GET | `/api/brands` | All brands |
| GET | `/api/brands/:id` | Single brand with its products |
| GET | `/api/categories` | Distinct category list |

### Query parameters for `GET /api/products`

| Param | Example | Description |
|-------|---------|-------------|
| `brand` | `?brand=rays` | Filter by brand slug or id |
| `category` | `?category=Sport` | Filter by category |
| `diameter` | `?diameter=18` | Filter by wheel diameter |
| `q` | `?q=TE37` | Search name/model/category |
| `sort` | `?sort=name_asc` | Sort: `name_asc`, `name_desc`, `newest`, `featured` |

## Response Format

**List:**
```json
{ "success": true, "data": [...], "count": 10 }
```

**Single:**
```json
{
  "success": true,
  "data": {
    "id": 3,
    "name": "RAYS Volk Racing TE37",
    "slug": "rays-volk-te37",
    "model": "Volk Racing TE37",
    "category": "Sport",
    "construction_type": "Monoblock",
    "material": "Forged aluminum",
    "is_featured": true,
    "image_url": "/assets/wheels/rays-volk-te37.jpg",
    "brand": { "id": 2, "name": "RAYS", "slug": "rays" },
    "specifications": [
      { "id": 4, "diameter": 15, "width": 8, "pcd": "4x100", "offset_range": "+35", "finish": "Bronze" },
      { "id": 5, "diameter": 17, "width": 9, "pcd": "5x114.3", "offset_range": "+35", "finish": "Silver" },
      { "id": 6, "diameter": 18, "width": 9.5, "pcd": "5x114.3", "offset_range": "+38", "finish": "Black" }
    ]
  }
}
```

**Error:**
```json
{ "success": false, "error": "Product not found" }
```

## Database

Run `database/schema.sql` first, then `database/seed.sql` in the Supabase SQL editor.
