import { describe, it, expect, beforeEach, beforeAll, afterAll } from "vitest"
import { MCPClient } from "./client"
import express from "express"
import { createServer } from "http"
import { Server } from "s"
describe("MCPClient", () => {
  let server: Server
  it("should exist", () => {
    expect(MCPClient).toBeDefined()
  })
  beforeAll(async () => {
    const app = express()
    app.use(express.json())

    app.post("/mcp", (req, res) => {
      res.json({
        tools: [{ name: "testTool", description: "Test tool", inputSchema: { type: "object" } }],
      })
    })
    await new Promise<void>((resolve) => {
      server = app.listen(3000)
      server.on("listening", () => resolve())
    })
  })
  afterAll(async () => {
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
})
