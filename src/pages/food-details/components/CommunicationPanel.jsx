import React, { useState, useRef, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const CommunicationPanel = ({ donorInfo, onSendMessage }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Mock conversation data
  const mockMessages = [
    {
      id: 1,
      sender: 'donor',
      senderName: donorInfo?.name,
      message: "Hello! Thank you for your interest in our surplus food donation. The biryani was prepared fresh this morning and is still warm.",
      timestamp: new Date(Date.now() - 1800000), // 30 minutes ago
      type: 'text'
    },
    {
      id: 2,
      sender: 'recipient',
      senderName: 'You',
      message: "Hi! This looks perfect for our evening meal service. Can you confirm the spice level? We serve many elderly beneficiaries.",
      timestamp: new Date(Date.now() - 1200000), // 20 minutes ago
      type: 'text'
    },
    {
      id: 3,
      sender: 'donor',
      senderName: donorInfo?.name,
      message: "It\'s medium spice level - not too hot. We\'ve also included some plain yogurt raita to balance it out. The pickup location is our main kitchen entrance.",
      timestamp: new Date(Date.now() - 600000), // 10 minutes ago
      type: 'text'
    }
  ];

  useEffect(() => {
    setMessages(mockMessages);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef?.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = () => {
    if (newMessage?.trim()) {
      const message = {
        id: messages?.length + 1,
        sender: 'recipient',
        senderName: 'You',
        message: newMessage?.trim(),
        timestamp: new Date(),
        type: 'text'
      };

      setMessages(prev => [...prev, message]);
      setNewMessage('');
      
      if (onSendMessage) {
        onSendMessage(message);
      }

      // Simulate donor typing and response
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        const donorResponse = {
          id: messages?.length + 2,
          sender: 'donor',
          senderName: donorInfo?.name,
          message: "Thanks for the message! I\'ll get back to you shortly.",
          timestamp: new Date(),
          type: 'text'
        };
        setMessages(prev => [...prev, donorResponse]);
      }, 2000);
    }
  };

  const handleKeyPress = (e) => {
    if (e?.key === 'Enter' && !e?.shiftKey) {
      e?.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp)?.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const quickMessages = [
    "What\'s the exact pickup time?",
    "Can you hold this for 30 minutes?",
    "Is packaging included?",
    "Any special handling instructions?"
  ];

  return (
    <div className="bg-card rounded-lg shadow-soft overflow-hidden h-96 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border bg-muted/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <Icon name="MessageCircle" size={16} color="white" />
            </div>
            <div>
              <h3 className="font-heading font-semibold text-foreground">
                Chat with {donorInfo?.name}
              </h3>
              <div className="flex items-center text-xs text-muted-foreground">
                <div className="w-2 h-2 bg-success rounded-full mr-2"></div>
                Online now
              </div>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <button className="p-2 hover:bg-muted rounded-lg transition-colors">
              <Icon name="Phone" size={16} className="text-muted-foreground" />
            </button>
            <button className="p-2 hover:bg-muted rounded-lg transition-colors">
              <Icon name="MoreVertical" size={16} className="text-muted-foreground" />
            </button>
          </div>
        </div>
      </div>
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages?.map((message) => (
          <div
            key={message?.id}
            className={`flex ${message?.sender === 'recipient' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                message?.sender === 'recipient' ?'bg-primary text-primary-foreground' :'bg-muted text-foreground'
              }`}
            >
              <div className="text-sm leading-relaxed">{message?.message}</div>
              <div
                className={`text-xs mt-1 ${
                  message?.sender === 'recipient' ?'text-primary-foreground/70' :'text-muted-foreground'
                }`}
              >
                {formatTime(message?.timestamp)}
              </div>
            </div>
          </div>
        ))}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-muted text-foreground px-4 py-2 rounded-lg">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      {/* Quick Messages */}
      <div className="px-4 py-2 border-t border-border bg-muted/20">
        <div className="flex space-x-2 overflow-x-auto scrollbar-hide">
          {quickMessages?.map((msg, index) => (
            <button
              key={index}
              onClick={() => setNewMessage(msg)}
              className="flex-shrink-0 px-3 py-1 bg-muted hover:bg-muted/80 text-xs text-foreground rounded-full transition-colors"
            >
              {msg}
            </button>
          ))}
        </div>
      </div>
      {/* Message Input */}
      <div className="p-4 border-t border-border">
        <div className="flex space-x-2">
          <div className="flex-1 relative">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e?.target?.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm text-foreground placeholder-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              rows={1}
              style={{ minHeight: '40px', maxHeight: '80px' }}
            />
          </div>
          
          <Button
            variant="default"
            size="icon"
            onClick={handleSendMessage}
            disabled={!newMessage?.trim()}
            className="h-10 w-10"
          >
            <Icon name="Send" size={16} />
          </Button>
        </div>
        
        <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
          <span>Press Enter to send, Shift+Enter for new line</span>
          <span>{newMessage?.length}/500</span>
        </div>
      </div>
    </div>
  );
};

export default CommunicationPanel;