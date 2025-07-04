import { describe, it, expect, beforeEach, beforeAll, afterAll, afterEach } from "vitest"
import { MCPClient } from "./client"
import express from "express"

describe("MCPClient", () => {
  let server

  it("should exist", () => {
    expect(MCPClient).toBeDefined()
  })

  beforeEach(async () => {
    const app = express()
    app.use(express.json())

    app.post("/mcp", (req, res) => {
      res.json({
        tools: [{ name: "testTool", description: "Test tool", inputSchema: { type: "object" } }],
      })
    })
    await new Promise<void>((resolve) => {
      server = app.listen(3000)
      server.on("listening", resolve)
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

  describe("when listing tools", () => {
    let tools

    beforeEach(async () => {
      const client = new MCPClient("http://localhost:3000")
      await client.connect()
      tools = await client.listTools()
    })

    it("should return array of tools", () => {
      expect(tools).toEqual([{ name: "testTool", description: "Test tool", inputSchema: { type: "object" } }])
    })
  })

  describe("when calling a tool", () => {
    let result

    beforeEach(async () => {
      const client = new MCPClient("http://localhost:3000")
      await client.connect()
      result = await client.callTool("testTool", {})
    })

    it("should return tool result", () => {
      expect(result).toEqual({ content: [{ type: "text", text: "test result" }] })
    })
  })
})

describe("MCPClient with alternate server", () => {
  let server
  let serverResponse

  beforeEach(async () => {
    const app = express()
    app.use(express.json())

    app.post("/mcp", (req, res) => {
      res.json(serverResponse || {
        content: [{ type: "text", text: "alternate result" }],
      })
    })
    await new Promise<void>((resolve) => {
      server = app.listen(3000)
      server.on("listening", resolve)
    })
  })

  afterEach(async () => {
    server.close()
  })

  describe("when calling a tool", () => {
    let result

    beforeEach(async () => {
      const client = new MCPClient("http://localhost:3000")
      await client.connect()
      result = await client.callTool("testTool", {})
    })

    it("should return alternate result", () => {
      expect(result).toEqual({ content: [{ type: "text", text: "alternate result" }] })
    })
  })

  describe("when calling a specific tool", () => {
    let result

    beforeEach(async () => {
      serverResponse = { content: [{ type: "text", text: "specific tool result" }] }
      const client = new MCPClient("http://localhost:3000")
      await client.connect()
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
      const client = new MCPClient("http://localhost:3000")
      await client.connect()
      result = await client.callTool("anotherTool", { data: "test" })
    })

    it("should return result for another tool", () => {
      expect(result).toEqual({ content: [{ type: "text", text: "another tool result" }] })
    })
  })

  describe("when calling tool on different server", () => {
    let server2
    let result

    beforeEach(async () => {
      const app2 = express()
      app2.use(express.json())
      app2.post("/mcp", (req, res) => {
        res.json({
          content: [{ type: "text", text: "different result" }],
        })
      })

      await new Promise<void>((resolve) => {
        server2 = app2.listen(4000)
        server2.on("listening", () => resolve())
      })

      const client = new MCPClient("http://localhost:4000")
      await client.connect()
      result = await client.callTool("testTool", {})
    })

    afterEach(async () => {
      server2.close()
    })

    it("should return different result", () => {
      expect(result).toEqual({ content: [{ type: "text", text: "different result" }] })
    })
  })
})

describe("MCPClient headers", () => {
  let server
  let receivedHeaders

  beforeEach(async () => {
    const app = express()
    app.use(express.json())
    app.post("/mcp", (req, res) => {
      receivedHeaders = req.headers
      res.json({
        content: [{ type: "text", text: "header test result" }],
      })
    })

    await new Promise<void>((resolve) => {
      server = app.listen(3000)
      server.on("listening", () => resolve())
    })
  })

  afterEach(async () => {
    server.close()
  })

  describe("when making a request", () => {
    beforeEach(async () => {
      const client = new MCPClient("http://localhost:3000")
      await client.connect()
      await client.callTool("testTool", {})
    })

    it("should send proper Accept header", () => {
      expect(receivedHeaders.accept).toBe("application/json, text/event-stream")
    })
  })
})
