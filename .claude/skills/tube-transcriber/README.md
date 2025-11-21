# YouTube Transcription Skill

A PAI/Claude Code skill that extracts existing captions from YouTube videos using the free youtube-transcript-api.

## Quick Start

### 1. Install in PAI

```bash
# Copy skill to PAI installation
cp -r .claude/skills/youtube-transcription ~/.claude/skills/

# Navigate to skill directory
cd ~/.claude/skills/youtube-transcription

# Install dependencies with uv
uv sync
```

### 2. Test the Script

```bash
# From the skill directory
uv run transcribe.py dQw4w9WgXcQ

# Or from project root
cd ~/.claude/skills/youtube-transcription && uv run transcribe.py dQw4w9WgXcQ
```

### 3. Use in Claude Code

The skill will automatically activate when you provide YouTube URLs:

```
You: "Transcribe https://youtube.com/watch?v=dQw4w9WgXcQ"

Claude: [Activates youtube-transcription skill]
[Runs transcription]
[Saves to library/transcripts/dQw4w9WgXcQ.txt]
```

## Features

- **Free**: No API keys or costs
- **Fast**: Instant retrieval (1-3 seconds)
- **Simple**: Just provide a YouTube URL
- **Coverage**: ~80% of YouTube videos (those with captions)
- **Flexible**: Display, summarize, analyze, or search transcripts

## File Structure

```
youtube-transcription/
├── SKILL.md              # Quick reference (agent sees this first)
├── CLAUDE.md             # Comprehensive guide
├── README.md             # This file
├── transcribe.py         # Transcription script
├── pyproject.toml        # uv dependencies
└── .venv/               # Virtual environment (created by uv sync)
```

## Usage Examples

### Example 1: Simple Transcription

```bash
uv run transcribe.py "https://youtube.com/watch?v=dQw4w9WgXcQ"
```

Output:
```
Extracted video ID: dQw4w9WgXcQ
Fetching transcript for video ID: dQw4w9WgXcQ

================================================================================
✓ Transcription successful!
Video ID: dQw4w9WgXcQ
Duration: 3.5 minutes
Output files:
  - library/transcripts/dQw4w9WgXcQ.txt
  - library/transcripts/dQw4w9WgXcQ.json
================================================================================
```

### Example 2: Via Claude Code

```
You: "Transcribe this video and summarize it: https://youtu.be/abc123"

Claude:
1. Runs: cd ~/.claude/skills/youtube-transcription && uv run transcribe.py abc123
2. Reads: library/transcripts/abc123.txt
3. Generates summary using transcript content
```

### Example 3: Direct Script Usage

```bash
# From skill directory
cd ~/.claude/skills/youtube-transcription
uv run transcribe.py dQw4w9WgXcQ

# View results
cat library/transcripts/dQw4w9WgXcQ.txt
cat library/transcripts/dQw4w9WgXcQ.json
```

## Output Format

### Text File (library/transcripts/VIDEO_ID.txt)

Human-readable format with metadata:

```
Video ID: dQw4w9WgXcQ
Duration: 212.5 seconds (3.5 minutes)
Method: YouTube Captions (free)

================================================================================

We're no strangers to love You know the rules and so do I...
```

### JSON File (library/transcripts/VIDEO_ID.json)

Structured data with timestamps:

```json
{
  "video_id": "dQw4w9WgXcQ",
  "duration_seconds": 212.5,
  "text": "We're no strangers to love...",
  "segments": [
    {"text": "We're no strangers to love", "start": 0.0, "duration": 2.5},
    {"text": "You know the rules and so do I", "start": 2.5, "duration": 2.8}
  ]
}
```

## Supported URLs

- `https://youtube.com/watch?v=VIDEO_ID`
- `https://www.youtube.com/watch?v=VIDEO_ID`
- `https://youtu.be/VIDEO_ID`
- `https://m.youtube.com/watch?v=VIDEO_ID`
- `VIDEO_ID` (direct)

## Requirements

- **Python**: 3.8+
- **uv**: Fast Python package installer ([install](https://docs.astral.sh/uv/))
- **youtube-transcript-api**: Installed automatically via `uv sync`

## Installation

### Prerequisites

```bash
# Install uv (if not already installed)
curl -LsSf https://astral.sh/uv/install.sh | sh
```

### Install Skill

```bash
# Option 1: Copy from development directory
cp -r Research/transcribe_youtube/.claude/skills/youtube-transcription ~/.claude/skills/

# Option 2: Clone/download and copy
# [Download skill directory]
mv youtube-transcription ~/.claude/skills/

# Install dependencies
cd ~/.claude/skills/youtube-transcription
uv sync
```

### Verify Installation

```bash
# Test with a known video
cd ~/.claude/skills/youtube-transcription
uv run transcribe.py dQw4w9WgXcQ

# Check output
cat library/transcripts/dQw4w9WgXcQ.txt
```

## Troubleshooting

### "uv: command not found"

Install uv:
```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
source ~/.bashrc  # or ~/.zshrc
```

### "ImportError: No module named 'youtube_transcript_api'"

Run uv sync:
```bash
cd ~/.claude/skills/youtube-transcription
uv sync
```

### "TranscriptsDisabled" Error

The video doesn't have captions. This skill only works for videos with existing captions (auto-generated or manual).

### "VideoUnavailable" Error

Video is private, deleted, or doesn't exist. Check the URL.

### Rate Limiting

After ~250 requests, YouTube may throttle. Add 1-second delays between requests:

```python
import time
time.sleep(1)  # Between each transcription
```

## Limitations

- Only works for videos with existing captions
- Does NOT transcribe videos without captions
- Timestamp accuracy depends on YouTube's caption quality
- Rate limited to ~250 requests before throttling
- Cloud deployments may need residential proxies (YouTube blocks datacenter IPs)

## Cost

**Completely free** - retrieves existing captions rather than using paid speech-to-text APIs.

## Performance

- **Speed**: 1-3 seconds per video (instant caption retrieval)
- **Coverage**: ~80% of YouTube videos have captions
- **Cost**: $0 per transcription
- **Rate limit**: ~250 requests before throttling

## Advanced Usage

### Batch Processing

```python
import time

video_ids = ['dQw4w9WgXcQ', 'abc123', 'xyz789']

for vid in video_ids:
    # Run transcription
    os.system(f'uv run transcribe.py {vid}')
    time.sleep(1)  # Rate limiting
```

### Multi-Language

Modify `transcribe.py` to request specific languages:

```python
transcript = YouTubeTranscriptApi.get_transcript(
    video_id,
    languages=['en', 'es', 'fr']  # Preference order
)
```

## Documentation

- **SKILL.md**: Quick reference for agents
- **CLAUDE.md**: Comprehensive implementation guide
- **README.md**: This file (user documentation)

## Related Research

This skill is based on research comparing 6 YouTube transcription methods. See:

- `youtube-transcription-methods.md`: Full comparison
- `youtube-transcription-agent-guide.md`: Implementation guide

## License

Uses youtube-transcript-api (MIT License). No API keys or external services required.

## Support

For issues or questions:
1. Check `CLAUDE.md` for detailed troubleshooting
2. Review research documentation
3. Test with known working video: `dQw4w9WgXcQ`
