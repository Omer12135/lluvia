import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  Zap, 
  Settings, 
  Code, 
  Globe, 
  Database,
  Mail,
  MessageSquare,
  Calendar,
  FileText,
  ChevronRight,
  ExternalLink,
  Lightbulb
} from 'lucide-react';

const AutomationGuidance: React.FC = () => {
  const [selectedSection, setSelectedSection] = useState('triggers');

  const triggers = [
    {
      name: 'Webhook',
      icon: <Globe className="w-5 h-5 text-blue-500" />,
      description: 'Receive HTTP requests from external applications',
      useCase: 'Perfect for connecting with third-party services and APIs',
      examples: ['Payment notifications', 'Form submissions', 'API callbacks', 'Stripe webhooks', 'GitHub events', 'Shopify orders']
    },
    {
      name: 'Email',
      icon: <Mail className="w-5 h-5 text-green-500" />,
      description: 'Trigger on incoming emails or specific email events',
      useCase: 'Automate email processing and customer support workflows',
      examples: ['Support ticket creation', 'Invoice processing', 'Newsletter signups', 'Attachment extraction', 'Auto-replies', 'Email parsing']
    },
    {
      name: 'Schedule',
      icon: <Calendar className="w-5 h-5 text-purple-500" />,
      description: 'Run automations on a specific schedule or interval',
      useCase: 'Ideal for recurring tasks and maintenance operations',
      examples: ['Daily reports', 'Weekly backups', 'Monthly billing', 'Data synchronization', 'Health checks', 'Cleanup tasks']
    },
    {
      name: 'Database',
      icon: <Database className="w-5 h-5 text-orange-500" />,
      description: 'Trigger when database records are created or updated',
      useCase: 'Keep systems synchronized and respond to data changes',
      examples: ['User registration', 'Order updates', 'Inventory changes', 'Customer data sync', 'Product updates', 'Status changes']
    },
    {
      name: 'File System',
      icon: <FileText className="w-5 h-5 text-cyan-500" />,
      description: 'Monitor file and folder changes in cloud storage',
      useCase: 'Process files automatically when they are added or modified',
      examples: ['Document processing', 'Image optimization', 'Backup automation', 'File conversion', 'Content analysis', 'Archive management']
    },
    {
      name: 'Chat/Messaging',
      icon: <MessageSquare className="w-5 h-5 text-pink-500" />,
      description: 'Respond to messages from various chat platforms',
      useCase: 'Build chatbots and automated customer service',
      examples: ['Slack commands', 'Discord bots', 'Telegram automation', 'WhatsApp business', 'Teams notifications', 'Support tickets']
    },
    {
      name: 'HTTP Request',
      icon: <Zap className="w-5 h-5 text-yellow-500" />,
      description: 'Make HTTP requests to external APIs and services',
      useCase: 'Integrate with any REST API or web service',
      examples: ['API polling', 'Data fetching', 'Status checks', 'Third-party integrations', 'Service monitoring', 'Data validation']
    },
    {
      name: 'Manual Trigger',
      icon: <Settings className="w-5 h-5 text-gray-500" />,
      description: 'Start workflows manually when needed',
      useCase: 'For on-demand processes and testing workflows',
      examples: ['Data migration', 'Report generation', 'Batch processing', 'Testing workflows', 'Emergency procedures', 'One-time tasks']
    }
  ];

  const applications = [
    {
      name: 'Slack',
      icon: <MessageSquare className="w-5 h-5 text-purple-500" />,
      category: 'Communication',
      description: 'Send messages, create channels, manage team communications',
      actions: ['Send message', 'Create channel', 'Invite users', 'Set status', 'Upload files', 'Pin messages', 'Archive channels', 'Manage permissions']
    },
    {
      name: 'Google Sheets',
      icon: <FileText className="w-5 h-5 text-green-500" />,
      category: 'Productivity',
      description: 'Read, write, and manage spreadsheet data',
      actions: ['Add rows', 'Update cells', 'Create sheets', 'Format data', 'Create charts', 'Share sheets', 'Import/Export', 'Calculate formulas']
    },
    {
      name: 'Salesforce',
      icon: <Database className="w-5 h-5 text-blue-500" />,
      category: 'CRM',
      description: 'Manage customer relationships and sales processes',
      actions: ['Create leads', 'Update contacts', 'Send emails', 'Generate reports', 'Manage opportunities', 'Track activities', 'Custom objects', 'Workflow rules']
    },
    {
      name: 'Gmail',
      icon: <Mail className="w-5 h-5 text-red-500" />,
      category: 'Email',
      description: 'Send emails, manage inboxes, and process attachments',
      actions: ['Send email', 'Read inbox', 'Download attachments', 'Filter messages', 'Create labels', 'Mark as read', 'Forward emails', 'Auto-reply']
    },
    {
      name: 'Airtable',
      icon: <Database className="w-5 h-5 text-orange-500" />,
      category: 'Database',
      description: 'Organize and collaborate on structured data',
      actions: ['Create records', 'Update fields', 'Link tables', 'Filter views', 'Attach files', 'Send notifications', 'Sync data', 'Generate reports']
    },
    {
      name: 'Stripe',
      icon: <Database className="w-5 h-5 text-indigo-500" />,
      category: 'Payment',
      description: 'Process payments and manage subscriptions',
      actions: ['Create customers', 'Process payments', 'Manage subscriptions', 'Handle refunds', 'Generate invoices', 'Track analytics', 'Webhook events', 'Tax calculations']
    },
    {
      name: 'Notion',
      icon: <FileText className="w-5 h-5 text-gray-500" />,
      category: 'Productivity',
      description: 'Manage documents, databases, and team collaboration',
      actions: ['Create pages', 'Update databases', 'Add comments', 'Share content', 'Template creation', 'Block management', 'User permissions', 'Export data']
    },
    {
      name: 'Discord',
      icon: <MessageSquare className="w-5 h-5 text-purple-600" />,
      category: 'Communication',
      description: 'Manage Discord servers and automate community interactions',
      actions: ['Send messages', 'Manage roles', 'Create channels', 'Moderate content', 'Bot commands', 'Voice management', 'Server settings', 'Member management']
    },
    {
      name: 'Trello',
      icon: <Settings className="w-5 h-5 text-blue-600" />,
      category: 'Project Management',
      description: 'Organize projects with boards, lists, and cards',
      actions: ['Create cards', 'Move between lists', 'Add members', 'Set due dates', 'Attach files', 'Add labels', 'Create checklists', 'Board management']
    },
    {
      name: 'Shopify',
      icon: <Database className="w-5 h-5 text-green-600" />,
      category: 'E-commerce',
      description: 'Manage online store operations and customer data',
      actions: ['Create products', 'Process orders', 'Manage inventory', 'Handle customers', 'Generate reports', 'Manage collections', 'Discount codes', 'Fulfillment tracking']
    },
    {
      name: 'HubSpot',
      icon: <Database className="w-5 h-5 text-orange-600" />,
      category: 'CRM',
      description: 'Comprehensive CRM and marketing automation platform',
      actions: ['Manage contacts', 'Track deals', 'Email campaigns', 'Lead scoring', 'Create tickets', 'Generate reports', 'Workflow automation', 'Social media management']
    },
    {
      name: 'Zapier',
      icon: <Zap className="w-5 h-5 text-orange-400" />,
      category: 'Integration',
      description: 'Connect and automate workflows between different apps',
      actions: ['Create Zaps', 'Trigger workflows', 'Data transformation', 'Multi-step automation', 'Conditional logic', 'Error handling', 'Webhook management', 'App connections']
    }
  ];

  const bestPractices = [
    {
      title: 'Start Simple',
      description: 'Begin with basic automations and gradually add complexity',
      tips: [
        'Use single triggers initially to understand the flow',
        'Test each step thoroughly before adding more complexity',
        'Document your workflows with clear descriptions',
        'Start with non-critical processes to learn the system',
        'Use descriptive names for all automation components',
        'Keep initial workflows under 5 steps'
      ]
    },
    {
      title: 'Error Handling',
      description: 'Always plan for failure scenarios and edge cases',
      tips: [
        'Add retry logic with exponential backoff',
        'Set up error notifications to relevant team members',
        'Use fallback actions for critical processes',
        'Implement timeout handling for external API calls',
        'Log errors with sufficient detail for debugging',
        'Create alternative paths for common failure scenarios',
        'Test error conditions regularly'
      ]
    },
    {
      title: 'Performance',
      description: 'Optimize your automations for speed and efficiency',
      tips: [
        'Minimize API calls by batching requests when possible',
        'Use conditional logic to avoid unnecessary processing',
        'Cache frequently used data to reduce external calls',
        'Implement pagination for large datasets',
        'Use webhooks instead of polling when available',
        'Optimize data transformations and filtering',
        'Monitor execution times and resource usage'
      ]
    },
    {
      title: 'Security',
      description: 'Protect sensitive data and maintain security standards',
      tips: [
        'Use environment variables for API keys and secrets',
        'Encrypt sensitive data both in transit and at rest',
        'Implement proper authentication and authorization',
        'Regularly rotate API keys and access tokens',
        'Use HTTPS for all external communications',
        'Implement rate limiting to prevent abuse',
        'Audit access logs regularly',
        'Follow principle of least privilege for permissions'
      ]
    },
    {
      title: 'Monitoring & Maintenance',
      description: 'Keep your automations running smoothly over time',
      tips: [
        'Set up monitoring dashboards for key metrics',
        'Create alerts for automation failures',
        'Schedule regular health checks',
        'Keep automation documentation up to date',
        'Review and optimize workflows quarterly',
        'Monitor API rate limits and usage',
        'Plan for API version changes and deprecations'
      ]
    },
    {
      title: 'Data Management',
      description: 'Handle data responsibly and efficiently',
      tips: [
        'Validate input data before processing',
        'Implement data backup and recovery procedures',
        'Use data transformation to standardize formats',
        'Handle duplicate data appropriately',
        'Implement data retention policies',
        'Ensure GDPR and privacy compliance',
        'Use data mapping for complex transformations'
      ]
    }
  ];

  const sections = [
    { id: 'triggers', label: 'Triggers', icon: <Zap className="w-4 h-4" /> },
    { id: 'applications', label: 'Applications', icon: <Settings className="w-4 h-4" /> },
    { id: 'best-practices', label: 'Best Practices', icon: <Lightbulb className="w-4 h-4" /> },
    { id: 'resources', label: 'Resources', icon: <BookOpen className="w-4 h-4" /> }
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">Automation Guidance</h3>
        <p className="text-sm sm:text-base text-gray-400">Learn how to build effective automations with triggers and applications</p>
      </div>

      {/* Section Navigation */}
      <div className="bg-white/5 rounded-lg border border-white/10 overflow-hidden">
        <div className="flex flex-wrap border-b border-white/10">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setSelectedSection(section.id)}
              className={`flex items-center space-x-2 px-3 sm:px-6 py-2.5 sm:py-3 font-medium transition-all duration-200 text-sm sm:text-base ${
                selectedSection === section.id
                  ? 'text-white bg-gradient-to-r from-purple-600/30 to-blue-600/30 border-b-2 border-purple-500'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {section.icon}
              <span>{section.label}</span>
            </button>
          ))}
        </div>

        <div className="p-4 sm:p-6">
          <motion.div
            key={selectedSection}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            {selectedSection === 'triggers' && (
              <div className="space-y-4 sm:space-y-6">
                <div>
                  <h4 className="text-lg sm:text-xl font-bold text-white mb-2">Available Triggers</h4>
                  <p className="text-sm sm:text-base text-gray-400">Choose the right trigger to start your automation workflow</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
                  {triggers.map((trigger, index) => (
                    <motion.div
                      key={trigger.name}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white/5 rounded-lg p-3 sm:p-4 border border-white/10 hover:bg-white/10 transition-all duration-200"
                    >
                      <div className="flex items-center space-x-2 sm:space-x-3 mb-3">
                        {trigger.icon}
                        <h5 className="text-base sm:text-lg font-semibold text-white">{trigger.name}</h5>
                      </div>
                      
                      <p className="text-gray-300 text-xs sm:text-sm mb-3">{trigger.description}</p>
                      
                      <div className="bg-blue-500/10 rounded-lg p-2 sm:p-3 mb-3">
                        <p className="text-blue-400 text-xs sm:text-sm">
                          <strong>Use Case:</strong> {trigger.useCase}
                        </p>
                      </div>

                      <div>
                        <p className="text-gray-400 text-xs font-medium mb-2">Common Examples:</p>
                        <div className="space-y-1">
                          {trigger.examples.map((example, exampleIndex) => (
                            <div key={exampleIndex} className="flex items-center space-x-2">
                              <div className="w-1 h-1 bg-purple-500 rounded-full"></div>
                              <span className="text-gray-300 text-xs">{example}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {selectedSection === 'applications' && (
              <div className="space-y-4 sm:space-y-6">
                <div>
                  <h4 className="text-lg sm:text-xl font-bold text-white mb-2">Supported Applications</h4>
                  <p className="text-sm sm:text-base text-gray-400">Connect with popular apps and services in your automation workflows</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
                  {applications.map((app, index) => (
                    <motion.div
                      key={app.name}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white/5 rounded-lg p-3 sm:p-4 border border-white/10 hover:bg-white/10 transition-all duration-200"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2 sm:space-x-3">
                          {app.icon}
                          <div>
                            <h5 className="text-base sm:text-lg font-semibold text-white">{app.name}</h5>
                            <span className="text-xs text-gray-400">{app.category}</span>
                          </div>
                        </div>
                        <ExternalLink className="w-4 h-4 text-gray-500" />
                      </div>
                      
                      <p className="text-gray-300 text-xs sm:text-sm mb-3">{app.description}</p>
                      
                      <div>
                        <p className="text-gray-400 text-xs font-medium mb-2">Available Actions:</p>
                        <div className="flex flex-wrap gap-1">
                          {app.actions.map((action, actionIndex) => (
                            <span
                              key={actionIndex}
                              className="text-xs bg-white/10 text-gray-300 px-2 py-1 rounded-full"
                            >
                              {action}
                            </span>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {selectedSection === 'best-practices' && (
              <div className="space-y-4 sm:space-y-6">
                <div>
                  <h4 className="text-lg sm:text-xl font-bold text-white mb-2">Best Practices</h4>
                  <p className="text-sm sm:text-base text-gray-400">Follow these guidelines to build robust and efficient automations</p>
                </div>

                <div className="space-y-3 sm:space-y-4">
                  {bestPractices.map((practice, index) => (
                    <motion.div
                      key={practice.title}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white/5 rounded-lg p-4 sm:p-6 border border-white/10"
                    >
                      <h5 className="text-base sm:text-lg font-semibold text-white mb-2">{practice.title}</h5>
                      <p className="text-gray-300 text-xs sm:text-sm mb-3 sm:mb-4">{practice.description}</p>
                      
                      <div className="space-y-2">
                        {practice.tips.map((tip, tipIndex) => (
                          <div key={tipIndex} className="flex items-center space-x-3">
                            <ChevronRight className="w-4 h-4 text-purple-500" />
                            <span className="text-gray-300 text-sm">{tip}</span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {selectedSection === 'resources' && (
              <div className="space-y-6">
                <div>
                  <h4 className="text-xl font-bold text-white mb-2">Learning Resources</h4>
                  <p className="text-gray-400">Expand your automation skills with these helpful resources</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h5 className="text-lg font-semibold text-white">Documentation</h5>
                    {[
                      'Getting Started Guide',
                      'API Reference',
                      'Webhook Documentation',
                      'Troubleshooting Guide'
                    ].map((doc, index) => (
                      <div key={index} className="flex items-center justify-between bg-white/5 rounded-lg p-3 border border-white/10 hover:bg-white/10 transition-all duration-200 cursor-pointer">
                        <div className="flex items-center space-x-3">
                          <FileText className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-300">{doc}</span>
                        </div>
                        <ExternalLink className="w-4 h-4 text-gray-500" />
                      </div>
                    ))}
                  </div>

                  <div className="space-y-4">
                    <h5 className="text-lg font-semibold text-white">Community</h5>
                    {[
                      'Discord Community',
                      'Forum Discussions',
                      'Video Tutorials',
                      'Template Library'
                    ].map((resource, index) => (
                      <div key={index} className="flex items-center justify-between bg-white/5 rounded-lg p-3 border border-white/10 hover:bg-white/10 transition-all duration-200 cursor-pointer">
                        <div className="flex items-center space-x-3">
                          <MessageSquare className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-300">{resource}</span>
                        </div>
                        <ExternalLink className="w-4 h-4 text-gray-500" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Tips */}
                <div className="bg-gradient-to-r from-purple-600/10 to-blue-600/10 rounded-xl p-6 border border-purple-500/20">
                  <h5 className="text-lg font-semibold text-white mb-4">💡 Quick Tips</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      'Test your automations with sample data before going live',
                      'Use descriptive names for easy identification later',
                      'Set up monitoring and alerts for critical automations',
                      'Keep automation logic simple and modular for easier maintenance'
                    ].map((tip, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-gray-300 text-sm">{tip}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AutomationGuidance;