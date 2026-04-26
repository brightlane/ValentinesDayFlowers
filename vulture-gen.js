const fs = require('fs');
const path = require('path');

const AFFILIATE_ID = "2013017799";

// Ensure we are reading from the root
const citiesPath = path.resolve(__dirname, 'cities.json');
const outDir = path.resolve(__dirname, 'delivery');

if (!fs.existsSync(citiesPath)) {
    console.error("Error: cities.json is missing in the root!");
    process.exit(1);
}

const cities = JSON.parse(fs.readFileSync(citiesPath, 'utf8'));

if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
}

cities.forEach(item => {
    const slug = `${item.city.toLowerCase().replace(/ /g, '-')}-${item.state.toLowerCase()}-delivery.html`;
    const filePath = path.join(outDir, slug);
    
    // Minimal template for high-speed generation
    const html = `<!DOCTYPE html><html><head><title>${item.city} Flowers</title></head><body><h1>Flowers in ${item.city}</h1><a href="https://www.floristone.com/main.cfm?AffiliateID=${AFFILIATE_ID}">Shop Now</a></body></html>`;

    fs.writeFileSync(filePath, html);
});

console.log("Vulture Matrix Generation Complete.");
