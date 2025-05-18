/**
 * Epic Tech AI - API Service
 * 
 * This service handles communication with the Cloudflare Worker API
 * for storing and retrieving conversations and messages.
 */

class ApiService {
  constructor() {
    // Base URL for API requests - will be updated based on the current domain
    this.baseUrl = '';
    this.initBaseUrl();
    
    // Event callbacks
    this.onError = null;
  }
  
  /**
   * Initialize the base URL based on the current domain
   */
  initBaseUrl() {
    const domain = window.location.hostname;
    
    if (domain === 'localhost' || domain.includes('127.0.0.1')) {
      // Local development
      this.baseUrl = 'http://localhost:8787/api';
    } else if (domain === 'epictech.ai' || domain.includes('epictech.ai')) {
      // Production domain
      this.baseUrl = 'https://epictech.ai/api';
    } else {
      // Cloudflare Pages preview domain
      this.baseUrl = `https://${domain}/api`;
    }
    
    console.log('API Service initialized with base URL:', this.baseUrl);
  }
  
  /**
   * Make an API request
   * @param {string} endpoint - The API endpoint
   * @param {string} method - The HTTP method
   * @param {object} data - The request data (for POST/PUT)
   * @returns {Promise} - Resolves with the response data
   */
  async request(endpoint, method = 'GET', data = null) {
    const url = `${this.baseUrl}/${endpoint}`;
    
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'same-origin',
    };
    
    if (data) {
      options.body = JSON.stringify(data);
    }
    
    try {
      const response = await fetch(url, options);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `API request failed with status ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request error:', error);
      
      if (this.onError) {
        this.onError(error.message);
      }
      
      throw error;
    }
  }
  
  /**
   * Get all conversations
   * @returns {Promise<Array>} - Resolves with an array of conversations
   */
  async getConversations() {
    return this.request('conversations');
  }
  
  /**
   * Get a specific conversation with its messages
   * @param {number} id - The conversation ID
   * @returns {Promise<Object>} - Resolves with the conversation object
   */
  async getConversation(id) {
    return this.request(`conversations/${id}`);
  }
  
  /**
   * Create a new conversation
   * @param {string} title - The conversation title
   * @returns {Promise<Object>} - Resolves with the new conversation object
   */
  async createConversation(title) {
    return this.request('conversations', 'POST', { title });
  }
  
  /**
   * Update a conversation
   * @param {number} id - The conversation ID
   * @param {string} title - The new title
   * @returns {Promise<Object>} - Resolves with the updated conversation object
   */
  async updateConversation(id, title) {
    return this.request(`conversations/${id}`, 'PUT', { title });
  }
  
  /**
   * Delete a conversation
   * @param {number} id - The conversation ID
   * @returns {Promise<Object>} - Resolves with a success message
   */
  async deleteConversation(id) {
    return this.request(`conversations/${id}`, 'DELETE');
  }
  
  /**
   * Create a new message
   * @param {number} conversationId - The conversation ID
   * @param {string} content - The message content
   * @param {string} role - The message role ('user' or 'ai')
   * @returns {Promise<Object>} - Resolves with the new message object
   */
  async createMessage(conversationId, content, role) {
    return this.request('messages', 'POST', {
      conversation_id: conversationId,
      content,
      role
    });
  }
  
  /**
   * Delete a message
   * @param {number} id - The message ID
   * @returns {Promise<Object>} - Resolves with a success message
   */
  async deleteMessage(id) {
    return this.request(`messages/${id}`, 'DELETE');
  }
  
  /**
   * Export all data
   * @returns {Promise<Object>} - Resolves with all conversations and messages
   */
  async exportData() {
    return this.request('export');
  }
  
  /**
   * Import data
   * @param {Object} data - The data to import
   * @returns {Promise<Object>} - Resolves with import results
   */
  async importData(data) {
    return this.request('conversations/import', 'POST', data);
  }
}

// Create and export a singleton instance
const apiService = new ApiService();