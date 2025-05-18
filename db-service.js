/**
 * Epic Tech AI Dev 2.0
 * Database Service
 * 
 * This file handles the storage and retrieval of conversations using IndexedDB
 */

class DatabaseService {
  constructor() {
    this.dbName = 'epicTechAI';
    this.dbVersion = 1;
    this.db = null;
    this.isInitialized = false;
    
    // Initialize the database
    this.init();
  }
  
  /**
   * Initialize the database
   * @returns {Promise} - Resolves when database is initialized
   */
  async init() {
    if (this.isInitialized) return Promise.resolve();
    
    return new Promise((resolve, reject) => {
      // Open the database
      const request = indexedDB.open(this.dbName, this.dbVersion);
      
      // Handle database upgrade (first time or version change)
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        
        // Create conversations store
        if (!db.objectStoreNames.contains('conversations')) {
          const conversationsStore = db.createObjectStore('conversations', { keyPath: 'id', autoIncrement: true });
          conversationsStore.createIndex('title', 'title', { unique: false });
          conversationsStore.createIndex('timestamp', 'timestamp', { unique: false });
        }
        
        // Create messages store
        if (!db.objectStoreNames.contains('messages')) {
          const messagesStore = db.createObjectStore('messages', { keyPath: 'id', autoIncrement: true });
          messagesStore.createIndex('conversationId', 'conversationId', { unique: false });
          messagesStore.createIndex('timestamp', 'timestamp', { unique: false });
        }
        
        // Create files store
        if (!db.objectStoreNames.contains('files')) {
          const filesStore = db.createObjectStore('files', { keyPath: 'id', autoIncrement: true });
          filesStore.createIndex('messageId', 'messageId', { unique: false });
          filesStore.createIndex('name', 'name', { unique: false });
        }
      };
      
      // Handle success
      request.onsuccess = (event) => {
        this.db = event.target.result;
        this.isInitialized = true;
        resolve();
      };
      
      // Handle error
      request.onerror = (event) => {
        console.error('Database error:', event.target.error);
        reject(event.target.error);
      };
    });
  }
  
  /**
   * Create a new conversation
   * @param {string} title - The conversation title
   * @returns {Promise<number>} - Resolves with the new conversation ID
   */
  async createConversation(title) {
    await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['conversations'], 'readwrite');
      const store = transaction.objectStore('conversations');
      
      const conversation = {
        title: title || 'New Conversation',
        timestamp: Date.now(),
        lastMessage: '',
        messageCount: 0
      };
      
      const request = store.add(conversation);
      
      request.onsuccess = (event) => {
        resolve(event.target.result); // Returns the new conversation ID
      };
      
      request.onerror = (event) => {
        console.error('Error creating conversation:', event.target.error);
        reject(event.target.error);
      };
    });
  }
  
  /**
   * Get all conversations
   * @returns {Promise<Array>} - Resolves with an array of conversations
   */
  async getConversations() {
    await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['conversations'], 'readonly');
      const store = transaction.objectStore('conversations');
      const index = store.index('timestamp');
      
      const request = index.openCursor(null, 'prev'); // Sort by timestamp descending
      const conversations = [];
      
      request.onsuccess = (event) => {
        const cursor = event.target.result;
        
        if (cursor) {
          conversations.push(cursor.value);
          cursor.continue();
        } else {
          resolve(conversations);
        }
      };
      
      request.onerror = (event) => {
        console.error('Error getting conversations:', event.target.error);
        reject(event.target.error);
      };
    });
  }
  
  /**
   * Get a conversation by ID
   * @param {number} id - The conversation ID
   * @returns {Promise<Object>} - Resolves with the conversation object
   */
  async getConversation(id) {
    await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['conversations'], 'readonly');
      const store = transaction.objectStore('conversations');
      
      const request = store.get(id);
      
      request.onsuccess = (event) => {
        resolve(event.target.result);
      };
      
      request.onerror = (event) => {
        console.error('Error getting conversation:', event.target.error);
        reject(event.target.error);
      };
    });
  }
  
  /**
   * Update a conversation
   * @param {Object} conversation - The conversation object to update
   * @returns {Promise<void>} - Resolves when the conversation is updated
   */
  async updateConversation(conversation) {
    await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['conversations'], 'readwrite');
      const store = transaction.objectStore('conversations');
      
      const request = store.put(conversation);
      
      request.onsuccess = () => {
        resolve();
      };
      
      request.onerror = (event) => {
        console.error('Error updating conversation:', event.target.error);
        reject(event.target.error);
      };
    });
  }
  
  /**
   * Delete a conversation and all its messages
   * @param {number} id - The conversation ID
   * @returns {Promise<void>} - Resolves when the conversation is deleted
   */
  async deleteConversation(id) {
    await this.init();
    
    // First delete all messages in the conversation
    await this.deleteMessagesInConversation(id);
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['conversations'], 'readwrite');
      const store = transaction.objectStore('conversations');
      
      const request = store.delete(id);
      
      request.onsuccess = () => {
        resolve();
      };
      
      request.onerror = (event) => {
        console.error('Error deleting conversation:', event.target.error);
        reject(event.target.error);
      };
    });
  }
  
  /**
   * Add a message to a conversation
   * @param {number} conversationId - The conversation ID
   * @param {string} text - The message text
   * @param {string} sender - The message sender ('user' or 'ai')
   * @param {Array} files - Optional array of file objects
   * @returns {Promise<number>} - Resolves with the new message ID
   */
  async addMessage(conversationId, text, sender, files = []) {
    await this.init();
    
    // Add the message
    const messageId = await new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['messages'], 'readwrite');
      const store = transaction.objectStore('messages');
      
      const message = {
        conversationId,
        text,
        sender,
        timestamp: Date.now(),
        hasFiles: files.length > 0
      };
      
      const request = store.add(message);
      
      request.onsuccess = (event) => {
        resolve(event.target.result); // Returns the new message ID
      };
      
      request.onerror = (event) => {
        console.error('Error adding message:', event.target.error);
        reject(event.target.error);
      };
    });
    
    // Add files if any
    if (files.length > 0) {
      await this.addFiles(messageId, files);
    }
    
    // Update conversation with last message and count
    const conversation = await this.getConversation(conversationId);
    if (conversation) {
      conversation.lastMessage = text.substring(0, 50) + (text.length > 50 ? '...' : '');
      conversation.messageCount = (conversation.messageCount || 0) + 1;
      conversation.timestamp = Date.now();
      await this.updateConversation(conversation);
    }
    
    return messageId;
  }
  
  /**
   * Get all messages in a conversation
   * @param {number} conversationId - The conversation ID
   * @returns {Promise<Array>} - Resolves with an array of messages
   */
  async getMessages(conversationId) {
    await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['messages'], 'readonly');
      const store = transaction.objectStore('messages');
      const index = store.index('conversationId');
      
      const request = index.openCursor(IDBKeyRange.only(conversationId));
      const messages = [];
      
      request.onsuccess = (event) => {
        const cursor = event.target.result;
        
        if (cursor) {
          messages.push(cursor.value);
          cursor.continue();
        } else {
          // Sort by timestamp
          messages.sort((a, b) => a.timestamp - b.timestamp);
          resolve(messages);
        }
      };
      
      request.onerror = (event) => {
        console.error('Error getting messages:', event.target.error);
        reject(event.target.error);
      };
    });
  }
  
  /**
   * Delete all messages in a conversation
   * @param {number} conversationId - The conversation ID
   * @returns {Promise<void>} - Resolves when all messages are deleted
   */
  async deleteMessagesInConversation(conversationId) {
    await this.init();
    
    // Get all messages in the conversation
    const messages = await this.getMessages(conversationId);
    
    // Delete files for each message
    for (const message of messages) {
      if (message.hasFiles) {
        await this.deleteFilesForMessage(message.id);
      }
    }
    
    // Delete the messages
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['messages'], 'readwrite');
      const store = transaction.objectStore('messages');
      const index = store.index('conversationId');
      
      const request = index.openCursor(IDBKeyRange.only(conversationId));
      
      request.onsuccess = (event) => {
        const cursor = event.target.result;
        
        if (cursor) {
          cursor.delete();
          cursor.continue();
        } else {
          resolve();
        }
      };
      
      request.onerror = (event) => {
        console.error('Error deleting messages:', event.target.error);
        reject(event.target.error);
      };
    });
  }
  
  /**
   * Add files to a message
   * @param {number} messageId - The message ID
   * @param {Array} files - Array of file objects
   * @returns {Promise<void>} - Resolves when all files are added
   */
  async addFiles(messageId, files) {
    await this.init();
    
    const promises = files.map(file => {
      return new Promise((resolve, reject) => {
        const transaction = this.db.transaction(['files'], 'readwrite');
        const store = transaction.objectStore('files');
        
        const fileObj = {
          messageId,
          name: file.name,
          type: file.type,
          size: file.size,
          data: file,
          timestamp: Date.now()
        };
        
        const request = store.add(fileObj);
        
        request.onsuccess = () => {
          resolve();
        };
        
        request.onerror = (event) => {
          console.error('Error adding file:', event.target.error);
          reject(event.target.error);
        };
      });
    });
    
    return Promise.all(promises);
  }
  
  /**
   * Get files for a message
   * @param {number} messageId - The message ID
   * @returns {Promise<Array>} - Resolves with an array of file objects
   */
  async getFilesForMessage(messageId) {
    await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['files'], 'readonly');
      const store = transaction.objectStore('files');
      const index = store.index('messageId');
      
      const request = index.openCursor(IDBKeyRange.only(messageId));
      const files = [];
      
      request.onsuccess = (event) => {
        const cursor = event.target.result;
        
        if (cursor) {
          files.push(cursor.value);
          cursor.continue();
        } else {
          resolve(files);
        }
      };
      
      request.onerror = (event) => {
        console.error('Error getting files:', event.target.error);
        reject(event.target.error);
      };
    });
  }
  
  /**
   * Delete files for a message
   * @param {number} messageId - The message ID
   * @returns {Promise<void>} - Resolves when all files are deleted
   */
  async deleteFilesForMessage(messageId) {
    await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['files'], 'readwrite');
      const store = transaction.objectStore('files');
      const index = store.index('messageId');
      
      const request = index.openCursor(IDBKeyRange.only(messageId));
      
      request.onsuccess = (event) => {
        const cursor = event.target.result;
        
        if (cursor) {
          cursor.delete();
          cursor.continue();
        } else {
          resolve();
        }
      };
      
      request.onerror = (event) => {
        console.error('Error deleting files:', event.target.error);
        reject(event.target.error);
      };
    });
  }
  
  /**
   * Export all conversations and messages as JSON
   * @returns {Promise<Object>} - Resolves with the exported data
   */
  async exportData() {
    await this.init();
    
    const conversations = await this.getConversations();
    const exportData = {
      conversations: [],
      version: this.dbVersion,
      timestamp: Date.now()
    };
    
    for (const conversation of conversations) {
      const messages = await this.getMessages(conversation.id);
      
      // Process messages to include files
      const processedMessages = [];
      for (const message of messages) {
        const processedMessage = { ...message };
        
        if (message.hasFiles) {
          const files = await this.getFilesForMessage(message.id);
          processedMessage.files = files.map(file => ({
            name: file.name,
            type: file.type,
            size: file.size,
            // Don't include the actual file data in the export
          }));
        }
        
        processedMessages.push(processedMessage);
      }
      
      exportData.conversations.push({
        ...conversation,
        messages: processedMessages
      });
    }
    
    return exportData;
  }
  
  /**
   * Import data from a JSON export
   * @param {Object} data - The data to import
   * @returns {Promise<void>} - Resolves when import is complete
   */
  async importData(data) {
    await this.init();
    
    // Validate the data
    if (!data || !data.conversations || !Array.isArray(data.conversations)) {
      throw new Error('Invalid import data format');
    }
    
    // Import each conversation
    for (const conversationData of data.conversations) {
      // Create the conversation
      const conversationId = await this.createConversation(conversationData.title);
      
      // Update the conversation with additional data
      const conversation = await this.getConversation(conversationId);
      conversation.timestamp = conversationData.timestamp || Date.now();
      conversation.lastMessage = conversationData.lastMessage || '';
      conversation.messageCount = conversationData.messages ? conversationData.messages.length : 0;
      await this.updateConversation(conversation);
      
      // Import messages
      if (conversationData.messages && Array.isArray(conversationData.messages)) {
        for (const messageData of conversationData.messages) {
          await this.addMessage(
            conversationId,
            messageData.text || '',
            messageData.sender || 'user',
            [] // Files can't be imported from JSON
          );
        }
      }
    }
  }
}

// Create and export singleton instance
const dbService = new DatabaseService();