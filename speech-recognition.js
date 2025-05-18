/**
 * Epic Tech AI Dev 2.0
 * Speech Recognition Service
 * 
 * This file handles voice input functionality using the Web Speech API
 */

class SpeechRecognitionService {
  constructor() {
    // Check for browser support
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.isSupported = true;
      
      // Configure recognition
      this.recognition.continuous = false;
      this.recognition.interimResults = true;
      this.recognition.lang = 'en-US';
      
      // Initialize state
      this.isListening = false;
      this.transcript = '';
      this.finalTranscript = '';
      this.interimTranscript = '';
      
      // Event callbacks
      this.onStart = null;
      this.onResult = null;
      this.onEnd = null;
      this.onError = null;
      
      // Set up event handlers
      this.setupEventHandlers();
    } else {
      this.isSupported = false;
      console.warn('Speech recognition is not supported in this browser.');
    }
  }
  
  /**
   * Set up event handlers for speech recognition
   */
  setupEventHandlers() {
    if (!this.isSupported) return;
    
    // Start event
    this.recognition.onstart = () => {
      this.isListening = true;
      this.transcript = '';
      this.finalTranscript = '';
      this.interimTranscript = '';
      
      if (this.onStart) {
        this.onStart();
      }
    };
    
    // Result event
    this.recognition.onresult = (event) => {
      this.interimTranscript = '';
      
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        
        if (event.results[i].isFinal) {
          this.finalTranscript += transcript;
        } else {
          this.interimTranscript += transcript;
        }
      }
      
      this.transcript = this.finalTranscript + this.interimTranscript;
      
      if (this.onResult) {
        this.onResult(this.transcript, this.finalTranscript, this.interimTranscript);
      }
    };
    
    // End event
    this.recognition.onend = () => {
      this.isListening = false;
      
      if (this.onEnd) {
        this.onEnd(this.finalTranscript);
      }
    };
    
    // Error event
    this.recognition.onerror = (event) => {
      this.isListening = false;
      console.error('Speech recognition error:', event.error);
      
      if (this.onError) {
        this.onError(event.error);
      }
    };
  }
  
  /**
   * Start listening for speech
   */
  start() {
    if (!this.isSupported) {
      console.warn('Speech recognition is not supported in this browser.');
      return false;
    }
    
    if (this.isListening) {
      this.stop();
    }
    
    try {
      this.recognition.start();
      return true;
    } catch (error) {
      console.error('Error starting speech recognition:', error);
      return false;
    }
  }
  
  /**
   * Stop listening for speech
   */
  stop() {
    if (!this.isSupported || !this.isListening) return;
    
    try {
      this.recognition.stop();
    } catch (error) {
      console.error('Error stopping speech recognition:', error);
    }
  }
  
  /**
   * Check if speech recognition is currently active
   * @returns {boolean} - Whether currently listening
   */
  isActive() {
    return this.isListening;
  }
  
  /**
   * Check if speech recognition is supported
   * @returns {boolean} - Whether speech recognition is supported
   */
  checkSupport() {
    return this.isSupported;
  }
}

// Create and export singleton instance
const speechRecognition = new SpeechRecognitionService();