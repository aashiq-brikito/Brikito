#!/usr/bin/env python3
"""Pre-render every main page of brikito.com from assets/site.js.

The design lives in assets/site.js (pages) and assets/site.css (styles).
This script opens each page in headless Chrome, lets site.js draw it, and
saves the result as a real HTML file (index.html, about.html, ...), so every
page has its own URL and its full content is readable by Google without
running JavaScript. On the live site, site.js then only adds interactions.

After building, run tools/seo.py to (re)write titles, descriptions, social
tags and structured data.

Usage (needs Python Playwright + Chrome):
    python3 tools/build-pages.py
"""
import asyncio, functools, http.server, json, os, re, threading

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PORT = 8799
V = "20261106b"                          # bump to make browsers load new CSS/JS

# route -> output file
PAGES = {
    "home": "index.html", "console": "console.html", "brik-ai": "brik-ai.html",
    "brikchat": "brikchat.html", "brikvision": "brikvision.html", "brikdocs": "brikdocs.html",
    "how-it-works": "how-it-works.html", "pricing": "pricing.html", "journal": "blog.html",
    "about": "about.html", "book-a-demo": "book-a-demo.html", "privacy": "privacy.html",
    "notfound": "404.html",
}

SHELL = f"""<!doctype html><html lang="en"><head><meta charset="utf-8">
<link rel="stylesheet" href="/assets/site.css?v={V}"></head>
<body><div class="progress" aria-hidden="true"></div><div id="shell"></div><main id="app"></main>
<script src="/assets/site.js?v={V}"></script></body></html>"""

FONTS = ('<link rel="preconnect" href="https://fonts.googleapis.com" />\n'
         '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />\n'
         '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&amp;family=Instrument+Serif:ital@0;1&amp;display=swap" />\n')

def head_for(fname):
    """Fresh <head>: keep verification tags and structured data from the old page."""
    keep = []
    old = os.path.join(ROOT, fname)
    if os.path.exists(old):
        h = open(old, encoding="utf-8").read()
        h = h[:h.index("</head>")]
        keep += re.findall(r'<meta\s+name="(?:facebook-domain-verification|google-site-verification)"[^>]*>', h)
        keep += re.findall(r'<script type="application/ld\+json">.*?</script>', h, re.S)
    parts = [
        '<meta charset="utf-8" />',
        '<meta name="viewport" content="width=device-width, initial-scale=1" />',
        *[k for k in keep if k.startswith("<meta")],
        '<link rel="icon" type="image/svg+xml" href="/icons/favicon.svg" />',
        '<link rel="icon" type="image/png" sizes="32x32" href="/icons/favicon-32.png" />',
        '<link rel="icon" type="image/png" sizes="16x16" href="/icons/favicon-16.png" />',
        FONTS.rstrip("\n"),
        f'<link rel="stylesheet" href="/assets/site.css?v={V}" />',
        "<script>document.documentElement.classList.add('js')</script>",
        *[k for k in keep if k.startswith("<script")],
    ]
    return "<head>\n" + "\n".join(parts) + "\n</head>"

def page_html(fname, shell, app):
    return ("<!doctype html>\n<html lang=\"en\">\n" + head_for(fname) + "\n<body>\n"
            '<div class="progress" aria-hidden="true"></div>\n'
            f'<div id="shell">{shell}</div>\n'
            f'<main id="app">{app}</main>\n'
            f'<script src="/assets/site.js?v={V}" defer></script>\n'
            "</body>\n</html>\n")

class Quiet(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a):
        pass

async def build():
    from playwright.async_api import async_playwright
    shell_path = os.path.join(ROOT, "_build-shell.html")
    open(shell_path, "w").write(SHELL)
    privacy = open(os.path.join(ROOT, "tools", "privacy-content.html"), encoding="utf-8").read()
    srv = http.server.ThreadingHTTPServer(("127.0.0.1", PORT), functools.partial(Quiet, directory=ROOT))
    threading.Thread(target=srv.serve_forever, daemon=True).start()
    try:
        async with async_playwright() as p:
            exe = "/usr/bin/google-chrome" if os.path.exists("/usr/bin/google-chrome") else None
            b = await p.chromium.launch(executable_path=exe, args=["--no-sandbox"])
            for route, fname in PAGES.items():
                pg = await b.new_page(viewport={"width": 1440, "height": 900})
                errs = []
                pg.on("pageerror", lambda e: errs.append(str(e)))
                await pg.add_init_script(f"window.__BUILD_ROUTE__={json.dumps(route)};"
                                         f"window.__PRIVACY_HTML__={json.dumps(privacy)};")
                await pg.goto(f"http://127.0.0.1:{PORT}/_build-shell.html")
                await pg.wait_for_function("window.__BUILT__ === true", timeout=15000)
                shell = await pg.eval_on_selector("#shell", "e => e.innerHTML")
                app = await pg.eval_on_selector("#app", "e => e.innerHTML")
                if errs:
                    raise SystemExit(f"{route}: {errs}")
                html = page_html(fname, shell, app)
                open(os.path.join(ROOT, fname), "w", encoding="utf-8").write(html)
                print(f"  {fname:20} {len(html)//1024:4} KB")
                await pg.close()
            await b.close()
    finally:
        srv.shutdown()
        os.remove(shell_path)

if __name__ == "__main__":
    asyncio.run(build())
