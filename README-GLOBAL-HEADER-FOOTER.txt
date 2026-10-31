BRIKITO GLOBAL HEADER + FOOTER

Every page on brikito.com uses ONE shared header and ONE shared footer:
- components/header.html   menu: Platform · Features (dropdown) · Roadmap · Blog · Pricing
- components/footer.html   footer links and social icons
- components/global.css    header, footer and Features dropdown styling
- components/global.js     loads the header/footer on each page, mobile menu, dropdown, tracking

Pages using it (17): index, how-it-works, pricing, book-a-demo, privacy, blog,
the 7 blog articles, and the 4 feature pages (brik-ai, brikchat, brikvision, brikdocs).
"Brikito (standalone).html" is an old export and is intentionally left as is.

To change the menu for the whole site:
1. Edit components/header.html (e.g. add a page to the Features dropdown).
2. If you change global.css or global.js, bump ?v=YYYYMMDD in every page's
   <link>/<script> tag so browsers load the new version.
3. Commit and push. GitHub Pages publishes to www.brikito.com in a minute or two.

Every page needs these three lines:
  <link rel="stylesheet" href="components/global.css?v=...">   (in <head>)
  <div data-global-header></div>                             (top of <body>)
  <div data-global-footer></div>                             (bottom of <body>)
  <script src="components/global.js?v=..."></script>          (before </body>)

Note: the header loads with fetch(), so test through a web server or the live
site, not by double-clicking the HTML file.
