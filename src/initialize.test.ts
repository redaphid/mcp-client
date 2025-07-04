import { describe, it, expect, beforeEach, afterEach } from "vitest"
import { MCPClient } from "./client"
import express from "express"

describe("MCPClient initialization", () => {
  let server
  let port
  let receivedRequests

  beforeEach(async () => {
    receivedRequests = []
    const app = express()
    app.use(express.json())
    
    app.post("/mcp", (req, res) => {
      receivedRequests.push(req.body)
      if (req.body.method === "initialize") {
        res.json({
          jsonrpc: "2.0",
          id: req.body.id,
          result: {
            protocolVersion: "2025-06-18",
            capabilities: { tools: {} },
            serverInfo: { name: "dark-grimoire-server", version: "1.0.0" }
          }
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
  })

  afterEach(async () => {
    server.close()
  })

  describe("when client calls initialize", () => {
    let client
    let result

    beforeEach(async () => {
      client = new MCPClient(`http://localhost:${port}`)
      result = await client.initialize()
    })

    it("should return initialize result", () => {
      expect(result).toBeDefined()
    })

    it("should send proper initialize request", () => {
      expect(receivedRequests[0]).toEqual({
        jsonrpc: "2.0", 
        id: expect.any(String),
        method: "initialize",
        params: {
          protocolVersion: "2025-06-18",
          capabilities: {},
          clientInfo: { name: "mystical-test-familiar", version: "0.0.0" }
        }
      })
    })

    it("should return server capabilities", () => {
      expect(result.capabilities).toEqual({ tools: {} })
    })

    it("should send initialized notification after initialize", () => {
      expect(receivedRequests[1]).toEqual({
        jsonrpc: "2.0",
        method: "notifications/initialized"
      })
    })
  })

  describe("when client makes multiple requests", () => {
    let client
    let result1
    let result2

    beforeEach(async () => {
      client = new MCPClient(`http://localhost:${port}`)
      result1 = await client.initialize()
      result2 = await client.initialize()
    })

    it("should use different request IDs", () => {
      const firstRequestId = receivedRequests[0].id
      const thirdRequestId = receivedRequests[2].id
      expect(firstRequestId).not.toEqual(thirdRequestId)
    })
  })

  describe("when client is not initialized", () => {
    let client
    let error

    beforeEach(async () => {
      client = new MCPClient(`http://localhost:${port}`)
      try {
        await client.listTools()
      } catch (e) {
        error = e
      }
    })

    it("should throw error when calling methods before initialization", () => {
      expect(error.message).toBe("Client must be initialized before making requests")
    })
  })
})