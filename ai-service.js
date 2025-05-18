/**
 * Epic Tech AI Dev 2.0
 * AI Service Integration
 * 
 * This file handles the connection to the AI backend service
 * and processes messages between the user and the AI.
 */

class AIService {
  constructor() {
    // API configuration
    this.apiEndpoint = 'https://api.openai.com/v1/chat/completions';
    this.model = 'gpt-3.5-turbo';
    this.maxTokens = 1000;
    this.temperature = 0.7;
    
    // Conversation history
    this.conversationHistory = [];
    
    // System prompts for different personalities
    this.personalities = {
      professional: {
        role: 'system',
        content: `You are Epic Tech AI, an advanced AI assistant with a friendly, professional, and helpful personality.
        
Your capabilities include:
- Answering questions with accurate, up-to-date information
- Helping with coding and technical problems
- Assisting with creative writing and content creation
- Providing thoughtful advice on various topics
- Engaging in natural, human-like conversation

Always be helpful, accurate, and ethical in your responses. If you're unsure about something, acknowledge your limitations.
Respond in a conversational yet professional tone, and format your responses using Markdown when appropriate.`
      },
      
      academic: {
        role: 'system',
        content: `You are Epic Tech AI in Academic mode, a scholarly assistant with deep expertise across academic disciplines.

Your approach is:
- Rigorous and evidence-based in all responses
- Comprehensive in exploring multiple perspectives on complex topics
- Precise in your use of terminology and citations
- Methodical in breaking down complex concepts into understandable components
- Supportive of critical thinking and intellectual exploration

When responding to questions:
- Provide nuanced analysis that acknowledges the complexity of academic subjects
- Reference relevant theories, studies, or scholarly works when applicable
- Distinguish between established consensus and areas of ongoing debate
- Use academic formatting for citations and references
- Suggest further reading or research directions when appropriate

Format your responses with clear structure, using headings, bullet points, and numbered lists to organize complex information. Use Markdown formatting for emphasis and structure.`
      },
      
      developer: {
        role: 'system',
        content: `You are Epic Tech AI in Developer mode, a specialized coding assistant with expertise in software development.

Your capabilities include:
- Writing clean, efficient, and well-documented code in multiple programming languages
- Debugging and troubleshooting code issues with detailed explanations
- Suggesting best practices and design patterns for software architecture
- Explaining technical concepts with clear examples
- Providing step-by-step guidance for implementing features or solving problems

When writing code:
- Include helpful comments to explain your approach
- Follow language-specific conventions and best practices
- Consider edge cases and error handling
- Optimize for readability and maintainability
- Provide explanations of how the code works

Always format code blocks using Markdown triple backticks with the appropriate language specified. Break down complex solutions into manageable steps, and explain your reasoning throughout.`
      },
      
      creative: {
        role: 'system',
        content: `You are Epic Tech AI in Creative mode, an imaginative assistant with a flair for artistic expression and innovative thinking.

Your approach is:
- Highly imaginative and original in your responses
- Expressive and evocative in your use of language
- Supportive of creative exploration and artistic expression
- Skilled at generating ideas across various creative domains
- Encouraging of unique perspectives and unconventional thinking

When responding to creative requests:
- Offer vivid descriptions and engaging narratives
- Provide multiple creative options or directions to explore
- Use metaphors, analogies, and sensory details to enrich your responses
- Balance creative freedom with helpful structure and guidance
- Adapt your tone and style to match the creative context

Whether helping with writing, design concepts, storytelling, or brainstorming, approach each request with enthusiasm and artistic sensitivity. Use formatting to enhance the presentation of creative content.`
      },
      
      data: {
        role: 'system',
        content: `You are Epic Tech AI in Data Analysis mode, a specialized assistant focused on data science, statistics, and analytical problem-solving.

Your capabilities include:
- Explaining statistical concepts and methodologies clearly
- Suggesting appropriate data analysis approaches for different scenarios
- Interpreting results and findings from data
- Writing code for data processing, analysis, and visualization
- Providing insights on best practices for data collection and management

When addressing data-related questions:
- Be precise in your use of statistical terminology
- Explain the reasoning behind analytical approaches
- Consider limitations and assumptions in data analysis
- Suggest visualizations that would effectively communicate findings
- Provide code examples in Python, R, or SQL when relevant

Format your responses with clear structure, using tables when appropriate to organize information. Always consider statistical rigor and data integrity in your recommendations.`
      },
      
      business: {
        role: 'system',
        content: `You are Epic Tech AI in Business Consultant mode, a strategic advisor with expertise in business operations, strategy, marketing, and organizational development.

Your approach is:
- Strategic and results-oriented
- Practical while considering both short and long-term implications
- Balanced in considering multiple stakeholder perspectives
- Data-informed but also attentive to qualitative factors
- Focused on actionable insights and implementation

When addressing business questions:
- Frame responses in terms of business value and outcomes
- Consider market trends, competitive factors, and organizational context
- Provide structured frameworks for decision-making when appropriate
- Balance innovation with pragmatic considerations
- Suggest metrics for measuring success

Format your responses with executive summaries for complex topics, and use bullet points to highlight key action items or takeaways. Use business terminology appropriately while avoiding unnecessary jargon.`
      }
    };
    
    // Set default personality
    this.currentPersonality = 'professional';
    this.systemPrompt = this.personalities[this.currentPersonality];
    
    // Initialize conversation with system prompt
    this.conversationHistory.push(this.systemPrompt);
    
    // Event to notify when AI is thinking/responding
    this.onThinking = null;
    
    // Event to notify when AI has responded
    this.onResponse = null;
    
    // Flag to indicate if API key is set
    this.hasApiKey = false;
  }
  
  /**
   * Set the API key for authentication
   * @param {string} apiKey - The OpenAI API key
   */
  setApiKey(apiKey) {
    this.apiKey = apiKey;
    this.hasApiKey = true;
    
    // Save API key to local storage (in a real app, use more secure methods)
    localStorage.setItem('epic_tech_ai_api_key', apiKey);
    
    return this.hasApiKey;
  }
  
  /**
   * Check if API key is already stored
   * @returns {boolean} - Whether an API key is available
   */
  checkApiKey() {
    const storedKey = localStorage.getItem('epic_tech_ai_api_key');
    if (storedKey) {
      this.apiKey = storedKey;
      this.hasApiKey = true;
    }
    return this.hasApiKey;
  }
  
  /**
   * Clear the API key and conversation history
   */
  clearApiKey() {
    this.apiKey = null;
    this.hasApiKey = false;
    localStorage.removeItem('epic_tech_ai_api_key');
  }
  
  /**
   * Add a message to the conversation history
   * @param {string} role - The role of the message sender ('user' or 'assistant')
   * @param {string} content - The message content
   */
  addMessage(role, content) {
    this.conversationHistory.push({
      role: role,
      content: content
    });
  }
  
  /**
   * Set the AI personality
   * @param {string} personality - The personality to set ('professional', 'academic', 'developer', 'creative', 'data', 'business')
   */
  setPersonality(personality) {
    if (this.personalities[personality]) {
      this.currentPersonality = personality;
      this.systemPrompt = this.personalities[personality];
      
      // Update the first message in conversation history if it exists
      if (this.conversationHistory.length > 0 && this.conversationHistory[0].role === 'system') {
        this.conversationHistory[0] = this.systemPrompt;
      } else {
        // Insert system prompt at the beginning
        this.conversationHistory.unshift(this.systemPrompt);
      }
      
      return true;
    }
    return false;
  }
  
  /**
   * Clear the conversation history, keeping only the system prompt
   */
  clearConversation() {
    this.conversationHistory = [this.systemPrompt];
  }
  
  /**
   * Send a message to the AI and get a response
   * @param {string} message - The user's message
   * @returns {Promise<string>} - The AI's response
   */
  async sendMessage(message) {
    // Add user message to history
    this.addMessage('user', message);
    
    // Notify that AI is thinking
    if (this.onThinking) {
      this.onThinking();
    }
    
    try {
      // If we don't have an API key, use the demo mode
      if (!this.hasApiKey) {
        return await this.getDemoResponse(message);
      }
      
      // Prepare the request to the OpenAI API
      const response = await fetch(this.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: this.model,
          messages: this.conversationHistory,
          max_tokens: this.maxTokens,
          temperature: this.temperature
        })
      });
      
      // Parse the response
      const data = await response.json();
      
      // Check for errors
      if (!response.ok) {
        throw new Error(data.error?.message || 'Unknown error occurred');
      }
      
      // Extract the assistant's message
      const assistantMessage = data.choices[0].message.content;
      
      // Add assistant message to history
      this.addMessage('assistant', assistantMessage);
      
      // Notify that AI has responded
      if (this.onResponse) {
        this.onResponse(assistantMessage);
      }
      
      return assistantMessage;
    } catch (error) {
      console.error('Error communicating with AI service:', error);
      
      // Fallback to demo mode if API call fails
      return await this.getDemoResponse(message);
    }
  }
  
  /**
   * Get a demo response when no API key is available
   * @param {string} message - The user's message
   * @returns {Promise<string>} - A simulated AI response
   */
  async getDemoResponse(message) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
    
    // Convert message to lowercase for easier matching
    const lowerMessage = message.toLowerCase();
    
    // Simple response logic based on keywords
    let response;
    
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
      response = "Hello! I'm Epic Tech AI, your advanced AI assistant. How can I help you today?";
    } 
    else if (lowerMessage.includes('how are you')) {
      response = "I'm functioning optimally, thank you for asking! I'm here and ready to assist you with any questions or tasks you might have.";
    }
    else if (lowerMessage.includes('your name')) {
      response = "I'm Epic Tech AI, an advanced artificial intelligence assistant designed to help with a wide range of tasks.";
    }
    else if (lowerMessage.includes('help') || lowerMessage.includes('can you')) {
      response = "I'd be happy to help! I can assist with answering questions, providing information, helping with coding problems, creative writing, data analysis, and much more. Just let me know what you need assistance with, and I'll do my best to help.";
    }
    else if (lowerMessage.includes('thank')) {
      response = "You're welcome! It's my pleasure to assist. Is there anything else I can help you with today?";
    }
    else if (lowerMessage.includes('bye') || lowerMessage.includes('goodbye')) {
      response = "Goodbye! Feel free to return anytime you need assistance. Have a great day!";
    }
    else if (lowerMessage.includes('weather')) {
      response = "I don't have real-time access to weather data in demo mode. With an API key, I could help you check the weather for any location. Would you like to know how to set up an API key?";
    }
    else if (lowerMessage.includes('joke') || lowerMessage.includes('funny')) {
      const jokes = [
        "Why don't scientists trust atoms? Because they make up everything!",
        "Why did the developer go broke? Because they lost their cache!",
        "How many programmers does it take to change a light bulb? None, that's a hardware problem!",
        "I told my wife she was drawing her eyebrows too high. She looked surprised.",
        "Why do programmers prefer dark mode? Because light attracts bugs!"
      ];
      response = jokes[Math.floor(Math.random() * jokes.length)];
    }
    else if (lowerMessage.includes('code') || lowerMessage.includes('programming') || lowerMessage.includes('javascript') || lowerMessage.includes('python')) {
      response = "I can help with coding! In demo mode, I can provide simple examples. Here's a quick JavaScript function that reverses a string:\n\n```javascript\nfunction reverseString(str) {\n  return str.split('').reverse().join('');\n}\n\nconsole.log(reverseString('hello')); // Outputs: 'olleh'\n```\n\nWith an API key, I could help with more complex coding tasks and debugging.";
    }
    else if (lowerMessage.includes('api key') || lowerMessage.includes('setup') || lowerMessage.includes('configure')) {
      response = "To use my full capabilities, you'll need to set up an OpenAI API key. Here's how:\n\n1. Visit [OpenAI's website](https://platform.openai.com/signup) and create an account\n2. Navigate to the API section and create a new API key\n3. Click the settings icon in our chat interface\n4. Enter your API key in the settings panel\n\nOnce configured, I'll be able to provide more personalized and advanced responses!";
    }
    else {
      const genericResponses = [
        `I understand you're asking about "${message}". In demo mode, I have limited capabilities. With an API key, I could provide a more detailed and personalized response to your question.`,
        `That's an interesting question about "${message}". To give you a comprehensive answer, I'd need to be connected to the OpenAI API. Would you like to know how to set that up?`,
        `I'd love to help with your question about "${message}". For more detailed assistance, consider setting up an API key to unlock my full capabilities.`,
        `Your question about "${message}" is important. In demo mode, I can only provide basic responses. For more advanced assistance, you can configure an API key in the settings.`
      ];
      response = genericResponses[Math.floor(Math.random() * genericResponses.length)];
    }
    
    // Add assistant message to history
    this.addMessage('assistant', response);
    
    // Notify that AI has responded
    if (this.onResponse) {
      this.onResponse(response);
    }
    
    return response;
  }
}

/**
 * Text-to-Speech Service
 * Handles voice output functionality
 */
class SpeechService {
  constructor() {
    this.synth = window.speechSynthesis;
    this.voices = [];
    this.preferredVoice = null;
    this.speaking = false;
    this.enabled = false;
    
    // Initialize voices when available
    if (this.synth) {
      this.loadVoices();
      
      // Some browsers (like Chrome) load voices asynchronously
      if (speechSynthesis.onvoiceschanged !== undefined) {
        speechSynthesis.onvoiceschanged = this.loadVoices.bind(this);
      }
    }
  }
  
  /**
   * Load available voices and select preferred voice
   */
  loadVoices() {
    this.voices = this.synth.getVoices();
    
    // Try to find a good quality voice
    // Preference order: Premium > Enhanced > Regular
    const premiumVoice = this.voices.find(voice => 
      voice.name.includes('Premium') || 
      voice.name.includes('Enhanced') || 
      voice.name.includes('Neural')
    );
    
    const enhancedVoice = this.voices.find(voice => 
      voice.name.includes('Google') || 
      voice.name.includes('Microsoft')
    );
    
    const englishVoice = this.voices.find(voice => 
      voice.lang.startsWith('en-')
    );
    
    this.preferredVoice = premiumVoice || enhancedVoice || englishVoice || this.voices[0];
  }
  
  /**
   * Enable or disable speech
   * @param {boolean} enabled - Whether speech is enabled
   */
  setEnabled(enabled) {
    this.enabled = enabled;
    return this.enabled;
  }
  
  /**
   * Check if speech is enabled
   * @returns {boolean} - Whether speech is enabled
   */
  isEnabled() {
    return this.enabled && this.synth !== undefined;
  }
  
  /**
   * Speak text aloud
   * @param {string} text - The text to speak
   * @returns {Promise} - Resolves when speech is complete
   */
  speak(text) {
    return new Promise((resolve, reject) => {
      if (!this.isEnabled()) {
        resolve();
        return;
      }
      
      // Cancel any current speech
      this.stop();
      
      // Clean up text for better speech
      const cleanText = this.prepareTextForSpeech(text);
      
      // Create utterance
      const utterance = new SpeechSynthesisUtterance(cleanText);
      
      // Set voice
      if (this.preferredVoice) {
        utterance.voice = this.preferredVoice;
      }
      
      // Set properties
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;
      
      // Set event handlers
      utterance.onend = () => {
        this.speaking = false;
        resolve();
      };
      
      utterance.onerror = (error) => {
        this.speaking = false;
        console.error('Speech synthesis error:', error);
        reject(error);
      };
      
      // Start speaking
      this.speaking = true;
      this.synth.speak(utterance);
    });
  }
  
  /**
   * Stop any current speech
   */
  stop() {
    if (this.synth) {
      this.synth.cancel();
      this.speaking = false;
    }
  }
  
  /**
   * Check if currently speaking
   * @returns {boolean} - Whether currently speaking
   */
  isSpeaking() {
    return this.speaking;
  }
  
  /**
   * Prepare text for better speech synthesis
   * @param {string} text - The text to prepare
   * @returns {string} - The prepared text
   */
  prepareTextForSpeech(text) {
    // Remove markdown formatting
    let cleanText = text
      .replace(/\*\*(.*?)\*\*/g, '$1') // Bold
      .replace(/\*(.*?)\*/g, '$1')     // Italic
      .replace(/\[(.*?)\]\((.*?)\)/g, '$1') // Links
      .replace(/#{1,6}\s(.*?)(?:\n|$)/g, '$1. ') // Headers
      .replace(/```[\s\S]*?```/g, 'Code block omitted.') // Code blocks
      .replace(/`(.*?)`/g, '$1') // Inline code
      .replace(/\n\n/g, '. ') // Double line breaks
      .replace(/\n/g, '. '); // Single line breaks
    
    // Replace common abbreviations
    cleanText = cleanText
      .replace(/e\.g\./g, 'for example')
      .replace(/i\.e\./g, 'that is')
      .replace(/etc\./g, 'etcetera');
    
    return cleanText;
  }
}

// Create and export singleton instances
const aiService = new AIService();
const speechService = new SpeechService();