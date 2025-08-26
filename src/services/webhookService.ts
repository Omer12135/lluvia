import { supabase } from '../lib/supabase';

interface WebhookPayload {
  event_type: string;
  timestamp: number;
  data: {
    automation: {
      name: string;
      description: string;
      trigger: string;
      actions: any[];
    };
    user: {
      id: string;
      email: string;
      name: string;
      plan: string;
    };
  };
  id: string;
  metadata: {
    source: string;
    webhook_id: string;
    user_id: string;
    automation_name: string;
  };
}

interface WebhookResult {
  success: boolean;
  data?: any;
  error?: string;
  timestamp: number;
  duration: number;
}

class WebhookService {
  async processLegacyWebhook(payload: any): Promise<WebhookResult> {
    const startTime = Date.now();
    
    try {
      // Validate payload structure
      if (!payload || typeof payload !== 'object') {
        throw new Error('Invalid payload: must be an object');
      }

      // Convert legacy payload to new format if needed
      const webhookPayload: WebhookPayload = {
        event_type: payload.event_type || 'automation_trigger',
        timestamp: payload.timestamp || Date.now(),
        data: payload.data || {
          automation: {
            name: payload.automation_name || 'Unknown Automation',
            description: payload.automation_description || '',
            trigger: payload.trigger || 'manual',
            actions: payload.actions || []
          },
          user: payload.user || {
            id: payload.user_id || 'unknown',
            email: payload.user_email || '',
            name: payload.user_name || '',
            plan: payload.user_plan || 'free'
          }
        },
        id: payload.id || Date.now().toString(),
        metadata: {
          source: payload.source || 'lluvia-ai-platform',
          webhook_id: payload.webhook_id || `legacy_${Date.now()}`,
          user_id: payload.user_id || 'unknown',
          automation_name: payload.automation_name || 'Unknown Automation'
        }
      };

      // Simulate webhook processing
      await new Promise(resolve => setTimeout(resolve, 500));

      const result: WebhookResult = {
        success: true,
        data: webhookPayload,
        timestamp: Date.now(),
        duration: Date.now() - startTime
      };

      return result;

    } catch (error) {
      const result: WebhookResult = {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        timestamp: Date.now(),
        duration: Date.now() - startTime
      };
      
      return result;
    }
  }

  async getAutomationRequests() {
    try {
      const { data, error } = await supabase
        .from('automation_requests')
        .select(`
          *,
          user_profiles!inner(
            name,
            email,
            plan
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching automation requests:', error);
      throw error;
    }
  }
}

export const webhookService = new WebhookService();

export const processLegacyWebhook = async (payload: any): Promise<WebhookResult> => {
  return webhookService.processLegacyWebhook(payload);
};

// Test webhook function
export const testWebhook = async (): Promise<WebhookResult> => {
  const testPayload = {
    event_type: 'automation_created',
    timestamp: Date.now(),
    automation_name: 'Test Automation',
    automation_description: 'Testing webhook connectivity',
    trigger_name: 'Test Trigger',
    user_id: 'test_user',
    user_email: 'test@lluvia.ai',
    user_name: 'Test User',
    user_plan: 'pro',
    source: 'lluvia-ai-platform',
    webhook_id: `test_${Date.now()}`,
    automation_id: `automation_${Date.now()}`
  };

  try {
    const response = await fetch('https://lluviaomer.app.n8n.cloud/webhook/lluvia', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'LLUVIA-AI-Platform/1.0'
      },
      body: JSON.stringify(testPayload)
    });

    const responseText = await response.text();
    
    return {
      success: response.ok,
      data: responseText,
      error: response.ok ? undefined : `HTTP ${response.status}: ${response.statusText}`,
      timestamp: Date.now(),
      duration: 0
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: Date.now(),
      duration: 0
    };
  }
};