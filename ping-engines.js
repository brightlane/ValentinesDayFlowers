const axios = require('axios');

const SITEMAP_URL = "https://brightlane.github.io/ValentinesDayFlowers/sitemap.xml";

async function pingEngines() {
    console.log(`Attempting to ping search engines for sitemap: ${SITEMAP_URL}`);
    
    try {
        // Ping Bing (which also updates Yahoo)
        const bingUrl = `https://www.bing.com/ping?sitemap=${encodeURIComponent(SITEMAP_URL)}`;
        await axios.get(bingUrl);
        console.log("Successfully pinged Bing.");
    } catch (error) {
        console.error("Bing ping failed. This is usually okay if the sitemap is live.");
    }
}

pingEngines();
