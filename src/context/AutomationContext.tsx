import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Automation {
  id: string;
  name: string;
  description: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  userId: string;
  createdAt: Date;
  duration?: number;
  result?: any;
}

export interface ExampleAutomation {
  id: string;
  name: string;
  description: string;
  trigger: string;
  actions: string[];
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedTime: string;
  steps: string[];
  useCase: string;
  popularity: number;
  icon: string;
}

interface AutomationContextType {
  automations: Automation[];
  exampleAutomations: ExampleAutomation[];
  currentResult: any;
  isLoading: boolean;
  addAutomation: (automation: Omit<Automation, 'id' | 'createdAt'>) => void;
  updateAutomationStatus: (id: string, status: Automation['status']) => void;
  deleteAutomation: (id: string) => void;
  setCurrentResult: (result: any) => void;
  setIsLoading: (loading: boolean) => void;
  addExampleAutomation: (example: Omit<ExampleAutomation, 'id'>) => void;
  updateExampleAutomation: (id: string, example: Partial<ExampleAutomation>) => void;
  deleteExampleAutomation: (id: string) => void;
}

const AutomationContext = createContext<AutomationContextType | undefined>(undefined);

export const useAutomation = () => {
  const context = useContext(AutomationContext);
  if (context === undefined) {
    throw new Error('useAutomation must be used within an AutomationProvider');
  }
  return context;
};

interface AutomationProviderProps {
  children: ReactNode;
}

export const AutomationProvider: React.FC<AutomationProviderProps> = ({ children }) => {
  const [automations, setAutomations] = useState<Automation[]>([]);
  const [currentResult, setCurrentResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [exampleAutomations, setExampleAutomations] = useState<ExampleAutomation[]>([
    {
      id: 'gmail-to-slack',
      name: 'Gmail to Slack Notification',
      description: 'Get notified in Slack when important emails arrive in Gmail',
      trigger: 'Gmail Trigger',
      actions: ['Slack Message', 'Google Sheets Update'],
      category: 'Communication',
      difficulty: 'Beginner',
      estimatedTime: '5 minutes',
      steps: [
        'Gmail receives new email with specific label',
        'Extract email content and sender info',
        'Send formatted message to Slack channel',
        'Log email details to Google Sheets'
      ],
      useCase: 'Perfect for customer support teams to get instant notifications about urgent emails and maintain a log for tracking.',
      popularity: 92,
      icon: 'Mail'
    },
    {
      id: 'stripe-to-airtable',
      name: 'Stripe Payment to Airtable',
      description: 'Automatically add new Stripe payments to Airtable database',
      trigger: 'Stripe Trigger',
      actions: ['Airtable Create Record', 'Gmail Send Email'],
      category: 'Finance',
      difficulty: 'Beginner',
      estimatedTime: '8 minutes',
      steps: [
        'Stripe receives successful payment',
        'Extract payment details and customer info',
        'Create new record in Airtable',
        'Send confirmation email to customer'
      ],
      useCase: 'Great for small businesses to automatically track payments and send personalized thank you emails to customers.',
      popularity: 88,
      icon: 'ShoppingCart'
    },
    {
      id: 'github-to-linear',
      name: 'GitHub Issues to Linear Tasks',
      description: 'Create Linear tasks automatically when new GitHub issues are opened',
      trigger: 'GitHub Trigger',
      actions: ['Linear Create Task', 'Slack Message'],
      category: 'Development',
      difficulty: 'Intermediate',
      estimatedTime: '12 minutes',
      steps: [
        'New issue created in GitHub repository',
        'Parse issue title, description, and labels',
        'Create corresponding task in Linear',
        'Notify development team in Slack'
      ],
      useCase: 'Streamline project management by automatically syncing GitHub issues with Linear for better task tracking.',
      popularity: 79,
      icon: 'FileText'
    },
    {
      id: 'form-to-crm',
      name: 'Contact Form to CRM',
      description: 'Add website form submissions directly to your CRM system',
      trigger: 'Webflow Trigger',
      actions: ['HubSpot Create Contact', 'Gmail Send Email', 'Slack Message'],
      category: 'Marketing',
      difficulty: 'Beginner',
      estimatedTime: '10 minutes',
      steps: [
        'User submits contact form on website',
        'Extract form data (name, email, message)',
        'Create new contact in HubSpot CRM',
        'Send welcome email to prospect',
        'Notify sales team in Slack'
      ],
      useCase: 'Convert website visitors into CRM leads automatically and ensure immediate follow-up by sales team.',
      popularity: 85,
      icon: 'Users'
    },
    {
      id: 'calendar-meeting-prep',
      name: 'Meeting Preparation Automation',
      description: 'Automatically prepare for meetings by gathering relevant information',
      trigger: 'Google Calendar Trigger',
      actions: ['Notion Create Page', 'Gmail Send Email', 'Slack Message'],
      category: 'Productivity',
      difficulty: 'Advanced',
      estimatedTime: '15 minutes',
      steps: [
        'Meeting scheduled in Google Calendar',
        'Extract attendee list and meeting details',
        'Create meeting prep page in Notion',
        'Send agenda email to all attendees',
        'Remind team in Slack 30 minutes before'
      ],
      useCase: 'Ensure all meetings are well-prepared with agendas and relevant information shared in advance.',
      popularity: 73,
      icon: 'Calendar'
    },
    {
      id: 'social-media-monitoring',
      name: 'Social Media Mention Alert',
      description: 'Get notified when your brand is mentioned on social media',
      trigger: 'Twitter Trigger',
      actions: ['Slack Message', 'Airtable Create Record', 'Gmail Send Email'],
      category: 'Marketing',
      difficulty: 'Intermediate',
      estimatedTime: '10 minutes',
      steps: [
        'Brand mention detected on Twitter',
        'Analyze sentiment and extract details',
        'Send alert to marketing team in Slack',
        'Log mention in Airtable database',
        'Email summary to marketing manager'
      ],
      useCase: 'Stay on top of brand mentions and respond quickly to customer feedback or potential PR issues.',
      popularity: 67,
      icon: 'MessageSquare'
    },
    {
      id: 'ecommerce-order-processing',
      name: 'E-commerce Order Processing',
      description: 'Streamline order fulfillment process automatically',
      trigger: 'Shopify Trigger',
      actions: ['Airtable Update', 'Gmail Send Email', 'Slack Message', 'Google Sheets Update'],
      category: 'E-commerce',
      difficulty: 'Advanced',
      estimatedTime: '20 minutes',
      steps: [
        'New order placed on Shopify store',
        'Update inventory in Airtable',
        'Send order confirmation to customer',
        'Notify fulfillment team in Slack',
        'Log order details in Google Sheets',
        'Schedule follow-up email sequence'
      ],
      useCase: 'Automate the entire order processing workflow from confirmation to fulfillment tracking.',
      popularity: 81,
      icon: 'ShoppingCart'
    },
    {
      id: 'customer-support-ticket',
      name: 'Support Ticket Management',
      description: 'Automatically categorize and assign support tickets',
      trigger: 'Zendesk Trigger',
      actions: ['Slack Message', 'Airtable Create Record', 'Gmail Send Email'],
      category: 'Support',
      difficulty: 'Intermediate',
      estimatedTime: '12 minutes',
      steps: [
        'New support ticket created in Zendesk',
        'Analyze ticket content and priority',
        'Assign to appropriate team member',
        'Notify team in dedicated Slack channel',
        'Create tracking record in Airtable',
        'Send acknowledgment email to customer'
      ],
      useCase: 'Improve response times by automatically routing tickets and keeping the team informed.',
      popularity: 76,
      icon: 'Users'
    }
  ]);

  const addAutomation = (automation: Omit<Automation, 'id' | 'createdAt'>) => {
    const newAutomation: Automation = {
      ...automation,
      id: Date.now().toString(),
      createdAt: new Date()
    };
    setAutomations(prev => [...prev, newAutomation]);
  };

  const updateAutomationStatus = (id: string, status: Automation['status']) => {
    setAutomations(prev =>
      prev.map(automation =>
        automation.id === id ? { ...automation, status } : automation
      )
    );
  };

  const deleteAutomation = (id: string) => {
    setAutomations(prev => prev.filter(automation => automation.id !== id));
  };

  const addExampleAutomation = (example: Omit<ExampleAutomation, 'id'>) => {
    const newExample: ExampleAutomation = {
      ...example,
      id: Date.now().toString()
    };
    setExampleAutomations(prev => [...prev, newExample]);
  };

  const updateExampleAutomation = (id: string, example: Partial<ExampleAutomation>) => {
    setExampleAutomations(prev =>
      prev.map(automation =>
        automation.id === id ? { ...automation, ...example } : automation
      )
    );
  };

  const deleteExampleAutomation = (id: string) => {
    setExampleAutomations(prev => prev.filter(example => example.id !== id));
  };

  const value: AutomationContextType = {
    automations,
    exampleAutomations,
    currentResult,
    isLoading,
    addAutomation,
    updateAutomationStatus,
    deleteAutomation,
    setCurrentResult,
    setIsLoading,
    addExampleAutomation,
    updateExampleAutomation,
    deleteExampleAutomation
  };

  return (
    <AutomationContext.Provider value={value}>
      {children}
    </AutomationContext.Provider>
  );
};