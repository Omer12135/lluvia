import { supabase } from '../lib/supabase';

export interface AutomationWebhookData {
  event_type: string;
  timestamp: string;
  automation_name: string;
  automation_description: string;
  trigger_name: string;
  user_id: string;
  user_email?: string;
  user_name?: string;
  user_plan?: string;
  automation_id?: string;
  test?: boolean;
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
          event_type: data.event_type,
          timestamp: data.timestamp,
          automation_name: data.automation_name,
          automation_description: data.automation_description,
          trigger_name: data.trigger_name,
          user_id: data.user_id,
          user_email: data.user_email,
          user_name: data.user_name,
          user_plan: data.user_plan,
          automation_id: data.automation_id,
          test: data.test
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
        event_type: 'automation_created',
        timestamp: new Date().toISOString(),
        automation_name: 'Debug Test Automation',
        automation_description: 'Testing N8N webhook connectivity',
        trigger_name: 'Debug Trigger',
        user_id: 'debug_user',
        user_email: 'debug@lluvia.ai',
        user_name: 'Debug User',
        user_plan: 'pro',
        automation_id: 'debug-automation-' + Date.now(),
        test: true
      };

      const response = await fetch('https://lluviaomer.app.n8n.cloud/webhook/lluvia', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testData),
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