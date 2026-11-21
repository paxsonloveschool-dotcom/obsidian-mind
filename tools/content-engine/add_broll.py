"""Put a new B-roll shot every 3 s on finished vertical talking reels (ffmpeg only, no Resolve).

  python add_broll.py "<reels folder>" "<client B-Roll folder>" "<out folder>" [--every 3]

Face for the first 3 s (the hook), then 3 s B-roll, 3 s face, and so on. The speaker's audio
is untouched. B-roll is center cropped to 9:16 and each shot is used once before any repeats.
Matching .srt files from the sibling "Web with captions" folder are copied beside the output so
finish_shorts.py can burn captions on top afterwards. Existing outputs are skipped.
"""
import argparse, shutil, subprocess, sys
from pathlib import Path
from talking_head import broll_slots


def probe(f, entry):
    return subprocess.check_output(["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries", entry,
                                    "-of", "csv=p=0", str(f)], text=True).strip().split(",")


def add_broll(reel, broll, out, every, start=0):
    w, h = probe(reel, "stream=width,height")
    dur = float(probe(reel, "format=duration")[0])
    slots = broll_slots(dur, every, every)
    ins, chain, last = ["-i", str(reel)], [], "[0:v]"
    for k, (s, e) in enumerate(slots):
        clip = broll[(start + k) % len(broll)]
        cdur = float(probe(clip, "format=duration")[0])
        off = max(0.0, (cdur - (e - s)) / 2)  # middle of the shot
        ins += ["-ss", f"{off:.3f}", "-t", f"{e - s:.3f}", "-i", str(clip)]
        chain.append(f"[{k + 1}:v]scale={w}:{h}:force_original_aspect_ratio=increase,crop={w}:{h},"
                     f"setsar=1,setpts=PTS-STARTPTS+{s:.3f}/TB[b{k}]")
        chain.append(f"{last}[b{k}]overlay=eof_action=pass:enable='between(t,{s:.3f},{e:.3f})'[v{k}]")
        last = f"[v{k}]"
    cmd = ["ffmpeg", "-y", "-v", "error", *ins]
    if slots:
        cmd += ["-filter_complex", ";".join(chain), "-map", last]
    else:
        cmd += ["-map", "0:v"]
    cmd += ["-map", "0:a?", "-c:v", "libx264", "-crf", "18", "-preset", "medium", "-pix_fmt", "yuv420p",
            "-c:a", "copy", str(out)]
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode:
        sys.exit(f"ffmpeg failed on {reel.name}:\n{r.stderr[-1500:]}")
    return len(slots)


if __name__ == "__main__":
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("reels")
    ap.add_argument("broll")
    ap.add_argument("out")
    ap.add_argument("--every", type=float, default=3.0)
    a = ap.parse_args()
    broll = sorted(p for p in Path(a.broll).glob("*.mp4"))
    if not broll:
        sys.exit(f"no B-roll .mp4 in {a.broll}")
    out = Path(a.out)
    out.mkdir(parents=True, exist_ok=True)
    used = 0
    for reel in sorted(Path(a.reels).glob("*.mp4")):
        dst = out / reel.name
        if dst.exists():
            continue
        used += add_broll(reel, broll, dst, a.every, used)
        srt = Path(a.reels) / "Web with captions" / f"{reel.stem} (captions).srt"
        if srt.exists():
            shutil.copy(srt, out / f"{reel.stem}.srt")
        print(f"done {reel.name}")
