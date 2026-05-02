const fs = require('fs');
const https = require('https');
const crypto = require('crypto');

const AFF_BASE = "https://www.floristone.com/main.cfm?source_id=aff&AffiliateID=21885";
const BASE_URL = "https://brightlane.github.io/ValentinesDayFlowers";
const today = new Date().toISOString().slice(0, 10);
const year = new Date().getFullYear();
const seed = parseInt(crypto.createHash('md5').update(today).digest('hex').slice(0, 8), 16);
const INDEXNOW_KEY = "3dd8ef03a39841008c6f5fe0c38144d5";

const ALL_CITIES = [
    "New York","Los Angeles","Chicago","Houston","Phoenix","Philadelphia",
    "San Antonio","San Diego","Dallas","San Jose","Austin","Jacksonville",
    "Fort Worth","Columbus","Charlotte","San Francisco","Indianapolis","Seattle",
    "Denver","Nashville","Oklahoma City","El Paso","Washington DC","Las Vegas",
    "Louisville","Memphis","Portland","Baltimore","Milwaukee","Albuquerque",
    "Tucson","Fresno","Sacramento","Mesa","Kansas City","Atlanta","Omaha",
    "Colorado Springs","Raleigh","Long Beach","Virginia Beach","Minneapolis",
    "Tampa","New Orleans","Arlington","Bakersfield","Honolulu","Anaheim",
    "Aurora","Santa Ana","Corpus Christi","Riverside","St Louis","Lexington",
    "Pittsburgh","Stockton","Anchorage","Cincinnati","St Paul","Greensboro",
    "Toledo","Newark","Plano","Henderson","Orlando","Lincoln","Jersey City",
    "Chandler","Fort Wayne","St Petersburg","Laredo","Norfolk","Madison",
    "Durham","Lubbock","Winston Salem","Garland","Glendale","Hialeah","Reno",
    "Baton Rouge","Irvine","Chesapeake","Irving","Scottsdale","Fremont",
    "Gilbert","San Bernardino","Boise","Birmingham","Rochester","Richmond",
    "Spokane","Des Moines","Modesto","Fayetteville","Tacoma","Shreveport",
    "Akron","Augusta","Little Rock","Grand Rapids","Huntington Beach",
    "Salt Lake City","Tallahassee","Huntsville","Worcester","Knoxville",
    "Providence","Brownsville","Santa Clarita","Garden Grove","Fort Lauderdale",
    "Chattanooga","Tempe","Cape Coral","Eugene","Rancho Cucamonga","Peoria",
    "Ontario","Salem","Elk Grove","Corona","Springfield","Fort Collins",
    "Toronto","Montreal","Vancouver","Calgary","Edmonton","Ottawa",
    "Winnipeg","Quebec City","Hamilton","Kitchener","London ON","Victoria BC",
    "Halifax NS","Oshawa","Windsor ON","Saskatoon","Regina","St Catharines",
    "Kelowna","Barrie","Abbotsford","Sudbury","Kingston ON","Guelph",
    "Moncton","Brantford","Saint John NB","Thunder Bay","Nanaimo","Burnaby",
    "Surrey","Mississauga","Brampton","Markham","Vaughan","Richmond Hill",
    "Oakville","Burlington ON","Laval","Gatineau","Longueuil","Sherbrooke",
    "Levis","Chilliwack","Kamloops","Prince George","Red Deer","Lethbridge",
    "Medicine Hat","Fort McMurray","Grande Prairie","Airdrie","Spruce Grove",
];

const OCCASIONS = [
    { en: "Valentine's Day Flowers", fr: "Fleurs Saint-Valentin",   zh: "情人节鲜花",   es: "Flores San Valentín",   ru: "Цветы на День святого Валентина", slug: "valentines-day", tag: "ro" },
    { en: "Romantic Roses",          fr: "Roses romantiques",        zh: "浪漫玫瑰",     es: "Rosas románticas",      ru: "Романтические розы",              slug: "romance",        tag: "ro" },
    { en: "Anniversary Flowers",     fr: "Fleurs d'anniversaire",    zh: "周年纪念花",   es: "Flores de aniversario", ru: "Цветы на годовщину",              slug: "anniversary",    tag: "an" },
    { en: "Mother's Day Flowers",    fr: "Fleurs fête des mères",    zh: "母亲节鲜花",   es: "Flores Día de la Madre",ru: "Цветы на День матери",            slug: "mothers-day",    tag: "md" },
    { en: "Birthday Flowers",        fr: "Fleurs anniversaire",      zh: "生日鲜花",     es: "Flores cumpleaños",     ru: "Цветы на день рождения",          slug: "birthday",       tag: "bd" },
    { en: "Sympathy Flowers",        fr: "Fleurs de sympathie",      zh: "慰问鲜花",     es: "Flores condolencia",    ru: "Цветы соболезнования",            slug: "sympathy",       tag: "sy" },
    { en: "Get Well Flowers",        fr: "Fleurs rétablissement",    zh: "祝愿康复花",   es: "Flores recuperación",   ru: "Цветы пожелания здоровья",        slug: "get-well",       tag: "gw" },
    { en: "Thank You Flowers",       fr: "Fleurs remerciement",      zh: "感谢鲜花",     es: "Flores agradecimiento", ru: "Цветы благодарности",             slug: "thank-you",      tag: "ty" },
];

const LANGS = {
    en: { dir: "bing",     titleFn: (o,c) => `Send ${o.en} to ${c} — Free Same-Day Delivery`,              metaFn: (o,c) => `Send ${o.en.toLowerCase()} to ${c}. Free same-day delivery, $0 fees, from $29.99.`,    introFn: (o,c) => `Need ${o.en.toLowerCase()} delivered to ${c} today? Floristone delivers same-day with free delivery and $0 service fees.`, ctaFn: (o,c) => `Order ${o.en} in ${c} Now`, footer: `© ${year} ValentinesDayFlowers` },
    fr: { dir: "bing-fr",  titleFn: (o,c) => `Envoyer des ${o.fr} à ${c} — Livraison gratuite`,             metaFn: (o,c) => `Envoyez des ${o.fr.toLowerCase()} à ${c}. Livraison gratuite le jour même, 0$ de frais.`, introFn: (o,c) => `Besoin de ${o.fr.toLowerCase()} à ${c} aujourd'hui? Floristone livre le jour même avec livraison gratuite et 0$ de frais.`, ctaFn: (o,c) => `Commander des ${o.fr} à ${c}`, footer: `© ${year} ValentinesDayFlowers` },
    zh: { dir: "bing-zh",  titleFn: (o,c) => `向${c}发送${o.zh} — 当日免费送达`,                              metaFn: (o,c) => `向${c}发送${o.zh}。当日免费送达，零服务费，低至$29.99。`,                                    introFn: (o,c) => `需要今天在${c}送${o.zh}？Floristone当日免费送达${c}，服务费$0。`,                      ctaFn: (o,c) => `立即向${c}订购${o.zh}`, footer: `© ${year} ValentinesDayFlowers` },
    es: { dir: "bing-es",  titleFn: (o,c) => `Enviar ${o.es} a ${c} — Entrega gratis el mismo día`,          metaFn: (o,c) => `Envía ${o.es.toLowerCase()} a ${c}. Entrega gratis el mismo día, $0 cargos.`,             introFn: (o,c) => `¿Necesitas ${o.es.toLowerCase()} en ${c} hoy? Floristone entrega el mismo día gratis, $0 cargos.`, ctaFn: (o,c) => `Pedir ${o.es} en ${c}`, footer: `© ${year} ValentinesDayFlowers` },
    ru: { dir: "bing-ru",  titleFn: (o,c) => `Отправить ${o.ru} в ${c} — Бесплатная доставка`,               metaFn: (o,c) => `Отправьте ${o.ru.toLowerCase()} в ${c}. Бесплатная доставка в день заказа, $0 сборов.`,   introFn: (o,c) => `Хотите ${o.ru.toLowerCase()} в ${c} сегодня? Floristone доставляет в день заказа бесплатно, $0 сборов.`, ctaFn: (o,c) => `Заказать ${o.ru} в ${c}`, footer: `© ${year} ValentinesDayFlowers` },
};

const PAGES_PER_LANG = 400;
const CITIES_PER_LANG = Math.floor(PAGES_PER_LANG / OCCASIONS.length);
const batchStart = seed % ALL_CITIES.length;
const cityBatch = Array.from({length: CITIES_PER_LANG}, (_, i) => ALL_CITIES[(batchStart + i) % ALL_CITIES.length]);

const allUrls = [];
let total = 0;

Object.entries(LANGS).forEach(([langKey, lang]) => {
    if (!fs.existsSync(lang.dir)) fs.mkdirSync(lang.dir, { recursive: true });
    cityBatch.forEach(city => {
        const citySlug = city.toLowerCase().replace(/ /g, '-').replace(/'/g, '');
        OCCASIONS.forEach(occ => {
            const slug = `${occ.slug}-${citySlug}.html`;
            const affLink = `${AFF_BASE}&occ=${occ.tag}`;
            const html = `<!DOCTYPE html>
<html lang="${langKey}">
<head>
    <meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${lang.titleFn(occ,city)} | ValentinesDayFlowers</title>
    <meta name="description" content="${lang.metaFn(occ,city)}">
    <meta name="robots" content="index, follow">
    <link rel="canonical" href="${BASE_URL}/${lang.dir}/${slug}">
    <style>:root{--red:#e63946;--red-dk:#a4133c;--bg:#fff9fa;--border:#f8d7da;--mid:#666;}*{box-sizing:border-box;margin:0;padding:0;}body{font-family:system-ui,sans-serif;background:var(--bg);color:#333;line-height:1.7;max-width:760px;margin:0 auto;padding:40px 24px 80px;}h1{font-size:clamp(1.6rem,4vw,2.2rem);color:#1a1a1a;margin-bottom:16px;}p{margin-bottom:16px;font-size:1rem;color:#444;}.cta{display:inline-block;background:var(--red);color:#fff;padding:14px 32px;border-radius:99px;font-weight:900;text-decoration:none;font-size:1rem;margin:20px 0;}.trust{display:flex;gap:12px;flex-wrap:wrap;font-size:0.78rem;font-weight:700;color:#555;margin:12px 0;}footer{margin-top:60px;font-size:0.78rem;color:#999;}</style>
</head>
<body>
    <h1>🌹 ${lang.titleFn(occ,city)}</h1>
    <div class="trust"><span>✓ Free Delivery</span><span>✓ $0 Fees</span><span>✓ 4.8★ 18,742 reviews</span><span>✓ Same Day</span></div>
    <p>${lang.introFn(occ,city)}</p>
    <a href="${affLink}" class="cta">🌹 ${lang.ctaFn(occ,city)} →</a>
    <p><a href="${BASE_URL}/" style="color:var(--red);">← Back to home</a></p>
    <footer>${lang.footer}</footer>
</body>
</html>`;
            fs.writeFileSync(`${lang.dir}/${slug}`, html);
            allUrls.push(`${BASE_URL}/${lang.dir}/${slug}`);
            total++;
        });
    });
});

// Update sitemap
if (fs.existsSync('sitemap.xml')) {
    let sm = fs.readFileSync('sitemap.xml', 'utf8');
    sm = sm.replace(/<url><loc>[^<]*\/bing[^<]*<\/loc>.*?<\/url>\n/gs, '');
    const entries = allUrls.map(u => `  <url><loc>${u}</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>0.8</priority></url>`).join('\n');
    sm = sm.replace('</urlset>', `${entries}\n</urlset>`);
    fs.writeFileSync('sitemap.xml', sm);
}

// IndexNow ping
const payload = JSON.stringify({ host: "brightlane.github.io", key: INDEXNOW_KEY, keyLocation: `${BASE_URL}/${INDEXNOW_KEY}.txt`, urlList: allUrls.slice(0, 10000) });
const req = https.request({ hostname: "api.indexnow.org", path: "/IndexNow", method: "POST", headers: { "Content-Type": "application/json; charset=utf-8", "Content-Length": Buffer.byteLength(payload) }}, res => {
    console.log(`IndexNow: HTTP ${res.statusCode} — ${allUrls.length} URLs submitted`);
});
req.on('error', e => console.log(`IndexNow note (will succeed from GitHub Actions): ${e.message}`));
req.write(payload); req.end();

console.log(`\n✅ ValentinesDayFlowers Bing Blast complete!`);
console.log(`   Languages: ${Object.keys(LANGS).join(', ')}`);
console.log(`   Cities/lang: ${cityBatch.length}`);
console.log(`   Total pages: ${total}`);
