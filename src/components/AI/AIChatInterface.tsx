import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Send, 
  Bot, 
  User, 
  Loader2,
  Trash2,
  Download,
  MessageSquare,
  Zap,
  AlertCircle,
  CheckCircle,
  Clock,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  type?: 'normal' | 'automation' | 'error';
}

const AIChatInterface: React.FC = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I\'m your AI automation assistant. I can help you:\n\n• Create automation workflows\n• Understand different triggers\n• Connect applications\n• Troubleshoot issues\n• Optimize your automations\n\nWhat would you like to automate today?',
      sender: 'ai',
      timestamp: new Date(),
      type: 'normal'
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

    // Check AI message limits
    if (user && user.aiMessagesUsed >= user.aiMessagesLimit && user.plan !== 'pro') {
      const errorMessage: Message = {
        id: Date.now().toString(),
        text: `You've reached your AI message limit (${user.aiMessagesLimit} messages/month). Please upgrade your plan to continue using the AI assistant.`,
        sender: 'ai',
        timestamp: new Date(),
        type: 'error'
      };
      setMessages(prev => [...prev, errorMessage]);
      return;
    }

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
        text: aiResponse.text,
        sender: 'ai',
        timestamp: new Date(),
        type: aiResponse.type
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const generateAIResponse = (userInput: string): { text: string; type: 'normal' | 'automation' | 'error' } => {
    const input = userInput.toLowerCase();
    
    if (input.includes('webhook') || input.includes('trigger')) {
      return {
        text: 'Webhooks are excellent for real-time automation! Here\'s how to set them up:\n\n🔗 **Webhook Setup:**\n• Go to Create New → Select Webhook trigger\n• Copy the generated webhook URL\n• Configure your external service to send data to this URL\n• Define what actions to take when data is received\n\n**Popular webhook uses:**\n• Payment notifications from Stripe\n• Form submissions from websites\n• GitHub repository events\n• Shopify order updates\n\nWould you like me to help you create a specific webhook automation?',
        type: 'automation'
      };
    }
    
    if (input.includes('email') || input.includes('gmail')) {
      return {
        text: 'Email automation is incredibly powerful! Here are some ideas:\n\n📧 **Email Triggers:**\n• New email received\n• Email with specific subject\n• Email from specific sender\n• Email with attachments\n\n**Common email automations:**\n• Save attachments to Google Drive\n• Create tasks from emails\n• Auto-reply to customers\n• Extract invoice data\n• Forward important emails to Slack\n\n**Setup tip:** Use Gmail filters to organize emails before automation processes them.\n\nWhat kind of email automation are you thinking about?',
        type: 'automation'
      };
    }
    
    if (input.includes('schedule') || input.includes('time') || input.includes('daily') || input.includes('weekly')) {
      return {
        text: 'Scheduled automations are perfect for recurring tasks! Here\'s what you can do:\n\n⏰ **Schedule Options:**\n• Every minute/hour/day/week/month\n• Specific times (e.g., 9 AM every Monday)\n• Custom cron expressions for complex timing\n\n**Popular scheduled automations:**\n• Daily sales reports\n• Weekly team updates\n• Monthly billing processes\n• Backup operations\n• Data synchronization\n• Health checks\n\n**Pro tip:** Start with simple schedules and gradually add complexity.\n\nWhat recurring task would you like to automate?',
        type: 'automation'
      };
    }
    
    if (input.includes('airtable') || input.includes('database') || input.includes('data')) {
      return {
        text: 'Airtable is fantastic for data management automation! Here\'s how to leverage it:\n\n🗄️ **Airtable Triggers:**\n• New record created\n• Record updated\n• Field value changes\n• View filters match\n\n**Airtable Actions:**\n• Create new records\n• Update existing data\n• Link records between tables\n• Generate reports\n• Send notifications\n\n**Integration ideas:**\n• Sync CRM data with Airtable\n• Create invoices from Airtable records\n• Update inventory from sales data\n• Generate customer reports\n\nWhat kind of data workflow do you need help with?',
        type: 'automation'
      };
    }
    
    if (input.includes('slack') || input.includes('team') || input.includes('notification')) {
      return {
        text: 'Slack automation keeps your team informed and productive! Here are some powerful workflows:\n\n💬 **Slack Automations:**\n• Send alerts when systems go down\n• Notify team of new sales/leads\n• Daily standup reminders\n• Project status updates\n• Customer support ticket alerts\n\n**Advanced features:**\n• Interactive buttons in messages\n• Threaded conversations\n• Channel-specific notifications\n• User mentions and @here/@channel\n• File uploads and sharing\n\n**Setup tip:** Create dedicated channels for different automation types.\n\nWhat kind of team notifications do you want to automate?',
        type: 'automation'
      };
    }
    
    if (input.includes('help') || input.includes('how') || input.includes('start')) {
      return {
        text: 'I\'m here to help you master automation! Here\'s how I can assist:\n\n🤖 **What I can help with:**\n• **Workflow Design** - Plan your automation step-by-step\n• **Trigger Selection** - Choose the right trigger for your needs\n• **App Connections** - Connect different tools and services\n• **Troubleshooting** - Fix issues with existing automations\n• **Best Practices** - Optimize performance and reliability\n• **Use Cases** - Suggest automation ideas for your business\n\n**Quick start tips:**\n1. Start with simple, single-step automations\n2. Test with sample data first\n3. Add error handling for reliability\n4. Monitor and optimize over time\n\nWhat specific area would you like help with?',
        type: 'normal'
      };
    }
    
    if (input.includes('limit') || input.includes('upgrade') || input.includes('plan')) {
      const planInfo = user ? `You're currently on the ${user.plan.charAt(0).toUpperCase() + user.plan.slice(1)} plan with ${user.aiMessagesUsed}/${user.aiMessagesLimit} AI messages used.` : 'Please log in to see your plan details.';
      
      return {
        text: `📊 **Your Plan Information:**\n${planInfo}\n\n**Plan Comparison:**\n• **Basic Plan (Free)** - 2 automations/month, No AI chatbot\n• **Starter Plan ($19/month)** - 15 automations/month, 100 AI messages/month\n• **Pro Plan ($99/month)** - 50 automations/month, 1000 AI messages/month\n\n**Upgrade benefits:**\n• More automations per month\n• AI assistant access\n• Priority support\n• Advanced features\n\nWould you like help choosing the right plan for your needs?`,
        type: 'normal'
      };
    }
    
    return {
      text: 'That\'s an interesting question! I can help you create powerful automations using various triggers and actions.\n\n🚀 **Popular automation ideas:**\n• Email processing and responses\n• Data synchronization between apps\n• Social media monitoring\n• Customer onboarding workflows\n• Invoice and payment processing\n• Team notifications and alerts\n\nCould you tell me more about what specific process you\'d like to automate? I\'d be happy to suggest the best approach and walk you through the setup!',
      type: 'normal'
    };
  };

  const clearChat = () => {
    setMessages([
      {
        id: '1',
        text: 'Hello! I\'m your AI automation assistant. I can help you create workflows, understand triggers, and optimize your automations. What would you like to know?',
        sender: 'ai',
        timestamp: new Date(),
        type: 'normal'
      }
    ]);
  };

  const downloadChat = () => {
    const chatData = {
      user: user?.email,
      timestamp: new Date().toISOString(),
      messages: messages.map(m => ({
        sender: m.sender,
        text: m.text,
        timestamp: m.timestamp.toISOString()
      }))
    };

    const dataStr = JSON.stringify(chatData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `ai-chat-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Check if user has access to AI chatbot
  const hasAIAccess = user && user.plan !== 'free';
  const isAtLimit = user && user.aiMessagesUsed >= user.aiMessagesLimit;

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
            <Bot className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-white">AI Chat Assistant</h3>
            {hasAIAccess && (
              <span className="text-sm sm:text-base text-gray-500">
                {user.plan === 'free' ? 'AI Chatbot not available on Basic Plan' : 
                 `${user.aiMessagesUsed}/${user.aiMessagesLimit} messages used this month`}
              </span>
            )}
          </div>
        </div>
        
        {hasAIAccess && (
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
            <button
              onClick={downloadChat}
              className="flex items-center justify-center space-x-2 bg-blue-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
            >
              <Download className="w-4 h-4" />
              <span>Export Chat</span>
            </button>
            <button
              onClick={clearChat}
              className="flex items-center justify-center space-x-2 bg-red-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm sm:text-base"
            >
              <Trash2 className="w-4 h-4" />
              <span>Clear Chat</span>
            </button>
          </div>
        )}
      </div>

      {/* Plan Limitation Warning */}
      {!hasAIAccess && (
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 sm:p-6">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-yellow-400 font-medium text-base sm:text-lg">AI Chatbot Not Available</p>
              <p className="text-yellow-300 text-sm mt-1">
                The AI assistant is available on Starter Plan ($19/month) and Pro Plan ($99/month). 
                Upgrade to get personalized automation help and guidance.
              </p>
              <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                <div className="bg-purple-500/20 rounded-lg p-3 border border-purple-500/30">
                  <p className="text-purple-400 font-medium text-sm sm:text-base">Starter Plan</p>
                  <p className="text-purple-300 text-xs sm:text-sm">100 AI messages/month</p>
                </div>
                <div className="bg-blue-500/20 rounded-lg p-3 border border-blue-500/30">
                  <p className="text-blue-400 font-medium text-sm sm:text-base">Pro Plan</p>
                  <p className="text-blue-300 text-xs sm:text-sm">1000 AI messages/month</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Message Limit Warning */}
      {hasAIAccess && isAtLimit && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 sm:p-4">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-red-400 font-medium text-sm sm:text-base">Monthly Message Limit Reached</p>
              <p className="text-red-300 text-xs sm:text-sm">
                You've used all {user?.aiMessagesLimit} AI messages for this month. 
                {user?.plan === 'starter' ? ' Upgrade to Pro Plan for 1000 messages/month.' : ' Your limit will reset next month.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Chat Interface */}
      {hasAIAccess && (
        <div className="bg-white/5 rounded-lg border border-white/10 overflow-hidden">
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 p-3 sm:p-4 border-b border-white/10">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                <Bot className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <h4 className="text-base sm:text-lg font-semibold text-white">AI Assistant</h4>
                <p className="text-xs sm:text-sm text-gray-400">
                  Powered by advanced AI • {user?.aiMessagesUsed}/{user?.aiMessagesLimit} messages used
                </p>
              </div>
            </div>
          </div>

          {/* Messages Area */}
          <div className="h-80 sm:h-96 overflow-y-auto p-3 sm:p-6 space-y-3 sm:space-y-4 bg-slate-900/50 scrollbar-thin">
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-start space-x-2 sm:space-x-3 max-w-[90%] sm:max-w-[85%] ${
                  message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                }`}>
                  <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.sender === 'user' 
                      ? 'bg-purple-600' 
                      : message.type === 'error'
                      ? 'bg-red-600'
                      : message.type === 'automation'
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                      : 'bg-gradient-to-r from-purple-600 to-blue-600'
                  }`}>
                    {message.sender === 'user' ? (
                      <User className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                    ) : message.type === 'error' ? (
                      <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                    ) : message.type === 'automation' ? (
                      <Zap className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                    ) : (
                      <Bot className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                    )}
                  </div>
                  
                  <div className={`rounded-2xl p-3 sm:p-4 ${
                    message.sender === 'user'
                      ? 'bg-purple-600 text-white'
                      : message.type === 'error'
                      ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                      : message.type === 'automation'
                      ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                      : 'bg-white/10 text-gray-300 border border-white/20'
                  }`}>
                    <p className="text-xs sm:text-sm whitespace-pre-line leading-relaxed">{message.text}</p>
                    <p className="text-xs opacity-70 mt-2">
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                    <Bot className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                  </div>
                  <div className="bg-white/10 rounded-2xl p-3 sm:p-4 border border-white/20">
                    <div className="flex items-center space-x-2">
                      <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 animate-spin" />
                      <span className="text-xs sm:text-sm text-gray-400">AI is thinking...</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 sm:p-4 border-t border-white/10 bg-slate-900/30">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder={isAtLimit ? "Message limit reached..." : "Ask me about automations, triggers, or workflows..."}
                  disabled={isLoading || isAtLimit}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 pr-10 sm:pr-12 text-sm sm:text-base"
                />
                <Sparkles className="absolute right-2.5 sm:right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
              </div>
              <button
                onClick={handleSendMessage}
                disabled={!inputText.trim() || isLoading || isAtLimit}
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-2.5 sm:p-3 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
            
            {hasAIAccess && !isAtLimit && (
              <p className="text-xs text-gray-500 mt-2">
                💡 Try asking: "How do I create a webhook automation?" or "Help me automate email processing"
              </p>
            )}
          </div>
        </div>
      )}

      {/* Quick Actions for AI Chat */}
      {hasAIAccess && !isAtLimit && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {[
            {
              title: "Webhook Setup",
              description: "Learn how to create webhook automations",
              prompt: "How do I set up a webhook automation for payment notifications?",
              icon: <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
            },
            {
              title: "Email Processing",
              description: "Automate email workflows",
              prompt: "Help me create an automation that processes invoice emails",
              icon: <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
            },
            {
              title: "Data Sync",
              description: "Connect different databases",
              prompt: "How can I sync data between Airtable and Google Sheets?",
              icon: <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500" />
            }
          ].map((action, index) => (
            <motion.button
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => {
                setInputText(action.prompt);
                setTimeout(() => handleSendMessage(), 100);
              }}
              className="bg-white/5 rounded-lg p-3 sm:p-4 border border-white/10 hover:bg-white/10 transition-all duration-200 text-left"
            >
              <div className="flex items-center space-x-2 sm:space-x-3 mb-2">
                {action.icon}
                <h5 className="font-semibold text-white text-sm sm:text-base">{action.title}</h5>
              </div>
              <p className="text-gray-400 text-xs sm:text-sm">{action.description}</p>
            </motion.button>
          ))}
        </div>
      )}
    </div>
  );
};

export default AIChatInterface;