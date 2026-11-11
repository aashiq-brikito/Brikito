#!/usr/bin/env python3
"""Put the current header and footer into every blog article.

The main pages (home, products, pricing, about, journal...) are built by
tools/build-pages.py and already contain the header and footer. Blog articles
keep their own layout, so they get the header/footer from
components/header.html and components/footer.html (made by
tools/build-chrome.py), styled by the scoped assets/chrome.css.

Run from the repo root:  python3 tools/sync-header-footer.py
"""
import glob, os, re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
V = "20261111b"
header = open(os.path.join(ROOT, "components/header.html"), encoding="utf-8").read().strip()
footer = open(os.path.join(ROOT, "components/footer.html"), encoding="utf-8").read().strip()

HEAD_LINKS = (
    '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&amp;display=swap" />\n'
    f'<link rel="stylesheet" href="/assets/chrome.css?v={V}" />\n'
)

def replace_header(s):
    if "<!-- site-header" in s:
        a = s.index("<!-- site-header"); b = s.index("<!-- /site-header -->") + len("<!-- /site-header -->")
        return s[:a] + header + s[b:]
    a = s.find('<header class="global-header">')
    if a == -1:
        raise SystemExit("no header found")
    b = s.index("</header>", a) + len("</header>")
    return s[:a] + header + s[b:]

def replace_footer(s):
    if "<!-- site-footer" in s:
        a = s.index("<!-- site-footer"); b = s.index("<!-- /site-footer -->") + len("<!-- /site-footer -->")
        return s[:a] + footer + s[b:]
    f = s.find('<footer class="global-footer">')
    if f == -1:
        raise SystemExit("no footer found")
    a = s.rfind("<style>", 0, f)                       # old footer carried its own <style>
    if a == -1 or ".global-footer-logo" not in s[a:f]:
        a = f
    b = s.index("</footer>", f) + len("</footer>")
    m = re.compile(r'\s*<script>\s*\(function \(\) \{\s*var year = document\.getElementById\("global-footer-year"\);.*?</script>', re.S).match(s, b)
    if m:
        b = m.end()
    return s[:a] + footer + s[b:]

def fix_head(s):
    s = re.sub(r'[ \t]*<link rel="stylesheet" href="components/global\.css[^"]*">\s*\n?', "", s)
    s = re.sub(r'[ \t]*<link[^>]*fonts\.googleapis\.com/css2\?family=Inter:wght[^>]*>\s*\n?', "", s)
    s = re.sub(r'[ \t]*<link rel="stylesheet" href="/assets/chrome\.css[^"]*" />\s*\n?', "", s)
    i = s.index("</head>")
    return s[:i] + HEAD_LINKS + s[i:]

def fix_scripts(s):
    s = re.sub(r'<script src="(?:/)?components/global\.js[^"]*"[^>]*></script>', "", s)
    s = re.sub(r'<script src="/assets/site\.js[^"]*"[^>]*></script>\n?', "", s)
    i = s.rindex("</body>")
    return s[:i] + f'<script src="/assets/site.js?v={V}" defer></script>\n' + s[i:]

changed = 0
for path in sorted(glob.glob(os.path.join(ROOT, "blog-*.html"))) + [os.path.join(ROOT, "delay-cost-calculator.html")]:
    s0 = s = open(path, encoding="utf-8").read()
    s = fix_scripts(fix_head(replace_footer(replace_header(s))))
    if s != s0:
        open(path, "w", encoding="utf-8").write(s); changed += 1
    print(f"  {os.path.basename(path)}")
print(f"{changed} article(s) updated")
