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

  const exampleAutomations: ExampleAutomation[] = [
    {
      id: 'email-welcome',
      name: 'Welcome Email Sequence',
      description: 'Send a series of welcome emails to new subscribers',
      trigger: 'New subscriber',
      actions: ['Send welcome email', 'Add to CRM', 'Schedule follow-up'],
      category: 'Marketing',
      difficulty: 'Beginner',
      estimatedTime: '10 minutes'
    },
    {
      id: 'lead-scoring',
      name: 'Lead Scoring System',
      description: 'Automatically score leads based on their actions',
      trigger: 'Website activity',
      actions: ['Calculate score', 'Update CRM', 'Notify sales team'],
      category: 'Sales',
      difficulty: 'Intermediate',
      estimatedTime: '20 minutes'
    },
    {
      id: 'social-posting',
      name: 'Social Media Scheduler',
      description: 'Schedule and post content across multiple platforms',
      trigger: 'Content approval',
      actions: ['Post to Twitter', 'Post to LinkedIn', 'Update analytics'],
      category: 'Marketing',
      difficulty: 'Beginner',
      estimatedTime: '15 minutes'
    }
  ];

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

  const value: AutomationContextType = {
    automations,
    exampleAutomations,
    currentResult,
    isLoading,
    addAutomation,
    updateAutomationStatus,
    deleteAutomation,
    setCurrentResult,
    setIsLoading
  };

  return (
    <AutomationContext.Provider value={value}>
      {children}
    </AutomationContext.Provider>
  );
};