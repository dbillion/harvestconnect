from rest_framework import viewsets, status, permissions, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError
from django.utils.text import slugify
from django_filters.rest_framework import DjangoFilterBackend
import uuid

from .models import (
    UserProfile, Category, BlogPost, Product, Review, Order, Artist
)
from .serializers import (
    UserProfileSerializer, CategorySerializer, BlogPostSerializer,
    ProductSerializer, ReviewSerializer, OrderSerializer, ArtistSerializer,
    UserSerializer
)
from .permissions import IsOwnerOrReadOnly, IsSellerOrReadOnly


class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    """API endpoint for product and blog categories"""
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    lookup_field = 'slug'


class BlogPostViewSet(viewsets.ModelViewSet):
    """API endpoint for blog posts"""
    queryset = BlogPost.objects.filter(published=True)
    serializer_class = BlogPostSerializer
    lookup_field = 'slug'
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'featured']
    search_fields = ['title', 'excerpt', 'content']
    ordering_fields = ['created_at', 'views']
    ordering = ['-created_at']
    permission_classes = [IsOwnerOrReadOnly]
    
    def perform_create(self, serializer):
        serializer.save(author=self.request.user)
    
    @action(detail=True, methods=['post'])
    def increment_views(self, request, slug=None):
        """Increment view count for a blog post"""
        blog_post = self.get_object()
        blog_post.views += 1
        blog_post.save()
        return Response({'views': blog_post.views})


class ProductViewSet(viewsets.ModelViewSet):
    """API endpoint for marketplace products"""
    queryset = Product.objects.filter(status='active')
    serializer_class = ProductSerializer
    lookup_field = 'slug'
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'status', 'seller']
    search_fields = ['title', 'description']
    ordering_fields = ['price', 'rating', 'created_at']
    ordering = ['-created_at']
    permission_classes = [IsSellerOrReadOnly]
    
    def perform_create(self, serializer):
        serializer.save(seller=self.request.user)
    
    @action(detail=True, methods=['get'])
    def reviews(self, request, slug=None):
        """Get reviews for a product"""
        product = self.get_object()
        reviews = product.reviews.all()
        serializer = ReviewSerializer(reviews, many=True)
        return Response(serializer.data)


class ReviewViewSet(viewsets.ModelViewSet):
    """API endpoint for product reviews"""
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['product', 'rating']
    
    def perform_create(self, serializer):
        serializer.save(reviewer=self.request.user)


class OrderViewSet(viewsets.ModelViewSet):
    """API endpoint for orders"""
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['status', 'buyer']
    ordering = ['-created_at']
    
    def get_queryset(self):
        """Users can only see their own orders"""
        user = self.request.user
        if user.is_staff:
            return Order.objects.all()
        return Order.objects.filter(buyer=user)
    
    def perform_create(self, serializer):
        # Generate unique order ID
        order_id = f"HC-{uuid.uuid4().hex[:10].upper()}"
        serializer.save(buyer=self.request.user, order_id=order_id)


class ArtistViewSet(viewsets.ReadOnlyModelViewSet):
    """API endpoint for featured artists"""
    queryset = Artist.objects.filter(featured=True)
    serializer_class = ArtistSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['name', 'specialty']


class UserProfileViewSet(viewsets.ViewSet):
    """API endpoint for user profiles"""
    permission_classes = [permissions.IsAuthenticated]
    
    @action(detail=False, methods=['get', 'put'])
    def me(self, request):
        """Get or update current user's profile"""
        profile, _ = UserProfile.objects.get_or_create(user=request.user)
        
        if request.method == 'PUT':
            serializer = UserProfileSerializer(profile, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        serializer = UserProfileSerializer(profile)
        return Response(serializer.data)
