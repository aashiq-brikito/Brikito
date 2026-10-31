#!/usr/bin/env python3
"""SEO settings for every page of brikito.com, in one place.

For each page this writes, inside <head>:
  title, meta description, robots, canonical URL, Open Graph tags
  (Facebook/LinkedIn/WhatsApp previews), Twitter card, apple-touch-icon,
  and the page's structured data (JSON-LD) for Google.

Run from the repo root after editing PAGES below or adding a page:
    python3 tools/seo.py
Pages not listed in PAGES are reported, so nothing is silently missed.
"""
import glob, html, json, os, re, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SITE = "https://www.brikito.com"
DEFAULT_IMAGE = "/showreel-poster.jpg"          # 1280x720, used when a page has no image of its own
ORG_ID = SITE + "/#organization"
SKIP = {"Brikito (standalone).html"}

def url(slug):
    return SITE + "/" + slug

# ---------------------------------------------------------------------------
# Per-page settings. Titles: 30-60 characters. Descriptions: 120-160.
# ---------------------------------------------------------------------------
PAGES = {
    "index.html": dict(
        slug="", type="website",
        title="Brikito: Construction Management Software with AI",
        description="Brikito puts site chat, attendance, drawings, reports and a live project dashboard into one app your site team actually uses, with Brik AI built in.",
    ),
    "about.html": dict(
        slug="about",
        title="About Brikito: The Team Building Construction's AI OS",
        description="Meet Brikito, the team building the AI operating system for real estate development. Our story, mission, values, pilot results and founder Aashiq Ahamed.",
    ),
    "brik-ai.html": dict(
        slug="brik-ai",
        title="Brik AI: AI Assistant for Construction Teams | Brikito",
        description="Ask about progress, stock, attendance or approvals in plain language. Brik AI answers from live site data and drafts replies, POs and reports for approval.",
    ),
    "brikchat.html": dict(
        slug="brikchat",
        title="BrikChat: Construction Site Chat App with AI | Brikito",
        description="Replace scattered WhatsApp groups with one project chat. BrikChat turns site messages and voice notes into indents, attendance and progress updates.",
    ),
    "brikvision.html": dict(
        slug="brikvision", image="/images/cam-topdown.jpg",
        title="BrikVision: AI CCTV for Construction Sites | Brikito",
        description="Add AI to your site CCTV: live headcount, delivery logs, PPE and safety checks, and progress monitoring, 24/7 from anywhere. Fewer site visits.",
    ),
    "brikdocs.html": dict(
        slug="brikdocs",
        title="BrikDocs: DPR, BOQ & BBS Report Generator | Brikito",
        description="Generate DPR, DLR, BOQ, BBS, GRN and stock statements in one tap from work your team already logged, with version-controlled construction drawings.",
    ),
    "how-it-works.html": dict(
        slug="how-it-works",
        title="How Brikito Works: Site Chat to Live Dashboard",
        description="See five real Brikito workflows: chat to approval, asking Brik AI, CCTV intelligence, drawing takeoff and the recovery dashboard, played out in the app.",
    ),
    "pricing.html": dict(
        slug="pricing",
        title="Brikito Pricing: Construction Management Software Plans",
        description="Brikito plans for construction teams: Standard from ₹12,999/month with a 14-day free trial, Professional for overseeing contractors, and Enterprise.",
    ),
    "book-a-demo.html": dict(
        slug="book-a-demo",
        title="Book a Demo of Brikito Construction Software",
        description="Book a 45-minute Brikito demo. We'll set your team up on one live project and show you site chat, Brik AI and reports running the same day.",
    ),
    "blog.html": dict(
        slug="blog",
        title="Brikito Resources: Construction, AI & Project Guides",
        description="Practical guides for construction teams on project coordination, site updates, drawing control, cost overruns, construction technology and AI.",
    ),
    "privacy.html": dict(
        slug="privacy",
        title="Privacy Policy | Brikito Construction Software",
        description="What personal data Brikito collects, why, how it is used, who can see it, and your rights under India's Digital Personal Data Protection Act, 2023.",
    ),
    "blog-ai-construction.html": dict(
        slug="blog-ai-construction", type="article", image="/images/blog/ai-construction.png",
        published="2026-10-14", modified="2026-10-31",
        title="AI in Construction: Practical Ways AI Helps Project Teams",
        description="Practical uses of AI in construction, from finding project information and structuring site updates to summarising records, with human oversight.",
    ),
    "blog-boq-cost-overruns.html": dict(
        slug="blog-boq-cost-overruns", type="article", image="/images/blog/boq-cost-overruns.png",
        published="2026-10-14", modified="2026-10-31",
        title="Why Accurate BOQs Still Lead to Construction Cost Overruns",
        description="Your BOQ can be correct and the project can still lose money. See where construction cost overruns really come from and how to catch them earlier.",
    ),
    "blog-construction-information-management.html": dict(
        slug="blog-construction-information-management", type="article", image="/images/blog/construction-information-management.png",
        published="2026-10-14", modified="2026-10-31",
        title="Construction Information Management: Fix the Info Gap",
        description="Most construction communication problems are information problems. Learn how to manage project information so the right people act on the right data.",
    ),
    "blog-drawing-revisions.html": dict(
        slug="blog-drawing-revisions", type="article", image="/images/blog/drawing-revisions.png",
        published="2026-10-14", modified="2026-10-31",
        title="Drawing Revision Control: Avoid Outdated Drawings on Site",
        description="The most dangerous drawing on site is the one that is no longer current. How to control drawing revisions so crews always build from the latest one.",
    ),
    "blog-rework-coordination.html": dict(
        slug="blog-rework-coordination", type="article", image="/images/blog/rework-coordination.png",
        published="2026-10-14", modified="2026-10-31",
        title="Construction Rework: The Information Gaps Behind It",
        description="Construction rework often starts with unclear instructions, outdated drawings and missed approvals. Learn how better coordination reduces avoidable rework.",
    ),
    "blog-seven-site-updates.html": dict(
        slug="blog-seven-site-updates", type="article", image="/images/blog/seven-site-updates.png",
        published="2026-10-14", modified="2026-10-31",
        title="7 Construction Site Updates Your Team Should Track",
        description="The seven site updates every construction team should capture daily, from progress and manpower to blockers, materials, approvals and next steps.",
    ),
    "blog-where-time-goes.html": dict(
        slug="blog-where-time-goes", type="article", image="/images/blog/where-time-goes.png",
        published="2026-10-14", modified="2026-10-31",
        title="Where Does a Construction Project Actually Lose Time?",
        description="Construction delays build up between activities, approvals, decisions and handoffs. Learn how to spot waiting time and improve project coordination.",
    ),
    "404.html": dict(
        slug="404", noindex=True,
        title="Page Not Found | Brikito Construction Software",
        description="This page doesn't exist or has moved. Explore Brikito's construction management software: Brik AI, BrikChat, BrikVision and BrikDocs.",
    ),
}

ORGANIZATION = {
    "@type": "Organization",
    "@id": ORG_ID,
    "name": "Brikito",
    "url": SITE + "/",
    "logo": SITE + "/apple-touch-icon.png",
    "description": "Brikito is construction management software that puts site chat, attendance, drawings, reports and a live project dashboard into one app, with Brik AI built in.",
    "slogan": "Construction made simple.",
    "email": "hey@brikito.com",
    "founder": {"@type": "Person", "name": "Aashiq Ahamed", "jobTitle": "Founder"},
    "sameAs": [
        "https://www.linkedin.com/company/brikito",
        "https://www.instagram.com/brikitoai/",
        "https://www.youtube.com/@Brikitoai",
        "https://www.facebook.com/brikitoai",
    ],
}

def crumbs(name, slug):
    return {"@type": "BreadcrumbList", "itemListElement": [
        {"@type": "ListItem", "position": 1, "name": "Brikito", "item": SITE + "/"},
        {"@type": "ListItem", "position": 2, "name": name, "item": url(slug)},
    ]}

def text(s):
    return html.unescape(re.sub(r"<[^>]+>", " ", s)).replace("\xa0", " ").strip()

def squash(s):
    return re.sub(r"\s+", " ", s).strip()

# ---------------------------------------------------------------------------
# Structured data for pages that don't carry their own
# ---------------------------------------------------------------------------
def ld_index(page, s):
    return [ORGANIZATION,
            {"@type": "WebSite", "@id": SITE + "/#website", "name": "Brikito", "url": SITE + "/",
             "publisher": {"@id": ORG_ID}, "inLanguage": "en"},
            {"@type": "SoftwareApplication", "name": "Brikito", "url": SITE + "/",
             "applicationCategory": "BusinessApplication",
             "applicationSubCategory": "Construction management software",
             "operatingSystem": "Web, Android, iOS",
             "description": page["description"],
             "publisher": {"@id": ORG_ID},
             "offers": {"@type": "AggregateOffer", "priceCurrency": "INR", "lowPrice": "12999",
                        "highPrice": "19999", "offerCount": "2", "url": url("pricing")}}]

def ld_pricing(page, s):
    faqs = []
    grid = s[s.find('class="faq-grid"'):] if 'class="faq-grid"' in s else ""
    for q, a in re.findall(r'<(?:div|article) class="faq">\s*<h3>(.*?)</h3>\s*<p>(.*?)</p>', grid, re.S):
        faqs.append({"@type": "Question", "name": squash(text(q)),
                     "acceptedAnswer": {"@type": "Answer", "text": squash(text(a))}})
    out = [{"@type": "SoftwareApplication", "name": "Brikito", "url": url("pricing"),
            "applicationCategory": "BusinessApplication",
            "applicationSubCategory": "Construction management software",
            "operatingSystem": "Web, Android, iOS", "publisher": {"@id": ORG_ID},
            "offers": [
                {"@type": "Offer", "name": "Standard", "price": "12999", "priceCurrency": "INR",
                 "url": url("pricing"), "description": "Up to 2 active projects and 25 users. 14-day free trial. Billed monthly; GST extra."},
                {"@type": "Offer", "name": "Professional", "price": "19999", "priceCurrency": "INR",
                 "url": url("pricing"), "description": "Up to 5 active projects and 75 users. Billed monthly; GST extra."},
            ]},
           crumbs("Pricing", "pricing")]
    if faqs:
        out.append({"@type": "FAQPage", "mainEntity": faqs})
    return out

def ld_simple(kind, name):
    def f(page, s):
        return [{"@type": kind, "name": page["title"], "url": url(page["slug"]),
                 "description": page["description"], "isPartOf": {"@id": SITE + "/#website"},
                 "publisher": {"@id": ORG_ID}, "inLanguage": "en"},
                crumbs(name, page["slug"])]
    return f

def ld_blog(page, s):
    posts = []
    for fname, p in PAGES.items():
        if p.get("type") == "article":
            posts.append({"@type": "BlogPosting", "headline": p["title"], "url": url(p["slug"]),
                          "image": SITE + p["image"], "datePublished": p["published"],
                          "description": p["description"]})
    return [{"@type": "Blog", "name": "Brikito Resources", "url": url("blog"),
             "description": page["description"], "publisher": {"@id": ORG_ID},
             "inLanguage": "en", "blogPost": posts},
            crumbs("Resources", "blog")]

BUILDERS = {
    "index.html": ld_index,
    "pricing.html": ld_pricing,
    "how-it-works.html": ld_simple("WebPage", "How it works"),
    "book-a-demo.html": ld_simple("ContactPage", "Book a demo"),
    "privacy.html": ld_simple("WebPage", "Privacy policy"),
    "blog.html": ld_blog,
}

def enrich_article(page, s):
    """Keep each article's own BlogPosting data and add what Google needs."""
    m = re.search(r'<script type="application/ld\+json">(.*?)</script>', s, re.S)
    post = json.loads(m.group(1)) if m else {}
    if "@graph" in post:
        post = next((x for x in post["@graph"] if x.get("@type") == "BlogPosting"), {})
    post.pop("@context", None)
    post.update({
        "@type": "BlogPosting",
        "headline": post.get("headline") or page["title"],
        "description": post.get("description") or page["description"],
        "image": [SITE + page["image"]],
        "datePublished": page["published"],
        "dateModified": page["modified"],
        "url": url(page["slug"]),
        "mainEntityOfPage": {"@type": "WebPage", "@id": url(page["slug"])},
        "author": post.get("author") or {"@type": "Organization", "name": "Brikito", "url": SITE + "/"},
        "publisher": {"@type": "Organization", "@id": ORG_ID, "name": "Brikito",
                      "logo": {"@type": "ImageObject", "url": SITE + "/apple-touch-icon.png"}},
        "inLanguage": "en",
    })
    return [post, {"@type": "BreadcrumbList", "itemListElement": [
        {"@type": "ListItem", "position": 1, "name": "Brikito", "item": SITE + "/"},
        {"@type": "ListItem", "position": 2, "name": "Resources", "item": url("blog")},
        {"@type": "ListItem", "position": 3, "name": page["title"], "item": url(page["slug"])},
    ]}]

# ---------------------------------------------------------------------------
# <head> rewriting
# ---------------------------------------------------------------------------
STRIP = [
    r'[ \t]*<title>.*?</title>\s*\n?',
    r'[ \t]*<meta\b[^>]*\bname="description"[^>]*>\s*\n?',
    r'[ \t]*<meta\b[^>]*\bname="robots"[^>]*>\s*\n?',
    r'[ \t]*<link\b[^>]*\brel="canonical"[^>]*>\s*\n?',
    r'[ \t]*<meta\b[^>]*\bproperty="(?:og|article):[^"]*"[^>]*>\s*\n?',
    r'[ \t]*<meta\b[^>]*\bname="twitter:[^"]*"[^>]*>\s*\n?',
    r'[ \t]*<link\b[^>]*\brel="apple-touch-icon"[^>]*>\s*\n?',
    r'[ \t]*<meta\b[^>]*\bname="theme-color"[^>]*>\s*\n?',
]

def esc(v):
    return html.escape(v, quote=True)

def head_block(page):
    img = SITE + page.get("image", DEFAULT_IMAGE)
    canonical = url(page["slug"])
    robots = "noindex, follow" if page.get("noindex") else "index, follow, max-image-preview:large, max-snippet:-1"
    og_title = re.sub(r"\s*\|\s*Brikito.*$", "", page["title"])
    lines = [
        f'<title>{esc(page["title"])}</title>',
        f'<meta name="description" content="{esc(page["description"])}" />',
        f'<meta name="robots" content="{robots}" />',
    ]
    if not page.get("noindex"):
        lines.append(f'<link rel="canonical" href="{canonical}" />')
    lines += [
        f'<meta property="og:type" content="{page.get("type", "website")}" />',
        '<meta property="og:site_name" content="Brikito" />',
        '<meta property="og:locale" content="en_IN" />',
        f'<meta property="og:title" content="{esc(og_title)}" />',
        f'<meta property="og:description" content="{esc(page["description"])}" />',
        f'<meta property="og:url" content="{canonical}" />',
        f'<meta property="og:image" content="{img}" />',
    ]
    if page.get("type") == "article":
        lines += [f'<meta property="article:published_time" content="{page["published"]}" />',
                  f'<meta property="article:modified_time" content="{page["modified"]}" />']
    lines += [
        '<meta name="twitter:card" content="summary_large_image" />',
        f'<meta name="twitter:title" content="{esc(og_title)}" />',
        f'<meta name="twitter:description" content="{esc(page["description"])}" />',
        f'<meta name="twitter:image" content="{img}" />',
        '<meta name="theme-color" content="#ffffff" />',
        '<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />',
    ]
    return "\n".join(lines) + "\n"

def process(fname, page):
    path = os.path.join(ROOT, fname)
    s = open(path, encoding="utf-8").read()
    original = s
    head_end = s.index("</head>")
    head, rest = s[:head_end], s[head_end:]
    for rx in STRIP:
        head = re.sub(rx, "", head, flags=re.S | re.I)
    vp = re.search(r'<meta\b[^>]*\bname="viewport"[^>]*>[ \t]*\n', head)
    if not vp:
        sys.exit(f"{fname}: no viewport meta to anchor on")
    head = head[:vp.end()] + head_block(page) + head[vp.end():]

    # structured data
    graph = None
    if page.get("type") == "article":
        graph = enrich_article(page, original)
    elif fname in BUILDERS:
        graph = BUILDERS[fname](page, original)
    if graph is not None:
        head = re.sub(r'[ \t]*<script type="application/ld\+json">.*?</script>\s*\n?', "", head, flags=re.S)
        ld = json.dumps({"@context": "https://schema.org", "@graph": graph}, ensure_ascii=False, indent=2)
        head = head.rstrip() + f'\n<script type="application/ld+json">\n{ld}\n</script>\n'
    s = head + rest
    if s != original:
        open(path, "w", encoding="utf-8").write(s)
        return True
    return False

def write_sitemap():
    """sitemap.xml lists every indexable page in PAGES with its clean URL."""
    today = "2026-10-31"
    rows = []
    order = ["index.html"] + sorted(f for f in PAGES if f != "index.html")
    for fname in order:
        page = PAGES[fname]
        if page.get("noindex") or not os.path.exists(os.path.join(ROOT, fname)):
            continue
        lastmod = page.get("modified", today)
        rows.append(f"  <url><loc>{url(page['slug'])}</loc><lastmod>{lastmod}</lastmod></url>")
    xml = ('<?xml version="1.0" encoding="UTF-8"?>\n'
           '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
           + "\n".join(rows) + "\n</urlset>\n")
    open(os.path.join(ROOT, "sitemap.xml"), "w", encoding="utf-8").write(xml)
    print(f"sitemap.xml: {len(rows)} pages")

def main():
    present = {os.path.basename(p) for p in glob.glob(os.path.join(ROOT, "*.html"))}
    changed = 0
    for fname, page in PAGES.items():
        if fname not in present:
            print(f"  (skip) {fname} not found")
            continue
        for k in ("title", "description"):
            n = len(page[k])
            lo, hi = (30, 60) if k == "title" else (110, 160)
            if not lo <= n <= hi:
                print(f"  ! {fname}: {k} is {n} characters (aim for {lo}-{hi})")
        changed += process(fname, page)
    missing = sorted(present - set(PAGES) - SKIP - {f for f in present if f.startswith("google")})
    if missing:
        print("  ! pages with no SEO settings yet:", ", ".join(missing))
    print(f"{changed} page(s) updated")
    write_sitemap()

if __name__ == "__main__":
    main()
