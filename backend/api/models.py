from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator, MaxValueValidator
from django.utils.text import slugify


class UserProfile(models.Model):
    """Extended user profile for HarvestConnect"""
    ROLE_CHOICES = [
        ('buyer', 'Buyer'),
        ('seller', 'Seller/Vendor'),
        ('artisan', 'Artisan'),
        ('tradesman', 'Tradesman'),
        ('farmer', 'Farmer'),
    ]
    
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='buyer')
    bio = models.TextField(blank=True, null=True)
    avatar = models.ImageField(upload_to='avatars/', blank=True, null=True)
    phone = models.CharField(max_length=20, blank=True, null=True)
    location = models.CharField(max_length=255, blank=True, null=True)
    is_verified = models.BooleanField(default=False)
    faith_based = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.user.email} - {self.role}"
    
    class Meta:
        ordering = ['-created_at']


class Category(models.Model):
    """Categories for products and blog posts"""
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(unique=True)
    description = models.TextField(blank=True)
    icon = models.CharField(max_length=50, blank=True)  # Lucide icon name
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)
    
    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name_plural = 'Categories'
        ordering = ['name']


class BlogPost(models.Model):
    """Blog posts for community hub"""
    CATEGORY_CHOICES = [
        ('all-posts', 'All Posts'),
        ('stories', 'Stories'),
        ('tips-tricks', 'Tips & Tricks'),
        ('event-recaps', 'Event Recaps'),
        ('artisan-spotlights', 'Artisan Spotlights'),
    ]
    
    title = models.CharField(max_length=255)
    slug = models.SlugField(unique=True)
    excerpt = models.TextField(max_length=500)
    content = models.TextField()
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='blog_posts')
    featured = models.BooleanField(default=False)
    image = models.ImageField(upload_to='blog/')
    views = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    published = models.BooleanField(default=True)
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)
    
    def __str__(self):
        return self.title
    
    class Meta:
        ordering = ['-created_at']


class Product(models.Model):
    """Marketplace products/listings"""
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('inactive', 'Inactive'),
        ('sold', 'Sold Out'),
    ]
    
    seller = models.ForeignKey(User, on_delete=models.CASCADE, related_name='products')
    title = models.CharField(max_length=255)
    slug = models.SlugField(unique=True)
    description = models.TextField()
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, related_name='products')
    price = models.DecimalField(max_digits=10, decimal_places=2)
    quantity = models.IntegerField(default=1)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    image = models.ImageField(upload_to='products/')
    images = models.JSONField(default=list, blank=True)  # Additional images
    rating = models.FloatField(default=0, validators=[MinValueValidator(0), MaxValueValidator(5)])
    reviews_count = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)
    
    def __str__(self):
        return self.title
    
    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['slug']),
            models.Index(fields=['status', '-created_at']),
        ]


class Review(models.Model):
    """Product reviews and ratings"""
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='reviews')
    reviewer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reviews')
    rating = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)])
    title = models.CharField(max_length=200, blank=True)
    comment = models.TextField()
    helpful_count = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = ['product', 'reviewer']
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Review by {self.reviewer.email} for {self.product.title}"


class Order(models.Model):
    """Orders placed by customers"""
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('shipped', 'Shipped'),
        ('delivered', 'Delivered'),
        ('cancelled', 'Cancelled'),
    ]
    
    order_id = models.CharField(max_length=50, unique=True)
    buyer = models.ForeignKey(User, on_delete=models.PROTECT, related_name='orders')
    products = models.JSONField()  # Store product details at time of order
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    shipping_address = models.TextField()
    payment_method = models.CharField(max_length=50, blank=True)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Order {self.order_id}"
    
    class Meta:
        ordering = ['-created_at']


class Artist(models.Model):
    """Featured artists/vendors profile"""
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='artist_profile')
    name = models.CharField(max_length=255)
    specialty = models.CharField(max_length=255)
    bio = models.TextField()
    profile_image = models.ImageField(upload_to='artists/')
    portfolio_url = models.URLField(blank=True, null=True)
    social_media = models.JSONField(default=dict, blank=True)
    featured = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.name
    
    class Meta:
        ordering = ['-created_at']
