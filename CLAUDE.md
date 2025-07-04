# Integration Test MCP Client

<overview>
## Project Overview

<purpose>
This project provides a **dead-simple MCP client** designed specifically to make integration testing of MCP servers as easy as possible. The client implements the **Streamable HTTP transport** as specified in `MCP_SPEC.md` and is optimized for testing scenarios.

**Primary Goal**: Make it trivially easy to write integration tests for MCP servers.
</purpose>

<key-properties>
- **Platform-agnostic dependencies** - Dependencies are fine if they work everywhere (Node.js, Cloudflare, browsers)
- **Testing-first design** - Optimized for writing integration tests quickly
- **Platform-agnostic** - Works in Node.js 18+, Cloudflare Workers, Deno, and browsers
- **Simple API** - Minimal, intuitive methods for testing MCP servers
- **Real server testing** - Tests use `@modelcontextprotocol/sdk` (devDependency) to create real servers
- **Streamable HTTP transport** - Full support for both single-response and SSE streaming
</key-properties>

<design-philosophy>
### Design Philosophy: Testing Made Easy

The client is designed to make integration testing as frictionless as possible. Every API decision should answer: "What would make testing simpler?"

No complex setup. No confusing abstractions. Just simple, direct testing.
</design-philosophy>
</overview>

<technical-requirements>
## Technical Requirements

<coding-style>
### TypeScript Coding Style

Follow the Hemingway-esque coding principles:

- **No semicolons** - Clean, minimal punctuation
- **Arrow functions only** - Consistent, concise syntax
- **Early returns** - No else statements, escape quickly
- **Functional style** - map/filter/reduce over loops
- **Minimal code** - Every line must justify its existence
- **Type inference** - Let TypeScript infer types when possible

<example>
```typescript
// ✅ GOOD
const parseMessage = (data: string) => {
  if (!data) return null
  if (!data.startsWith('data: ')) return null

return JSON.parse(data.slice(6))
}

// ❌ BAD
function parseMessage(data: string): object | null {
if (data && data.startsWith('data: ')) {
return JSON.parse(data.slice(6));
} else {
return null;
}
}

````
</example>
</coding-style>

<platform-requirements>
### Platform-Agnostic Design

The client must use **only Web Standards APIs**:
- `fetch()` - HTTP requests
- `ReadableStream` - SSE streaming
- `TextDecoder` - UTF-8 decoding
- `URL` - URL parsing
- `Headers` - HTTP headers
- `AbortController` - Request cancellation

**NO Node.js-specific imports or APIs allowed in client code.**
</platform-requirements>

<testing-requirements>
### Integration Testing Architecture

<test-structure>
Tests use real MCP servers via the official SDK with proper AAA format:

```typescript
describe('MCPClient', () => {
  let server: MCPServer
  let serverUrl: string

  beforeEach(async () => {
    // ARRANGE - Start real MCP server using SDK
    server = new MCPServer({
      name: 'test-server',
      version: '1.0.0',
      tools: {
        testTool: {
          description: 'Test tool',
          inputSchema: {
            type: 'object',
            properties: {}
          },
          handler: async (args) => ({
            content: [{ type: 'text', text: 'test result' }]
          })
        }
      }
    })
    serverUrl = await server.listen()
  })

  afterEach(async () => {
    await server.close()
  })

  describe('when calling testTool', () => {
    let client: MCPClient
    let result

    beforeEach(() => {
      // ARRANGE
      client = new MCPClient(serverUrl)
    })

    describe('and tool is called with empty args', () => {
      beforeEach(async () => {
        // ACT
        result = await client.callTool('testTool', {})
      })

      it('should return expected result', () => {
        // ASSERT
        expect(result.content[0].text).toBe('test result')
      })
    })
  })
})
````

</test-structure>

<test-constraints>
- **Always use `vitest --run`** - Never just `vitest` (watch mode curse)
- **SDK is devDependency** - Prevents accidental usage in client code
- **Real servers only** - No mocks unless absolutely required
- **Server lifecycle** - Start in beforeEach, close in afterEach
- **AAA pattern** - Arrange in beforeEach, Act in nested beforeEach, Assert in it blocks
- **Nested describes** - Use "when" and "and" for context
</test-constraints>
</testing-requirements>
</technical-requirements>

<streamable-http-spec>
## Streamable HTTP Transport Implementation

<protocol-overview>
Per `MCP_SPEC.md`, the Streamable HTTP transport requires:

1. **Request format**:

   - HTTP POST with JSON-RPC body
   - Headers: `Accept: application/json, text/event-stream`
   - Single request per POST

2. **Response handling**:

   - 202 Accepted for notifications/responses (no body)
   - Single JSON response (`application/json`)
   - SSE stream (`text/event-stream`) for multiple messages

3. **SSE format**:

   ```
   data: {"jsonrpc": "2.0", "method": "notifications/progress", "params": {...}}

   data: {"jsonrpc": "2.0", "id": "123", "result": {...}}

   ```

      </protocol-overview>
   </streamable-http-spec>

<development-methodology>
## Development Methodology

This project follows strict **ADD (Asshole Driven Development)** with **TPP (Transformation Priority Premise)**.

<add-compliance>
### ADD Requirements
it is CRITICAL that we ALWAYS follow these rules. Failure to do so will result in a 10x penalty on the project.

1. **Write failing test first** - No implementation without a test
2. **Minimal implementation** - Just enough to pass the test
3. **One test at a time** - Never write multiple tests at once
4. **Hard-code first** - Return literals before abstractions
5. **Refactor only when green** - Never add features during refactor
6. **Commit after every turn** - Every code change gets committed immediately

<test-progression>
The development should follow this progression:
1. Client can be instantiated → test fails → commit → make it pass → commit
2. Client can connect to server → test fails → commit → make it pass → commit
3. Client can list tools → test fails → commit → make it pass → commit
4. Client can call a tool → test fails → commit → make it pass → commit
5. And so on...

**Critical**: COMMIT after every turn that changes code!

❌ **WRONG** - Testing types/structure:
- "Client is a class"
- "Client is a function" 
- "Server has property X"

✅ **RIGHT** - Testing behavior:
- "Client can list tools"
- "Client can call tool and get result"
- "Client handles server errors gracefully"
</test-progression>
</add-compliance>

<tpp-transformations>
### TPP Priority Order

Follow these transformations in order:

1. {} → nil (nothing to null)
2. nil → constant (null to literal)
3. constant → constant+ (one to many)
4. constant → scalar (literal to variable)
5. And continue per TPP.md
   </tpp-transformations>

See documentation in `/docs/methodology/` for complete methodology details.
</development-methodology>

<project-structure>
## Project Structure

```
/
├── src/                    # Client implementation and tests
│   ├── client.ts          # MCP client (via ADD)
│   ├── client.test.ts     # Integration tests (via ADD)
│   └── index.ts           # Public API exports
├── docs/methodology/       # Development methodology docs
├──── MCP_SPEC.md             # MCP specification reference
├── CLAUDE.md              # This file
├── package.json          # SDK as devDependency only
├── tsconfig.json         # TypeScript config
├── vitest.config.ts      # Test config
└── .gitignore           # Git ignore file
```

</project-structure>

<implementation-guidelines>
## Implementation Guidelines

<client-code-rules>
### Client Code (src/)

1. **Platform-agnostic dependencies** - Use any dependency that works across all platforms
2. **Web Standards preferred** - fetch, ReadableStream, etc.
3. **Platform-agnostic** - Must work everywhere
4. **Follow ADD** - Test-driven, incremental
5. **Minimal code** - Hemingway style

</client-code-rules>

<test-code-rules>
### Test Code (src/*.test.ts)

1. **SDK is devDependency** - Prevents accidental usage in client code
2. **Co-located tests** - Tests live next to implementation
3. **Real servers only** - No mocks, actual MCP servers
4. **AAA pattern** - Arrange, Act, Assert in separate beforeEach blocks
5. **Nested describes** - Proper context hierarchy
6. **Follow ADD** - One test at a time STRICTLY
7. **Test behavior, not types** - Assert what the code DOES, not what it IS

</test-code-rules>
</implementation-guidelines>

<success-criteria>
## Success Criteria

<primary-goal>
### Primary Goal: Easy Integration Testing
- [ ] Writing a test takes minimal code
- [ ] No complex setup or configuration needed
- [ ] Clear, intuitive API for common testing scenarios
- [ ] Helpful error messages for debugging
- [ ] Fast test execution
</primary-goal>

<technical-success>
### Technical Requirements
- [ ] Platform-agnostic design (any dependencies must work everywhere)
- [ ] SDK remains devDependency only (no accidental imports)
- [ ] Works in Node.js 18+, Cloudflare Workers, Deno, browsers
- [ ] Implements complete Streamable HTTP transport
- [ ] Handles both single-response and SSE streaming
- [ ] All tests run against real MCP servers
</technical-success>

<protocol-compliance>
### Protocol Compliance
- [ ] Correct request headers (Accept, Content-Type)
- [ ] Handles 202 Accepted for notifications
- [ ] Parses single JSON responses
- [ ] Parses SSE streams correctly
- [ ] Implements all MCP methods (tools, resources, prompts)
</protocol-compliance>

<code-quality>
### Code Quality
- [ ] Follows Hemingway coding style
- [ ] ADD methodology strictly followed
- [ ] Clean, minimal implementation
- [ ] Comprehensive integration tests
- [ ] Platform-agnostic design
</code-quality>
</success-criteria>

<progress-log>
## Development Progress Log

### Session 1 Progress (2025-07-04)

**What's Working (All 15 tests passing):**
- ✅ Basic MCPClient class with constructor accepting endpoint and requestOptions
- ✅ connect() method returns "connected" (hard-coded)
- ✅ listTools() makes proper HTTP POST with MCP headers
- ✅ callTool() handles JSON-RPC responses, errors, and SSE streams
- ✅ SSE parsing extracts final results from stream
- ✅ Progress notifications via callback pattern
- ✅ Authorization header support via requestOptions
- ✅ All tests use dynamic ports (port 0) to avoid conflicts
- ✅ Platform-agnostic implementation using Web Standards APIs

**Current Implementation Details:**
- Client uses fetch, ReadableStream, Headers (Web Standards)
- Proper Accept headers: "application/json, text/event-stream" 
- JSON-RPC 2.0 format for requests
- SSE stream parsing for notifications and final results
- Express test servers with dynamic port allocation

**Critical Issues Identified:**
1. **ADD Rule Violations**: Used else statements instead of early returns in test setup
2. **Not following ADD progression**: Jumped to complex MCP initialization instead of incremental steps
3. **Not MCP compliant**: Missing proper initialization sequence, stateful connections per spec
4. **Test structure issues**: Complex conditional logic violates ADD simplicity principles

**Specific Violations:**
- Used `else if` in test server setup (violates Rule #4: "No else statements")
- Jumped from basic functionality to complex MCP initialization without intermediate steps
- Failed to follow TPP (Transformation Priority Premise) order
- Not following strict ADD alternation pattern

**MCP Compliance Gap:**
- Current: Stateless HTTP requests (each call independent)
- Required: Stateful connection lifecycle (initialize → operate → shutdown)
- Missing: Initialization handshake, capability negotiation, initialized notification
- Missing: Proper request ID management, progress tokens, _meta field support

**Next Session Focus:**
1. **Follow strict ADD methodology** - start with simple connect behavior improvements
2. **Remove else statements** - use early returns throughout
3. **Build up MCP compliance incrementally** through proper ADD cycles
4. **Each test forces exactly ONE TPP transformation**
5. **Progress: existence → type → simple behavior → generalization → MCP compliance**

**Key Methodology Reminders:**
- User enforces strict ADD (Asshole Driven Development)
- No else statements allowed - use early returns always
- Hemingway-esque coding style (minimal, functional, arrow functions, no semicolons)
- One test at a time, minimal implementations, hard-code first
- Tests must have complete infrastructure setup before testing implementation gaps
</progress-log>

<next-steps>
## Next Steps

1. **Start with ADD**: Write the first failing test for client existence
2. **Focus on simplicity**: Every API decision should make testing easier
3. **Keep SDK isolated**: Ensure it's only imported in test files
4. **Build for testers**: Think "What would make my test simpler?" at each step
5. **Use helpful dependencies**: If a dependency makes the code simpler and works everywhere, use it

Remember: The goal is to make MCP integration testing so easy that developers actually enjoy writing tests. Every line of code should serve that purpose.
</next-steps>

```

```
