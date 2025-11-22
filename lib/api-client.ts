/**
 * API Client for HarvestConnect Frontend
 * Handles all communication with Django REST API
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
const API_TIMEOUT = parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || '30000');

class APIClient {
  constructor(baseURL = API_BASE_URL) {
    this.baseURL = baseURL;
    this.timeout = API_TIMEOUT;
    this.token = null;
  }

  /**
   * Set authentication token
   */
  setToken(token) {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('access_token', token);
    }
  }

  /**
   * Get stored authentication token
   */
  getToken() {
    if (typeof window !== 'undefined' && !this.token) {
      this.token = localStorage.getItem('access_token');
    }
    return this.token;
  }

  /**
   * Make HTTP request
   */
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    // Add auth token if available
    const token = this.getToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const config = {
      method: options.method || 'GET',
      headers,
      signal: AbortSignal.timeout(this.timeout),
      ...options,
    };

    if (options.body) {
      config.body = JSON.stringify(options.body);
    }

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        if (response.status === 401) {
          // Token expired, clear it
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

  // ============ AUTHENTICATION ============

  /**
   * Register new user
   */
  async register(data) {
    return this.request('/auth/registration/', {
      method: 'POST',
      body: data,
    });
  }

  /**
   * Login user
   */
  async login(email, password) {
    const response = await this.request('/auth/login/', {
      method: 'POST',
      body: { email, password },
    });
    if (response.access) {
      this.setToken(response.access);
    }
    return response;
  }

  /**
   * Logout user
   */
  async logout() {
    await this.request('/auth/logout/', { method: 'POST' });
    this.setToken(null);
  }

  /**
   * Refresh access token
   */
  async refreshToken(refresh) {
    const response = await this.request('/auth/refresh/', {
      method: 'POST',
      body: { refresh },
    });
    if (response.access) {
      this.setToken(response.access);
    }
    return response;
  }

  /**
   * Get current user profile
   */
  async getCurrentUser() {
    return this.request('/users/me/');
  }

  // ============ BLOG POSTS ============

  /**
   * Get all blog posts
   */
  async getBlogPosts(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/blog-posts/?${queryString}`);
  }

  /**
   * Get single blog post
   */
  async getBlogPost(slug) {
    return this.request(`/blog-posts/${slug}/`);
  }

  /**
   * Create blog post (authenticated)
   */
  async createBlogPost(data) {
    return this.request('/blog-posts/', {
      method: 'POST',
      body: data,
    });
  }

  /**
   * Update blog post (owner only)
   */
  async updateBlogPost(slug, data) {
    return this.request(`/blog-posts/${slug}/`, {
      method: 'PATCH',
      body: data,
    });
  }

  /**
   * Delete blog post (owner only)
   */
  async deleteBlogPost(slug) {
    return this.request(`/blog-posts/${slug}/`, {
      method: 'DELETE',
    });
  }

  /**
   * Increment blog post views
   */
  async incrementBlogPostViews(slug) {
    return this.request(`/blog-posts/${slug}/increment_views/`, {
      method: 'POST',
    });
  }

  // ============ PRODUCTS ============

  /**
   * Get all products
   */
  async getProducts(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/products/?${queryString}`);
  }

  /**
   * Get single product
   */
  async getProduct(slug) {
    return this.request(`/products/${slug}/`);
  }

  /**
   * Create product (sellers only)
   */
  async createProduct(data) {
    return this.request('/products/', {
      method: 'POST',
      body: data,
    });
  }

  /**
   * Update product (seller only)
   */
  async updateProduct(slug, data) {
    return this.request(`/products/${slug}/`, {
      method: 'PATCH',
      body: data,
    });
  }

  /**
   * Delete product (seller only)
   */
  async deleteProduct(slug) {
    return this.request(`/products/${slug}/`, {
      method: 'DELETE',
    });
  }

  /**
   * Get product reviews
   */
  async getProductReviews(slug, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/products/${slug}/reviews/?${queryString}`);
  }

  // ============ REVIEWS ============

  /**
   * Get all reviews
   */
  async getReviews(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/reviews/?${queryString}`);
  }

  /**
   * Create review (authenticated)
   */
  async createReview(data) {
    return this.request('/reviews/', {
      method: 'POST',
      body: data,
    });
  }

  /**
   * Update review
   */
  async updateReview(id, data) {
    return this.request(`/reviews/${id}/`, {
      method: 'PATCH',
      body: data,
    });
  }

  /**
   * Delete review
   */
  async deleteReview(id) {
    return this.request(`/reviews/${id}/`, {
      method: 'DELETE',
    });
  }

  // ============ ORDERS ============

  /**
   * Get user's orders
   */
  async getOrders(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/orders/?${queryString}`);
  }

  /**
   * Get single order
   */
  async getOrder(id) {
    return this.request(`/orders/${id}/`);
  }

  /**
   * Create order (authenticated)
   */
  async createOrder(data) {
    return this.request('/orders/', {
      method: 'POST',
      body: data,
    });
  }

  /**
   * Update order
   */
  async updateOrder(id, data) {
    return this.request(`/orders/${id}/`, {
      method: 'PATCH',
      body: data,
    });
  }

  // ============ CATEGORIES ============

  /**
   * Get all categories
   */
  async getCategories(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/categories/?${queryString}`);
  }

  /**
   * Get single category
   */
  async getCategory(slug) {
    return this.request(`/categories/${slug}/`);
  }

  // ============ ARTISTS ============

  /**
   * Get featured artists
   */
  async getArtists(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/artists/?${queryString}`);
  }

  /**
   * Get single artist
   */
  async getArtist(id) {
    return this.request(`/artists/${id}/`);
  }
}

// Create singleton instance
const apiClient = new APIClient();

export default apiClient;
