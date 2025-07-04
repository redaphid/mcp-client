#!/usr/bin/env node

import { MCPClient } from './src/client.js'

const main = async () => {
  const url = process.argv[2]
  
  if (!url) {
    console.log('Usage: npm run connect <mcp-server-url>')
    console.log('Example: npm run connect https://mcp.example.com')
    process.exit(1)
  }
  
  console.log(`🔮 Connecting to MCP server: ${url}`)
  
  try {
    const client = new MCPClient(url)
    
    console.log('⚡ Initializing connection...')
    const initResult = await client.initialize()
    console.log('✨ Connected! Server info:', initResult.serverInfo)
    
    console.log('🛠️  Listing available tools...')
    const tools = await client.listTools()
    
    if (tools && tools.length > 0) {
      console.log(`\n📋 Found ${tools.length} tools:`)
      tools.forEach((tool, index) => {
        console.log(`\n${index + 1}. ${tool.name}`)
        console.log(`   Description: ${tool.description}`)
        if (tool.inputSchema?.properties) {
          const params = Object.keys(tool.inputSchema.properties)
          console.log(`   Parameters: ${params.join(', ') || 'none'}`)
        }
      })
    } else {
      console.log('\n📋 No tools found')
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message)
    process.exit(1)
  }
}

main()