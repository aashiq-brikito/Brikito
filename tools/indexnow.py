#!/usr/bin/env python3
"""Tell Bing (and every other IndexNow search engine) which brikito.com pages changed.

Bing feeds ChatGPT search, so this gets new and updated pages picked up in
minutes instead of waiting for the next crawl.

Runs automatically from .github/workflows/indexnow.yml after every push to main.
By hand, from the repo root:
    python3 tools/indexnow.py <before_sha> <after_sha>   # only the .html pages changed between two commits
    python3 tools/indexnow.py                             # every URL in sitemap.xml

The key below must match the file /<KEY>.txt in the site root (it proves we own the site).
"""
import json, os, re, subprocess, sys, urllib.request

SITE = "https://www.brikito.com"
HOST = "www.brikito.com"
KEY = "658b2c923a50c0b2474cac4f1f61a5d2"
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SKIP = {"404.html", "Brikito (standalone).html"}


def page_url(path):
    """index.html -> /, about.html -> /about (the site uses Vercel cleanUrls)."""
    return SITE + "/" if path == "index.html" else SITE + "/" + path[:-len(".html")]


def sitemap_urls():
    with open(os.path.join(ROOT, "sitemap.xml"), encoding="utf-8") as f:
        return re.findall(r"<loc>\s*(.*?)\s*</loc>", f.read())


def changed_urls(before, after):
    if not before or set(before) == {"0"}:          # first push to a branch: no "before" commit
        return sitemap_urls()
    try:
        out = subprocess.run(["git", "diff", "--name-only", "--diff-filter=AM", before, after],
                             cwd=ROOT, capture_output=True, text=True, check=True).stdout
    except subprocess.CalledProcessError:            # e.g. history was rewritten
        return sitemap_urls()
    return [page_url(p) for p in out.splitlines()
            if p.endswith(".html") and "/" not in p      # root pages only (skips components/)
            and p not in SKIP and not p.startswith("google")]


def main():
    urls = changed_urls(sys.argv[1], sys.argv[2]) if len(sys.argv) >= 3 else sitemap_urls()
    urls = sorted(set(urls))
    if not urls:
        print("No page changes to submit.")
        return
    body = json.dumps({"host": HOST, "key": KEY, "keyLocation": f"{SITE}/{KEY}.txt",
                       "urlList": urls}).encode("utf-8")
    req = urllib.request.Request("https://api.indexnow.org/indexnow", data=body,
                                 headers={"Content-Type": "application/json; charset=utf-8"})
    with urllib.request.urlopen(req, timeout=30) as r:
        print(f"IndexNow answered {r.status}; sent {len(urls)} URL(s):")
        print("\n".join(urls))


if __name__ == "__main__":
    main()
