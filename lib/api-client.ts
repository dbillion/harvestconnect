/**
 * API Client for HarvestConnect Frontend
 * Handles all communication with Django REST API
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
const API_TIMEOUT = parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || '30000');

interface RequestOptions extends RequestInit {
  headers?: Record<string, string>;
  body?: any;
}

interface AuthResponse {
  access: string;
  refresh: string;
  user: any;
}

class APIClient {
  private baseURL: string;
  private timeout: number;
  private token: string | null;

  constructor(baseURL = API_BASE_URL) {
    this.baseURL = baseURL;
    this.timeout = API_TIMEOUT;
    this.token = null;
  }

  setToken(token: string | null) {
    this.token = token;
    if (typeof window !== 'undefined' && token) {
      localStorage.setItem('access_token', token);
    } else if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
    }
  }

  getToken(): string | null {
    if (typeof window !== 'undefined' && !this.token) {
      this.token = localStorage.getItem('access_token');
    }
    return this.token;
  }

  async request(endpoint: string, options: RequestOptions = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    };

    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const config: RequestInit = {
      method: options.method || 'GET',
      headers,
      signal: AbortSignal.timeout(this.timeout),
    };

    if (options.body && !(options.body instanceof FormData)) {
      config.body = JSON.stringify(options.body);
    } else if (options.body instanceof FormData) {
      config.body = options.body;
      delete headers['Content-Type'];
    }

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        if (response.status === 401 && typeof window !== 'undefined') {
          this.setToken(null);
          window.location.href = '/login';
        }
        throw new Error(`API error: ${response.status}`);
      }

      return response.status === 204 ? null : await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  async get<T = any>(endpoint: string, options = {}): Promise<T> {
    return this.request(endpoint, { ...options, method: 'GET' });
  }

  async post<T = any>(endpoint: string, body: any, options = {}): Promise<T> {
    return this.request(endpoint, { ...options, method: 'POST', body });
  }

  // ============ AUTHENTICATION ============

  async register(data: any) {
    return this.request('/auth/registration/', {
      method: 'POST',
      body: data,
    });
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await this.request('/auth/login/', {
      method: 'POST',
      body: { email, password },
    });
    if (response.access) {
      this.setToken(response.access);
    }
    return response;
  }

  async logout() {
    await this.request('/auth/logout/', { method: 'POST' });
    this.setToken(null);
  }

  async refreshToken(refresh: string): Promise<AuthResponse> {
    const response = await this.request('/auth/refresh/', {
      method: 'POST',
      body: { refresh },
    });
    if (response.access) {
      this.setToken(response.access);
    }
    return response;
  }

  async getCurrentUser() {
    return this.request('/users/me/');
  }

  async updateProfile(formData: FormData) {
    return this.request('/users/me/', {
      method: 'PATCH',
      body: formData,
    });
  }

  async getDashboardStats() {
    return this.request('/users/stats/');
  }

  // ============ BLOG POSTS ============

  async getBlogPosts(params: any = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/blog-posts/?${queryString}`);
  }

  async getBlogPost(slug: string) {
    return this.request(`/blog-posts/${slug}/`);
  }

  async createBlogPost(data: any) {
    return this.request('/blog-posts/', {
      method: 'POST',
      body: data,
    });
  }

  async updateBlogPost(slug: string, data: any) {
    return this.request(`/blog-posts/${slug}/`, {
      method: 'PATCH',
      body: data,
    });
  }

  async deleteBlogPost(slug: string) {
    return this.request(`/blog-posts/${slug}/`, {
      method: 'DELETE',
    });
  }

  async incrementBlogPostViews(slug: string) {
    return this.request(`/blog-posts/${slug}/increment_views/`, {
      method: 'POST',
    });
  }

  // ============ PRODUCTS ============

  async getProducts(params: any = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/products/?${queryString}`);
  }

  async getProduct(slug: string) {
    return this.request(`/products/${slug}/`);
  }

  async createProduct(data: any) {
    return this.request('/products/', {
      method: 'POST',
      body: data,
    });
  }

  async updateProduct(slug: string, data: any) {
    return this.request(`/products/${slug}/`, {
      method: 'PATCH',
      body: data,
    });
  }

  async deleteProduct(slug: string) {
    return this.request(`/products/${slug}/`, {
      method: 'DELETE',
    });
  }

  async getProductReviews(slug: string, params: any = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/products/${slug}/reviews/?${queryString}`);
  }

  // ============ REVIEWS ============

  async getReviews(params: any = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/reviews/?${queryString}`);
  }

  async createReview(data: any) {
    return this.request('/reviews/', {
      method: 'POST',
      body: data,
    });
  }

  async updateReview(id: string | number, data: any) {
    return this.request(`/reviews/${id}/`, {
      method: 'PATCH',
      body: data,
    });
  }

  async deleteReview(id: string | number) {
    return this.request(`/reviews/${id}/`, {
      method: 'DELETE',
    });
  }

  // ============ ORDERS ============

  async getOrders(params: any = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/orders/?${queryString}`);
  }

  async getOrder(id: string | number) {
    return this.request(`/orders/${id}/`);
  }

  async createOrder(data: any) {
    return this.request('/orders/', {
      method: 'POST',
      body: data,
    });
  }

  async updateOrder(id: string | number, data: any) {
    return this.request(`/orders/${id}/`, {
      method: 'PATCH',
      body: data,
    });
  }

  // ============ PROJECTS ============

  async getProjects(params: any = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/projects/?${queryString}`);
  }

  async createProject(data: any) {
    return this.request('/projects/', {
      method: 'POST',
      body: data,
    });
  }

  async updateProject(id: number | string, data: any) {
    return this.request(`/projects/${id}/`, {
      method: 'PATCH',
      body: data,
    });
  }

  async deleteProject(id: number | string) {
    return this.request(`/projects/${id}/`, {
      method: 'DELETE',
    });
  }

  // ============ CHAT ============

  async getChatRooms() {
    return this.request('/chat-rooms/');
  }

  async createChatRoom(data: any) {
    return this.request('/chat-rooms/', {
      method: 'POST',
      body: data,
    });
  }

  async getChatMessages(roomId: number | string) {
    return this.request(`/messages/?room=${roomId}`);
  }

  async sendChatMessage(roomId: number | string, content: string) {
    return this.request('/messages/', {
      method: 'POST',
      body: { room: roomId, content },
    });
  }

  // ============ CATEGORIES ============

  async getCategories(params: any = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/categories/?${queryString}`);
  }

  async getCategory(slug: string) {
    return this.request(`/categories/${slug}/`);
  }

  // ============ ARTISTS ============

  async getArtists(params: any = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/artists/?${queryString}`);
  }

  async getArtist(id: string | number) {
    return this.request(`/artists/${id}/`);
  }

  /**
   * Resolve media URLs (handle both absolute and relative paths)
   */
  getMediaUrl(path: string | null | undefined): string {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    const baseUrl = this.baseURL.replace('/api', '');
    return `${baseUrl}${path.startsWith('/') ? '' : '/'}${path}`;
  }
}

// Create singleton instance
const apiClient = new APIClient();

export default apiClient;
