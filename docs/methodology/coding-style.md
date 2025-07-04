# Coding Style Guide

<philosophy>
_*adjusts ancient code scrolls with reverence*_ Code should be sparse, simple, and poetic like dark haiku. Hemingway-esque brevity meets necromantic elegance: maximum power in minimum incantation!

<technical-summary>
Core coding principles:
- No semicolons
- Use arrow functions exclusively
- Early returns only (no else statements)
- Functional, immutable style preferred
- Minimal code - every line must justify existence
- Sparse layout for readability
</technical-summary>
</philosophy>

<sacred-rules>
## The NON-NEGOTIABLE Commandments of Code

<always>
### The Path of Light (ALWAYS):

_*whispers the sacred truths*_

- **No semicolons** - Clean as bone, minimal as death
- **Arrow functions** - Swift as spectral arrows, consistent as fate
- **Early returns** - NO else statements, ever - escape the maze quickly!
- **Functional style** - Immutable as stone tablets, pure as distilled essence
- **Minimal code** - Every line must justify its existence or be banished!
- **Sparse layout** - Let the code breathe like spirits in the night
</always>

<never>
### The Forbidden Arts (NEVER):

_*hisses with warning*_

- ❌ Semicolons - unnecessary punctuation demons!
- ❌ else statements - the path forks but once!
- ❌ Complex error handling (except at system edges) - catch only what you must!
- ❌ Over-engineering - elaborate contraptions anger the gods!
- ❌ Try/catch except at system boundaries - let errors bubble like swamp gas!
- ❌ Comments unless absolutely necessary - good spells explain themselves!
</never>
</sacred-rules>

<examples>
## The Sacred Scrolls of Correct Style

<correct-example>
_*unveils pristine code specimen*_ Behold! A properly channeled incantation:

```typescript
const fetchMessage = async (messageId, env) => {
  if (!messageId) return null
  if (!env.DB) return { error: "Database unavailable" }

  const message = await env.DB.prepare(
    `
    SELECT * FROM slack_messages WHERE id = ?
  `
  )
    .bind(messageId)
    .first()

  if (!message) return null

  return {
    id: message.id,
    text: message.text,
    user_id: message.user_id,
    slack_permalink: generatePermalink(message),
  }
}
```

_*cackles with satisfaction*_ See how it flows? No semicolons pollute the spell! Early returns guide the spirit quickly through the maze!
</correct-example>

<style-principles>
## The Dark Arts of Code Elegance

<early-returns>
### The Swift Escape Pattern

_*draws exit paths in the air*_ Why wander through nested dungeons when you can escape at the first sign of danger?

<technical-summary>
Early return pattern:
- Check failure conditions first and return immediately
- No else statements - each condition exits
- Reduces nesting and improves readability
- Main logic lives at the bottom, unindented
</technical-summary>

```typescript
// ❌ WRONG - The Labyrinth of Doom!
const processUser = (user) => {
  if (user) {
    if (user.active) {
      return user.name
    } else {
      return 'inactive'
    }
  } else {
    return null
  }
}
// Too many passages! The soul gets lost in the maze!

// ✅ RIGHT - The Path of Swift Shadows
const processUser = (user) => {
  if (!user) return null
  if (!user.active) return 'inactive'
  return user.name
}
// _*chef's kiss*_ Each guard lets you escape immediately!
```
</early-returns>

<arrow-functions>
### The Arrow of Destiny Pattern

_*notches spectral arrow*_ Why use clunky function declarations when arrows fly true and swift?

```typescript
// ❌ WRONG - The Ancient Verbosity Curse!
function calculateTotal(items) {
  return items.reduce(function(sum, item) {
    return sum + item.price
  }, 0)
}
// So many words! The spell grows heavy with unnecessary syllables!

// ✅ RIGHT - The Swift Arrow Incantation
const calculateTotal = (items) => 
  items.reduce((sum, item) => sum + item.price, 0)
// _*whispers admiringly*_ See how the arrow pierces straight to the heart?
```
</arrow-functions>

<minimal-errors>
### The Art of Letting Errors Flow

_*waves dismissively at elaborate error traps*_ Why build elaborate dungeons for errors when they should flow like water to the edges?

```typescript
// ❌ WRONG - The Over-Engineered Error Dungeon!
const getData = async (id) => {
  try {
    const result = await db.get(id)
    try {
      return JSON.parse(result)
    } catch (parseError) {
      console.error('Parse error:', parseError)
      throw new CustomParseError(parseError)
    }
  } catch (dbError) {
    console.error('Database error:', dbError)
    throw new CustomDatabaseError(dbError)
  }
}
// Layers upon layers of catching! The errors are trapped in nested prisons!

// ✅ RIGHT - The Elegant Flow of Fate
const getData = async (id) => {
  const result = await db.get(id)
  if (!result) return null
  return JSON.parse(result)
}
// _*cackles*_ Let errors bubble to the surface like swamp gas! Catch them only at the edges of the realm!
```
</minimal-errors>

<functional-style>
### The Functional Transformation Ritual

_*arranges mystical symbols*_ Why command imperatively when you can transform elegantly?

```typescript
// ❌ WRONG - The Imperative Slog of Doom!
const activeUsers = []
for (let i = 0; i < users.length; i++) {
  if (users[i].active) {
    activeUsers.push(users[i])
  }
}
// Ugh! Manual labor! Pushing users one by one like moving stones!

// ✅ RIGHT - The Functional Transmutation
const activeUsers = users.filter(user => user.active)
// _*eyes gleam with satisfaction*_ One elegant incantation transforms the entire collection!
```
</functional-style>
</style-principles>

<code-density>
## The Sacred Balance of Space and Substance

<sparse-clarity>
### Let the Code Breathe Like Spirits in the Night

_*gestures at cramped code*_ Even dark magic needs room to breathe!

```typescript
// ❌ WRONG - The Suffocating Spell of Density!
const x=users.filter(u=>u.active).map(u=>({id:u.id,name:u.name})).sort((a,b)=>a.name.localeCompare(b.name))
// *gasps* The incantation chokes on itself! No room for the magic to flow!

// ✅ RIGHT - The Breathing Enchantment
const activeUsers = users
  .filter(user => user.active)
  .map(user => ({
    id: user.id,
    name: user.name
  }))
  .sort((a, b) => a.name.localeCompare(b.name))
// _*sighs contentedly*_ See how each transformation has space to work its magic?
```
</sparse-clarity>
</code-density>

<key-takeaways>
## The Final Incantations of Wisdom

_*raises staff dramatically*_ Heed these commandments, young apprentice!

1. **Simplicity over cleverness** - If it's not immediately clear, the spell is too complex!
2. **Let the code speak** - Good incantations don't need explanatory runes!
3. **Every line matters** - If you can banish it without breaking the spell, banish it!
4. **Consistency is key** - The same dark patterns must flow throughout the grimoire!
5. **Poetic brevity** - Say more with less, like a haiku of doom!

_*cackles with finality*_ Follow these teachings, and your code shall be as elegant as it is powerful!
</key-takeaways>
</examples>