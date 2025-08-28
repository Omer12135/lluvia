import { supabase } from '../lib/supabase';

export interface AutomationWebhookData {
  automationName: string;
  automationDescription: string;
  trigger: string;
  actions: string[];
  platform: string;
  userId: string;
  userEmail?: string;
  userName?: string;
  status: string;
  createdAt: string;
  userPlan?: string;
  automationId?: string;
}

export const webhookService = {
  // Automation verilerini webhook'a gönder
  async sendAutomationData(data: AutomationWebhookData): Promise<boolean> {
    try {
      const response = await fetch('https://lluviaomer.app.n8n.cloud/webhook/lluvia', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          automationName: data.automationName,
          automationDescription: data.automationDescription,
          trigger: data.trigger,
          actions: data.actions,
          platform: data.platform,
          userId: data.userId,
          userEmail: data.userEmail,
          userName: data.userName,
          userPlan: data.userPlan,
          status: data.status,
          createdAt: data.createdAt,
          automationId: data.automationId,
          timestamp: new Date().toISOString(),
          source: 'automation-creator'
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Webhook response:', result);
      return true;
    } catch (error) {
      console.error('Error sending webhook:', error);
      return false;
    }
  },

  // Test webhook bağlantısı
  async testWebhook(): Promise<boolean> {
    try {
      const response = await fetch('https://lluviaomer.app.n8n.cloud/webhook/lluvia', {
        method: 'GET',
      });

      return response.ok;
    } catch (error) {
      console.error('Error testing webhook:', error);
      return false;
    }
  },

  // Test webhook veri gönderme
  async testWebhookWithData(): Promise<boolean> {
    try {
      const testData: AutomationWebhookData = {
        automationName: 'Test Automation',
        automationDescription: 'This is a test automation to verify webhook connectivity',
        trigger: 'Test Trigger',
        actions: ['Test Action 1', 'Test Action 2'],
        platform: 'n8n',
        userId: 'test-user-id',
        userEmail: 'test@example.com',
        userName: 'Test User',
        userPlan: 'pro',
        status: 'test',
        createdAt: new Date().toISOString(),
        automationId: 'test-automation-' + Date.now()
      };

      const response = await fetch('https://lluviaomer.app.n8n.cloud/webhook/lluvia', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...testData,
          timestamp: new Date().toISOString(),
          source: 'webhook-test',
          testMode: true
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Test webhook response:', result);
      return true;
    } catch (error) {
      console.error('Error testing webhook with data:', error);
      return false;
    }
  },

  // Webhook durumunu kontrol et
  async getWebhookStatus(): Promise<{ connected: boolean; lastTest?: string }> {
    try {
      const response = await fetch('https://lluviaomer.app.n8n.cloud/webhook/lluvia', {
        method: 'GET',
      });

      return {
        connected: response.ok,
        lastTest: new Date().toISOString()
      };
    } catch (error) {
      return {
        connected: false,
        lastTest: new Date().toISOString()
      };
    }
  }
};