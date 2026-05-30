const fs = require('fs');
const content = fs.readFileSync('lib/data.ts', 'utf8');
const match = content.match(/thumbnail: '\/images\/([^']+)'/g);
if (match) {
  const expected = match.map(s => s.split('/')[2].replace("'", ""));
  const actual = fs.readdirSync('public/images').filter(f => f.endsWith('.png'));
  const missing = expected.filter(e => !actual.includes(e));
  console.log('Missing thumbnails:', missing);
}
