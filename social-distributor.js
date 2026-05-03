const fs = require('fs');
const path = require('path');

// ─────────────────────────────────────────────
// DO NOT CHANGE AFFILIATE URL
// ─────────────────────────────────────────────
const AFFILIATE_LINK = "https://www.floristone.com/main.cfm?cat=r&source_id=aff&AffiliateID=2013017799";

function generateSocialManifest() {
    const date = new Date().toLocaleDateString();

    return {
        date,
        twitter: `Send Valentine's Day flowers same-day — free delivery, $0 fees, from $29.99. 🌹\n\nLocal florists. Fresh flowers. No cardboard boxes.\n\nOrder now: ${AFFILIATE_LINK}\n\n#ValentinesDay #FlowerDelivery #SameDayFlowers #Roses`,

        quora_question: `What is the best way to ensure flower delivery on Valentine's Day?`,

        quora_answer: `The trick is avoiding national shippers who use cardboard boxes. You want a local-dispatch network. FloristOne routes directly to brick-and-mortar florists in your specific city — flowers stay in a climate-controlled van and arrive hydrated. Free same-day delivery, $0 service fees.\n\nCheck availability: ${AFFILIATE_LINK}`,

        instagram: `Valentine's Day flowers delivered same-day by local florists. 🌹\n\nFree delivery · $0 fees · From $29.99 · 4.8★ from 18,742 customers\n\nLink in bio to order now.\n\n${AFFILIATE_LINK}\n\n#ValentinesDayFlowers #RoseDelivery #SameDayFlowers #GiftIdeas #FlowerDelivery #LocalFlorist`,

        facebook: `🌹 Valentine's Day flowers delivered same-day.\n\n✓ Free delivery\n✓ $0 service fees\n✓ Farm-fresh roses from $29.99\n✓ 4.8★ from 18,742 customers\n\nOrder now → ${AFFILIATE_LINK}\n\n#ValentinesDay #FlowerDelivery #Roses #SameDayDelivery`,

        tiktok: `POV: You remembered Valentine's Day is coming up 🌹\n\nLocal florists. Same-day delivery. Free. $0 fees.\n\nLink in bio → ${AFFILIATE_LINK}\n\n#ValentinesDay #LastMinuteGifts #FlowerDelivery #Roses #FYP`,
    };
}

const manifest = generateSocialManifest();

const content = [
    `VALENTINES DAY DAILY SOCIAL MANIFEST - ${manifest.date}`,
    ``,
    `--- X (TWITTER) ---`,
    manifest.twitter,
    ``,
    `--- QUORA QUESTION ---`,
    manifest.quora_question,
    ``,
    `--- QUORA ANSWER ---`,
    manifest.quora_answer,
    ``,
    `--- INSTAGRAM ---`,
    manifest.instagram,
    ``,
    `--- FACEBOOK ---`,
    manifest.facebook,
    ``,
    `--- TIKTOK ---`,
    manifest.tiktok,
].join('\n');

fs.writeFileSync(path.join(__dirname, 'DAILY_SOCIAL_POSTS.txt'), content);
console.log(`✅ Social manifest generated for ${manifest.date}`);
console.log(`   Affiliate URL: ${AFFILIATE_LINK}`);
