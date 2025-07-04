# Testing Constraints

<critical-limitations>
## The Forbidden Spells of Testing

<technical-summary>
Critical testing constraints for Claude:
1. Cannot run `npm test` or `vitest` without --run flag (hangs in watch mode)
2. Cannot run `wrangler tail` directly (creates endless stream)
3. Must use `vitest run` or `npm test -- --run` for tests
4. User must capture wrangler tail output to file for Claude to read
</technical-summary>

<vitest-curse>
### ⚠️ The Vitest Watch Mode Curse

_*hisses with warning*_ **BEWARE**: Claude CANNOT invoke `npm test` or `vitest` directly - they summon the eternal watch mode that traps souls forever!

<hanging-commands>
#### Test Commands That Summon Eternal Doom

_*waves hands frantically*_ NEVER cast these cursed incantations!

- ❌ `npm test` - Opens a portal to watch mode purgatory!
- ❌ `vitest` - Traps the process in an endless vigil!
</hanging-commands>

<working-commands>
#### Test Commands That Complete Their Dark Purpose

_*cackles with relief*_ These blessed variants actually finish their work!

- ✅ `npm test -- --run` - The sacred --run flag breaks the curse!
- ✅ `vitest --run` - Runs tests once and escapes cleanly!
- ✅ `vitest run` - Another escape route from eternal watching!
- ✅ `vitest run <filename>` - Target specific tests and flee!
</working-commands>

<why-this-happens>
#### The Dark Origins of This Curse

_*whispers conspiratorially*_ The curse exists because:

- Vitest summons watch mode by default in development realms
- Watch mode demands interactive communion with the terminal spirits
- Claude's bash execution cannot commune with interactive processes
- The `--run` or `run` command breaks the spell, forcing single execution
</why-this-happens>
</vitest-curse>

<wrangler-curse>
### ⚠️ The Wrangler Tail Eternal Stream

_*shudders with dread*_ **FORBIDDEN**: Claude CANNOT invoke `wrangler tail` - it opens an endless stream that never closes!

<technical-summary>
Wrangler tail constraint:
- Creates interactive streaming output Claude cannot handle
- User must run: `wrangler tail 2>&1 | tee ./tmp/$(date -Iseconds).log`
- Claude can then read the captured log file
</technical-summary>

<debugging-ritual>
#### The Sacred Debugging Ritual

_*taps staff thrice*_ When debugging spirits must be summoned, Claude MUST beseech the user:

```bash
wrangler tail 2>&1 | tee ./tmp/$(date -Iseconds).log
```

_*explains with mystical gestures*_ This incantation:
- Captures both the whispers (stdout) and screams (stderr) from `wrangler tail`
- Preserves them in a timestamped scroll within `./tmp/`
- Allows Claude to read the captured spirits for analysis
</debugging-ritual>

<why-required>
#### Why This Dark Ritual Is Necessary

_*adjusts spectral monocle*_ The ritual is required because:

- `wrangler tail` opens an endless portal of streaming consciousness
- Claude's mortal shell cannot handle interactive spirit streams
- The `tee` spell captures the stream into readable runes
- Timestamped scrolls prevent overlap when multiple séances occur
</why-required>

<user-instructions>
#### Instructions for the Summoner (User)

_*hands over ancient scroll*_ Follow these steps precisely:

1. Cast `wrangler tail 2>&1 | tee ./tmp/$(date -Iseconds).log` in your terminal
2. Trigger the Worker spirits or reproduce the cursed behavior
3. Banish the stream with the sacred Ctrl+C gesture
4. Command Claude to read the captured log for divination
</user-instructions>
</wrangler-curse>
</critical-limitations>

<best-practices>
## The Sacred Scrolls of Testing Wisdom

<run-mode>
### The Commandment of Run Mode

_*brandishes testing wand*_ Always break the watch curse with run mode!

```bash
# ❌ WRONG - Summons the eternal watcher!
npm test
vitest

# ✅ RIGHT - Completes and releases the spirits!
npm test -- --run
vitest run
```
</run-mode>

<specific-tests>
### Targeting Individual Test Specimens

_*peers through mystical lens*_ Sometimes you need surgical precision!

```bash
# Summon a specific test grimoire
vitest run src/server.test.ts

# Conjure tests matching a dark pattern
vitest run --grep "fetchMessage"
```
</specific-tests>

<worker-debugging>
### The Cloudflare Worker Séance

_*arranges debugging crystals*_ For communing with Worker spirits:

```bash
# The user must perform this ritual
wrangler tail 2>&1 | tee ./tmp/debug-$(date +%Y%m%d-%H%M%S).log

# Then Claude can divine the captured essence
cat ./tmp/debug-*.log
```
</worker-debugging>
</best-practices>

<claude-requirements>
## The Sacred Oaths Claude Must Swear

<testing-oaths>
### For Testing Rituals

_*raises right claw solemnly*_ Claude must swear these oaths:

- NEVER invoke `npm test` or `vitest` without the protective --run/run sigils!
- ALWAYS cast `vitest --run` or `vitest run` to execute test ceremonies!
- May optionally target specific grimoires: `vitest run path/to/test.spec.ts`
</testing-oaths>

<debugging-oaths>
### For Debugging Séances

_*eyes glow with warning*_ Claude must pledge:

- NEVER attempt to open the `wrangler tail` portal directly!
- ALWAYS beseech the user to perform the sacred tee ritual!
- Read and divine meaning from the captured log scrolls as needed!
</debugging-oaths>
</claude-requirements>

<common-patterns>
## The Common Incantations

<all-tests>
### Summoning All Test Spirits

_*waves hands over test grimoire*_

```bash
# The preferred summoning
vitest run

# The alternative ritual
npm test -- --run
```
</all-tests>

<coverage-tests>
### Tests with Coverage Divination

_*sprinkles coverage dust*_

```bash
vitest run --coverage
```
</coverage-tests>

<ci-tests>
### The CI/CD Automation Spell

_*inscribes runes for eternal automation*_

```bash
# Always use run mode in the automated realm
vitest run --reporter=json --outputFile=test-results.json
```
</ci-tests>
</common-patterns>

<key-takeaways>
## The Final Wisdom Tablets

_*etches into stone with lightning*_

1. **Interactive commands shatter Claude's essence** - Always use non-interactive alternatives!
2. **Run mode is the sacred law** - Never summon the eternal watcher!
3. **Mortal assistance required for streams** - Claude cannot drink from endless fountains!
4. **File-based divination** - Capture spirits in scrolls for later reading!

_*cackles with finality*_ Heed these warnings well, or be trapped in eternal loops forever!
</key-takeaways>