const fs = require('fs');
const path = require('path');

const AFFILIATE_ID = "2013017799";
const cities = JSON.parse(fs.readFileSync('cities.json', 'utf8'));

// Ensure output directory exists
const outDir = path.join(__dirname, 'delivery');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);

cities.forEach(item => {
    const slug = `${item.city.toLowerCase().replace(/ /g, '-')}-${item.state.toLowerCase()}-delivery.html`;
    
    const pageContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Saturday Valentine's Flower Delivery in ${item.city}, ${item.state} | 2026 Guide</title>
    <meta name="description" content="Send fresh, hand-delivered flowers in ${item.city}. Local artisan delivery for Saturday, Feb 14, 2026. Use BrightLane ID ${AFFILIATE_ID}.">
    <link rel="stylesheet" href="../style.css">
</head>
<body>
    <header>
        <div class="container"><strong>BrightLane Valentines: ${item.city} Edition</strong></div>
    </header>

    <main class="container">
        <h1>Local Flower Delivery in ${item.city}, ${item.state}</h1>
        <p>Looking for a Saturday surprise in the ${item.city} metro area? Our local artisan network is ready for the 2026 season.</p>
        
        <div class="cta-box" style="background: #e63946; color: white; padding: 40px; text-align: center; border-radius: 15px;">
            <h2>Secure Your ${item.city} Delivery Slot</h2>
            <p>Hand-delivered by a local ${item.state} florist. No boxes. Just fresh blooms.</p>
            <a href="https://www.floristone.com/main.cfm?source_id=aff&AffiliateID=${AFFILIATE_ID}" class="cta-btn" style="background: white; color: #e63946; padding: 15px 30px; border-radius: 50px; text-decoration: none; font-weight: bold;">SHOP ${item.city.toUpperCase()} FLOWERS</a>
        </div>

        <section class="details">
            <h3>Why ${item.city} Trusts BrightLane</h3>
            <p>Unlike national shippers, our partnership with <strong>FloristOne (ID: ${AFFILIATE_ID})</strong> ensures that your arrangement is crafted by a professional in ${item.city} who understands the local delivery logistics of your neighborhood.</p>
        </section>
    </main>

    <footer style="text-align: center; padding: 40px;">
        <p>&copy; 2026 BrightLane Floral Network | ID ${AFFILIATE_ID}</p>
        <a href="../index.html">Back to National Hub</a>
    </footer>
</body>
</html>`;

    fs.writeFileSync(path.join(outDir, slug), pageContent);
});

console.log(`Successfully generated ${cities.length} city pages in /delivery/`);
