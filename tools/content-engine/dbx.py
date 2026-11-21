"""Dropbox file transfer for the cloud session. The network proxy adds the saved token,
so nothing here holds a key.

  python dbx.py get "<dropbox path or id:...>" <local file>
  python dbx.py put <local file> "<dropbox path>"
"""
import json, subprocess, sys
from pathlib import Path

API = "https://content.dropboxapi.com/2/files"
CHUNK = 128 * 1024 * 1024  # under Dropbox's 150 MB single request limit


def call(endpoint, arg, data=None, out=None):
    cmd = ["curl", "-sS", "--fail-with-body", "-X", "POST", f"{API}/{endpoint}",
           "-H", "Dropbox-API-Arg: " + json.dumps(arg, ensure_ascii=True),
           "-H", "Content-Type: application/octet-stream"]
    cmd += ["--data-binary", "@-"] if data is not None else []
    cmd += ["-o", str(out)] if out else []
    r = subprocess.run(cmd, input=data, capture_output=True)
    if r.returncode:
        sys.exit(f"dropbox {endpoint} failed: {r.stdout[-500:]!r} {r.stderr[-500:]!r}")
    return r.stdout


def get(src, dst):
    Path(dst).parent.mkdir(parents=True, exist_ok=True)
    call("download", {"path": src}, out=dst)


def put(src, dst):
    size, commit = Path(src).stat().st_size, {"path": dst, "mode": "overwrite", "mute": True}
    with open(src, "rb") as f:
        if size <= CHUNK:
            return call("upload", commit, f.read())
        sid = json.loads(call("upload_session/start", {"close": False}, f.read(CHUNK)))["session_id"]
        off = f.tell()
        while off + CHUNK < size:
            call("upload_session/append_v2", {"cursor": {"session_id": sid, "offset": off}}, f.read(CHUNK))
            off = f.tell()
        call("upload_session/finish", {"cursor": {"session_id": sid, "offset": off}, "commit": commit}, f.read())


if __name__ == "__main__":
    {"get": get, "put": put}[sys.argv[1]](sys.argv[2], sys.argv[3])
