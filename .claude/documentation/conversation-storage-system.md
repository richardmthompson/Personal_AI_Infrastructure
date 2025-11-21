# VOX Conversation Storage System

## Overview

VOX uses a **dual storage architecture** for conversation history, combining Claude Code's native global storage with a custom project-local capture system. This provides both standard Claude Code functionality (`--resume`) and enhanced project-specific history tracking.

## Architecture

### Dual Storage System

```
┌─────────────────────────────────────────────────────────────┐
│                    VOX Storage Architecture                  │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────────────┐  ┌──────────────────────────┐ │
│  │   Global Claude Code     │  │  Project-Local VOX       │ │
│  │   Storage (Standard)     │  │  Storage (Custom)        │ │
│  └──────────────────────────┘  └──────────────────────────┘ │
│              │                            │                  │
│              │                            │                  │
│              ▼                            ▼                  │
│   ~/.claude/                   PAI/.claude/                 │
│   ├── history.jsonl            ├── history/                 │
│   └── projects/                │   ├── raw-outputs/         │
│       └── -Users-...PAI/       │   │   └── YYYY-MM/         │
│           └── [sessions]       │   │       └── YYYY-MM-DD_  │
│                                │   │           all-events.  │
│                                │   │           jsonl        │
│                                │   └── [summaries].md       │
│                                └── hooks/                   │
│                                    └── [capture hooks]      │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## Storage Locations

### 1. Global Claude Code Storage (Standard)

**Purpose**: Powers `claude --resume` functionality and standard Claude Code features.

**Location**: `~/.claude/`

**Structure**:
```
~/.claude/
├── history.jsonl                           # Master conversation history
├── projects/
│   └── -Users-richardthompson-CODE-PAI/    # Encoded project path
│       ├── [session-uuid-1].jsonl          # Individual session
│       ├── [session-uuid-2].jsonl          # Individual session
│       └── ...                             # 77+ sessions stored
├── file-history/                           # File change tracking
├── session-env/                            # Session environments
├── shell-snapshots/                        # Shell state snapshots
└── todos/                                  # Todo list snapshots
```

**Key Features**:
- **Automatic**: All sessions saved by Claude Code
- **Project-encoded paths**: Directory names use `-` separated encoding
- **Resume support**: Powers `claude --resume` command
- **Persistent**: Survives application restarts
- **JSONL format**: Line-delimited JSON for each event

**Example Session Path**:
```
~/.claude/projects/-Users-richardthompson-CODE-PAI/abc123-session.jsonl
```

### 2. Project-Local VOX Storage (Custom)

**Purpose**: Enhanced project-specific history with custom organization and hooks.

**Location**: `/Users/richardthompson/CODE/PAI/.claude/history/`

**Structure**:
```
.claude/history/
├── raw-outputs/
│   └── 2025-11/
│       ├── 2025-11-16_all-events.jsonl    # Daily session events
│       ├── 2025-11-17_all-events.jsonl
│       ├── 2025-11-18_all-events.jsonl
│       ├── 2025-11-19_all-events.jsonl
│       └── 2025-11-20_all-events.jsonl
├── 2025-11-19-hooks-investigation-session-2.md  # Session summaries
└── upgrades/                               # System upgrade logs
```

**Key Features**:
- **Custom capture**: Via hooks in `.claude/hooks/`
- **Date-organized**: `YYYY-MM/YYYY-MM-DD_all-events.jsonl`
- **Project-local**: Stored within project directory
- **Hook-driven**: Captured by `initialize-pai-session.ts` and related hooks
- **Summaries**: Human-readable markdown session summaries
- **Version controlled**: Can be committed with project

**Captured By**:
- `.claude/hooks/initialize-pai-session.ts` - Session initialization
- `.claude/hooks/stop-hook.ts` - Session cleanup/summary
- Custom event capture hooks

## Accessing Conversations

### Method 1: Standard Claude Code Resume

**Interactive List (Last 3 Sessions)**:
```bash
claude --resume
# or
claude -r
```

**Continue Most Recent**:
```bash
claude --continue
# or
claude -c
```

**Specific Session by ID**:
```bash
claude --resume <session-uuid>
```

**Data Source**: `~/.claude/projects/-Users-richardthompson-CODE-PAI/`

**Limitation**: Interactive picker only shows last 3 sessions (though all are stored)

### Method 2: VOX Project-Local History

**View Daily Events**:
```bash
# List all captured sessions
ls -la .claude/history/raw-outputs/2025-11/

# View specific day's events
cat .claude/history/raw-outputs/2025-11/2025-11-21_all-events.jsonl | jq '.'

# Search for specific content
grep -i "search term" .claude/history/raw-outputs/2025-11/*.jsonl
```

**View Session Summaries**:
```bash
# List summaries
ls .claude/history/*.md

# Read specific summary
cat .claude/history/2025-11-19-hooks-investigation-session-2.md
```

**Data Source**: `.claude/history/`

### Method 3: Direct File Access

**Global Storage**:
```bash
# View master history
cat ~/.claude/history.jsonl | head -20

# List all PAI sessions
ls -la ~/.claude/projects/-Users-richardthompson-CODE-PAI/

# Count total sessions
ls ~/.claude/projects/-Users-richardthompson-CODE-PAI/ | wc -l
```

**Local Storage**:
```bash
# Find all session files
find .claude/history -name "*.jsonl"

# Get file sizes
du -h .claude/history/raw-outputs/2025-11/*
```

## File Formats

### JSONL Format (Both Systems)

Each line is a complete JSON object representing an event:

```json
{"type": "user_message", "content": "How do I...", "timestamp": "..."}
{"type": "assistant_message", "content": "You can...", "timestamp": "..."}
{"type": "tool_use", "tool": "Read", "params": {...}, "timestamp": "..."}
```

**Advantages**:
- Line-by-line processing
- Append-only (crash-safe)
- Easy to parse with `jq` or similar tools
- Streamable for large files

### Markdown Summaries (VOX Custom)

Human-readable session summaries:

```markdown
# Session: 2025-11-19 - Hooks Investigation

## Context
Working on understanding and improving the PAI hook system...

## Key Actions
1. Investigated hook execution flow
2. ...

## Outcomes
- Successfully documented hook behavior
- ...
```

## Hook Integration

### Session Capture Hooks

**initialize-pai-session.ts** (SessionStart hook):
```typescript
// Runs at session start
// - Loads VOX core context
// - Sets up session environment
// - Sends voice notification
// - Initializes local history capture
```

**stop-hook.ts** (SessionStop hook):
```typescript
// Runs at session end
// - Captures final session state
// - Generates session summary
// - Writes to local history
// - Cleanup temporary files
```

**Location**: `.claude/hooks/`

**Configuration**: Set in `.claude/settings.json`:
```json
{
  "hooks": {
    "SessionStart": [".claude/hooks/initialize-pai-session.ts"],
    "SessionStop": [".claude/hooks/stop-hook.ts"]
  }
}
```

## Data Flow

### Session Lifecycle

```
┌─────────────────────────────────────────────────────────────┐
│                    Session Lifecycle                         │
└─────────────────────────────────────────────────────────────┘

1. Session Start
   ↓
   initialize-pai-session.ts (hook)
   ↓
   - Create session UUID
   - Initialize global storage: ~/.claude/projects/-Users-.../[uuid].jsonl
   - Initialize local storage: .claude/history/raw-outputs/YYYY-MM/YYYY-MM-DD_all-events.jsonl
   ↓

2. Conversation Events
   ↓
   For each event (user message, tool use, response):
   ├─→ Write to global: ~/.claude/history.jsonl (append)
   ├─→ Write to project: ~/.claude/projects/.../[uuid].jsonl (append)
   └─→ Write to local: .claude/history/raw-outputs/.../YYYY-MM-DD_all-events.jsonl (append)
   ↓

3. Session End
   ↓
   stop-hook.ts (hook)
   ↓
   - Finalize session files
   - Generate markdown summary: .claude/history/YYYY-MM-DD-[description].md
   - Cleanup temporary state
   ↓

4. Access Later
   ↓
   ├─→ claude --resume (uses global storage)
   └─→ cat .claude/history/... (uses local storage)
```

### Redundancy & Reliability

**Data Redundancy**: Every conversation is stored in **3 places**:
1. Global master: `~/.claude/history.jsonl`
2. Global project: `~/.claude/projects/-Users-.../[uuid].jsonl`
3. Local VOX: `.claude/history/raw-outputs/YYYY-MM/YYYY-MM-DD_all-events.jsonl`

**Benefits**:
- **No data loss**: Multiple copies ensure persistence
- **Flexibility**: Access via standard or custom methods
- **Project portability**: Local copy travels with project
- **Version control**: Can commit local history to git
- **Offline access**: Local copy available without global config

## Storage Statistics

### Current Usage (as of 2025-11-21)

**Global Storage**:
- Total PAI sessions: 77 files
- Master history: 630KB (`~/.claude/history.jsonl`)

**Local Storage** (November 2025):
- 2025-11-16: 1.0MB
- 2025-11-17: 2.6MB
- 2025-11-18: 708KB
- 2025-11-19: 854KB
- 2025-11-20: 2.2MB
- **Total**: ~7.4MB for 5 days

**Projection**: ~45MB/month for active daily use

## Best Practices

### 1. Searching Conversations

**Quick search in local history**:
```bash
# Search current month
grep -r "search term" .claude/history/raw-outputs/$(date +%Y-%m)/

# Search all history with context
grep -r -C 3 "search term" .claude/history/
```

**Search global history**:
```bash
# Search all PAI sessions
grep -r "search term" ~/.claude/projects/-Users-richardthompson-CODE-PAI/
```

### 2. Backing Up Conversations

**Local history (recommended)**:
```bash
# Already version controlled with project
git add .claude/history/
git commit -m "Backup conversation history"
```

**Global history**:
```bash
# Backup entire Claude Code config
tar -czf claude-backup-$(date +%Y-%m-%d).tar.gz ~/.claude/

# Or just PAI sessions
tar -czf pai-sessions-backup.tar.gz ~/.claude/projects/-Users-richardthompson-CODE-PAI/
```

### 3. Cleaning Old Sessions

**Local cleanup** (be careful!):
```bash
# Remove sessions older than 90 days
find .claude/history/raw-outputs -name "*.jsonl" -mtime +90 -delete
```

**Global cleanup**:
```bash
# Claude Code manages this automatically
# Manual cleanup not recommended
```

### 4. Exporting Conversations

**Export to readable format**:
```bash
# Convert JSONL to readable text
cat .claude/history/raw-outputs/2025-11/2025-11-21_all-events.jsonl | \
  jq -r '.content' > conversation-export.txt

# Pretty-print JSON
cat session.jsonl | jq '.' > session-pretty.json
```

## Troubleshooting

### Issue: Can't find a conversation

**Solution**:
```bash
# 1. Check if it's in recent 3 (via resume)
claude --resume

# 2. Search global storage by date
ls -lt ~/.claude/projects/-Users-richardthompson-CODE-PAI/ | head -20

# 3. Search local storage
ls -lt .claude/history/raw-outputs/2025-11/

# 4. Search by content
grep -r "unique phrase from conversation" .claude/history/
```

### Issue: Resume shows wrong project

**Cause**: Project path renamed or moved

**Solution**:
```bash
# Find current project encoding
pwd | sed 's/\//-/g' | sed 's/^-//'
# Example output: Users-richardthompson-CODE-PAI

# Check if directory exists
ls ~/.claude/projects/ | grep PAI

# Rename if needed (advanced)
mv ~/.claude/projects/OLD-PATH ~/.claude/projects/NEW-PATH
```

### Issue: Local history not being captured

**Check**:
```bash
# 1. Verify hooks are configured
cat .claude/settings.json | grep -A 5 hooks

# 2. Check hooks exist and are executable
ls -la .claude/hooks/initialize-pai-session.ts
ls -la .claude/hooks/stop-hook.ts

# 3. Test hook manually
bun .claude/hooks/initialize-pai-session.ts

# 4. Check for errors in last session
tail -50 ~/.claude/debug/latest.log
```

### Issue: Storage growing too large

**Monitor**:
```bash
# Check global storage size
du -sh ~/.claude/

# Check local storage size
du -sh .claude/history/

# Find largest sessions
du -h .claude/history/raw-outputs/2025-11/* | sort -rh | head -10
```

**Optimize**:
```bash
# Compress old sessions
gzip .claude/history/raw-outputs/2025-10/*.jsonl

# Archive to separate location
tar -czf history-archive-2025-10.tar.gz .claude/history/raw-outputs/2025-10/
rm -rf .claude/history/raw-outputs/2025-10/
```

## Advanced Usage

### Custom Session Queries

**Find sessions by date range**:
```bash
# Local storage (by filename)
ls .claude/history/raw-outputs/2025-11/ | \
  awk -F_ '/2025-11-1[5-9]/ {print $1}'

# Global storage (by modification time)
find ~/.claude/projects/-Users-richardthompson-CODE-PAI/ \
  -type f -newermt "2025-11-15" ! -newermt "2025-11-20"
```

**Extract specific types of events**:
```bash
# All tool uses
cat session.jsonl | jq 'select(.type == "tool_use")'

# All errors
cat session.jsonl | jq 'select(.type == "error")'

# All user messages
cat session.jsonl | jq 'select(.type == "user_message") | .content'
```

### Session Analysis

**Count messages per session**:
```bash
cat session.jsonl | jq -s 'group_by(.type) | map({type: .[0].type, count: length})'
```

**Calculate session duration**:
```bash
# Extract first and last timestamp
cat session.jsonl | jq -r '.timestamp' | (read first; tail -1 | xargs -I {} bash -c "date -d {} +%s - date -d $first +%s | bc")
```

## Future Enhancements

### Planned Features

1. **Session Browser UI**: Web interface for browsing conversations
2. **Advanced Search**: Full-text search across all sessions
3. **Session Tags**: Categorize and tag conversations
4. **Export Formats**: PDF, HTML, Markdown exports
5. **Analytics Dashboard**: Session metrics and insights
6. **Automatic Summaries**: AI-generated session summaries
7. **Session Replay**: Replay conversation step-by-step
8. **Cross-session Search**: Search across multiple sessions simultaneously

### Experimental Ideas

- **Vector Search**: Semantic search using embeddings
- **Session Merge**: Combine related sessions
- **Conversation Templates**: Start sessions from templates
- **Session Branching**: Fork conversations at specific points
- **Collaborative Sessions**: Share sessions with team members
- **Session Encryption**: Encrypted storage for sensitive conversations

## Related Documentation

- [Hook System](./hook-system.md) - How hooks capture session data
- [Architecture](./architecture.md) - Overall VOX system architecture
- [UFC Context System](./ufc-context-system.md) - Context loading and management

---

**Document Version**: 1.0.0
**Last Updated**: 2025-11-21
**Maintained by**: Richard M. Thompson (VOX Creator)
**System**: VOX (formerly PAI) - Personal AI Infrastructure
