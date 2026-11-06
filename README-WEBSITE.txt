BRIKITO WEBSITE (www.brikito.com) — how it is built
Updated 6 Nov 2026, after the website redesign.

WHERE THINGS LIVE
- assets/site.js   The design: every main page's content, the header, the footer,
                   and the interactions (reveal on scroll, menus, tabs, journal
                   filters, the demo form that saves to the Google Sheet).
- assets/site.css  All styles for the design.
- img/             Design images (WebP).
- assets/chrome.css  Header/footer styles for blog articles, scoped so they don't
                   clash with each article's own layout (generated).
- components/header.html, components/footer.html
                   Header/footer markup used on the blog articles (generated).
- components/tracking.js  Meta Pixel + Google Analytics (loaded by site.js).
- tools/privacy-content.html  The privacy policy text.

PAGES (each is a real file at a clean URL)
  /  /console  /brik-ai  /brikchat  /brikvision  /brikdocs  /how-it-works
  /pricing  /blog (the Journal)  /about  /book-a-demo  /privacy  + 404.html
  Blog articles: blog-*.html (their own layouts, new header/footer)

HOW TO CHANGE SOMETHING (or ask Claude to)
1. Main page text or layout: edit assets/site.js (or the designer's app.js and
   re-run: python3 tools/patch-redesign.py <path to app.js>).
2. Rebuild the pages:            python3 tools/build-pages.py
3. Refresh SEO tags + sitemap:   python3 tools/seo.py
4. If the header/footer changed:  python3 tools/build-chrome.py
                                  python3 tools/sync-header-footer.py
5. If site.css or site.js changed, bump V = "YYYYMMDD" in tools/build-pages.py
   and tools/sync-header-footer.py, then repeat steps 2-4, so browsers load
   the new version.
6. Commit, push to mohanabriki/Brikito, open a pull request into
   aashiq-brikito/Brikito and merge.

NEW BLOG POST
  Add the blog-*.html file, add it to PAGES in tools/seo.py, add a card in the
  POSTS list (and its file name in SLUGS) in assets/site.js / tools/patch-redesign.py,
  then run steps 2-4.

WHY PAGES ARE PRE-RENDERED
  The design draws pages in the browser. Pre-rendering saves each page as real
  HTML, so Google and AI search see every page at its own URL, and the page
  works even before JavaScript loads.
