export class MCPClient {
  constructor(endpoint) {
    this.endpoint = endpoint
  }
  
  async connect() {
    return 'connected'
  }
  
  async listTools() {
    const response = await fetch(`${this.endpoint}/mcp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    })
    const data = await response.json()
    return data.tools
  }
  
  async callTool(name, args) {
    return { content: [{ type: 'text', text: 'test result' }] }
  }
}