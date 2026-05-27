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
  const url = 'https://ncase.itch.io/wbwwb';
  const html = await fetch(url);
  console.log(html.substring(0, 1000));
  
  // Find anything that looks like html-classic.itch.zone
  const zoneMatch = html.match(/(https:\/\/(?:html|html-classic)\.itch\.zone\/[^\s"']+)/);
  if (zoneMatch) {
      console.log('ZONE MATCH: ' + zoneMatch[1]);
  } else {
      console.log('NO ZONE MATCH');
  }
}

run();
