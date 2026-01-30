from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from allauth.socialaccount.providers.github.views import GitHubOAuth2Adapter
from allauth.socialaccount.providers.oauth2.client import OAuth2Client
from dj_rest_auth.registration.views import SocialLoginView
from rest_framework import viewsets, status, permissions, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError
from django.db import models
from django.contrib.auth.models import User
from django.utils.text import slugify
from django_filters.rest_framework import DjangoFilterBackend
import uuid

from .models import (
    UserProfile, Category, BlogPost, Product, Review, Order, Artist, SavedItem, Project,
    ChatRoom, ChatMessage
)
from .serializers import (
    UserProfileSerializer, CategorySerializer, BlogPostSerializer,
    ProductSerializer, ReviewSerializer, OrderSerializer, ArtistSerializer,
    UserSerializer, SavedItemSerializer, ProjectSerializer,
    ChatRoomSerializer, ChatMessageSerializer
)
from .permissions import IsOwnerOrReadOnly, IsSellerOrReadOnly


class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    """API endpoint for product and blog categories"""
    queryset = Category.objects.all()
    serializer_class = CategorySerializer


class BlogPostViewSet(viewsets.ModelViewSet):
    """API endpoint for blog posts"""
    queryset = BlogPost.objects.filter(published=True)
    serializer_class = BlogPostSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'featured']
    search_fields = ['title', 'excerpt', 'content']
    ordering_fields = ['created_at', 'views']
    ordering = ['-created_at']
    permission_classes = [IsOwnerOrReadOnly]
    
    def perform_create(self, serializer):
        serializer.save(author=self.request.user)
    
    @action(detail=True, methods=['post'], permission_classes=[permissions.AllowAny])
    def increment_views(self, request, pk=None):
        """Increment view count for a blog post"""
        blog_post = self.get_object()
        blog_post.views += 1
        blog_post.save()
        return Response({'views': blog_post.views})


class ProductViewSet(viewsets.ModelViewSet):
    """API endpoint for marketplace products"""
    queryset = Product.objects.filter(status='active')
    serializer_class = ProductSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'status', 'seller']
    search_fields = ['title', 'description']
    ordering_fields = ['price', 'rating', 'created_at']
    ordering = ['-created_at']
    permission_classes = [IsSellerOrReadOnly]
    
    def perform_create(self, serializer):
        serializer.save(seller=self.request.user)
    
    @action(detail=True, methods=['get'])
    def reviews(self, request, pk=None):
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
    
    @action(detail=False, methods=['get', 'put', 'patch'])
    def me(self, request):
        """Get or update current user's profile"""
        profile, _ = UserProfile.objects.get_or_create(user=request.user)
        
        if request.method in ['PUT', 'PATCH']:
            serializer = UserProfileSerializer(profile, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                # If first_name or last_name in request data, update User model
                if 'first_name' in request.data:
                    request.user.first_name = request.data['first_name']
                if 'last_name' in request.data:
                    request.user.last_name = request.data['last_name']
                request.user.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        # For GET, include user's relevant chat discovery
        discovery = ChatRoom.objects.filter(
            models.Q(church=profile.home_church) | 
            models.Q(location=profile.location) |
            models.Q(room_type='channel')
        ).exclude(participants=request.user)[:5]

        discovery_data = ChatRoomSerializer(discovery, many=True).data
        user_data = UserSerializer(request.user).data
        user_data['discovery'] = discovery_data
        
        return Response(user_data)

    @action(detail=False, methods=['get'])
    def stats(self, request):
        """Get role-specific dashboard statistics"""
        user = request.user
        profile, _ = UserProfile.objects.get_or_create(user=user)
        role = profile.role
        
        data = {
            'role': role,
            'stats': {}
        }
        
        if role == 'buyer':
            # Spending analytics
            orders = Order.objects.filter(buyer=user, status__in=['confirmed', 'shipped', 'delivered'])
            total_spent = sum(o.total_amount for o in orders)
            
            # Simple category breakdown from JSON products list
            category_spending = {}
            for order in orders:
                for p in order.products:
                    cat = p.get('category', 'Other')
                    # If cat is a dict from serialization, get name
                    if isinstance(cat, dict): cat = cat.get('name', 'Other')
                    price = float(p.get('price', 0)) * int(p.get('quantity', 1))
                    category_spending[cat] = category_spending.get(cat, 0) + price
            
            data['stats'] = {
                'purchased_count': orders.count(),
                'total_contributions': float(total_spent) * 0.1, # 10% community rule
                'spending_total': float(total_spent),
                'category_breakdown': category_spending,
                'saved_items_count': SavedItem.objects.filter(user=user).count()
            }
            
        elif role in ['farmer', 'seller']:
            # Sales performance for their products
            products = Product.objects.filter(seller=user)
            # Find all orders containing any of their products
            # (Note: In a real app we'd have OrderItems for better indexing)
            # For now, searching JSON
            revenue = 0
            order_ids = set()
            customers = set()
            church_distribution = {}
            
            for order in Order.objects.all():
                for p in order.products:
                    # In mock system, check if product title/id matches
                    # Implementation detail depend on how we store products in JSON
                    if p.get('seller_id') == user.id:
                        revenue += float(p.get('price', 0)) * int(p.get('quantity', 1))
                        order_ids.add(order.id)
                        customers.add(order.buyer_id)
                        
                        # Church demographic
                        church = order.buyer.profile.home_church or "Independent"
                        church_distribution[church] = church_distribution.get(church, 0) + 1

            data['stats'] = {
                'revenue': revenue,
                'total_orders': len(order_ids),
                'customers': len(customers),
                'church_breakdown': church_distribution,
                'low_stock_count': products.filter(quantity__lt=10).count()
            }
            
        elif role in ['tradesman', 'artisan']:
            projects = Project.objects.filter(tradesman=user)
            completed = projects.filter(status='completed')
            mtd_earnings = sum(p.budget for p in completed if p.budget) # Simplified MTD
            
            # Group pipeline
            pipeline = {
                'inquiry': projects.filter(status='inquiry').count(),
                'in_progress': projects.filter(status='in_progress').count(),
                'completed': projects.filter(status='completed').count()
            }
            
            data['stats'] = {
                'pipeline': pipeline,
                'earnings': float(mtd_earnings),
                'project_count': projects.count(),
                'rating_avg': user.products.aggregate(models.Avg('rating'))['rating__avg'] or 5.0
            }

        elif role == 'admin':
            data['stats'] = {
                'total_users': User.objects.count(),
                'total_sales': float(sum(o.total_amount for o in Order.objects.exclude(status='cancelled'))),
                'flagged_reviews': Review.objects.filter(helpful_count__lt=0).count(), # mock flagged
                'charity_fund': float(sum(o.total_amount for o in Order.objects.exclude(status='cancelled'))) * 0.1
            }
            
        return Response(data)


class SavedItemViewSet(viewsets.ModelViewSet):
    """API endpoint for member's saved items"""
    serializer_class = SavedItemSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return SavedItem.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class ProjectViewSet(viewsets.ModelViewSet):
    """API endpoint for projects managed by tradesmen/artisans"""
    serializer_class = ProjectSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['status', 'tradesman', 'client']
    ordering = ['-created_at']
    
    def get_queryset(self):
        user = self.request.user
        if user.profile.role in ['tradesman', 'artisan']:
            return Project.objects.filter(tradesman=user)
        return Project.objects.filter(client=user)
    
    def perform_create(self, serializer):
        serializer.save(tradesman=self.request.user)


class ChatRoomViewSet(viewsets.ModelViewSet):
    """API endpoint for chat rooms (personal, group, channel)"""
    serializer_class = ChatRoomSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return self.request.user.chat_rooms.all()

    @action(detail=False, methods=['get'])
    def discovery(self, request):
        """Find rooms based on church or location"""
        user = request.user
        profile = user.profile
        rooms = ChatRoom.objects.filter(
            models.Q(church=profile.home_church) | 
            models.Q(location=profile.location)
        ).exclude(participants=user)
        return Response(ChatRoomSerializer(rooms, many=True).data)

    @action(detail=True, methods=['post'])
    def join(self, request, pk=None):
        """Join a public channel or group"""
        room = self.get_object()
        if room.room_type == 'personal':
            return Response({'error': 'Cannot join personal chat'}, status=status.HTTP_400_BAD_REQUEST)
        room.participants.add(request.user)
        return Response({'status': 'joined'})


class ChatMessageViewSet(viewsets.ModelViewSet):
    """API endpoint for messages"""
    serializer_class = ChatMessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        room_id = self.request.query_params.get('room')
        if room_id:
            return ChatMessage.objects.filter(room_id=room_id, room__participants=self.request.user)
        return ChatMessage.objects.none()


class GoogleLogin(SocialLoginView):
    adapter_class = GoogleOAuth2Adapter
    callback_url = "http://localhost:3000/auth/callback/google"
    client_class = OAuth2Client


class GitHubLogin(SocialLoginView):
    adapter_class = GitHubOAuth2Adapter
    callback_url = "http://localhost:3000/auth/callback/github"
    client_class = OAuth2Client
