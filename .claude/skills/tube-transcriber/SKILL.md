# YouTube Transcription Skill

**Purpose:** Extract existing captions from YouTube videos (free, instant)

**Coverage:** ~80% of YouTube videos (those with auto-generated or manual captions)

**Cost:** $0 (retrieves existing captions, no speech-to-text AI)

## Quick Start

```bash
cd ~/.claude/skills/youtube-transcription
uv run transcribe.py VIDEO_ID_OR_URL
```

## When to Use

Activate this skill when the user:
- Provides a YouTube URL and wants transcription
- Requests transcript extraction, captions, or subtitles
- Wants to analyze/summarize YouTube video content

## Workflow

1. **Extract video ID** from URL (supports all YouTube URL formats)
2. **Navigate to skill directory**: `cd ~/.claude/skills/youtube-transcription`
3. **Run script**: `uv run transcribe.py VIDEO_ID`
4. **Check output**: `library/transcripts/VIDEO_ID.txt` and `.json`
5. **Perform user's requested action** (display, summarize, analyze, etc.)

## Output Location

- **Text**: `library/transcripts/VIDEO_ID.txt` (human-readable)
- **JSON**: `library/transcripts/VIDEO_ID.json` (with timestamps)

## Command Templates

**Simple transcription:**
```bash
cd skills/youtube-transcription && uv run transcribe.py "VIDEO_ID"
```

**From URL:**
```bash
cd skills/youtube-transcription && uv run transcribe.py "https://youtube.com/watch?v=VIDEO_ID"
```

**Then read the output:**
```bash
cat library/transcripts/VIDEO_ID.txt
```

## Error Handling

| Error | Meaning | Response |
|-------|---------|----------|
| `TranscriptsDisabled` | No captions available | Inform user this video doesn't have captions |
| `VideoUnavailable` | Video is private/deleted | Inform user video is unavailable |
| `NoTranscriptFound` | No transcript in any language | Inform user no captions exist |

## Common Use Cases

**Case 1: Transcribe and show**
```bash
cd /skills/youtube-transcription && \
uv run transcribe.py "VIDEO_ID" && \
cat library/transcripts/VIDEO_ID.txt
```

**Case 2: Transcribe and summarize**
1. Run transcription script
2. Read `library/transcripts/VIDEO_ID.txt`
3. Generate summary using Claude's context

**Case 3: Transcribe and search**
1. Run transcription script
2. Read `library/transcripts/VIDEO_ID.txt`
3. Search for user's requested keywords/topics

## Setup (First Time Only)

```bash
cd /skills/youtube-transcription
uv sync  # Installs youtube-transcript-api
```

## Limitations

- Only works for videos with existing captions
- Does NOT transcribe videos without captions
- Timestamp accuracy depends on YouTube's caption quality
- Rate limited to ~250 requests before throttling (use delays for batch jobs)

## For More Details

See `CLAUDE.md` for comprehensive implementation guide.
