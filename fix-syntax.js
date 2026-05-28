const fs = require('fs');

let content = fs.readFileSync('lib/translations.ts', 'utf8');
// Wrap keys containing hyphens (or just all valid identifier keys) in quotes
content = content.replace(/^(\s*)([a-zA-Z0-9_-]+)(\s*:)/gm, '$1"$2"$3');

fs.writeFileSync('lib/translations.ts', content);
console.log('Fixed translations.ts syntax!');
