const fs = require('fs');
const path = require('path');

const BASE_URL = "https://brightlane.github.io/ValentinesDayFlowers/";
const deliveryDir = path.join(__dirname, 'delivery');

// Get all generated city pages
const files = fs.readdirSync(deliveryDir).filter(file => file.endsWith('.html'));

let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${BASE_URL}</loc>
    <priority>1.0</priority>
  </url>`;

files.forEach(file => {
    sitemap += `
  <url>
    <loc>${BASE_URL}delivery/${file}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
});

sitemap += `\n</urlset>`;

fs.writeFileSync(path.join(__dirname, 'sitemap.xml'), sitemap);
console.log(`Sitemap updated with ${files.length} city pages.`);
