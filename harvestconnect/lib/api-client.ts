/**
 * API Client for HarvestConnect Backend
 * Handles all REST API calls to the Django backend
 */

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: Record<string, unknown>;
  headers?: Record<string, string>;
}

interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// Types for API responses
export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  profile: UserProfile;
}

export interface UserProfile {
  id: number;
  user_id: number;
  role: 'buyer' | 'seller' | 'artisan' | 'farmer' | 'tradesman';
  bio: string;
  location: string;
  verified: boolean;
  avatar: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  icon: string;
}

export interface Product {
  id: number;
  seller: User;
  title: string;
  slug: string;
  description: string;
  category: Category;
  price: string;
  quantity: number;
  status: 'active' | 'inactive' | 'draft';
  image: string;
  images: string[];
  rating: number;
  reviews_count: number;
  created_at: string;
  updated_at: string;
}

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  author: User;
  author_id: number;
  featured: boolean;
  image: string;
  views: number;
  created_at: string;
  updated_at: string;
}

export interface Review {
  id: number;
  product_id: number;
  reviewer_id: number;
  rating: number;
  comment: string;
  created_at: string;
}

export interface Order {
  id: number;
  order_id: string;
  user_id: number;
  total_price: string;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  created_at: string;
  updated_at: string;
}

export interface Artist {
  id: number;
  user: User;
  bio: string;
  featured_image: string;
  social_media: Record<string, string>;
  created_at: string;
}

export interface AuthResponse {
  access: string;
  refresh: string;
}

class APIClient {
  private baseURL: string;
  private timeout: number;
  private token: string | null = null;

  constructor(baseURL?: string, timeout?: number) {
    this.baseURL = baseURL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
    this.timeout = timeout || parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || '30000', 10);
    this.loadToken();
  }

  private loadToken(): void {
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('authToken');
    }
  }

  public setToken(token: string): void {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('authToken', token);
    }
  }

  public getToken(): string | null {
    return this.token;
  }

  public clearToken(): void {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const { method = 'GET', body, headers = {} } = options;

    const requestHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      ...headers,
    };

    if (this.token) {
      requestHeaders['Authorization'] = `Bearer ${this.token}`;
    }

    const requestOptions: RequestInit = {
      method,
      headers: requestHeaders,
    };

    if (body) {
      requestOptions.body = JSON.stringify(body);
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        ...requestOptions,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.status === 401) {
        this.clearToken();
        if (typeof window !== 'undefined') {
          window.location.href = '/auth/login';
        }
      }

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);
      console.error('API request failed:', error);
      throw error;
    }
  }

  // ==================== Authentication ====================

  async register(email: string, password: string, firstName: string, lastName: string, role: string): Promise<User> {
    return this.request('/auth/register/', {
      method: 'POST',
      body: {
        email,
        password,
        first_name: firstName,
        last_name: lastName,
        role,
      },
    });
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>('/auth/login/', {
      method: 'POST',
      body: { email, password },
    });
    if (response.access) {
      this.setToken(response.access);
    }
    return response;
  }

  async logout(): Promise<void> {
    this.clearToken();
  }

  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    return this.request('/auth/token/refresh/', {
      method: 'POST',
      body: { refresh: refreshToken },
    });
  }

  async getCurrentUser(): Promise<User> {
    return this.request('/users/me/');
  }

  // ==================== Blog Posts ====================

  async getBlogPosts(params?: Record<string, unknown>): Promise<PaginatedResponse<BlogPost>> {
    const query = new URLSearchParams(params as Record<string, string>).toString();
    return this.request(`/blog-posts/?${query}`);
  }

  async getBlogPost(id: number): Promise<BlogPost> {
    return this.request(`/blog-posts/${id}/`);
  }

  async createBlogPost(data: Partial<BlogPost>): Promise<BlogPost> {
    return this.request('/blog-posts/', {
      method: 'POST',
      body: data,
    });
  }

  async updateBlogPost(id: number, data: Partial<BlogPost>): Promise<BlogPost> {
    return this.request(`/blog-posts/${id}/`, {
      method: 'PATCH',
      body: data,
    });
  }

  async deleteBlogPost(id: number): Promise<void> {
    await this.request(`/blog-posts/${id}/`, {
      method: 'DELETE',
    });
  }

  async incrementBlogPostViews(id: number): Promise<BlogPost> {
    return this.request(`/blog-posts/${id}/increment_views/`, {
      method: 'POST',
    });
  }

  // ==================== Products ====================

  async getProducts(params?: Record<string, unknown>): Promise<PaginatedResponse<Product>> {
    const query = new URLSearchParams(params as Record<string, string>).toString();
    return this.request(`/products/?${query}`);
  }

  async getProduct(id: number): Promise<Product> {
    return this.request(`/products/${id}/`);
  }

  async createProduct(data: Partial<Product>): Promise<Product> {
    return this.request('/products/', {
      method: 'POST',
      body: data,
    });
  }

  async updateProduct(id: number, data: Partial<Product>): Promise<Product> {
    return this.request(`/products/${id}/`, {
      method: 'PATCH',
      body: data,
    });
  }

  async deleteProduct(id: number): Promise<void> {
    await this.request(`/products/${id}/`, {
      method: 'DELETE',
    });
  }

  async getProductReviews(productId: number): Promise<PaginatedResponse<Review>> {
    return this.request(`/products/${productId}/reviews/`);
  }

  // ==================== Reviews ====================

  async getReviews(params?: Record<string, unknown>): Promise<PaginatedResponse<Review>> {
    const query = new URLSearchParams(params as Record<string, string>).toString();
    return this.request(`/reviews/?${query}`);
  }

  async createReview(data: Partial<Review>): Promise<Review> {
    return this.request('/reviews/', {
      method: 'POST',
      body: data,
    });
  }

  async updateReview(id: number, data: Partial<Review>): Promise<Review> {
    return this.request(`/reviews/${id}/`, {
      method: 'PATCH',
      body: data,
    });
  }

  async deleteReview(id: number): Promise<void> {
    await this.request(`/reviews/${id}/`, {
      method: 'DELETE',
    });
  }

  // ==================== Orders ====================

  async getOrders(params?: Record<string, unknown>): Promise<PaginatedResponse<Order>> {
    const query = new URLSearchParams(params as Record<string, string>).toString();
    return this.request(`/orders/?${query}`);
  }

  async getOrder(id: number): Promise<Order> {
    return this.request(`/orders/${id}/`);
  }

  async createOrder(data: Partial<Order>): Promise<Order> {
    return this.request('/orders/', {
      method: 'POST',
      body: data,
    });
  }

  async updateOrder(id: number, data: Partial<Order>): Promise<Order> {
    return this.request(`/orders/${id}/`, {
      method: 'PATCH',
      body: data,
    });
  }

  // ==================== Categories ====================

  async getCategories(params?: Record<string, unknown>): Promise<PaginatedResponse<Category>> {
    const query = new URLSearchParams(params as Record<string, string>).toString();
    return this.request(`/categories/?${query}`);
  }

  async getCategory(id: number): Promise<Category> {
    return this.request(`/categories/${id}/`);
  }

  // ==================== Artists ====================

  async getArtists(params?: Record<string, unknown>): Promise<PaginatedResponse<Artist>> {
    const query = new URLSearchParams(params as Record<string, string>).toString();
    return this.request(`/artists/?${query}`);
  }

  async getArtist(id: number): Promise<Artist> {
    return this.request(`/artists/${id}/`);
  }
}

// Create singleton instance
const apiClient = new APIClient();

export default apiClient;
