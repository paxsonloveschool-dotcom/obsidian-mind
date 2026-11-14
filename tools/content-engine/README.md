# Content engine: finish shorts

Revenue bucket: CLIENT_DELIVERABLES. Tag: RESTORE.

Takes cut and graded 9:16 shorts and makes them post ready: dead air removed, one shared look, bold burned captions, music bed, web loudness (-14 LUFS, -1 dBTP), 1080x1920 at 30 fps.

## Run on the black PC (Dropbox synced)

Needs Python 3 and ffmpeg on PATH. Whisper (`pip install openai-whisper`) is only needed for clips with talking and no .srt.

```bat
python finish_shorts.py "D:\Dropbox\Restore Marketing\Clients\Revive Roofing\Edited Videos\Reels 9x16" "D:\Dropbox\Restore Marketing\Clients\Revive Roofing\Edited Videos\Ready to Post" --music "D:\Music\licensed_bed.mp3"
```

Fix the Dropbox root to match the PC. Add `--lut house_look.cube` to force one look across every short; leave it off to keep the Resolve grade.

## What it does per clip

1. Silence cut: drops quiet stretches over 0.6 s when the clip has audio. Silent b-roll is untouched.
2. Captions: burns `<clip name>.srt` above the app buttons and re-times it to match the cuts. No .srt plus talking audio means Whisper writes one.
3. Music: loops the bed under the clip. Voice clips get the bed at low volume.
4. Writes the finished MP4 plus its .srt to the out folder. Never touches the inputs. Reruns skip finished files.

## Revive notes

- The 5 Revive shorts have no camera audio, so silence cut does nothing on them. They need captions and music.
- The music track and license are still open. Without `--music` the shorts come out silent.
- The earlier shorts plan said "do not burn captions". This tool burns them because burned captions are what was asked for on Nov 14. The .srt also ships beside each MP4.
- Organic posting only. Nothing gets posted without the owner's yes.
