from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from .models import (
    UserProfile, Category, BlogPost, Product, Review, Order, Artist, SavedItem, Project,
    ChatRoom, ChatMessage
)


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = [
            'id', 'role', 'bio', 'avatar', 'banner', 'phone', 'location', 'home_church', 
            'is_verified', 'faith_based', 'latitude', 'longitude'
        ]
        read_only_fields = ['id', 'is_verified']


class UserSerializer(serializers.ModelSerializer):
    profile = UserProfileSerializer(read_only=True)
    
    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name', 'profile']
        read_only_fields = ['id']


from dj_rest_auth.registration.serializers import RegisterSerializer as DefaultRegisterSerializer

class RegisterSerializer(DefaultRegisterSerializer):
    username = serializers.CharField(required=False, allow_blank=True)
    first_name = serializers.CharField(required=False, allow_blank=True)
    last_name = serializers.CharField(required=False, allow_blank=True)
    role = serializers.CharField(required=False, default='buyer')
    
    def validate(self, data):
        # Generate username from email if not provided
        if not data.get('username') and data.get('email'):
            data['username'] = data['email']
        return super().validate(data)

    def get_cleaned_data(self):
        data = super().get_cleaned_data()
        data['first_name'] = self.validated_data.get('first_name', '')
        data['last_name'] = self.validated_data.get('last_name', '')
        data['role'] = self.validated_data.get('role', 'buyer')
        return data

    def custom_signup(self, request, user):
        user.first_name = self.validated_data.get('first_name', '')
        user.last_name = self.validated_data.get('last_name', '')
        user.save()
        
        # Ensure UserProfile is created/updated with the correct role
        role = self.validated_data.get('role', 'buyer')
        profile, created = UserProfile.objects.get_or_create(user=user)
        profile.role = role
        profile.save()


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


class SavedItemSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    product = ProductSerializer(read_only=True)
    product_id = serializers.PrimaryKeyRelatedField(
        queryset=Product.objects.all(),
        source='product',
        write_only=True
    )

    class Meta:
        model = SavedItem
        fields = ['id', 'user', 'product', 'product_id', 'created_at']
        read_only_fields = ['id', 'created_at']


class ProjectSerializer(serializers.ModelSerializer):
    tradesman = UserSerializer(read_only=True)
    client = UserSerializer(read_only=True)
    client_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(),
        source='client',
        write_only=True,
        required=False
    )

    class Meta:
        model = Project
        fields = [
            'id', 'tradesman', 'client', 'client_id', 'title', 'description',
            'status', 'priority', 'budget', 'start_date', 'end_date', 'images',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class ChatMessageSerializer(serializers.ModelSerializer):
    sender = UserSerializer(read_only=True)

    class Meta:
        model = ChatMessage
        fields = ['id', 'room', 'sender', 'content', 'timestamp']
        read_only_fields = ['id', 'timestamp']


class ChatRoomSerializer(serializers.ModelSerializer):
    participants = UserSerializer(many=True, read_only=True)
    last_message = serializers.SerializerMethodField()

    class Meta:
        model = ChatRoom
        fields = ['id', 'name', 'room_type', 'church', 'location', 'participants', 'created_at', 'last_message']
        read_only_fields = ['id', 'created_at']

    def get_last_message(self, obj):
        last = obj.messages.order_by('-timestamp').first()
        if last:
            return ChatMessageSerializer(last).data
        return None
