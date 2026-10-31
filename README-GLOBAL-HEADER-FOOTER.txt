BRIKITO GLOBAL HEADER + FOOTER

How it works (updated 31 Oct 2026)
- The header and footer HTML is written directly into every page, so Google
  and AI search tools (ChatGPT, Perplexity, etc.) can read the menu and footer
  links without running any script.
- components/header.html and components/footer.html are the MASTER COPIES.
  Menu: Platform · Features (dropdown: Brik AI, BrikChat, BrikVision,
  BrikDocs) · Roadmap · Blog · Pricing
- components/global.css styles the header, footer and Features dropdown.
- components/global.js wires up the mobile menu and the Features dropdown and
  loads components/tracking.js (Meta Pixel + Google Analytics).

Pages (17): index, how-it-works, pricing, book-a-demo, privacy, blog, the 7
blog articles, and the 4 feature pages (brik-ai, brikchat, brikvision,
brikdocs). "Brikito (standalone).html" is an old export and is left as is.

To change the menu or footer
1. Edit components/header.html or components/footer.html.
2. Copy the change into every page by running, from the repo root:
       python3 tools/sync-header-footer.py
   (It replaces the header and footer section of all 17 pages with the
   master copies. Ask Claude to run it if you don't use the command line.)
3. If you changed global.css or global.js, bump ?v=YYYYMMDD in every page's
   <link>/<script> tag so browsers load the new version.
4. Commit, push and open a pull request into aashiq-brikito/Brikito.

Adding a new page
- Put <div data-global-header></div> and <div data-global-footer></div> where
  the header and footer go, link components/global.css and global.js, then
  run the sync script. It swaps the placeholders for the real header/footer.
