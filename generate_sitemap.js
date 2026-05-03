const fs = require('fs');
const path = require('path');

// ─────────────────────────────────────────────
// CONFIG
// ─────────────────────────────────────────────
const BASE_URL = "https://brightlane.github.io/ValentinesDayFlowers";
const TODAY    = new Date().toISOString().split('T')[0];

// ─────────────────────────────────────────────
// COLLECT ALL HTML FILES
// ─────────────────────────────────────────────
function walkDir(dir, fileList = []) {
    if (!fs.existsSync(dir)) return fileList;
    fs.readdirSync(dir).forEach(file => {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            walkDir(fullPath, fileList);
        } else if (file.endsWith('.html')) {
            fileList.push(fullPath);
        }
    });
    return fileList;
}

const allFiles = walkDir('.');

// ─────────────────────────────────────────────
// BUILD SITEMAP ENTRIES
// ─────────────────────────────────────────────
const entries = allFiles.map(file => {
    // Convert local path to URL
    let urlPath = file
        .replace(/^\.[\\/]/, '')       // remove leading ./ or .\
        .replace(/\\/g, '/');          // normalize backslashes on Windows

    // Priority rules
    let priority = '0.7';
    let changefreq = 'weekly';

    if (urlPath === 'index.html') {
        urlPath = '';
        priority = '1.0';
        changefreq = 'daily';
    } else if (urlPath === 'blog.html') {
        priority = '0.8';
        changefreq = 'daily';
    } else if (urlPath.startsWith('blog/')) {
        priority = '0.7';
        changefreq = 'never';
    } else if (
        urlPath.startsWith('bing/') ||
        urlPath.startsWith('bing-fr/') ||
        urlPath.startsWith('bing-zh/') ||
        urlPath.startsWith('bing-es/') ||
        urlPath.startsWith('bing-ru/')
    ) {
        priority = '0.8';
        changefreq = 'weekly';
    } else if (urlPath.startsWith('delivery/')) {
        priority = '0.6';
        changefreq = 'monthly';
    }

    const loc = urlPath ? `${BASE_URL}/${urlPath}` : `${BASE_URL}/`;

    return `  <url><loc>${loc}</loc><lastmod>${TODAY}</lastmod><changefreq>${changefreq}</changefreq><priority>${priority}</priority></url>`;
});

// ─────────────────────────────────────────────
// WRITE SITEMAP
// ─────────────────────────────────────────────
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join('\n')}
</urlset>`;

fs.writeFileSync('sitemap.xml', sitemap);
console.log(`✅ Sitemap generated: ${entries.length} URLs`);
console.log(`   Date: ${TODAY}`);
