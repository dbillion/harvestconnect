#!/usr/bin/env python3
"""
HarvestConnect Phase 5 - Automated API Testing Script
Tests authentication flow and dynamic page endpoints
"""

import requests
import json
import time
from datetime import datetime
from typing import Dict, Any, Optional

# Configuration
BASE_URL = "http://localhost:8000/api"
TIMEOUT = 10

class Colors:
    """ANSI color codes for terminal output"""
    GREEN = '\033[92m'
    RED = '\033[91m'
    YELLOW = '\033[93m'
    BLUE = '\033[94m'
    CYAN = '\033[96m'
    END = '\033[0m'
    BOLD = '\033[1m'

class TestResult:
    """Store test result information"""
    def __init__(self, name: str):
        self.name = name
        self.passed = False
        self.error = None
        self.response = None
        self.duration = 0

    def __str__(self):
        status = f"{Colors.GREEN}✅ PASS{Colors.END}" if self.passed else f"{Colors.RED}❌ FAIL{Colors.END}"
        return f"{status} | {self.name} ({self.duration:.2f}s)"

class APITester:
    """Test HarvestConnect API endpoints"""
    
    def __init__(self):
        self.results = []
        self.tokens = {}
        self.user_email = f"testuser_{int(time.time())}@example.com"
        self.user_password = "TestPassword123!"
    
    def print_header(self, text: str):
        """Print a section header"""
        print(f"\n{Colors.BOLD}{Colors.BLUE}{'='*60}{Colors.END}")
        print(f"{Colors.BOLD}{Colors.BLUE}{text:^60}{Colors.END}")
        print(f"{Colors.BOLD}{Colors.BLUE}{'='*60}{Colors.END}\n")
    
    def print_test(self, test_result: TestResult):
        """Print test result"""
        print(f"  {test_result}")
        if test_result.error:
            print(f"     {Colors.RED}Error: {test_result.error}{Colors.END}")
    
    def test_endpoint(self, method: str, endpoint: str, name: str, 
                     data: Optional[Dict] = None, headers: Optional[Dict] = None,
                     expected_status: int = 200) -> TestResult:
        """Test an API endpoint"""
        result = TestResult(name)
        url = f"{BASE_URL}{endpoint}"
        
        try:
            start = time.time()
            
            if method.upper() == "GET":
                response = requests.get(url, headers=headers, timeout=TIMEOUT)
            elif method.upper() == "POST":
                response = requests.post(url, json=data, headers=headers, timeout=TIMEOUT)
            elif method.upper() == "PUT":
                response = requests.put(url, json=data, headers=headers, timeout=TIMEOUT)
            elif method.upper() == "DELETE":
                response = requests.delete(url, headers=headers, timeout=TIMEOUT)
            else:
                raise ValueError(f"Unknown method: {method}")
            
            result.duration = time.time() - start
            result.response = response
            
            if response.status_code == expected_status:
                result.passed = True
            else:
                result.error = f"Expected {expected_status}, got {response.status_code}"
                try:
                    result.error += f": {response.json()}"
                except:
                    result.error += f": {response.text[:100]}"
        
        except requests.exceptions.Timeout:
            result.error = f"Request timeout ({TIMEOUT}s)"
        except requests.exceptions.ConnectionError:
            result.error = "Connection error - backend not running?"
        except Exception as e:
            result.error = str(e)
        
        self.results.append(result)
        return result
    
    def run_all_tests(self):
        """Run all test suites"""
        self.print_header("🧪 HarvestConnect Phase 5 - API Testing")
        print(f"Test User Email: {self.user_email}\n")
        
        self.test_auth_endpoints()
        self.test_product_endpoints()
        self.test_artist_endpoints()
        self.test_review_endpoints()
        
        self.print_summary()
    
    def test_auth_endpoints(self):
        """Test authentication endpoints"""
        self.print_header("🔐 Authentication Endpoints")
        
        # Test registration
        print(f"{Colors.CYAN}Testing user registration...{Colors.END}")
        register_data = {
            "email": self.user_email,
            "password1": self.user_password,
            "password2": self.user_password,
            "first_name": "Test",
            "last_name": "User",
        }
        result = self.test_endpoint(
            "POST", "/auth/register/", 
            "Register new user",
            data=register_data,
            expected_status=201
        )
        self.print_test(result)
        
        # Test login
        print(f"\n{Colors.CYAN}Testing user login...{Colors.END}")
        login_data = {
            "email": self.user_email,
            "password": self.user_password,
        }
        result = self.test_endpoint(
            "POST", "/auth/login/",
            "Login with credentials",
            data=login_data,
            expected_status=200
        )
        self.print_test(result)
        
        if result.passed and result.response:
            try:
                self.tokens = result.response.json()
                print(f"     {Colors.GREEN}✓ Tokens received:{Colors.END}")
                print(f"       - Access: {self.tokens.get('access', 'N/A')[:50]}...")
                print(f"       - Refresh: {self.tokens.get('refresh', 'N/A')[:50]}...")
            except:
                print(f"     {Colors.RED}✗ Could not parse tokens{Colors.END}")
        
        # Test token refresh
        if self.tokens.get('refresh'):
            print(f"\n{Colors.CYAN}Testing token refresh...{Colors.END}")
            refresh_data = {"refresh": self.tokens['refresh']}
            result = self.test_endpoint(
                "POST", "/auth/token/refresh/",
                "Refresh access token",
                data=refresh_data,
                expected_status=200
            )
            self.print_test(result)
    
    def test_product_endpoints(self):
        """Test product endpoints"""
        self.print_header("📦 Product Endpoints")
        
        # Get all products
        print(f"{Colors.CYAN}Testing product endpoints...{Colors.END}")
        result = self.test_endpoint(
            "GET", "/products/",
            "List all products",
            expected_status=200
        )
        self.print_test(result)
        
        products = []
        if result.passed and result.response:
            try:
                data = result.response.json()
                # Handle both paginated and non-paginated responses
                products = data if isinstance(data, list) else data.get('results', [])
                print(f"     {Colors.GREEN}✓ Found {len(products)} products{Colors.END}")
            except:
                print(f"     {Colors.RED}✗ Could not parse products{Colors.END}")
        
        # Test getting a specific product
        if products:
            product_id = products[0].get('id', 1)
            print(f"\n{Colors.CYAN}Testing product detail endpoint...{Colors.END}")
            result = self.test_endpoint(
                "GET", f"/products/{product_id}/",
                f"Get product details (ID: {product_id})",
                expected_status=200
            )
            self.print_test(result)
            
            if result.passed and result.response:
                try:
                    product = result.response.json()
                    print(f"     {Colors.GREEN}✓ Product details:{Colors.END}")
                    print(f"       - Title: {product.get('title', 'N/A')}")
                    print(f"       - Price: ${product.get('price', 'N/A')}")
                    print(f"       - Rating: {product.get('rating', 'N/A')}⭐")
                except:
                    pass
    
    def test_artist_endpoints(self):
        """Test artist endpoints"""
        self.print_header("👨‍🎨 Artist Endpoints")
        
        # Get all artists
        print(f"{Colors.CYAN}Testing artist endpoints...{Colors.END}")
        result = self.test_endpoint(
            "GET", "/artists/",
            "List all artists",
            expected_status=200
        )
        self.print_test(result)
        
        artists = []
        if result.passed and result.response:
            try:
                data = result.response.json()
                # Handle both paginated and non-paginated responses
                artists = data if isinstance(data, list) else data.get('results', [])
                print(f"     {Colors.GREEN}✓ Found {len(artists)} artists{Colors.END}")
            except:
                print(f"     {Colors.RED}✗ Could not parse artists{Colors.END}")
        
        # Test getting a specific artist
        if artists:
            artist_id = artists[0].get('id', 1)
            print(f"\n{Colors.CYAN}Testing artist detail endpoint...{Colors.END}")
            result = self.test_endpoint(
                "GET", f"/artists/{artist_id}/",
                f"Get artist details (ID: {artist_id})",
                expected_status=200
            )
            self.print_test(result)
            
            if result.passed and result.response:
                try:
                    artist = result.response.json()
                    user = artist.get('user', {})
                    print(f"     {Colors.GREEN}✓ Artist details:{Colors.END}")
                    print(f"       - Name: {user.get('first_name', '')} {user.get('last_name', '')}")
                    print(f"       - Email: {user.get('email', 'N/A')}")
                    print(f"       - Bio: {artist.get('bio', 'N/A')[:50]}...")
                except:
                    pass
    
    def test_review_endpoints(self):
        """Test review endpoints"""
        self.print_header("⭐ Review Endpoints")
        
        # Get all reviews
        print(f"{Colors.CYAN}Testing review endpoints...{Colors.END}")
        result = self.test_endpoint(
            "GET", "/reviews/",
            "List all reviews",
            expected_status=200
        )
        self.print_test(result)
        
        if result.passed and result.response:
            try:
                data = result.response.json()
                # Handle both paginated and non-paginated responses
                reviews = data if isinstance(data, list) else data.get('results', [])
                print(f"     {Colors.GREEN}✓ Found {len(reviews)} reviews{Colors.END}")
                if reviews:
                    review = reviews[0]
                    print(f"     {Colors.GREEN}✓ Sample review:{Colors.END}")
                    print(f"       - Rating: {review.get('rating', 'N/A')}⭐")
                    print(f"       - Product ID: {review.get('product_id', 'N/A')}")
                    print(f"       - Comment: {review.get('comment', 'N/A')[:50]}...")
            except:
                print(f"     {Colors.RED}✗ Could not parse reviews{Colors.END}")
    
    def print_summary(self):
        """Print test summary"""
        self.print_header("📊 Test Summary")
        
        passed = sum(1 for r in self.results if r.passed)
        failed = len(self.results) - passed
        total = len(self.results)
        
        print(f"Total Tests: {total}")
        print(f"  {Colors.GREEN}✅ Passed: {passed}{Colors.END}")
        print(f"  {Colors.RED}❌ Failed: {failed}{Colors.END}")
        
        if failed == 0:
            print(f"\n{Colors.GREEN}{Colors.BOLD}🎉 ALL TESTS PASSED! 🎉{Colors.END}")
        else:
            print(f"\n{Colors.YELLOW}⚠️  Some tests failed - see details above{Colors.END}")
        
        print(f"\nTest completed at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")

def main():
    """Main entry point"""
    print(f"\n{Colors.BOLD}HarvestConnect Phase 5 - Automated API Testing{Colors.END}")
    print(f"Base URL: {BASE_URL}")
    print(f"Timeout: {TIMEOUT}s\n")
    
    tester = APITester()
    
    try:
        tester.run_all_tests()
    except KeyboardInterrupt:
        print(f"\n{Colors.YELLOW}Test interrupted by user{Colors.END}")
    except Exception as e:
        print(f"\n{Colors.RED}Unexpected error: {e}{Colors.END}")

if __name__ == "__main__":
    main()
