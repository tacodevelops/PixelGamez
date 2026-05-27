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
    'https://ncase.itch.io/wbwwb',
    'https://graebor.itch.io/sort-the-court',
    'https://haxor1337.itch.io/hardware-tycoon',
    'https://gavgrub.itch.io/sosand'
  ];
  for (const url of urls) {
    try {
      const html = await fetch(url);
      const zoneMatch = html.match(/(https:\/\/(?:html|html-classic)\.itch\.zone\/[^\s"'\\]+)/);
      if (zoneMatch) {
          console.log(url + ' => ' + zoneMatch[1]);
      } else {
          console.log(url + ' => NOT FOUND AT ALL');
      }
    } catch (e) {
      console.log(url + ' => ERROR');
    }
  }
}

run();
