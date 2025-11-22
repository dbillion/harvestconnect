# TravelEase - Technical Specifications & Implementation Guide

## Django Models Schema

```python
# models.py

from django.db import models
from django.contrib.auth.models import User as DjangoUser
from django.core.validators import MinValueValidator, MaxValueValidator
import uuid

# ============================================================================
# USER MODELS
# ============================================================================

class User(models.Model):
    """Extended user model with social authentication support"""
    USER_TYPE_CHOICES = [
        ('farmer', 'Farmer'),
        ('buyer', 'Buyer'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=150)
    last_name = models.CharField(max_length=150)
    phone_number = models.CharField(max_length=20, blank=True)
    user_type = models.CharField(max_length=10, choices=USER_TYPE_CHOICES)
    is_active = models.BooleanField(default=True)
    django_user = models.OneToOneField(DjangoUser, on_delete=models.CASCADE, related_name='travelease_user')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'user'
        indexes = [
            models.Index(fields=['email']),
            models.Index(fields=['user_type']),
        ]
    
    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.email})"


class Profile(models.Model):
    """User profile with additional information"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    bio = models.TextField(blank=True)
    avatar_url = models.URLField(blank=True)
    church_member_since = models.DateField(null=True, blank=True)
    verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'profile'
    
    def __str__(self):
        return f"Profile of {self.user.email}"


class Address(models.Model):
    """Multiple addresses per user"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    profile = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name='addresses')
    street_address = models.CharField(max_length=255)
    city = models.CharField(max_length=100)
    postal_code = models.CharField(max_length=20)
    country = models.CharField(max_length=100)
    is_primary = models.BooleanField(default=False)
    
    class Meta:
        db_table = 'address'
    
    def __str__(self):
        return f"{self.street_address}, {self.city}"


# ============================================================================
# FARMER MODELS
# ============================================================================

class Farmer(models.Model):
    """Farmer profile with farm details"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='farmer_profile')
    farm_name = models.CharField(max_length=255)
    farm_description = models.TextField()
    farm_location = models.CharField(max_length=255)
    contact_info = models.JSONField(default=dict)
    verified_farmer = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'farmer'
    
    def __str__(self):
        return self.farm_name


# ============================================================================
# PRODUCT MODELS
# ============================================================================

class ProductCategory(models.Model):
    """Product categories"""
    CATEGORY_CHOICES = [
        ('fruits', 'Fruits'),
        ('vegetables', 'Vegetables'),
        ('honey', 'Honey & Preserves'),
        ('dairy', 'Dairy Products'),
        ('grains', 'Grains & Seeds'),
        ('other', 'Other'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100, choices=CATEGORY_CHOICES, unique=True)
    description = models.TextField(blank=True)
    
    class Meta:
        db_table = 'product_category'
    
    def __str__(self):
        return self.name


class Product(models.Model):
    """Farm products"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    farmer = models.ForeignKey(Farmer, on_delete=models.CASCADE, related_name='products')
    name = models.CharField(max_length=255)
    description = models.TextField()
    category = models.ForeignKey(ProductCategory, on_delete=models.SET_NULL, null=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    unit = models.CharField(max_length=50)  # kg, liter, piece, etc.
    quantity_available = models.IntegerField(validators=[MinValueValidator(0)])
    seasonal_availability = models.JSONField(default=dict)  # {"spring": true, "summer": true, ...}
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'product'
        indexes = [
            models.Index(fields=['farmer', 'category']),
            models.Index(fields=['created_at']),
        ]
    
    def __str__(self):
        return f"{self.name} by {self.farmer.farm_name}"


class ProductImage(models.Model):
    """Product images"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='images')
    image_url = models.URLField()
    display_order = models.IntegerField(default=0)
    
    class Meta:
        db_table = 'product_image'
    
    def __str__(self):
        return f"Image for {self.product.name}"


# ============================================================================
# SERVICE MODELS
# ============================================================================

class ServiceCategory(models.Model):
    """Service categories"""
    CATEGORY_CHOICES = [
        ('horse_therapy', 'Horse Therapy'),
        ('farm_experience', 'Farm Experience'),
        ('nature_tour', 'Nature Tour'),
        ('childcare', 'Children Activities'),
        ('other', 'Other Services'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100, choices=CATEGORY_CHOICES, unique=True)
    description = models.TextField(blank=True)
    
    class Meta:
        db_table = 'service_category'
    
    def __str__(self):
        return self.name


class Service(models.Model):
    """Farmer services"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    farmer = models.ForeignKey(Farmer, on_delete=models.CASCADE, related_name='services')
    name = models.CharField(max_length=255)
    description = models.TextField()
    category = models.ForeignKey(ServiceCategory, on_delete=models.SET_NULL, null=True)
    price_base = models.DecimalField(max_digits=10, decimal_places=2)
    service_details = models.JSONField(default=dict)  # duration, max_participants, etc.
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'service'
    
    def __str__(self):
        return f"{self.name} by {self.farmer.farm_name}"


class ServiceImage(models.Model):
    """Service images"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    service = models.ForeignKey(Service, on_delete=models.CASCADE, related_name='images')
    image_url = models.URLField()
    display_order = models.IntegerField(default=0)
    
    class Meta:
        db_table = 'service_image'


# ============================================================================
# ORDER MODELS
# ============================================================================

class Order(models.Model):
    """Purchase orders"""
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('processing', 'Processing'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]
    
    ORDER_TYPE_CHOICES = [
        ('product', 'Product Order'),
        ('service', 'Service Booking'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='orders')
    order_date = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    order_type = models.CharField(max_length=20, choices=ORDER_TYPE_CHOICES)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    special_requests = models.TextField(blank=True)
    include_donation = models.BooleanField(default=False)
    donation_percentage = models.DecimalField(max_digits=5, decimal_places=2, default=0, validators=[MinValueValidator(0), MaxValueValidator(100)])
    delivery_date = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'order'
        indexes = [
            models.Index(fields=['user', 'status']),
            models.Index(fields=['order_date']),
        ]
    
    def __str__(self):
        return f"Order {self.id} - {self.status}"


class OrderItem(models.Model):
    """Order line items"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.SET_NULL, null=True, blank=True)
    service = models.ForeignKey(Service, on_delete=models.SET_NULL, null=True, blank=True)
    quantity = models.IntegerField(validators=[MinValueValidator(1)])
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)
    
    class Meta:
        db_table = 'order_item'
    
    def __str__(self):
        return f"Item in Order {self.order.id}"


# ============================================================================
# DONATION MODELS
# ============================================================================

class CharityRecipient(models.Model):
    """Charity recipients for donations"""
    RECIPIENT_TYPE_CHOICES = [
        ('elderly', 'Elderly Church Members'),
        ('family', 'Families in Need'),
        ('organization', 'Charity Organization'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    description = models.TextField()
    contact_info = models.JSONField(default=dict)
    recipient_type = models.CharField(max_length=20, choices=RECIPIENT_TYPE_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'charity_recipient'
    
    def __str__(self):
        return self.name


class Donation(models.Model):
    """Donation tracking"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='donations')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    recipient = models.ForeignKey(CharityRecipient, on_delete=models.SET_NULL, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'donation'
    
    def __str__(self):
        return f"Donation of {self.amount} to {self.recipient.name if self.recipient else 'General'}"


# ============================================================================
# REVIEW MODELS
# ============================================================================

class Review(models.Model):
    """Farmer reviews"""
    RATING_CHOICES = [
        (1, 'Poor'),
        (2, 'Fair'),
        (3, 'Good'),
        (4, 'Very Good'),
        (5, 'Excellent'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    buyer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reviews_written')
    farmer = models.ForeignKey(Farmer, on_delete=models.CASCADE, related_name='reviews')
    rating = models.IntegerField(choices=RATING_CHOICES)
    comment = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'review'
        unique_together = ['buyer', 'farmer']
    
    def __str__(self):
        return f"Review of {self.farmer.farm_name} by {self.buyer.email}"
```

---

## Django Settings Configuration

```python
# settings.py - Authentication Configuration

# Django-allauth Configuration
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    
    'rest_framework',
    'rest_framework.authtoken',
    'corsheaders',
    'allauth',
    'allauth.account',
    'allauth.socialaccount',
    'allauth.socialaccount.providers.google',
    'drf_spectacular',
    
    'travelease.apps.TravelEaseConfig',
]

# Authentication Backends
AUTHENTICATION_BACKENDS = [
    'django.contrib.auth.backends.ModelBackend',
    'allauth.account.auth_backends.AuthenticationBackend',
]

# JWT Configuration
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
        'rest_framework.authentication.SessionAuthentication',
    ],
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 20,
    'DEFAULT_FILTER_BACKENDS': [
        'django_filters.rest_framework.DjangoFilterBackend',
        'rest_framework.filters.SearchFilter',
        'rest_framework.filters.OrderingFilter',
    ],
    'DEFAULT_SCHEMA_CLASS': 'drf_spectacular.openapi.AutoSchema',
}

# Google OAuth Settings
SOCIALACCOUNT_PROVIDERS = {
    'google': {
        'SCOPE': [
            'profile',
            'email',
        ],
        'AUTH_PARAMS': {
            'access_type': 'online',
        },
        'OAUTH_PKCE_ENABLED': True,
        'FETCH_USERINFO': True,
    }
}

# Email Backend
EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'  # For development

# CORS Settings
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://localhost:8000",
]

# Database
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.getenv('DB_NAME', 'neondb'),
        'USER': os.getenv('DB_USER'),
        'PASSWORD': os.getenv('DB_PASSWORD'),
        'HOST': os.getenv('DB_HOST'),
        'PORT': os.getenv('DB_PORT', '5432'),
        'CONN_MAX_AGE': 600,
    }
}
```

---

## Serializers Example

```python
# serializers.py

from rest_framework import serializers
from django.contrib.auth.models import User as DjangoUser
from .models import User, Profile, Farmer, Product, Order

class UserSerializer(serializers.ModelSerializer):
    profile = serializers.SerializerMethodField()
    farmer_profile = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name', 'phone_number', 'user_type', 'profile', 'farmer_profile']
        read_only_fields = ['id']
    
    def get_profile(self, obj):
        try:
            return ProfileSerializer(obj.profile).data
        except:
            return None
    
    def get_farmer_profile(self, obj):
        if obj.user_type == 'farmer':
            try:
                return FarmerSerializer(obj.farmer_profile).data
            except:
                return None
        return None


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ['id', 'bio', 'avatar_url', 'church_member_since', 'verified']


class ProductSerializer(serializers.ModelSerializer):
    farmer_name = serializers.CharField(source='farmer.farm_name', read_only=True)
    category_display = serializers.CharField(source='get_category_display', read_only=True)
    
    class Meta:
        model = Product
        fields = ['id', 'farmer', 'farmer_name', 'name', 'description', 'category', 'category_display', 'price', 'unit', 'quantity_available', 'created_at']
        read_only_fields = ['id', 'created_at']


class OrderSerializer(serializers.ModelSerializer):
    items = serializers.SerializerMethodField()
    
    class Meta:
        model = Order
        fields = ['id', 'user', 'order_date', 'status', 'order_type', 'total_amount', 'items', 'created_at']
        read_only_fields = ['id', 'order_date', 'created_at']
```

---

## API Views Example

```python
# views.py

from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from allauth.socialaccount.models import SocialAccount
from .models import User, Farmer, Product, Order
from .serializers import UserSerializer, FarmerSerializer, ProductSerializer, OrderSerializer

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    @action(detail=False, methods=['get'])
    def me(self, request):
        """Get current user"""
        user = request.user
        serializer = self.get_serializer(user)
        return Response(serializer.data)


class GoogleOAuthView(views.APIView):
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        """Handle Google OAuth callback"""
        try:
            # Get token from request
            token = request.data.get('token')
            
            # Verify with Google
            id_info = id_token.verify_oauth2_token(token, requests.Request(), GOOGLE_CLIENT_ID)
            
            # Check if user exists
            try:
                user = User.objects.get(email=id_info['email'])
            except User.DoesNotExist:
                # Create new user
                django_user = DjangoUser.objects.create_user(
                    username=id_info['email'],
                    email=id_info['email']
                )
                user = User.objects.create(
                    django_user=django_user,
                    email=id_info['email'],
                    first_name=id_info.get('given_name', ''),
                    last_name=id_info.get('family_name', ''),
                    user_type='buyer'
                )
                Profile.objects.create(user=user, avatar_url=id_info.get('picture'))
            
            # Generate JWT tokens
            refresh = RefreshToken.for_user(user.django_user)
            
            return Response({
                'access': str(refresh.access_token),
                'refresh': str(refresh),
                'user': UserSerializer(user).data
            })
        
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_401_UNAUTHORIZED
            )


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['category', 'farmer']
    search_fields = ['name', 'description']
```

---

## Environment Variables (.env)

```bash
# Database
DB_NAME=neondb
DB_USER=your_neon_user
DB_PASSWORD=your_neon_password
DB_HOST=your_neon_host
DB_PORT=5432

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Django
SECRET_KEY=your_django_secret_key
DEBUG=False
ALLOWED_HOSTS=localhost,127.0.0.1,yourdomain.com

# JWT
SIMPLE_JWT_ACCESS_TOKEN_LIFETIME=24h
SIMPLE_JWT_REFRESH_TOKEN_LIFETIME=30d

# Email
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_HOST_USER=your_email@gmail.com
EMAIL_HOST_PASSWORD=your_app_password

# Stripe (future)
STRIPE_PUBLIC_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
```

---

## Installation & Setup Instructions

### 1. Project Initialization
```bash
# Create project directory
mkdir travelease && cd travelease

# Initialize uv project
uv init --python 3.11

# Create virtual environment with uv
uv venv

# Activate environment
source .venv/bin/activate  # Unix/Mac
# or
.venv\Scripts\activate  # Windows
```

### 2. Install Dependencies
```bash
# Create pyproject.toml with dependencies
uv pip install \
    django==4.2 \
    djangorestframework==3.14 \
    django-allauth==0.57 \
    djangorestframework-simplejwt==5.3 \
    django-cors-headers==4.3 \
    psycopg2-binary==2.9 \
    drf-spectacular==0.27 \
    python-dotenv==1.0 \
    google-auth==2.25
```

### 3. Django Project Setup
```bash
# Create Django project
django-admin startproject travelease_config .

# Create app
python manage.py startapp travelease

# Create migrations
python manage.py makemigrations travelease

# Apply migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser
```

### 4. Run Development Server
```bash
python manage.py runserver
```

---

**Version:** 1.0  
**Last Updated:** November 15, 2025
