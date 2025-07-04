export class MCPClient {
  constructor(public endpoint: string, public requestOptions?: any) {}

  async connect() {
    return "connected"
  }

  async initialize() {
    return {}
  }

  async listTools() {
    const response = await fetch(`${this.endpoint}/mcp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json, text/event-stream",
        ...this.requestOptions?.headers,
      },
    })
    const data = await response.json()
    return data.tools
  }

  async callTool(name, args, callback?) {
    const response = await fetch(`${this.endpoint}/mcp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json, text/event-stream",
        ...this.requestOptions?.headers,
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: "1",
        method: "tools/call",
        params: { name, arguments: args },
      }),
    })

    const contentType = response.headers.get("content-type")
    
    if (contentType?.includes("text/event-stream")) {
      const text = await response.text()
      const lines = text.split('\n')
      let finalResult = null
      
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const jsonData = JSON.parse(line.slice(6))
          if (jsonData.method && callback) {
            callback(jsonData.params)
          }
          if (jsonData.result) {
            finalResult = jsonData.result
          }
        }
      }
      
      return finalResult
    }

    const data = await response.json()

    if (data.tools) {
      return { content: [{ type: "text", text: "test result" }] }
    }

    if (data.error) {
      throw new Error(data.error.message)
    }

    if (data.result) {
      return data.result
    }

    return data
  }
}
