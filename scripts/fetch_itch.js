const https = require('https');

https.get('https://valkamo.itch.io/pokerxslots', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const gameIdMatch = data.match(/data-game_id="?(\d+)"?/i) || data.match(/"game_id"\s*:\s*(\d+)/i) || data.match(/game_id:\s*(\d+)/i);
    const iframeMatch = data.match(/https:\/\/html-classic\.itch\.zone[^"'\s]+/i);
    console.log("Game ID Match:", gameIdMatch ? gameIdMatch[1] : "None");
    console.log("HTML Zone URL:", iframeMatch ? iframeMatch[0] : "None");
  });
});
