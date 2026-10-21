BRIKITO GLOBAL HEADER + FOOTER SETUP

What changed:
- Added components/header.html as the single shared header source.
- Added components/footer.html as the single shared footer source.
- Added components/global.css for shared responsive styling.
- Added components/global.js to load the shared components on each page.
- Updated the main website HTML pages and all seven blog articles to load the shared components.
- The header/footer Sign in links point to http://3.111.40.151:8083/signup.

To update later:
1. Edit components/header.html to change navigation, logo text, or Sign in link.
2. Edit components/footer.html to change footer text and links.
3. Edit components/global.css to change shared header/footer styling.
4. Commit/push the updated files to your website repository.

Important:
- Upload the whole updated folder contents, including the components/ folder, to the same published website root.
- This uses fetch() to load shared HTML, so test through GitHub Pages/a web server; it will not load correctly by opening each HTML file directly via file://.
- This updates the shared header/footer on the 13 main HTML pages and blog articles. Brikito (standalone).html is a separate standalone export and was intentionally left unchanged.
