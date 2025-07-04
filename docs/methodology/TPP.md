# TPP (Transformation Priority Premise)

<overview>
_*adjusts mystical transformation apparatus with scholarly precision*_ Behold! The Transformation Priority Premise - the sacred order of code mutations during our test-driven rituals! It ensures your code evolves naturally from simple incantations to complex summoning circles through specific, prioritized metamorphoses.

**Core Principle**: "As tests get more specific, code gets more generic" - Each ADD cycle forces exactly ONE TPP transformation, like a careful alchemical transmutation!

<technical-summary>
TPP (Transformation Priority Premise) defines the preferred order of code transformations during TDD:
- Start with simplest transformations (null → constant)
- Progress to complex ones (statement → statements, unconditional → if)
- Each failing test should force exactly one transformation
- Prefer higher-priority (simpler) transformations when possible
- Prevents premature complexity and over-engineering
</technical-summary>
</overview>

<transformations>
_*cackles with algorithmic delight*_ From highest (simplest) to lowest (most complex) priority, the sacred transformations:

1. **{} → nil**: From the void emerges null/undefined - the primordial nothingness!
2. **nil → constant**: From nothingness springs a constant value - the first spark of existence!
3. **constant → constant+**: One constant multiplies into many - the proliferation begins!
4. **constant → scalar**: Constants become variables - flexibility awakens!
5. **scalar → array element**: Scalars join the collective - the hive mind forms!
6. **array element → array**: Single elements become collections - armies assemble!
7. **array → container**: Arrays transform into complex vessels - the grimoire expands!
8. **statement → statements**: One command becomes many - the ritual grows!
9. **unconditional → if**: Logic branches like dark lightning - decisions manifest!
10. **if → while**: Conditions loop eternally - the cycle of power!
11. **expression → function**: Expressions crystallize into functions - reusable magic!
12. **variable → assignment**: Variables mutate - the final transformation!

<technical-summary>
Transformation priority order:
1. {} → nil (nothing to null)
2. nil → constant (null to literal value)
3. constant → constant+ (one value to multiple values)
4. constant → scalar (literal to variable)
5. scalar → array element (variable to array access)
6. array element → array (element to collection)
7. array → container (array to object/map)
8. statement → statements (single to multiple)
9. unconditional → if (straight to conditional)
10. if → while (conditional to loop)
11. expression → function (inline to reusable)
12. variable → assignment (read to write)
</technical-summary>
</transformations>

<examples>
## Complete ADD + TPP Flow with Detailed Incantations

<transformation>
### Transformation 1: {} → nil (From the void emerges nothingness!)

_*whispers with anticipation*_ Watch as we summon existence from pure emptiness!

**Round 1 - Developer A's Dark Invocation:**
```typescript
describe('summonEntity', () => {
  it('should exist', () => {
    expect(summonEntity).toBeDefined()
  })
})
// ❌ RED: ReferenceError: summonEntity is not defined
// The void rejects our call! The entity does not yet exist!
```

**Round 1 - Developer B's Minimal Manifestation:**
```typescript
// IMPLEMENTATION: Laziest possible - just make it exist
export const summonEntity = null
// ✅ GREEN: Test passes! The entity emerges from nothingness!
// TPP: {} → nil transformation complete - first breath of existence!
// REFACTOR: Nothing to refactor in the primordial void
```
</transformation>

<transformation>
### Transformation 2: nil → constant (The spark of life ignites!)

_*rubs hands together with glee*_ Now we breathe functionality into our lifeless creation!

**Round 2 - Developer B's Arcane Demand (roles reverse like dark mirrors):**
```typescript
describe('summonEntity', () => {
  it('should exist', () => {
    expect(summonEntity).toBeDefined()
  })
  
  it('should be a function', () => {
    expect(typeof summonEntity).toBe('function')
  })
})
// ❌ RED: Expected 'function', received 'object' (null is but an object!)
// The entity exists but cannot act! It needs the spark of functionality!
```

**Round 2 - Developer A's Vital Animation:**
```typescript
// IMPLEMENTATION: Breathe function-life into the void, nothing more
export const summonEntity = () => {}
// ✅ GREEN: Both tests pass! The entity can now be invoked!
// TPP: nil → constant (empty function is a constant of power)
// REFACTOR: The primordial ooze needs no refinement yet
```
</transformation>

<transformation>
### Transformation 3: constant → constant (The first utterance!)

_*cackles with dark satisfaction*_ The entity speaks its first word of power!

**Round 3 - Developer A's Summoning Ritual:**
```typescript
describe('summonEntity', () => {
  // ... existing mystical tests ...
  
  describe('when summoning ancient one', () => {
    let result
    
    beforeEach(() => {
      result = summonEntity('ancient one')
    })
    
    it('should return "awakened"', () => {
      expect(result).toBe('awakened')
    })
  })
})
// ❌ RED: Expected 'awakened', received undefined
// The ancient one stirs but speaks not! It must learn the word of power!
```

**Round 3 - Developer B's Incantation of Awakening:**
```typescript
// IMPLEMENTATION: Inscribe the exact word of power upon the entity's tongue
export const summonEntity = () => 'awakened'
// ✅ GREEN: All tests pass! The ancient one speaks!
// TPP: constant → constant (from silence to 'awakened')
// REFACTOR: The single word needs no eloquence yet
```
</transformation>

### Transformation 4: constant → variable (Forced generalization)

**Round 4 - Developer B's Turn:**
```typescript
describe('when summoning shadow fiend', () => {
  let result
  
  beforeEach(() => {
    result = summonEntity('shadow fiend')
  })
  
  it('should return "banished"', () => {
    expect(result).toBe('banished')
  })
})
// ❌ RED: Expected 'banished', received 'awakened'
```

**Round 4 - Developer A's Turn:**
```typescript
// IMPLEMENTATION: Minimal conditional logic
export const summonEntity = (entity) => 
  entity === 'ancient one' ? 'awakened' : 'banished'
// ✅ GREEN: All tests pass!
// TPP: constant → variable (now depends on input)
// REFACTOR: Ternary is clean, leave it
```

### Transformation 5: variable → array element

**Round 5 - Developer A's Turn:**
```typescript
describe('when summoning sleeper', () => {
  let result
  
  beforeEach(() => {
    result = summonEntity('sleeper')
  })
  
  it('should return "dormant"', () => {
    expect(result).toBe('dormant')
  })
})
// ❌ RED: Expected 'dormant', received 'banished'
```

**Round 5 - Developer B's Turn:**
```typescript
// IMPLEMENTATION: Getting messy but works
export const summonEntity = (entity) => {
  if (entity === 'ancient one') return 'awakened'
  if (entity === 'shadow fiend') return 'banished'
  if (entity === 'sleeper') return 'dormant'
  return 'banished'
}
// ✅ GREEN: All tests pass!
// TPP: More conditions added

// REFACTOR: Now we can clean up the duplication
const outcomes = {
  'ancient one': 'awakened',
  'shadow fiend': 'banished',
  'sleeper': 'dormant'
}
export const summonEntity = (entity) => outcomes[entity] || 'banished'
// Still GREEN! Behavior unchanged, code cleaner
```

### Transformation 6: array element → conditional

**Round 6 - Developer B's Turn:**
```typescript
describe('summonEntity', () => {
  // ... existing tests ...
  
  describe('when entity contains morph', () => {
    describe('and entity is shapeshifter morph', () => {
      let result
      
      beforeEach(() => {
        // ACT - pattern-based entity
        result = summonEntity('shapeshifter morph')
      })
      
      it('should return "transformed"', () => {
        // ASSERT - pattern outcome
        expect(result).toBe('transformed')
      })
    })
    
    describe('and entity is morph demon', () => {
      let result
      
      beforeEach(() => {
        // ACT - another pattern match
        result = summonEntity('morph demon')
      })
      
      it('should return "transformed"', () => {
        // ASSERT - same outcome for pattern
        expect(result).toBe('transformed')
      })
    })
  })
})
// ❌ RED: Expected 'transformed', received 'banished'
```

**Round 6 - Developer A's Turn:**
```typescript
// IMPLEMENTATION: Add pattern matching
export const summonEntity = (entity) => {
  if (entity.includes('morph')) return 'transformed'
  return outcomes[entity] || 'banished'
}
// ✅ GREEN: All tests pass!
// TPP: array element → conditional (pattern matching)
// REFACTOR: Code is still clean, no changes needed
```

### Transformation 7: conditional → polymorphism

**Round 7 - Developer A's Turn:**
```typescript
describe('summonEntity', () => {
  // ... existing tests ...
  
  describe('when handling ritual combinations', () => {
    let ritual
    
    beforeEach(() => {
      // ARRANGE - complex object input
      ritual = { primary: 'ancient one', modifier: 'shadow' }
    })
    
    describe('and summoning with ritual object', () => {
      let result
      
      beforeEach(() => {
        // ACT - polymorphic call
        result = summonEntity(ritual)
      })
      
      it('should return shadow-awakened', () => {
        // ASSERT - combined result
        expect(result).toBe('shadow-awakened')
      })
    })
  })
})
// ❌ RED: Type error or unexpected result
```

**Round 7 - Developer B's Turn:**
```typescript
// IMPLEMENTATION: Quick and dirty type checking
export const summonEntity = (input) => {
  if (typeof input === 'object') {
    const base = outcomes[input.primary] || 'banished'
    return `${input.modifier}-${base}`
  }
  if (input.includes('morph')) return 'transformed'
  return outcomes[input] || 'banished'
}
// ✅ GREEN: All tests pass!

// REFACTOR: Extract functions for clarity
const simpleEntity = (entity) => {
  if (entity.includes('morph')) return 'transformed'
  return outcomes[entity] || 'banished'
}

const ritualEntity = (ritual) => {
  const base = outcomes[ritual.primary] || 'banished'
  return `${ritual.modifier}-${base}`
}

export const summonEntity = (input) =>
  typeof input === 'object' ? ritualEntity(input) : simpleEntity(input)
// Still GREEN! Much cleaner separation of concerns
```

<refactoring-grimoire>
## The Sacred Art of Refactoring

<good-refactoring>
### GOOD Refactoring - The Cleansing Ritual (after multiple tests force duplication)

_*whispers conspiratorially*_ Observe how we purify the code without changing its dark purpose!

```typescript
// BEFORE (working but repetitive - the stench of duplication!)
export const summonEntity = (entity) => {
  if (entity === 'ancient one') return 'awakened'
  if (entity === 'shadow fiend') return 'banished'  
  if (entity === 'sleeper') return 'dormant'
  if (entity.includes('morph')) return 'transformed'
  return 'unknown'
}

// AFTER (same behavior, elegant incantation!)
const entityOutcomes = {
  'ancient one': 'awakened',
  'shadow fiend': 'banished',
  'sleeper': 'dormant'
}

export const summonEntity = (entity) => {
  if (entity.includes('morph')) return 'transformed'
  return entityOutcomes[entity] || 'unknown'
}
// _*cackles*_ The grimoire is organized! The spell remains unchanged!
```
</good-refactoring>

<bad-refactoring>
### BAD Refactoring - The Forbidden Transmutation (adds functionality)

_*hisses with warning*_ BEWARE! This violates the sacred laws!

```typescript
// WRONG - Adding features during refactor! HERESY!
export const summonEntity = (entity, options = {}) => {  // ❌ Added parameter - FORBIDDEN!
  if (options.verbose) console.log(`Summoning ${entity}`) // ❌ New behavior - BLASPHEMY!
  
  if (entity.includes('morph')) return 'transformed'
  return entityOutcomes[entity] || options.default || 'unknown' // ❌ New logic - CORRUPTION!
}
// The dark gods punish those who add features during refactoring!
```
</bad-refactoring>
</refactoring-grimoire>

<key-principles>
## The Sacred Laws of Transformation

<principle>
### Start with High Priority Transformations
_*taps ancient scroll*_ Always prefer simpler transformations! If you can solve a test with a constant, don't leap to variables like an overeager apprentice!
</principle>

<principle>
### One Transformation Per Test
_*raises spectral finger*_ Each test should force exactly ONE transformation. If a test requires multiple transformations, the test is too ambitious - like trying to summon multiple demons at once!
</principle>

<principle>
### When to Skip the Refactoring Ritual:
_*cackles knowingly*_ Sometimes the mess serves a purpose!
- Code is already elegantly simple
- No duplication haunts the codebase
- Tests might need to evolve further
- You're tempted to add features (RESIST!)
- The mess is tomorrow's problem (let future acolytes handle it!)
</principle>
</key-principles>

## Complete Test Evolution Example

Showing how tests evolve through ADD cycles with proper nesting:

```typescript
// Cycle 1: Existence
describe('performRitual', () => {
  it('should exist', () => {
    expect(performRitual).toBeDefined()
  })
})

// Cycle 2: Type
describe('performRitual', () => {
  it('should exist', () => {
    expect(performRitual).toBeDefined()
  })
  
  it('should be a function', () => {
    expect(typeof performRitual).toBe('function')
  })
})

// Cycle 3: First behavior
describe('performRitual', () => {
  it('should exist', () => {
    expect(performRitual).toBeDefined()
  })
  
  it('should be a function', () => {
    expect(typeof performRitual).toBe('function')
  })
  
  describe('when performing basic ritual', () => {
    let result
    
    beforeEach(() => {
      result = performRitual('basic')
    })
    
    it('should return success', () => {
      expect(result).toBe('success')
    })
  })
})

// Cycle 4: Force generalization
describe('performRitual', () => {
  // ... existing tests ...
  
  describe('when performing complex ritual', () => {
    let result
    
    beforeEach(() => {
      result = performRitual('complex')
    })
    
    it('should return failure', () => {
      expect(result).toBe('failure')
    })
  })
})

// Cycle 5: Add context depth
describe('performRitual', () => {
  // ... existing tests ...
  
  describe('when components are provided', () => {
    let components
    
    beforeEach(() => {
      // ARRANGE at this level
      components = ['candle', 'salt', 'grimoire']
    })
    
    describe('and performing ritual with components', () => {
      let result
      
      beforeEach(() => {
        // ACT at this level
        result = performRitual('enhanced', components)
      })
      
      it('should return enhanced-success', () => {
        expect(result).toBe('enhanced-success')
      })
      
      describe('and moon is full', () => {
        let moonPhase
        
        beforeEach(() => {
          // Additional ARRANGE
          moonPhase = 'full'
        })
        
        describe('and ritual is performed', () => {
          let enhancedResult
          
          beforeEach(() => {
            // Deeper ACT
            enhancedResult = performRitual('enhanced', components, { moon: moonPhase })
          })
          
          it('should return moonlit-success', () => {
            expect(enhancedResult).toBe('moonlit-success')
          })
        })
      })
    })
  })
})
```

<common-mistakes>
## Forbidden Practices That Anger the Code Gods

_*eyes glow with warning*_ Beware these cursed patterns!

- **Skipping transformations**: Leaping from constant to complex logic like a mad sorcerer!
- **Multiple transformations**: Applying several mutations for one test - GREED!
- **Premature abstraction**: Creating functions before the duplication demons appear!
- **Over-engineering**: Using complex transformations when simple ones suffice - HUBRIS!
- **Flat test structure**: Not using nested describes - your tests lack depth, like a shallow grave!
- **Mixed concerns**: Putting Arrange, Act, and Assert in same block - CHAOS!
- **Multiple assertions**: Having more than one expect() per it block - test gluttony!
</common-mistakes>

<benefits>
## The Dark Rewards of Following TPP

_*cackles with satisfaction*_ Those who follow the path shall receive:

- **Natural code evolution**: Code grows organically from simple to complex, like a spreading curse!
- **Prevents over-engineering**: Can't add complexity without tests forcing it - enforced simplicity!
- **Clear progression**: Each step is deliberate and justified, like a ritual performed correctly!
- **Maintainable code**: Complexity only where actually needed - elegant darkness!
</benefits>
</examples>