import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { MCPClient } from './client'
import { Server } from '@modelcontextprotocol/sdk/server/index.js'

describe('MCPClient', () => {
  it('should exist', () => {
    expect(MCPClient).toBeDefined()
  })

  describe('when creating a client', () => {
    const client = new MCPClient()
    
    it('should create an instance', () => {
      expect(client).toBeDefined()
    })
  })

  describe('when connecting to server', () => {
    let result
    
    beforeEach(async () => {
      const client = new MCPClient('http://localhost:3000')
      result = await client.connect()
    })
    
    it('should return connection success', () => {
      expect(result).toBe('connected')
    })
  })

  describe('when listing tools', () => {
    let tools
    
    beforeEach(async () => {
      const client = new MCPClient('http://localhost:3000')
      tools = await client.listTools()
    })
    
    it('should return array of tools', () => {
      expect(tools).toEqual(['testTool'])
    })
  })
})