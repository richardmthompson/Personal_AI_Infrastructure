This information was previously in SKILL.md but was removed with the intention to potentially add back at a later date if relevant.

  === ESSENTIAL CONTACTS (Always Available) ===
  - [Primary Contact Name] [Relationship]: email@example.com
  - [Secondary Contact] [Relationship]: email@example.com
  - [Third Contact] [Relationship]: email@example.com
  Full contact list in SKILL.md extended section below

  === CORE STACK PREFERENCES (Always Active) ===
  - Primary Language: [e.g., TypeScript, Python, Rust]
  - Package managers: [e.g., bun for JS/TS, uv for Python]
  - Analysis vs Action: If asked to analyze, do analysis only - don't change things unless explicitly asked
  - Scratchpad: Use ~/.claude/scratchpad/ with timestamps for test/random tasks
  - Content Repository: All projects, skill output folders and document libraries are in ${PAI_DIR}/codex/ (see codex/CLAUDE.md)

  === CRITICAL SECURITY (Always Active) ===
  - NEVER COMMIT FROM WRONG DIRECTORY - Run `git remote -v` BEFORE every commit
  - `~/.claude/` CONTAINS EXTREMELY SENSITIVE PRIVATE DATA - NEVER commit to public repos
  - CHECK THREE TIMES before git add/commit from any directory
  - [ADD YOUR SPECIFIC WARNINGS - e.g., iCloud directory, company repos, etc.]

  === PAI SYSTEM ARCHITECTURE ===
  This description provides: core identity + essential contacts + stack preferences + critical security + response format (always in system prompt).
  Full context loaded from SKILL.md for comprehensive tasks, including:
  - Complete contact list and social media accounts
  - Voice IDs for agent routing (if using ElevenLabs)
  - Extended security procedures and infrastructure caution
  - Detailed scratchpad instructions

  === CONTEXT LOADING STRATEGY ===
  - Tier 1 (Always On): This description in system prompt (~1500-2000 tokens) - essentials immediately available
  - Tier 2 (On Demand): Read SKILL.md for full context - comprehensive details

  === WHEN TO LOAD FULL CONTEXT ===
  Load SKILL.md for: Complex multi-faceted tasks, need complete contact list, voice routing for agents, extended security procedures, or explicit comprehensive PAI context requests.


## 🚨 Extended Security Procedures

### Repository Safety (Detailed)

- **NEVER Post sensitive data to public repos** [CUSTOMIZE with your public repo paths]
- **NEVER COMMIT FROM THE WRONG DIRECTORY** - Always verify which repository
- **CHECK THE REMOTE** - Run `git remote -v` BEFORE committing
- **`~/.claude/` CONTAINS EXTREMELY SENSITIVE PRIVATE DATA** - NEVER commit to public repos
- **CHECK THREE TIMES** before git add/commit from any directory
- [ADD YOUR SPECIFIC PATH WARNINGS - e.g., "If in ~/Documents/iCloud - THIS IS MY PUBLIC DOTFILES REPO"]
- **ALWAYS COMMIT PROJECT FILES FROM THEIR OWN DIRECTORIES**
- If worried about sensitive content, prompt user explicitly for approval

### Infrastructure Caution

Be **EXTREMELY CAUTIOUS** when working with:
- AWS
- Cloudflare
- [ADD YOUR SPECIFIC INFRASTRUCTURE - GCP, Azure, DigitalOcean, etc.]
- Any core production-supporting services

Always prompt user before significantly modifying or deleting infrastructure. For GitHub, ensure save/restore points exist.
