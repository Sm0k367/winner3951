// Simple chat functionality fix
document.addEventListener('DOMContentLoaded', function() {
  console.log('Chat fix script loaded');
  
  // Get chat elements
  const chatForm = document.querySelector('.chat-form');
  const chatInput = document.querySelector('.chat-input');
  const chatSendBtn = document.querySelector('.chat-send-btn');
  const chatMessages = document.querySelector('.chat-messages');
  
  console.log('Chat elements:', {
    chatForm: !!chatForm,
    chatInput: !!chatInput,
    chatSendBtn: !!chatSendBtn,
    chatMessages: !!chatMessages
  });
  
  // Add event listener to chat form
  if (chatForm) {
    chatForm.addEventListener('submit', function(e) {
      e.preventDefault();
      console.log('Form submitted');
      
      const message = chatInput.value.trim();
      if (message) {
        console.log('Sending message:', message);
        
        // Add user message
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', 'message-user');
        
        messageElement.innerHTML = `
          <div class="message-avatar">
            <img src="assets/images/user-avatar.jpg" alt="User Avatar">
          </div>
          <div class="message-content">
            <div class="message-text">${message}</div>
            <div class="message-time">${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
          </div>
        `;
        
        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        // Clear input
        chatInput.value = '';
        
        // Add AI response
        setTimeout(function() {
          const aiMessageElement = document.createElement('div');
          aiMessageElement.classList.add('message', 'message-ai');
          
          aiMessageElement.innerHTML = `
            <div class="message-avatar">
              <img src="assets/images/ai-avatar.jpg" alt="AI Avatar">
            </div>
            <div class="message-content">
              <div class="message-text">Thank you for your message! This is a simplified response as we're currently fixing some issues with the advanced AI functionality. Your message was: "${message}"</div>
              <div class="message-time">${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
            </div>
          `;
          
          chatMessages.appendChild(aiMessageElement);
          chatMessages.scrollTop = chatMessages.scrollHeight;
        }, 1000);
      }
    });
  }
  
  // Add click event to send button as a backup
  if (chatSendBtn) {
    chatSendBtn.addEventListener('click', function(e) {
      e.preventDefault();
      console.log('Send button clicked');
      
      // Trigger form submit
      if (chatForm) {
        const event = new Event('submit', { cancelable: true });
        chatForm.dispatchEvent(event);
      } else {
        console.error('Chat form not found');
      }
    });
  }
  
  // Add direct input event for Enter key as another backup
  if (chatInput) {
    chatInput.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        console.log('Enter key pressed');
        
        // Trigger form submit
        if (chatForm) {
          const event = new Event('submit', { cancelable: true });
          chatForm.dispatchEvent(event);
        } else {
          console.error('Chat form not found');
        }
      }
    });
  }
  
  // Add a welcome message
  if (chatMessages) {
    // Check if there are already messages
    if (chatMessages.children.length === 0) {
      const aiMessageElement = document.createElement('div');
      aiMessageElement.classList.add('message', 'message-ai');
      
      aiMessageElement.innerHTML = `
        <div class="message-avatar">
          <img src="assets/images/ai-avatar.jpg" alt="AI Avatar">
        </div>
        <div class="message-content">
          <div class="message-text">Hello! I'm your AI assistant. How can I help you today? (Note: We're currently using a simplified chat system while we fix some technical issues.)</div>
          <div class="message-time">${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
        </div>
      `;
      
      chatMessages.appendChild(aiMessageElement);
    }
  }
});