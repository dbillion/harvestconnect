"""
Comprehensive pytest test suite for HarvestConnect Backend API
Tests all endpoints: Authentication, Products, Artists, Reviews, Orders
"""

import pytest
import json
from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient, APITestCase
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken

from api.models import Product, Artist, Review, Order, Category
from api.serializers import (
    ProductSerializer, ArtistSerializer, ReviewSerializer, OrderSerializer
)

User = get_user_model()


class AuthenticationTestCase(APITestCase):
    """Test suite for authentication endpoints"""
    
    def setUp(self):
        """Set up test client and test data"""
        self.client = APIClient()
        self.register_url = '/api/auth/registration/'
        self.login_url = '/api/auth/login/'
        self.token_refresh_url = '/api/auth/token/refresh/'
        
        self.user_data = {
            'email': 'testuser@example.com',
            'username': 'testuser',
            'password': 'TestPassword123!',
            'first_name': 'Test',
            'last_name': 'User',
            'role': 'buyer'
        }
    
    def test_user_registration_success(self):
        """Test successful user registration"""
        response = self.client.post(
            self.register_url,
            self.user_data,
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('user', response.data)
        self.assertEqual(response.data['user']['email'], self.user_data['email'])
    
    def test_user_registration_duplicate_email(self):
        """Test registration fails with duplicate email"""
        # Create first user
        self.client.post(self.register_url, self.user_data, format='json')
        
        # Try to register with same email
        response = self.client.post(
            self.register_url,
            self.user_data,
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    
    def test_user_registration_invalid_password(self):
        """Test registration fails with weak password"""
        invalid_data = self.user_data.copy()
        invalid_data['password'] = '123'  # Too weak
        
        response = self.client.post(
            self.register_url,
            invalid_data,
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    
    def test_user_login_success(self):
        """Test successful user login"""
        # Create user
        User.objects.create_user(
            username='testuser',
            email=self.user_data['email'],
            password=self.user_data['password'],
            first_name=self.user_data['first_name'],
            last_name=self.user_data['last_name']
        )
        
        # Login
        response = self.client.post(
            self.login_url,
            {
                'email': self.user_data['email'],
                'password': self.user_data['password']
            },
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)
    
    def test_user_login_invalid_credentials(self):
        """Test login fails with invalid credentials"""
        # Create user
        User.objects.create_user(
            username='testuser',
            email=self.user_data['email'],
            password=self.user_data['password']
        )
        
        # Try to login with wrong password
        response = self.client.post(
            self.login_url,
            {
                'email': self.user_data['email'],
                'password': 'WrongPassword123!'
            },
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
    
    def test_token_refresh(self):
        """Test token refresh endpoint"""
        # Create user and get tokens
        user = User.objects.create_user(
            username='testuser',
            email=self.user_data['email'],
            password=self.user_data['password']
        )
        refresh = RefreshToken.for_user(user)
        
        # Refresh token
        response = self.client.post(
            self.token_refresh_url,
            {'refresh': str(refresh)},
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)


class ProductEndpointTestCase(APITestCase):
    """Test suite for product endpoints"""
    
    def setUp(self):
        """Set up test client and test data"""
        self.client = APIClient()
        self.products_url = '/api/products/'
        
        # Create a test user
        self.user = User.objects.create_user(
            username='seller',
            email='seller@example.com',
            password='TestPassword123!',
            first_name='Test',
            last_name='Seller'
        )
        
        # Create a test category
        self.category = Category.objects.create(name='Handmade')
        
        # Create test products
        self.product1 = Product.objects.create(
            seller=self.user,
            title='Handmade Basket',
            description='Beautiful woven basket',
            category=self.category,
            price=29.99,
            quantity=10,
            status='active'
        )
        
        self.product2 = Product.objects.create(
            seller=self.user,
            title='Ceramic Pot',
            description='Hand-thrown ceramic pot',
            category=self.category,
            price=49.99,
            quantity=5,
            status='active'
        )
    
    def test_list_products(self):
        """Test listing all products"""
        response = self.client.get(self.products_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(response.data['results']), 2)
    
    def test_list_products_with_search(self):
        """Test searching products"""
        response = self.client.get(
            self.products_url,
            {'search': 'Basket'}
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)
        self.assertEqual(response.data['results'][0]['title'], 'Handmade Basket')
    
    def test_list_products_with_filter(self):
        """Test filtering products by category"""
        response = self.client.get(
            self.products_url,
            {'category': self.category.id}
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(response.data['results']), 2)
    
    def test_retrieve_product_detail(self):
        """Test retrieving single product detail"""
        response = self.client.get(
            f'{self.products_url}{self.product1.id}/'
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], self.product1.title)
        self.assertEqual(response.data['price'], str(self.product1.price))
    
    def test_create_product_authenticated(self):
        """Test creating product as authenticated seller"""
        # Authenticate as user
        self.client.force_authenticate(user=self.user)
        
        product_data = {
            'title': 'New Product',
            'description': 'A new product',
            'category': self.category.id,
            'price': 39.99,
            'quantity': 15,
            'status': 'active'
        }
        
        response = self.client.post(
            self.products_url,
            product_data,
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['title'], product_data['title'])
    
    def test_create_product_unauthenticated(self):
        """Test creating product fails without authentication"""
        product_data = {
            'title': 'New Product',
            'description': 'A new product',
            'category': self.category.id,
            'price': 39.99,
            'quantity': 15,
            'status': 'active'
        }
        
        response = self.client.post(
            self.products_url,
            product_data,
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
    
    def test_update_product_owner(self):
        """Test updating product as owner"""
        self.client.force_authenticate(user=self.user)
        
        update_data = {
            'title': 'Updated Basket',
            'price': 34.99
        }
        
        response = self.client.patch(
            f'{self.products_url}{self.product1.id}/',
            update_data,
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], 'Updated Basket')
    
    def test_delete_product_owner(self):
        """Test deleting product as owner"""
        self.client.force_authenticate(user=self.user)
        
        response = self.client.delete(
            f'{self.products_url}{self.product1.id}/'
        )
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        
        # Verify deleted
        self.assertFalse(Product.objects.filter(id=self.product1.id).exists())


class ArtistEndpointTestCase(APITestCase):
    """Test suite for artist endpoints"""
    
    def setUp(self):
        """Set up test client and test data"""
        self.client = APIClient()
        self.artists_url = '/api/artists/'
        
        # Create test users
        self.user1 = User.objects.create_user(
            username='artist1',
            email='artist1@example.com',
            password='TestPassword123!',
            first_name='Artist',
            last_name='One'
        )
        
        self.user2 = User.objects.create_user(
            username='artist2',
            email='artist2@example.com',
            password='TestPassword123!',
            first_name='Artist',
            last_name='Two'
        )
        
        # Create artists
        self.artist1 = Artist.objects.create(
            user=self.user1,
            bio='Talented weaver and craftsperson'
        )
        
        self.artist2 = Artist.objects.create(
            user=self.user2,
            bio='Master potter from the village'
        )
    
    def test_list_artists(self):
        """Test listing all artists"""
        response = self.client.get(self.artists_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(response.data['results']), 2)
    
    def test_retrieve_artist_detail(self):
        """Test retrieving single artist detail"""
        response = self.client.get(
            f'{self.artists_url}{self.artist1.id}/'
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['bio'], self.artist1.bio)
        self.assertEqual(response.data['user']['first_name'], 'Artist')
    
    def test_artist_has_user_profile(self):
        """Test artist response includes user profile"""
        response = self.client.get(
            f'{self.artists_url}{self.artist1.id}/'
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('user', response.data)
        self.assertIn('email', response.data['user'])
        self.assertIn('first_name', response.data['user'])


class ReviewEndpointTestCase(APITestCase):
    """Test suite for review endpoints"""
    
    def setUp(self):
        """Set up test client and test data"""
        self.client = APIClient()
        self.reviews_url = '/api/reviews/'
        
        # Create users
        self.reviewer = User.objects.create_user(
            username='reviewer',
            email='reviewer@example.com',
            password='TestPassword123!'
        )
        
        self.seller = User.objects.create_user(
            username='seller',
            email='seller@example.com',
            password='TestPassword123!'
        )
        
        # Create category and product
        self.category = Category.objects.create(name='Handmade')
        self.product = Product.objects.create(
            seller=self.seller,
            title='Handmade Item',
            description='Test product',
            category=self.category,
            price=29.99,
            quantity=10
        )
        
        # Create test reviews
        self.review1 = Review.objects.create(
            product=self.product,
            reviewer=self.reviewer,
            rating=5,
            comment='Excellent product!'
        )
    
    def test_list_reviews(self):
        """Test listing reviews"""
        response = self.client.get(self.reviews_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(response.data['results']), 1)
    
    def test_list_reviews_filtered_by_product(self):
        """Test filtering reviews by product"""
        response = self.client.get(
            self.reviews_url,
            {'product': self.product.id}
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)
        self.assertEqual(response.data['results'][0]['product'], self.product.id)
    
    def test_create_review_authenticated(self):
        """Test creating review as authenticated user"""
        self.client.force_authenticate(user=self.reviewer)
        
        review_data = {
            'product': self.product.id,
            'rating': 4,
            'comment': 'Very good product'
        }
        
        response = self.client.post(
            self.reviews_url,
            review_data,
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['rating'], 4)
    
    def test_create_review_unauthenticated(self):
        """Test creating review fails without authentication"""
        review_data = {
            'product': self.product.id,
            'rating': 4,
            'comment': 'Very good product'
        }
        
        response = self.client.post(
            self.reviews_url,
            review_data,
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
    
    def test_review_rating_validation(self):
        """Test review rating must be 1-5"""
        self.client.force_authenticate(user=self.reviewer)
        
        # Test invalid rating
        invalid_data = {
            'product': self.product.id,
            'rating': 6,  # Invalid
            'comment': 'Test'
        }
        
        response = self.client.post(
            self.reviews_url,
            invalid_data,
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class OrderEndpointTestCase(APITestCase):
    """Test suite for order endpoints"""
    
    def setUp(self):
        """Set up test client and test data"""
        self.client = APIClient()
        self.orders_url = '/api/orders/'
        
        # Create users
        self.buyer = User.objects.create_user(
            username='buyer',
            email='buyer@example.com',
            password='TestPassword123!'
        )
        
        self.seller = User.objects.create_user(
            username='seller',
            email='seller@example.com',
            password='TestPassword123!'
        )
        
        # Create product
        self.category = Category.objects.create(name='Handmade')
        self.product = Product.objects.create(
            seller=self.seller,
            title='Test Product',
            description='Test product for ordering',
            category=self.category,
            price=29.99,
            quantity=50
        )
    
    def test_list_orders_authenticated(self):
        """Test listing user's orders"""
        self.client.force_authenticate(user=self.buyer)
        
        response = self.client.get(self.orders_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
    
    def test_create_order_authenticated(self):
        """Test creating order as authenticated buyer"""
        self.client.force_authenticate(user=self.buyer)
        
        order_data = {
            'total_price': 29.99,
            'items': [
                {
                    'product': self.product.id,
                    'quantity': 1
                }
            ]
        }
        
        response = self.client.post(
            self.orders_url,
            order_data,
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
    
    def test_create_order_unauthenticated(self):
        """Test creating order fails without authentication"""
        order_data = {
            'total_price': 29.99,
            'items': [
                {
                    'product': self.product.id,
                    'quantity': 1
                }
            ]
        }
        
        response = self.client.post(
            self.orders_url,
            order_data,
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class APIPermissionsTestCase(APITestCase):
    """Test suite for API permissions and authorization"""
    
    def setUp(self):
        """Set up test client and test data"""
        self.client = APIClient()
        
        self.user1 = User.objects.create_user(
            username='user1',
            email='user1@example.com',
            password='TestPassword123!'
        )
        
        self.user2 = User.objects.create_user(
            username='user2',
            email='user2@example.com',
            password='TestPassword123!'
        )
        
        self.category = Category.objects.create(name='Test')
        
        self.product = Product.objects.create(
            seller=self.user1,
            title='Test Product',
            description='Test',
            category=self.category,
            price=29.99,
            quantity=10
        )
    
    def test_non_owner_cannot_update_product(self):
        """Test that non-owner cannot update product"""
        self.client.force_authenticate(user=self.user2)
        
        update_data = {'title': 'Hacked Title'}
        
        response = self.client.patch(
            f'/api/products/{self.product.id}/',
            update_data,
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
    
    def test_non_owner_cannot_delete_product(self):
        """Test that non-owner cannot delete product"""
        self.client.force_authenticate(user=self.user2)
        
        response = self.client.delete(
            f'/api/products/{self.product.id}/'
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)


class PaginationTestCase(APITestCase):
    """Test suite for API pagination"""
    
    def setUp(self):
        """Set up test client and test data"""
        self.client = APIClient()
        
        self.user = User.objects.create_user(
            username='seller',
            email='seller@example.com',
            password='TestPassword123!'
        )
        
        self.category = Category.objects.create(name='Test')
        
        # Create multiple products
        for i in range(25):
            Product.objects.create(
                seller=self.user,
                title=f'Product {i}',
                description='Test',
                category=self.category,
                price=29.99,
                quantity=10
            )
    
    def test_pagination_first_page(self):
        """Test first page of paginated results"""
        response = self.client.get('/api/products/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('next', response.data)
        self.assertIn('count', response.data)
        self.assertLessEqual(len(response.data['results']), 10)
    
    def test_pagination_second_page(self):
        """Test accessing second page"""
        response = self.client.get('/api/products/?page=2')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreater(len(response.data['results']), 0)


class ErrorHandlingTestCase(APITestCase):
    """Test suite for error handling"""
    
    def setUp(self):
        """Set up test client"""
        self.client = APIClient()
    
    def test_404_for_nonexistent_product(self):
        """Test 404 error for nonexistent product"""
        response = self.client.get('/api/products/9999/')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
    
    def test_404_for_nonexistent_artist(self):
        """Test 404 error for nonexistent artist"""
        response = self.client.get('/api/artists/9999/')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
    
    def test_invalid_json_request(self):
        """Test handling of invalid JSON"""
        response = self.client.post(
            '/api/products/',
            'invalid json',
            content_type='application/json'
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    
    def test_method_not_allowed(self):
        """Test 405 Method Not Allowed"""
        response = self.client.put('/api/artists/')  # Artists endpoint is read-only
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)


if __name__ == '__main__':
    pytest.main([__file__, '-v', '--tb=short'])
