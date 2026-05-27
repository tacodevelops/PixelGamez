const https = require('https');

function fetch(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

async function run() {
  const urls = [
    'https://shawcat.itch.io/living-for-plants',
    'https://incinious.itch.io/dungeon-deck',
    'https://purplemosscollectors.itch.io/dndg',
    'https://purejamgames.itch.io/kraft-slash',
    'https://dreamonstudios.itch.io/gladihoppers',
    'https://serpexnessie.itch.io/scale-the-depths',
    'https://ncase.itch.io/wbwwb',
    'https://graebor.itch.io/sort-the-court',
    'https://silenceman.itch.io/lumbot-legacy',
    'https://kodub.itch.io/polytrack',
    'https://richo.itch.io/retro-racing-dd',
    'https://haxor1337.itch.io/hardware-tycoon',
    'https://ottoojala.itch.io/soccer-physics',
    'https://gavgrub.itch.io/sosand',
    'https://tykenn.itch.io/trees-hate-you'
  ];
  for (const url of urls) {
    try {
      const html = await fetch(url);
      const match = html.match(/data-iframe="([^"]+)"/i);
      
      if (match) {
        let iframeStr = match[1];
        iframeStr = iframeStr.replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
        const srcMatch = iframeStr.match(/src="([^"]+)"/);
        if (srcMatch) {
            console.log(url + ' => ' + srcMatch[1]);
        } else {
            console.log(url + ' => IFRAME SRC NOT FOUND');
        }
      } else {
        console.log(url + ' => DATA-IFRAME NOT FOUND');
      }
    } catch (e) {
      console.log(url + ' => ERROR');
    }
  }
}

run();
