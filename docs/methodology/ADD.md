# ADD (Asshole Driven Development)

<methodology>
<overview>
ADD (Asshole Driven Development) is a strict test-driven development methodology that enforces quality through tiny, incremental steps and rigid constraints. It's designed to prevent over-engineering and ensure robust, well-tested code.

<technical-summary>
ADD is a test-driven development methodology with strict rules:
- Write minimal failing test first
- Implement only enough code to pass
- Refactor only after green (optional)
- Developers alternate writing tests and implementations
- Each test forces exactly one code change
- No anticipation of future requirements
</technical-summary>
</overview>

<sacred-cycle name="RED-GREEN-REFACTOR">
<technical-summary>
Three-phase cycle:
1. RED: Write failing test
2. GREEN: Write minimal code to pass
3. REFACTOR: Clean code without changing behavior (optional)
</technical-summary>
<phase name="RED">
<requirement>Write the simplest failing test</requirement>
<requirement>Test must fail for the RIGHT reason</requirement>
<requirement>Verify the failure message</requirement>
</phase>

<phase name="GREEN">
<requirement>Write ONLY enough code to pass the test</requirement>
<requirement>Hard-code when possible</requirement>
<requirement>No abstractions until forced</requirement>
<requirement>Make it work, not pretty</requirement>
</phase>

<phase name="REFACTOR" optional="true">
<constraint>ONLY after GREEN</constraint>
<constraint>NEVER adds functionality</constraint>
<constraint>ONLY improves code quality</constraint>

<allowed-actions>
<action>Extracting duplicate code into functions</action>
<action>Renaming variables for clarity</action>
<action>Restructuring without changing behavior</action>
<action>Removing dead code</action>
<action>Improving readability</action>
</allowed-actions>

<forbidden-actions>
<action>❌ Adding new features</action>
<action>❌ Handling new cases</action>
<action>❌ Anticipating future needs</action>
<action>❌ Making code "extensible"</action>
<action>❌ Adding parameters "just in case"</action>
</forbidden-actions>
</phase>
</sacred-cycle>

<sacred-rules count="11">
<rule number="1" name="Start minimal">Test existence, then type, then ONE specific example</rule>
<rule number="2" name="Hard-code first">Return literals before abstractions</rule>
<rule number="3" name="One test forces ONE code change">Each test should force exactly ONE TPP transformation</rule>
<rule number="4" name="No else statements">Use early returns for simplicity</rule>
<rule number="5" name="Be difficult">Force tiny steps, make the other developer work for every feature</rule>
<rule number="6" name="Strict alternation">A writes test → B implements → B writes test → A implements</rule>
<rule number="7" name="Never skip hard-coding">return 'awakened', not transform(input)</rule>
<rule number="8" name="Delete nothing">Tests accumulate and document requirements</rule>
<rule number="9" name="When stuck, go smaller">The step is ALWAYS smaller than you think</rule>
<rule number="10" name="Refactor ONLY to clean">Never changes behavior, never adds parameters</rule>
<rule number="11" name="Test with --run always">`npm test -- --run` (never just `npm test`)</rule>
</sacred-rules>

<test-structure>
<pattern name="nested-describe">
<mandatory-structure>
<example language="typescript">
describe('functionName', () => {
  it('should exist', () => {
    expect(functionName).toBeDefined()
  })
  
  it('should be a function', () => {
    expect(typeof functionName).toBe('function')
  })
  
  describe('when summoning ancient one', () => {
    let result
    
    beforeEach(() => {
      // ACT - call the function
      result = functionName('ancient one')
    })
    
    it('should return "awakened"', () => {
      // ASSERT - single assertion
      expect(result).toBe('awakened')
    })
  })
  
  describe('when complex scenario', () => {
    let specimen
    let grimoire
    
    beforeEach(() => {
      // ARRANGE - set up test data
      specimen = { type: 'shadow fiend', power: 9000 }
      grimoire = { spell: 'banishment' }
    })
    
    describe('and ritual is performed', () => {
      let result
      
      beforeEach(async () => {
        // ACT - perform the action
        result = await performRitual(specimen, grimoire)
      })
      
      it('should return banished status', () => {
        // ASSERT - check outcome
        expect(result.status).toBe('banished')
      })
      
      it('should consume the spell', () => {
        // ASSERT - another aspect
        expect(result.spellConsumed).toBe(true)
      })
    })
  })
})
</example>
</mandatory-structure>

<key-rules>
<rule>Use `describe` for context nesting with "when" prefix</rule>
<rule>`let` variables in describe scope for mutable test state</rule>
<rule>`beforeEach` for Arrange and Act phases</rule>
<rule>`it` blocks ONLY for assertions (Assert phase)</rule>
<rule>ONE assertion per `it` block</rule>
<rule>Nested describes for different scenarios and sub-contexts</rule>
</key-rules>

<nesting-patterns>
<level number="1" name="Function/Module Under Test">
<example language="typescript">
describe('summonEntity', () => {
  // Existence and type tests at top level
})
</example>
</level>

<level number="2" name="Primary Context" prefix="when...">
<example language="typescript">
describe('when summoning shadow fiend', () => {
  let result
  
  beforeEach(() => {
    // ACT at this level for simple cases
    result = summonEntity('shadow fiend')
  })
  
  it('should return "banished"', () => {
    expect(result).toBe('banished')
  })
})
</example>
</level>

<level number="3+" name="Sub-contexts" prefixes="and..., with..., nested when...">
<example language="typescript">
describe('when entity has complex state', () => {
  let entity
  let ritualComponents
  
  beforeEach(() => {
    // ARRANGE - prepare complex test data
    entity = { name: 'ancient one', power: 9000 }
    ritualComponents = ['candle', 'grimoire', 'sacrifice']
  })
  
  describe('and ritual is performed at midnight', () => {
    let result
    
    beforeEach(async () => {
      // ACT - nested action
      result = await performRitual(entity, ritualComponents, { time: 'midnight' })
    })
    
    it('should awaken the entity', () => {
      expect(result.status).toBe('awakened')
    })
    
    it('should consume all components', () => {
      expect(result.componentsRemaining).toBe(0)
    })
    
    describe('and entity rejects awakening', () => {
      beforeEach(() => {
        // Additional ARRANGE for deeper context
        entity.willpower = 10000
      })
      
      it('should return rejection status', () => {
        expect(result.status).toBe('rejected')
      })
    })
  })
})
</example>
</level>
</nesting-patterns>

<aaa-pattern>
<phase name="ARRANGE" location="beforeEach blocks at appropriate nesting level">
<example language="typescript">
beforeEach(() => {
  // Set up test data
  specimen = { type: 'shadow fiend' }
  components = ['salt', 'silver']
})
</example>
</phase>

<phase name="ACT" location="beforeEach blocks, often in nested describe">
<example language="typescript">
describe('when performing banishment', () => {
  let result
  
  beforeEach(async () => {
    // Execute the action
    result = await banish(specimen, components)
  })
})
</example>
</phase>

<phase name="ASSERT" location="ONLY in it blocks, one assertion each">
<example language="typescript">
it('should return success', () => {
  expect(result.success).toBe(true)
})

it('should consume components', () => {
  expect(result.componentsUsed).toBe(2)
})
</example>
</phase>
</aaa-pattern>
</pattern>
</test-structure>

<critical-violations>
<violation>❌ Writing multiple tests at once</violation>
<violation>❌ Implementing features not required by current test</violation>
<violation>❌ Skipping hard-coding phase</violation>
<violation>❌ Not alternating roles</violation>
<violation>❌ Anticipating future requirements</violation>
<violation>❌ Adding functionality during refactor</violation>
<violation>❌ Testing types/structure instead of behavior</violation>
</critical-violations>

<commit-requirements>
<requirement type="mandatory">Commit after every complete ADD cycle (RED-GREEN-REFACTOR)</requirement>
<requirement type="trigger">After each test passes and before writing next failing test</requirement>
<requirement type="format">Use conventional commits</requirement>
<requirement type="example">Write failing test → Make it pass → Commit → Next failing test</requirement>
</commit-requirements>

<benefits>
<benefit name="Forces simplicity">Can't over-engineer when limited to one change</benefit>
<benefit name="Documents requirements">Tests serve as living documentation</benefit>
<benefit name="Prevents bugs">Tiny steps mean less can go wrong</benefit>
<benefit name="Teaches discipline">Rigid process builds good habits</benefit>
<benefit name="Ensures coverage">Nothing exists without a test</benefit>
</benefits>

<key-principles>
<principle name="Be the asshole">Make the other developer prove they need each feature</principle>
<principle name="Think smaller">The step is always smaller than you think</principle>
<principle name="Hard-code everything">Abstractions come from duplication, not anticipation</principle>
<principle name="Trust the process">The methodology works when followed strictly</principle>
</key-principles>

<test-progression>
<overview>
After each cycle, the developer should suggest the next logical test case:
- "Next test: Should we verify the client can connect to a server?"
- "Next test: Should we test that it can list available tools?"
- "Next test: Should we verify it handles tool calls correctly?"

This allows the other developer to simply respond "yes" to continue the flow.

❌ **WRONG** - Testing types/structure:
- "Should be a function"
- "Should be a class"
- "Should have property X"

✅ **RIGHT** - Testing behavior:
- "Should connect to server"
- "Should list tools"
- "Should handle errors gracefully"
</overview>

<progression-patterns>
<pattern name="Starting Tests" type="universal">
<test order="1">Next test: should be instantiable?</test>
<test order="2">Next test: should handle basic operations?</test>
<test order="3">Next test: when given [specific input], should return [specific output]?</test>
</pattern>

<pattern name="Context Expansion">
<example context="After basic 'awakened' test passes">
Next test: when summoning shadow fiend, should return 'banished'?
</example>
<example context="After multiple entities work">
Next test: when entity name contains 'morph', should return 'transformed'?
</example>
<example context="After pattern matching works">
Next test: when given a ritual object instead of string, should combine results?
</example>
</pattern>

<pattern name="Edge Case Progression">
<example context="After happy path works">
Next test: when entity is null, should return null?
</example>
<example>
Next test: when entity is empty string, should return default?
</example>
<example>
Next test: when components array is empty, should throw error?
</example>
</pattern>
</progression-patterns>
</test-progression>

<enforcement>
<critical-warning>
Any deviation from ADD methodology is a CRITICAL PROJECT FAILURE.
</critical-warning>
</enforcement>
</methodology>