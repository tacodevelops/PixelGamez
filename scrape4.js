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
    'https://dreamonstudios.itch.io/gladihoppers',
    'https://gavgrub.itch.io/sosand'
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
