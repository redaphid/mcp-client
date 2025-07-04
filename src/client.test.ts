import { describe, it, expect, beforeEach, beforeAll, afterAll, afterEach } from "vitest"
import { MCPClient } from "./client"
import express from "express"
import { ToolSchema, CallToolResultSchema, JSONRPC_VERSION } from "./schemas"

// MCP Client Integration Tests: https://modelcontextprotocol.io/specification/2025-06-18
describe("MCPClient", () => {
  let server
  let port

  it("should exist", () => {
    expect(MCPClient).toBeDefined()
  })

  beforeEach(async () => {
    const app = express()
    app.use(express.json())

    app.post("/mcp", (req, res) => {
      if (req.body?.method === "initialize") {
        res.json({
          jsonrpc: JSONRPC_VERSION,
          id: req.body.id,
          result: {
            protocolVersion: "2025-06-18",
            capabilities: { tools: {} },
            serverInfo: { name: "dark-grimoire-server", version: "1.0.0" }
          }
        })
        return
      }
      if (req.body?.method === "tools/list") {
        res.json({
          jsonrpc: JSONRPC_VERSION,
          id: req.body.id,
          result: {
            tools: [{ name: "spellOfSummoning", description: "Arcane incantation for mystical effects", inputSchema: { type: "object" } }]
          }
        })
        return
      }
      if (req.body?.method === "notifications/initialized") {
        res.status(202).send()
        return
      }
      res.json({
        content: [{ type: "text", text: "dark magical essence summoned" }],
      })
    })
    await new Promise<void>((resolve) => {
      server = app.listen(0, () => {
        port = server.address().port
        resolve()
      })
    })
  })

  afterEach(async () => {
    server.close()
  })

  describe("when creating a client", () => {
    const client = new MCPClient("http://crazyland.com")

    it("should create an instance", () => {
      expect(client).toBeDefined()
    })
  })

  // MCP Tools: https://modelcontextprotocol.io/specification/2025-06-18/server/tools
  describe("when listing tools", () => {
    let tools

    beforeEach(async () => {
      const client = new MCPClient(`http://localhost:${port}`)
      await client.initialize()
      tools = await client.listTools()
    })

    it("should return array of tools", () => {
      expect(Array.isArray(tools)).toBe(true)
      ToolSchema.parse(tools[0])
      expect(tools).toEqual([
        {
          name: "spellOfSummoning",
          description: "Arcane incantation for mystical effects",
          inputSchema: { type: "object" },
        },
      ])
    })
  })

  describe("when listTools sends request", () => {
    let receivedRequests

    beforeEach(async () => {
      receivedRequests = []
      const app = express()
      app.use(express.json())
      
      app.post("/mcp", (req, res) => {
        receivedRequests.push(req.body)
        if (req.body.method === "initialize") {
          res.json({
            jsonrpc: JSONRPC_VERSION,
            id: req.body.id,
            result: {
              protocolVersion: "2025-06-18",
              capabilities: { tools: {} },
              serverInfo: { name: "dark-grimoire-server", version: "1.0.0" }
            }
          })
          return
        }
        if (req.body.method === "tools/list") {
          res.json({
            jsonrpc: JSONRPC_VERSION,
            id: req.body.id,
            result: { tools: [{ name: "spellOfSummoning", description: "Arcane incantation", inputSchema: { type: "object" } }] }
          })
          return
        }
        res.status(202).send()
      })

      await new Promise<void>((resolve) => {
        server = app.listen(0, () => {
          port = server.address().port
          resolve()
        })
      })

      const client = new MCPClient(`http://localhost:${port}`)
      await client.initialize()
      await client.listTools()
    })

    it("should send proper tools/list JSON-RPC request", () => {
      const toolsRequest = receivedRequests.find(req => req.method === "tools/list")
      expect(toolsRequest).toEqual({
        jsonrpc: JSONRPC_VERSION,
        id: expect.any(String),
        method: "tools/list"
      })
    })
  })

  // MCP Tool Calling: https://modelcontextprotocol.io/specification/2025-06-18/server/tools
  describe("when calling a tool", () => {
    let result

    beforeEach(async () => {
      const client = new MCPClient(`http://localhost:${port}`)
      await client.initialize()
      result = await client.callTool("spellOfSummoning", {})
    })

    it("should return tool result", () => {
      CallToolResultSchema.parse(result)
      expect(result).toEqual({
        content: [{ type: "text", text: "dark magical essence summoned" }],
      })
    })
  })
})

describe("MCPClient with alternate server", () => {
  let server
  let port
  let serverResponse

  beforeEach(async () => {
    const app = express()
    app.use(express.json())

    app.post("/mcp", (req, res) => {
      if (req.body?.method === "initialize") {
        res.json({
          jsonrpc: JSONRPC_VERSION,
          id: req.body.id,
          result: {
            protocolVersion: "2025-06-18",
            capabilities: { tools: {} },
            serverInfo: { name: "alternate-server", version: "1.0.0" }
          }
        })
        return
      }
      if (req.body?.method === "notifications/initialized") {
        res.status(202).send()
        return
      }
      res.json(
        serverResponse || {
          content: [{ type: "text", text: "alternate result" }],
        }
      )
    })
    await new Promise<void>((resolve) => {
      server = app.listen(0, () => {
        port = server.address().port
        resolve()
      })
    })
  })

  afterEach(async () => {
    server.close()
  })

  describe("when calling a tool", () => {
    let result

    beforeEach(async () => {
      const client = new MCPClient(`http://localhost:${port}`)
      await client.initialize()
      result = await client.callTool("spellOfSummoning", {})
    })

    it("should return alternate result", () => {
      expect(result).toEqual({ content: [{ type: "text", text: "alternate result" }] })
    })
  })

  describe("when calling a specific tool", () => {
    let result

    beforeEach(async () => {
      serverResponse = { content: [{ type: "text", text: "specific tool result" }] }
      const client = new MCPClient(`http://localhost:${port}`)
      await client.initialize()
      result = await client.callTool("specificTool", { param: "value" })
    })

    it("should return result for specific tool", () => {
      expect(result).toEqual({ content: [{ type: "text", text: "specific tool result" }] })
    })
  })

  describe("when calling another tool", () => {
    let result

    beforeEach(async () => {
      serverResponse = { content: [{ type: "text", text: "another tool result" }] }
      const client = new MCPClient(`http://localhost:${port}`)
      await client.initialize()
      result = await client.callTool("anotherTool", { data: "test" })
    })

    it("should return result for another tool", () => {
      expect(result).toEqual({ content: [{ type: "text", text: "another tool result" }] })
    })
  })
})

describe("MCPClient with different server", () => {
  let server
  let port

  beforeEach(async () => {
    const app = express()
    app.use(express.json())
    app.post("/mcp", (req, res) => {
      if (req.body?.method === "initialize") {
        res.json({
          jsonrpc: JSONRPC_VERSION,
          id: req.body.id,
          result: {
            protocolVersion: "2025-06-18",
            capabilities: { tools: {} },
            serverInfo: { name: "different-server", version: "1.0.0" }
          }
        })
        return
      }
      if (req.body?.method === "notifications/initialized") {
        res.status(202).send()
        return
      }
      res.json({
        content: [{ type: "text", text: "different result" }],
      })
    })

    await new Promise<void>((resolve) => {
      server = app.listen(0, () => {
        port = server.address().port
        resolve()
      })
    })
  })

  afterEach(async () => {
    server.close()
  })

  describe("when calling a tool", () => {
    let result

    beforeEach(async () => {
      const client = new MCPClient(`http://localhost:${port}`)
      await client.initialize()
      result = await client.callTool("spellOfSummoning", {})
    })

    it("should return different result", () => {
      expect(result).toEqual({ content: [{ type: "text", text: "different result" }] })
    })
  })
})

// MCP Streamable HTTP Transport Tests: https://modelcontextprotocol.io/specification/2025-06-18/basic/transports
describe("MCPClient headers", () => {
  let server
  let port
  let receivedHeaders

  beforeEach(async () => {
    const app = express()
    app.use(express.json())
    app.post("/mcp", (req, res) => {
      receivedHeaders = req.headers
      if (req.body?.method === "initialize") {
        res.json({
          jsonrpc: JSONRPC_VERSION,
          id: req.body.id,
          result: {
            protocolVersion: "2025-06-18",
            capabilities: { tools: {} },
            serverInfo: { name: "header-test-server", version: "1.0.0" }
          }
        })
        return
      }
      if (req.body?.method === "notifications/initialized") {
        res.status(202).send()
        return
      }
      res.json({
        content: [{ type: "text", text: "header test result" }],
      })
    })

    await new Promise<void>((resolve) => {
      server = app.listen(0, () => {
        port = server.address().port
        resolve()
      })
    })
  })

  afterEach(async () => {
    server.close()
  })

  describe("when making a request", () => {
    beforeEach(async () => {
      const client = new MCPClient(`http://localhost:${port}`)
      await client.initialize()
      await client.callTool("testTool", {})
    })

    it("should send proper Accept header", () => {
      expect(receivedHeaders.accept).toBe("application/json, text/event-stream")
    })
  })

  describe("when server returns JSON-RPC response", () => {
    let result
    let port

    beforeEach(async () => {
      const app = express()
      app.use(express.json())
      app.post("/mcp", (req, res) => {
        if (req.body?.method === "initialize") {
          res.json({
            jsonrpc: JSONRPC_VERSION,
            id: req.body.id,
            result: {
              protocolVersion: "2025-06-18",
              capabilities: { tools: {} },
              serverInfo: { name: "jsonrpc-test-server", version: "1.0.0" }
            }
          })
          return
        }
        if (req.body?.method === "notifications/initialized") {
          res.status(202).send()
          return
        }
        res.json({
          jsonrpc: JSONRPC_VERSION,
          id: req.body.id,
          result: { content: [{ type: "text", text: "jsonrpc result" }] },
        })
      })

      await new Promise<void>((resolve) => {
        server = app.listen(0, () => {
          port = server.address().port
          resolve()
        })
      })

      const client = new MCPClient(`http://localhost:${port}`)
      await client.initialize()
      result = await client.callTool("spellOfSummoning", {})
    })

    it("should extract result from JSON-RPC wrapper", () => {
      expect(result).toEqual({ content: [{ type: "text", text: "jsonrpc result" }] })
    })
  })

  describe("when server returns JSON-RPC error", () => {
    let error

    beforeEach(async () => {
      const app = express()
      app.use(express.json())
      app.post("/mcp", (req, res) => {
        if (req.body?.method === "initialize") {
          res.json({
            jsonrpc: JSONRPC_VERSION,
            id: req.body.id,
            result: {
              protocolVersion: "2025-06-18",
              capabilities: { tools: {} },
              serverInfo: { name: "error-test-server", version: "1.0.0" }
            }
          })
          return
        }
        if (req.body?.method === "notifications/initialized") {
          res.status(202).send()
          return
        }
        res.json({
          jsonrpc: JSONRPC_VERSION,
          id: req.body.id,
          error: { code: -32601, message: "Method not found" },
        })
      })

      await new Promise<void>((resolve) => {
        server = app.listen(0, () => {
          port = server.address().port
          resolve()
        })
      })

      const client = new MCPClient(`http://localhost:${port}`)
      await client.initialize()
      try {
        await client.callTool("unknownTool", {})
      } catch (e) {
        error = e
      }
    })

    it("should throw error with message", () => {
      expect(error.message).toBe("Method not found")
    })
  })

  // SSE Format: https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events
  describe("when server returns SSE stream", () => {
    let result

    beforeEach(async () => {
      const app = express()
      app.use(express.json())
      app.post("/mcp", (req, res) => {
        if (req.body?.method === "initialize") {
          res.json({
            jsonrpc: JSONRPC_VERSION,
            id: req.body.id,
            result: {
              protocolVersion: "2025-06-18",
              capabilities: { tools: {} },
              serverInfo: { name: "sse-test-server", version: "1.0.0" }
            }
          })
          return
        }
        if (req.body?.method === "notifications/initialized") {
          res.status(202).send()
          return
        }
        res.writeHead(200, {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
        })
        res.write('data: {"jsonrpc": "2.0", "method": "notifications/progress", "params": {"progress": 0.5}}\n\n')
        res.write('data: {"jsonrpc": "2.0", "id": "1", "result": {"content": [{"type": "text", "text": "sse result"}]}}\n\n')
        res.end()
      })

      await new Promise<void>((resolve) => {
        server = app.listen(0, () => {
          port = server.address().port
          resolve()
        })
      })

      const client = new MCPClient(`http://localhost:${port}`)
      await client.initialize()
      result = await client.callTool("spellOfSummoning", {})
    })

    it("should return final result from SSE stream", () => {
      expect(result).toEqual({ content: [{ type: "text", text: "sse result" }] })
    })
  })

  // MCP Progress Notifications: https://modelcontextprotocol.io/specification/2025-06-18/basic/lifecycle
  describe("when server returns long-running SSE stream", () => {
    let notifications
    let finalResult

    beforeEach(async () => {
      notifications = []
      const app = express()
      app.use(express.json())
      app.post("/mcp", (req, res) => {
        if (req.body?.method === "initialize") {
          res.json({
            jsonrpc: JSONRPC_VERSION,
            id: req.body.id,
            result: {
              protocolVersion: "2025-06-18",
              capabilities: { tools: {} },
              serverInfo: { name: "long-sse-server", version: "1.0.0" }
            }
          })
          return
        }
        if (req.body?.method === "notifications/initialized") {
          res.status(202).send()
          return
        }
        res.writeHead(200, {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
        })
        res.write('data: {"jsonrpc": "2.0", "method": "notifications/progress", "params": {"step": "starting", "progress": 0.1}}\n\n')
        res.write('data: {"jsonrpc": "2.0", "method": "notifications/progress", "params": {"step": "processing", "progress": 0.5}}\n\n')
        res.write('data: {"jsonrpc": "2.0", "method": "notifications/progress", "params": {"step": "finishing", "progress": 0.9}}\n\n')
        res.write('data: {"jsonrpc": "2.0", "id": "1", "result": {"content": [{"type": "text", "text": "completed"}]}}\n\n')
        res.end()
      })

      await new Promise<void>((resolve) => {
        server = app.listen(0, () => {
          port = server.address().port
          resolve()
        })
      })

      const client = new MCPClient(`http://localhost:${port}`)
      await client.initialize()
      finalResult = await client.callTool("longTask", {}, (notification) => {
        notifications.push(notification)
      })
    })

    it("should receive all progress notifications", () => {
      expect(notifications).toHaveLength(3)
      expect(notifications[0]).toEqual({ step: "starting", progress: 0.1 })
      expect(notifications[1]).toEqual({ step: "processing", progress: 0.5 })
      expect(notifications[2]).toEqual({ step: "finishing", progress: 0.9 })
    })

    it("should return final result", () => {
      expect(finalResult).toEqual({ content: [{ type: "text", text: "completed" }] })
    })
  })

  describe("when client has request options", () => {
    let receivedHeaders

    beforeEach(async () => {
      const app = express()
      app.use(express.json())
      app.post("/mcp", (req, res) => {
        receivedHeaders = req.headers
        if (req.body?.method === "initialize") {
          res.json({
            jsonrpc: JSONRPC_VERSION,
            id: req.body.id,
            result: {
              protocolVersion: "2025-06-18",
              capabilities: { tools: {} },
              serverInfo: { name: "auth-test-server", version: "1.0.0" }
            }
          })
          return
        }
        if (req.body?.method === "notifications/initialized") {
          res.status(202).send()
          return
        }
        res.json({
          content: [{ type: "text", text: "authenticated result" }],
        })
      })

      await new Promise<void>((resolve) => {
        server = app.listen(0, () => {
          port = server.address().port
          resolve()
        })
      })

      const client = new MCPClient(`http://localhost:${port}`, { headers: { Authorization: "Bearer secret-token" } })
      await client.initialize()
      await client.callTool("testTool", {})
    })

    it("should send Authorization header", () => {
      expect(receivedHeaders.authorization).toBe("Bearer secret-token")
    })
  })

  describe("when server returns different tool result", () => {
    let result

    beforeEach(async () => {
      const app = express()
      app.use(express.json())
      app.post("/mcp", (req, res) => {
        if (req.body?.method === "initialize") {
          res.json({
            jsonrpc: JSONRPC_VERSION,
            id: req.body.id,
            result: {
              protocolVersion: "2025-06-18",
              capabilities: { tools: {} },
              serverInfo: { name: "rune-test-server", version: "1.0.0" }
            }
          })
          return
        }
        if (req.body?.method === "notifications/initialized") {
          res.status(202).send()
          return
        }
        res.json({
          jsonrpc: JSONRPC_VERSION,
          id: req.body.id,
          result: {
            content: [{ type: "text", text: "mystical rune activated" }]
          }
        })
      })

      await new Promise<void>((resolve) => {
        server = app.listen(0, () => {
          port = server.address().port
          resolve()
        })
      })

      const client = new MCPClient(`http://localhost:${port}`)
      await client.initialize()
      result = await client.callTool("spellOfSummoning", {})
    })

    it("should return server's actual response, not hard-coded text", () => {
      expect(result).toEqual({
        content: [{ type: "text", text: "mystical rune activated" }]
      })
    })
  })

  describe("when connect() method is called", () => {
    let result

    beforeEach(async () => {
      const client = new MCPClient(`http://localhost:${port}`)
      result = await client.connect()
    })

    it("should return connection status", () => {
      expect(result).toBe("connected")
    })

    it("should enforce initialization requirement for tool operations", async () => {
      const client = new MCPClient(`http://localhost:${port}`)
      await client.connect()
      
      // callTool should require initialization
      let error
      try {
        await client.callTool("spellOfSummoning", {})
      } catch (e) {
        error = e
      }
      expect(error?.message).toBe("Client must be initialized before making requests")
    })
  })
})
