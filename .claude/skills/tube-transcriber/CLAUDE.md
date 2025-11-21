# YouTube Transcription Skill - Comprehensive Guide

## Overview

This skill provides YouTube video transcription capabilities by extracting existing captions using the `youtube-transcript-api` library. It's completely free, instant, and works for approximately 80% of YouTube videos that have auto-generated or manual captions.

## Architecture

### How It Works

```
YouTube URL → Extract Video ID → Fetch Captions → Save to library/transcripts/
```

1. **Input**: User provides YouTube URL or video ID
2. **Extraction**: Parse video ID from various URL formats
3. **API Call**: Retrieve existing captions via youtube-transcript-api
4. **Storage**: Save as both human-readable text and structured JSON
5. **Response**: Perform user's requested action (display, analyze, summarize, etc.)

### Why This Approach?

**Free Caption Extraction vs. Paid Speech-to-Text:**

- **youtube-transcript-api**: $0, instant, retrieves existing captions
- **Whisper API**: $0.006/min, requires audio download + processing
- **AssemblyAI**: $0.37/hour, requires audio download + processing

**Coverage:**
- 80% of YouTube videos have captions (auto-generated or manual)
- For the 20% without captions, this skill returns a clear error message

## Implementation Details

### Script: transcribe.py

**Location:** `~/.claude/skills/youtube-transcription/transcribe.py`

**Key Functions:**

1. `extract_video_id(url_or_id: str) -> str`
   - Parses various YouTube URL formats
   - Supports: youtube.com/watch?v=, youtu.be/, m.youtube.com
   - Returns 11-character video ID

2. `transcribe_youtube(video_id: str) -> Dict`
   - Fetches transcript using youtube-transcript-api
   - Returns structured result with success status, text, duration, segments
   - Handles all error cases gracefully

3. `save_transcript(result: Dict, output_dir: Path) -> Optional[Path]`
   - Saves to `library/transcripts/VIDEO_ID.txt` (human-readable)
   - Saves to `library/transcripts/VIDEO_ID.json` (with timestamps)
   - Creates directories if they don't exist

### Dependencies

**Managed via uv + pyproject.toml:**

```toml
dependencies = [
    "youtube-transcript-api>=0.6.0",
]
```

**Installation:**
```bash
cd ~/.claude/skills/youtube-transcription
uv sync
```

## Usage Patterns

### Pattern 1: Simple Transcription

**User Request:** "Transcribe https://youtube.com/watch?v=dQw4w9WgXcQ"

**Agent Actions:**
1. Extract video_id = "dQw4w9WgXcQ"
2. Run: `cd ~/.claude/skills/youtube-transcription && uv run transcribe.py dQw4w9WgXcQ`
3. Confirm: "Transcript saved to library/transcripts/dQw4w9WgXcQ.txt"

### Pattern 2: Transcribe and Display

**User Request:** "Transcribe this video and show me: https://youtu.be/abc123"

**Agent Actions:**
1. Extract video_id = "abc123"
2. Run: `cd ~/.claude/skills/youtube-transcription && uv run transcribe.py abc123`
3. Read: `cat library/transcripts/abc123.txt`
4. Display the full transcript to user

### Pattern 3: Transcribe and Analyze

**User Request:** "Transcribe this video and summarize the main points: [URL]"

**Agent Actions:**
1. Extract video_id
2. Run transcription script
3. Read transcript from `library/transcripts/VIDEO_ID.txt`
4. Use Claude's context to generate summary
5. Return summary to user

### Pattern 4: Transcribe and Search

**User Request:** "Transcribe this video and find all mentions of 'API': [URL]"

**Agent Actions:**
1. Run transcription
2. Read transcript
3. Search for "API" mentions
4. Return results with context

## Output Format

### Text File (library/transcripts/VIDEO_ID.txt)

```
Video ID: dQw4w9WgXcQ
Duration: 212.5 seconds (3.5 minutes)
Method: YouTube Captions (free)

================================================================================

[Full transcript text here, joined with spaces]
```

### JSON File (library/transcripts/VIDEO_ID.json)

```json
{
  "video_id": "dQw4w9WgXcQ",
  "duration_seconds": 212.5,
  "text": "Full transcript text...",
  "segments": [
    {
      "text": "We're no strangers to love",
      "start": 0.0,
      "duration": 2.5
    },
    ...
  ]
}
```

## Error Handling

### TranscriptsDisabled

**Cause:** Video does not have captions enabled

**Agent Response:**
```
This video does not have captions available. This skill only works for
videos with existing captions (auto-generated or manual).
```

### NoTranscriptFound

**Cause:** No transcript available in any language

**Agent Response:**
```
No transcript found for this video in any language.
```

### VideoUnavailable

**Cause:** Video is private, deleted, or doesn't exist

**Agent Response:**
```
Video is unavailable, private, or does not exist. Please check the URL.
```

### ImportError

**Cause:** youtube-transcript-api not installed

**Agent Response:**
```
Dependencies not installed. Run: cd ~/.claude/skills/youtube-transcription && uv sync
```

## Supported URL Formats

All of these are supported:

- `https://youtube.com/watch?v=dQw4w9WgXcQ`
- `https://www.youtube.com/watch?v=dQw4w9WgXcQ`
- `https://youtu.be/dQw4w9WgXcQ`
- `https://m.youtube.com/watch?v=dQw4w9WgXcQ`
- `dQw4w9WgXcQ` (direct video ID)

## Advanced Features

### Multi-Language Support

The youtube-transcript-api supports 99+ languages. To request specific languages:

```python
# In transcribe.py, modify the get_transcript call:
transcript = YouTubeTranscriptApi.get_transcript(
    video_id,
    languages=['en', 'es', 'fr']  # Preference order
)
```

### Translation

To translate existing transcripts:

```python
from youtube_transcript_api import YouTubeTranscriptApi

transcript_list = YouTubeTranscriptApi.list_transcripts(video_id)
transcript = transcript_list.find_transcript(['en'])
translated = transcript.translate('es')
```

### Batch Processing

For processing multiple videos, add rate limiting:

```python
import time

for video_id in video_ids:
    transcribe_youtube(video_id)
    time.sleep(1)  # 1 second delay to avoid rate limiting
```

## Performance

### Speed
- **Instant**: Retrieves existing captions (no processing time)
- **Network-bound**: Limited by YouTube API response time (~1-3 seconds)

### Rate Limits
- **Unofficial API**: ~250 requests before potential throttling
- **Mitigation**: Add 1-second delays between requests
- **Cloud deployment**: May need residential proxies (YouTube blocks datacenter IPs)

### Coverage
- **80%** of YouTube videos have captions (free tier)
- **20%** require paid speech-to-text services (outside this skill's scope)

## Troubleshooting

### Script doesn't run

**Check uv installation:**
```bash
uv --version
```

**Re-sync dependencies:**
```bash
cd ~/.claude/skills/youtube-transcription
uv sync
```

### "Command not found: uv run"

**Install uv:**
```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

### Output directory not created

**Check permissions:**
```bash
mkdir -p library/transcripts
ls -la library/
```

### Rate limiting errors

**Add delays between requests:**
- For batch processing, add `time.sleep(1)` between calls
- Limit to ~50 requests per minute

### Cloud deployment issues (AWS, GCP, etc.)

**YouTube blocks datacenter IPs:**
- Use residential proxy service (e.g., WebShare, BrightData)
- Or deploy to Vercel/Cloudflare Workers (edge networks)

## Maintenance

### Updating Dependencies

```bash
cd ~/.claude/skills/youtube-transcription
uv sync --upgrade
```

### Testing

```bash
# Test with a known video
cd ~/.claude/skills/youtube-transcription
uv run transcribe.py dQw4w9WgXcQ

# Verify output
cat library/transcripts/dQw4w9WgXcQ.txt
```

## Future Enhancements

Potential improvements:

1. **Caching**: Avoid re-fetching already transcribed videos
2. **Subtitle formats**: Export as SRT, VTT, WebVTT
3. **Playlist support**: Transcribe entire playlists
4. **Language detection**: Auto-detect and list available languages
5. **Timestamp search**: Find specific moments in videos
6. **Speaker identification**: Parse speaker labels (if available)

## Related Skills

- **research-bot**: Use transcripts for research compilation
- **summarization**: Summarize long video transcripts
- **search**: Search across multiple video transcripts

## Resources

### Documentation
- youtube-transcript-api: https://pypi.org/project/youtube-transcript-api/
- uv documentation: https://docs.astral.sh/uv/

### Research Files
- `youtube-transcription-methods.md`: Comparison of 6 transcription methods
- `youtube-transcription-agent-guide.md`: Original implementation guide
- `README.md`: User-facing setup instructions

## Cost Analysis

### This Skill (Free)
- **Per video**: $0
- **Per 1000 videos**: $0
- **Limitation**: Only works for videos with captions

### Alternatives (Paid)
- **Whisper API**: $0.006/min ($0.36/hour)
- **AssemblyAI**: $0.37/hour
- **Google Speech-to-Text**: $1.44/hour

### Break-Even Analysis
- If 80% of your videos have captions, this skill saves ~$288 per 1000 videos
- For high-volume usage (>750 hours/month), consider self-hosted Whisper

## License & Attribution

This skill uses:
- **youtube-transcript-api** (MIT License)
- **uv** (MIT or Apache 2.0)

No API keys or external services required.
