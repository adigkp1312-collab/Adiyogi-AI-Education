class APIClient {
  private baseUrl = '/api';

  async post<T>(endpoint: string, data: unknown): Promise<T> {
    const response = await fetch(this.baseUrl + endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'API Error: ' + response.statusText);
    }
    return response.json();
  }

  async get<T>(endpoint: string): Promise<T> {
    const response = await fetch(this.baseUrl + endpoint);
    if (!response.ok) throw new Error('API Error: ' + response.statusText);
    return response.json();
  }
}

export const apiClient = new APIClient();
