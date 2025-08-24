export interface Trigger {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
}

export interface Action {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: string;
}

export const triggers: Trigger[] = [
  // Core n8n Trigger Nodes (Featured)
  { id: 'manual', name: 'Manual', description: 'Manual trigger to start workflow', icon: 'MousePointer', category: 'Core' },
  { id: 'form', name: 'Form', description: 'Form submission trigger', icon: 'FileText', category: 'Core' },
  { id: 'telegram-message', name: 'On telegram message', description: 'Updates: message', icon: 'MessageSquare', category: 'Communication' },
  { id: 'schedule', name: 'Schedule', description: 'Scheduled trigger', icon: 'Clock', category: 'Core' },
  { id: 'webhook', name: 'Webhook', description: 'Webhook trigger (GET)', icon: 'Globe', category: 'Core' },
  { id: 'gmail-message', name: 'On message received', description: 'Gmail Trigger', icon: 'Mail', category: 'Communication' },
  { id: 'chat-received', name: 'Chat Received', description: 'Chat message trigger', icon: 'MessageSquare', category: 'Communication' },
  { id: 'workflow-execution', name: 'executed by another workflow', description: 'Triggered by another workflow', icon: 'Workflow', category: 'Core' },
  { id: 'airtable-event', name: 'Airtable Event', description: 'Airtable record changes', icon: 'Database', category: 'Database' },
  
  // Marketing & CRM Triggers
  { id: 'activecampaign', name: 'ActiveCampaign Trigger', description: 'On contact/campaign change', icon: 'Mail', category: 'Marketing' },
  { id: 'acuity-scheduling', name: 'Acuity Scheduling Trigger', description: 'On appointment scheduled', icon: 'Calendar', category: 'Scheduling' },
  { id: 'affinity', name: 'Affinity Trigger', description: 'On CRM change', icon: 'Database', category: 'CRM' },
  { id: 'airtable', name: 'Airtable Trigger', description: 'On record change', icon: 'Database', category: 'Database' },
  { id: 'amqp', name: 'AMQP Trigger', description: 'On message received', icon: 'MessageSquare', category: 'Messaging' },
  { id: 'asana', name: 'Asana Trigger', description: 'On task change', icon: 'CheckCircle', category: 'Project Management' },
  { id: 'autopilot', name: 'Autopilot Trigger', description: 'On marketing automation', icon: 'Bot', category: 'Marketing' },
  { id: 'aws-sns', name: 'AWS SNS Trigger', description: 'On notification received', icon: 'Bell', category: 'Cloud' },
  { id: 'bitbucket', name: 'Bitbucket Trigger', description: 'On repository event', icon: 'GitBranch', category: 'Development' },
  { id: 'box', name: 'Box Trigger', description: 'On file change', icon: 'Folder', category: 'Storage' },
  { id: 'brevo', name: 'Brevo Trigger', description: 'On email marketing event', icon: 'Mail', category: 'Marketing' },
  { id: 'calendly', name: 'Calendly Trigger', description: 'On meeting scheduled', icon: 'Calendar', category: 'Scheduling' },
  { id: 'cal', name: 'Cal Trigger', description: 'On calendar event', icon: 'Calendar', category: 'Scheduling' },
  { id: 'chargebee', name: 'Chargebee Trigger', description: 'On subscription change', icon: 'CreditCard', category: 'Payment' },
  { id: 'clickup', name: 'ClickUp Trigger', description: 'On task change', icon: 'CheckCircle', category: 'Project Management' },
  { id: 'clockify', name: 'Clockify Trigger', description: 'On time tracking event', icon: 'Clock', category: 'Productivity' },
  { id: 'convertkit', name: 'ConvertKit Trigger', description: 'On email subscriber event', icon: 'Mail', category: 'Marketing' },
  { id: 'copper', name: 'Copper Trigger', description: 'On CRM change', icon: 'Database', category: 'CRM' },
  { id: 'crowd-dev', name: 'crowd.dev Trigger', description: 'On community event', icon: 'Users', category: 'Community' },
  { id: 'customer-io', name: 'Customer.io Trigger', description: 'On customer event', icon: 'Users', category: 'Marketing' },
  { id: 'emelia', name: 'Emelia Trigger', description: 'On email outreach event', icon: 'Mail', category: 'Marketing' },
  { id: 'eventbrite', name: 'Eventbrite Trigger', description: 'On event registration', icon: 'Calendar', category: 'Events' },
  { id: 'facebook-lead-ads', name: 'Facebook Lead Ads Trigger', description: 'On lead generated', icon: 'Users', category: 'Marketing' },
  { id: 'facebook', name: 'Facebook Trigger', description: 'On social media event', icon: 'Share2', category: 'Social Media' },
  { id: 'figma', name: 'Figma Trigger (Beta)', description: 'On design change', icon: 'Figma', category: 'Design' },
  { id: 'flow', name: 'Flow Trigger', description: 'On workflow event', icon: 'Workflow', category: 'Productivity' },
  { id: 'form-io', name: 'Form.io Trigger', description: 'On form submission', icon: 'FileText', category: 'Forms' },
  { id: 'formstack', name: 'Formstack Trigger', description: 'On form submission', icon: 'FileText', category: 'Forms' },
  { id: 'getresponse', name: 'GetResponse Trigger', description: 'On email marketing event', icon: 'Mail', category: 'Marketing' },
  { id: 'github', name: 'GitHub Trigger', description: 'On repository event', icon: 'GitBranch', category: 'Development' },
  { id: 'gitlab', name: 'GitLab Trigger', description: 'On repository event', icon: 'GitBranch', category: 'Development' },
  { id: 'gmail', name: 'Gmail Trigger', description: 'On email received', icon: 'Mail', category: 'Communication' },
  { id: 'google-calendar', name: 'Google Calendar Trigger', description: 'On calendar event', icon: 'Calendar', category: 'Scheduling' },
  { id: 'google-drive', name: 'Google Drive Trigger', description: 'On file change', icon: 'Folder', category: 'Storage' },
  { id: 'google-business-profile', name: 'Google Business Profile Trigger', description: 'On business event', icon: 'MapPin', category: 'Business' },
  { id: 'google-sheets', name: 'Google Sheets Trigger', description: 'On spreadsheet change', icon: 'Database', category: 'Database' },
  { id: 'gumroad', name: 'Gumroad Trigger', description: 'On product sale', icon: 'ShoppingCart', category: 'E-commerce' },
  { id: 'help-scout', name: 'Help Scout Trigger', description: 'On support ticket', icon: 'HelpCircle', category: 'Support' },
  { id: 'hubspot', name: 'Hubspot Trigger', description: 'On CRM change', icon: 'Database', category: 'CRM' },
  { id: 'invoice-ninja', name: 'Invoice Ninja Trigger', description: 'On invoice event', icon: 'FileText', category: 'Finance' },
  { id: 'jira', name: 'Jira Trigger', description: 'On issue change', icon: 'Bug', category: 'Project Management' },
  { id: 'jotform', name: 'JotForm Trigger', description: 'On form submission', icon: 'FileText', category: 'Forms' },
  { id: 'kafka', name: 'Kafka Trigger', description: 'On message received', icon: 'MessageSquare', category: 'Messaging' },
  { id: 'keap', name: 'Keap Trigger', description: 'On CRM event', icon: 'Database', category: 'CRM' },
  { id: 'kobotoolbox', name: 'KoboToolbox Trigger', description: 'On survey response', icon: 'FileText', category: 'Forms' },
  { id: 'lemlist', name: 'Lemlist Trigger', description: 'On email outreach event', icon: 'Mail', category: 'Marketing' },
  { id: 'linear', name: 'Linear Trigger', description: 'On issue change', icon: 'CheckCircle', category: 'Project Management' },
  { id: 'lonescale', name: 'LoneScale Trigger', description: 'On scaling event', icon: 'TrendingUp', category: 'Analytics' },
  { id: 'mailchimp', name: 'Mailchimp Trigger', description: 'On email marketing event', icon: 'Mail', category: 'Marketing' },
  { id: 'mailerlite', name: 'MailerLite Trigger', description: 'On email marketing event', icon: 'Mail', category: 'Marketing' },
  { id: 'mailjet', name: 'Mailjet Trigger', description: 'On email event', icon: 'Mail', category: 'Marketing' },
  { id: 'mautic', name: 'Mautic Trigger', description: 'On marketing automation', icon: 'Bot', category: 'Marketing' },
  { id: 'microsoft-onedrive', name: 'Microsoft OneDrive Trigger', description: 'On file change', icon: 'Folder', category: 'Storage' },
  { id: 'microsoft-outlook', name: 'Microsoft Outlook Trigger', description: 'On email received', icon: 'Mail', category: 'Communication' },
  { id: 'microsoft-teams', name: 'Microsoft Teams Trigger', description: 'On team event', icon: 'MessageSquare', category: 'Communication' },
  { id: 'mqtt', name: 'MQTT Trigger', description: 'On IoT message', icon: 'Wifi', category: 'IoT' },
  { id: 'netlify', name: 'Netlify Trigger', description: 'On deployment event', icon: 'Globe', category: 'Development' },
  { id: 'notion', name: 'Notion Trigger', description: 'On page change', icon: 'Database', category: 'Database' },
  { id: 'onfleet', name: 'Onfleet Trigger', description: 'On delivery event', icon: 'Truck', category: 'Logistics' },
  { id: 'paypal', name: 'PayPal Trigger', description: 'On payment received', icon: 'CreditCard', category: 'Payment' },
  { id: 'pipedrive', name: 'Pipedrive Trigger', description: 'On deal change', icon: 'Database', category: 'CRM' },
  { id: 'postgres', name: 'Postgres Trigger', description: 'On database change', icon: 'Database', category: 'Database' },
  { id: 'postmark', name: 'Postmark Trigger', description: 'On email event', icon: 'Mail', category: 'Communication' },
  { id: 'pushcut', name: 'Pushcut Trigger', description: 'On notification', icon: 'Bell', category: 'Notifications' },
  { id: 'rabbitmq', name: 'RabbitMQ Trigger', description: 'On message received', icon: 'MessageSquare', category: 'Messaging' },
  { id: 'redis', name: 'Redis Trigger', description: 'On key change', icon: 'Database', category: 'Database' },
  { id: 'salesforce', name: 'Salesforce Trigger', description: 'On CRM change', icon: 'Database', category: 'CRM' },
  { id: 'seatable', name: 'SeaTable Trigger', description: 'On table change', icon: 'Database', category: 'Database' },
  { id: 'shopify', name: 'Shopify Trigger', description: 'On order/product change', icon: 'ShoppingCart', category: 'E-commerce' },
  { id: 'slack', name: 'Slack Trigger', description: 'On message received', icon: 'MessageSquare', category: 'Communication' },
  { id: 'strava', name: 'Strava Trigger', description: 'On activity recorded', icon: 'Activity', category: 'Fitness' },
  { id: 'stripe', name: 'Stripe Trigger', description: 'On payment event', icon: 'CreditCard', category: 'Payment' },
  { id: 'surveymonkey', name: 'SurveyMonkey Trigger', description: 'On survey response', icon: 'FileText', category: 'Forms' },
  { id: 'taiga', name: 'Taiga Trigger', description: 'On project event', icon: 'CheckCircle', category: 'Project Management' },
  { id: 'telegram', name: 'Telegram Trigger', description: 'On message received', icon: 'MessageSquare', category: 'Communication' },
  { id: 'thehive5', name: 'TheHive 5 Trigger', description: 'On security event', icon: 'Shield', category: 'Security' },
  { id: 'thehive', name: 'TheHive Trigger', description: 'On security event', icon: 'Shield', category: 'Security' },
  { id: 'toggl', name: 'Toggl Trigger', description: 'On time tracking event', icon: 'Clock', category: 'Productivity' },
  { id: 'trello', name: 'Trello Trigger', description: 'On card change', icon: 'CheckCircle', category: 'Project Management' },
  { id: 'twilio', name: 'Twilio Trigger', description: 'On SMS/call received', icon: 'Phone', category: 'Communication' },
  { id: 'typeform', name: 'Typeform Trigger', description: 'On form submission', icon: 'FileText', category: 'Forms' },
  { id: 'venafi-tls-protect-cloud', name: 'Venafi TLS Protect Cloud Trigger', description: 'On certificate event', icon: 'Shield', category: 'Security' },
  { id: 'webex', name: 'Webex by Cisco Trigger', description: 'On meeting event', icon: 'Video', category: 'Communication' },
  { id: 'webflow', name: 'Webflow Trigger', description: 'On site event', icon: 'Globe', category: 'Web Development' },
  { id: 'whatsapp', name: 'WhatsApp Trigger', description: 'On message received', icon: 'MessageSquare', category: 'Communication' },
  { id: 'wise', name: 'Wise Trigger', description: 'On transfer event', icon: 'CreditCard', category: 'Finance' },
  { id: 'woocommerce', name: 'WooCommerce Trigger', description: 'On order change', icon: 'ShoppingCart', category: 'E-commerce' },
  { id: 'workable', name: 'Workable Trigger', description: 'On recruitment event', icon: 'Users', category: 'HR' },
  { id: 'wufoo', name: 'Wufoo Trigger', description: 'On form submission', icon: 'FileText', category: 'Forms' },
  { id: 'zendesk', name: 'Zendesk Trigger', description: 'On support ticket', icon: 'HelpCircle', category: 'Support' }
];

export const actions: Action[] = [
  // Communication & Marketing
  { id: 'action-network', name: 'Action Network', description: 'Manage advocacy campaigns', category: 'Advocacy', icon: 'Users' },
  { id: 'activecampaign', name: 'ActiveCampaign', description: 'Email marketing automation', category: 'Marketing', icon: 'Mail' },
  { id: 'adalo', name: 'Adalo', description: 'No-code app builder', category: 'Development', icon: 'Smartphone' },
  { id: 'affinity', name: 'Affinity', description: 'Manage Affinity CRM', category: 'CRM', icon: 'Database' },
  { id: 'agile-crm', name: 'Agile CRM', description: 'Manage Agile CRM', category: 'CRM', icon: 'Database' },
  { id: 'airtable', name: 'Airtable', description: 'Database operations', category: 'Database', icon: 'Database' },
  { id: 'airtop', name: 'Airtop', description: 'Browser automation', category: 'Automation', icon: 'Globe' },
  { id: 'amqp-sender', name: 'AMQP Sender', description: 'Send AMQP messages', category: 'Messaging', icon: 'MessageSquare' },
  { id: 'anthropic', name: 'Anthropic', description: 'AI text generation', category: 'AI', icon: 'Bot' },
  { id: 'apitemplate', name: 'APITemplate.io', description: 'Generate documents/images', category: 'Documents', icon: 'FileText' },
  { id: 'asana', name: 'Asana', description: 'Project management', category: 'Project Management', icon: 'CheckCircle' },
  { id: 'automizy', name: 'Automizy', description: 'Email marketing', category: 'Marketing', icon: 'Mail' },
  { id: 'autopilot', name: 'Autopilot', description: 'Marketing automation', category: 'Marketing', icon: 'Bot' },
  
  // AWS Services
  { id: 'aws-certificate-manager', name: 'AWS Certificate Manager', description: 'Manage SSL certificates', category: 'Cloud', icon: 'Shield' },
  { id: 'aws-cognito', name: 'AWS Cognito', description: 'User authentication', category: 'Cloud', icon: 'Users' },
  { id: 'aws-comprehend', name: 'AWS Comprehend', description: 'Text analysis', category: 'AI', icon: 'Bot' },
  { id: 'aws-dynamodb', name: 'AWS DynamoDB', description: 'NoSQL database', category: 'Database', icon: 'Database' },
  { id: 'aws-lambda', name: 'AWS Lambda', description: 'Serverless functions', category: 'Cloud', icon: 'Zap' },
  { id: 'aws-s3', name: 'AWS S3', description: 'File storage', category: 'Storage', icon: 'Folder' },
  { id: 'aws-ses', name: 'AWS SES', description: 'Email service', category: 'Communication', icon: 'Mail' },
  { id: 'aws-sns', name: 'AWS SNS', description: 'Push notifications', category: 'Notifications', icon: 'Bell' },
  
  // Google Services
  { id: 'gmail', name: 'Gmail', description: 'Email management', category: 'Communication', icon: 'Mail' },
  { id: 'google-calendar', name: 'Google Calendar', description: 'Calendar management', category: 'Productivity', icon: 'Calendar' },
  { id: 'google-drive', name: 'Google Drive', description: 'File storage', category: 'Storage', icon: 'Folder' },
  { id: 'google-sheets', name: 'Google Sheets', description: 'Spreadsheet management', category: 'Productivity', icon: 'Database' },
  { id: 'google-docs', name: 'Google Docs', description: 'Document creation', category: 'Productivity', icon: 'FileText' },
  
  // Microsoft Services
  { id: 'microsoft-outlook', name: 'Microsoft Outlook', description: 'Email management', category: 'Communication', icon: 'Mail' },
  { id: 'microsoft-teams', name: 'Microsoft Teams', description: 'Team collaboration', category: 'Communication', icon: 'MessageSquare' },
  { id: 'microsoft-onedrive', name: 'Microsoft OneDrive', description: 'File storage', category: 'Storage', icon: 'Folder' },
  
  // Popular Services
  { id: 'slack', name: 'Slack', description: 'Team communication', category: 'Communication', icon: 'MessageSquare' },
  { id: 'discord', name: 'Discord', description: 'Community communication', category: 'Communication', icon: 'MessageSquare' },
  { id: 'telegram', name: 'Telegram', description: 'Messaging platform', category: 'Communication', icon: 'MessageSquare' },
  { id: 'whatsapp-business-cloud', name: 'WhatsApp Business Cloud', description: 'WhatsApp messaging', category: 'Communication', icon: 'MessageSquare' },
  { id: 'twilio', name: 'Twilio', description: 'Communication APIs', category: 'Communication', icon: 'Phone' },
  { id: 'zoom', name: 'Zoom', description: 'Video conferencing', category: 'Communication', icon: 'Video' },
  
  // CRM & Sales
  { id: 'salesforce', name: 'Salesforce', description: 'CRM platform', category: 'CRM', icon: 'Database' },
  { id: 'hubspot', name: 'HubSpot', description: 'CRM and marketing', category: 'CRM', icon: 'Database' },
  { id: 'pipedrive', name: 'Pipedrive', description: 'Sales CRM', category: 'CRM', icon: 'Database' },
  { id: 'copper', name: 'Copper', description: 'CRM management', category: 'CRM', icon: 'Database' },
  
  // E-commerce & Payments
  { id: 'shopify', name: 'Shopify', description: 'E-commerce platform', category: 'E-commerce', icon: 'ShoppingCart' },
  { id: 'stripe', name: 'Stripe', description: 'Payment processing', category: 'Finance', icon: 'CreditCard' },
  { id: 'paypal', name: 'PayPal', description: 'Payment processing', category: 'Finance', icon: 'CreditCard' },
  { id: 'woocommerce', name: 'WooCommerce', description: 'E-commerce platform', category: 'E-commerce', icon: 'ShoppingCart' },
  
  // Project Management
  { id: 'trello', name: 'Trello', description: 'Project management', category: 'Project Management', icon: 'Trello' },
  { id: 'asana-action', name: 'Asana', description: 'Project management', category: 'Project Management', icon: 'CheckCircle' },
  { id: 'monday-com', name: 'monday.com', description: 'Work management', category: 'Project Management', icon: 'CheckCircle' },
  { id: 'clickup', name: 'ClickUp', description: 'Project management', category: 'Project Management', icon: 'CheckCircle' },
  { id: 'linear', name: 'Linear', description: 'Issue tracking', category: 'Project Management', icon: 'CheckCircle' },
  { id: 'jira-software', name: 'Jira Software', description: 'Issue tracking', category: 'Project Management', icon: 'Bug' },
  
  // Databases
  { id: 'airtable-action', name: 'Airtable', description: 'Database operations', category: 'Database', icon: 'Database' },
  { id: 'notion', name: 'Notion', description: 'Workspace management', category: 'Productivity', icon: 'FileText' },
  { id: 'mongodb', name: 'MongoDB', description: 'NoSQL database', category: 'Database', icon: 'Database' },
  { id: 'mysql', name: 'MySQL', description: 'Relational database', category: 'Database', icon: 'Database' },
  { id: 'postgres', name: 'Postgres', description: 'Relational database', category: 'Database', icon: 'Database' },
  { id: 'supabase', name: 'Supabase', description: 'Backend as a service', category: 'Database', icon: 'Database' },
  { id: 'redis', name: 'Redis', description: 'In-memory database', category: 'Database', icon: 'Database' },
  
  // AI & ML
  { id: 'openai', name: 'OpenAI', description: 'AI language models', category: 'AI', icon: 'Bot' },
  { id: 'anthropic-action', name: 'Anthropic', description: 'AI text generation', category: 'AI', icon: 'Bot' },
  { id: 'google-gemini', name: 'Google Gemini', description: 'AI assistant', category: 'AI', icon: 'Bot' },
  
  // Marketing
  { id: 'mailchimp', name: 'Mailchimp', description: 'Email marketing', category: 'Marketing', icon: 'Mail' },
  { id: 'convertkit', name: 'ConvertKit', description: 'Email marketing', category: 'Marketing', icon: 'Mail' },
  { id: 'mailerlite', name: 'MailerLite', description: 'Email marketing', category: 'Marketing', icon: 'Mail' },
  { id: 'sendgrid', name: 'SendGrid', description: 'Email delivery', category: 'Communication', icon: 'Mail' },
  
  // Development
  { id: 'github', name: 'GitHub', description: 'Code repository management', category: 'Development', icon: 'GitBranch' },
  { id: 'gitlab', name: 'GitLab', description: 'DevOps platform', category: 'Development', icon: 'GitBranch' },
  { id: 'netlify', name: 'Netlify', description: 'Web deployment', category: 'Development', icon: 'Globe' },
  { id: 'webflow', name: 'Webflow', description: 'Web design platform', category: 'Web Development', icon: 'Globe' },
  
  // Storage
  { id: 'dropbox', name: 'Dropbox', description: 'File storage and sharing', category: 'Storage', icon: 'Folder' },
  { id: 'box', name: 'Box', description: 'File storage and sharing', category: 'Storage', icon: 'Folder' },
  
  // Analytics
  { id: 'google-analytics', name: 'Google Analytics', description: 'Web analytics', category: 'Analytics', icon: 'BarChart3' },
  
  // Social Media
  { id: 'x-twitter', name: 'X (Formerly Twitter)', description: 'Social media platform', category: 'Social Media', icon: 'Twitter' },
  { id: 'linkedin', name: 'LinkedIn', description: 'Professional networking', category: 'Social Media', icon: 'Linkedin' },
  { id: 'facebook-graph-api', name: 'Facebook Graph API', description: 'Facebook integration', category: 'Social Media', icon: 'Share2' },
  
  // Support & Help Desk
  { id: 'zendesk', name: 'Zendesk', description: 'Customer support', category: 'Support', icon: 'HelpCircle' },
  { id: 'intercom', name: 'Intercom', description: 'Customer messaging', category: 'Support', icon: 'MessageSquare' },
  { id: 'help-scout', name: 'Help Scout', description: 'Customer support', category: 'Support', icon: 'HelpCircle' }
];

// Helper functions
export const getTriggerById = (id: string): Trigger | undefined => {
  return triggers.find(trigger => trigger.id === id);
};

export const getActionById = (id: string): Action | undefined => {
  return actions.find(action => action.id === id);
};

export const getTriggersByCategory = (category: string): Trigger[] => {
  return triggers.filter(trigger => trigger.category === category);
};

export const getActionsByCategory = (category: string): Action[] => {
  return actions.filter(action => action.category === category);
};

export const getAllTriggerCategories = (): string[] => {
  return [...new Set(triggers.map(trigger => trigger.category))].sort();
};

export const getAllActionCategories = (): string[] => {
  return [...new Set(actions.map(action => action.category))].sort();
};
