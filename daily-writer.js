const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// ─────────────────────────────────────────────
// CONFIG — DO NOT CHANGE AFFILIATE URL
// ─────────────────────────────────────────────
const AFF_URL  = "https://www.floristone.com/main.cfm?cat=r&source_id=aff&AffiliateID=2013017799";
const BASE_URL = "https://brightlane.github.io/ValentinesDayFlowers";
const today    = new Date().toISOString().slice(0, 10);
const year     = new Date().getFullYear();
const seed     = parseInt(crypto.createHash('md5').update(today).digest('hex').slice(0, 8), 16);

// ─────────────────────────────────────────────
// CONTENT POOLS
// ─────────────────────────────────────────────
const cities = [
    "New York","Los Angeles","Chicago","Houston","Phoenix","Philadelphia",
    "San Antonio","San Diego","Dallas","San Jose","Austin","Seattle",
    "Denver","Nashville","Miami","Atlanta","Tampa","Minneapolis",
    "Toronto","Montreal","Vancouver","Calgary","Edmonton","Ottawa",
    "Winnipeg","Boston","Portland","Las Vegas","Baltimore","Washington DC",
];

const occasions = [
    { name: "Valentine's Day Flowers", slug: "valentines-day" },
    { name: "Romantic Roses",          slug: "romance" },
    { name: "Anniversary Flowers",     slug: "anniversary" },
    { name: "Mother's Day Flowers",    slug: "mothers-day" },
    { name: "Birthday Flowers",        slug: "birthday" },
    { name: "Sympathy Flowers",        slug: "sympathy" },
    { name: "Get Well Flowers",        slug: "get-well" },
    { name: "Thank You Flowers",       slug: "thank-you" },
];

const titles = [
    `Send {occ} to {city} — Same-Day Free Delivery ${year}`,
    `Best {occ} Delivered to {city} — No Hidden Fees`,
    `Order {occ} Online in {city} — Free Same Day`,
    `Last Minute {occ} in {city} — Still Delivered Today`,
];

const intros = [
    "Need {occ} delivered to {city} today? Floristone's local florist network guarantees same-day delivery across {city} — free delivery, $0 service fees, farm-fresh flowers guaranteed.",
    "Send beautiful {occ} to {city} in 2 minutes. Floristone delivers same-day across {city} with free delivery and zero hidden fees — starting at $29.99.",
    "Looking for {occ} in {city}? Floristone makes it simple — order now, same-day delivery, free, $0 fees, 4.8 stars from 18,742 customers.",
    "The easiest way to send {occ} to {city} — Floristone delivers same-day with free delivery and $0 service fees. Farm-fresh, local florists, live tracking.",
];

// ─────────────────────────────────────────────
// CROSS-LINKS
// ─────────────────────────────────────────────
const RELATED_SITES = [
    { name: "Send Flowers Online",     url: "https://brightlane.github.io/SendFlowersOnline/" },
    { name: "Mother's Day Flowers",    url: "https://brightlane.github.io/MothersDayFlowers/" },
    { name: "Bouquet Flowers",         url: "https://brightlane.github.io/BouquetFlowers/" },
    { name: "FTD Flowers",             url: "https://brightlane.github.io/FtdFlowers/" },
    { name: "Same Day Flowers",        url: "https://brightlane.github.io/SameDayFlowers/" },
    { name: "Christmas Flowers",       url: "https://brightlane.github.io/ChristmasFlowers/" },
    { name: "Flower Delivery",         url: "https://brightlane.github.io/FlowerDelivery/" },
    { name: "Same Day Florist",        url: "https://brightlane.github.io/SameDayFlorist/" },
];
const relatedHTML = RELATED_SITES.map(s => `<a href="${s.url}">${s.name}</a>`).join(' &nbsp;|&nbsp; ');

// ─────────────────────────────────────────────
// PICK TODAY'S CONTENT
// ─────────────────────────────────────────────
const city     = cities[seed % cities.length];
const occasion = occasions[Math.floor(seed / 7) % occasions.length];
const title    = titles[Math.floor(seed / 13) % titles.length].replace(/{occ}/g, occasion.name).replace(/{city}/g, city);
const intro    = intros[Math.floor(seed / 17) % intros.length].replace(/{occ}/g, occasion.name.toLowerCase()).replace(/{city}/g, city);
const citySlug = city.toLowerCase().replace(/ /g, '-');
const filename = `blog-${citySlug}-${occasion.slug}-${today}.html`;

// ─────────────────────────────────────────────
// HTML
// ─────────────────────────────────────────────
const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title} | ValentinesDayFlowers</title>
    <meta name="description" content="Send ${occasion.name.toLowerCase()} to ${city}. Free same-day delivery, $0 fees, from $29.99. 4.8 stars from 18,742 customers.">
    <meta name="robots" content="index, follow">
    <link rel="canonical" href="${BASE_URL}/blog/${filename}">
    <script type="application/ld+json">
    {"@context":"https://schema.org","@graph":[
      {"@type":"Article","headline":"${title}","datePublished":"${today}","dateModified":"${today}","author":{"@type":"Organization","name":"ValentinesDayFlowers"}},
      {"@type":"Product","name":"Floristone ${occasion.name} — ${city}","offers":{"@type":"Offer","priceCurrency":"USD","price":"29.99","availability":"https://schema.org/InStock","url":"${AFF_URL}","deliveryLeadTime":{"@type":"QuantitativeValue","value":"0","unitCode":"DAY"}},"aggregateRating":{"@type":"AggregateRating","ratingValue":"4.8","reviewCount":"18742"}}
    ]}
    <\/script>
    <style>
        :root{--red:#e63946;--red-dk:#a4133c;--bg:#fff9fa;--border:#f8d7da;}
        *{box-sizing:border-box;margin:0;padding:0;}
        body{font-family:system-ui,sans-serif;background:var(--bg);color:#333;line-height:1.7;}
        .nav{background:#fff;padding:14px 5%;border-bottom:1px solid var(--border);font-weight:700;color:var(--red-dk);display:flex;justify-content:space-between;align-items:center;}
        .nav a{font-size:0.85rem;color:var(--red);text-decoration:none;}
        .article{max-width:760px;margin:0 auto;padding:50px 24px 80px;}
        .eyebrow{font-size:0.75rem;font-weight:700;color:var(--red);letter-spacing:0.1em;text-transform:uppercase;margin-bottom:12px;display:block;}
        h1{font-size:clamp(1.8rem,4vw,2.5rem);color:#1a1a1a;margin-bottom:16px;line-height:1.2;}
        .byline{font-size:0.85rem;color:#999;margin-bottom:32px;border-bottom:1px solid var(--border);padding-bottom:16px;}
        h2{font-size:1.3rem;color:#1a1a1a;margin:32px 0 10px;}
        p{margin-bottom:16px;font-size:1rem;color:#444;}
        .cta-box{background:linear-gradient(135deg,#a4133c 0%,#e63946 100%);color:#fff;text-align:center;padding:40px 24px;border-radius:16px;margin:40px 0;}
        .cta-box h2{color:#fff;margin:0 0 10px;font-size:1.5rem;}
        .cta-box p{color:rgba(255,255,255,0.88);margin-bottom:20px;}
        .cta-btn{background:#fff;color:var(--red-dk);padding:14px 32px;border-radius:99px;font-weight:900;text-decoration:none;display:inline-block;font-size:1rem;}
        .trust-row{display:flex;justify-content:center;gap:16px;flex-wrap:wrap;margin-top:12px;}
        .trust-row span{font-size:0.75rem;color:rgba(255,255,255,0.8);font-weight:700;}
        .faq-box{background:#fff;border:1px solid var(--border);border-radius:12px;padding:24px;margin:32px 0;}
        .faq-box strong{display:block;color:#1a1a1a;margin-bottom:8px;}
        .faq-box p{margin:0;font-size:0.92rem;}
        .related{background:#fff;border-top:1px solid var(--border);padding:20px 24px;text-align:center;font-size:0.82rem;}
        .related a{color:var(--red);text-decoration:none;font-weight:600;}
        .related a:hover{text-decoration:underline;}
        .back{display:block;text-align:center;margin-top:32px;font-size:0.85rem;color:var(--red);text-decoration:none;}
        footer{background:#1d3557;color:#888;text-align:center;padding:24px;font-size:0.78rem;}
    </style>
</head>
<body>
<nav class="nav">ValentinesDayFlowers <a href="${BASE_URL}/">← Back to home</a></nav>
<article class="article">
    <span class="eyebrow">${occasion.name} · ${city} · ${today}</span>
    <h1>${title}</h1>
    <p class="byline">ValentinesDayFlowers · Same-day delivery in ${city} · ${today}</p>
    <p>${intro}</p>
    <h2>How to send ${occasion.name.toLowerCase()} to ${city} today</h2>
    <p>Order in 2 minutes. Choose your arrangement, add a card message, enter the delivery address in ${city}, and checkout. Floristone's local florists in ${city} cut flowers fresh and deliver same-day. Free delivery, $0 fees, live tracking included.</p>
    <h2>Why Floristone is the best romantic flower delivery in ${city}</h2>
    <p>4.8/5 stars from 18,742 verified customers. Free same-day delivery. $0 service fees. Local florists in ${city} — no warehouse transit, no wilted stems. Red roses, peonies, orchids all from $29.99.</p>
    <div class="cta-box">
        <h2>Send ${occasion.name} to ${city} Now</h2>
        <p>From $29.99 · Free delivery · $0 fees · 4.8★ from 18,742 customers</p>
        <a href="${AFF_URL}" class="cta-btn" target="_blank" rel="nofollow sponsored noopener">🌹 Order Now</a>
        <div class="trust-row">
            <span>✓ FREE DELIVERY</span><span>✓ $0 FEES</span><span>✓ FARM FRESH</span><span>✓ LIVE TRACKING</span>
        </div>
    </div>
    <div class="faq-box">
        <strong>Q: Can I get ${occasion.name.toLowerCase()} delivered same-day in ${city}?</strong>
        <p>Yes. Floristone guarantees same-day delivery across ${city} with free delivery and $0 service fees. Order before the daily cutoff for guaranteed same-day arrival.</p>
    </div>
    <a href="${AFF_URL}" class="back" target="_blank" rel="nofollow sponsored noopener">→ Browse all ${occasion.name.toLowerCase()} on Floristone</a>
    <a href="${BASE_URL}/" class="back">← Browse all romantic flowers</a>
</article>
<div class="related">
    <strong>More Flower Delivery Sites:</strong><br><br>
    ${relatedHTML}
</div>
<footer>This page contains affiliate links. We may earn a commission at no cost to you. © ${year} ValentinesDayFlowers</footer>
</body>
</html>`;

// ─────────────────────────────────────────────
// WRITE FILE
// ─────────────────────────────────────────────
const blogDir = 'blog';
if (!fs.existsSync(blogDir)) fs.mkdirSync(blogDir, { recursive: true });
fs.writeFileSync(path.join(blogDir, filename), html);

console.log(`Generated: blog/${filename}`);
console.log(`City: ${city} | Occasion: ${occasion.name}`);
console.log(`Affiliate URL: ${AFF_URL}`);
