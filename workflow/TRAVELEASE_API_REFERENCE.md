# TravelEase API Reference & Integration Guide

## Complete API Specification

### Authentication Flow (Google OAuth + JWT)

#### 1. Initiate Google Login
**Frontend Action:**
```javascript
// Use Google Identity Services SDK
<script src="https://accounts.google.com/gsi/client" async defer></script>

google.accounts.id.initialize({
  client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
  callback: handleCredentialResponse
});

google.accounts.id.renderButton(
  document.getElementById('google_signin_button'),
  { theme: "outline", size: "large" }
);

function handleCredentialResponse(response) {
  // Send token to backend
  fetch('/api/auth/google/', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ token: response.credential })
  })
  .then(res => res.json())
  .then(data => {
    localStorage.setItem('accessToken', data.access);
    localStorage.setItem('refreshToken', data.refresh);
    // Redirect to dashboard
    window.location.href = '/dashboard';
  });
}
```

#### 2. Backend: Verify Google Token & Create User
**Endpoint:** `POST /api/auth/google/`
```json
{
  "token": "eyJhbGciOiJSUzI1NiIsImtpZCI6Ijk..."
}
```

**Response (201 Created):**
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "user_type": "buyer",
    "profile": {
      "bio": null,
      "avatar_url": "https://lh3.googleusercontent.com/...",
      "verified": false
    }
  }
}
```

#### 3. Refresh JWT Token
**Endpoint:** `POST /api/auth/refresh/`
```json
{
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

**Response (200 OK):**
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

---

### User Management Endpoints

#### Get Current User
**Endpoint:** `GET /api/users/me/`  
**Auth:** Required (Bearer token)  
**Response (200 OK):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "john@example.com",
  "first_name": "John",
  "last_name": "Doe",
  "phone_number": "+1234567890",
  "user_type": "farmer",
  "profile": {
    "bio": "Local honey producer",
    "avatar_url": "https://...",
    "church_member_since": "2020-01-15",
    "verified": true
  },
  "farmer_profile": {
    "farm_name": "Golden Meadow Farm",
    "farm_location": "Countryside, Estonia",
    "verified_farmer": true
  }
}
```

#### Update User Profile
**Endpoint:** `PUT /api/users/<id>/`  
**Auth:** Required  
**Request Body:**
```json
{
  "first_name": "John",
  "last_name": "Doe",
  "phone_number": "+1234567890"
}
```

#### Get User Addresses
**Endpoint:** `GET /api/users/<id>/addresses/`  
**Auth:** Required  
**Response (200 OK):**
```json
{
  "count": 2,
  "results": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "street_address": "123 Main Street",
      "city": "Tallinn",
      "postal_code": "10001",
      "country": "Estonia",
      "is_primary": true
    },
    {
      "id": "550e8400-e29b-41d4-a716-446655440002",
      "street_address": "456 Oak Avenue",
      "city": "Tartu",
      "postal_code": "51000",
      "country": "Estonia",
      "is_primary": false
    }
  ]
}
```

#### Create Address
**Endpoint:** `POST /api/users/<id>/addresses/`  
**Auth:** Required  
**Request Body:**
```json
{
  "street_address": "123 Main Street",
  "city": "Tallinn",
  "postal_code": "10001",
  "country": "Estonia",
  "is_primary": true
}
```

---

### Farmer Registration & Management

#### Register as Farmer
**Endpoint:** `POST /api/farmers/`  
**Auth:** Required  
**Request Body:**
```json
{
  "farm_name": "Golden Meadow Farm",
  "farm_description": "We produce organic honey and seasonal fruits",
  "farm_location": "Countryside, Estonia",
  "contact_info": {
    "phone": "+1234567890",
    "website": "https://goldensmeadow.com",
    "instagram": "@goldenmeadow"
  }
}
```

**Response (201 Created):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440100",
  "user_id": "550e8400-e29b-41d4-a716-446655440000",
  "farm_name": "Golden Meadow Farm",
  "farm_location": "Countryside, Estonia",
  "verified_farmer": false,
  "created_at": "2025-11-15T10:30:00Z"
}
```

#### List All Farmers
**Endpoint:** `GET /api/farmers/`  
**Auth:** Optional  
**Query Parameters:**
- `search=keywords` - Search by farm name
- `verified=true` - Only verified farmers
- `page=2` - Pagination

**Response (200 OK):**
```json
{
  "count": 45,
  "next": "http://api.example.com/api/farmers/?page=2",
  "previous": null,
  "results": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440100",
      "farm_name": "Golden Meadow Farm",
      "farm_location": "Countryside, Estonia",
      "average_rating": 4.8,
      "total_reviews": 12,
      "product_count": 8,
      "verified_farmer": true
    }
  ]
}
```

#### Get Farmer Details
**Endpoint:** `GET /api/farmers/<id>/`  
**Auth:** Optional  
**Response (200 OK):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440100",
  "farm_name": "Golden Meadow Farm",
  "farm_description": "We produce organic honey and seasonal fruits",
  "farm_location": "Countryside, Estonia",
  "contact_info": {
    "phone": "+1234567890",
    "website": "https://goldenmeadow.com",
    "instagram": "@goldenmeadow"
  },
  "verified_farmer": true,
  "average_rating": 4.8,
  "total_reviews": 12,
  "created_at": "2024-01-15T10:30:00Z"
}
```

#### Get Farmer's Products
**Endpoint:** `GET /api/farmers/<id>/products/`  
**Auth:** Optional  
**Query Parameters:**
- `category=honey` - Filter by category
- `search=organic` - Search products
- `ordering=-created_at` - Sort by date

**Response (200 OK):**
```json
{
  "count": 8,
  "results": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440200",
      "name": "Raw Forest Honey",
      "description": "Organic honey collected from local forests",
      "category": "honey",
      "price": "12.50",
      "unit": "kg",
      "quantity_available": 15,
      "created_at": "2025-11-01T10:30:00Z"
    }
  ]
}
```

---

### Product Management

#### Create Product
**Endpoint:** `POST /api/products/`  
**Auth:** Required (Farmer only)  
**Request Body:**
```json
{
  "name": "Raw Forest Honey",
  "description": "Organic honey collected from local forests",
  "category": "honey",
  "price": "12.50",
  "unit": "kg",
  "quantity_available": 15,
  "seasonal_availability": {
    "spring": false,
    "summer": false,
    "autumn": true,
    "winter": true
  }
}
```

**Response (201 Created):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440200",
  "farmer_id": "550e8400-e29b-41d4-a716-446655440100",
  "name": "Raw Forest Honey",
  "category": "honey",
  "price": "12.50",
  "quantity_available": 15,
  "created_at": "2025-11-15T10:30:00Z"
}
```

#### List Products
**Endpoint:** `GET /api/products/`  
**Auth:** Optional  
**Query Parameters:**
- `category=vegetables` - Filter by category
- `farmer=<farmer_id>` - Filter by farmer
- `min_price=5&max_price=20` - Price range
- `search=organic` - Full-text search
- `page=1&page_size=20` - Pagination

**Response (200 OK):**
```json
{
  "count": 128,
  "next": "http://api.example.com/api/products/?page=2",
  "results": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440200",
      "farmer_name": "Golden Meadow Farm",
      "name": "Raw Forest Honey",
      "description": "Organic honey collected from local forests",
      "category": "honey",
      "price": "12.50",
      "unit": "kg",
      "quantity_available": 15,
      "created_at": "2025-11-15T10:30:00Z"
    }
  ]
}
```

#### Get Product Detail
**Endpoint:** `GET /api/products/<id>/`  
**Auth:** Optional  
**Response (200 OK):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440200",
  "farmer": {
    "id": "550e8400-e29b-41d4-a716-446655440100",
    "farm_name": "Golden Meadow Farm",
    "average_rating": 4.8
  },
  "name": "Raw Forest Honey",
  "description": "Organic honey collected from local forests",
  "category": "honey",
  "category_display": "Honey & Preserves",
  "price": "12.50",
  "unit": "kg",
  "quantity_available": 15,
  "seasonal_availability": {
    "spring": false,
    "summer": false,
    "autumn": true,
    "winter": true
  },
  "images": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440300",
      "image_url": "https://cdn.example.com/honey1.jpg",
      "display_order": 0
    }
  ],
  "created_at": "2025-11-15T10:30:00Z"
}
```

#### Update Product
**Endpoint:** `PUT /api/products/<id>/`  
**Auth:** Required (Product owner)  
**Request Body:**
```json
{
  "name": "Premium Raw Forest Honey",
  "price": "15.00",
  "quantity_available": 10
}
```

---

### Service Management

#### Create Service
**Endpoint:** `POST /api/services/`  
**Auth:** Required (Farmer only)  
**Request Body:**
```json
{
  "name": "Horse Therapy Session",
  "description": "One-hour therapeutic session with our trained horses",
  "category": "horse_therapy",
  "price_base": "50.00",
  "service_details": {
    "duration_minutes": 60,
    "max_participants": 4,
    "age_restrictions": "5-16 years",
    "equipment_included": true
  }
}
```

#### List Services
**Endpoint:** `GET /api/services/`  
**Auth:** Optional  
**Query Parameters:**
- `category=horse_therapy` - Filter by category
- `farmer=<id>` - Filter by farmer
- `max_price=100` - Price filter

**Response (200 OK):**
```json
{
  "count": 23,
  "results": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440400",
      "farmer_name": "Golden Meadow Farm",
      "name": "Horse Therapy Session",
      "category": "horse_therapy",
      "price_base": "50.00",
      "created_at": "2025-11-15T10:30:00Z"
    }
  ]
}
```

---

### Order Management

#### Create Order
**Endpoint:** `POST /api/orders/`  
**Auth:** Required  
**Request Body:**
```json
{
  "order_type": "product",
  "items": [
    {
      "product_id": "550e8400-e29b-41d4-a716-446655440200",
      "quantity": 2
    },
    {
      "product_id": "550e8400-e29b-41d4-a716-446655440201",
      "quantity": 1
    }
  ],
  "delivery_date": "2025-12-20T14:00:00Z",
  "special_requests": "Please wrap as gift",
  "include_donation": true,
  "donation_percentage": 10.0
}
```

**Response (201 Created):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440500",
  "order_date": "2025-11-15T10:35:00Z",
  "status": "pending",
  "order_type": "product",
  "total_amount": "37.50",
  "items": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440501",
      "product": "Raw Forest Honey",
      "quantity": 2,
      "unit_price": "12.50"
    }
  ],
  "delivery_date": "2025-12-20T14:00:00Z",
  "special_requests": "Please wrap as gift",
  "include_donation": true,
  "donation_percentage": 10.0
}
```

#### List User Orders
**Endpoint:** `GET /api/orders/`  
**Auth:** Required  
**Query Parameters:**
- `status=pending` - Filter by status
- `order_type=product` - Filter by type

**Response (200 OK):**
```json
{
  "count": 5,
  "results": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440500",
      "order_date": "2025-11-15T10:35:00Z",
      "status": "pending",
      "order_type": "product",
      "total_amount": "37.50",
      "created_at": "2025-11-15T10:35:00Z"
    }
  ]
}
```

#### Get Order Details
**Endpoint:** `GET /api/orders/<id>/`  
**Auth:** Required  

#### Update Order Status
**Endpoint:** `PUT /api/orders/<id>/`  
**Auth:** Required (Order owner or admin)  
**Request Body:**
```json
{
  "status": "confirmed"
}
```

---

### Donations & Charity

#### List Donations
**Endpoint:** `GET /api/donations/`  
**Auth:** Optional  
**Response (200 OK):**
```json
{
  "count": 28,
  "total_donated": "1250.50",
  "results": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440600",
      "amount": "3.75",
      "recipient": {
        "id": "550e8400-e29b-41d4-a716-446655440700",
        "name": "Mary Johnson (Elderly)",
        "recipient_type": "elderly"
      },
      "created_at": "2025-11-15T10:35:00Z"
    }
  ]
}
```

#### Create Donation
**Endpoint:** `POST /api/donations/`  
**Auth:** Required  
**Request Body:**
```json
{
  "order_id": "550e8400-e29b-41d4-a716-446655440500",
  "amount": "5.00",
  "recipient_id": "550e8400-e29b-41d4-a716-446655440700"
}
```

#### List Charity Recipients
**Endpoint:** `GET /api/charity-recipients/`  
**Auth:** Optional  
**Response (200 OK):**
```json
{
  "count": 12,
  "results": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440700",
      "name": "Mary Johnson",
      "description": "Elderly church member in need",
      "recipient_type": "elderly",
      "contact_info": {
        "phone": "+1234567890"
      }
    }
  ]
}
```

---

### Reviews & Ratings

#### Create Review
**Endpoint:** `POST /api/reviews/`  
**Auth:** Required  
**Request Body:**
```json
{
  "farmer_id": "550e8400-e29b-41d4-a716-446655440100",
  "rating": 5,
  "comment": "Excellent honey! Very fresh and organic."
}
```

**Response (201 Created):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440800",
  "farmer_id": "550e8400-e29b-41d4-a716-446655440100",
  "rating": 5,
  "comment": "Excellent honey! Very fresh and organic.",
  "created_at": "2025-11-15T10:35:00Z"
}
```

#### Get Farmer Reviews
**Endpoint:** `GET /api/farmers/<id>/reviews/`  
**Auth:** Optional  
**Response (200 OK):**
```json
{
  "count": 12,
  "average_rating": 4.8,
  "results": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440800",
      "buyer": {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "first_name": "John",
        "last_name": "D."
      },
      "rating": 5,
      "comment": "Excellent honey! Very fresh and organic.",
      "created_at": "2025-11-15T10:35:00Z"
    }
  ]
}
```

---

## Error Responses

### Standard Error Format

**400 Bad Request:**
```json
{
  "error": "Validation Error",
  "details": {
    "field_name": ["Error message 1", "Error message 2"]
  }
}
```

**401 Unauthorized:**
```json
{
  "error": "Authentication required",
  "message": "Invalid or expired token"
}
```

**403 Forbidden:**
```json
{
  "error": "Permission denied",
  "message": "You don't have permission to perform this action"
}
```

**404 Not Found:**
```json
{
  "error": "Not found",
  "message": "Resource not found"
}
```

**500 Internal Server Error:**
```json
{
  "error": "Server error",
  "message": "An unexpected error occurred"
}
```

---

## Rate Limiting

- **Default:** 1000 requests per hour per IP
- **Auth Endpoints:** 10 requests per minute (Google OAuth)
- **Search/Filter:** 100 requests per minute

---

## Webhooks (Future)

**Order Status Changes:**
```
POST {webhook_url}
Content-Type: application/json

{
  "event": "order.status_changed",
  "order_id": "550e8400-e29b-41d4-a716-446655440500",
  "new_status": "confirmed",
  "timestamp": "2025-11-15T10:35:00Z"
}
```

---

## Pagination

Default page size: 20  
Max page size: 100

**Query Parameters:**
- `page=1` - Page number
- `page_size=50` - Items per page

**Response:**
```json
{
  "count": 128,
  "next": "http://api.example.com/api/products/?page=2",
  "previous": null,
  "results": [...]
}
```

---

**API Version:** 1.0  
**Base URL:** `https://api.travelease.local/api/`  
**Authentication:** JWT (Bearer token)  
**Date:** November 15, 2025
