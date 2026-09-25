/**
 * CrowdFundAI+ API Client
 * Configured to connect to the Python ML backend (FastAPI / Flask) and MySQL API Gateway.
 */

const API_BASE_URL = (import.meta as any).env?.VITE_ML_API_URL || 'http://localhost:8000/api';

export interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  message?: string;
  error?: string;
  isBackendConnected: boolean;
}

export class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  public getBaseUrl(): string {
    return this.baseUrl;
  }

  public setBaseUrl(url: string): void {
    this.baseUrl = url;
  }

  /**
   * Health check for Python ML backend service
   */
  public async checkHealth(): Promise<{ status: string; connected: boolean; service?: string }> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);
      const res = await fetch(`${this.baseUrl}/health`, {
        signal: controller.signal,
        headers: { 'Content-Type': 'application/json' },
      });
      clearTimeout(timeoutId);
      if (res.ok) {
        const data = await res.json();
        return { status: 'connected', connected: true, service: data.service || 'CrowdFundAI+ ML Gateway' };
      }
      return { status: 'disconnected', connected: false };
    } catch {
      // Backend not running yet (expected during Stage 1)
      return { status: 'disconnected', connected: false };
    }
  }
}

export const apiClient = new ApiClient();
