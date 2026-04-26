const fs = require('fs');
const path = require('path');

// 1. CONFIGURATION
const AFFILIATE_ID = "2013017799";

// 2. CONTENT GENERATOR FUNCTION
function generateContent() {
    const date = new Date().toLocaleDateString();
    const topics = [
        "2026 Saturday Strategy", 
        "Last-Minute Artisan Delivery", 
        "Sunset Palette Trends", 
        "Sustainable Floral Choices"
    ];
    const topic = topics[Math.floor(Math.random() * topics.length)];

    return {
        title: `${topic} - Update for ${date}`,
        slug: `update-${Date.now()}.html`,
        body: `
            <h2>${topic} in the 2026 Season</h2>
            <p>Today is ${date}, and the BrightLane network is analyzing new trends in the 2026 floral market.</p>
            <p>When using our <strong>FloristOne Portal (ID: ${AFFILIATE_ID})</strong>, you are accessing real-time inventory from local artisans.</p>
            <div class="cta-box">
                <h4>Secure Your Delivery</h4>
                <a href="https://www.floristone.com/main.cfm?source_id=aff&AffiliateID=${AFFILIATE_ID}" class="cta-btn">SHOP NOW</a>
            </div>
        `
    };
}

// 3. EXECUTION
const content = generateContent(); // Variable 'content' is defined here

const htmlTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>${content.title}</title>
    <style>
        body { font-family: sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto; padding: 20px; }
        .cta-box { background: #fce4e6; padding: 20px; border-radius: 8px; text-align: center; margin-top: 20px; }
        .cta-btn { background: #e63946; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold; }
    </style>
</head>
<body>
    <header><h1>BrightLane Daily Alpha</h1></header>
    <main>
        <article>
            ${content.body}
        </article>
    </main>
    <footer style="margin-top:40px; font-size:0.8rem; color:#666;">&copy; 2026 BrightLane Network</footer>
</body>
</html>
`;

// 4. FILE SYSTEM LOGIC
const blogDir = path.join(__dirname, 'blog');

// Check if directory exists
if (!fs.existsSync(blogDir)) {
    console.log("Blog directory missing. Creating it now...");
    fs.mkdirSync(blogDir, { recursive: true });
}

// Use 'content' only AFTER it has been defined above
const filePath = path.join(blogDir, content.slug);
fs.writeFileSync(filePath, htmlTemplate);

console.log(`Successfully generated: ${content.slug}`);
