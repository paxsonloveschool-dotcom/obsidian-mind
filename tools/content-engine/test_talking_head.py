"""Run: python test_talking_head.py  (no Resolve needed)"""
import subprocess, tempfile
from pathlib import Path
from talking_head import keep_ranges, auto_picks, parse_picks, broll_slots, to_frames, cut_audio, AUDIO_CHAIN

W = lambda t, a, b: {"word": t, "start": a, "end": b}
words = [W("We", 0.0, 0.2), W("fix", 0.25, 0.5), W("um", 0.55, 0.8), W("roofs", 0.85, 1.2),
         W("fast.", 3.0, 3.4), W("You", 3.45, 3.6), W("know", 3.62, 3.8), W("guaranteed.", 3.85, 4.5)]
r = keep_ranges(words)
assert len(r) == 4, r                       # filler "um", 1.8 s pause and "you know" each force a cut
assert all(not (a < 0.6 < b) for a, b in r)  # "um" audio is gone
assert not any(a < 3.7 < b for a, b in r)    # "you know" is gone

segs = [{"start": i * 6.0, "end": i * 6.0 + 5.5, "text": ("So " if i == 0 else "We ") + "word " * 12,
         "words": [W("um" if i == 2 else "x", i * 6.0, i * 6.0 + 0.1)] * 14} for i in range(20)]
picks = auto_picks(segs)
assert picks and all(20 <= segs[j]["end"] - segs[i]["start"] <= 45 for i, j in picks)
assert all(not (i <= 2 <= j) for i, j in picks), picks  # line with fillers avoided
assert parse_picks("# c\nShort 1: 4-6, 9\nShort 2: 1") == {"Short 1": [4, 5, 6, 9], "Short 2": [1]}
assert broll_slots(15) == [(3.0, 6.0), (9.0, 12.0)]
assert to_frames([(0.0, 1.0)], 24) == [(0, 24)]

with tempfile.TemporaryDirectory() as t:  # mic cleanup holds loudness and survives a clipped input
    raw, clean, cut = Path(t, "raw.wav"), Path(t, "clean.wav"), Path(t, "cut.wav")
    subprocess.run(["ffmpeg", "-v", "error", "-f", "lavfi", "-i", "sine=f=220:d=6", "-af", "volume=12",
                    str(raw)], check=True)
    subprocess.run(["ffmpeg", "-v", "error", "-i", str(raw), "-af", AUDIO_CHAIN, "-ar", "48000", str(clean)], check=True)
    log = subprocess.run(["ffmpeg", "-i", str(clean), "-af", "ebur128=peak=true", "-f", "null", "-"],
                         capture_output=True, text=True).stderr
    lufs = float(log.rsplit("I:", 1)[1].split()[0])
    assert -16 < lufs < -12, lufs
    cut_audio(clean, [(24, 48), (96, 120)], 24, cut)  # two 1 s pieces
    dur = float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration",
                                         "-of", "csv=p=0", str(cut)], text=True))
    assert abs(dur - 2.0) < 0.03, dur
print("ok")
