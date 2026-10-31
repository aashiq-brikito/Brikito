#!/usr/bin/env python3
"""Copy the master header and footer into every page of the Brikito site.

components/header.html and components/footer.html are the master copies.
Each page carries its own copy written straight into the HTML, so Google and
AI search tools can read the menu without running JavaScript.

Run from the repo root after editing either master file:
    python3 tools/sync-header-footer.py
"""
import glob, os, re, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SKIP = {"Brikito (standalone).html"}
YEAR = "2026"

def read(p):
    with open(os.path.join(ROOT, p), encoding="utf-8") as f:
        return f.read()

header = read("components/header.html").strip()
footer = read("components/footer.html").strip()
footer = footer.replace('<span id="global-footer-year"></span>', f'<span id="global-footer-year">{YEAR}</span>')

def replace_header(s):
    if '<div data-global-header></div>' in s:
        return s.replace('<div data-global-header></div>', header, 1), "placeholder"
    a = s.find('<header class="global-header">')
    if a == -1:
        return s, None
    b = s.index('</header>', a) + len('</header>')
    return s[:a] + header + s[b:], "static"

def replace_footer(s):
    if '<div data-global-footer></div>' in s:
        return s.replace('<div data-global-footer></div>', footer, 1), "placeholder"
    f = s.find('<footer class="global-footer">')
    if f == -1:
        return s, None
    # the footer copy starts at the <style> block that styles it
    a = s.rfind('<style>', 0, f)
    if a == -1 or '.global-footer-logo' not in s[a:f]:
        a = f
    # and ends at the small script that fills in the year
    end_footer = s.index('</footer>', f) + len('</footer>')
    b = end_footer
    m = re.compile(r'\s*<script>\s*\(function \(\) \{\s*var year = document\.getElementById\("global-footer-year"\);.*?</script>', re.S).match(s, end_footer)
    if m:
        b = m.end()
    return s[:a] + footer + s[b:], "static"

changed = []
for path in sorted(glob.glob(os.path.join(ROOT, "*.html"))):
    name = os.path.basename(path)
    if name in SKIP:
        continue
    s = read(name)
    if "global-" not in s and "data-global" not in s:
        continue  # e.g. search-engine verification files
    s2, h = replace_header(s)
    s2, f = replace_footer(s2)
    if s2 != s:
        with open(path, "w", encoding="utf-8") as fh:
            fh.write(s2)
        changed.append(name)
    print(f"{name:48} header:{h or '-':11} footer:{f or '-'}")
print(f"\n{len(changed)} page(s) updated")
