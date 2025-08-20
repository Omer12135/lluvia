export interface ProcessedData {
  isValid: boolean;
  data: any;
  errors: string[];
  warnings: string[];
  metadata: {
    processedAt: string;
    dataType: string;
    size: number;
  };
}

export interface ValidationRule {
  field: string;
  type: 'string' | 'number' | 'boolean' | 'object' | 'array';
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
}

export class DataProcessor {
  private readonly MAX_JSON_SIZE = 1024 * 1024; // 1MB
  private readonly SANITIZE_PATTERNS = [
    { pattern: /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, replacement: '' },
    { pattern: /javascript:/gi, replacement: '' },
    { pattern: /on\w+\s*=/gi, replacement: '' }
  ];

  processWebhookData(rawData: any): ProcessedData {
    const startTime = Date.now();
    const errors: string[] = [];
    const warnings: string[] = [];

    try {
      // Size validation
      const dataSize = this.calculateDataSize(rawData);
      if (dataSize > this.MAX_JSON_SIZE) {
        errors.push(`Data size (${dataSize} bytes) exceeds maximum allowed size (${this.MAX_JSON_SIZE} bytes)`);
        return this.createErrorResult(errors, warnings);
      }

      // Type validation
      if (typeof rawData !== 'object' || rawData === null) {
        errors.push('Webhook data must be a valid JSON object');
        return this.createErrorResult(errors, warnings);
      }

      // Deep clone to avoid mutations
      let processedData = JSON.parse(JSON.stringify(rawData));

      // Sanitize data
      processedData = this.sanitizeData(processedData);

      // Validate structure
      const structureValidation = this.validateStructure(processedData);
      errors.push(...structureValidation.errors);
      warnings.push(...structureValidation.warnings);

      // Transform data
      processedData = this.transformData(processedData);

      const processingTime = Date.now() - startTime;
      console.log(`[DataProcessor] Processed data in ${processingTime}ms`);

      return {
        isValid: errors.length === 0,
        data: processedData,
        errors,
        warnings,
        metadata: {
          processedAt: new Date().toISOString(),
          dataType: this.detectDataType(processedData),
          size: dataSize
        }
      };

    } catch (error) {
      console.error('[DataProcessor] Processing error:', error);
      errors.push(`Processing failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return this.createErrorResult(errors, warnings);
    }
  }

  validateWithRules(data: any, rules: ValidationRule[]): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    for (const rule of rules) {
      const value = this.getNestedValue(data, rule.field);

      // Required field check
      if (rule.required && (value === undefined || value === null || value === '')) {
        errors.push(`Required field '${rule.field}' is missing or empty`);
        continue;
      }

      // Skip validation if field is not required and empty
      if (!rule.required && (value === undefined || value === null)) {
        continue;
      }

      // Type validation
      if (!this.validateType(value, rule.type)) {
        errors.push(`Field '${rule.field}' must be of type ${rule.type}`);
        continue;
      }

      // String-specific validations
      if (rule.type === 'string' && typeof value === 'string') {
        if (rule.minLength && value.length < rule.minLength) {
          errors.push(`Field '${rule.field}' must be at least ${rule.minLength} characters long`);
        }
        
        if (rule.maxLength && value.length > rule.maxLength) {
          errors.push(`Field '${rule.field}' must be no more than ${rule.maxLength} characters long`);
        }
        
        if (rule.pattern && !rule.pattern.test(value)) {
          errors.push(`Field '${rule.field}' does not match required pattern`);
        }
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  private createErrorResult(errors: string[], warnings: string[]): ProcessedData {
    return {
      isValid: false,
      data: null,
      errors,
      warnings,
      metadata: {
        processedAt: new Date().toISOString(),
        dataType: 'error',
        size: 0
      }
    };
  }

  private calculateDataSize(data: any): number {
    try {
      return new Blob([JSON.stringify(data)]).size;
    } catch {
      return 0;
    }
  }

  private sanitizeData(data: any): any {
    if (typeof data === 'string') {
      let sanitized = data;
      for (const { pattern, replacement } of this.SANITIZE_PATTERNS) {
        sanitized = sanitized.replace(pattern, replacement);
      }
      return sanitized;
    }

    if (Array.isArray(data)) {
      return data.map(item => this.sanitizeData(item));
    }

    if (typeof data === 'object' && data !== null) {
      const sanitized: any = {};
      for (const [key, value] of Object.entries(data)) {
        sanitized[key] = this.sanitizeData(value);
      }
      return sanitized;
    }

    return data;
  }

  private validateStructure(data: any): { errors: string[]; warnings: string[] } {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Check for common webhook structure
    if (!data.event_type && !data.type && !data.action) {
      warnings.push('No event type specified (event_type, type, or action field)');
    }

    if (!data.timestamp && !data.created_at && !data.time) {
      warnings.push('No timestamp found in webhook data');
    }

    // Check for potentially problematic structures
    if (this.hasCircularReferences(data)) {
      errors.push('Circular references detected in data structure');
    }

    if (this.getObjectDepth(data) > 10) {
      warnings.push('Data structure is very deep (>10 levels), consider flattening');
    }

    return { errors, warnings };
  }

  private transformData(data: any): any {
    // Normalize timestamp fields
    if (data.timestamp && typeof data.timestamp === 'string') {
      try {
        data.timestamp = new Date(data.timestamp).toISOString();
      } catch {
        // Keep original if parsing fails
      }
    }

    // Add processing metadata
    data._lluvia_processed = {
      processedAt: new Date().toISOString(),
      version: '1.0.0'
    };

    return data;
  }

  private detectDataType(data: any): string {
    if (Array.isArray(data)) return 'array';
    if (typeof data === 'object' && data !== null) {
      if (data.event_type) return 'webhook_event';
      if (data.type) return 'typed_object';
      return 'object';
    }
    return typeof data;
  }

  private validateType(value: any, expectedType: string): boolean {
    switch (expectedType) {
      case 'string':
        return typeof value === 'string';
      case 'number':
        return typeof value === 'number' && !isNaN(value);
      case 'boolean':
        return typeof value === 'boolean';
      case 'object':
        return typeof value === 'object' && value !== null && !Array.isArray(value);
      case 'array':
        return Array.isArray(value);
      default:
        return false;
    }
  }

  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => {
      return current && current[key] !== undefined ? current[key] : undefined;
    }, obj);
  }

  private hasCircularReferences(obj: any, seen = new WeakSet()): boolean {
    if (typeof obj !== 'object' || obj === null) return false;
    if (seen.has(obj)) return true;
    
    seen.add(obj);
    
    for (const value of Object.values(obj)) {
      if (this.hasCircularReferences(value, seen)) return true;
    }
    
    seen.delete(obj);
    return false;
  }

  private getObjectDepth(obj: any, depth = 0): number {
    if (typeof obj !== 'object' || obj === null) return depth;
    
    let maxDepth = depth;
    for (const value of Object.values(obj)) {
      const currentDepth = this.getObjectDepth(value, depth + 1);
      maxDepth = Math.max(maxDepth, currentDepth);
    }
    
    return maxDepth;
  }

  private saveToHistory(payload: any, response: any): void {
    try {
      const history = JSON.parse(localStorage.getItem('lluvia_processing_history') || '[]');
      const historyItem = {
        id: this.generateId(),
        payload,
        response,
        timestamp: new Date().toISOString()
      };

      history.unshift(historyItem);
      
      // Keep only last 50 items
      if (history.length > 50) {
        history.splice(50);
      }

      localStorage.setItem('lluvia_processing_history', JSON.stringify(history));
    } catch (error) {
      console.error('[DataProcessor] Failed to save to history:', error);
    }
  }

  private generateId(): string {
    return `proc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Public utility methods
  public formatJSON(data: any): string {
    try {
      return JSON.stringify(data, null, 2);
    } catch {
      return 'Invalid JSON data';
    }
  }

  public getProcessingHistory(): any[] {
    try {
      return JSON.parse(localStorage.getItem('lluvia_processing_history') || '[]');
    } catch {
      return [];
    }
  }

  public clearProcessingHistory(): void {
    localStorage.removeItem('lluvia_processing_history');
  }
}

export const dataProcessor = new DataProcessor();