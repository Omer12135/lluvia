export interface ErrorLog {
  id: string;
  timestamp: string;
  level: 'error' | 'warning' | 'info';
  category: 'webhook' | 'automation' | 'auth' | 'system';
  message: string;
  details?: any;
  userId?: string;
  automationId?: string;
  stackTrace?: string;
}

export interface ErrorStats {
  total: number;
  byLevel: Record<string, number>;
  byCategory: Record<string, number>;
  recent: ErrorLog[];
}

export class ErrorManager {
  private readonly MAX_LOGS = 1000;
  private readonly STORAGE_KEY = 'lluvia_error_logs';
  
  private errorLogs: ErrorLog[] = [];

  constructor() {
    this.loadLogsFromStorage();
    this.setupGlobalErrorHandlers();
  }

  logError(
    message: string,
    category: 'webhook' | 'automation' | 'auth' | 'system' = 'system',
    details?: any,
    userId?: string,
    automationId?: string
  ): void {
    const errorLog: ErrorLog = {
      id: this.generateId(),
      timestamp: new Date().toISOString(),
      level: 'error',
      category,
      message,
      details,
      userId,
      automationId,
      stackTrace: new Error().stack
    };

    this.addLog(errorLog);
    console.error(`[ErrorManager] ${category.toUpperCase()}: ${message}`, details);
  }

  logWarning(
    message: string,
    category: 'webhook' | 'automation' | 'auth' | 'system' = 'system',
    details?: any,
    userId?: string,
    automationId?: string
  ): void {
    const errorLog: ErrorLog = {
      id: this.generateId(),
      timestamp: new Date().toISOString(),
      level: 'warning',
      category,
      message,
      details,
      userId,
      automationId
    };

    this.addLog(errorLog);
    console.warn(`[ErrorManager] ${category.toUpperCase()}: ${message}`, details);
  }

  logInfo(
    message: string,
    category: 'webhook' | 'automation' | 'auth' | 'system' = 'system',
    details?: any,
    userId?: string,
    automationId?: string
  ): void {
    const errorLog: ErrorLog = {
      id: this.generateId(),
      timestamp: new Date().toISOString(),
      level: 'info',
      category,
      message,
      details,
      userId,
      automationId
    };

    this.addLog(errorLog);
    console.info(`[ErrorManager] ${category.toUpperCase()}: ${message}`, details);
  }

  private addLog(log: ErrorLog): void {
    this.errorLogs.unshift(log);
    
    // Keep only the most recent logs
    if (this.errorLogs.length > this.MAX_LOGS) {
      this.errorLogs = this.errorLogs.slice(0, this.MAX_LOGS);
    }
    
    this.saveLogsToStorage();
    
    // Trigger custom event for UI updates
    window.dispatchEvent(new CustomEvent('errorLogAdded', { detail: log }));
  }

  private setupGlobalErrorHandlers(): void {
    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.logError(
        'Unhandled Promise Rejection',
        'system',
        {
          reason: event.reason,
          promise: event.promise
        }
      );
    });

    // Handle JavaScript errors
    window.addEventListener('error', (event) => {
      this.logError(
        'JavaScript Error',
        'system',
        {
          message: event.message,
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
          error: event.error
        }
      );
    });

    // Handle fetch errors (monkey patch)
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      try {
        const response = await originalFetch(...args);
        
        if (!response.ok) {
          this.logWarning(
            'HTTP Request Failed',
            'webhook',
            {
              url: args[0],
              status: response.status,
              statusText: response.statusText
            }
          );
        }
        
        return response;
      } catch (error) {
        this.logError(
          'Fetch Request Failed',
          'webhook',
          {
            url: args[0],
            error: error instanceof Error ? error.message : 'Unknown error'
          }
        );
        throw error;
      }
    };
  }

  private loadLogsFromStorage(): void {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        this.errorLogs = JSON.parse(stored);
        console.log(`[ErrorManager] Loaded ${this.errorLogs.length} error logs`);
      }
    } catch (error) {
      console.error('[ErrorManager] Failed to load logs from storage:', error);
      this.errorLogs = [];
    }
  }

  private saveLogsToStorage(): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.errorLogs));
    } catch (error) {
      console.error('[ErrorManager] Failed to save logs to storage:', error);
    }
  }

  private generateId(): string {
    return `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Public methods for UI and debugging
  public getErrorStats(): ErrorStats {
    const byLevel: Record<string, number> = {};
    const byCategory: Record<string, number> = {};

    for (const log of this.errorLogs) {
      byLevel[log.level] = (byLevel[log.level] || 0) + 1;
      byCategory[log.category] = (byCategory[log.category] || 0) + 1;
    }

    return {
      total: this.errorLogs.length,
      byLevel,
      byCategory,
      recent: this.errorLogs.slice(0, 10)
    };
  }

  public getLogsByCategory(category: string): ErrorLog[] {
    return this.errorLogs.filter(log => log.category === category);
  }

  public getLogsByLevel(level: string): ErrorLog[] {
    return this.errorLogs.filter(log => log.level === level);
  }

  public getLogsByUser(userId: string): ErrorLog[] {
    return this.errorLogs.filter(log => log.userId === userId);
  }

  public clearLogs(): void {
    this.errorLogs = [];
    this.saveLogsToStorage();
    console.log('[ErrorManager] All logs cleared');
  }

  public exportLogs(): string {
    return JSON.stringify(this.errorLogs, null, 2);
  }

  public getRecentErrors(count = 10): ErrorLog[] {
    return this.errorLogs.slice(0, count);
  }

  // Utility methods for error handling
  public handleAsyncError<T>(
    promise: Promise<T>,
    context: string,
    category: 'webhook' | 'automation' | 'auth' | 'system' = 'system'
  ): Promise<T> {
    return promise.catch((error) => {
      this.logError(
        `Async operation failed in ${context}`,
        category,
        {
          error: error instanceof Error ? error.message : 'Unknown error',
          stack: error instanceof Error ? error.stack : undefined
        }
      );
      throw error;
    });
  }

  public wrapFunction<T extends (...args: any[]) => any>(
    fn: T,
    context: string,
    category: 'webhook' | 'automation' | 'auth' | 'system' = 'system'
  ): T {
    return ((...args: any[]) => {
      try {
        const result = fn(...args);
        
        if (result instanceof Promise) {
          return this.handleAsyncError(result, context, category);
        }
        
        return result;
      } catch (error) {
        this.logError(
          `Function execution failed in ${context}`,
          category,
          {
            error: error instanceof Error ? error.message : 'Unknown error',
            args: args.length > 0 ? args : undefined
          }
        );
        throw error;
      }
    }) as T;
  }
}

export const errorManager = new ErrorManager();