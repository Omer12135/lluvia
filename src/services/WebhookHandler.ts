interface WebhookConfig {
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  timeout: number;
  retryAttempts: number;
  retryDelay: number;
}

interface WebhookResult {
  success: boolean;
  data?: any;
  error?: string;
  timestamp: number;
  duration: number;
  executionId?: string;
}

export class WebhookHandler {
  async sendWebhook(data: any, config: WebhookConfig): Promise<WebhookResult> {
    const startTime = Date.now();
    let lastError: string = '';

    for (let attempt = 1; attempt <= config.retryAttempts; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), config.timeout);

        const response = await fetch(config.url, {
          method: config.method,
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        const duration = Date.now() - startTime;
        
        if (response.ok) {
          const responseData = await response.json().catch(() => ({}));
          return {
            success: true,
            data: responseData,
            timestamp: Date.now(),
            duration,
            executionId: `exec_${Date.now()}`
          };
        } else {
          lastError = `HTTP ${response.status}: ${response.statusText}`;
        }
      } catch (error) {
        if (error instanceof Error) {
          if (error.name === 'AbortError') {
            lastError = 'Request timeout';
          } else {
            lastError = error.message;
          }
        } else {
          lastError = 'Unknown error occurred';
        }
      }

      if (attempt < config.retryAttempts) {
        await new Promise(resolve => setTimeout(resolve, config.retryDelay));
      }
    }

    return {
      success: false,
      error: lastError,
      timestamp: Date.now(),
      duration: Date.now() - startTime
    };
  }
}