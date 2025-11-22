# HarvestConnect Phase 5 - Authentication & Dynamic Pages Testing

## 🧪 Complete Testing Guide

**Backend:** Running on `http://localhost:8000`  
**Frontend:** Running on `http://localhost:3000`  
**Database:** SQLite with seeded data (15 users, 30 products, 8 artists, 25 reviews)

---

## 📝 Test Cases

### ✅ TEST 1: User Registration Flow

**Objective:** Verify new user can register with email confirmation

**Steps:**
1. Open browser to `http://localhost:3000/auth/register`
2. Fill in the registration form:
   - First Name: `John`
   - Last Name: `Doe`
   - Email: `john.doe@example.com`
   - Password: `TestPassword123!`
   - Confirm Password: `TestPassword123!`
3. Click "Register" button
4. **Expected Results:**
   - ✅ Form submits without errors
   - ✅ "Registration successful!" message appears
   - ✅ Page redirects to `/auth/login` after 1.5 seconds
   - ✅ Email confirmation link sent (check Django console output)
   - ✅ User record created in database

**Backend Verification:**
```bash
curl -X GET http://localhost:8000/api/users/ \
  -H "Authorization: Bearer <token>"
```

---

### ✅ TEST 2: User Login Flow

**Objective:** Verify registered user can login and receive JWT token

**Steps:**
1. Go to `http://localhost:3000/auth/login`
2. Enter credentials:
   - Email: `john.doe@example.com`
   - Password: `TestPassword123!`
3. Click "Login" button
4. **Expected Results:**
   - ✅ Form submits without errors
   - ✅ "Login successful! Redirecting..." message appears
   - ✅ Page redirects to `/` (homepage) after 1.5 seconds
   - ✅ JWT token stored in localStorage (`access` and `refresh` tokens)
   - ✅ Token persists across page refreshes

**Verify Token Storage:**
Open browser DevTools > Application > Local Storage:
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "user": "{\"id\": 1, \"email\": \"john.doe@example.com\", ...}"
}
```

---

### ✅ TEST 3: Login with Invalid Credentials

**Objective:** Verify error handling for incorrect password

**Steps:**
1. Go to `http://localhost:3000/auth/login`
2. Enter credentials:
   - Email: `john.doe@example.com`
   - Password: `WrongPassword123!`
3. Click "Login" button
4. **Expected Results:**
   - ✅ Error message displayed: "Invalid credentials"
   - ✅ User NOT redirected
   - ✅ Form remains filled for correction
   - ✅ No token stored in localStorage

---

### ✅ TEST 4: Login with Non-existent Email

**Objective:** Verify error handling for unknown user

**Steps:**
1. Go to `http://localhost:3000/auth/login`
2. Enter credentials:
   - Email: `nonexistent@example.com`
   - Password: `TestPassword123!`
3. Click "Login" button
4. **Expected Results:**
   - ✅ Error message displayed
   - ✅ User NOT redirected
   - ✅ No token stored in localStorage

---

### ✅ TEST 5: Password Validation on Registration

**Objective:** Verify passwords must match

**Steps:**
1. Go to `http://localhost:3000/auth/register`
2. Fill in form:
   - First Name: `Jane`
   - Last Name: `Smith`
   - Email: `jane.smith@example.com`
   - Password: `TestPassword123!`
   - Confirm Password: `DifferentPassword123!` (mismatch)
3. Click "Register" button
4. **Expected Results:**
   - ✅ Error message: "Passwords do not match."
   - ✅ Form NOT submitted
   - ✅ No API call made

---

### ✅ TEST 6: Dynamic Product Detail Page

**Objective:** Verify product detail page loads with data from API

**Steps:**
1. Go to `http://localhost:3000/marketplace`
2. Click on any product card
3. Should navigate to `/marketplace/1` (or appropriate product ID)
4. **Expected Results:**
   - ✅ Product details display correctly:
     - Product title
     - Product description
     - Product price
     - Product rating
     - Product image (or emoji placeholder)
   - ✅ Seller information displays:
     - Seller name
     - Seller bio
     - Seller location
   - ✅ Customer reviews display:
     - Reviewer names
     - Review ratings (stars)
     - Review comments
     - Review dates
   - ✅ "Add to Cart" button visible
   - ✅ "Contact Seller" button visible
   - ✅ Breadcrumb navigation works

**Check in Network Tab (DevTools):**
```
GET /api/products/1/  → Status 200
GET /api/reviews/     → Status 200
```

---

### ✅ TEST 7: Product Detail Page - Invalid ID

**Objective:** Verify error handling for non-existent product

**Steps:**
1. Navigate directly to `http://localhost:3000/marketplace/99999`
2. **Expected Results:**
   - ✅ "Product not found" or error message displays
   - ✅ "Back to Marketplace" link is clickable
   - ✅ Clicking link returns to `/marketplace`

---

### ✅ TEST 8: Dynamic Artist Detail Page

**Objective:** Verify artist profile page loads with data from API

**Steps:**
1. Go to `http://localhost:3000/tradesmen`
2. Click on any artist card
3. Should navigate to `/tradesmen/1` (or appropriate artist ID)
4. **Expected Results:**
   - ✅ Artist profile displays correctly:
     - Artist name
     - Member since date
     - Artist bio
     - Artist featured image (placeholder)
   - ✅ Artist statistics visible
   - ✅ "Contact Artist" button visible
   - ✅ "View Shop" button visible
   - ✅ Featured products grid displays:
     - All products from this artist
     - Product cards with images, titles, prices
     - Each product links to detail page
   - ✅ Breadcrumb navigation works

**Check in Network Tab (DevTools):**
```
GET /api/artists/1/   → Status 200
GET /api/products/    → Status 200
```

---

### ✅ TEST 9: Artist Detail Page - Invalid ID

**Objective:** Verify error handling for non-existent artist

**Steps:**
1. Navigate directly to `http://localhost:3000/tradesmen/99999`
2. **Expected Results:**
   - ✅ "Artist not found" or error message displays
   - ✅ "Back to Artists & Tradesmen" link is clickable
   - ✅ Clicking link returns to `/tradesmen`

---

### ✅ TEST 10: Navigation Between Detail Pages

**Objective:** Verify you can navigate from product to seller's profile and back

**Steps:**
1. Go to `/marketplace/1` (product detail)
2. Click on seller name or "Contact Seller"
3. Should navigate to artist/seller profile
4. In artist profile, click on one of their products
5. Should navigate to that product's detail page
6. **Expected Results:**
   - ✅ All navigation works smoothly
   - ✅ No console errors
   - ✅ Data loads correctly each time
   - ✅ URL parameters update correctly

---

### ✅ TEST 11: Graceful Fallback - Demo Data

**Objective:** Verify pages show demo data if backend is unavailable

**Steps:**
1. Backend is running - verify pages show live data from API
2. Stop backend server:
   ```bash
   pkill -f "manage.py runserver"
   ```
3. Refresh page on `/marketplace`
4. **Expected Results:**
   - ✅ Page still displays products (demo data)
   - ✅ Shows "⚪ Demo Mode" indicator
   - ✅ No error messages shown to user
   - ✅ Page is still functional

5. Restart backend:
   ```bash
   cd /home/deeone/Documents/HarvestConnect && \
   uv run python backend/manage.py runserver 0.0.0.0:8000
   ```
6. Refresh page again
7. **Expected Results:**
   - ✅ Shows "🟢 Live" indicator
   - ✅ Data updates to live data from API

---

### ✅ TEST 12: Token Persistence

**Objective:** Verify JWT token persists and user stays logged in

**Steps:**
1. Complete login flow (Test 2)
2. Close and reopen browser tab
3. Go to `http://localhost:3000`
4. **Expected Results:**
   - ✅ User is still logged in
   - ✅ Token still in localStorage
   - ✅ Navigation shows appropriate user state
   - ✅ Protected pages don't redirect to login

---

### ✅ TEST 13: Token Refresh on 401

**Objective:** Verify expired access token is automatically refreshed

**Steps:**
1. Logged in user makes request to protected endpoint
2. Simulate token expiration by manually clearing `access` token from localStorage
3. Make another API request
4. **Expected Results:**
   - ✅ API automatically uses refresh token
   - ✅ New access token obtained
   - ✅ Request completes successfully
   - ✅ New access token in localStorage

---

## 🔍 API Endpoints to Verify

### Authentication Endpoints
```
POST   /api/auth/register/          → Create new user
POST   /api/auth/login/             → Get JWT tokens
POST   /api/auth/token/refresh/     → Refresh access token
GET    /api/users/                  → List users (requires auth)
```

### Product Endpoints
```
GET    /api/products/               → List all products
GET    /api/products/{id}/          → Get product details
GET    /api/reviews/                → List all reviews
GET    /api/reviews/?product_id={id}→ Get reviews for product
```

### Artist Endpoints
```
GET    /api/artists/                → List all artists
GET    /api/artists/{id}/           → Get artist details
```

---

## 🐛 Debugging Tips

### Check Console for Errors
Open DevTools Console (F12) and look for:
- ❌ TypeScript errors
- ❌ Network errors (404, 500, etc.)
- ❌ Undefined variables
- ❌ Component render errors

### Check Network Tab for API Calls
- ✅ All requests should be `2xx` or `3xx` status
- ✅ Check response bodies for data
- ✅ Verify headers include `Authorization: Bearer <token>`

### Check Backend Logs
Monitor Django console output for:
- ✅ Successful authentication attempts
- ✅ User creation logs
- ✅ Email sending logs
- ❌ Database errors
- ❌ Validation errors

### Check localStorage
DevTools > Application > Local Storage:
```javascript
// Check what's stored
console.log(localStorage.getItem('access'));
console.log(localStorage.getItem('refresh'));
console.log(localStorage.getItem('user'));

// Clear if needed (for fresh test)
localStorage.clear();
```

---

## ✅ Final Verification Checklist

- [ ] Registration works and creates user
- [ ] Email confirmation sent
- [ ] Login works with correct credentials
- [ ] Login fails with incorrect credentials
- [ ] JWT token stored in localStorage
- [ ] Product detail page loads correctly
- [ ] Product detail page shows all data
- [ ] Artist profile page loads correctly
- [ ] Artist profile page shows all data
- [ ] Invalid product ID shows error
- [ ] Invalid artist ID shows error
- [ ] Navigation between pages works
- [ ] Demo mode works when backend is down
- [ ] Live mode works when backend is up
- [ ] Token persists across page reloads
- [ ] All console shows no errors
- [ ] All network requests are 2xx status
- [ ] Forms validate correctly
- [ ] Buttons are clickable and functional
- [ ] Responsive design works on mobile
- [ ] Loading states display correctly
- [ ] Error messages are user-friendly

---

## 📊 Test Results Summary

### Phase 1: Authentication
- [ ] Registration: PASS/FAIL
- [ ] Login: PASS/FAIL
- [ ] Token Management: PASS/FAIL

### Phase 2: Dynamic Pages
- [ ] Product Detail: PASS/FAIL
- [ ] Artist Profile: PASS/FAIL
- [ ] Navigation: PASS/FAIL

### Phase 3: Error Handling
- [ ] Invalid Product ID: PASS/FAIL
- [ ] Invalid Artist ID: PASS/FAIL
- [ ] Invalid Credentials: PASS/FAIL

### Phase 4: Fallback System
- [ ] Demo Data Display: PASS/FAIL
- [ ] Live Data Display: PASS/FAIL
- [ ] Status Indicator: PASS/FAIL

---

## 🚀 Success Criteria

✅ **ALL tests should pass** for Phase 5 to be considered complete:
1. Authentication system fully functional
2. Dynamic pages load and display data correctly
3. Error handling works gracefully
4. Fallback system provides demo data
5. Token management is automatic and transparent
6. All forms validate and submit correctly
7. Navigation works smoothly
8. No console errors
9. No network errors
10. User experience is seamless

---

**Test Date:** November 15, 2025  
**Tester:** [Your Name]  
**Overall Status:** ⏳ PENDING
