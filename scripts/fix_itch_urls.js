const https = require('https');
const fs = require('fs');

async function fixUrls() {
  let content = fs.readFileSync('lib/data.ts', 'utf8');
  
  // Find all games where embedUrl is an itch.io domain but NOT an embed or html-classic URL
  const gamesRegex = /id: '([^']+)',[\s\S]*?embedUrl: '(https:\/\/[^.]+\.itch\.io\/[^']+)'/g;
  let matches = [];
  let m;
  while ((m = gamesRegex.exec(content)) !== null) {
    matches.push({ id: m[1], url: m[2], fullString: m[0] });
  }

  console.log(`Found ${matches.length} games to fix.`);

  for (const game of matches) {
    console.log(`Fetching ${game.url}...`);
    try {
      const html = await new Promise((resolve, reject) => {
        https.get(game.url, (res) => {
          if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
             https.get(res.headers.location, (res2) => {
                 let data = '';
                 res2.on('data', c => data += c);
                 res2.on('end', () => resolve(data));
                 res2.on('error', reject);
             }).on('error', reject);
          } else {
             let data = '';
             res.on('data', c => data += c);
             res.on('end', () => resolve(data));
             res.on('error', reject);
          }
        }).on('error', reject);
      });

      const iframeMatch = html.match(/https:\/\/html-classic\.itch\.zone[^"'\s&]+/i);
      if (iframeMatch) {
        const correctUrl = iframeMatch[0].replace(/&quot;?$/, '').replace(/\\"/g, '');
        console.log(`  -> Found URL: ${correctUrl}`);
        
        const originalEmbedString = `embedUrl: '${game.url}'`;
        const newEmbedString = `embedUrl: '${correctUrl}'`;
        
        content = content.replace(originalEmbedString, newEmbedString);
      } else {
        console.log(`  -> No HTML Zone URL found for ${game.id}`);
        // Maybe try to find data-game_id to build the official widget url
        const gameIdMatch = html.match(/data-game_id="?(\d+)"?/i) || html.match(/"game_id"\s*:\s*(\d+)/i) || html.match(/game_id:\s*(\d+)/i);
        if (gameIdMatch) {
            const embedUrl = `https://itch.io/embed-upload/${gameIdMatch[1]}`;
            console.log(`  -> Found game ID: ${gameIdMatch[1]}, using ${embedUrl}`);
            const originalEmbedString = `embedUrl: '${game.url}'`;
            const newEmbedString = `embedUrl: '${embedUrl}'`;
            content = content.replace(originalEmbedString, newEmbedString);
        }
      }
    } catch (e) {
      console.error(`  -> Failed:`, e.message);
    }
  }

  fs.writeFileSync('lib/data.ts', content);
  console.log("Updated lib/data.ts!");
}

fixUrls();
