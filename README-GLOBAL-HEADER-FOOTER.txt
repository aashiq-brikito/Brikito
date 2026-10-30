BRIKITO GLOBAL HEADER + FOOTER

How it works now (since 30 Oct 2026):
- The header and footer HTML is written directly into each page (12 pages:
  index, how-it-works, pricing, book-a-demo, privacy and the 7 blog articles).
  This lets Google and AI search tools (ChatGPT, Perplexity, etc.) see the
  menu and footer links without running any script.
- blog.html has its own header and footer and is not part of this set.
- components/header.html and components/footer.html are the MASTER COPIES.
- components/global.css styles the header and footer.
- components/global.js no longer inserts the header/footer on these pages; it
  only wires up the mobile menu button and loads components/tracking.js
  (Meta Pixel + Google Analytics).
- The Sign in links point to https://app.brikito.com/signup.

To change the menu or footer:
1. Edit components/header.html or components/footer.html (the master copy).
2. Copy the same change into the header/footer section of all 12 pages listed
   above. Search each page for class="global-header" or class="global-footer".
3. Commit the changes and open a pull request.

If a page still contains <div data-global-header></div> or
<div data-global-footer></div>, global.js will still fill it in from the
master copies, so older pages keep working.
