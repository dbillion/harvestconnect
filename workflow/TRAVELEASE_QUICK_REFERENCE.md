# TravelEase - Quick Reference Card

## 🚀 Project Quick Start

### Technology Stack Summary
```
Frontend: React/Vue + Google OAuth
API: Django REST Framework (Python)
Database: PostgreSQL (Neon)
Environment: Python 3.11+ with uv
Auth: Google OAuth + JWT
```

---

## 📦 Installation Quick Guide

```bash
# 1. Setup project
mkdir travelease && cd travelease
uv init --python 3.11

# 2. Activate environment
source .venv/bin/activate

# 3. Install dependencies
uv pip install django==4.2 djangorestframework==3.14 \
    django-allauth==0.57 djangorestframework-simplejwt==5.3 \
    psycopg2-binary==2.9 drf-spectacular==0.27

# 4. Create Django project
django-admin startproject travelease_config .
python manage.py startapp travelease

# 5. Setup database
python manage.py makemigrations
python manage.py migrate

# 6. Create superuser
python manage.py createsuperuser

# 7. Run server
python manage.py runserver
```

---

## 🗄️ Database Entities (13 Total)

| # | Entity | Purpose |
|---|--------|---------|
| 1 | USER | Central user entity |
| 2 | PROFILE | Extended user info |
| 3 | SOCIAL_ACCOUNT | OAuth data storage |
| 4 | ADDRESS | Multi-address support |
| 5 | FARMER | Farmer profile |
| 6 | PRODUCT | Farm products |
| 7 | PRODUCT_CATEGORY | Product types |
| 8 | SERVICE | Farmer services |
| 9 | SERVICE_CATEGORY | Service types |
| 10 | ORDER | Purchase orders |
| 11 | ORDER_ITEM | Line items |
| 12 | DONATION | Charity donations |
| 13 | REVIEW | Ratings & feedback |

---

## 🔐 Key API Endpoints (32+)

### Authentication (4)
- `POST /api/auth/google/` - Google OAuth login
- `POST /api/auth/logout/` - User logout
- `POST /api/auth/refresh/` - Refresh token
- `GET /api/auth/user/` - Current user

### Users (4)
- `GET /api/users/me/` - Current user profile
- `PUT /api/users/<id>/` - Update profile
- `GET /api/users/<id>/addresses/` - List addresses
- `POST /api/users/<id>/addresses/` - Add address

### Farmers (5)
- `GET /api/farmers/` - List farmers
- `POST /api/farmers/` - Register farmer
- `GET /api/farmers/<id>/` - Farmer details
- `GET /api/farmers/<id>/products/` - Farm products
- `GET /api/farmers/<id>/services/` - Farm services

### Products (5)
- `GET /api/products/` - List products
- `POST /api/products/` - Create product
- `GET /api/products/<id>/` - Product details
- `PUT /api/products/<id>/` - Update product
- Filter options: `?category=&farmer=&search=`

### Services (3)
- `GET /api/services/` - List services
- `POST /api/services/` - Create service
- `GET /api/services/<id>/` - Service details

### Orders (4)
- `GET /api/orders/` - List user orders
- `POST /api/orders/` - Create order
- `GET /api/orders/<id>/` - Order details
- `PUT /api/orders/<id>/` - Update status

### Donations (4)
- `GET /api/donations/` - List donations
- `POST /api/donations/` - Record donation
- `GET /api/charity-recipients/` - List recipients
- `POST /api/charity-recipients/` - Add recipient

### Reviews (3)
- `GET /api/reviews/` - List reviews
- `POST /api/reviews/` - Create review
- `GET /api/farmers/<id>/reviews/` - Farmer reviews

---

## 📊 Key Models

### User Model
```python
class User(models.Model):
    id = UUIDField  # Primary Key
    email = EmailField(unique=True)
    first_name, last_name = CharField
    phone_number = CharField
    user_type = Choice(['farmer', 'buyer'])
    is_active = BooleanField
    created_at, updated_at = DateTimeField
```

### Product Model
```python
class Product(models.Model):
    id = UUIDField
    farmer = ForeignKey(Farmer)
    name = CharField(max_length=255)
    description = TextField
    category = ForeignKey(ProductCategory)
    price = DecimalField
    quantity_available = IntegerField
    seasonal_availability = JSONField
```

### Order Model
```python
class Order(models.Model):
    id = UUIDField
    user = ForeignKey(User)
    status = Choice(['pending', 'confirmed', 'processing', 'completed', 'cancelled'])
    total_amount = DecimalField
    include_donation = BooleanField
    donation_percentage = DecimalField
    delivery_date = DateTimeField
```

---

## 🔌 JWT Token Management

### Getting Tokens
```bash
# After successful Google OAuth login
POST /api/auth/google/
{
  "token": "google_id_token"
}

# Returns:
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

### Using Tokens
```javascript
// Store tokens
localStorage.setItem('accessToken', response.access);
localStorage.setItem('refreshToken', response.refresh);

// Make API request
fetch('/api/users/me/', {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
  }
})

// Token lifespan
// Access Token: 24 hours
// Refresh Token: 30 days
```

### Refresh Token
```bash
POST /api/auth/refresh/
{
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}

# Returns new access token
```

---

## 🗺️ Database Schema Overview

```
USER (Center)
├─ PROFILE (1:1)
├─ SOCIAL_ACCOUNT (1:N)
├─ FARMER (1:1 optional)
├─ ORDER (1:N)
└─ REVIEW (1:N)

FARMER (Producer)
├─ PRODUCT (1:N)
├─ SERVICE (1:N)
└─ REVIEW (1:N received)

PRODUCT
├─ PRODUCT_CATEGORY (N:1)
├─ ORDER_ITEM (1:N)
└─ PRODUCT_IMAGE (1:N)

ORDER
├─ ORDER_ITEM (1:N)
├─ DONATION (1:N)
└─ REVIEW (0:1)

DONATION
└─ CHARITY_RECIPIENT (N:1)
```

---

## 🔑 Environment Variables

```bash
# Database
DB_NAME=neondb
DB_USER=postgres
DB_PASSWORD=xxx
DB_HOST=xxx.neon.tech
DB_PORT=5432

# Google OAuth
GOOGLE_CLIENT_ID=xxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=xxx

# Django
SECRET_KEY=your_secret_key
DEBUG=False
ALLOWED_HOSTS=localhost,example.com

# JWT
SIMPLE_JWT_ACCESS_TOKEN_LIFETIME=86400
SIMPLE_JWT_REFRESH_TOKEN_LIFETIME=2592000

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_HOST_USER=xxx
EMAIL_HOST_PASSWORD=xxx
```

---

## 📊 Project Phases (15 Weeks)

| Phase | Duration | Focus | Deliverable |
|-------|----------|-------|-------------|
| 1 | Weeks 1-2 | Backend Setup | ORM Models |
| 2 | Weeks 3-4 | Authentication | Auth System |
| 3 | Weeks 5-7 | Marketplace | Product Catalog |
| 4 | Weeks 8-10 | Orders | Order System |
| 5 | Weeks 11-12 | Charity | Donation System |
| 6 | Weeks 13-14 | Testing | Production API |
| 7 | Week 15 | Deployment | Live Platform |

---

## 📈 Success Metrics

### User Metrics
- 50+ farmer registrations (Month 3)
- 500+ active buyers (Month 6)
- 200+ monthly orders (Month 6)
- 300+ product listings

### System Metrics
- API response: <200ms (p95)
- OAuth success rate: 99%+
- Database queries: <50ms avg
- Platform uptime: 99.5%+

### Quality Metrics
- Code coverage: >80%
- API documentation: 100%
- Security audit: Pass

---

## 🚨 Security Checklist

- [x] OAuth 2.0 with PKCE
- [x] JWT token expiration
- [x] HTTPS/TLS enforcement
- [x] CORS configuration
- [x] Rate limiting enabled
- [x] Input validation
- [x] SQL injection prevention
- [x] CSRF protection
- [x] Secure headers
- [x] Error logging (no sensitive data)

---

## 🛠️ Common Commands

```bash
# Django Migrations
python manage.py makemigrations
python manage.py migrate
python manage.py migrate --fake-initial

# Create Data
python manage.py shell
>>> from travelease.models import User, Farmer
>>> user = User.objects.create_user(...)

# Run Tests
python manage.py test

# Load Fixtures
python manage.py loaddata fixture.json

# Database Management
python manage.py dumpdata > backup.json
python manage.py dbshell

# API Documentation
python manage.py spectacular --file schema.yml
```

---

## 📚 File Structure

```
travelease/
├── travelease_config/
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
├── travelease/
│   ├── models.py
│   ├── views.py
│   ├── serializers.py
│   ├── urls.py
│   └── migrations/
├── manage.py
├── requirements.txt
├── .env
└── README.md
```

---

## 🎯 Go-Live Checklist

Before deployment:
- [ ] All tests passing (>80% coverage)
- [ ] Security audit completed
- [ ] API documentation complete
- [ ] Database backups configured
- [ ] Error monitoring setup
- [ ] Performance tested under load
- [ ] SSL certificate installed
- [ ] Rate limiting tested
- [ ] Email service configured
- [ ] Monitoring alerts set

---

## 📞 Quick Support

**Documentation Files:**
1. `TRAVELEASE_PROJECT_PLAN.md` - Full project overview
2. `TRAVELEASE_TECH_SPECIFICATIONS.md` - Implementation guide
3. `TRAVELEASE_API_REFERENCE.md` - Detailed API docs
4. `TRAVELEASE_EXECUTIVE_SUMMARY.md` - Vision & summary

**Diagrams:**
- `database-schema.png` - ER diagram
- `api-oauth-flow.png` - OAuth flow
- `api-endpoints.png` - All endpoints

---

**Quick Reference Version:** 1.0  
**Last Updated:** November 15, 2025  
**Status:** Ready for Development ✅
