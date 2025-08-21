import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageCircle, 
  Send, 
  X, 
  Bot, 
  User, 
  Loader2,
  Minimize2,
  Maximize2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

const AIChatbot: React.FC = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I\'m your AI automation assistant. I can help you create workflows, understand triggers, and optimize your automations. What would you like to know?',
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = generateAIResponse(inputText);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const generateAIResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    if (input.includes('webhook') || input.includes('trigger')) {
      return 'Webhooks are great for real-time automation! They allow external services to trigger your workflows instantly. You can use webhooks for payment notifications, form submissions, or API callbacks. Would you like me to help you set up a specific webhook automation?';
    }
    
    if (input.includes('email') || input.includes('gmail')) {
      return 'Email automation is very powerful! You can trigger workflows when emails arrive, automatically process attachments, or send personalized responses. For example, you could create an automation that saves invoice attachments to Google Drive and creates records in Airtable. What email automation are you thinking about?';
    }
    
    if (input.includes('schedule') || input.includes('time')) {
      return 'Scheduled automations are perfect for recurring tasks! You can set up daily reports, weekly backups, or monthly billing processes. The schedule trigger supports cron expressions for complex timing. What kind of scheduled automation do you need?';
    }
    
    if (input.includes('airtable') || input.includes('database')) {
      return 'Airtable is excellent for data management! You can trigger automations when records are created or updated, sync data between platforms, or generate reports. I can help you design a workflow that keeps your data synchronized across multiple tools. What\'s your use case?';
    }
    
    if (input.includes('help') || input.includes('how')) {
      return 'I\'m here to help! I can assist with:\n\n• Creating automation workflows\n• Choosing the right triggers\n• Connecting different applications\n• Troubleshooting issues\n• Best practices and optimization\n\nWhat specific area would you like help with?';
    }
    
    return 'That\'s an interesting question! I can help you create powerful automations using various triggers like webhooks, email, schedules, and more. Could you tell me more about what you\'re trying to automate? I\'d be happy to suggest the best approach and walk you through the setup process.';
  };

  // Don't show chatbot for free plan users
  if (!user || user.plan === 'free') {
    return null;
  }

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsOpen(true)}
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 z-50"
        >
          <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
        </motion.button>
      )}

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ 
              opacity: 1, 
              y: 0, 
              scale: 1,
              height: isMinimized ? 60 : window.innerWidth < 640 ? 'calc(100vh - 2rem)' : 500
            }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 w-[calc(100vw-2rem)] sm:w-96 bg-slate-900 rounded-2xl border border-white/20 shadow-2xl z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-3 sm:p-4 flex items-center justify-between">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <Bot className="w-3 h-3 sm:w-5 sm:h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white text-sm sm:text-base">AI Assistant</h3>
                  <p className="text-xs text-white/80">
                    {user.aiMessagesUsed}/{user.aiMessagesLimit} messages used
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="text-white/80 hover:text-white transition-colors"
                >
                  {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-white/80 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Messages */}
            {!isMinimized && (
              <>
                <div className="h-60 sm:h-80 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4">
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`flex items-start space-x-2 max-w-[85%] sm:max-w-[80%] ${
                        message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                      }`}>
                        <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                          message.sender === 'user' 
                            ? 'bg-purple-600' 
                            : 'bg-gradient-to-r from-purple-600 to-blue-600'
                        }`}>
                          {message.sender === 'user' ? (
                            <User className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                          ) : (
                            <Bot className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                          )}
                        </div>
                        
                        <div className={`rounded-2xl p-2.5 sm:p-3 ${
                          message.sender === 'user'
                            ? 'bg-purple-600 text-white'
                            : 'bg-white/10 text-gray-300'
                        }`}>
                          <p className="text-xs sm:text-sm whitespace-pre-line">{message.text}</p>
                          <p className="text-xs opacity-70 mt-1">
                            {message.timestamp.toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                          <Bot className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                        </div>
                        <div className="bg-white/10 rounded-2xl p-2.5 sm:p-3">
                          <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 animate-spin" />
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-3 sm:p-4 border-t border-white/10">
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Ask me about automations..."
                      className="flex-1 bg-white/10 border border-white/20 rounded-lg px-2.5 sm:px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 text-xs sm:text-sm"
                      disabled={isLoading}
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={!inputText.trim() || isLoading}
                      className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-1.5 sm:p-2 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Send className="w-3 h-3 sm:w-4 sm:h-4" />
                    </button>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIChatbot;