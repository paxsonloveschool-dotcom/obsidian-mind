"""Talking head shorts: clean mic audio, cut silence and fillers, pick best lines,
B-roll every 3 s, color managed grade, built and rendered in DaVinci Resolve.

Runs on the black PC with Resolve open (Studio for external scripting; on free
Resolve run it from Workspace > Console). Needs ffmpeg and openai-whisper.

  1. prep   one or more interview clips (.braw, .mov, .mp4)
       python talking_head.py prep WORK "<Interview (3).braw>" ...
     Writes per clip: clean.wav, words.json, transcript.txt, picks.txt (auto picked, editable).
  2. build  every short listed in each picks.txt
       python talking_head.py build WORK "<client raw folder>" OUT [--lut look.cube]
     B-roll comes only from that client's raw folder (never across clients).

picks.txt lines look like "Short 1: 4-9, 12". Numbers are transcript lines.
"""
import argparse, json, re, subprocess, sys, time
from pathlib import Path

FILLERS = {"um", "umm", "uh", "uhh", "uhm", "er", "erm", "ah", "hmm", "mm", "mhm"}
FILLER_PAIRS = {("you", "know"), ("i", "mean")}  # "like" is kept on purpose: too often a real word
MAX_GAP = 0.25        # pause longer than this between kept words gets cut
PAD = 0.04            # breath kept either side of a cut
SHORT_MIN, SHORT_MAX, AUTO_SHORTS = 20.0, 45.0, 3
# Mic fix: rumble out, clipped peaks rebuilt, hiss down, gentle 2.5:1 leveling, web loudness.
AUDIO_CHAIN = ("highpass=f=80,adeclip,afftdn=nf=-25,"
               "acompressor=threshold=-20dB:ratio=2.5:attack=15:release=250:makeup=2,"
               "alimiter=limit=0.89,loudnorm=I=-14:TP=-1.5:LRA=9")
# Gentle finish on top of Resolve color management (Rec.709): a touch of contrast and saturation.
CDL = {"NodeIndex": "1", "Slope": "1.02 1.02 1.02", "Offset": "-0.01 -0.01 -0.01",
       "Power": "1.04 1.04 1.04", "Saturation": "1.08"}
VIDEO_EXT = {".braw", ".mov", ".mp4", ".mxf"}


def sh(cmd):
    r = subprocess.run([str(c) for c in cmd], capture_output=True, text=True)
    if r.returncode:
        sys.exit(f"failed: {' '.join(map(str, cmd))}\n{r.stderr[-1500:]}")
    return r.stdout


# ---------- pure logic (tested in test_talking_head.py) ----------

def norm(w):
    return re.sub(r"[^a-z']", "", w.lower())


def keep_ranges(words, max_gap=MAX_GAP, pad=PAD):
    """Words -> [(start, end)] speech runs with fillers and pauses removed."""
    w = [x for x in words if norm(x["word"])]
    drop = {i for i, x in enumerate(w) if norm(x["word"]) in FILLERS}
    for i in range(len(w) - 1):
        if (norm(w[i]["word"]), norm(w[i + 1]["word"])) in FILLER_PAIRS:
            drop |= {i, i + 1}
    runs, last = [], None
    for i, x in enumerate(w):
        if i in drop:
            continue
        s, e = max(0.0, x["start"] - pad), x["end"] + pad
        clean_join = last == i - 1 and s - runs[-1][1] <= max_gap
        if runs and (clean_join or s <= runs[-1][1]):  # filler in between always forces a cut
            runs[-1][1] = max(runs[-1][1], e)
        else:
            runs.append([s, e])
        last = i
    return [(a, b) for a, b in runs if b - a >= 0.15]


def auto_picks(segs, n=AUTO_SHORTS):
    """Best non-overlapping 20-45 s windows of whole transcript lines: dense speech, few fillers."""
    def fillers(seg):
        return sum(norm(x["word"]) in FILLERS for x in seg.get("words", []))
    cands = []
    for i in range(len(segs)):
        for j in range(i, len(segs)):
            dur = segs[j]["end"] - segs[i]["start"]
            if dur > SHORT_MAX:
                break
            if dur >= SHORT_MIN:
                words = sum(len(s.get("words", [])) for s in segs[i:j + 1])
                bad = sum(fillers(s) for s in segs[i:j + 1])
                weak_open = norm(segs[i]["text"].split()[0]) in {"and", "so", "but", "because"}
                cands.append(((words - 4 * bad) / dur - weak_open, i, j))
    picks, used = [], set()
    for _, i, j in sorted(cands, reverse=True):
        if used.isdisjoint(range(i, j + 1)):
            picks.append((i, j))
            used |= set(range(i, j + 1))
        if len(picks) == n:
            break
    return sorted(picks)


def parse_picks(text):
    out = {}
    for line in text.splitlines():
        if ":" not in line or line.lstrip().startswith("#"):
            continue
        name, spec = line.split(":", 1)
        ids = []
        for part in spec.replace(" ", "").split(","):
            if "-" in part:
                a, b = map(int, part.split("-"))
                ids += range(a, b + 1)
            elif part:
                ids.append(int(part))
        out[name.strip()] = ids
    return out


def broll_slots(total, every=3.0, length=3.0, hook=3.0):
    """Alternate face and B-roll: face for the hook, then a new B-roll shot every `every` s of face."""
    slots, t = [], hook
    while t + 1.0 < total:
        slots.append((t, min(t + length, total)))
        t += length + every
    return slots


def to_frames(ranges, fps):
    return [(round(a * fps), round(b * fps)) for a, b in ranges if round(b * fps) > round(a * fps)]


def cut_audio(wav, frame_ranges, fps, out):
    """Cut clean.wav with the exact frame ranges used for picture, 10 ms fades at each join."""
    parts = []
    for k, (a, b) in enumerate(frame_ranges):
        s, e = a / fps, b / fps
        parts.append(f"[0:a]atrim={s:.4f}:{e:.4f},asetpts=PTS-STARTPTS,"
                     f"afade=t=in:d=0.01,afade=t=out:st={max(0, e - s - 0.01):.4f}:d=0.01[a{k}]")
    graph = ";".join(parts) + ";" + "".join(f"[a{k}]" for k in range(len(parts))) + \
        f"concat=n={len(parts)}:v=0:a=1[out]"
    sh(["ffmpeg", "-y", "-v", "error", "-i", wav, "-filter_complex", graph, "-map", "[out]",
        "-ar", "48000", out])


# ---------- Resolve ----------

def resolve_app():
    for p in (r"C:\ProgramData\Blackmagic Design\DaVinci Resolve\Support\Developer\Scripting\Modules",
              "/Library/Application Support/Blackmagic Design/DaVinci Resolve/Developer/Scripting/Modules",
              "/opt/resolve/Developer/Scripting/Modules"):
        sys.path.append(p)
    import DaVinciResolveScript as dvr  # noqa: E402
    app = dvr.scriptapp("Resolve")
    if not app:
        sys.exit("Resolve is not open, or external scripting is off (Preferences > System > General).")
    return app


def new_project(app, name, w, h, clip):
    """Fresh project whose timeline fps matches the camera, so cut frames and cut audio line up."""
    proj = app.GetProjectManager().CreateProject(f"{name} {time.strftime('%Y-%m-%d %H%M%S')}")
    item = proj.GetMediaPool().ImportMedia([str(clip)])[0]
    fps = float(item.GetClipProperty("FPS"))
    for k, v in {"timelineResolutionWidth": w, "timelineResolutionHeight": h, "timelineFrameRate": fps,
                 "timelineOutputResolutionWidth": w, "timelineOutputResolutionHeight": h,
                 "timelineInputResMismatchBehavior": "scaleFullFrameWithCrop",
                 "colorScienceMode": "davinciYRGBColorManagedv2"}.items():
        proj.SetSetting(k, str(v))
    return proj, item, fps


def codec(proj, fmt, want):
    for desc, name in proj.GetRenderCodecs(fmt).items():
        if want.lower() in desc.lower():
            return name
    sys.exit(f"Resolve has no {want} codec for {fmt}")


def render(app, proj, out_dir, name, fmt, want, audio):
    proj.SetCurrentRenderFormatAndCodec(fmt, codec(proj, fmt, want))
    proj.SetRenderSettings({"SelectAllFrames": True, "TargetDir": str(out_dir), "CustomName": name,
                            "ExportVideo": True, "ExportAudio": audio})
    job = proj.AddRenderJob()
    proj.StartRendering(job)
    while proj.IsRenderingInProgress():
        time.sleep(2)
    files = sorted(Path(out_dir).glob(name + ".*"))
    if not files:
        sys.exit(f"Resolve render made no file for {name}")
    return files[-1]


# ---------- steps ----------

def prep(work, clips, model):
    app = None
    for clip in map(Path, clips):
        d = Path(work) / clip.stem
        d.mkdir(parents=True, exist_ok=True)
        src = clip
        if clip.suffix.lower() == ".braw":  # ffmpeg can't decode BRAW: Resolve makes a small proxy
            app = app or resolve_app()
            proj, item, _ = new_project(app, f"proxy {clip.stem}", 960, 540, clip)
            proj.GetMediaPool().CreateTimelineFromClips(clip.stem, [item])
            src = render(app, proj, d, "proxy", "mov", "Proxy", True)
        sh(["ffmpeg", "-y", "-v", "error", "-i", src, "-vn", "-ac", "1", "-ar", "48000",
            "-af", AUDIO_CHAIN, d / "clean.wav"])
        sh(["whisper", d / "clean.wav", "--model", model, "--language", "en", "--word_timestamps", "True",
            "--output_format", "json", "--output_dir", d,
            "--initial_prompt", "Umm, so, uh, you know, I mean, we, uh, put the roof on."])  # makes Whisper keep fillers
        (d / "clean.json").rename(d / "words.json")
        segs = json.loads((d / "words.json").read_text())["segments"]
        (d / "transcript.txt").write_text("".join(
            f"[{i}] {int(s['start'] // 60)}:{int(s['start'] % 60):02d}  {s['text'].strip()}\n"
            for i, s in enumerate(segs)), encoding="utf-8")
        if not (d / "picks.txt").exists():
            (d / "picks.txt").write_text("# auto picked, edit freely. Short name: transcript line numbers\n" + "".join(
                f"Short {k + 1}: {i}-{j}\n" for k, (i, j) in enumerate(auto_picks(segs))))
        (d / "source.txt").write_text(str(clip.resolve()))
        print(f"prepped {clip.name}: {len(segs)} lines, picks in {d / 'picks.txt'}")


def build(work, raw_dir, out, lut, every):
    app = resolve_app()
    out = Path(out)
    out.mkdir(parents=True, exist_ok=True)
    work_dirs = [d for d in Path(work).iterdir() if (d / "picks.txt").exists()]
    interviews = {Path((d / "source.txt").read_text()).resolve() for d in work_dirs}
    broll_files = sorted(p for p in Path(raw_dir).rglob("*") if p.suffix.lower() in VIDEO_EXT
                         and p.resolve() not in interviews and "interview" not in p.name.lower())
    if not broll_files:
        sys.exit(f"no B-roll clips in {raw_dir}")
    used = 0
    for d in work_dirs:
        segs = json.loads((d / "words.json").read_text())["segments"]
        proj = None
        for name, ids in parse_picks((d / "picks.txt").read_text()).items():
            words = [w for i in ids if i < len(segs) for w in segs[i].get("words", [])]
            if not words:
                continue
            if proj is None:  # one Resolve project per interview
                proj, face, fps = new_project(app, d.name, 1080, 1920, (d / "source.txt").read_text())
                mp = proj.GetMediaPool()
                broll = [b for b in mp.ImportMedia([str(p) for p in broll_files]) if b.GetClipProperty("FPS")]
            frames = to_frames(keep_ranges(words), fps)
            tl = mp.CreateEmptyTimeline(f"{d.name} {name}")
            tl.AddTrack("video")
            start, rec = tl.GetStartFrame(), 0
            for a, b in frames:
                mp.AppendToTimeline([{"mediaPoolItem": face, "startFrame": a, "endFrame": b - 1,
                                      "trackIndex": 1, "recordFrame": start + rec, "mediaType": 1}])
                rec += b - a
            for s, e in broll_slots(rec / fps, every, every):
                clip = broll[used % len(broll)]
                used += 1
                cfps = float(clip.GetClipProperty("FPS"))
                n = int(clip.GetClipProperty("Frames") or 0)
                need = round((e - s) * cfps)
                if n <= need:
                    continue
                a = (n - need) // 2  # middle of the shot: past the camera bump at the start
                mp.AppendToTimeline([{"mediaPoolItem": clip, "startFrame": a, "endFrame": a + need - 1,
                                      "trackIndex": 2, "recordFrame": start + round(s * fps), "mediaType": 1}])
            for track in (1, 2):
                for item in tl.GetItemListInTrack("video", track) or []:
                    item.SetCDL(CDL)
                    if lut:
                        item.SetLUT(1, str(Path(lut).resolve()))
            proj.SetCurrentTimeline(tl)
            stem = f"{d.name} {name}"
            video = render(app, proj, out, stem + " video", "mp4", "H.264", False)
            cut_audio(d / "clean.wav", frames, fps, out / f"{stem} audio.wav")
            sh(["ffmpeg", "-y", "-v", "error", "-i", video, "-i", out / f"{stem} audio.wav", "-map", "0:v",
                "-map", "1:a", "-c:v", "copy", "-c:a", "aac", "-b:a", "192k", "-shortest", out / f"{stem}.mp4"])
            video.unlink()
            (out / f"{stem} audio.wav").unlink()
            print(f"built {stem}.mp4  {rec / fps:.1f} s")


if __name__ == "__main__":
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = ap.add_subparsers(dest="cmd", required=True)
    p = sub.add_parser("prep")
    p.add_argument("work")
    p.add_argument("clips", nargs="+")
    p.add_argument("--model", default="small.en")
    b = sub.add_parser("build")
    b.add_argument("work")
    b.add_argument("raw_dir")
    b.add_argument("out")
    b.add_argument("--lut")
    b.add_argument("--every", type=float, default=3.0, help="seconds of face between B-roll shots, and B-roll length")
    a = ap.parse_args()
    prep(a.work, a.clips, a.model) if a.cmd == "prep" else build(a.work, a.raw_dir, a.out, a.lut, a.every)
