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
        title="Brikito: AI Construction Management Software & App",
        description="AI construction management software for builders and developers in India, UAE and Singapore: site chat, attendance, AI CCTV, reports and live dashboards.",
    ),
    "about.html": dict(
        slug="about",
        title="About Brikito: The Team Building Construction's AI OS",
        description="Meet Brikito, the team building the AI operating system for real estate development. Our story, mission, values, pilot results and founder Aashiq Ahamed.",
    ),
    "console.html": dict(
        slug="console", image="/img/console-home.webp",
        title="Brikito Console: One Place to Run Every Project",
        description="Brikito Console is the base platform for every project: site chat, Brik AI, labour, store, documents, subcontractors and approvals in one login.",
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
        description="Brikito plans for construction teams: Standard with a free trial, Professional for overseeing contractors, and Enterprise. Pricing on request.",
    ),
    "book-a-demo.html": dict(
        slug="book-a-demo",
        title="Book a Demo of Brikito Construction Software",
        description="Book a 45-minute Brikito demo. We'll set your team up on one live project and show you site chat, Brik AI and reports running the same day.",
    ),
    "blog.html": dict(
        slug="blog", modified="2026-11-11",
        title="Brikito Journal: Construction, AI & Project Guides",
        description="Practical guides for construction teams on project coordination, site updates, drawing control, cost overruns, construction technology and AI.",
    ),
    "brik-ai-policy.html": dict(
        slug="brik-ai-policy",
        title="Generative AI (Brik AI) Policy | Brikito",
        description="How Brik AI works, which AI models it runs on, how Brikito handles your project data, and how people stay in control of AI-assisted decisions.",
    ),
    "privacy.html": dict(
        slug="privacy",
        title="Privacy Policy | Brikito Construction Software",
        description="What personal data Brikito collects, why, how it is used, who can see it, and your rights under India's Digital Personal Data Protection Act, 2023.",
    ),
    "blog-ai-construction.html": dict(
        slug="blog-ai-construction", type="article", image="/images/blog/ai-construction.png",
        published="2026-10-30", modified="2026-11-07",
        title="AI in Construction: Practical Ways AI Helps Project Teams",
        description="Practical uses of AI in construction, from finding project information and structuring site updates to summarising records, with human oversight.",
    ),
    "blog-boq-cost-overruns.html": dict(
        slug="blog-boq-cost-overruns", type="article", image="/images/blog/boq-cost-overruns.png",
        published="2026-11-01", modified="2026-11-01",
        title="Why Accurate BOQs Still Lead to Construction Cost Overruns",
        description="Your BOQ can be correct and the project can still lose money. See where construction cost overruns really come from and how to catch them earlier.",
    ),
    "blog-construction-information-management.html": dict(
        slug="blog-construction-information-management", type="article", image="/images/blog/construction-information-management.png",
        published="2026-11-02", modified="2026-11-02",
        title="Construction Information Management: Fix the Info Gap",
        description="Most construction communication problems are information problems. Learn how to manage project information so the right people act on the right data.",
    ),
    "blog-drawing-revisions.html": dict(
        slug="blog-drawing-revisions", type="article", image="/images/blog/drawing-revisions.png",
        published="2026-10-29", modified="2026-10-29",
        title="Drawing Revision Control: Avoid Outdated Drawings on Site",
        description="The most dangerous drawing on site is the one that is no longer current. How to control drawing revisions so crews always build from the latest one.",
    ),
    "blog-rework-coordination.html": dict(
        slug="blog-rework-coordination", type="article", image="/images/blog/rework-coordination.png",
        published="2026-10-28", modified="2026-10-28",
        title="Construction Rework: The Information Gaps Behind It",
        description="Construction rework often starts with unclear instructions, outdated drawings and missed approvals. Learn how better coordination reduces avoidable rework.",
    ),
    "blog-seven-site-updates.html": dict(
        slug="blog-seven-site-updates", type="article", image="/images/blog/seven-site-updates.png",
        published="2026-10-31", modified="2026-10-31",
        title="7 Construction Site Updates Your Team Should Track",
        description="The seven site updates every construction team should capture daily, from progress and manpower to blockers, materials, approvals and next steps.",
    ),
    "blog-where-time-goes.html": dict(
        slug="blog-where-time-goes", type="article", image="/images/blog/where-time-goes.png",
        published="2026-10-27", modified="2026-10-27",
        title="Where Does a Construction Project Actually Lose Time?",
        description="Construction delays build up between activities, approvals, decisions and handoffs. Learn how to spot waiting time and improve project coordination.",
    ),
    "blog-daily-progress-report-construction.html": dict(
        slug="blog-daily-progress-report-construction", type="article", image="/images/blog/daily-progress-report-construction.jpg",
        published="2026-11-02", modified="2026-11-07",
        title="Daily Progress Report in Construction: Format & Template",
        description="What a construction daily progress report (DPR) should include, a worked example, a format you can copy, mistakes to avoid and how to automate it.",
    ),
    "blog-building-construction-process.html": dict(
        slug="blog-building-construction-process", type="article", image="/images/blog/building-construction-process.jpg",
        published="2026-11-02", modified="2026-11-07",
        title="Building Construction Process: A Step-by-Step Guide",
        description="The building construction process step by step, from approvals and foundations to frame, services, finishes and handover, with hold points and checklists.",
    ),
    "blog-construction-material-management.html": dict(
        slug="blog-construction-material-management", type="article", image="/images/blog/construction-material-management.jpg",
        published="2026-11-02", modified="2026-11-07",
        title="Construction Material Management: Indent to Consumption",
        description="How construction material management works from indent to purchase order, GRN, storage, issue and reconciliation, with IS 4082 storage rules and a checklist.",
    ),
    "blog-construction-cost-control.html": dict(
        slug="blog-construction-cost-control", type="article", image="/images/blog/construction-cost-control.jpg",
        published="2026-11-02", modified="2026-11-07",
        title="Construction Cost Control: A Practical Guide for Developers",
        description="A practical guide to construction cost control for developers: baseline budgets, commitments, earned value, materials, labour, changes and cash flow.",
    ),
    "blog-construction-scheduling.html": dict(
        slug="blog-construction-scheduling", type="article", image="/images/blog/construction-scheduling.jpg",
        published="2026-11-02", modified="2026-11-07",
        title="Construction Scheduling and Delay Management Guide",
        description="How construction scheduling and delay management work: master programme, look-ahead plans, critical path, PPC, delay types and recovery, with a checklist.",
    ),
    "blog-construction-market-guide.html": dict(
        slug="blog-construction-market-guide", type="article", image="/images/blog/construction-market-guide.jpg",
        published="2026-11-02", modified="2026-11-07",
        title="Construction in India, UAE, Singapore & Sri Lanka: Guide",
        description="How construction is regulated in India, UAE, Singapore and Sri Lanka: RERA, Dubai escrow, BCA and CONQUAS, CIDA, and the site problems all four share.",
    ),
    "blog-construction-site-communication.html": dict(
        slug="blog-construction-site-communication", type="article", image="/images/blog/construction-site-communication.jpg",
        published="2026-11-05", modified="2026-11-07",
        title="Construction Site Communication: A Complete Guide",
        description="How to set up construction site communication that works: channels, a communication matrix, daily rhythm, RFIs, site instructions and a checklist.",
    ),
    "blog-construction-site-documentation.html": dict(
        slug="blog-construction-site-documentation", type="article", image="/images/blog/construction-site-documentation.jpg",
        published="2026-11-05", modified="2026-11-07",
        title="Construction Site Documentation: Every Report You Need",
        description="Every record a construction project should keep, from DPRs and cube registers to RFIs, site instructions and handover files, with owners and frequency.",
    ),
    "blog-construction-labour-management.html": dict(
        slug="blog-construction-labour-management", type="article", image="/images/blog/construction-labour-management.jpg",
        published="2026-11-05", modified="2026-11-07",
        title="Construction Labour Management: Attendance to Payroll",
        description="How to manage construction labour: manpower planning, proxy-proof attendance, productivity per labour-day, contractor bill checks and labour codes.",
    ),
    "blog-construction-document-control.html": dict(
        slug="blog-construction-document-control", type="article", image="/images/blog/construction-document-control.jpg",
        published="2026-11-06", modified="2026-11-07",
        title="Construction Document Control: Drawings & Revisions",
        description="How to control construction documents: drawing registers, numbering, revision and status codes, transmittals and keeping superseded drawings off site.",
    ),
    "blog-construction-site-safety-and-quality.html": dict(
        slug="blog-construction-site-safety-and-quality", type="article", image="/images/blog/construction-site-safety-and-quality.jpg",
        published="2026-11-06", modified="2026-11-07",
        title="Construction Site Safety and Quality Management Guide",
        description="A practical guide to construction site safety and quality: hazards and controls, permits, PPE, toolbox talks, ITPs, hold points, defects and NCRs.",
    ),
    "blog-construction-management-software.html": dict(
        slug="blog-construction-management-software", type="article", image="/images/blog/construction-management-software.jpg",
        published="2026-11-06", modified="2026-11-07",
        title="Construction Management Software: Buyer's Guide",
        description="How to choose construction management software: types, a feature checklist, pricing models, 15 demo questions and a 7-step selection process.",
    ),
    "blog-best-ai-construction-management-software.html": dict(
        slug="blog-best-ai-construction-management-software", type="article", image="/images/blog/ai-construction-management-software.jpg",
        published="2026-11-07", modified="2026-11-07",
        title="Best AI Construction Management Software (2026 Guide)",
        description="Compare AI construction management software: what AI does on site, 8 buying criteria, top AI construction tools and why builders choose Brikito.",
    ),
    "blog-ai-construction-software-india.html": dict(
        slug="blog-ai-construction-software-india", type="article", image="/images/blog/ai-construction-software-india.jpg",
        published="2026-11-07", modified="2026-11-07",
        title="AI Construction Software in India: Chennai, Bengaluru",
        description="AI construction management software for Indian builders in Chennai, Bengaluru and Coimbatore: multilingual site chat, attendance, materials and reports.",
    ),
    "blog-ai-construction-software-uae-singapore.html": dict(
        slug="blog-ai-construction-software-uae-singapore", type="article", image="/images/blog/ai-construction-software-uae-singapore.jpg",
        published="2026-11-07", modified="2026-11-07",
        title="AI Construction Management Software: UAE & Singapore",
        description="How AI construction management software helps contractors in Dubai, the UAE, Singapore and Sri Lanka with multilingual crews, safety and reporting.",
    ),
    "blog-ai-construction-site-chat.html": dict(
        slug="blog-ai-construction-site-chat", type="article", image="/images/blog/ai-construction-site-chat.jpg",
        published="2026-11-07", modified="2026-11-07",
        title="AI Construction Site Chat: A WhatsApp Alternative",
        description="How AI site chat turns construction messages and voice notes into tagged updates, attendance and indents. A WhatsApp alternative for site teams.",
    ),
    "blog-ai-cctv-construction-site-monitoring.html": dict(
        slug="blog-ai-cctv-construction-site-monitoring", type="article", image="/images/blog/ai-cctv-construction-site-monitoring.jpg",
        published="2026-11-07", modified="2026-11-07",
        title="AI CCTV for Construction Sites: PPE, Headcount, Progress",
        description="How AI CCTV and computer vision give construction sites live headcount, delivery logs, helmet and vest detection and progress monitoring.",
    ),
    "free-tools.html": dict(
        slug="free-tools", image="/img/material-tracker-preview.webp",
        title="Free Construction Tools: DPR, Material Tracker | Brikito",
        description="Free construction tools from Brikito: a site delay cost calculator, an Excel DPR template with checklist, and a material reconciliation and BOQ tracker.",
    ),
    "delay-cost-calculator.html": dict(
        slug="delay-cost-calculator", image="/img/delay-calc-og.png",
        title="Construction Delay Cost Calculator (₹ per day) | Brikito",
        description="Free calculator: see what one day of construction delay costs your project in ₹, from overheads, idle labour, equipment hire, interest and LD.",
    ),
    "blog-real-estate-development-process.html": dict(
        slug="blog-real-estate-development-process", type="article", image="/images/blog/real-estate-development-process.jpg",
        published="2026-11-11", modified="2026-11-11",
        title="Real Estate Development Process: Land to Handover",
        description="The real estate development process in 8 stages: due diligence, feasibility, JDA, approvals, RERA, sales, construction and handover.",
    ),
    "blog-subcontractor-management.html": dict(
        slug="blog-subcontractor-management", type="article", image="/images/blog/subcontractor-management.jpg",
        published="2026-11-11", modified="2026-11-11",
        title="Contractor and Subcontractor Management Guide",
        description="How to manage contractors and subcontractors: prequalification, work orders, coordination, measurement, payment, back-charges and close-out.",
    ),
    "blog-stages-of-house-construction.html": dict(
        slug="blog-stages-of-house-construction", type="article", image="/images/blog/stages-of-house-construction.jpg",
        published="2026-11-11", modified="2026-11-11",
        title="Stages of House Construction: Step-by-Step Guide",
        description="Every stage of house construction from foundation to handover, with checks before each stage, IS 456 curing and formwork times, and tips.",
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
    "logo": SITE + "/icons/icon-512.png",
    "alternateName": "Brikito AI",
    "description": "Brikito is AI construction management software for builders, developers and contractors. It brings site chat (BrikChat), attendance, drawings, AI CCTV (BrikVision), one-tap reports (BrikDocs) and a live project dashboard into one app, with the Brik AI assistant built in.",
    "areaServed": [{"@type": "Country", "name": n} for n in ["India", "United Arab Emirates", "Singapore", "Sri Lanka"]],
    "knowsAbout": ["AI construction management software", "Construction management software", "AI in construction",
                   "Construction site chat", "AI CCTV for construction sites", "Computer vision in construction",
                   "Daily progress reports", "Construction labour attendance", "Construction material management"],
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
             "applicationSubCategory": "AI construction management software",
             "operatingSystem": "Web, Android, iOS",
             "description": page["description"],
             "featureList": ["Brik AI construction assistant", "BrikChat AI site chat", "BrikVision AI CCTV monitoring",
                             "BrikDocs DPR, DLR, BOQ and BBS reports", "Labour attendance and headcount",
                             "Material indents, POs and GRNs", "Drawing version control", "Live project dashboard",
                             "English, Hindi, Marathi, Tamil, Telugu, Kannada and Bengali"],
             "publisher": {"@id": ORG_ID}}]

def ld_pricing(page, s):
    return [{"@type": "SoftwareApplication", "name": "Brikito", "url": url("pricing"),
             "applicationCategory": "BusinessApplication",
             "applicationSubCategory": "Construction management software",
             "operatingSystem": "Web, Android, iOS", "publisher": {"@id": ORG_ID},
             "description": page["description"]},
            crumbs("Pricing", "pricing")]

def ld_console(page, s):
    return [{"@type": "SoftwareApplication", "name": "Brikito Console", "url": url("console"),
             "applicationCategory": "BusinessApplication",
             "applicationSubCategory": "Construction management software",
             "operatingSystem": "Web, Android, iOS", "publisher": {"@id": ORG_ID},
             "description": page["description"], "image": SITE + page["image"]},
            crumbs("Brikito Console", "console")]

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
    return [{"@type": "Blog", "name": "Brikito Journal", "url": url("blog"),
             "description": page["description"], "publisher": {"@id": ORG_ID},
             "inLanguage": "en", "blogPost": posts},
            crumbs("Journal", "blog")]

BUILDERS = {
    "index.html": ld_index,
    "pricing.html": ld_pricing,
    "how-it-works.html": ld_simple("WebPage", "How it works"),
    "book-a-demo.html": ld_simple("ContactPage", "Book a demo"),
    "privacy.html": ld_simple("WebPage", "Privacy policy"),
    "brik-ai-policy.html": ld_simple("WebPage", "Generative AI (Brik AI)"),
    "blog.html": ld_blog,
    "console.html": ld_console,
    "delay-cost-calculator.html": ld_simple("WebPage", "Construction delay cost calculator"),
    "free-tools.html": ld_simple("CollectionPage", "Free construction tools"),
}

def page_faq(s):
    """FAQPage schema from the page's visible FAQ (<details><summary>Q</summary><div class="ans">A</div>)."""
    body = s[s.find("<body"):]
    qa = re.findall(r'<details>\s*<summary>(.*?)</summary>\s*<div class="ans">(.*?)</div>\s*</details>', body, re.S)
    if not qa:
        return None
    return {"@type": "FAQPage", "mainEntity": [
        {"@type": "Question", "name": squash(text(q)), "acceptedAnswer": {"@type": "Answer", "text": squash(text(a))}}
        for q, a in qa]}

def article_faq(s):
    """FAQPage schema from the article's <div class="faq"> section (h3 question + p answer)."""
    m = re.search(r'<div class="faq">(.*?)</div>', s, re.S)
    if not m:
        return None
    txt = lambda x: html.unescape(re.sub(r"<[^>]+>", "", x)).strip()
    qa = re.findall(r"<h3[^>]*>(.*?)</h3>\s*<p[^>]*>(.*?)</p>", m.group(1), re.S)
    if not qa:
        return None
    return {"@type": "FAQPage", "mainEntity": [
        {"@type": "Question", "name": txt(q), "acceptedAnswer": {"@type": "Answer", "text": txt(a)}} for q, a in qa]}

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
                      "logo": {"@type": "ImageObject", "url": SITE + "/icons/icon-512.png"}},
        "inLanguage": "en",
    })
    graph = [post]
    faq = article_faq(s)
    if faq:
        graph.append(faq)
    return graph + [{"@type": "BreadcrumbList", "itemListElement": [
        {"@type": "ListItem", "position": 1, "name": "Brikito", "item": SITE + "/"},
        {"@type": "ListItem", "position": 2, "name": "Journal", "item": url("blog")},
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
    r'[ \t]*<link\b[^>]*\brel="manifest"[^>]*>\s*\n?',
    r'[ \t]*<link\b[^>]*\brel="icon"[^>]*href="/favicon\.ico"[^>]*>\s*\n?',
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
        '<link rel="icon" href="/favicon.ico" sizes="48x48" />',
        '<link rel="manifest" href="/site.webmanifest" />',
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
    if page.get("type") != "article":
        if graph is None:
            m = re.search(r'<script type="application/ld\+json">(.*?)</script>', head, re.S)
            if m:
                old = json.loads(m.group(1))
                graph = old.get("@graph", [old]) if isinstance(old, dict) else old
                for g in graph:
                    g.pop("@context", None)
        if graph is not None or page_faq(original):
            graph = [g for g in (graph or []) if g.get("@type") != "FAQPage"]
            faq = page_faq(original)
            if faq:
                graph.append(faq)
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
