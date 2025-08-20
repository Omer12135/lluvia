interface Config {
  defaultWebhookUrl: string;
  timeout: number;
  retryAttempts: number;
  retryDelay: number;
}

export class ConfigManager {
  private config: Config = {
    defaultWebhookUrl: 'https://lluviaomer.app.n8n.cloud/webhook/lluvia',
    timeout: 30000,
    retryAttempts: 3,
    retryDelay: 1000
  };

  getConfig(): Config {
    return { ...this.config };
  }

  updateConfig(updates: Partial<Config>): void {
    this.config = { ...this.config, ...updates };
  }

  setWebhookUrl(url: string): void {
    this.config.defaultWebhookUrl = url;
  }

  getWebhookUrl(): string {
    return this.config.defaultWebhookUrl;
  }
}