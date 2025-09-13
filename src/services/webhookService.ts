
export interface AutomationWebhookData {
  automationName: string;
  automationDescription: string;
  trigger: string;
  actions: string[];
  platform: string;
  userId: string;
  userEmail?: string;
  userName?: string;
  userPlan?: string;
  status: string;
  createdAt: string;
  automationId?: string;
  timestamp: string;
  source: string;
  test?: boolean;
}

export const webhookService = {
  // Automation verilerini webhook'a gönder
  async sendAutomationData(data: AutomationWebhookData): Promise<boolean> {
    try {
      const webhookUrl = import.meta.env.VITE_WEBHOOK_URL || 'https://lluviaomer.app.n8n.cloud/webhook-test/lluvia';
      const response = await fetch(webhookUrl, {
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
          timestamp: data.timestamp,
          source: data.source,
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
      const webhookUrl = import.meta.env.VITE_WEBHOOK_URL || 'https://lluviaomer.app.n8n.cloud/webhook-test/lluvia';
      const response = await fetch(webhookUrl, {
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
        automationName: 'Debug Test Automation',
        automationDescription: 'Testing N8N webhook connectivity',
        trigger: 'Debug Trigger',
        actions: ['Debug Action 1', 'Debug Action 2'],
        platform: 'n8n',
        userId: 'debug_user',
        userEmail: 'debug@lluvia.ai',
        userName: 'Debug User',
        userPlan: 'pro',
        status: 'test',
        createdAt: new Date().toISOString(),
        automationId: 'debug-automation-' + Date.now(),
        timestamp: new Date().toISOString(),
        source: 'webhook-test',
        test: true
      };

      const webhookUrl = import.meta.env.VITE_WEBHOOK_URL || 'https://lluviaomer.app.n8n.cloud/webhook-test/lluvia';
      const response = await fetch(webhookUrl, {
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
      const webhookUrl = import.meta.env.VITE_WEBHOOK_URL || 'https://lluviaomer.app.n8n.cloud/webhook-test/lluvia';
      const response = await fetch(webhookUrl, {
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