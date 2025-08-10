import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User } from 'lucide-react';
import Navbar from '../components/common/navbar';
import { IMessage } from '../interfaces/IChat';
import '../styles/navbar.css';

export default function HomePage() {
  const [messages, setMessages] = useState<IMessage[]>([
    {
      id: '1',
      content: 'Hello! I\'m DiagnoAI, your medical diagnosis assistant. How can I help you today? Please describe your symptoms.',
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleNavigateHome = () => {
    console.log('Already on home page');
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: IMessage = {
      id: Date.now().toString(),
      content: inputValue.trim(),
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    setTimeout(() => {
      const aiResponse: IMessage = {
        id: (Date.now() + 1).toString(),
        content: 'Thank you for sharing your symptoms. Based on what you\'ve described, I\'m analyzing the information. Please note that this is for informational purposes only and you should consult with a healthcare professional for proper diagnosis and treatment.',
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg flex flex-col">
      <Navbar onNavigateHome={handleNavigateHome} />

      <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full">
        <div className="flex-1 flex flex-col px-4 py-6">
          <div className="flex-1 overflow-y-auto space-y-4 mb-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`flex max-w-xs lg:max-w-md xl:max-w-lg ${
                    message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
                  }`}
                >
                  <div
                    className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                      message.sender === 'user' 
                        ? 'bg-blue-600 ml-3' 
                        : 'bg-dark-elevated mr-3'
                    }`}
                  >
                    {message.sender === 'user' ? (
                      <User size={16} className="text-white" />
                    ) : (
                      <Bot size={16} className="text-dark-text-secondary" />
                    )}
                  </div>
                  <div
                    className={`px-4 py-3 rounded-2xl ${
                      message.sender === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-dark-surface border border-dark-border text-dark-text-primary'
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{message.content}</p>
                    <p className={`text-xs mt-1 ${
                      message.sender === 'user' 
                        ? 'text-blue-100' 
                        : 'text-dark-text-muted'
                    }`}>
                      {message.timestamp.toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="flex flex-row">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-dark-elevated mr-3 flex items-center justify-center">
                    <Bot size={16} className="text-dark-text-secondary" />
                  </div>
                  <div className="px-4 py-3 rounded-2xl bg-dark-surface border border-dark-border">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-dark-text-muted rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-dark-text-muted rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-dark-text-muted rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="border-t border-dark-border pt-4">
            <div className="flex items-end space-x-3">
              <div className="flex-1">
                <div className="relative">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Describe your symptoms..."
                    className="w-full px-4 py-3 pr-12 rounded-2xl bg-dark-surface border border-dark-border text-dark-text-primary placeholder-dark-text-muted focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    disabled={isTyping}
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim() || isTyping}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  >
                    <Send size={16} />
                  </button>
                </div>
              </div>
            </div>
            <p className="text-xs text-dark-text-muted mt-2 text-center">
              Press Enter to send • This is for informational purposes only
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
