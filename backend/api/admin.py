from django.contrib import admin
from .models import UserProfile, Category, BlogPost, Product, Review, Order, Artist


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'role', 'is_verified', 'faith_based', 'created_at')
    list_filter = ('role', 'is_verified', 'faith_based', 'created_at')
    search_fields = ('user__email', 'location')


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug')
    prepopulated_fields = {'slug': ('name',)}
    search_fields = ('name',)


@admin.register(BlogPost)
class BlogPostAdmin(admin.ModelAdmin):
    list_display = ('title', 'author', 'category', 'featured', 'published', 'created_at')
    list_filter = ('category', 'featured', 'published', 'created_at')
    prepopulated_fields = {'slug': ('title',)}
    search_fields = ('title', 'content')
    readonly_fields = ('views', 'created_at', 'updated_at')


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('title', 'seller', 'category', 'price', 'status', 'rating', 'created_at')
    list_filter = ('status', 'category', 'created_at', 'rating')
    prepopulated_fields = {'slug': ('title',)}
    search_fields = ('title', 'description')
    readonly_fields = ('rating', 'reviews_count', 'created_at', 'updated_at')


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ('reviewer', 'product', 'rating', 'created_at')
    list_filter = ('rating', 'created_at')
    search_fields = ('product__title', 'reviewer__email', 'comment')
    readonly_fields = ('created_at', 'updated_at')


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('order_id', 'buyer', 'total_amount', 'status', 'created_at')
    list_filter = ('status', 'created_at', 'payment_method')
    search_fields = ('order_id', 'buyer__email')
    readonly_fields = ('order_id', 'created_at', 'updated_at')


@admin.register(Artist)
class ArtistAdmin(admin.ModelAdmin):
    list_display = ('name', 'specialty', 'user', 'featured', 'created_at')
    list_filter = ('featured', 'created_at')
    search_fields = ('name', 'specialty')
