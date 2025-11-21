#!/usr/bin/env python3
"""
YouTube Transcription Script
Uses youtube-transcript-api to retrieve existing captions (free, no API key needed)
"""

import sys
import json
from pathlib import Path
from typing import Dict, List, Optional


def extract_video_id(url_or_id: str) -> str:
    """
    Extract video ID from various YouTube URL formats or return as-is if already an ID

    Supports:
    - https://youtube.com/watch?v=VIDEO_ID
    - https://www.youtube.com/watch?v=VIDEO_ID
    - https://youtu.be/VIDEO_ID
    - https://m.youtube.com/watch?v=VIDEO_ID
    - VIDEO_ID (direct)
    """
    url_or_id = url_or_id.strip()

    # If it's already a video ID (11 characters, no special chars), return it
    if len(url_or_id) == 11 and url_or_id.isalnum():
        return url_or_id

    # Extract from URL
    if 'youtu.be/' in url_or_id:
        # Format: https://youtu.be/VIDEO_ID
        return url_or_id.split('youtu.be/')[-1].split('?')[0].split('&')[0]
    elif 'watch?v=' in url_or_id:
        # Format: https://youtube.com/watch?v=VIDEO_ID
        return url_or_id.split('watch?v=')[-1].split('&')[0]
    else:
        # Assume it's already a video ID
        return url_or_id


def transcribe_youtube(video_id: str) -> Dict:
    """
    Fetch transcript from YouTube using youtube-transcript-api

    This function returns the following :
    return {
        'success': True = bool,
        'video_id': video_id = str,
        'text': text = str,
        'segments': transcript = FetchedTranscript()
    }

    Returns:
        FetchedTranscript(
            snippets=[
                FetchedTranscriptSnippet(
                    text="Hey there",
                    start=0.0,
                    duration=1.54,
                ),
                FetchedTranscriptSnippet(
                    text="how are you",
                    start=1.54,
                    duration=4.16,
                ),
                # ...
            ],
            video_id="12345",
            language="English",
            language_code="en",
            is_generated=False,
        )        
    """
    try:
        from youtube_transcript_api import YouTubeTranscriptApi
        from youtube_transcript_api import (
            TranscriptsDisabled,
            NoTranscriptFound,
            VideoUnavailable
        )

        print(f"Fetching transcript for video ID: {video_id}")

        # Create API instance and fetch transcript
        api = YouTubeTranscriptApi()
        transcript = api.fetch(video_id)

        if not transcript:
            return {
                'success': False,
                'video_id': video_id,
                'error': 'No transcript data returned'
            }

        """
        need to accumulate:
            FetchedTranscript(snippets[FetchedTranscriptSnippet(text).all])
        """ 
        # Calculate duration
        # duration = transcript[-1]['start'] + transcript[-1]['duration']

        # Combine text
        snippets = transcript.snippets
        text = ' '.join(snippet.text for snippet in snippets)

        return {
            'success': True,
            'video_id': video_id,
            'text': text,
            #'duration_seconds': duration,
            'segments': transcript
        }

    except TranscriptsDisabled:
        return {
            'success': False,
            'video_id': video_id,
            'error': 'TranscriptsDisabled: This video does not have captions available.'
        }
    except NoTranscriptFound:
        return {
            'success': False,
            'video_id': video_id,
            'error': 'NoTranscriptFound: No transcript found in any language for this video.'
        }
    except VideoUnavailable:
        return {
            'success': False,
            'video_id': video_id,
            'error': 'VideoUnavailable: Video is unavailable, private, or does not exist.'
        }
    except ImportError:
        return {
            'success': False,
            'video_id': video_id,
            'error': 'ImportError: youtube-transcript-api not installed. Run: uv sync'
        }
    except Exception as e:
        return {
            'success': False,
            'video_id': video_id,
            'error': f'Unexpected error: {str(e)}'
        }


def save_transcript(result: Dict, output_dir: Path) -> Optional[Path]:
    """
    Save transcript to text and JSON files

    Returns:
        Path to the text file if successful, None otherwise
    """
    if not result['success']:
        return None

    # Ensure output directory exists
    output_dir.mkdir(parents=True, exist_ok=True)

    video_id = result['video_id']

    # Save human-readable text file
    text_file = output_dir / f'{video_id}.txt'
    with open(text_file, 'w', encoding='utf-8') as f:
        f.write(f"Video ID: {video_id}\n")
        #f.write(f"Duration: {result['duration_seconds']:.1f} seconds ({result['duration_seconds']/60:.1f} minutes)\n")
        f.write(f"Method: YouTube Captions (free)\n")
        f.write(f"\n{'='*80}\n\n")
        f.write(result['text'])

    # Save JSON with metadata and timestamps
    """
    json_file = output_dir / f'{video_id}.json'
    with open(json_file, 'w', encoding='utf-8') as f:
        json.dump({
            'video_id': result['video_id'],
            #'duration_seconds': result['duration_seconds'],
            'text': result['text'],
            'segments': result['segments']
        }, f, indent=2, ensure_ascii=False)
    """

    return text_file


def main():
    """Main execution"""
    if len(sys.argv) < 2:
        print("Usage: uv run transcribe.py <VIDEO_ID or URL>")
        print("\nExamples:")
        print("  uv run transcribe.py dQw4w9WgXcQ")
        print("  uv run transcribe.py https://youtube.com/watch?v=dQw4w9WgXcQ")
        print("  uv run transcribe.py https://youtu.be/dQw4w9WgXcQ")
        sys.exit(1)

    # Extract video ID from argument
    input_arg = sys.argv[1]
    video_id = extract_video_id(input_arg)

    print(f"Extracted video ID: {video_id}")

    # Transcribe
    result = transcribe_youtube(video_id)

    # Output directory (relative to script execution location)
    output_dir = Path('../../codex/library/transcripts')

    if result['success']:
        # Save transcript
        text_file = save_transcript(result, output_dir)

        # Print success message
        print(f"\n{'='*80}")
        print("✓ Transcription successful!")
        print(f"Video ID: {result['video_id']}")
        #print(f"Duration: {result['duration_seconds']/60:.1f} minutes")
        print(f"Output files:")
        print(f"  - {text_file}")
        print(f"  - {text_file.with_suffix('.json')}")
        print(f"{'='*80}\n")

        sys.exit(0)
    else:
        # Print error message
        print(f"\n{'='*80}")
        print("✗ Transcription failed")
        print(f"Video ID: {result['video_id']}")
        print(f"Error: {result['error']}")
        print(f"{'='*80}\n")

        sys.exit(1)


if __name__ == '__main__':
    main()
