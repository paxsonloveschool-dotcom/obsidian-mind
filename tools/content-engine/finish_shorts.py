"""Finish vertical shorts: silence cut, look, burned captions, music, loudness.

Usage (black PC, Dropbox synced locally):
  python finish_shorts.py "<in folder>" "<out folder>" [--lut look.cube] [--music bed.mp3]

For every .mp4 in the in folder:
  1. Silence cut: removes dead air over 0.6 s when the clip has real audio.
     Silent b-roll (like Revive) is left alone.
  2. Look: optional shared .cube LUT so every short matches. No LUT = keep the Resolve grade.
  3. Captions: burns <same name>.srt in a bold style above the bottom 25 percent.
     If there is no .srt and the `whisper` CLI is installed, it transcribes first.
  4. Audio: optional music bed under the voice, then -14 LUFS, -1 dBTP.
  5. Output: 1080x1920, 30 fps, H.264 MP4 plus the caption .srt beside it.
Inputs are never changed. Existing outputs are skipped, so reruns are safe.
"""
import argparse, re, shutil, subprocess, sys, tempfile
from pathlib import Path

GAP = 0.6        # seconds of quiet that count as dead air
PAD = 0.12       # keep a little air on each side of a cut
FLOOR_DB = -35   # quieter than this is silence
STYLE = ("FontName=Arial,Fontsize=17,Bold=1,PrimaryColour=&H00FFFFFF,OutlineColour=&H00000000,"
         "BorderStyle=1,Outline=2,Shadow=0,Alignment=2,MarginL=24,MarginR=24,MarginV=78")  # 78/288 = 27% up, clear of app buttons


def run(cmd, cwd=None):
    r = subprocess.run(cmd, cwd=cwd, capture_output=True, text=True)
    if r.returncode:
        sys.exit(f"ffmpeg failed:\n{' '.join(map(str, cmd))}\n{r.stderr[-1500:]}")
    return r.stderr


def duration(f):
    return float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration",
                                          "-of", "csv=p=0", str(f)], text=True))


def has_audio(f):
    return bool(subprocess.check_output(["ffprobe", "-v", "error", "-select_streams", "a",
                                         "-show_entries", "stream=index", "-of", "csv=p=0", str(f)], text=True).strip())


def keep_ranges(f, dur):
    """Speech ranges to keep. Whole clip when it has no audio or is silent end to end."""
    if not has_audio(f):
        return [(0.0, dur)]
    log = run(["ffmpeg", "-hide_banner", "-i", str(f), "-af",
               f"silencedetect=n={FLOOR_DB}dB:d={GAP}", "-f", "null", "-"])
    starts = [float(x) for x in re.findall(r"silence_start: (-?[\d.]+)", log)]
    ends = [float(x) for x in re.findall(r"silence_end: ([\d.]+)", log)] + [dur]
    keep, t = [], 0.0
    for s, e in zip(starts, ends):
        if s - PAD > t:
            keep.append((t, min(s + PAD, dur)))
        t = max(t, e - PAD)
    if t < dur:
        keep.append((t, dur))
    return keep if keep and sum(b - a for a, b in keep) > 0.5 else [(0.0, dur)]


def remap(t, keep):
    """Where time t of the source lands after the cuts."""
    out = 0.0
    for a, b in keep:
        if t <= a:
            return out
        if t <= b:
            return out + t - a
        out += b - a
    return out


def srt_time(s):
    h, m, rest = s.replace(",", ".").split(":")
    return int(h) * 3600 + int(m) * 60 + float(rest)


def fmt(t):
    ms = round(t * 1000)
    return f"{ms // 3600000:02}:{ms // 60000 % 60:02}:{ms // 1000 % 60:02},{ms % 1000:03}"


def shift_srt(text, keep):
    blocks, n = [], 0
    for b in re.split(r"\n\s*\n", text.strip().replace("\r", "")):
        lines = b.split("\n")
        m = next((re.match(r"(\S+) --> (\S+)", l) for l in lines if "-->" in l), None)
        if not m:
            continue
        a, z = remap(srt_time(m[1]), keep), remap(srt_time(m[2]), keep)
        if z - a < 0.2:   # caption sat entirely inside a cut
            continue
        n += 1
        body = lines[lines.index(m[0]) + 1:] if m[0] in lines else lines[2:]
        blocks.append(f"{n}\n{fmt(a)} --> {fmt(z)}\n" + "\n".join(body))
    return "\n\n".join(blocks) + "\n"


def transcribe(f, work):
    if not shutil.which("whisper") or not has_audio(f):
        return None
    run(["whisper", str(f), "--model", "small", "--output_format", "srt", "--output_dir", str(work),
         "--max_line_width", "28", "--max_line_count", "2", "--word_timestamps", "True"])
    out = work / (f.stem + ".srt")
    return out.read_text(encoding="utf-8") if out.exists() else None


def finish(src, dst_dir, lut, music):
    out = dst_dir / src.name
    if out.exists():
        print(f"skip (done): {out.name}")
        return
    dur = duration(src)
    keep = keep_ranges(src, dur)
    cut = keep != [(0.0, dur)]
    with tempfile.TemporaryDirectory() as tmp:
        work = Path(tmp)
        srt_src = src.with_suffix(".srt")
        text = srt_src.read_text(encoding="utf-8-sig") if srt_src.exists() else transcribe(src, work)
        if text and cut:
            text = shift_srt(text, keep)

        sel = "+".join(f"between(t,{a:.3f},{b:.3f})" for a, b in keep)
        v = [f"select='{sel}',setpts=N/FRAME_RATE/TB"] if cut else []
        v.append("scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,fps=30")
        if lut:
            shutil.copy(lut, work / "look.cube")
            v.append("lut3d=look.cube")
        if text:
            (work / "cap.srt").write_text(text, encoding="utf-8")
            v.append(f"subtitles=cap.srt:force_style='{STYLE}'")   # relative path dodges Windows C:\ escaping
        v.append("format=yuv420p")

        cmd = ["ffmpeg", "-hide_banner", "-y", "-i", str(src.resolve())]
        speech = has_audio(src)
        fc = ";".join([f"[0:v]{','.join(v)}[v]"])
        a_in = None
        if speech:
            fc += f";[0:a]{'aselect=' + repr(sel) + ',asetpts=N/SR/TB,' if cut else ''}anull[sp]"
            a_in = "[sp]"
        if music:
            cmd += ["-stream_loop", "-1", "-i", str(Path(music).resolve())]
            fc += ";[1:a]volume=0.18[mu]" if speech else ";[1:a]anull[mu]"
            fc += f";{a_in}[mu]amix=inputs=2:duration=first:normalize=0[mx]" if speech else ";[mu]anull[mx]"
            a_in = "[mx]"
        if a_in:
            fc += f";{a_in}loudnorm=I=-14:TP=-1:LRA=11,aresample=48000[a]"
        cmd += ["-filter_complex", fc, "-map", "[v]"]
        if a_in:
            cmd += ["-map", "[a]", "-c:a", "aac", "-b:a", "192k"]
        new_dur = sum(b - a for a, b in keep)
        cmd += ["-t", f"{new_dur:.3f}", "-c:v", "libx264", "-preset", "slow", "-crf", "18",
                "-movflags", "+faststart", str(out.resolve())]
        run(cmd, cwd=work)
        if text:
            out.with_suffix(".srt").write_text(text, encoding="utf-8")
    print(f"done: {out.name}  {dur:.1f}s -> {new_dur:.1f}s  captions={'yes' if text else 'NO'}  "
          f"cuts={len(keep) - 1}  music={'yes' if music else 'no'}")


def main():
    p = argparse.ArgumentParser()
    p.add_argument("src")
    p.add_argument("dst")
    p.add_argument("--lut")
    p.add_argument("--music")
    a = p.parse_args()
    src, dst = Path(a.src), Path(a.dst)
    dst.mkdir(parents=True, exist_ok=True)
    files = sorted(f for f in src.glob("*.mp4") if f.parent.resolve() != dst.resolve())
    if not files:
        sys.exit(f"no .mp4 files in {src}")
    for f in files:
        finish(f, dst, a.lut, a.music)


if __name__ == "__main__":
    main()
