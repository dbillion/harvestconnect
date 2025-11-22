# HarvestConnect - C4 Model Architecture

**Date:** November 22, 2025  
**Version:** 1.0  
**Status:** Phase 5 Complete - Authentication & Dynamic Pages

---

## 📋 Table of Contents

1. [System Context (C1)](#system-context-c1)
2. [Container Diagram (C2)](#container-diagram-c2)
3. [Component Diagram (C3)](#component-diagram-c3)
4. [Code Diagram (C4)](#code-diagram-c4)
5. [Data Flow](#data-flow)
6. [Technology Stack](#technology-stack)

---

## 🌍 System Context (C1)

High-level overview of HarvestConnect and its external systems.

```
┌─────────────────────────────────────────────────────────────┐
│                                                              │
│                    HarvestConnect System                     │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │                                                      │   │
│  │   E-commerce Platform for Local Artisans,           │   │
│  │   Farmers, Traders & Communities                     │   │
│  │                                                      │   │
│  │   - User Registration & Authentication              │   │
│  │   - Product Marketplace                             │   │
│  │   - Artist Profiles                                 │   │
│  │   - Community Hub                                   │   │
│  │   - Order Management                                │   │
│  │                                                      │   │
│  └──────────────────────────────────────────────────────┘   │
│                          ▲                                   │
│                          │                                   │
└──────────────────────────┼───────────────────────────────────┘
                           │
                ┌──────────┴──────────┬────────────────┐
                │                     │                │
                ▼                     ▼                ▼
            ┌────────┐          ┌──────────┐    ┌──────────┐
            │  User  │          │ Stripe   │    │  Email   │
            │Browser │          │ Payment  │    │ Service  │
            │        │          │          │    │          │
            └────────┘          └──────────┘    └──────────┘
```

### Actors:

| Actor | Description |
|-------|-------------|
| **User/Buyer** | Browses products, manages cart, places orders |
| **Seller/Artisan** | Creates products, manages inventory, fulfills orders |
| **Administrator** | Manages platform, users, content |
| **Payment Provider** | Processes payments (Stripe) |
| **Email Service** | Sends transactional emails |

---

## 📦 Container Diagram (C2)

Breakdown of major containers and their interactions.

```
┌────────────────────────────────────────────────────────────────────┐
│                         Internet                                   │
└────────────────────────────────────────────────────────────────────┘
                               │
                ┌──────────────┴──────────────┐
                │                             │
                ▼                             ▼
        ┌──────────────────┐        ┌──────────────────┐
        │   Web Browser    │        │   Mobile Browser │
        │                  │        │                  │
        │ - React/Next.js  │        │ - Responsive UI  │
        │ - TypeScript     │        │ - Same as Web    │
        │                  │        │                  │
        └────────┬─────────┘        └────────┬─────────┘
                 │                           │
                 └───────────────┬───────────┘
                                 │ HTTPS
                                 ▼
        ┌────────────────────────────────────────────────┐
        │          API Gateway / Load Balancer           │
        │                                                │
        │  - Route management                            │
        │  - Rate limiting                               │
        │  - CORS handling                               │
        └────────┬───────────────────────────────────────┘
                 │
        ┌────────┴────────────────────┐
        │                             │
        ▼                             ▼
┌──────────────────────┐    ┌──────────────────────┐
│  Frontend Container  │    │  Backend Container   │
│  (Next.js App)       │    │  (Django REST API)   │
│                      │    │                      │
│ - UI Pages           │    │ - REST Endpoints     │
│ - Client-side Auth   │    │ - JWT Auth           │
│ - State Management   │    │ - Business Logic     │
│ - API Client         │    │ - Database Access    │
│                      │    │                      │
└──────────────────────┘    └────────┬─────────────┘
                                     │
                    ┌────────────────┼────────────────┐
                    │                │                │
                    ▼                ▼                ▼
        ┌─────────────────┐  ┌──────────────┐  ┌──────────────┐
        │   Database      │  │   Cache      │  │   Storage    │
        │   (SQLite/      │  │   (Redis)    │  │   (S3/File   │
        │   PostgreSQL)   │  │              │  │   System)    │
        │                 │  │              │  │              │
        └─────────────────┘  └──────────────┘  └──────────────┘
```

### Containers:

| Container | Technology | Purpose |
|-----------|-----------|---------|
| **Frontend** | Next.js 16 + TypeScript | User interface, client-side routing |
| **Backend API** | Django 4.2 + DRF | REST API, business logic, authentication |
| **Database** | SQLite/PostgreSQL | Data persistence |
| **Cache** | Redis (optional) | Performance optimization |
| **Storage** | S3/File System | Media files, images |

---

## 🔧 Component Diagram (C3)

Detailed breakdown of major components within containers.

### Frontend Components:

```
┌─────────────────────────────────────────────────────────────┐
│                    Next.js Frontend                          │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │              Pages & Routing                           │ │
│  ├────────────────────────────────────────────────────────┤ │
│  │ • /                      (Homepage)                    │ │
│  │ • /auth/login            (User Login)                  │ │
│  │ • /auth/register         (User Registration)           │ │
│  │ • /marketplace           (Product Listing)             │ │
│  │ • /marketplace/[id]      (Product Details)             │ │
│  │ • /tradesmen             (Artist Listing)              │ │
│  │ • /tradesmen/[id]        (Artist Profile)              │ │
│  │ • /community-hub         (Blog Posts)                  │ │
│  │ • /for-sellers           (Seller Dashboard)            │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │              Components & UI                           │ │
│  ├────────────────────────────────────────────────────────┤ │
│  │ • Navigation Component   (Header/Menu)                 │ │
│  │ • Footer Component       (Footer)                      │ │
│  │ • Button Component       (UI Buttons)                  │ │
│  │ • Input Component        (Form Inputs)                 │ │
│  │ • Forms                  (Auth, Search, Filters)       │ │
│  │ • Cards                  (Product, Review, Artist)     │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │              API Client & Services                     │ │
│  ├────────────────────────────────────────────────────────┤ │
│  │ • apiClient              (HTTP requests)               │ │
│  │   - Authentication       (login, register, refresh)    │ │
│  │   - Products             (list, detail, search)        │ │
│  │   - Artists              (list, profile)               │ │
│  │   - Reviews              (fetch, create)               │ │
│  │   - Orders               (create, status)              │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │              State Management                          │ │
│  ├────────────────────────────────────────────────────────┤ │
│  │ • useState (React Hooks)                               │ │
│  │ • localStorage (Persistence)                           │ │
│  │   - JWT Tokens (access, refresh)                       │ │
│  │   - User Profile                                       │ │
│  │   - Cart Data                                          │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Backend Components:

```
┌─────────────────────────────────────────────────────────────┐
│                   Django REST API                            │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │              Authentication & Security                 │ │
│  ├────────────────────────────────────────────────────────┤ │
│  │ • JWT Authentication     (Simple JWT)                  │ │
│  │ • Django-allauth         (User management)             │ │
│  │ • Password Hashing       (Argon2)                      │ │
│  │ • CORS Configuration     (Cross-origin requests)       │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │              API Endpoints (ViewSets)                  │ │
│  ├────────────────────────────────────────────────────────┤ │
│  │ • AuthViewSet                                          │ │
│  │   - POST /auth/registration/  (Register)              │ │
│  │   - POST /auth/login/         (Login)                 │ │
│  │   - POST /auth/token/refresh/ (Refresh Token)         │ │
│  │                                                        │ │
│  │ • ProductViewSet                                       │ │
│  │   - GET /products/            (List)                  │ │
│  │   - GET /products/{id}/       (Detail)                │ │
│  │   - POST /products/           (Create)                │ │
│  │   - PUT /products/{id}/       (Update)                │ │
│  │   - DELETE /products/{id}/    (Delete)                │ │
│  │                                                        │ │
│  │ • ArtistViewSet                                        │ │
│  │   - GET /artists/             (List)                  │ │
│  │   - GET /artists/{id}/        (Detail)                │ │
│  │                                                        │ │
│  │ • ReviewViewSet                                        │ │
│  │   - GET /reviews/             (List)                  │ │
│  │   - POST /reviews/            (Create)                │ │
│  │                                                        │ │
│  │ • OrderViewSet                                         │ │
│  │   - GET /orders/              (List)                  │ │
│  │   - POST /orders/             (Create)                │ │
│  │                                                        │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │              Serializers & Data Validation             │ │
│  ├────────────────────────────────────────────────────────┤ │
│  │ • UserSerializer             (User data)               │ │
│  │ • ProductSerializer          (Product data)            │ │
│  │ • ArtistSerializer           (Artist data)             │ │
│  │ • ReviewSerializer           (Review data)             │ │
│  │ • OrderSerializer            (Order data)              │ │
│  │ • Input validation & Transformation                    │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │              Models & Database Schema                  │ │
│  ├────────────────────────────────────────────────────────┤ │
│  │ • User Model         (Django User)                     │ │
│  │ • UserProfile Model  (Custom fields)                   │ │
│  │ • Product Model      (Marketplace items)               │ │
│  │ • Category Model     (Product categories)              │ │
│  │ • Artist Model       (Seller profiles)                 │ │
│  │ • Review Model       (Product reviews)                 │ │
│  │ • Order Model        (Purchase orders)                 │ │
│  │ • BlogPost Model     (Community content)               │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │              Business Logic & Services                 │ │
│  ├────────────────────────────────────────────────────────┤ │
│  │ • Email Service      (Notifications, Confirmations)    │ │
│  │ • Payment Service    (Order processing)                │ │
│  │ • Search Service     (Product/Artist search)           │ │
│  │ • Notification Svc   (User notifications)              │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │              Utilities & Helpers                       │ │
│  ├────────────────────────────────────────────────────────┤ │
│  │ • Pagination         (API response pagination)         │ │
│  │ • Permissions        (Access control)                  │ │
│  │ • Filters            (Query filtering)                 │ │
│  │ • Logging            (Activity tracking)               │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 💻 Code Diagram (C4)

Detailed code structure showing classes, methods, and responsibilities.

### Frontend - API Client (`lib/api-client.ts`):

```typescript
class APIClient {
  // Properties
  - baseURL: string
  - timeout: number
  - token: string | null
  
  // Authentication Methods
  + register(email, password, firstName, lastName, role): Promise<User>
  + login(email, password): Promise<AuthResponse>
  + logout(): void
  + refreshToken(token: string): Promise<AuthResponse>
  
  // Product Methods
  + getProducts(params?: QueryParams): Promise<PaginatedResponse<Product>>
  + getProduct(id: number): Promise<Product>
  + createProduct(data: ProductData): Promise<Product>
  + updateProduct(id: number, data: ProductData): Promise<Product>
  + deleteProduct(id: number): Promise<void>
  
  // Artist Methods
  + getArtists(params?: QueryParams): Promise<PaginatedResponse<Artist>>
  + getArtist(id: number): Promise<Artist>
  
  // Review Methods
  + getReviews(params?: QueryParams): Promise<PaginatedResponse<Review>>
  + createReview(data: ReviewData): Promise<Review>
  
  // Order Methods
  + getOrders(): Promise<PaginatedResponse<Order>>
  + createOrder(data: OrderData): Promise<Order>
  + getOrder(id: number): Promise<Order>
  
  // Blog Methods
  + getBlogPosts(): Promise<PaginatedResponse<BlogPost>>
  + getBlogPost(id: number): Promise<BlogPost>
  
  // Helper Methods
  - request<T>(endpoint, options): Promise<T>
  - loadToken(): void
  - setToken(token): void
  - getToken(): string | null
  - clearToken(): void
}
```

### Frontend - Pages (React Components):

```typescript
// Login Page
export default function LoginPage() {
  - State: email, password, loading, error, success
  - handleSubmit(e: FormEvent): void
  - Renders: Form with email/password inputs, messages
  - Calls: apiClient.login()
  - Redirect: "/" on success
}

// Product Detail Page
export default function ProductDetailPage() {
  - Params: id from URL
  - State: product, reviews, loading, error
  - useEffect: Fetch product + reviews
  - Renders: Product info, seller card, reviews list
  - Calls: apiClient.getProduct(), apiClient.getReviews()
}

// Artist Profile Page
export default function ArtistDetailPage() {
  - Params: id from URL
  - State: artist, artistProducts, loading, error
  - useEffect: Fetch artist + their products
  - Renders: Artist bio, contact button, products grid
  - Calls: apiClient.getArtist(), apiClient.getProducts()
}
```

### Backend - Models (Django):

```python
class User(AbstractUser):
  - id: int (Primary Key)
  - email: str (Unique)
  - first_name: str
  - last_name: str
  - is_active: bool
  - created_at: datetime

class UserProfile(Model):
  - user: ForeignKey(User)
  - role: str (buyer, seller, artisan, farmer, tradesman)
  - bio: str
  - location: str
  - verified: bool
  - avatar: File

class Product(Model):
  - id: int (Primary Key)
  - seller: ForeignKey(User)
  - title: str
  - description: str
  - category: ForeignKey(Category)
  - price: Decimal
  - quantity: int
  - status: str (active, inactive, draft)
  - image: File
  - rating: float
  - created_at: datetime
  - updated_at: datetime

class Artist(Model):
  - id: int (Primary Key)
  - user: OneToOneField(User)
  - bio: str
  - featured_image: File
  - social_media: JSON
  - created_at: datetime

class Review(Model):
  - id: int (Primary Key)
  - product: ForeignKey(Product)
  - reviewer: ForeignKey(User)
  - rating: int (1-5)
  - comment: str
  - created_at: datetime

class Order(Model):
  - id: int (Primary Key)
  - user: ForeignKey(User)
  - total_price: Decimal
  - status: str (pending, confirmed, shipped, delivered)
  - created_at: datetime
  - updated_at: datetime
```

### Backend - ViewSets (Django REST):

```python
class AuthViewSet(ViewSet):
  + register(request): Response
    - Validate email/password
    - Create user + profile
    - Send confirmation email
    - Return: User data + tokens
  
  + login(request): Response
    - Authenticate user
    - Generate JWT tokens
    - Return: access + refresh tokens
  
  + token_refresh(request): Response
    - Validate refresh token
    - Generate new access token
    - Return: new access token

class ProductViewSet(ModelViewSet):
  queryset = Product.objects.all()
  serializer_class = ProductSerializer
  
  + list(request): Response (GET /products/)
  + retrieve(request, pk): Response (GET /products/{id}/)
  + create(request): Response (POST /products/)
  + update(request, pk): Response (PUT /products/{id}/)
  + destroy(request, pk): Response (DELETE /products/{id}/)
  + filter: by category, search text, price range
  + permissions: IsAuthenticatedOrReadOnly

class ArtistViewSet(ReadOnlyModelViewSet):
  queryset = Artist.objects.all()
  serializer_class = ArtistSerializer
  
  + list(request): Response (GET /artists/)
  + retrieve(request, pk): Response (GET /artists/{id}/)
  + permissions: IsAuthenticatedOrReadOnly

class ReviewViewSet(ModelViewSet):
  queryset = Review.objects.all()
  serializer_class = ReviewSerializer
  
  + list(request): Response (GET /reviews/)
  + create(request): Response (POST /reviews/)
  + filter: by product_id
  + permissions: IsAuthenticatedOrReadOnly
```

---

## 🔄 Data Flow

### Authentication Flow:

```
User Registration:
  User → Register Form → apiClient.register() 
    → POST /api/auth/registration/ 
    → Backend validates input
    → Create User + UserProfile
    → Send confirmation email
    → Response: User created (201)
    → Redirect to login page

User Login:
  User → Login Form → apiClient.login()
    → POST /api/auth/login/
    → Backend authenticates credentials
    → Generate JWT tokens
    → Response: {access, refresh}
    → Store in localStorage
    → Set Authorization header
    → Redirect to homepage

Token Refresh:
  Frontend → Check token expiry
    → POST /api/auth/token/refresh/ with refresh token
    → Backend validates refresh token
    → Generate new access token
    → Response: {new_access}
    → Update localStorage
```

### Product Detail Flow:

```
User Navigates to /marketplace/1:
  URL → useParams() extracts id=1
    → useEffect triggered
    → Fetch product data:
      GET /api/products/1/
      GET /api/reviews/?product_id=1
    → Backend queries database
    → Response: Product object + Reviews array
    → setProduct() + setReviews()
    → Component re-renders with data
    → User sees product detail page
```

### Artist Profile Flow:

```
User Navigates to /tradesmen/1:
  URL → useParams() extracts id=1
    → useEffect triggered
    → Fetch artist data:
      GET /api/artists/1/
      GET /api/products/?seller_id=<artist.user_id>
    → Backend queries database
    → Response: Artist object + Products array
    → setArtist() + setArtistProducts()
    → Component re-renders with data
    → User sees artist profile + their products
```

---

## 🛠 Technology Stack

### Frontend:
- **Framework:** Next.js 16 (React)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **HTTP Client:** Fetch API (built-in)
- **State Management:** React Hooks (useState, useEffect)
- **Storage:** localStorage (JWT tokens)
- **Routing:** Next.js App Router with dynamic routes

### Backend:
- **Framework:** Django 4.2
- **API:** Django REST Framework
- **Authentication:** Simple JWT + django-allauth
- **Database ORM:** Django ORM
- **Database:** SQLite (dev) / PostgreSQL (prod)
- **Email:** Django Mail Backend
- **Pagination:** DRF Pagination
- **Documentation:** drf-spectacular (Swagger)

### Database:
- **Primary:** SQLite / PostgreSQL
- **Schema:** Relational (Users, Products, Artists, Reviews, Orders)
- **Seeding:** Faker + Factory Boy

### Infrastructure:
- **Web Server:** Django Development / Gunicorn (prod)
- **Containerization:** Docker + Docker Compose
- **Reverse Proxy:** Nginx
- **Package Manager:** npm (frontend), pip/uv (backend)

---

## 📊 Architecture Diagram (ASCII)

### Complete System Flow:

```
┌─────────────┐
│   Browser   │
└──────┬──────┘
       │ User Actions
       │ (Click, Form Submit)
       ▼
┌──────────────────────────┐
│    Next.js Frontend      │
│ ┌────────────────────┐   │
│ │ React Components   │   │
│ │ - Pages            │   │
│ │ - Forms            │   │
│ │ - Cards            │   │
│ └────────────────────┘   │
│ ┌────────────────────┐   │
│ │ API Client         │   │
│ │ - HTTP Requests    │   │
│ │ - Token Management │   │
│ └────────────────────┘   │
│ ┌────────────────────┐   │
│ │ State              │   │
│ │ - useState         │   │
│ │ - localStorage     │   │
│ └────────────────────┘   │
└──────┬───────────────────┘
       │ HTTP/HTTPS Requests
       │ + JWT Token in Header
       ▼
┌──────────────────────────────┐
│    Django REST API           │
│ ┌──────────────────────────┐ │
│ │ URL Routing              │ │
│ │ - /api/auth/            │ │
│ │ - /api/products/        │ │
│ │ - /api/artists/         │ │
│ └──────────────────────────┘ │
│ ┌──────────────────────────┐ │
│ │ Middleware               │ │
│ │ - JWT Authentication     │ │
│ │ - CORS Headers           │ │
│ │ - Logging                │ │
│ └──────────────────────────┘ │
│ ┌──────────────────────────┐ │
│ │ ViewSets/Views           │ │
│ │ - Authenticate logic     │ │
│ │ - Product CRUD           │ │
│ │ - Artist queries         │ │
│ │ - Review management      │ │
│ └──────────────────────────┘ │
│ ┌──────────────────────────┐ │
│ │ Serializers              │ │
│ │ - Validate input         │ │
│ │ - Transform output       │ │
│ │ - Handle relationships   │ │
│ └──────────────────────────┘ │
│ ┌──────────────────────────┐ │
│ │ Business Logic           │ │
│ │ - Email notifications    │ │
│ │ - Order processing       │ │
│ │ - Search/Filter          │ │
│ └──────────────────────────┘ │
│ ┌──────────────────────────┐ │
│ │ ORM/Models               │ │
│ │ - User                   │ │
│ │ - Product                │ │
│ │ - Artist                 │ │
│ │ - Review                 │ │
│ │ - Order                  │ │
│ └──────────────────────────┘ │
└──────┬───────────────────────┘
       │ SQL Queries
       ▼
┌──────────────────────────┐
│    SQLite/PostgreSQL     │
│                          │
│ ┌────────────────────┐   │
│ │ Users Table        │   │
│ ├────────────────────┤   │
│ │ Products Table     │   │
│ │ Artists Table      │   │
│ │ Reviews Table      │   │
│ │ Orders Table       │   │
│ │ Categories Table   │   │
│ └────────────────────┘   │
│                          │
└──────────────────────────┘
```

---

## 🎯 Key Interactions

### 1. Authentication:
- **User** → Frontend → Backend → Database
- JWT tokens stored in localStorage
- Authorization header in every API request

### 2. Product Discovery:
- **User** searches → Frontend filters → Backend queries → Database
- Results paginated and returned
- Links to detail pages

### 3. Product Detail:
- **User** clicks product → Dynamic route `/marketplace/[id]`
- Frontend fetches product + reviews
- Backend joins tables and returns data

### 4. Artist Profiles:
- **User** clicks artist → Dynamic route `/tradesmen/[id]`
- Frontend fetches artist + their products
- Backend filters by seller_id

---

## ✅ Summary

The HarvestConnect C4 Model shows:
- **C1 (Context):** External actors and systems
- **C2 (Containers):** Frontend, Backend, Database, Storage
- **C3 (Components):** Pages, API endpoints, Models, Services
- **C4 (Code):** Classes, methods, responsibilities

All components work together to create a scalable, maintainable e-commerce platform.

**GitHub Repository:** https://github.com/dbillion/harvestconnect
