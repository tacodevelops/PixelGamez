const fs = require('fs');

const mappings = {
  'Kenney Solitaire': 'puzzle',
  'Smashing Bottles': 'action',
  'Minato': 'adventure',
  'My Rusty Submarine': 'adventure',
  'Get Yoked 2': 'sports',
  'Help No Brake': 'driving',
  'Silhouette Showdown': 'action',
  'Blade Bedlam': 'action',
  'Stickman Warrior': 'action',
  'Gu Fighters Open Playtest': 'action',
  'Screw It': 'puzzle',
  'Die In The Dungeon': 'strategy',
  'Roots': 'puzzle',
  'Big Donut': 'driving',
  'Formula Prototype': 'driving',
  'Endless Road Drifter Minibus Edition': 'driving',
  'Tech Giants': 'simulation',
  'Soul Roulette': 'action',
  'Pokeplunder': 'adventure',
  'Wildfire': 'action',
  'Chesses': 'strategy',
  'Ahoy': 'adventure',
  'Crown Siege': 'strategy',
  'Villager Kings': 'strategy',
  'The Mist': 'adventure',
  'Pokerxslots': 'simulation',
  'Burger Stack': 'simulation',
  'Chemistower': 'puzzle',
  'Dbts Decisions Behind The Screen': 'simulation'
};

let content = fs.readFileSync('lib/data.ts', 'utf8');

for (const [title, category] of Object.entries(mappings)) {
  const regex = new RegExp(`(title: '${title}'[\\s\\S]*?category: )'arcade'`, 'g');
  content = content.replace(regex, `$1'${category}'`);
}

fs.writeFileSync('lib/data.ts', content);
console.log('Categories updated!');
