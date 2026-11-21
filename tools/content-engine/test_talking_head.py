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

# add_broll: B-roll lands in the slots, face stays elsewhere, audio and length unchanged
from add_broll import add_broll
with tempfile.TemporaryDirectory() as t:
    T = Path(t)
    subprocess.run(["ffmpeg", "-v", "error", "-f", "lavfi", "-i", "color=red:s=270x480:d=13:r=30",
                    "-f", "lavfi", "-i", "sine=d=13", "-shortest", str(T / "reel.mp4")], check=True)
    subprocess.run(["ffmpeg", "-v", "error", "-f", "lavfi", "-i", "color=blue:s=640x360:d=5:r=30", str(T / "b.mp4")],
                   check=True)
    assert add_broll(T / "reel.mp4", [T / "b.mp4"], T / "out.mp4", 3.0) == 2
    def px(sec):
        return subprocess.check_output(["ffmpeg", "-v", "error", "-ss", str(sec), "-i", str(T / "out.mp4"),
                                        "-frames:v", "1", "-vf", "crop=2:2:134:240", "-f", "rawvideo",
                                        "-pix_fmt", "rgb24", "-"])
    assert px(1)[0] > 200 and px(4)[2] > 200 and px(7)[0] > 200 and px(10)[2] > 200 and px(12.5)[0] > 200, (px(1), px(4))
    has_a = subprocess.check_output(["ffprobe", "-v", "error", "-select_streams", "a", "-show_entries",
                                     "stream=index", "-of", "csv=p=0", str(T / "out.mp4")], text=True).strip()
    assert has_a
print("add_broll ok")

# cut_phone: landscape phone clip -> 1080x1920, length = sum of kept frames
from talking_head import cut_phone
with tempfile.TemporaryDirectory() as t:
    T = Path(t)
    subprocess.run(["ffmpeg", "-v", "error", "-f", "lavfi", "-i", "testsrc=s=640x360:d=6:r=30", str(T / "src.mp4")], check=True)
    subprocess.run(["ffmpeg", "-v", "error", "-f", "lavfi", "-i", "sine=d=6", "-ar", "48000", str(T / "a.wav")], check=True)
    cut_phone(T / "src.mp4", T / "a.wav", [(0, 30), (90, 150)], 30.0, T / "o.mp4")
    info = subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "stream=width,height,duration",
                                    "-of", "csv=p=0", str(T / "o.mp4")], text=True).split()
    assert info[0].startswith("1080,1920"), info
    assert all(abs(float(x.split(",")[-1]) - 3.0) < 0.06 for x in info), info
print("cut_phone ok")
