const fs = require('fs');
const path = require('path');
const https = require('https');
const crypto = require('crypto');

// ─────────────────────────────────────────────
// CONFIG — DO NOT CHANGE AFFILIATE URL
// ─────────────────────────────────────────────
const AFF_URL      = "https://www.floristone.com/main.cfm?cat=r&source_id=aff&AffiliateID=2013017799";
const BASE_URL     = "https://brightlane.github.io/ValentinesDayFlowers";
const TODAY        = new Date().toISOString().slice(0, 10);
const YEAR         = new Date().getFullYear();
const seed         = parseInt(crypto.createHash('md5').update(TODAY).digest('hex').slice(0, 8), 16);
const INDEXNOW_KEY = "3dd8ef03a39841008c6f5fe0c38144d5";

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
const RELATED_HTML = RELATED_SITES.map(s => `<a href="${s.url}">${s.name}</a>`).join(' &nbsp;|&nbsp; ');

// ─────────────────────────────────────────────
// CITIES
// ─────────────────────────────────────────────
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
    "Spokane","Des Moines","Montgomery","Modesto","Fayetteville","Tacoma",
    "Shreveport","Fontana","Moreno Valley","Akron","Yonkers","Augusta",
    "Little Rock","Grand Rapids","Huntington Beach","Salt Lake City",
    "Tallahassee","Huntsville","Worcester","Knoxville","Providence",
    "Brownsville","Santa Clarita","Garden Grove","Oceanside","Fort Lauderdale",
    "Chattanooga","Tempe","Cape Coral","Eugene","Rancho Cucamonga","Peoria",
    "Ontario","Salem","Elk Grove","Corona","Springfield","Fort Collins",
    "Alexandria","Hayward","Lakewood","Clarksville","Lancaster","Salinas",
    "Palmdale","Sunnyvale","Pomona","Escondido","Surprise","Pasadena",
    "Torrance","Rockford","Paterson","Joliet","Savannah","Bridgeport","Syracuse",
    "McAllen","Hollywood","Macon","Mesquite","Dayton","Cary","Orange",
    "Fullerton","Hampton","Murfreesboro","Killeen","Warren","West Valley City",
    "Columbia","Sterling Heights","New Haven","Olathe","Miramar","Cedar Rapids",
    "Charleston","Thousand Oaks","Visalia","Elizabeth","Gainesville","Waco",
    "Roseville","Sioux Falls","Hartford","Coral Springs","Stamford","Topeka",
    "Bellevue","Denton","Victorville","Beaumont","Midland","Elgin","Lansing",
    "West Palm Beach","Clearwater","Manchester","Arvada","Costa Mesa","Pueblo",
    "Downey","Inglewood","Carlsbad","Pompano Beach","Berkeley","Westminster",
    "Cambridge","Provo","Miami Gardens","Palm Bay","Wichita","Murrieta",
    "Temecula","El Monte","West Covina","Burbank","Simi Valley","Vallejo",
    "Fairfield","Santa Rosa","Hesperia","Chino","Chino Hills","Menifee",
    // CANADA
    "Toronto","Montreal","Vancouver","Calgary","Edmonton","Ottawa",
    "Winnipeg","Quebec City","Hamilton","Kitchener","London ON","Victoria BC",
    "Halifax NS","Oshawa","Windsor ON","Saskatoon","Regina","St Catharines",
    "Kelowna","Barrie","Abbotsford","Sudbury","Kingston ON","Guelph",
    "Moncton","Brantford","Saint John NB","Thunder Bay","Nanaimo","Burnaby",
    "Surrey","Mississauga","Brampton","Markham","Vaughan","Richmond Hill",
    "Oakville","Burlington ON","Laval","Gatineau","Longueuil","Sherbrooke",
    "Levis","Chilliwack","Kamloops","Prince George","Red Deer","Lethbridge",
    "Medicine Hat","Fort McMurray","Grande Prairie","Airdrie","St Albert",
];

// ─────────────────────────────────────────────
// OCCASIONS
// ─────────────────────────────────────────────
const OCCASIONS = [
    { en: "Valentine's Day Flowers", fr: "Fleurs Saint-Valentin",     zh: "情人节鲜花",   es: "Flores de San Valentín",    ru: "Цветы на День святого Валентина", slug: "valentines-day" },
    { en: "Romantic Roses",          fr: "Roses romantiques",          zh: "浪漫玫瑰",     es: "Rosas románticas",          ru: "Романтические розы",              slug: "romance" },
    { en: "Anniversary Flowers",     fr: "Fleurs d'anniversaire",      zh: "周年纪念花",   es: "Flores de aniversario",     ru: "Цветы на годовщину",             slug: "anniversary" },
    { en: "Birthday Flowers",        fr: "Fleurs d'anniversaire",      zh: "生日鲜花",     es: "Flores de cumpleaños",      ru: "Цветы на день рождения",         slug: "birthday" },
    { en: "Sympathy Flowers",        fr: "Fleurs de sympathie",        zh: "慰问鲜花",     es: "Flores de condolencia",     ru: "Цветы соболезнования",           slug: "sympathy" },
    { en: "Get Well Flowers",        fr: "Fleurs de rétablissement",   zh: "祝愿康复花",   es: "Flores de recuperación",    ru: "Цветы пожелания здоровья",       slug: "get-well" },
    { en: "Thank You Flowers",       fr: "Fleurs de remerciement",     zh: "感谢鲜花",     es: "Flores de agradecimiento",  ru: "Цветы благодарности",            slug: "thank-you" },
    { en: "New Baby Flowers",        fr: "Fleurs nouveau-né",          zh: "新生儿鲜花",   es: "Flores bebé recién nacido", ru: "Цветы на рождение ребёнка",      slug: "new-baby" },
];

// ─────────────────────────────────────────────
// MULTILINGUAL CONTENT
// ─────────────────────────────────────────────
const LANGS = {
    en: {
        dir:    "bing",
        title:  (o, c) => `Send ${o.en} to ${c} — Free Same-Day Delivery`,
        h1:     (o, c) => `Send ${o.en} to ${c}`,
        meta:   (o, c) => `Send ${o.en.toLowerCase()} to ${c}. Free same-day delivery, $0 fees, from $29.99. 4.8 stars from 18,742 customers.`,
        intro:  (o, c) => `Looking to send ${o.en.toLowerCase()} to ${c} today? Floristone delivers farm-fresh flowers same-day across ${c} — free delivery, $0 service fees, freshness guaranteed.`,
        h2a:    (o, c) => `How to send ${o.en.toLowerCase()} to ${c}`,
        bodyA:  (o, c) => `Order in 2 minutes. Choose your arrangement, add a card message, enter the delivery address in ${c}, and checkout. Free delivery, $0 fees, live tracking included.`,
        h2b:    (o, c) => `Why Floristone is the best flower delivery in ${c}`,
        bodyB:  (o, c) => `4.8/5 stars from 18,742 verified customers. Free same-day delivery. $0 service fees. Local florists in ${c} — farm-fresh roses guaranteed.`,
        cta:    (o, c) => `Send ${o.en} to ${c} Now`,
        faqQ:   (o, c) => `Can I send ${o.en.toLowerCase()} to ${c} today?`,
        faqA:   (o, c) => `Yes. Floristone guarantees same-day delivery across ${c} with free delivery and $0 fees.`,
        note:   "From $29.99 · Free delivery · $0 fees · 4.8★",
        back:   "← Back to home",
        footer: `© ${YEAR} ValentinesDayFlowers · This page contains affiliate links.`,
    },
    fr: {
        dir:    "bing-fr",
        title:  (o, c) => `Envoyer des ${o.fr} à ${c} — Livraison gratuite le jour même`,
        h1:     (o, c) => `Envoyer des ${o.fr} à ${c}`,
        meta:   (o, c) => `Envoyez des ${o.fr.toLowerCase()} à ${c}. Livraison gratuite le jour même, 0$ de frais, dès 29,99$.`,
        intro:  (o, c) => `Vous souhaitez envoyer des ${o.fr.toLowerCase()} à ${c} aujourd'hui? Floristone livre le jour même dans tout ${c} — livraison gratuite, 0$ de frais.`,
        h2a:    (o, c) => `Comment envoyer des ${o.fr.toLowerCase()} à ${c}`,
        bodyA:  (o, c) => `Commandez en 2 minutes. Choisissez votre arrangement, ajoutez un message, entrez l'adresse à ${c} et validez. Livraison gratuite, 0$ de frais.`,
        h2b:    (o, c) => `Pourquoi Floristone est le meilleur moyen d'envoyer des fleurs à ${c}`,
        bodyB:  (o, c) => `4,8/5 étoiles de 18 742 clients vérifiés. Livraison gratuite le jour même. 0$ de frais. Fleuristes locaux à ${c}.`,
        cta:    (o, c) => `Envoyer des ${o.fr} à ${c}`,
        faqQ:   (o, c) => `Puis-je envoyer des ${o.fr.toLowerCase()} à ${c} aujourd'hui?`,
        faqA:   (o, c) => `Oui. Floristone garantit la livraison le jour même à ${c} avec livraison gratuite et 0$ de frais.`,
        note:   "Dès 29,99$ · Livraison gratuite · 0$ frais · 4,8★",
        back:   "← Retour à l'accueil",
        footer: `© ${YEAR} ValentinesDayFlowers · Ce site contient des liens affiliés.`,
    },
    zh: {
        dir:    "bing-zh",
        title:  (o, c) => `在线向${c}发送${o.zh} — 当日免费送达`,
        h1:     (o, c) => `在线向${c}发送${o.zh}`,
        meta:   (o, c) => `在线向${c}发送${o.zh}。当日免费送达，零服务费，低至$29.99。`,
        intro:  (o, c) => `想今天在线向${c}发送${o.zh}？Floristone当日送达${c}——免费配送，零服务费，新鲜花卉保证。`,
        h2a:    (o, c) => `如何在线向${c}发送${o.zh}`,
        bodyA:  (o, c) => `两分钟完成下单。选择花束，添加贺卡，输入${c}的配送地址并结账。免费配送，零服务费。`,
        h2b:    (o, c) => `为什么Floristone是向${c}在线送花的最佳选择`,
        bodyB:  (o, c) => `18,742位验证客户评分4.8/5。当日免费配送。零服务费。${c}的本地花店新鲜直送。`,
        cta:    (o, c) => `立即向${c}发送${o.zh}`,
        faqQ:   (o, c) => `今天能在线向${c}发送${o.zh}吗？`,
        faqA:   (o, c) => `是的。Floristone保证在${c}免费当日配送，服务费$0。`,
        note:   "低至$29.99 · 免费配送 · $0服务费 · 4.8★",
        back:   "← 返回首页",
        footer: `© ${YEAR} ValentinesDayFlowers · 本页面含有联盟链接。`,
    },
    es: {
        dir:    "bing-es",
        title:  (o, c) => `Enviar ${o.es} a ${c} — Entrega gratis el mismo día`,
        h1:     (o, c) => `Enviar ${o.es} a ${c}`,
        meta:   (o, c) => `Envía ${o.es.toLowerCase()} a ${c}. Entrega gratis el mismo día, $0 cargos, desde $29.99.`,
        intro:  (o, c) => `¿Quieres enviar ${o.es.toLowerCase()} a ${c} hoy? Floristone entrega el mismo día en todo ${c} — entrega gratis, $0 cargos.`,
        h2a:    (o, c) => `Cómo enviar ${o.es.toLowerCase()} a ${c}`,
        bodyA:  (o, c) => `Ordena en 2 minutos. Elige tu arreglo, agrega un mensaje, ingresa la dirección en ${c} y paga. Entrega gratis, $0 cargos.`,
        h2b:    (o, c) => `Por qué Floristone es la mejor forma de enviar flores a ${c}`,
        bodyB:  (o, c) => `4.8/5 estrellas de 18,742 clientes verificados. Entrega gratuita el mismo día. $0 cargos. Floristas locales en ${c}.`,
        cta:    (o, c) => `Enviar ${o.es} a ${c} ahora`,
        faqQ:   (o, c) => `¿Puedo enviar ${o.es.toLowerCase()} a ${c} hoy?`,
        faqA:   (o, c) => `Sí. Floristone garantiza entrega el mismo día en ${c} con entrega gratis y $0 de cargos.`,
        note:   "Desde $29.99 · Entrega gratis · $0 cargos · 4.8★",
        back:   "← Volver al inicio",
        footer: `© ${YEAR} ValentinesDayFlowers · Esta página contiene enlaces de afiliado.`,
    },
    ru: {
        dir:    "bing-ru",
        title:  (o, c) => `Отправить ${o.ru} в ${c} — Бесплатная доставка в день заказа`,
        h1:     (o, c) => `Отправить ${o.ru} в ${c}`,
        meta:   (o, c) => `Отправьте ${o.ru.toLowerCase()} в ${c}. Бесплатная доставка в день заказа, $0 сборов, от $29.99.`,
        intro:  (o, c) => `Хотите отправить ${o.ru.toLowerCase()} в ${c} сегодня? Floristone доставляет в день заказа по всему ${c} — бесплатная доставка, $0 сборов.`,
        h2a:    (o, c) => `Как отправить ${o.ru.toLowerCase()} в ${c}`,
        bodyA:  (o, c) => `Заказ занимает 2 минуты. Выберите букет, добавьте сообщение, введите адрес в ${c} и оформите заказ. Бесплатная доставка, $0 сборов.`,
        h2b:    (o, c) => `Почему Floristone — лучший способ отправить цветы в ${c}`,
        bodyB:  (o, c) => `4.8/5 от 18 742 подтверждённых клиентов. Бесплатная доставка в день заказа. $0 сборов. Местные флористы в ${c}.`,
        cta:    (o, c) => `Отправить ${o.ru} в ${c}`,
        faqQ:   (o, c) => `Можно ли отправить ${o.ru.toLowerCase()} в ${c} сегодня?`,
        faqA:   (o, c) => `Да. Floristone гарантирует доставку в день заказа по ${c} с бесплатной доставкой и $0 сборов.`,
        note:   "От $29.99 · Бесплатная доставка · $0 сборов · 4.8★",
        back:   "← На главную",
        footer: `© ${YEAR} ValentinesDayFlowers · Эта страница содержит партнёрские ссылки.`,
    },
};

// ─────────────────────────────────────────────
// HTML TEMPLATE
// ─────────────────────────────────────────────
function buildPage(langKey, lang, occasion, city, slug) {
    return `<!DOCTYPE html>
<html lang="${langKey}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${lang.title(occasion, city)} | ValentinesDayFlowers</title>
    <meta name="description" content="${lang.meta(occasion, city)}">
    <meta name="robots" content="index, follow">
    <link rel="canonical" href="${BASE_URL}/${lang.dir}/${slug}">
    <script type="application/ld+json">
    {"@context":"https://schema.org","@graph":[
      {"@type":"Article","headline":"${lang.h1(occasion, city)}","datePublished":"${TODAY}","dateModified":"${TODAY}","inLanguage":"${langKey}","author":{"@type":"Organization","name":"ValentinesDayFlowers"}},
      {"@type":"Product","name":"Floristone ${occasion.en} — ${city}","offers":{"@type":"Offer","priceCurrency":"USD","price":"29.99","availability":"https://schema.org/InStock","url":"${AFF_URL}","deliveryLeadTime":{"@type":"QuantitativeValue","value":"0","unitCode":"DAY"}},"aggregateRating":{"@type":"AggregateRating","ratingValue":"4.8","reviewCount":"18742"}},
      {"@type":"FAQPage","mainEntity":[{"@type":"Question","name":"${lang.faqQ(occasion, city)}","acceptedAnswer":{"@type":"Answer","text":"${lang.faqA(occasion, city)}"}}]}
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
        .trust-bar{display:flex;justify-content:center;gap:16px;flex-wrap:wrap;background:#fff;padding:12px;border:1px solid var(--border);border-radius:8px;margin-bottom:28px;font-size:0.8rem;font-weight:700;color:#444;}
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
<nav class="nav">ValentinesDayFlowers <a href="${BASE_URL}/">${lang.back}</a></nav>
<article class="article">
    <span class="eyebrow">${occasion[langKey]} · ${city} · ${TODAY}</span>
    <h1>${lang.h1(occasion, city)}</h1>
    <p class="byline">ValentinesDayFlowers · ${city} · ${TODAY}</p>
    <div class="trust-bar">
        <span>✓ Free Delivery</span><span>✓ $0 Fees</span><span>✓ 4.8★ 18,742 reviews</span><span>✓ Same Day</span>
    </div>
    <p>${lang.intro(occasion, city)}</p>
    <h2>${lang.h2a(occasion, city)}</h2>
    <p>${lang.bodyA(occasion, city)}</p>
    <h2>${lang.h2b(occasion, city)}</h2>
    <p>${lang.bodyB(occasion, city)}</p>
    <div class="cta-box">
        <h2>${lang.cta(occasion, city)}</h2>
        <p>${lang.note}</p>
        <a href="${AFF_URL}" class="cta-btn" target="_blank" rel="nofollow sponsored noopener">🌹 ${lang.cta(occasion, city)}</a>
        <div class="trust-row">
            <span>✓ FREE DELIVERY</span><span>✓ $0 FEES</span><span>✓ FARM FRESH</span>
        </div>
    </div>
    <div class="faq-box">
        <strong>Q: ${lang.faqQ(occasion, city)}</strong>
        <p>${lang.faqA(occasion, city)}</p>
    </div>
    <a href="${BASE_URL}/" class="back">${lang.back}</a>
</article>
<div class="related">
    <strong>More Flower Delivery Sites:</strong><br><br>
    ${RELATED_HTML}
</div>
<footer>${lang.footer}</footer>
</body>
</html>`;
}

// ─────────────────────────────────────────────
// GENERATE PAGES
// ─────────────────────────────────────────────
const PAGES_PER_LANG  = 400;
const CITIES_PER_LANG = Math.floor(PAGES_PER_LANG / OCCASIONS.length);
const batchStart      = seed % ALL_CITIES.length;
const cityBatch       = Array.from({ length: CITIES_PER_LANG }, (_, i) => ALL_CITIES[(batchStart + i) % ALL_CITIES.length]);

const allUrls = [];
let total = 0;

for (const [langKey, lang] of Object.entries(LANGS)) {
    const folder = lang.dir;
    if (!fs.existsSync(folder)) fs.mkdirSync(folder, { recursive: true });

    for (const city of cityBatch) {
        const citySlug = city.toLowerCase().replace(/ /g, '-').replace(/'/g, '');
        for (const occasion of OCCASIONS) {
            const slug = `send-${occasion.slug}-online-${citySlug}.html`;
            const html = buildPage(langKey, lang, occasion, city, slug);
            fs.writeFileSync(path.join(folder, slug), html);
            allUrls.push(`${BASE_URL}/${folder}/${slug}`);
            total++;
        }
    }
}

// ─────────────────────────────────────────────
// INDEXNOW PING
// ─────────────────────────────────────────────
const payload = JSON.stringify({
    host: "brightlane.github.io",
    key: INDEXNOW_KEY,
    keyLocation: `${BASE_URL}/${INDEXNOW_KEY}.txt`,
    urlList: allUrls.slice(0, 10000)
});

const req = https.request({
    hostname: 'api.indexnow.org',
    path: '/IndexNow',
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Content-Length': Buffer.byteLength(payload) }
}, res => {
    console.log(`IndexNow: HTTP ${res.statusCode} — ${allUrls.length} URLs submitted`);
});
req.on('error', e => console.log(`IndexNow note: ${e.message}`));
req.write(payload);
req.end();

console.log(`\n✅ VDay Bing Blast complete!`);
console.log(`   Affiliate URL: ${AFF_URL}`);
console.log(`   Languages    : ${Object.keys(LANGS).join(', ')}`);
console.log(`   Cities/lang  : ${cityBatch.length}`);
console.log(`   Occasions    : ${OCCASIONS.length}`);
console.log(`   Total pages  : ${total}`);
console.log(`   Today batch  : ${cityBatch.slice(0, 5).join(', ')}...`);
