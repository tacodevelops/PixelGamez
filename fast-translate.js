const fs = require('fs');
const https = require('https');

const dataContent = fs.readFileSync('./lib/data.ts', 'utf8');
const gameBlocks = dataContent.matchAll(/\{\s*id:\s*['"]([^'"]+)['"],\s*title:\s*['"]([^'"]+)['"],\s*description:\s*['"]([^'"]+)['"]/g);

const keysToTranslate = {
    'about': "About", 'fullscreen': "Fullscreen", 'owner_panel': "Owner Panel", 'moderator_panel': "Moderator Panel",
    'action': "Action", 'adventure': "Adventure", 'arcade': "Arcade", 'board': "Board", 'card': "Card",
    'clicker': "Clicker", 'driving': "Driving", 'io': ".io", 'puzzle': "Puzzle", 'shooting': "Shooting",
    'simulation': "Simulation", 'sports': "Sports", 'strategy': "Strategy", 'featured': "Featured",
    'multiplayer': "Multiplayer", 'singleplayer': "Singleplayer", 'retro': "Retro", 'html5': "HTML5",
    'home': "Home", 'trending': "Trending", 'new': "New", 'popular': "Popular",
    'up_and_coming': "Up & Coming", 'most_visited': "Most Visited", 'recommended': "Recommended",
    'community': "Community", 'developer': "Developer", 'admin': "Admin",
    'profile': "My Profile", 'sign_in': "Sign In", 'search': "Search games...",
    'about_me': "About Me", 'working_on': "What I'm working on", 'favorite_games': "Favorite Games",
    'edit_profile': "Edit Profile", 'save': "Save", 'cancel': "Cancel", 'top_picks': "Top Picks for You"
};

for (const match of gameBlocks) {
    keysToTranslate[`game_${match[1]}_title`] = match[2];
    keysToTranslate[`game_${match[1]}_desc`] = match[3];
}

const keys = Object.keys(keysToTranslate);
const englishTexts = keys.map(k => keysToTranslate[k]);

async function translateChunk(texts, targetLang) {
    if (targetLang === 'zh') targetLang = 'zh-CN';
    const combined = texts.join(' ||| ');
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLang}&dt=t&q=${encodeURIComponent(combined)}`;
    
    return new Promise((resolve) => {
        const req = https.get(url, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const json = JSON.parse(data);
                    const result = json[0].map(x => x[0]).join('');
                    const splitResults = result.split(/\s*(?:\|\|\||\|\||\|)\s*/);
                    
                    if (splitResults.length === texts.length) {
                        resolve(splitResults);
                    } else {
                        // If delimiter parsing fails, fallback to English
                        resolve(texts);
                    }
                } catch(e) { resolve(texts); }
            });
        });
        req.on('error', () => resolve(texts));
        req.setTimeout(5000, () => { req.destroy(); resolve(texts); });
    });
}

const langs = ['uk', 'id', 'tl', 'ko', 'fi', 'sv', 'no', 'da', 'pl', 'ro', 'it', 'th', 'vi', 'tr', 'nl', 'el', 'ms', 'hu', 'cs'];

async function main() {
    let fileContent = fs.readFileSync('./lib/translations.ts', 'utf8');
    
    for (const lang of langs) {
        console.log(`Translating ${lang}...`);
        let translatedTexts = [];
        
        // Chunk by 20 to avoid URL length limits
        for (let i = 0; i < englishTexts.length; i += 20) {
            const chunk = englishTexts.slice(i, i + 20);
            const res = await translateChunk(chunk, lang);
            translatedTexts.push(...res);
            await new Promise(r => setTimeout(r, 500)); // sleep 500ms
        }
        
        // Match lengths just in case
        if (translatedTexts.length !== englishTexts.length) {
            console.log(`Length mismatch for ${lang}. Falling back to English.`);
            translatedTexts = [...englishTexts];
        }
        
        const newEntries = keys.map((k, i) => {
            const safeText = translatedTexts[i].replace(/"/g, '\\"');
            return `${k}: "${safeText}"`;
        });
        
        const regex = new RegExp(`\\b${lang}:\\s*\\{([^}]+)\\}`, 's');
        if (regex.test(fileContent)) {
            const newBlock = `${lang}: {\n    ${newEntries.join(',\n    ')}\n  }`;
            fileContent = fileContent.replace(regex, newBlock);
            fs.writeFileSync('./lib/translations.ts', fileContent);
            console.log(`Saved ${lang}!`);
        }
    }
    console.log("Done!");
}

main();
