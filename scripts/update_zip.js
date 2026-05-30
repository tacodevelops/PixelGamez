const fs = require('fs');
let content = fs.readFileSync('lib/data.ts', 'utf8');
content = content.replace(/id: 'gladihoppers',([\s\S]*?)plays: 50000 \}/g, "id: 'gladihoppers',$1plays: 50000, downloadUrl: '/images/games/Gladihoppers_Win64_v_3_0_1.zip' }");
content = content.replace(/id: 'sosand',([\s\S]*?)plays: 7000 \}/g, "id: 'sosand',$1plays: 7000, downloadUrl: '/images/games/sosandwin.zip' }");
fs.writeFileSync('lib/data.ts', content);
console.log('updated data.ts');
