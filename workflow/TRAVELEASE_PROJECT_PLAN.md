# TravelEase Farm Cooperative Platform - Comprehensive Project Plan

**Project Status:** Planning Phase  
**Technology Stack:** Django REST Framework | PostgreSQL (Neon) | Google OAuth | JWT Authentication  
**Environment:** Python with `uv` virtual environment manager

---

## 📋 Project Overview

**Vision:** Create a cooperative system connecting church congregation farmers with local buyers, with seasonal markets and year-round mediation services, including charitable product donations.

### Core Features:
- 🚜 **Farmer Marketplace** - Farmers list products (fruits, vegetables, honey, jams) and services (horse therapy, farm experiences, nature tours)
- 🛒 **Product Catalog** - Categorized products with pricing and availability
- 👥 **Service Booking** - Reserve and schedule farmer services
- 📦 **Order Management** - Year-round mediation and delivery coordination
- ❤️ **Charity Integration** - Donation tracking and recipient management
- 🔐 **Social Authentication** - Google OAuth for easy registration
- ⭐ **Review System** - Ratings and feedback for farmers
- 📅 **Seasonal Events** - Spring, Thanksgiving, and Christmas market coordination

---

## 🗄️ Database Architecture

### Entity Relationship Diagram
Generated using ER model with 13 core entities:

**Core Tables:**
1. **USER** - Central user entity (farmers & buyers)
   - UUID primary key
   - Email authentication
   - User type: farmer|buyer
   - Timestamps for audit trail

2. **PROFILE** - Extended user information
   - Bio, avatar, verification status
   - Church membership tracking

3. **SOCIAL_ACCOUNT** - OAuth integration
   - Google provider support
   - Extra user data storage (profile pictures, etc.)

4. **FARMER** - Farmer-specific details
   - Farm name, location, description
   - Farmer verification status

5. **PRODUCT** - Farm products
   - Name, description, pricing
   - Quantity tracking
   - Seasonal availability support
   - Category associations

6. **SERVICE** - Farmer services
   - Horse therapy, farm experiences, tours
   - Price-based or custom quotes

7. **ORDER** - Purchase orders
   - Product and service orders
   - Status tracking: pending→confirmed→processing→completed
   - Donation percentage allocation
   - Delivery date scheduling

8. **ORDER_ITEM** - Line items for orders
   - Quantity and unit pricing
   - Links products to orders

9. **DONATION** - Charitable giving
   - Amount tracking
   - Recipient type classification
   - Integrated with orders

10. **CHARITY_RECIPIENT** - Beneficiary management
    - Individual/organization/family types
    - Contact information

11. **REVIEW** - Ratings and feedback
    - 1-5 star ratings
    - Comments

12. **PRODUCT_CATEGORY** & **SERVICE_CATEGORY** - Taxonomy

13. **ADDRESS** - Multi-address support per user
    - Delivery and billing addresses

---

## 🔐 Authentication System

### Google OAuth Integration (django-allauth)

**Registration Flow:**
1. User clicks "Sign in with Google"
2. Google redirects with authorization code
3. Django backend verifies token with Google
4. User/profile created or updated automatically
5. JWT token returned to frontend
6. Social account data stored for future reference

**Configuration:**
```python
SOCIALACCOUNT_PROVIDERS = {
    'google': {
        'SCOPE': ['profile', 'email'],
        'AUTH_PARAMS': {'access_type': 'online'},
        'OAUTH_PKCE_ENABLED': True,
        'FETCH_USERINFO': True,
    }
}
```

**Benefits:**
- ✅ No password management burden
- ✅ Reduced account creation friction
- ✅ Automatic profile data population
- ✅ PKCE security for OAuth
- ✅ Email verification built-in

---

## 🔌 API Endpoints Architecture

### Authentication Endpoints (🔐)
- `POST /api/auth/google/` - Google OAuth login
- `POST /api/auth/logout/` - User logout
- `POST /api/auth/refresh/` - Refresh JWT token
- `GET /api/auth/user/` - Get current authenticated user

### User Management (👤)
- `GET /api/users/<id>/` - Get user profile
- `PUT /api/users/<id>/` - Update profile
- `GET/POST /api/users/<id>/addresses/` - Manage delivery addresses

### Farmer Management (🚜)
- `GET /api/farmers/` - List all farmers
- `POST /api/farmers/` - Register as farmer
- `GET /api/farmers/<id>/` - Get farmer details & ratings
- `GET /api/farmers/<id>/products/` - List farmer's products
- `GET /api/farmers/<id>/services/` - List farmer's services

### Products & Catalog (🛒)
- `GET /api/products/` - List all products (paginated, filterable)
- `POST /api/products/` - Create new product (farmer auth required)
- `GET /api/products/<id>/` - Get product details
- `PUT /api/products/<id>/` - Update product
- `GET /api/products/?category=<name>&seasonal=true` - Advanced filtering

### Services (🎯)
- `GET /api/services/` - List all services
- `POST /api/services/` - Create new service
- `GET /api/services/<id>/` - Get service details

### Order Management (📦)
- `GET /api/orders/` - List user's orders
- `POST /api/orders/` - Create new order
- `GET /api/orders/<id>/` - Get order details
- `PUT /api/orders/<id>/` - Update order status
- Webhook support for status notifications

### Donations & Charity (❤️)
- `GET /api/donations/` - List donations
- `POST /api/donations/` - Record donation
- `GET /api/charity-recipients/` - List recipients
- `POST /api/charity-recipients/` - Register new recipient
- `GET /api/donations/impact/` - Impact reports

### Reviews & Ratings (⭐)
- `GET /api/reviews/` - List reviews
- `POST /api/reviews/` - Create review (post-order)
- `GET /api/farmers/<id>/reviews/` - Get farmer's reviews
- Average ratings calculations

---

## 🏗️ Technical Stack & Setup

### Backend Framework
- **Django 4.x** - Web framework
- **Django REST Framework** - API development
- **django-allauth** - Social authentication
- **djangorestframework-simplejwt** - JWT tokens
- **psycopg2** or **psycopg** - PostgreSQL adapter

### Database
- **PostgreSQL 15+** (via Neon)
- Connection pooling for scalability
- UUID primary keys across all tables
- JSON fields for flexible data storage

### Environment Management
- **uv** - Fast Python package installer & virtual environment
- **python-dotenv** - Environment configuration

### API Documentation
- **drf-spectacular** - OpenAPI 3.0 schema generation
- Auto-generated Swagger UI

---

## 📊 Project Phases

### Phase 1: Backend Foundation (Weeks 1-2)
**Tasks:**
- [ ] Initialize Django project with `uv`
- [ ] Setup Neon PostgreSQL database
- [ ] Create database migrations for all entities
- [ ] Define Django ORM models with relationships
- [ ] Setup environment variables and configurations
- [ ] Database indexing strategy
- **Deliverable:** Working database with Django models

### Phase 2: Authentication & User Management (Weeks 3-4)
**Tasks:**
- [ ] Integrate django-allauth with Google OAuth
- [ ] Configure JWT token generation/refresh
- [ ] Create authentication endpoints
- [ ] Social account linking/disconnection
- [ ] User profile CRUD operations
- [ ] Address management endpoints
- **Deliverable:** Complete user auth system with OAuth

### Phase 3: Farmer & Product System (Weeks 5-7)
**Tasks:**
- [ ] Farmer registration and verification flow
- [ ] Product CRUD endpoints
- [ ] Service management endpoints
- [ ] Image upload/storage for products/services
- [ ] Category management
- [ ] Seasonal availability logic
- [ ] Product search and filtering
- **Deliverable:** Full farmer marketplace functionality

### Phase 4: Order Management & Transactions (Weeks 8-10)
**Tasks:**
- [ ] Order creation and management
- [ ] Order status workflow automation
- [ ] Order notifications (email/SMS)
- [ ] Integration with delivery scheduling
- [ ] Order history and analytics
- [ ] Buyer order tracking
- **Deliverable:** Complete order management system

### Phase 5: Charity & Donations (Weeks 11-12)
**Tasks:**
- [ ] Donation tracking system
- [ ] Charity recipient management
- [ ] Impact reporting dashboard
- [ ] Tax documentation generation
- [ ] Donor recognition system
- [ ] Christmas market special features
- **Deliverable:** Functional charity donation system

### Phase 6: Reviews, Testing & Documentation (Weeks 13-14)
**Tasks:**
- [ ] Review/rating system
- [ ] Unit test suite (>80% coverage)
- [ ] Integration testing
- [ ] API documentation (Swagger)
- [ ] Performance optimization
- [ ] Security audit
- **Deliverable:** Fully tested and documented API

### Phase 7: Deployment & Launch (Week 15)
**Tasks:**
- [ ] Production environment setup
- [ ] CI/CD pipeline configuration
- [ ] Monitoring and logging
- [ ] Load testing
- [ ] Gradual rollout strategy
- **Deliverable:** Live production API

---

## 🎯 Key Metrics & Success Criteria

| Metric | Target |
|--------|--------|
| API Response Time | <200ms for 95th percentile |
| OAuth Success Rate | >99% |
| Database Query Performance | <50ms average |
| User Onboarding Time | <3 minutes |
| API Uptime | 99.5%+ |
| Code Coverage | >80% |
| Documentation Completeness | 100% |

---

## 🔒 Security Considerations

- JWT token expiration: 24 hours (refresh token: 30 days)
- PKCE for OAuth security
- CORS policy for frontend integration
- Rate limiting on authentication endpoints
- SQL injection prevention via ORM
- HTTPS/TLS enforcement
- Input validation on all endpoints
- GDPR compliance for user data
- Charity donation verification

---

## 📱 Frontend Integration Points

**Required Frontend Implementation:**
1. Google OAuth button integration
2. JWT token storage (localStorage/sessionStorage)
3. API client with token refresh logic
4. Multi-step farmer registration form
5. Product browsing and filtering UI
6. Shopping cart and checkout
7. Order tracking dashboard
8. Donation during checkout
9. Review submission form
10. Farmer profile pages

---

## 🚀 Deployment Architecture

```
┌─────────────────────────────────────┐
│   Frontend (React/Vue/etc.)         │
├─────────────────────────────────────┤
│   Google OAuth Flow                 │
├─────────────────────────────────────┤
│   Django REST API (Neon Serverless) │
│   - Load balanced instances         │
│   - Auto-scaling                    │
├─────────────────────────────────────┤
│   PostgreSQL (Neon)                 │
│   - Connection pooling              │
│   - Automated backups               │
├─────────────────────────────────────┤
│   Cloud Storage (Images)            │
│   - Product images                  │
│   - User avatars                    │
└─────────────────────────────────────┘
```

---

## 📚 Documentation Resources

**Generated Diagrams:**
1. `database-schema.png` - ER diagram with all relationships
2. `api-oauth-flow.png` - OAuth registration flow
3. `api-endpoints.png` - Complete endpoint specification

**External Resources:**
- Django REST Framework: https://www.django-rest-framework.org/
- django-allauth: https://django-allauth.readthedocs.io/
- Neon PostgreSQL: https://neon.tech/docs
- JWT Best Practices: https://tools.ietf.org/html/rfc8725

---

## 💡 Future Enhancements

- [ ] Mobile app (React Native)
- [ ] Payment gateway integration (Stripe/PayPal)
- [ ] SMS notifications
- [ ] Map integration for farm locations
- [ ] Video calls for service consultations
- [ ] AI-powered product recommendations
- [ ] Loyalty program
- [ ] Wholesale marketplace
- [ ] Real-time availability sync
- [ ] Multi-language support

---

## 📞 Team Assignments (Template)

- **Backend Lead:** [Name] - Overall architecture & integration
- **Database Specialist:** [Name] - Schema design & optimization
- **Frontend Lead:** [Name] - UI integration & OAuth flow
- **QA/Testing:** [Name] - Test coverage & validation
- **DevOps:** [Name] - Deployment & infrastructure

---

**Document Version:** 1.0  
**Last Updated:** November 15, 2025  
**Status:** Ready for Development ✅
