/**
 * Parse an error message from a fetch Response.
 */
export async function parseErrorResponse(response: Response): Promise<string> {
  try {
    const body = await response.json();
    return body.error || body.detail || body.message || response.statusText;
  } catch {
    try {
      return await response.text() || response.statusText;
    } catch {
      return response.statusText;
    }
  }
}
