const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const AFF_BASE = "https://www.floristone.com/main.cfm?source_id=aff&AffiliateID=21885";
const BASE_URL = "https://brightlane.github.io/ValentinesDayFlowers";
const today = new Date().toISOString().slice(0, 10);
const year = new Date().getFullYear();
const seed = parseInt(crypto.createHash('md5').update(today).digest('hex').slice(0, 8), 16);

const citiesPath = path.resolve(__dirname, 'cities.json');
const outDir = path.resolve(__dirname, 'delivery');

if (!fs.existsSync(citiesPath)) {
    console.error("Error: cities.json is missing!");
    process.exit(1);
}

const cities = JSON.parse(fs.readFileSync(citiesPath, 'utf8'));
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const occasions = [
    { name: "Valentine's Day Flowers", tag: "ro" },
    { name: "Romantic Roses",          tag: "ro" },
    { name: "Anniversary Flowers",     tag: "an" },
    { name: "Birthday Flowers",        tag: "bd" },
    { name: "Mother's Day Flowers",    tag: "md" },
    { name: "Sympathy Flowers",        tag: "sy" },
];

let generated = 0;
cities.forEach((item, i) => {
    const occ = occasions[i % occasions.length];
    const cityName = item.city;
    const state = item.state || '';
    const slug = `${cityName.toLowerCase().replace(/ /g, '-')}-${state.toLowerCase()}-flowers.html`;
    const affLink = `${AFF_BASE}&occ=${occ.tag}`;
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${occ.name} in ${cityName}${state ? ', ' + state : ''} — Same-Day Free Delivery | ValentinesDayFlowers</title>
    <meta name="description" content="Send ${occ.name.toLowerCase()} in ${cityName}. Free same-day delivery, $0 service fees, from $29.99. 4.8 stars from 18,742 customers.">
    <meta name="robots" content="index, follow">
    <link rel="canonical" href="${BASE_URL}/delivery/${slug}">
    <style>
        :root{--red:#e63946;--red-dk:#a4133c;--bg:#fff9fa;--border:#f8d7da;--mid:#666;}
        *{box-sizing:border-box;margin:0;padding:0;}
        body{font-family:system-ui,sans-serif;background:var(--bg);color:#333;line-height:1.7;max-width:760px;margin:0 auto;padding:40px 24px 80px;}
        h1{font-size:clamp(1.6rem,4vw,2.2rem);color:#1a1a1a;margin-bottom:16px;}
        p{margin-bottom:16px;font-size:1rem;color:#444;}
        .cta{display:inline-block;background:var(--red);color:#fff;padding:14px 32px;border-radius:99px;font-weight:900;text-decoration:none;font-size:1rem;margin:20px 0;}
        footer{margin-top:60px;font-size:0.78rem;color:#999;}
    </style>
</head>
<body>
    <h1>🌹 ${occ.name} in ${cityName}${state ? ', ' + state : ''} — Same-Day Delivery</h1>
    <p>Send ${occ.name.toLowerCase()} in ${cityName} today with free same-day delivery and $0 service fees. Floristone's local florists in ${cityName} cut flowers fresh and deliver the same day — from $29.99, all-inclusive.</p>
    <p>4.8/5 stars from 18,742 verified customers. Free delivery. Live tracking on every order.</p>
    <a href="${affLink}" class="cta">🌹 Order ${occ.name} in ${cityName} Now</a>
    <p><a href="${BASE_URL}/" style="color:var(--red);">← Back to home</a></p>
    <footer>This page contains affiliate links. © ${year} ValentinesDayFlowers</footer>
</body>
</html>`;
    fs.writeFileSync(path.join(outDir, slug), html);
    generated++;
});

console.log(`Vulture Matrix complete: ${generated} city pages generated`);
console.log(`Affiliate ID: 21885 ✓`);
