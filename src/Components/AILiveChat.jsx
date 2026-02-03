import React, { useState, useRef, useEffect } from 'react';
import { toast } from 'react-toastify';

const AILiveChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! I'm your AI Flight Assistant. How can I help you today?", sender: 'ai', time: new Date().toLocaleTimeString() }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false); const [chatMode, setChatMode] = useState("ai"); const [humanAgent, setHumanAgent] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const aiResponses = { greeting: ["Hello! I am your AI Flight Assistant. How can I help you today? ", "Hi there! Ready to help with flights, bookings, and travel questions! "], booking: ["I can help you book flights! Search for destinations and compare prices. Need human help? Type HUMAN", "Our booking system offers seat selection, multiple airlines, and secure payments. Want to speak with an agent? Type HUMAN"], cancellation: ["Cancellations available up to 2 hours before departure. Refunds vary by timing. Need assistance? Type HUMAN", "Cancel from My Bookings section. Advanced bookings get better refunds. Want human help? Type HUMAN"], seats: ["New seat selection with interactive maps! Choose window, aisle, or middle seats during booking. Questions? Type HUMAN", "Seat selection in step 2 of booking. Different aircraft have different layouts. Need help? Type HUMAN"], payment: ["Secure payments via cards, UPI, net banking. All transactions encrypted. Issues? Type HUMAN", "Payment in final booking step. Multiple options available. Problems? Type HUMAN"], support: ["24/7 Support: +91-6301616095, +91-7013367409, +91-9390915531. Email: premium@myflight.com. Type HUMAN for agent", "Emergency: +91-6301616095. Premium services available 24/7. Want human agent? Type HUMAN"], human: ["Connecting you to human agent... Please wait while I transfer your chat. ", "Human agent will join shortly. Your question will be answered by our expert team. "], default: ["I can help with flights, bookings, cancellations, seats, payments. Ask anything! Need human? Type HUMAN ", "Available 24/7 for all flight questions. Type HUMAN to speak with our support team. "] };

  const getAIResponse = (message) => { const responses = { "price": "Flight prices vary by destination. Delhi-Mumbai starts from ?3,500. Use our search to find best deals!", "booking": "To book: 1) Search flights 2) Select seat 3) Enter passenger details 4) Make payment. Need help? Call +91-6301616095", "cancel": "Cancellation available up to 2 hours before departure. Refund: 85% (24h+), 70% (12h+), 50% (2h+). Process in My Bookings section.", "seat": "New seat selection feature! Choose window, aisle, or middle seats. Interactive maps available for all aircraft!", "payment": "We accept: Credit/Debit cards, UPI (GPay, PhonePe, Paytm), Net Banking. All payments 100% secure with SSL encryption.", "support": "24/7 Support: +91-6301616095, +91-7013367409, +91-9390915531. Email: premium@myflight.com. Emergency: +91-6301616095", "baggage": "Baggage allowance: Domestic 15kg, International 23kg. Extra baggage ?500/kg. Premium customers get +5kg free!", "checkin": "Online check-in opens 48hrs before departure. Mobile boarding pass available. Premium customers get priority check-in!", "refund": "Refunds processed in 5-7 business days to original payment method. Premium customers get instant refunds!", "food": "In-flight meals available for ?200-500. Pre-order during booking for 20% discount. Special dietary options available." };
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
      return aiResponses.greeting[Math.floor(Math.random() * aiResponses.greeting.length)];
    }
    if (lowerMessage.includes('book') || lowerMessage.includes('flight') || lowerMessage.includes('ticket')) {
      return aiResponses.booking[Math.floor(Math.random() * aiResponses.booking.length)];
    }
    if (lowerMessage.includes('cancel') || lowerMessage.includes('refund')) {
      return aiResponses.cancellation[Math.floor(Math.random() * aiResponses.cancellation.length)];
    }
    if (lowerMessage.includes('seat') || lowerMessage.includes('window') || lowerMessage.includes('aisle')) {
      return aiResponses.seats[Math.floor(Math.random() * aiResponses.seats.length)];
    }
    if (lowerMessage.includes('payment') || lowerMessage.includes('pay') || lowerMessage.includes('card')) {
      return aiResponses.payment[Math.floor(Math.random() * aiResponses.payment.length)];
    }
    if (lowerMessage.includes('help') || lowerMessage.includes('support') || lowerMessage.includes('contact')) {
      return aiResponses.support[Math.floor(Math.random() * aiResponses.support.length)];
    }
    
    return aiResponses.default[Math.floor(Math.random() * aiResponses.default.length)];
  };

  const sendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: 'user',
      time: new Date().toLocaleTimeString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(() => {
      const aiResponse = {
        id: Date.now() + 1,
        text: getAIResponse(inputMessage) + "\\n\\n?? Need human help? Call: +91-6301616095",
        sender: 'ai',
        time: new Date().toLocaleTimeString()
      };
      
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 2000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <div 
        className="position-fixed"
        style={{ 
          bottom: '20px', 
          right: '20px', 
          zIndex: 1000,
          cursor: 'pointer'
        }}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div 
          className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center shadow-lg"
          style={{ width: '60px', height: '60px', fontSize: '24px' }}
        >
          {isOpen ? '✕' : '🤖'}
        </div>
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div 
          className="position-fixed bg-white rounded-4 shadow-lg"
          style={{ 
            bottom: '90px', 
            right: '20px', 
            width: '350px', 
            height: '500px',
            zIndex: 999,
            border: '1px solid #ddd'
          }}
        >
          {/* Chat Header */}
          <div className="bg-primary text-white p-3 rounded-top-4">
            <div className="d-flex align-items-center">
              <div className="me-2">🤖</div>
              <div>
                <div className="fw-bold">AI Flight Assistant</div>
                <div className="small">Online • Powered by AI</div>
              </div>
            </div>
          </div>

          {/* Messages Area */}
          <div 
            className="p-3"
            style={{ 
              height: '350px', 
              overflowY: 'auto',
              backgroundColor: '#f8f9fa'
            }}
          >
            {messages.map((message) => (
              <div 
                key={message.id}
                className={`mb-3 d-flex ${message.sender === 'user' ? 'justify-content-end' : 'justify-content-start'}`}
              >
                <div 
                  className={`p-2 rounded-3 max-width-75 ${
                    message.sender === 'user' 
                      ? 'bg-primary text-white' 
                      : 'bg-white border'
                  }`}
                  style={{ maxWidth: '75%' }}
                >
                  <div className="small">{message.text}</div>
                  <div className={`text-end mt-1 ${message.sender === 'user' ? 'text-light' : 'text-muted'}`} style={{ fontSize: '10px' }}>
                    {message.time}
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="mb-3 d-flex justify-content-start">
                <div className="bg-white border p-2 rounded-3">
                  <div className="small text-muted">
                    <span className="typing-indicator">AI is typing</span>
                    <span className="dots">...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 border-top">
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                placeholder="Type your message..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <button 
                className="btn btn-primary"
                onClick={sendMessage}
                disabled={!inputMessage.trim()}
              >
                📤
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CSS for typing animation */}
      <style>{`
        .typing-indicator {
          animation: pulse 1.5s infinite;
        }
        
        .dots {
          animation: blink 1.4s infinite both;
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
      `}</style>
    </>
  );
};

export default AILiveChat;




