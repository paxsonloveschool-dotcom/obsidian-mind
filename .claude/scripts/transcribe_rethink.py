"""Transcribe the Google Rethink session videos into vault notes.

Run on a machine where Google Drive for desktop syncs restoremarketingco's Drive
(the cloud session's proxy blocks Drive downloads, and the files are 1 to 7 GB).

  pip install faster-whisper   (ffmpeg must be on PATH)
  python .claude/scripts/transcribe_rethink.py "G:/My Drive/.../Google Ads Rethink Retail Presentation"

Writes one transcript note per video into work/active/. Then a Claude session reads
those notes and fills the Tips section of work/active/Google Rethink Sessions.md.
"""
import pathlib, subprocess, sys, tempfile
from faster_whisper import WhisperModel

VIDEOS = {  # Drive file name -> note title
    "Google Rethink Pt1.mov": "Google Rethink Pt1 Transcript",
    "Google Rethink Pt2.mov": "Google Rethink Pt2 Transcript",
    "Google Rethink ROI Presentation.mov": "Google Rethink ROI Transcript",
}
OUT = pathlib.Path(__file__).resolve().parents[2] / "work" / "active"


def stamp(s):
    return f"{int(s // 3600):02d}:{int(s % 3600 // 60):02d}:{int(s % 60):02d}"


def main(folder):
    model = WhisperModel("small.en", compute_type="int8")  # shortcut: small.en is CPU friendly; use medium.en if names come out wrong
    for name, title in VIDEOS.items():
        src, note = pathlib.Path(folder) / name, OUT / f"{title}.md"
        if note.exists():
            print("skip, done:", note.name); continue
        if not src.exists():
            print("missing:", src); continue
        with tempfile.TemporaryDirectory() as tmp:
            wav = pathlib.Path(tmp) / "a.wav"
            subprocess.run(["ffmpeg", "-loglevel", "error", "-i", str(src), "-vn", "-ac", "1", "-ar", "16000", str(wav)], check=True)
            segments, _ = model.transcribe(str(wav), vad_filter=True)
            lines = [f"[{stamp(s.start)}] {s.text.strip()}" for s in segments]
        note.write_text(
            "---\n"
            "date: 2026-09-16\n"
            f"description: Raw transcript of {name} from the Google Ads Rethink Retail session, for pulling tips into Google Rethink Sessions\n"
            "tags: [work-note, transcript, google-ads]\n"
            "status: active\nquarter: Q3-2026\n"
            "---\n\n"
            f"# {title}\n\nSource: {name}. Tips pulled into [[Google Rethink Sessions]].\n\n"
            + "\n".join(lines) + "\n",
            encoding="utf-8",
        )
        print("wrote", note.name, len(lines), "lines")


if __name__ == "__main__":
    main(sys.argv[1])
