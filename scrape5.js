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
    'https://cx10.itch.io/dice-is-the-way',
    'https://baffledengineer.itch.io/legion-breaker',
    'https://ome6a1717.itch.io/potion-master',
    'https://rob-demo.itch.io/farm-cook',
    'https://shawcat.itch.io/living-for-plants',
    'https://incinious.itch.io/dungeon-deck',
    'https://purplemosscollectors.itch.io/dndg',
    'https://purejamgames.itch.io/kraft-slash',
    'https://serpexnessie.itch.io/scale-the-depths',
    'https://ncase.itch.io/wbwwb',
    'https://graebor.itch.io/sort-the-court',
    'https://silenceman.itch.io/lumbot-legacy',
    'https://kodub.itch.io/polytrack',
    'https://richo.itch.io/retro-racing-dd',
    'https://haxor1337.itch.io/hardware-tycoon',
    'https://ottoojala.itch.io/soccer-physics',
    'https://tykenn.itch.io/trees-hate-you'
  ];
  for (const url of urls) {
    try {
      const html = await fetch(url);
      const match = html.match(/data-game_id="(\d+)"/i) || html.match(/name="itch:path" content="games\/(\d+)"/i) || html.match(/"id":(\d+)/i);
      
      if (match) {
        console.log(url + ' => https://itch.io/embed/' + match[1]);
      } else {
        console.log(url + ' => ID NOT FOUND');
      }
    } catch (e) {
      console.log(url + ' => ERROR');
    }
  }
}

run();
