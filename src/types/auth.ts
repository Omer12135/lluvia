export interface PricingPlan {
  id: string;
  name: string;
  price: number;
  features: {
    automations: string;
    triggers: string[];
    aiChatbot: boolean;
    aiMessages?: number;
    webhook: boolean;
    apps: number | string;
    support: string;
    templates: boolean;
    analytics: boolean;
    teamManagement?: boolean;
    customIntegrations?: boolean;
    onboarding?: boolean;
    sla?: boolean;
    bulkOperations?: boolean;
  };
}