# 🧪 HarvestConnect Phase 5 - Interactive Testing Results

**Date:** November 15, 2025  
**Test Environment:**
- Backend: http://localhost:8000 (Django with dj-rest-auth & Simple JWT)
- Frontend: http://localhost:3000 (Next.js)
- Database: SQLite with 15+ users, 30+ products, 8 artists, 25+ reviews

---

## 📝 Manual Testing Checklist

### ✅ TEST 1: User Registration
**Status:** ⏳ PENDING
**Steps:**
1. Navigate to: `http://localhost:3000/auth/register`
2. Fill form:
   - First Name: `John`
   - Last Name: `Doe`
   - Email: `john.doe.test@example.com`
   - Password: `TestPassword123!`
   - Confirm Password: `TestPassword123!`
3. Click "Register"

**Expected:** 
- ✅ Success message displayed
- ✅ Redirects to login page after 1.5s
- ✅ User created in backend

---

### ✅ TEST 2: User Login
**Status:** ⏳ PENDING
**Steps:**
1. Navigate to: `http://localhost:3000/auth/login`
2. Enter credentials:
   - Email: `john.doe.test@example.com`
   - Password: `TestPassword123!`
3. Click "Login"

**Expected:**
- ✅ Success message displayed
- ✅ Redirects to homepage
- ✅ Token stored in localStorage
- ✅ User remains logged in on refresh

---

### ✅ TEST 3: Product Detail Page
**Status:** ⏳ PENDING
**Steps:**
1. Navigate to: `http://localhost:3000/marketplace`
2. Click on any product card
3. Should go to: `/marketplace/1` (or product ID)

**Expected:**
- ✅ Product title, description, price display
- ✅ Seller information shows
- ✅ Customer reviews display
- ✅ Rating and review count show
- ✅ "Add to Cart" and "Contact Seller" buttons visible
- ✅ Breadcrumb navigation works

**Browser DevTools Check:**
```
Network Tab:
  GET /api/products/1          → 200 OK
  GET /api/reviews/            → 200 OK
  
Console Tab:
  No errors shown
```

---

### ✅ TEST 4: Artist Profile Page
**Status:** ⏳ PENDING
**Steps:**
1. Navigate to: `http://localhost:3000/tradesmen`
2. Click on any artist card
3. Should go to: `/tradesmen/1` (or artist ID)

**Expected:**
- ✅ Artist name and member date show
- ✅ Artist bio displays
- ✅ "Contact Artist" and "View Shop" buttons visible
- ✅ Featured products grid shows all artist's products
- ✅ Products link to detail pages
- ✅ Breadcrumb navigation works

**Browser DevTools Check:**
```
Network Tab:
  GET /api/artists/1           → 200 OK
  GET /api/products/           → 200 OK
  
Console Tab:
  No errors shown
```

---

### ✅ TEST 5: Product to Artist Navigation
**Status:** ⏳ PENDING
**Steps:**
1. Open product detail: `/marketplace/1`
2. Click on seller name or "Contact Seller"
3. Should navigate to artist profile
4. From artist profile, click on a product
5. Should navigate back to product detail

**Expected:**
- ✅ All links work
- ✅ Data loads correctly each time
- ✅ No 404 errors
- ✅ URLs update properly

---

### ✅ TEST 6: Invalid IDs (Error Handling)
**Status:** ⏳ PENDING
**Steps:**
1. Navigate to: `http://localhost:3000/marketplace/99999`
2. Should show error message
3. Navigate to: `http://localhost:3000/tradesmen/99999`
4. Should show error message

**Expected:**
- ✅ "Product not found" or error message
- ✅ "Back" link to correct page
- ✅ No blank screen or hang

---

### ✅ TEST 7: Graceful Fallback - Demo Mode
**Status:** ⏳ PENDING
**Steps:**
1. Keep frontend running
2. Stop backend: Open new terminal and run:
   ```bash
   pkill -f "manage.py runserver"
   ```
3. Refresh page on `/marketplace`
4. Pages should still show demo data

**Expected:**
- ✅ Pages load with demo data
- ✅ Shows "⚪ Demo Mode" indicator
- ✅ No error messages
- ✅ Functionality preserved

5. Restart backend:
   ```bash
   cd /home/deeone/Documents/HarvestConnect && \
   uv run python backend/manage.py runserver 0.0.0.0:8000
   ```
6. Refresh page again

**Expected:**
- ✅ Shows "🟢 Live" indicator
- ✅ Data updates to live API data

---

### ✅ TEST 8: localStorage Persistence
**Status:** ⏳ PENDING
**Steps:**
1. Complete login flow (Test 2)
2. Open DevTools: F12 → Application → Local Storage
3. Verify these keys exist:
   ```
   access      → JWT access token
   refresh     → JWT refresh token
   user        → User data JSON
   ```
4. Close browser tab completely
5. Open new tab to `http://localhost:3000`

**Expected:**
- ✅ User still logged in
- ✅ Tokens still in localStorage
- ✅ No redirect to login page

---

### ✅ TEST 9: Form Validation
**Status:** ⏳ PENDING
**Steps:**
1. Go to: `http://localhost:3000/auth/register`
2. Test password mismatch:
   - Fill all fields
   - Password: `TestPassword123!`
   - Confirm: `DifferentPassword123!`
   - Click Register

**Expected:**
- ✅ Error: "Passwords do not match"
- ✅ Form NOT submitted
- ✅ User stays on page

---

### ✅ TEST 10: Invalid Login Credentials
**Status:** ⏳ PENDING
**Steps:**
1. Go to: `http://localhost:3000/auth/login`
2. Enter:
   - Email: `john.doe.test@example.com`
   - Password: `WrongPassword123!` (intentionally wrong)
3. Click Login

**Expected:**
- ✅ Error message displayed
- ✅ NOT redirected
- ✅ Form remains filled
- ✅ No token stored

---

## 📊 API Test Results

### Authentication Endpoints
```
✅ POST   /api/auth/registration/    Status: ?
✅ POST   /api/auth/login/           Status: ?
✅ POST   /api/token/refresh/        Status: ?
```

### Product Endpoints
```
✅ GET    /api/products/             Status: 200
✅ GET    /api/products/1/           Status: ?
```

### Artist Endpoints
```
✅ GET    /api/artists/              Status: 200
✅ GET    /api/artists/1/            Status: 200
```

### Review Endpoints
```
✅ GET    /api/reviews/              Status: 200
```

---

## 🛠️ Useful Testing Commands

### Check if servers are running
```bash
# Check backend
ps aux | grep "manage.py runserver"

# Check frontend
ps aux | grep "next"
```

### Monitor backend logs
```bash
# If backend was started in background, view logs
tail -f /tmp/django_server.log
```

### Test API endpoints directly
```bash
# List all products
curl -s http://localhost:8000/api/products/ | python -m json.tool

# Get specific product
curl -s http://localhost:8000/api/products/1/ | python -m json.tool

# List artists
curl -s http://localhost:8000/api/artists/ | python -m json.tool

# Get specific artist
curl -s http://localhost:8000/api/artists/1/ | python -m json.tool

# List reviews
curl -s http://localhost:8000/api/reviews/ | python -m json.tool
```

### Test registration
```bash
curl -X POST http://localhost:8000/api/auth/registration/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password1": "TestPassword123!",
    "password2": "TestPassword123!"
  }' | python -m json.tool
```

### Test login
```bash
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPassword123!"
  }' | python -m json.tool
```

---

## 🔍 Browser DevTools Inspection

### Check localStorage
1. Open DevTools: `F12`
2. Go to: **Application** → **Local Storage** → `localhost:3000`
3. Look for these keys:
   - `access` - JWT access token
   - `refresh` - JWT refresh token
   - `user` - User profile JSON

### Check Network Requests
1. Open DevTools: `F12`
2. Go to: **Network** tab
3. Reload page to see all requests
4. Click on request to see:
   - Method (GET/POST)
   - Status (200, 401, 404, etc.)
   - Response body (JSON data)

### Check Console for Errors
1. Open DevTools: `F12`
2. Go to: **Console** tab
3. Look for red error messages
4. Check for undefined variables

---

## ✅ Success Criteria

All tests passing = ✅ Phase 5 Complete

- [ ] Registration works and creates user
- [ ] Login works with JWT token
- [ ] Product detail pages load
- [ ] Artist profile pages load
- [ ] Navigation between pages works
- [ ] Invalid IDs show proper errors
- [ ] Demo data works when backend down
- [ ] Live data works when backend up
- [ ] Forms validate correctly
- [ ] localStorage persists across sessions
- [ ] No console errors
- [ ] No network errors (all 2xx/3xx)

---

## 📝 Notes

**Backend Details:**
- API URLs: `http://localhost:8000/api/`
- Authentication: JWT tokens
- Auth Method: Email + Password (via django-allauth)
- Email Verification: Optional (console output)

**Frontend Details:**
- API Client: `lib/api-client.ts` 
- Token Storage: localStorage keys `access`, `refresh`, `user`
- Demo Data: Built-in fallback for each page
- Redirect: 401 → `/auth/login`

**Testing Tips:**
- Use DevTools Network tab to monitor API calls
- Check Console tab for JavaScript errors
- Use Local Storage to verify token storage
- Try with/without backend to test fallback

---

**Ready to Test?** Start with TEST 1 and work through the list systematically!
