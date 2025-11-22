from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from .models import (
    UserProfile, Category, BlogPost, Product, Review, Order, Artist
)


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['id', 'role', 'bio', 'avatar', 'phone', 'location', 'is_verified', 'faith_based']
        read_only_fields = ['id', 'is_verified']


class UserSerializer(serializers.ModelSerializer):
    profile = UserProfileSerializer(read_only=True)
    
    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name', 'profile']
        read_only_fields = ['id']


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True,
        required=True,
        validators=[validate_password]
    )
    password2 = serializers.CharField(write_only=True, required=True)
    first_name = serializers.CharField(required=False, allow_blank=True)
    last_name = serializers.CharField(required=False, allow_blank=True)
    role = serializers.CharField(required=False, default='buyer')
    
    class Meta:
        model = User
        fields = ('email', 'first_name', 'last_name', 'password', 'password2', 'role')
    
    def validate(self, data):
        if data['password'] != data.pop('password2'):
            raise serializers.ValidationError({"password": "Passwords must match."})
        return data
    
    def create(self, validated_data):
        role = validated_data.pop('role', 'buyer')
        user = User.objects.create_user(
            username=validated_data['email'],
            email=validated_data['email'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            password=validated_data['password']
        )
        UserProfile.objects.create(user=user, role=role)
        return user


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'description', 'icon']


class BlogPostSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)
    author_id = serializers.PrimaryKeyRelatedField(read_only=True)
    
    class Meta:
        model = BlogPost
        fields = [
            'id', 'title', 'slug', 'excerpt', 'content', 'category',
            'author', 'author_id', 'featured', 'image', 'views', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'slug', 'created_at', 'updated_at', 'views']


class ProductSerializer(serializers.ModelSerializer):
    seller = UserSerializer(read_only=True)
    category = CategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(),
        source='category',
        write_only=True,
        required=False
    )
    
    class Meta:
        model = Product
        fields = [
            'id', 'seller', 'title', 'slug', 'description', 'category',
            'category_id', 'price', 'quantity', 'status', 'image', 'images',
            'rating', 'reviews_count', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'slug', 'rating', 'reviews_count', 'created_at', 'updated_at']


class ReviewSerializer(serializers.ModelSerializer):
    reviewer = UserSerializer(read_only=True)
    
    class Meta:
        model = Review
        fields = ['id', 'product', 'reviewer', 'rating', 'title', 'comment', 'helpful_count', 'created_at']
        read_only_fields = ['id', 'created_at', 'helpful_count']


class OrderSerializer(serializers.ModelSerializer):
    buyer = UserSerializer(read_only=True)
    
    class Meta:
        model = Order
        fields = [
            'id', 'order_id', 'buyer', 'products', 'total_amount',
            'status', 'shipping_address', 'payment_method', 'notes', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'order_id', 'created_at', 'updated_at']


class ArtistSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = Artist
        fields = ['id', 'user', 'name', 'specialty', 'bio', 'profile_image', 'portfolio_url', 'social_media', 'featured', 'created_at']
        read_only_fields = ['id', 'created_at']
