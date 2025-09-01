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
  // Communication & Messaging
  { id: 'gmail', name: 'Gmail', description: 'Email management and automation', category: 'Communication', icon: 'Mail' },
  { id: 'slack', name: 'Slack', description: 'Team communication and messaging', category: 'Communication', icon: 'MessageSquare' },
  { id: 'discord', name: 'Discord', description: 'Community communication platform', category: 'Communication', icon: 'MessageSquare' },
  { id: 'telegram', name: 'Telegram', description: 'Instant messaging platform', category: 'Communication', icon: 'MessageSquare' },
  { id: 'whatsapp-business-cloud', name: 'WhatsApp Business Cloud', description: 'WhatsApp messaging for business', category: 'Communication', icon: 'MessageSquare' },
  { id: 'twilio', name: 'Twilio', description: 'Communication APIs for SMS, voice, video', category: 'Communication', icon: 'Phone' },
  { id: 'zoom', name: 'Zoom', description: 'Video conferencing and meetings', category: 'Communication', icon: 'Video' },
  { id: 'microsoft-outlook', name: 'Microsoft Outlook', description: 'Email and calendar management', category: 'Communication', icon: 'Mail' },
  { id: 'microsoft-teams', name: 'Microsoft Teams', description: 'Team collaboration platform', category: 'Communication', icon: 'MessageSquare' },
  { id: 'sendgrid', name: 'SendGrid', description: 'Email delivery and marketing', category: 'Communication', icon: 'Mail' },
  { id: 'mailgun', name: 'Mailgun', description: 'Email service for developers', category: 'Communication', icon: 'Mail' },
  { id: 'mailjet', name: 'Mailjet', description: 'Email marketing and delivery', category: 'Communication', icon: 'Mail' },
  { id: 'mandrill', name: 'Mandrill', description: 'Transactional email service', category: 'Communication', icon: 'Mail' },
  { id: 'messagebird', name: 'MessageBird', description: 'SMS and voice messaging', category: 'Communication', icon: 'Phone' },
  { id: 'mocean', name: 'Mocean', description: 'SMS and voice API', category: 'Communication', icon: 'Phone' },
  { id: 'msg91', name: 'MSG91', description: 'Bulk SMS service', category: 'Communication', icon: 'Phone' },
  { id: 'vonage', name: 'Vonage', description: 'Communication APIs', category: 'Communication', icon: 'Phone' },
  { id: 'webex', name: 'Webex by Cisco', description: 'Video conferencing platform', category: 'Communication', icon: 'Video' },
  { id: 'twist', name: 'Twist', description: 'Team communication tool', category: 'Communication', icon: 'MessageSquare' },
  { id: 'zulip', name: 'Zulip', description: 'Team chat platform', category: 'Communication', icon: 'MessageSquare' },
  { id: 'mattermost', name: 'Mattermost', description: 'Open source team collaboration', category: 'Communication', icon: 'MessageSquare' },
  { id: 'rocket-chat', name: 'Rocket.Chat', description: 'Open source team chat', category: 'Communication', icon: 'MessageSquare' },
  { id: 'matrix', name: 'Matrix', description: 'Decentralized communication protocol', category: 'Communication', icon: 'MessageSquare' },

  // Marketing & Email Marketing
  { id: 'action-network', name: 'Action Network', description: 'Advocacy campaign management', category: 'Marketing', icon: 'Users' },
  { id: 'activecampaign', name: 'ActiveCampaign', description: 'Email marketing and automation', category: 'Marketing', icon: 'Mail' },
  { id: 'automizy', name: 'Automizy', description: 'Email marketing automation', category: 'Marketing', icon: 'Mail' },
  { id: 'autopilot', name: 'Autopilot', description: 'Marketing automation platform', category: 'Marketing', icon: 'Bot' },
  { id: 'brevo', name: 'Brevo', description: 'Email marketing and CRM', category: 'Marketing', icon: 'Mail' },
  { id: 'convertkit', name: 'ConvertKit', description: 'Email marketing for creators', category: 'Marketing', icon: 'Mail' },
  { id: 'customer-io', name: 'Customer.io', description: 'Customer messaging platform', category: 'Marketing', icon: 'Users' },
  { id: 'emelia', name: 'Emelia', description: 'Email outreach automation', category: 'Marketing', icon: 'Mail' },
  { id: 'getresponse', name: 'GetResponse', description: 'Email marketing platform', category: 'Marketing', icon: 'Mail' },
  { id: 'lemlist', name: 'Lemlist', description: 'Cold email outreach', category: 'Marketing', icon: 'Mail' },
  { id: 'mailchimp', name: 'Mailchimp', description: 'Email marketing and automation', category: 'Marketing', icon: 'Mail' },
  { id: 'mailerlite', name: 'MailerLite', description: 'Email marketing platform', category: 'Marketing', icon: 'Mail' },
  { id: 'mautic', name: 'Mautic', description: 'Open source marketing automation', category: 'Marketing', icon: 'Bot' },
  { id: 'sendy', name: 'Sendy', description: 'Self-hosted email marketing', category: 'Marketing', icon: 'Mail' },
  { id: 'vero', name: 'Vero', description: 'Customer messaging platform', category: 'Marketing', icon: 'Users' },
  { id: 'e-goi', name: 'E-goi', description: 'Multichannel marketing platform', category: 'Marketing', icon: 'Mail' },
  { id: 'iterable', name: 'Iterable', description: 'Cross-channel marketing platform', category: 'Marketing', icon: 'Users' },
  { id: 'klaviyo', name: 'Klaviyo', description: 'Email marketing and SMS', category: 'Marketing', icon: 'Mail' },
  
  // CRM & Sales
  { id: 'affinity', name: 'Affinity', description: 'Relationship intelligence CRM', category: 'CRM', icon: 'Database' },
  { id: 'agile-crm', name: 'Agile CRM', description: 'All-in-one CRM platform', category: 'CRM', icon: 'Database' },
  { id: 'copper', name: 'Copper', description: 'CRM for Google Workspace', category: 'CRM', icon: 'Database' },
  { id: 'freshworks-crm', name: 'Freshworks CRM', description: 'Modern CRM platform', category: 'CRM', icon: 'Database' },
  { id: 'hubspot', name: 'HubSpot', description: 'CRM and marketing platform', category: 'CRM', icon: 'Database' },
  { id: 'keap', name: 'Keap', description: 'CRM and marketing automation', category: 'CRM', icon: 'Database' },
  { id: 'monica-crm', name: 'Monica CRM', description: 'Personal relationship manager', category: 'CRM', icon: 'Database' },
  { id: 'odoo', name: 'Odoo', description: 'Business management software', category: 'CRM', icon: 'Database' },
  { id: 'pipedrive', name: 'Pipedrive', description: 'Sales CRM platform', category: 'CRM', icon: 'Database' },
  { id: 'salesforce', name: 'Salesforce', description: 'Customer relationship management', category: 'CRM', icon: 'Database' },
  { id: 'salesmate', name: 'Salesmate', description: 'Sales CRM and pipeline management', category: 'CRM', icon: 'Database' },
  { id: 'zoho-crm', name: 'Zoho CRM', description: 'Cloud-based CRM platform', category: 'CRM', icon: 'Database' },

  // Project Management & Productivity
  { id: 'asana', name: 'Asana', description: 'Project management platform', category: 'Project Management', icon: 'CheckCircle' },
  { id: 'clickup', name: 'ClickUp', description: 'All-in-one productivity platform', category: 'Project Management', icon: 'CheckCircle' },
  { id: 'jira-software', name: 'Jira Software', description: 'Issue and project tracking', category: 'Project Management', icon: 'Bug' },
  { id: 'kitemaker', name: 'Kitemaker', description: 'Product development platform', category: 'Project Management', icon: 'CheckCircle' },
  { id: 'linear', name: 'Linear', description: 'Issue tracking for software teams', category: 'Project Management', icon: 'CheckCircle' },
  { id: 'monday-com', name: 'monday.com', description: 'Work management platform', category: 'Project Management', icon: 'CheckCircle' },
  { id: 'taiga', name: 'Taiga', description: 'Open source project management', category: 'Project Management', icon: 'CheckCircle' },
  { id: 'trello', name: 'Trello', description: 'Visual project management', category: 'Project Management', icon: 'Trello' },
  { id: 'twake', name: 'Twake', description: 'Team collaboration platform', category: 'Project Management', icon: 'CheckCircle' },
  { id: 'clockify', name: 'Clockify', description: 'Time tracking and productivity', category: 'Productivity', icon: 'Clock' },
  { id: 'harvest', name: 'Harvest', description: 'Time tracking and invoicing', category: 'Productivity', icon: 'Clock' },
  { id: 'toggl', name: 'Toggl', description: 'Time tracking tool', category: 'Productivity', icon: 'Clock' },
  { id: 'todoist', name: 'Todoist', description: 'Task management and to-do lists', category: 'Productivity', icon: 'CheckCircle' },
  { id: 'microsoft-to-do', name: 'Microsoft To Do', description: 'Task management app', category: 'Productivity', icon: 'CheckCircle' },
  { id: 'google-tasks', name: 'Google Tasks', description: 'Task management integration', category: 'Productivity', icon: 'CheckCircle' },
  { id: 'notion', name: 'Notion', description: 'All-in-one workspace', category: 'Productivity', icon: 'FileText' },

  // Database & Storage
  { id: 'airtable', name: 'Airtable', description: 'Database and spreadsheet hybrid', category: 'Database', icon: 'Database' },
  { id: 'baserow', name: 'Baserow', description: 'Open source Airtable alternative', category: 'Database', icon: 'Database' },
  { id: 'coda', name: 'Coda', description: 'All-in-one doc with database', category: 'Database', icon: 'Database' },
  { id: 'cratedb', name: 'CrateDB', description: 'Distributed SQL database', category: 'Database', icon: 'Database' },
  { id: 'mongodb', name: 'MongoDB', description: 'NoSQL document database', category: 'Database', icon: 'Database' },
  { id: 'mysql', name: 'MySQL', description: 'Relational database management', category: 'Database', icon: 'Database' },
  { id: 'nocodb', name: 'NocoDB', description: 'Open source Airtable alternative', category: 'Database', icon: 'Database' },
  { id: 'postgres', name: 'Postgres', description: 'Advanced open source database', category: 'Database', icon: 'Database' },
  { id: 'questdb', name: 'QuestDB', description: 'Time series database', category: 'Database', icon: 'Database' },
  { id: 'quick-base', name: 'Quick Base', description: 'Low-code database platform', category: 'Database', icon: 'Database' },
  { id: 'redis', name: 'Redis', description: 'In-memory data structure store', category: 'Database', icon: 'Database' },
  { id: 'seatable', name: 'SeaTable', description: 'Collaborative database', category: 'Database', icon: 'Database' },
  { id: 'stackby', name: 'Stackby', description: 'Database and automation platform', category: 'Database', icon: 'Database' },
  { id: 'supabase', name: 'Supabase', description: 'Open source Firebase alternative', category: 'Database', icon: 'Database' },
  { id: 'timescaledb', name: 'TimescaleDB', description: 'Time series database', category: 'Database', icon: 'Database' },
  { id: 'aws-dynamodb', name: 'AWS DynamoDB', description: 'NoSQL database service', category: 'Database', icon: 'Database' },
  { id: 'azure-cosmos-db', name: 'Azure Cosmos DB', description: 'Multi-model database service', category: 'Database', icon: 'Database' },
  { id: 'microsoft-sql', name: 'Microsoft SQL', description: 'Relational database management', category: 'Database', icon: 'Database' },
  { id: 'snowflake', name: 'Snowflake', description: 'Cloud data platform', category: 'Database', icon: 'Database' },

  // Cloud & AWS Services
  { id: 'aws-certificate-manager', name: 'AWS Certificate Manager', description: 'SSL/TLS certificate management', category: 'Cloud', icon: 'Shield' },
  { id: 'aws-cognito', name: 'AWS Cognito', description: 'User authentication service', category: 'Cloud', icon: 'Users' },
  { id: 'aws-comprehend', name: 'AWS Comprehend', description: 'Natural language processing', category: 'Cloud', icon: 'Bot' },
  { id: 'aws-elastic-load-balancing', name: 'AWS Elastic Load Balancing', description: 'Load balancing service', category: 'Cloud', icon: 'Server' },
  { id: 'aws-iam', name: 'AWS IAM', description: 'Identity and access management', category: 'Cloud', icon: 'Lock' },
  { id: 'aws-lambda', name: 'AWS Lambda', description: 'Serverless computing', category: 'Cloud', icon: 'Zap' },
  { id: 'aws-rekognition', name: 'AWS Rekognition', description: 'Image and video analysis', category: 'Cloud', icon: 'Image' },
  { id: 'aws-s3', name: 'AWS S3', description: 'Object storage service', category: 'Cloud', icon: 'Folder' },
  { id: 'aws-ses', name: 'AWS SES', description: 'Email sending service', category: 'Cloud', icon: 'Mail' },
  { id: 'aws-sns', name: 'AWS SNS', description: 'Push notification service', category: 'Cloud', icon: 'Bell' },
  { id: 'aws-sqs', name: 'AWS SQS', description: 'Message queuing service', category: 'Cloud', icon: 'MessageSquare' },
  { id: 'aws-textract', name: 'AWS Textract', description: 'Document text extraction', category: 'Cloud', icon: 'FileText' },
  { id: 'aws-transcribe', name: 'AWS Transcribe', description: 'Speech-to-text service', category: 'Cloud', icon: 'Mic' },
  { id: 'azure-storage', name: 'Azure Storage', description: 'Cloud storage service', category: 'Cloud', icon: 'Folder' },
  { id: 'cloudflare', name: 'Cloudflare', description: 'CDN and security services', category: 'Cloud', icon: 'Shield' },
  { id: 'netlify', name: 'Netlify', description: 'Web development platform', category: 'Cloud', icon: 'Globe' },

  // AI & Machine Learning
  { id: 'anthropic', name: 'Anthropic', description: 'AI research and safety', category: 'AI', icon: 'Bot' },
  { id: 'jina-ai', name: 'Jina AI', description: 'Neural search framework', category: 'AI', icon: 'Bot' },
  { id: 'mistral-ai', name: 'Mistral AI', description: 'Large language models', category: 'AI', icon: 'Bot' },
  { id: 'openai', name: 'OpenAI', description: 'Artificial intelligence research', category: 'AI', icon: 'Bot' },
  { id: 'perplexity', name: 'Perplexity', description: 'AI-powered search engine', category: 'AI', icon: 'Search' },
  { id: 'google-gemini', name: 'Google Gemini', description: 'AI assistant and model', category: 'AI', icon: 'Bot' },
  { id: 'google-perspective', name: 'Google Perspective', description: 'Toxicity analysis API', category: 'AI', icon: 'Bot' },
  { id: 'google-cloud-natural-language', name: 'Google Cloud Natural Language', description: 'Natural language processing', category: 'AI', icon: 'Bot' },
  { id: 'deepl', name: 'DeepL', description: 'AI-powered translation', category: 'AI', icon: 'Languages' },
  { id: 'lingvanex', name: 'LingvaNex', description: 'Translation and localization', category: 'AI', icon: 'Languages' },
  { id: 'google-translate', name: 'Google Translate', description: 'Machine translation service', category: 'AI', icon: 'Languages' },
  { id: 'mindee', name: 'Mindee', description: 'Document parsing AI', category: 'AI', icon: 'FileText' },
  
  // E-commerce & Payments
  { id: 'shopify', name: 'Shopify', description: 'E-commerce platform', category: 'E-commerce', icon: 'ShoppingCart' },
  { id: 'woocommerce', name: 'WooCommerce', description: 'WordPress e-commerce plugin', category: 'E-commerce', icon: 'ShoppingCart' },
  { id: 'magento-2', name: 'Magento 2', description: 'E-commerce platform', category: 'E-commerce', icon: 'ShoppingCart' },
  { id: 'stripe', name: 'Stripe', description: 'Payment processing platform', category: 'Finance', icon: 'CreditCard' },
  { id: 'paypal', name: 'PayPal', description: 'Online payment system', category: 'Finance', icon: 'CreditCard' },
  { id: 'chargebee', name: 'Chargebee', description: 'Subscription billing platform', category: 'Finance', icon: 'CreditCard' },
  { id: 'paddle', name: 'Paddle', description: 'Payment processing for SaaS', category: 'Finance', icon: 'CreditCard' },
  { id: 'wise', name: 'Wise', description: 'International money transfers', category: 'Finance', icon: 'CreditCard' },
  { id: 'xero', name: 'Xero', description: 'Cloud accounting software', category: 'Finance', icon: 'Calculator' },
  { id: 'quickbooks-online', name: 'QuickBooks Online', description: 'Cloud accounting platform', category: 'Finance', icon: 'Calculator' },
  { id: 'invoice-ninja', name: 'Invoice Ninja', description: 'Invoice and time tracking', category: 'Finance', icon: 'FileText' },
  { id: 'profitwell', name: 'ProfitWell', description: 'Subscription analytics', category: 'Finance', icon: 'BarChart3' },

  // Development & DevOps
  { id: 'github', name: 'GitHub', description: 'Code repository and collaboration', category: 'Development', icon: 'GitBranch' },
  { id: 'gitlab', name: 'GitLab', description: 'DevOps platform', category: 'Development', icon: 'GitBranch' },
  { id: 'bitbucket', name: 'Bitbucket', description: 'Git code hosting', category: 'Development', icon: 'GitBranch' },
  { id: 'circleci', name: 'CircleCI', description: 'Continuous integration platform', category: 'Development', icon: 'RefreshCw' },
  { id: 'jenkins', name: 'Jenkins', description: 'Automation server', category: 'Development', icon: 'Server' },
  { id: 'travis-ci', name: 'Travis CI', description: 'Continuous integration service', category: 'Development', icon: 'RefreshCw' },
  { id: 'npm', name: 'npm', description: 'Package manager for JavaScript', category: 'Development', icon: 'Package' },
  { id: 'adalo', name: 'Adalo', description: 'No-code app builder', category: 'Development', icon: 'Smartphone' },
  { id: 'bubble', name: 'Bubble', description: 'No-code web app builder', category: 'Development', icon: 'Globe' },
  { id: 'webflow', name: 'Webflow', description: 'Web design and development platform', category: 'Web Development', icon: 'Globe' },
  { id: 'storyblok', name: 'Storyblok', description: 'Headless CMS platform', category: 'Web Development', icon: 'FileText' },
  { id: 'strapi', name: 'Strapi', description: 'Open source headless CMS', category: 'Web Development', icon: 'FileText' },
  { id: 'wordpress', name: 'WordPress', description: 'Content management system', category: 'Web Development', icon: 'Globe' },
  { id: 'cockpit', name: 'Cockpit', description: 'Headless CMS', category: 'Web Development', icon: 'FileText' },
  { id: 'contentful', description: 'Content management platform', category: 'Web Development', icon: 'FileText' },

  // Social Media & Content
  { id: 'x-twitter', name: 'X (Formerly Twitter)', description: 'Social media platform', category: 'Social Media', icon: 'Twitter' },
  { id: 'linkedin', name: 'LinkedIn', description: 'Professional networking platform', category: 'Social Media', icon: 'Linkedin' },
  { id: 'facebook-graph-api', name: 'Facebook Graph API', description: 'Facebook platform integration', category: 'Social Media', icon: 'Share2' },
  { id: 'reddit', name: 'Reddit', description: 'Social news and discussion', category: 'Social Media', icon: 'Share2' },
  { id: 'youtube', name: 'YouTube', description: 'Video sharing platform', category: 'Social Media', icon: 'Video' },
  { id: 'medium', name: 'Medium', description: 'Online publishing platform', category: 'Social Media', icon: 'FileText' },
  { id: 'spotify', name: 'Spotify', description: 'Music streaming platform', category: 'Social Media', icon: 'Music' },
  { id: 'instagram', name: 'Instagram', description: 'Photo and video sharing', category: 'Social Media', icon: 'Image' },
  { id: 'tiktok', name: 'TikTok', description: 'Short-form video platform', category: 'Social Media', icon: 'Video' },
  { id: 'pinterest', name: 'Pinterest', description: 'Visual discovery platform', category: 'Social Media', icon: 'Image' },
  { id: 'snapchat', name: 'Snapchat', description: 'Multimedia messaging app', category: 'Social Media', icon: 'Smartphone' },
  
  // Support & Help Desk
  { id: 'zendesk', name: 'Zendesk', description: 'Customer service platform', category: 'Support', icon: 'HelpCircle' },
  { id: 'intercom', name: 'Intercom', description: 'Customer messaging platform', category: 'Support', icon: 'MessageSquare' },
  { id: 'help-scout', name: 'Help Scout', description: 'Customer support platform', category: 'Support', icon: 'HelpCircle' },
  { id: 'freshdesk', name: 'Freshdesk', description: 'Customer support software', category: 'Support', icon: 'HelpCircle' },
  { id: 'freshservice', name: 'Freshservice', description: 'IT service management', category: 'Support', icon: 'HelpCircle' },
  { id: 'zammad', name: 'Zammad', description: 'Open source help desk', category: 'Support', icon: 'HelpCircle' },
  { id: 'drift', name: 'Drift', description: 'Conversational marketing platform', category: 'Support', icon: 'MessageSquare' },

  // Analytics & Business Intelligence
  { id: 'google-analytics', name: 'Google Analytics', description: 'Web analytics service', category: 'Analytics', icon: 'BarChart3' },
  { id: 'google-bigquery', name: 'Google BigQuery', description: 'Data warehouse', category: 'Analytics', icon: 'Database' },
  { id: 'metabase', name: 'Metabase', description: 'Business intelligence platform', category: 'Analytics', icon: 'BarChart3' },
  { id: 'grafana', name: 'Grafana', description: 'Analytics and monitoring platform', category: 'Analytics', icon: 'BarChart3' },
  { id: 'posthog', name: 'PostHog', description: 'Product analytics platform', category: 'Analytics', icon: 'BarChart3' },
  { id: 'segment', name: 'Segment', description: 'Customer data platform', category: 'Analytics', icon: 'Users' },
  { id: 'splunk', name: 'Splunk', description: 'Data analytics platform', category: 'Analytics', icon: 'BarChart3' },
  { id: 'lonescale', name: 'LoneScale', description: 'Scaling analytics', category: 'Analytics', icon: 'TrendingUp' },
  { id: 'marketstack', name: 'marketstack', description: 'Real-time stock data API', category: 'Analytics', icon: 'BarChart3' },
  { id: 'coingecko', name: 'CoinGecko', description: 'Cryptocurrency data', category: 'Analytics', icon: 'BarChart3' },
  { id: 'hacker-news', name: 'Hacker News', description: 'Tech news and discussion', category: 'Analytics', icon: 'Share2' },

  // File Storage & Management
  { id: 'google-drive', name: 'Google Drive', description: 'Cloud storage and file sharing', category: 'Storage', icon: 'Folder' },
  { id: 'microsoft-onedrive', name: 'Microsoft OneDrive', description: 'Cloud storage service', category: 'Storage', icon: 'Folder' },
  { id: 'dropbox', name: 'Dropbox', description: 'File hosting service', category: 'Storage', icon: 'Folder' },
  { id: 'box', name: 'Box', description: 'Cloud content management', category: 'Storage', icon: 'Folder' },
  { id: 'nextcloud', name: 'Nextcloud', description: 'Self-hosted file sharing', category: 'Storage', icon: 'Folder' },
  { id: 'aws-s3', name: 'AWS S3', description: 'Object storage service', category: 'Storage', icon: 'Folder' },
  { id: 'google-cloud-storage', name: 'Google Cloud Storage', description: 'Object storage service', category: 'Storage', icon: 'Folder' },
  { id: 'azure-storage', name: 'Azure Storage', description: 'Cloud storage service', category: 'Storage', icon: 'Folder' },

  // Calendar & Scheduling
  { id: 'google-calendar', name: 'Google Calendar', description: 'Calendar and scheduling', category: 'Scheduling', icon: 'Calendar' },
  { id: 'microsoft-outlook-calendar', name: 'Microsoft Outlook Calendar', description: 'Calendar management', category: 'Scheduling', icon: 'Calendar' },
  { id: 'calendly', name: 'Calendly', description: 'Scheduling automation', category: 'Scheduling', icon: 'Calendar' },
  { id: 'acuity-scheduling', name: 'Acuity Scheduling', description: 'Online appointment scheduling', category: 'Scheduling', icon: 'Calendar' },
  { id: 'cal', name: 'Cal', description: 'Calendar integration', category: 'Scheduling', icon: 'Calendar' },
  { id: 'gotowebinar', name: 'GoToWebinar', description: 'Webinar platform', category: 'Scheduling', icon: 'Video' },
  { id: 'demio', name: 'Demio', description: 'Webinar and video platform', category: 'Scheduling', icon: 'Video' },

  // Forms & Surveys
  { id: 'typeform', name: 'Typeform', description: 'Online form builder', category: 'Forms', icon: 'FileText' },
  { id: 'jotform', name: 'JotForm', description: 'Online form builder', category: 'Forms', icon: 'FileText' },
  { id: 'wufoo', name: 'Wufoo', description: 'Online form builder', category: 'Forms', icon: 'FileText' },
  { id: 'surveymonkey', name: 'SurveyMonkey', description: 'Survey platform', category: 'Forms', icon: 'FileText' },
  { id: 'kobotoolbox', name: 'KoboToolbox', description: 'Data collection platform', category: 'Forms', icon: 'FileText' },
  { id: 'form-io', name: 'Form.io', description: 'Form builder and API', category: 'Forms', icon: 'FileText' },
  { id: 'formstack', name: 'Formstack', description: 'Form builder platform', category: 'Forms', icon: 'FileText' },

  // Messaging & Queues
  { id: 'amqp-sender', name: 'AMQP Sender', description: 'Advanced Message Queuing Protocol', category: 'Messaging', icon: 'MessageSquare' },
  { id: 'kafka', name: 'Kafka', description: 'Distributed streaming platform', category: 'Messaging', icon: 'MessageSquare' },
  { id: 'rabbitmq', name: 'RabbitMQ', description: 'Message broker', category: 'Messaging', icon: 'MessageSquare' },
  { id: 'mqtt', name: 'MQTT', description: 'IoT messaging protocol', category: 'Messaging', icon: 'Wifi' },
  { id: 'aws-sqs', name: 'AWS SQS', description: 'Message queuing service', category: 'Messaging', icon: 'MessageSquare' },

  // Security & Compliance
  { id: 'elastic-security', name: 'Elastic Security', description: 'Security information and event management', category: 'Security', icon: 'Shield' },
  { id: 'microsoft-graph-security', name: 'Microsoft Graph Security', description: 'Security integration', category: 'Security', icon: 'Shield' },
  { id: 'thehive', name: 'TheHive', description: 'Security incident response platform', category: 'Security', icon: 'Shield' },
  { id: 'thehive-5', name: 'TheHive 5', description: 'Security incident response platform', category: 'Security', icon: 'Shield' },
  { id: 'misp', name: 'MISP', description: 'Threat intelligence platform', category: 'Security', icon: 'Shield' },
  { id: 'securityscorecard', name: 'SecurityScorecard', description: 'Security ratings platform', category: 'Security', icon: 'Shield' },
  { id: 'venafi-tls-protect-cloud', name: 'Venafi TLS Protect Cloud', description: 'Certificate management', category: 'Security', icon: 'Shield' },
  { id: 'venafi-tls-protect-datacenter', name: 'Venafi TLS Protect Datacenter', description: 'Certificate management', category: 'Security', icon: 'Shield' },
  { id: 'signl4', name: 'SIGNL4', description: 'Alert management platform', category: 'Security', icon: 'Bell' },

  // IoT & Smart Home
  { id: 'home-assistant', name: 'Home Assistant', description: 'Open source home automation', category: 'IoT', icon: 'Home' },
  { id: 'philips-hue', name: 'Philips Hue', description: 'Smart lighting system', category: 'IoT', icon: 'Lightbulb' },

  // Fitness & Health
  { id: 'strava', name: 'Strava', description: 'Fitness tracking platform', category: 'Fitness', icon: 'Activity' },
  { id: 'oura', name: 'Oura', description: 'Sleep and activity tracking', category: 'Fitness', icon: 'Activity' },

  // Business & Professional Services
  { id: 'google-business-profile', name: 'Google Business Profile', description: 'Business listing management', category: 'Business', icon: 'MapPin' },
  { id: 'bamboo-hr', name: 'BambooHR', description: 'HR management software', category: 'HR', icon: 'Users' },
  { id: 'workable', name: 'Workable', description: 'Recruitment software', category: 'HR', icon: 'Users' },
  { id: 'highlevel', name: 'HighLevel', description: 'Business management platform', category: 'Business', icon: 'Building' },
  { id: 'syncromsp', name: 'SyncroMSP', description: 'Managed service provider platform', category: 'Business', icon: 'Server' },
  { id: 'halopsa', name: 'HaloPSA', description: 'Professional services automation', category: 'Business', icon: 'Settings' },
  { id: 'unleashed-software', name: 'Unleashed Software', description: 'Inventory management', category: 'Business', icon: 'Package' },

  // Logistics & Delivery
  { id: 'dhl', name: 'DHL', description: 'International shipping', category: 'Logistics', icon: 'Truck' },
  { id: 'onfleet', name: 'Onfleet', description: 'Delivery management platform', category: 'Logistics', icon: 'Truck' },

  // Events & Entertainment
  { id: 'eventbrite', name: 'Eventbrite', description: 'Event management platform', category: 'Events', icon: 'Calendar' },
  { id: 'gong', name: 'Gong', description: 'Revenue intelligence platform', category: 'Business', icon: 'Mic' },

  // Community & Social
  { id: 'crowd-dev', name: 'crowd.dev', description: 'Community management platform', category: 'Community', icon: 'Users' },
  { id: 'disqus', name: 'Disqus', description: 'Comment system', category: 'Community', icon: 'MessageSquare' },
  { id: 'discourse', name: 'Discourse', description: 'Discussion platform', category: 'Community', icon: 'MessageSquare' },

  // Utilities & Tools
  { id: 'bitly', name: 'Bitly', description: 'URL shortening service', category: 'Utilities', icon: 'Link' },
  { id: 'yourls', name: 'Yourls', description: 'URL shortener', category: 'Utilities', icon: 'Link' },
  { id: 'bitwarden', name: 'Bitwarden', description: 'Password manager', category: 'Utilities', icon: 'Lock' },
  { id: 'gotify', name: 'Gotify', description: 'Push notification service', category: 'Notifications', icon: 'Bell' },
  { id: 'pushbullet', name: 'Pushbullet', description: 'Device synchronization', category: 'Notifications', icon: 'Bell' },
  { id: 'pushcut', name: 'Pushcut', description: 'iOS automation', category: 'Notifications', icon: 'Bell' },
  { id: 'pushover', name: 'Pushover', description: 'Push notification service', category: 'Notifications', icon: 'Bell' },
  { id: 'spontit', name: 'Spontit', description: 'Push notification service', category: 'Notifications', icon: 'Bell' },
  { id: 'uptimerobot', name: 'UptimeRobot', description: 'Website monitoring', category: 'Monitoring', icon: 'Activity' },
  { id: 'urlscan-io', name: 'urlscan.io', description: 'URL scanner', category: 'Security', icon: 'Search' },
  { id: 'peekalink', name: 'Peekalink', description: 'Link preview service', category: 'Utilities', icon: 'Link' },
  { id: 'phantom-buster', name: 'PhantomBuster', description: 'Web scraping automation', category: 'Automation', icon: 'Bot' },
  { id: 'airtop', name: 'Airtop', description: 'Browser automation', category: 'Automation', icon: 'Globe' },
  { id: 'flow', name: 'Flow', description: 'Workflow automation', category: 'Automation', icon: 'Workflow' },
  { id: 'rundeck', name: 'Rundeck', description: 'Job scheduler and runbook automation', category: 'Automation', icon: 'Settings' },
  { id: 'wekan', name: 'Wekan', description: 'Kanban board', category: 'Project Management', icon: 'CheckCircle' },
  { id: 'grist', name: 'Grist', description: 'Spreadsheet database', category: 'Database', icon: 'Database' },
  { id: 'quickchart', name: 'QuickChart', description: 'Chart generation service', category: 'Analytics', icon: 'BarChart3' },
  { id: 'bannerbear', name: 'Bannerbear', description: 'Image generation API', category: 'Media', icon: 'Image' },
  { id: 'brandfetch', name: 'Brandfetch', description: 'Brand asset management', category: 'Media', icon: 'Image' },
  { id: 'clearbit', name: 'Clearbit', description: 'Business intelligence API', category: 'Analytics', icon: 'Users' },
  { id: 'dropcontact', name: 'Dropcontact', description: 'Email finder service', category: 'Marketing', icon: 'Mail' },
  { id: 'hunter', name: 'Hunter', description: 'Email finder and verifier', category: 'Marketing', icon: 'Mail' },
  { id: 'uplead', name: 'UpLead', description: 'B2B lead generation', category: 'Marketing', icon: 'Users' },
  { id: 'humantic-ai', name: 'Humantic AI', description: 'Personality AI', category: 'AI', icon: 'Users' },
  { id: 'beeminder', name: 'Beeminder', description: 'Goal tracking app', category: 'Productivity', icon: 'Target' },
  { id: 'raindrop', name: 'Raindrop', description: 'Bookmark manager', category: 'Productivity', icon: 'Bookmark' },
  { id: 'line', name: 'Line', description: 'Messaging platform', category: 'Communication', icon: 'MessageSquare' },
  { id: 'seven', name: 'seven', description: 'SMS API service', category: 'Communication', icon: 'Phone' },
  { id: 'servicenow', name: 'ServiceNow', description: 'IT service management', category: 'Business', icon: 'Settings' },
  { id: 'sentry-io', name: 'Sentry.io', description: 'Error monitoring platform', category: 'Development', icon: 'Bug' },
  { id: 'postbin', name: 'PostBin', description: 'HTTP request bin', category: 'Development', icon: 'Server' },
  { id: 'postmark', name: 'Postmark', description: 'Transactional email service', category: 'Communication', icon: 'Mail' },
  { id: 'tapfiliate', name: 'Tapfiliate', description: 'Affiliate marketing platform', category: 'Marketing', icon: 'Users' },
  { id: 'erpnext', name: 'ERPNext', description: 'Open source ERP', category: 'Business', icon: 'Building' },
  { id: 'cortex', name: 'Cortex', description: 'Developer productivity platform', category: 'Development', icon: 'Code' },
  { id: 'uproc', name: 'uProc', description: 'Process automation', category: 'Automation', icon: 'Workflow' }
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
