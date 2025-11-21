# Voice Recommendations Archive

**Purpose:** This file preserves the original voice recommendations from the PAI system author for reference purposes. These are NOT active configurations - they are historical records.

**Note:** The current system uses a SINGLE voice configured in `.env`. This file is for reference only if you want to explore different voice options.

---

## ElevenLabs Voice ID Recommendations (Original)

The author originally recommended different ElevenLabs voices for different agent types. These are preserved here for reference:

### Primary Assistant
- **Voice ID:** `s3TPKV1kjDlVtZbl4Ksh`
- **Description:** Professional, conversational
- **Rationale:** Main assistant voice for general tasks

### Research Agents
- **perplexity-researcher:** `AXdMgz6evoL7OPd7eU12`
  - Description: Analytical, clear
  - Rationale: Analytical voice for research findings

- **claude-researcher:** `AXdMgz6evoL7OPd7eU12`
  - Description: Strategic, sophisticated
  - Rationale: Same as Perplexity (strategic analysis)

- **gemini-researcher:** `iLVmqjzCGGvqtMCk6vVQ`
  - Description: Multi-perspective, thorough
  - Rationale: Broader perspective voice

### Engineering Agents
- **engineer:** `fATgBRI8wg5KkDFg8vBd` OR `kmSVBPu7loj4ayNinwWM`
  - Description: Steady, professional
  - Rationale: Technical, reliable voice for development work
  - Note: Two different IDs found in different files

- **principal-engineer:** `iLVmqjzCGGvqtMCk6vVQ`
  - Description: Strategic, senior leadership
  - Rationale: More senior/strategic voice

### Design & Creative Agents
- **designer:** `ZF6FPAbjXT4488VcRRnw`
  - Description: Creative, distinct (Indian Female - Isha Premium)
  - Rationale: Creative voice for design work

- **artist:** `ZF6FPAbjXT4488VcRRnw`
  - Description: Creative, artistic
  - Rationale: Same as designer

- **writer:** `gfRt6Z3Z8aTbpLfexQ7N`
  - Description: Articulate, warm
  - Rationale: Smooth, articulate voice for content creation

### Architecture & Security
- **architect:** `muZKMsIDGYtIkjjiUS82`
  - Description: Strategic, sophisticated (UK Female - Serena Premium)
  - Rationale: High-level strategic voice

- **pentester:** `xvHLFjaUEpx4BOf7EiDd` OR `hmMWXCj9K7N5mCPcRkfC`
  - Description: Technical, sharp (UK Male - Oliver Enhanced)
  - Rationale: Sharp, technical voice for security work
  - Note: Two different IDs found in different files

### Default/Fallback
- **Default:** `jqcCZkN6Knx8BJ5TBdYR`
  - Used when agent type is unknown

---

## macOS Voice Recommendations (Legacy - Pre-Oct 2025)

Before migrating to ElevenLabs, the system used macOS Premium and Enhanced voices. These are preserved for reference:

### macOS Premium Voices (Highest Quality)
- **Jamie (Premium)** - UK Male, Professional conversational (assistant)
  - Rate: 228 wpm (1.3x multiplier)
- **Ava (Premium)** - US Female, Analytical (researcher)
  - Rate: 236 wpm (1.35x multiplier)
- **Zoe (Premium)** - US Female, Steady professional (engineer)
  - Rate: 236 wpm (1.35x multiplier)
- **Serena (Premium)** - UK Female, Strategic sophisticated (architect, writer)
  - Rate: 236 wpm (1.35x multiplier)
- **Isha (Premium)** - Indian Female, Creative distinct (designer, artist)
  - Rate: 236 wpm (1.35x multiplier)

### macOS Enhanced Voices (Good Quality)
- **Oliver (Enhanced)** - UK Male, Technical sharp (pentester)
  - Rate: 236 wpm (1.35x multiplier)
- **Tom (Enhanced)** - US Male, Steady professional (alternative engineer)
  - Rate: 236 wpm (1.35x multiplier)
- **Samantha (Enhanced)** - US Female, Articulate warm (alternative writer)
  - Rate: 236 wpm (1.35x multiplier)

### Default Speaking Rate
- Base rate: 175 wpm
- Multipliers: 1.3x to 1.5x for faster, more natural delivery

---

## Migration History

1. **Original System (Pre-Oct 2, 2025):** ElevenLabs API
2. **Oct 2, 2025 (Commit a3a132d):** Migrated to macOS Premium/Enhanced voices
   - Rationale: Cost reduction, offline processing, privacy
3. **Oct 6, 2025 (Commit 17e8b90):** Migrated BACK to ElevenLabs
   - Rationale: Likely quality, reliability, or feature requirements
   - Current authoritative implementation

---

## How to Use These Recommendations

### Finding ElevenLabs Voices
1. Browse the [ElevenLabs Voice Library](https://elevenlabs.io/voice-library)
2. Preview voices and click "Use" to get the Voice ID
3. Replace `ELEVENLABS_VOICE_ID` in your `.env` file

### Using macOS Voices (Fallback Option)
If you don't want to use ElevenLabs:
1. The system can fallback to macOS `say` command
2. List available voices: `say -v ?`
3. Test a voice: `say -v "Jamie" "Hello, this is a test"`
4. Premium voices require download (see legacy VOICE-SETUP-GUIDE.md)

---

## Current Configuration (Single Voice)

The simplified system uses ONE voice for all notifications:

**File:** `/Users/richardthompson/CODE/PAI/.env`
```bash
# ElevenLabs (Primary)
ELEVENLABS_API_KEY=your_api_key_here
ELEVENLABS_VOICE_ID=your_chosen_voice_id

# OR use macOS fallback (no API key needed)
# Just leave ELEVENLABS_API_KEY empty and system will use macOS 'say' command
```

**Benefits of single voice:**
- Simple configuration (one place)
- Consistent notifications
- Easy to change (update one variable)
- No maintenance burden
- Clear cognitive model (you know what voice to expect)

---

## Reference Files

**Original Documentation:**
- `/Users/richardthompson/CODE/PAI/.claude/documentation/voice-system.md` - Lines 59-76 (ElevenLabs table)
- `/Users/richardthompson/CODE/PAI/.claude/documentation/VOICE-SETUP-GUIDE.md` - Legacy macOS setup (deprecated)
- `/Users/richardthompson/CODE/PAI/.claude/voice-server/voices.json` - Original voice metadata (to be removed)

**Original Code:**
- `/Users/richardthompson/CODE/PAI/.claude/hooks/subagent-stop-hook.ts` - Lines 6-15 (hardcoded agent voice IDs)
- `/Users/richardthompson/CODE/PAI/.claude/hooks/stop-hook.ts` - Lines 148-167 (voice config loading)

---

**Last Updated:** 2025-11-17
**Status:** Archive - For reference only
