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
const RELATED_HTML = RELATED_SITES.map(s => `<a href="${s.url}" style="color:var(--red);font-weight:bold;text-decoration:none;margin:4px 8px;display:inline-block;">${s.name}</a>`).join(' ');

// ─────────────────────────────────────────────
// SETUP
// ─────────────────────────────────────────────
const citiesPath = path.resolve(__dirname, 'cities.json');
const outDir     = path.resolve(__dirname, 'delivery');

if (!fs.existsSync(citiesPath)) {
    console.error("Error: cities.json is missing!");
    process.exit(1);
}

const cities = JSON.parse(fs.readFileSync(citiesPath, 'utf8'));
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

// ─────────────────────────────────────────────
// OCCASIONS — no occ tags, one URL for all
// ─────────────────────────────────────────────
const occasions = [
    { name: "Valentine's Day Flowers" },
    { name: "Romantic Roses" },
    { name: "Anniversary Flowers" },
    { name: "Birthday Flowers" },
    { name: "Mother's Day Flowers" },
    { name: "Sympathy Flowers" },
];

// ─────────────────────────────────────────────
// GENERATE PAGES
// ─────────────────────────────────────────────
let generated = 0;

cities.forEach((item, i) => {
    const occ      = occasions[i % occasions.length];
    const cityName = item.city;
    const state    = item.state || '';
    const location = state ? `${cityName}, ${state}` : cityName;
    const slug     = `${cityName.toLowerCase().replace(/ /g, '-')}${state ? '-' + state.toLowerCase() : ''}-flowers.html`;

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${occ.name} in ${location} — Same-Day Free Delivery | ValentinesDayFlowers</title>
    <meta name="description" content="Send ${occ.name.toLowerCase()} in ${location}. Free same-day delivery, $0 service fees, from $29.99. 4.8 stars from 18,742 customers.">
    <meta name="robots" content="index, follow">
    <link rel="canonical" href="${BASE_URL}/delivery/${slug}">
    <script type="application/ld+json">
    {"@context":"https://schema.org","@type":"Product","name":"Floristone ${occ.name} — ${location}","offers":{"@type":"Offer","priceCurrency":"USD","price":"29.99","availability":"https://schema.org/InStock","url":"${AFF_URL}","deliveryLeadTime":{"@type":"QuantitativeValue","value":"0","unitCode":"DAY"}},"aggregateRating":{"@type":"AggregateRating","ratingValue":"4.8","reviewCount":"18742"}}
    <\/script>
    <style>
        :root{--red:#e63946;--red-dk:#a4133c;--bg:#fff9fa;--border:#f8d7da;}
        *{box-sizing:border-box;margin:0;padding:0;}
        body{font-family:system-ui,sans-serif;background:var(--bg);color:#333;line-height:1.7;max-width:760px;margin:0 auto;padding:40px 24px 80px;}
        h1{font-size:clamp(1.6rem,4vw,2.2rem);color:#1a1a1a;margin-bottom:16px;}
        h2{font-size:1.2rem;color:#1a1a1a;margin:28px 0 10px;}
        p{margin-bottom:16px;font-size:1rem;color:#444;}
        .cta{display:inline-block;background:var(--red);color:#fff;padding:14px 32px;border-radius:99px;font-weight:900;text-decoration:none;font-size:1rem;margin:20px 0;}
        .trust{background:#fff;border:1px solid var(--border);border-radius:8px;padding:16px;margin:20px 0;font-size:0.85rem;font-weight:bold;color:#444;}
        .related{border-top:1px solid var(--border);margin-top:40px;padding-top:20px;text-align:center;font-size:0.82rem;}
        footer{margin-top:40px;font-size:0.78rem;color:#999;text-align:center;}
    </style>
</head>
<body>
    <h1>🌹 ${occ.name} in ${location} — Same-Day Delivery</h1>
    <div class="trust">
        ✓ Free Same-Day Delivery &nbsp;|&nbsp; ✓ $0 Service Fees &nbsp;|&nbsp; ✓ 4.8★ 18,742 Reviews &nbsp;|&nbsp; ✓ Farm-Fresh Guaranteed
    </div>
    <p>Send ${occ.name.toLowerCase()} in ${location} today with free same-day delivery and $0 service fees. Floristone's local florists in ${cityName} cut flowers fresh and deliver the same day — from $29.99, all-inclusive.</p>
    <p>4.8/5 stars from 18,742 verified customers. Free delivery. Live tracking on every order. No hidden fees — ever.</p>
    <a href="${AFF_URL}" class="cta" target="_blank" rel="nofollow sponsored noopener">🌹 Order ${occ.name} in ${cityName} Now</a>
    <h2>Why Floristone for ${location}?</h2>
    <p>Floristone has local florists throughout ${location} who cut and arrange your flowers fresh on the day of delivery. No warehouse storage, no wilted stems. Order by noon for guaranteed same-day arrival.</p>
    <a href="${AFF_URL}" style="color:var(--red);font-weight:bold;" target="_blank" rel="nofollow sponsored noopener">→ Browse all arrangements</a>
    <p style="margin-top:20px;"><a href="${BASE_URL}/" style="color:var(--red);">← Back to home</a></p>
    <div class="related">
        <strong>More Flower Delivery Sites:</strong><br><br>
        ${RELATED_HTML}
    </div>
    <footer>This page contains affiliate links. We may earn a commission. © ${year} ValentinesDayFlowers</footer>
</body>
</html>`;

    fs.writeFileSync(path.join(outDir, slug), html);
    generated++;
});

console.log(`✅ Vulture Matrix complete: ${generated} city pages generated`);
console.log(`   Affiliate URL: ${AFF_URL}`);
