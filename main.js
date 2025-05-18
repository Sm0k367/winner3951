// EPIC TECH AI DEV 2.0 - FUTURISTIC CHAT BOT PLATFORM

// DOM Elements
document.addEventListener('DOMContentLoaded', () => {
  // Header scroll effect
  const header = document.querySelector('.header');
  const heroSection = document.querySelector('.hero');
  
  // AI Assistant elements
  const aiAssistant = document.querySelector('.ai-assistant');
  const aiStatusText = document.querySelector('.ai-status-text');
  const aiParticles = document.querySelector('.ai-particles');
  
  // Chat elements
  const chatMessages = document.querySelector('.chat-messages');
  const chatInput = document.querySelector('.chat-input');
  const chatSendBtn = document.querySelector('.chat-send-btn');
  const chatForm = document.querySelector('.chat-form');
  const mobileSidebarToggle = document.querySelector('.mobile-sidebar-toggle');
  const chatSidebar = document.querySelector('.chat-sidebar');
  
  // Conversation elements
  const conversationsList = document.getElementById('conversationsList');
  const newChatBtn = document.getElementById('newChatBtn');
  const exportBtn = document.getElementById('exportBtn');
  const importBtn = document.getElementById('importBtn');
  const importFile = document.getElementById('import-file');
  let currentConversationId = 'current'; // 'current' means not saved yet
  
  // File upload elements
  const fileUploadInput = document.getElementById('file-upload');
  const filePreviewContainer = document.querySelector('.file-preview-container');
  const filePreviewList = document.querySelector('.file-preview-list');
  const filePreviewClear = document.querySelector('.file-preview-clear');
  const selectedFiles = new Map(); // Store selected files
  
  // Settings elements
  const settingsBtn = document.querySelector('.chat-action-btn[title="Settings"]');
  const settingsModal = document.getElementById('settingsModal');
  const settingsCloseBtn = document.querySelector('.settings-close-btn');
  const apiKeyInput = document.getElementById('apiKey');
  const togglePasswordBtn = document.querySelector('.toggle-password-btn');
  const aiModelSelect = document.getElementById('aiModel');
  const personalityOptions = document.querySelectorAll('.personality-option');
  const voiceInputToggle = document.getElementById('voiceInput');
  const voiceOutputToggle = document.getElementById('voiceOutput');
  const saveSettingsBtn = document.getElementById('saveSettingsBtn');
  const clearConversationBtn = document.getElementById('clearConversationBtn');
  
  // Feature animations
  const featureCards = document.querySelectorAll('.feature-card');
  
  // Holographic UI elements
  const holoElements = document.querySelectorAll('.holo-element');
  const holoData = document.querySelectorAll('.holo-data');
  
  // Initialize AI Service
  initAIService();
  
  // Initialize particles
  initParticles();
  
  // Initialize holographic data
  initHolographicData();
  
  // Initialize file upload
  initFileUpload();
  
  // Initialize voice functionality
  initVoiceFeatures();
  
  // Initialize conversation management
  initConversationManagement();
  
  // Header scroll effect
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
  
  // Mobile sidebar toggle
  if (mobileSidebarToggle) {
    mobileSidebarToggle.addEventListener('click', () => {
      chatSidebar.classList.toggle('active');
    });
  }
  
  // Settings modal toggle
  if (settingsBtn) {
    settingsBtn.addEventListener('click', () => {
      openSettingsModal();
    });
  }
  
  // Close settings modal
  if (settingsCloseBtn) {
    settingsCloseBtn.addEventListener('click', () => {
      closeSettingsModal();
    });
  }
  
  // Close modal when clicking outside
  if (settingsModal) {
    settingsModal.addEventListener('click', (e) => {
      if (e.target === settingsModal) {
        closeSettingsModal();
      }
    });
  }
  
  // Toggle password visibility
  if (togglePasswordBtn) {
    togglePasswordBtn.addEventListener('click', () => {
      const type = apiKeyInput.getAttribute('type') === 'password' ? 'text' : 'password';
      apiKeyInput.setAttribute('type', type);
      
      const icon = togglePasswordBtn.querySelector('i');
      icon.classList.toggle('fa-eye');
      icon.classList.toggle('fa-eye-slash');
    });
  }
  
  // Personality option selection
  if (personalityOptions.length > 0) {
    personalityOptions.forEach(option => {
      option.addEventListener('click', () => {
        // Remove active class from all options
        personalityOptions.forEach(opt => opt.classList.remove('active'));
        
        // Add active class to selected option
        option.classList.add('active');
        
        // Get personality type from data attribute
        const personality = option.getAttribute('data-personality');
        
        // Store selected personality
        if (personality) {
          localStorage.setItem('epic_tech_ai_personality', personality);
        }
      });
    });
    
    // Set initial active personality from localStorage if available
    const savedPersonality = localStorage.getItem('epic_tech_ai_personality');
    if (savedPersonality) {
      const savedOption = document.querySelector(`.personality-option[data-personality="${savedPersonality}"]`);
      if (savedOption) {
        personalityOptions.forEach(opt => opt.classList.remove('active'));
        savedOption.classList.add('active');
      }
    }
  }
  
  // Save settings
  if (saveSettingsBtn) {
    saveSettingsBtn.addEventListener('click', () => {
      saveSettings();
    });
  }
  
  // Clear conversation
  if (clearConversationBtn) {
    clearConversationBtn.addEventListener('click', () => {
      clearConversation();
    });
  }
  
  // Initialize AI Service
  function initAIService() {
    // Check if API key is already stored
    if (aiService.checkApiKey()) {
      // Update UI to show API key is set
      if (apiKeyInput) {
        apiKeyInput.value = '••••••••••••••••••••••••••';
      }
      
      // Show success notification
      window.showNotification('API key loaded successfully', 'success');
    }
    
    // Set up AI service events
    aiService.onThinking = () => {
      showTypingIndicator();
      updateAIStatus('Thinking...');
    };
    
    aiService.onResponse = (response) => {
      removeTypingIndicator();
      updateAIStatus('Ready');
    };
  }
  
  // Open settings modal
  function openSettingsModal() {
    if (settingsModal) {
      settingsModal.classList.add('active');
      document.body.classList.add('overflow-hidden');
    }
  }
  
  // Close settings modal
  function closeSettingsModal() {
    if (settingsModal) {
      settingsModal.classList.remove('active');
      document.body.classList.remove('overflow-hidden');
    }
  }
  
  // Save settings
  function saveSettings() {
    // Get API key
    const apiKey = apiKeyInput.value;
    
    // If API key is not placeholder and not empty
    if (apiKey && apiKey !== '••••••••••••••••••••••••••') {
      // Set API key
      const success = aiService.setApiKey(apiKey);
      
      if (success) {
        // Show success notification
        window.showNotification('API key saved successfully', 'success');
        
        // Mask the API key
        apiKeyInput.value = '••••••••••••••••••••••••••';
      } else {
        // Show error notification
        window.showNotification('Failed to save API key', 'error');
      }
    }
    
    // Get selected model
    const model = aiModelSelect.value;
    
    // Get selected personality
    const activePersonality = document.querySelector('.personality-option.active');
    const personalityType = activePersonality ? activePersonality.getAttribute('data-personality') : 'professional';
    
    // Save model
    localStorage.setItem('epic_tech_ai_model', model);
    
    // Apply personality to AI service
    if (personalityType) {
      const success = aiService.setPersonality(personalityType);
      if (success) {
        window.showNotification(`AI personality set to ${personalityType}`, 'success');
      }
    }
    
    // Save voice settings
    if (voiceInputToggle) {
      localStorage.setItem('epic_tech_ai_voice_input', voiceInputToggle.checked);
    }
    
    if (voiceOutputToggle) {
      localStorage.setItem('epic_tech_ai_voice_output', voiceOutputToggle.checked);
      speechService.setEnabled(voiceOutputToggle.checked);
    }
    
    // Close modal
    closeSettingsModal();
  }
  
  // Clear conversation
  function clearConversation() {
    // Clear chat messages
    if (chatMessages) {
      // Keep only the first message (welcome message)
      const welcomeMessage = chatMessages.querySelector('.message');
      if (welcomeMessage) {
        chatMessages.innerHTML = '';
        chatMessages.appendChild(welcomeMessage);
      } else {
        chatMessages.innerHTML = '';
      }
    }
    
    // Clear conversation history in AI service
    aiService.clearConversation();
    
    // Show notification
    window.showNotification('Conversation cleared', 'info');
    
    // Close modal
    closeSettingsModal();
  }
  
  // Initialize file upload functionality
  function initFileUpload() {
    if (!fileUploadInput) return;
    
    // Handle file selection
    fileUploadInput.addEventListener('change', (e) => {
      const files = e.target.files;
      
      if (files.length > 0) {
        // Process each selected file
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          addFileToPreview(file);
        }
        
        // Show file preview container
        showFilePreview();
        
        // Reset file input
        fileUploadInput.value = '';
      }
    });
    
    // Clear all files
    if (filePreviewClear) {
      filePreviewClear.addEventListener('click', () => {
        clearFilePreview();
      });
    }
  }
  
  // Add file to preview
  function addFileToPreview(file) {
    // Generate unique ID for the file
    const fileId = Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    
    // Store file in map
    selectedFiles.set(fileId, file);
    
    // Create file preview element
    const filePreviewItem = document.createElement('div');
    filePreviewItem.classList.add('file-preview-item');
    filePreviewItem.dataset.fileId = fileId;
    
    // Get appropriate icon based on file type
    const fileIcon = getFileIcon(file.type);
    
    // Format file size
    const fileSize = formatFileSize(file.size);
    
    filePreviewItem.innerHTML = `
      <div class="file-preview-info">
        <div class="file-preview-icon">
          <i class="${fileIcon}"></i>
        </div>
        <div class="file-preview-name">${file.name}</div>
        <div class="file-preview-size">${fileSize}</div>
      </div>
      <button type="button" class="file-preview-remove" data-file-id="${fileId}">
        <i class="fas fa-times"></i>
      </button>
    `;
    
    // Add to preview list
    filePreviewList.appendChild(filePreviewItem);
    
    // Add remove event listener
    const removeButton = filePreviewItem.querySelector('.file-preview-remove');
    removeButton.addEventListener('click', () => {
      removeFileFromPreview(fileId);
    });
  }
  
  // Remove file from preview
  function removeFileFromPreview(fileId) {
    // Remove from map
    selectedFiles.delete(fileId);
    
    // Remove from DOM
    const fileItem = filePreviewList.querySelector(`[data-file-id="${fileId}"]`);
    if (fileItem) {
      fileItem.remove();
    }
    
    // Hide preview if no files left
    if (selectedFiles.size === 0) {
      hideFilePreview();
    }
  }
  
  // Show file preview container
  function showFilePreview() {
    filePreviewContainer.style.display = 'block';
  }
  
  // Hide file preview container
  function hideFilePreview() {
    filePreviewContainer.style.display = 'none';
  }
  
  // Clear all files from preview
  function clearFilePreview() {
    // Clear map
    selectedFiles.clear();
    
    // Clear DOM
    filePreviewList.innerHTML = '';
    
    // Hide preview
    hideFilePreview();
  }
  
  // Get appropriate icon based on file type
  function getFileIcon(fileType) {
    if (fileType.startsWith('image/')) {
      return 'fas fa-file-image';
    } else if (fileType.startsWith('video/')) {
      return 'fas fa-file-video';
    } else if (fileType.startsWith('audio/')) {
      return 'fas fa-file-audio';
    } else if (fileType === 'application/pdf') {
      return 'fas fa-file-pdf';
    } else if (fileType.includes('word') || fileType === 'application/rtf' || fileType === 'text/rtf') {
      return 'fas fa-file-word';
    } else if (fileType.includes('excel') || fileType.includes('spreadsheet')) {
      return 'fas fa-file-excel';
    } else if (fileType.includes('powerpoint') || fileType.includes('presentation')) {
      return 'fas fa-file-powerpoint';
    } else if (fileType.startsWith('text/')) {
      return 'fas fa-file-alt';
    } else if (fileType.includes('zip') || fileType.includes('compressed') || fileType.includes('archive')) {
      return 'fas fa-file-archive';
    } else if (fileType.includes('javascript') || fileType.includes('json') || fileType.includes('html') || fileType.includes('css')) {
      return 'fas fa-file-code';
    } else {
      return 'fas fa-file';
    }
  }
  
  // Format file size
  function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
  
  // Add file to message
  function addFileToMessage(message, file) {
    // Create file element
    const fileElement = document.createElement('div');
    fileElement.classList.add('message-file');
    
    // Get appropriate icon
    const fileIcon = getFileIcon(file.type);
    
    // Format file size
    const fileSize = formatFileSize(file.size);
    
    // Create object URL for download
    const fileURL = URL.createObjectURL(file);
    
    fileElement.innerHTML = `
      <div class="message-file-icon">
        <i class="${fileIcon}"></i>
      </div>
      <div class="message-file-info">
        <div class="message-file-name">${file.name}</div>
        <div class="message-file-size">${fileSize}</div>
      </div>
      <a href="${fileURL}" download="${file.name}" class="message-file-download">
        <i class="fas fa-download"></i>
      </a>
    `;
    
    // Add file element to message
    message.appendChild(fileElement);
  }
  
  // Initialize conversation management
  function initConversationManagement() {
    // Load saved conversations
    loadConversations();
    
    // New chat button
    if (newChatBtn) {
      newChatBtn.addEventListener('click', () => {
        createNewConversation();
      });
    }
    
    // Export button
    if (exportBtn) {
      exportBtn.addEventListener('click', () => {
        exportConversations();
      });
    }
    
    // Import button
    if (importBtn) {
      importBtn.addEventListener('click', () => {
        importFile.click();
      });
    }
    
    // Import file change
    if (importFile) {
      importFile.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
          importConversations(e.target.files[0]);
        }
      });
    }
  }
  
  // Load saved conversations
  async function loadConversations() {
    try {
      const conversations = await dbService.getConversations();
      
      // Clear the list except for the current conversation
      const currentChat = conversationsList.querySelector('[data-conversation-id="current"]');
      conversationsList.innerHTML = '';
      
      if (currentChat) {
        conversationsList.appendChild(currentChat);
      }
      
      // Add saved conversations
      conversations.forEach(conversation => {
        addConversationToList(conversation);
      });
    } catch (error) {
      console.error('Error loading conversations:', error);
      window.showNotification('Error loading conversations', 'error');
    }
  }
  
  // Add conversation to the list
  function addConversationToList(conversation) {
    const item = document.createElement('li');
    item.classList.add('chat-item');
    item.dataset.conversationId = conversation.id;
    
    item.innerHTML = `
      <div class="chat-item-title">${conversation.title}</div>
      <div class="chat-item-preview">${conversation.lastMessage || 'Empty conversation'}</div>
      <button class="chat-item-delete" title="Delete Conversation">
        <i class="fas fa-trash-alt"></i>
      </button>
    `;
    
    // Add click event to load conversation
    item.addEventListener('click', (e) => {
      // Ignore if delete button was clicked
      if (e.target.closest('.chat-item-delete')) {
        return;
      }
      
      loadConversation(conversation.id);
    });
    
    // Add delete button event
    const deleteBtn = item.querySelector('.chat-item-delete');
    if (deleteBtn) {
      deleteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        deleteConversation(conversation.id);
      });
    }
    
    // Add to list
    conversationsList.appendChild(item);
  }
  
  // Create a new conversation
  function createNewConversation() {
    // Clear chat messages
    chatMessages.innerHTML = '';
    
    // Add welcome message
    addMessage("Hello! I'm your AI assistant. How can I help you today?", 'ai');
    
    // Update current conversation
    currentConversationId = 'current';
    
    // Update active conversation in list
    updateActiveConversation();
    
    // Update chat title
    const chatTitle = document.querySelector('.chat-title');
    if (chatTitle) {
      chatTitle.textContent = 'New Chat';
    }
  }
  
  // Load a conversation
  async function loadConversation(conversationId) {
    try {
      // Get conversation
      const conversation = await dbService.getConversation(conversationId);
      
      if (!conversation) {
        throw new Error('Conversation not found');
      }
      
      // Get messages
      const messages = await dbService.getMessages(conversationId);
      
      // Clear chat messages
      chatMessages.innerHTML = '';
      
      // Add messages to chat
      for (const message of messages) {
        const messageElement = createMessageElement(message.text, message.sender);
        
        // Add files if any
        if (message.hasFiles) {
          const files = await dbService.getFilesForMessage(message.id);
          
          for (const file of files) {
            addFileToMessage(messageElement, file.data);
          }
        }
        
        // Add to chat
        chatMessages.appendChild(messageElement);
      }
      
      // Scroll to bottom
      scrollToBottom();
      
      // Update current conversation
      currentConversationId = conversationId;
      
      // Update active conversation in list
      updateActiveConversation();
      
      // Update chat title
      const chatTitle = document.querySelector('.chat-title');
      if (chatTitle) {
        chatTitle.textContent = conversation.title;
      }
    } catch (error) {
      console.error('Error loading conversation:', error);
      window.showNotification('Error loading conversation', 'error');
    }
  }
  
  // Delete a conversation
  async function deleteConversation(conversationId) {
    try {
      // Confirm deletion
      if (!confirm('Are you sure you want to delete this conversation?')) {
        return;
      }
      
      // Delete conversation
      await dbService.deleteConversation(conversationId);
      
      // If current conversation was deleted, create a new one
      if (currentConversationId === conversationId) {
        createNewConversation();
      }
      
      // Reload conversations
      loadConversations();
      
      // Show notification
      window.showNotification('Conversation deleted', 'success');
    } catch (error) {
      console.error('Error deleting conversation:', error);
      window.showNotification('Error deleting conversation', 'error');
    }
  }
  
  // Update active conversation in list
  function updateActiveConversation() {
    // Remove active class from all items
    const items = conversationsList.querySelectorAll('.chat-item');
    items.forEach(item => {
      item.classList.remove('active');
    });
    
    // Add active class to current conversation
    const currentItem = conversationsList.querySelector(`[data-conversation-id="${currentConversationId}"]`);
    if (currentItem) {
      currentItem.classList.add('active');
    }
  }
  
  // Save current conversation
  async function saveCurrentConversation() {
    // If already saved, update it
    if (currentConversationId !== 'current') {
      return currentConversationId;
    }
    
    try {
      // Create a new conversation
      const title = 'Chat ' + new Date().toLocaleString();
      const conversationId = await dbService.createConversation(title);
      
      // Get all messages from the chat
      const messageElements = chatMessages.querySelectorAll('.message');
      
      // Add messages to the conversation
      for (const messageElement of messageElements) {
        const sender = messageElement.classList.contains('message-user') ? 'user' : 'ai';
        const textElement = messageElement.querySelector('.message-text');
        const text = textElement ? textElement.textContent : '';
        
        // Get files if any
        const fileElements = messageElement.querySelectorAll('.message-file');
        const files = [];
        
        // Note: In a real app, we would extract the files here
        // For this demo, we'll just save the messages without files
        
        // Add message to database
        await dbService.addMessage(conversationId, text, sender, files);
      }
      
      // Update current conversation
      currentConversationId = conversationId;
      
      // Reload conversations
      loadConversations();
      
      // Update active conversation
      updateActiveConversation();
      
      // Update chat title
      const chatTitle = document.querySelector('.chat-title');
      if (chatTitle) {
        chatTitle.textContent = title;
      }
      
      return conversationId;
    } catch (error) {
      console.error('Error saving conversation:', error);
      window.showNotification('Error saving conversation', 'error');
      return null;
    }
  }
  
  // Export conversations
  async function exportConversations() {
    try {
      // Export data
      const data = await dbService.exportData();
      
      // Convert to JSON
      const json = JSON.stringify(data, null, 2);
      
      // Create blob
      const blob = new Blob([json], { type: 'application/json' });
      
      // Create download link
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `epic_tech_ai_export_${new Date().toISOString().slice(0, 10)}.json`;
      
      // Trigger download
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      // Show notification
      window.showNotification('Conversations exported successfully', 'success');
    } catch (error) {
      console.error('Error exporting conversations:', error);
      window.showNotification('Error exporting conversations', 'error');
    }
  }
  
  // Import conversations
  async function importConversations(file) {
    try {
      // Read file
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        try {
          // Parse JSON
          const data = JSON.parse(e.target.result);
          
          // Import data
          await dbService.importData(data);
          
          // Reload conversations
          loadConversations();
          
          // Show notification
          window.showNotification('Conversations imported successfully', 'success');
        } catch (error) {
          console.error('Error parsing import file:', error);
          window.showNotification('Error importing conversations: Invalid file format', 'error');
        }
      };
      
      reader.onerror = () => {
        console.error('Error reading import file');
        window.showNotification('Error reading import file', 'error');
      };
      
      reader.readAsText(file);
    } catch (error) {
      console.error('Error importing conversations:', error);
      window.showNotification('Error importing conversations', 'error');
    }
  }

  // Chat functionality
  if (chatForm) {
    chatForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const message = chatInput.value.trim();
      const hasFiles = selectedFiles.size > 0;
      
      if (message || hasFiles) {
        // Create message element
        const messageElement = createMessageElement(message, 'user');
        
        // Add files to message if any
        if (hasFiles) {
          selectedFiles.forEach(file => {
            addFileToMessage(messageElement, file);
          });
          
          // Clear file preview
          clearFilePreview();
        }
        
        // Add message to chat
        chatMessages.appendChild(messageElement);
        
        // Scroll to bottom
        scrollToBottom();
        
        // Clear input
        chatInput.value = '';
        
        // Process the message with AI service
        let processMessage = message;
        
        // If there are files, add file information to the message
        if (hasFiles) {
          const fileInfo = Array.from(selectedFiles.values())
            .map(file => `[File: ${file.name}, Type: ${file.type}, Size: ${formatFileSize(file.size)}]`)
            .join('\n');
          
          processMessage = `${message}\n\nAttached files:\n${fileInfo}`;
        }
        
        // Process the message with AI service
        await processAIResponse(processMessage);
        
        // Save conversation if it's the first message
        if (currentConversationId === 'current') {
          const messageCount = chatMessages.querySelectorAll('.message').length;
          if (messageCount >= 3) { // User message + AI welcome + AI response
            saveCurrentConversation();
          }
        } else {
          // Update existing conversation in database
          try {
            // Get the last AI message
            const lastAIMessage = chatMessages.querySelector('.message-ai:last-child');
            const lastAIText = lastAIMessage ? lastAIMessage.querySelector('.message-text').textContent : '';
            
            // Add user message to database
            await dbService.addMessage(currentConversationId, message, 'user', Array.from(selectedFiles.values()));
            
            // Add AI response to database
            if (lastAIText) {
              await dbService.addMessage(currentConversationId, lastAIText, 'ai', []);
            }
          } catch (error) {
            console.error('Error updating conversation:', error);
          }
        }
      }
    });
  }
  
  // Send message on button click
  if (chatSendBtn) {
    chatSendBtn.addEventListener('click', () => {
      const event = new Event('submit');
      chatForm.dispatchEvent(event);
    });
  }
  
  // Send message on Enter key
  if (chatInput) {
    chatInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        const event = new Event('submit');
        chatForm.dispatchEvent(event);
      }
    });
  }
  
  // Feature card animations
  if (featureCards.length > 0) {
    const observerOptions = {
      threshold: 0.2,
      rootMargin: '0px 0px -100px 0px'
    };
    
    const featureObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('fade-in');
          featureObserver.unobserve(entry.target);
        }
      });
    }, observerOptions);
    
    featureCards.forEach(card => {
      featureObserver.observe(card);
    });
  }
  
  // Initialize holographic data elements
  function initHolographicData() {
    if (holoData.length > 0) {
      holoData.forEach(element => {
        setRandomPosition(element);
        setRandomAnimation(element);
      });
    }
  }
  
  // Set random position for holographic elements
  function setRandomPosition(element) {
    const x = Math.random() * 80 + 10; // 10% to 90%
    const y = Math.random() * 80 + 10; // 10% to 90%
    
    element.style.left = `${x}%`;
    element.style.top = `${y}%`;
  }
  
  // Set random animation for holographic elements
  function setRandomAnimation(element) {
    const delay = Math.random() * 5;
    const duration = Math.random() * 5 + 5;
    
    element.style.animationDelay = `${delay}s`;
    element.style.animationDuration = `${duration}s`;
  }
  
  // Initialize particles
  function initParticles() {
    if (aiParticles) {
      // Create particles
      for (let i = 0; i < 50; i++) {
        createParticle();
      }
    }
  }
  
  // Create a single particle
  function createParticle() {
    const particle = document.createElement('div');
    particle.classList.add('particle');
    
    // Random position
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    
    // Random size
    const size = Math.random() * 5 + 2;
    
    // Random color
    const colors = ['#3a7bd5', '#8a3fd1', '#00d4ff', '#ff00aa'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    // Random opacity
    const opacity = Math.random() * 0.5 + 0.2;
    
    // Set styles
    particle.style.left = `${x}%`;
    particle.style.top = `${y}%`;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.backgroundColor = color;
    particle.style.opacity = opacity;
    
    // Add to container
    aiParticles.appendChild(particle);
    
    // Animate
    animateParticle(particle);
  }
  
  // Animate a particle
  function animateParticle(particle) {
    // Random movement
    const xMove = Math.random() * 20 - 10;
    const yMove = Math.random() * 20 - 10;
    const duration = Math.random() * 3 + 2;
    
    // Apply animation
    particle.style.transition = `transform ${duration}s ease-in-out, opacity ${duration}s ease-in-out`;
    particle.style.transform = `translate(${xMove}px, ${yMove}px)`;
    particle.style.opacity = '0';
    
    // Remove and recreate
    setTimeout(() => {
      particle.remove();
      createParticle();
    }, duration * 1000);
  }
  
  // Create message element
  function createMessageElement(text, sender) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', `message-${sender}`);
    
    const avatarSrc = sender === 'user' 
      ? 'assets/images/user-avatar.jpg' 
      : 'assets/images/ai-avatar.jpg';
    
    messageElement.innerHTML = `
      <div class="message-avatar">
        <img src="${avatarSrc}" alt="${sender} avatar">
      </div>
      <div class="message-content">
        <div class="message-text">${text || ''}</div>
        <div class="message-time">${getCurrentTime()}</div>
      </div>
    `;
    
    // Update AI status
    if (sender === 'user') {
      updateAIStatus('Processing...');
    } else {
      updateAIStatus('Listening...');
    }
    
    return messageElement;
  }
  
  // Add message to chat
  function addMessage(text, sender) {
    const messageElement = createMessageElement(text, sender);
    chatMessages.appendChild(messageElement);
    
    // Scroll to bottom
    scrollToBottom();
  }
  
  // Show typing indicator
  function showTypingIndicator() {
    const typingElement = document.createElement('div');
    typingElement.classList.add('message', 'message-ai', 'message-typing');
    
    typingElement.innerHTML = `
      <div class="message-avatar">
        <img src="assets/images/ai-avatar.jpg" alt="AI avatar">
      </div>
      <div class="message-content">
        <div class="typing-indicator">
          <span class="typing-dot"></span>
          <span class="typing-dot"></span>
          <span class="typing-dot"></span>
        </div>
      </div>
    `;
    
    chatMessages.appendChild(typingElement);
    
    // Scroll to bottom
    scrollToBottom();
  }
  
  // Remove typing indicator
  function removeTypingIndicator() {
    const typingElement = document.querySelector('.message-typing');
    if (typingElement) {
      typingElement.remove();
    }
  }
  
  // Process AI response
  async function processAIResponse(userMessage) {
    // Show AI is processing
    updateAIStatus('Processing...');
    activateAIVisualization();
    
    try {
      // Call the AI service to get a response
      const response = await aiService.sendMessage(userMessage);
      
      // Add AI response to the chat
      addMessage(response, 'ai');
      
      // Update AI status
      updateAIStatus('Listening...');
      
      // Speak the response if voice output is enabled
      if (localStorage.getItem('epic_tech_ai_voice_output') === 'true') {
        try {
          // Update status to indicate speaking
          updateAIStatus('Speaking...');
          
          // Speak the response
          await speechService.speak(response);
          
          // Update status when done speaking
          updateAIStatus('Ready');
        } catch (speechError) {
          console.error('Error speaking response:', speechError);
          
          // Update status
          updateAIStatus('Ready');
        }
      }
    } catch (error) {
      console.error('Error getting AI response:', error);
      
      // Add error message
      addMessage("I'm sorry, I encountered an error processing your request. Please try again.", 'ai');
      
      // Update AI status
      updateAIStatus('Error');
      
      // Show error notification
      window.showNotification('Error communicating with AI service. Please try again.', 'error');
    }
  }
  
  // Activate AI visualization
  function activateAIVisualization() {
    if (aiAssistant) {
      aiAssistant.classList.add('active');
      
      setTimeout(() => {
        aiAssistant.classList.remove('active');
      }, 3000);
    }
  }
  
  // Update AI status
  function updateAIStatus(status) {
    if (aiStatusText) {
      aiStatusText.textContent = status;
    }
  }
  
  // Get current time
  function getCurrentTime() {
    const now = new Date();
    let hours = now.getHours();
    let minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    
    return `${hours}:${minutes} ${ampm}`;
  }
  
  // Scroll chat to bottom
  function scrollToBottom() {
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }
  
  // Create dynamic code elements
  function createCodeElements() {
    const codeData = [
      { x: 15, y: 20, content: "function processInput(data) {" },
      { x: 70, y: 35, content: "const response = analyze(data);" },
      { x: 25, y: 65, content: "return optimize(response);" },
      { x: 60, y: 80, content: "}" }
    ];
    
    if (aiParticles) {
      codeData.forEach(data => {
        const codeElement = document.createElement('div');
        codeElement.classList.add('holo-data');
        codeElement.textContent = data.content;
        codeElement.style.left = `${data.x}%`;
        codeElement.style.top = `${data.y}%`;
        
        // Random animation
        setRandomAnimation(codeElement);
        
        aiParticles.appendChild(codeElement);
      });
    }
  }
  
  // Initialize code elements
  createCodeElements();
  
  // Initialize chat with welcome message
  setTimeout(() => {
    addMessage("Hello! I'm your AI assistant. How can I help you today?", 'ai');
  }, 1000);
});

// Particle animation for background
function createBackgroundParticles() {
  const particlesContainer = document.createElement('div');
  particlesContainer.classList.add('background-particles');
  document.body.appendChild(particlesContainer);
  
  for (let i = 0; i < 100; i++) {
    const particle = document.createElement('div');
    particle.classList.add('bg-particle');
    
    // Random position
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    
    // Random size
    const size = Math.random() * 3 + 1;
    
    // Random opacity
    const opacity = Math.random() * 0.3 + 0.1;
    
    // Set styles
    particle.style.left = `${x}%`;
    particle.style.top = `${y}%`;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.opacity = opacity;
    
    // Random animation duration
    const duration = Math.random() * 20 + 10;
    particle.style.animationDuration = `${duration}s`;
    
    // Random animation delay
    const delay = Math.random() * 10;
    particle.style.animationDelay = `${delay}s`;
    
    particlesContainer.appendChild(particle);
  }
}

// Initialize background particles
document.addEventListener('DOMContentLoaded', createBackgroundParticles);

// Futuristic cursor effect
document.addEventListener('DOMContentLoaded', () => {
  const cursor = document.createElement('div');
  cursor.classList.add('custom-cursor');
  document.body.appendChild(cursor);
  
  const cursorDot = document.createElement('div');
  cursorDot.classList.add('cursor-dot');
  document.body.appendChild(cursorDot);
  
  document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
    
    cursorDot.style.left = e.clientX + 'px';
    cursorDot.style.top = e.clientY + 'px';
  });
  
  // Add hover effect for interactive elements
  const interactiveElements = document.querySelectorAll('a, button, input, .card, .chat-item');
  
  interactiveElements.forEach(element => {
    element.addEventListener('mouseenter', () => {
      cursor.classList.add('cursor-hover');
    });
    
    element.addEventListener('mouseleave', () => {
      cursor.classList.remove('cursor-hover');
    });
  });
});

// Initialize voice features
function initVoiceFeatures() {
  const voiceBtn = document.querySelector('.voice-btn');
  
  // Load saved voice settings
  loadVoiceSettings();
  
  // Set up speech recognition events
  setupSpeechRecognition();
  
  // Voice button click handler
  if (voiceBtn) {
    voiceBtn.addEventListener('click', () => {
      toggleVoiceInput();
    });
  }
}

// Load voice settings from localStorage
function loadVoiceSettings() {
  // Voice input setting
  const voiceInputEnabled = localStorage.getItem('epic_tech_ai_voice_input') === 'true';
  if (voiceInputToggle) {
    voiceInputToggle.checked = voiceInputEnabled;
  }
  
  // Voice output setting
  const voiceOutputEnabled = localStorage.getItem('epic_tech_ai_voice_output') === 'true';
  if (voiceOutputToggle) {
    voiceOutputToggle.checked = voiceOutputEnabled;
    speechService.setEnabled(voiceOutputEnabled);
  }
}

// Set up speech recognition events
function setupSpeechRecognition() {
  if (!speechRecognition.checkSupport()) {
    console.warn('Speech recognition not supported in this browser');
    
    // Disable voice input option if not supported
    if (voiceInputToggle) {
      voiceInputToggle.disabled = true;
      voiceInputToggle.checked = false;
      
      // Add note about browser support
      const voiceOptionLabel = voiceInputToggle.closest('.voice-option').querySelector('.voice-option-desc');
      if (voiceOptionLabel) {
        voiceOptionLabel.textContent = 'Not supported in this browser';
        voiceOptionLabel.style.color = 'var(--accent-pink)';
      }
    }
    
    return;
  }
  
  // Set up speech recognition events
  speechRecognition.onStart = () => {
    updateAIStatus('Listening...');
    
    // Add visual indicator
    const voiceBtn = document.querySelector('.voice-btn');
    if (voiceBtn) {
      voiceBtn.classList.add('active');
    }
    
    // Show listening notification
    window.showNotification('Listening...', 'info');
  };
  
  speechRecognition.onResult = (transcript, finalTranscript, interimTranscript) => {
    // Update input field with current transcript
    if (chatInput) {
      chatInput.value = transcript;
    }
  };
  
  speechRecognition.onEnd = (finalTranscript) => {
    updateAIStatus('Ready');
    
    // Remove visual indicator
    const voiceBtn = document.querySelector('.voice-btn');
    if (voiceBtn) {
      voiceBtn.classList.remove('active');
    }
    
    // If we have a final transcript and voice input is enabled, submit it
    if (finalTranscript && localStorage.getItem('epic_tech_ai_voice_input') === 'true') {
      if (chatInput) {
        chatInput.value = finalTranscript;
      }
      
      // Submit the form if we have text
      if (finalTranscript.trim() && chatForm) {
        const event = new Event('submit');
        chatForm.dispatchEvent(event);
      }
    }
  };
  
  speechRecognition.onError = (error) => {
    updateAIStatus('Ready');
    
    // Remove visual indicator
    const voiceBtn = document.querySelector('.voice-btn');
    if (voiceBtn) {
      voiceBtn.classList.remove('active');
    }
    
    // Show error notification
    window.showNotification(`Microphone error: ${error}`, 'error');
  };
}

// Toggle voice input
function toggleVoiceInput() {
  if (!speechRecognition.checkSupport()) {
    window.showNotification('Speech recognition is not supported in this browser', 'error');
    return;
  }
  
  if (speechRecognition.isActive()) {
    // Stop listening
    speechRecognition.stop();
  } else {
    // Start listening
    const success = speechRecognition.start();
    
    if (!success) {
      window.showNotification('Failed to start speech recognition', 'error');
    }
  }
}

// Theme switcher
function initThemeSwitcher() {
  const themeBtn = document.querySelector('.theme-btn');
  const root = document.documentElement;
  
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      // Toggle theme class on body
      document.body.classList.toggle('light-theme');
      
      if (document.body.classList.contains('light-theme')) {
        // Light theme colors
        root.style.setProperty('--primary-dark', '#f0f4f8');
        root.style.setProperty('--primary-medium', '#e1e8f0');
        root.style.setProperty('--primary-light', '#d1dbe8');
        root.style.setProperty('--text-primary', '#1a1f36');
        root.style.setProperty('--text-secondary', 'rgba(26, 31, 54, 0.7)');
        root.style.setProperty('--text-tertiary', 'rgba(26, 31, 54, 0.5)');
        root.style.setProperty('--card-bg', 'rgba(225, 232, 240, 0.7)');
        root.style.setProperty('--input-bg', 'rgba(240, 244, 248, 0.6)');
      } else {
        // Dark theme colors (default)
        root.style.setProperty('--primary-dark', '#0a0e17');
        root.style.setProperty('--primary-medium', '#141b2d');
        root.style.setProperty('--primary-light', '#1f2940');
        root.style.setProperty('--text-primary', '#ffffff');
        root.style.setProperty('--text-secondary', 'rgba(255, 255, 255, 0.7)');
        root.style.setProperty('--text-tertiary', 'rgba(255, 255, 255, 0.5)');
        root.style.setProperty('--card-bg', 'rgba(31, 41, 64, 0.7)');
        root.style.setProperty('--input-bg', 'rgba(10, 14, 23, 0.6)');
      }
    });
  }
}

// Initialize theme switcher
document.addEventListener('DOMContentLoaded', initThemeSwitcher);

// Notification system
function initNotifications() {
  // Create notification container if it doesn't exist
  let notificationContainer = document.querySelector('.notification-container');
  
  if (!notificationContainer) {
    notificationContainer = document.createElement('div');
    notificationContainer.classList.add('notification-container');
    document.body.appendChild(notificationContainer);
  }
  
  // Function to show notification
  window.showNotification = function(message, type = 'info') {
    const notification = document.createElement('div');
    notification.classList.add('notification', `notification-${type}`);
    
    notification.innerHTML = `
      <div class="notification-icon">
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
      </div>
      <div class="notification-content">
        <div class="notification-message">${message}</div>
      </div>
      <button class="notification-close">
        <i class="fas fa-times"></i>
      </button>
    `;
    
    // Add to container
    notificationContainer.appendChild(notification);
    
    // Show with animation
    setTimeout(() => {
      notification.classList.add('show');
    }, 10);
    
    // Auto close after 5 seconds
    const timeout = setTimeout(() => {
      closeNotification(notification);
    }, 5000);
    
    // Close button
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
      clearTimeout(timeout);
      closeNotification(notification);
    });
  };
  
  // Function to close notification
  function closeNotification(notification) {
    notification.classList.remove('show');
    
    // Remove after animation
    setTimeout(() => {
      notification.remove();
    }, 300);
  }
}

// Initialize notifications
document.addEventListener('DOMContentLoaded', initNotifications);

// Demo function to show notifications
function showDemoNotifications() {
  setTimeout(() => {
    window.showNotification('Welcome to Epic Tech AI Dev 2.0!', 'info');
  }, 2000);
  
  setTimeout(() => {
    window.showNotification('AI assistant is ready to help you', 'success');
  }, 4000);
}

// Show demo notifications
document.addEventListener('DOMContentLoaded', showDemoNotifications);