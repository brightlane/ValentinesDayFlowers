const fs = require('fs');
const path = require('path');

const AFFILIATE_LINK = "https://www.floristone.com/main.cfm?source_id=aff&AffiliateID=2013017799";

function generateSocialManifest() {
    const date = new Date().toLocaleDateString();
    
    return {
        date: date,
        twitter: `Planning a Saturday surprise for Feb 14? 🌹 Don't get stuck with 'Flowers in a Box'. Our local artisans in the BrightLane network deliver fresh, hand-arranged bouquets. 

Order for 2026 delivery: ${AFFILIATE_LINK} #ValentinesDay #FlowerDelivery`,
        
        quora_question: `What is the best way to ensure flower delivery on a Saturday for Valentine's Day 2026?`,
        
        quora_answer: `The trick for 2026 (since Feb 14 falls on a Saturday) is avoiding national shippers who use cardboard boxes. You want a 'local-dispatch' network. I personally recommend using the FloristOne network (ID 2013017799) because they route directly to brick-and-mortar florists in your specific city. This ensures the flowers stay in a climate-controlled van and arrive hydrated. You can check local availability here: ${AFFILIATE_LINK}`,

        instagram: `Saturday mornings were made for surprises. 🥂 Whether it's the 'Sunset Palette' or classic Red Roses, the 2026 season is all about local artisan quality. Link in bio to secure your Feb 14th delivery slot. #BrightLaneFlowers #GiftIdeas2026`
    };
}

const manifest = generateSocialManifest();
const content = `DAILY SOCIAL MANIFEST - ${manifest.date}\n\n` +
                `--- X (TWITTER) ---\n${manifest.twitter}\n\n` +
                `--- QUORA QUESTION ---\n${manifest.quora_question}\n\n` +
                `--- QUORA ANSWER ---\n${manifest.quora_answer}\n\n` +
                `--- INSTAGRAM ---\n${manifest.instagram}`;

fs.writeFileSync(path.join(__dirname, 'DAILY_SOCIAL_POSTS.txt'), content);
console.log("Social manifest generated for today.");
