const fs = require('fs');
const path = require('path');

const AFFILIATE_ID = "2013017799";

// 1. Check if cities.json exists
if (!fs.existsSync('cities.json')) {
    console.error("Error: cities.json not found!");
    process.exit(1);
}

const cities = JSON.parse(fs.readFileSync('cities.json', 'utf8'));

// 2. FORCE create delivery directory in the current workspace
const outDir = path.resolve(__dirname, 'delivery');
if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
}

cities.forEach(item => {
    const slug = `${item.city.toLowerCase().replace(/ /g, '-')}-${item.state.toLowerCase()}-delivery.html`;
    const filePath = path.join(outDir, slug);
    
    const pageContent = `<!DOCTYPE html>...[Your HTML Code Here]...`;

    fs.writeFileSync(filePath, pageContent);
    console.log(`Generated: ${slug}`);
});
