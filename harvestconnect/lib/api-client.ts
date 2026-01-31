/**
 * API Client for HarvestConnect Backend
 * Handles all REST API calls to the Django backend
 */

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: Record<string, unknown> | FormData;
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
  role: 'buyer' | 'seller' | 'artisan' | 'farmer' | 'tradesman' | 'admin';
  bio: string;
  location: string;
  home_church: string;
  is_verified: boolean;
  faith_based: boolean;
  avatar: string;
  banner: string;
  phone: string;
  latitude: number | null;
  longitude: number | null;
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

export interface SavedItem {
  id: number;
  user: User;
  product: Product;
  created_at: string;
}

export interface Project {
  id: number;
  tradesman: User;
  client: User;
  title: string;
  description: string;
  status: 'inquiry' | 'in_progress' | 'completed' | 'cancelled' | 'quote_sent';
  budget: string;
  start_date: string;
  end_date: string;
  images: string[];
  created_at: string;
  updated_at: string;
}

export interface DashboardStats {
  role: string;
  stats: Record<string, any>;
}

export interface AuthResponse {
  access: string;
  refresh: string;
}

export const isMockEnabled = (): boolean => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('harvestconnect_use_mock') === 'true';
  }
  return false;
};

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

  public getMediaUrl(path: string): string {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    
    // Remove leading slash from path to avoid double slashes in the final URL
    const cleanPath = path.startsWith('/') ? path.substring(1) : path;
    
    // If the path already includes 'media/', don't prepend it again
    if (cleanPath.startsWith('media/')) {
        return `${this.baseURL.replace('/api', '')}/${cleanPath}`;
    }
    
    return `${this.baseURL.replace('/api', '')}/media/${cleanPath}`;
  }

  private async request<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const { method = 'GET', body, headers = {} } = options;

    const isFormData = body instanceof FormData;

    const requestHeaders: Record<string, string> = {
      ...headers,
    };

    if (!isFormData) {
      requestHeaders['Content-Type'] = 'application/json';
    }

    if (this.token) {
      requestHeaders['Authorization'] = `Bearer ${this.token}`;
    }

    const requestOptions: RequestInit = {
      method,
      headers: requestHeaders,
    };

    if (body) {
      if (isFormData) {
        requestOptions.body = body;
      } else {
        requestOptions.body = JSON.stringify(body);
      }
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      try {
        controller.abort('timeout');
      } catch (e) {
        // Fallback for environments where abort() doesn't accept a reason
        controller.abort();
      }
    }, this.timeout);

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
        let errorData;
        try {
          errorData = await response.json();
        } catch (e) {
          errorData = { message: response.statusText };
        }
        const error = new Error(errorData.message || `API Error: ${response.status}`);
        (error as any).data = errorData;
        (error as any).status = response.status;
        throw error;
      }

      const text = await response.text();
      return text ? JSON.parse(text) : ({} as any);
    } catch (error: any) {
      clearTimeout(timeoutId);
      
      // Handle timeout specifically
      if (error.name === 'AbortError' || controller.signal.aborted) {
        const timeoutError = new Error('Request timed out. Please check your connection or try again later.');
        (timeoutError as any).name = 'TimeoutError';
        throw timeoutError;
      }
      
      throw error;
    }
  }

  // Generic methods
  public async get<T>(endpoint: string, options: Omit<RequestOptions, 'method'> = {}): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  public async post<T>(endpoint: string, body: any, options: Omit<RequestOptions, 'method' | 'body'> = {}): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'POST', body });
  }

  public async put<T>(endpoint: string, body: any, options: Omit<RequestOptions, 'method' | 'body'> = {}): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'PUT', body });
  }

  public async patch<T>(endpoint: string, body: any, options: Omit<RequestOptions, 'method' | 'body'> = {}): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'PATCH', body });
  }

  public async delete<T>(endpoint: string, options: Omit<RequestOptions, 'method'> = {}): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }

  // ==================== Authentication ====================

  async register(email: string, password: string, firstName: string, lastName: string, role: string): Promise<User> {
    return this.request('/auth/registration/', {
      method: 'POST',
      body: {
        email,
        password1: password,
        password2: password,
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

  async googleLogin(code: string): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>('/auth/google/', {
      method: 'POST',
      body: { code },
    });
    if (response.access) {
      this.setToken(response.access);
    }
    return response;
  }

  async githubLogin(code: string): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>('/auth/github/', {
      method: 'POST',
      body: { code },
    });
    if (response.access) {
      this.setToken(response.access);
    }
    return response;
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
    if (isMockEnabled()) {
      const { mockBlogPosts } = await import('./mock-data');
      return {
        count: mockBlogPosts.length,
        next: null,
        previous: null,
        results: mockBlogPosts
      };
    }
    const query = new URLSearchParams(params as Record<string, string>).toString();
    return this.request(`/blog-posts/?${query}`);
  }

  async getBlogPost(id: number): Promise<BlogPost> {
    if (isMockEnabled()) {
      const { mockBlogPosts } = await import('./mock-data');
      const post = mockBlogPosts.find(p => p.id === id) || mockBlogPosts[0];
      return post;
    }
    return this.request(`/blog-posts/${id}/`);
  }

  async createBlogPost(postData: Partial<BlogPost> | FormData): Promise<BlogPost> {
    return this.request<BlogPost>('/blog-posts/', {
      method: 'POST',
      body: postData as any,
    });
  }

  async updateBlogPost(id: number, data: Partial<BlogPost> | FormData): Promise<BlogPost> {
    return this.request(`/blog-posts/${id}/`, {
      method: 'PATCH',
      body: data as any,
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
    if (isMockEnabled()) {
      const { mockProducts } = await import('./mock-data');
      return {
        count: mockProducts.length,
        next: null,
        previous: null,
        results: mockProducts
      };
    }
    const query = new URLSearchParams(params as Record<string, string>).toString();
    return this.request(`/products/?${query}`);
  }

  async getProduct(id: number): Promise<Product> {
    if (isMockEnabled()) {
      const { mockProducts } = await import('./mock-data');
      const product = mockProducts.find(p => p.id === id) || mockProducts[0];
      return product;
    }
    return this.request(`/products/${id}/`);
  }

  async createProduct(data: Partial<Product> | FormData): Promise<Product> {
    return this.request('/products/', {
      method: 'POST',
      body: data as any,
    });
  }

  async updateProduct(id: number, data: Partial<Product> | FormData): Promise<Product> {
    return this.request(`/products/${id}/`, {
      method: 'PATCH',
      body: data as any,
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
    if (isMockEnabled()) {
      const { mockData } = await import('./mock-data');
      return {
        count: mockData.categories.length,
        next: null,
        previous: null,
        results: mockData.categories
      };
    }
    const query = new URLSearchParams(params as Record<string, string>).toString();
    return this.request(`/categories/?${query}`);
  }

  async getCategory(id: number): Promise<Category> {
    return this.request(`/categories/${id}/`);
  }

  // ==================== Artists ====================

  async getArtists(params?: Record<string, unknown>): Promise<PaginatedResponse<Artist>> {
    if (isMockEnabled()) {
      const { mockArtists } = await import('./mock-data');
      return {
        count: mockArtists.length,
        next: null,
        previous: null,
        results: mockArtists
      };
    }
    const query = new URLSearchParams(params as Record<string, string>).toString();
    return this.request(`/artists/?${query}`);
  }

  async getArtist(id: number): Promise<Artist> {
    return this.request(`/artists/${id}/`);
  }

  // ==================== User Profile & Dashboard ====================

  async updateProfile(data: Partial<UserProfile & { first_name?: string; last_name?: string }> | FormData): Promise<UserProfile> {
    return this.request('/users/me/', {
      method: 'PATCH',
      body: data as any,
    });
  }

  async getDashboardStats(): Promise<DashboardStats> {
    return this.request('/users/stats/');
  }

  // ==================== Saved Items ====================

  async getSavedItems(): Promise<PaginatedResponse<SavedItem>> {
    return this.request('/saved-items/');
  }

  async toggleSavedItem(productId: number): Promise<void> {
    // Check if already saved (this is a simplified implementation)
    const saved = await this.getSavedItems();
    const existing = saved.results.find(item => item.product.id === productId);
    
    if (existing) {
      await this.request(`/saved-items/${existing.id}/`, { method: 'DELETE' });
    } else {
      await this.request('/saved-items/', {
        method: 'POST',
        body: { product_id: productId }
      });
    }
  }

  async getProjects(params?: Record<string, unknown>): Promise<PaginatedResponse<Project>> {
    const query = new URLSearchParams(params as Record<string, string>).toString();
    return this.request(`/projects/?${query}`);
  }

  async createProject(data: Partial<Project>): Promise<Project> {
    return this.request('/projects/', {
      method: 'POST',
      body: data,
    });
  }

  async updateProject(id: number | string, data: Partial<Project>): Promise<Project> {
    return this.request(`/projects/${id}/`, {
      method: 'PATCH',
      body: data,
    });
  }

  async deleteProject(id: number | string): Promise<void> {
    await this.request(`/projects/${id}/`, {
      method: 'DELETE',
    });
  }

  // ==================== Chat ====================

  async getChatRooms(): Promise<PaginatedResponse<any>> {
    return this.request('/chat-rooms/');
  }

  async createChatRoom(data: any): Promise<any> {
    return this.request('/chat-rooms/', {
      method: 'POST',
      body: data,
    });
  }

  async deleteChatRoom(id: number | string): Promise<void> {
    await this.request(`/chat-rooms/${id}/`, {
      method: 'DELETE',
    });
  }

  async getChatMessages(roomId: number | string): Promise<PaginatedResponse<any>> {
    return this.request(`/messages/?room=${roomId}`);
  }

  async sendChatMessage(roomId: number | string, content: string): Promise<any> {
    return this.request('/messages/', {
      method: 'POST',
      body: { room: roomId, content },
    });
  }

  async getOrCreatePersonalChat(participantId: number): Promise<any> {
    return this.request('/chat-rooms/get_or_create_personal/', {
      method: 'POST',
      body: { participant_id: participantId }
    });
  }
}

// Create singleton instance
const apiClient = new APIClient();

export default apiClient;
