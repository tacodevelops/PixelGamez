const fs = require('fs');
const path = require('path');

const dataFile = './lib/data.ts';
let content = fs.readFileSync(dataFile, 'utf8');

const gamesStart = content.indexOf('export const games: Game[] = [');
let openBrackets = 0;
let gamesEnd = -1;
for (let i = gamesStart + 'export const games: Game[] = '.length; i < content.length; i++) {
  if (content[i] === '[') openBrackets++;
  if (content[i] === ']') {
    openBrackets--;
    if (openBrackets === 0) {
      gamesEnd = i + 1;
      break;
    }
  }
}

let gamesArrayStr = content.substring(gamesStart + 'export const games: Game[] = '.length, gamesEnd);
let games = eval(gamesArrayStr);

// 1. Remove CrazyGames
const gamesToKeep = [];
let removedCount = 0;
for (const game of games) {
  if (game.embedUrl && game.embedUrl.includes('crazygames.com')) {
    // Delete image if it exists
    const imagePath = path.join(__dirname, 'public', game.thumbnail.replace(/^\//, '').replace(/\//g, path.sep));
    if (fs.existsSync(imagePath) && fs.statSync(imagePath).isFile()) {
      fs.unlinkSync(imagePath);
      console.log('Deleted image:', imagePath);
    }
    removedCount++;
  } else {
    gamesToKeep.push(game);
  }
}
console.log(`Removed ${removedCount} CrazyGames.`);

// 2. Add New Games
function parseIdFromUrl(url) {
  const match = url.match(/twoplayergames\.org\/game\/([^/]+)/);
  if (match) return match[1];
  return url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '').replace(/\./g, '-');
}

function createTitleFromId(id) {
  return id.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

const newGamesData = [
  // Puzzle + Adventure
  { url: 'https://www.twoplayergames.org/game/fire-and-water', cat: 'puzzle', tags: ['adventure', 'new'] },
  { url: 'https://www.twoplayergames.org/game/fireboy-and-watergirl-in-the-forest-temple', cat: 'puzzle', tags: ['adventure', 'new'] },
  { url: 'https://www.twoplayergames.org/game/fireboy-and-watergirl-2-in-the-light-temple', cat: 'puzzle', tags: ['adventure', 'new'] },
  { url: 'https://www.twoplayergames.org/game/fireboy-and-watergirl-3-in-the-ice-temple', cat: 'puzzle', tags: ['adventure', 'new'] },
  { url: 'https://www.twoplayergames.org/game/fireboy-and-watergirl-4-the-crystal-temple', cat: 'puzzle', tags: ['adventure', 'new'] },
  { url: 'https://www.twoplayergames.org/game/fireboy-and-watergirl-5-elements', cat: 'puzzle', tags: ['adventure', 'new'] },
  // Puzzle
  { url: 'https://www.twoplayergames.org/game/hangman-with-buddies', cat: 'puzzle', tags: ['new'] },
  { url: 'https://www.twoplayergames.org/game/arrow-slide-puzzle', cat: 'puzzle', tags: ['new'] },
  { url: 'https://www.twoplayergames.org/game/park-me', cat: 'puzzle', tags: ['new'] },
  { url: 'https://www.twoplayergames.org/game/unroll-ball-slide', cat: 'puzzle', tags: ['new'] },
  { url: 'https://www.twoplayergames.org/game/hexa-puzzle', cat: 'puzzle', tags: ['new'] },
  { url: 'https://www.twoplayergames.org/game/color-sand-puzzle', cat: 'puzzle', tags: ['new'] },
  { url: 'https://www.twoplayergames.org/game/bubble-shooter', cat: 'puzzle', tags: ['new'] },
  { url: 'https://www.twoplayergames.org/game/bubble-shooter-2', cat: 'puzzle', tags: ['new'] },
  // Shooter
  { url: 'https://www.twoplayergames.org/game/territory-war', cat: 'shooting', tags: ['new'] },
  { url: 'https://www.twoplayergames.org/game/territory-war-2', cat: 'shooting', tags: ['new'] },
  { url: 'https://www.twoplayergames.org/game/territory-war-3', cat: 'shooting', tags: ['new'] },
  { url: 'https://www.twoplayergames.org/game/gun-mayhem-redux', cat: 'shooting', tags: ['new'] },
  { url: 'https://www.twoplayergames.org/game/fortz', cat: 'shooting', tags: ['new'] },
  { url: 'https://www.twoplayergames.org/game/gangsters', cat: 'shooting', tags: ['new'] },
  // Clicker
  { url: 'https://www.twoplayergames.org/game/click-click-clicker', cat: 'clicker', tags: ['new'] },
  { url: 'https://www.twoplayergames.org/game/fun-clicker', cat: 'clicker', tags: ['new'] },
  { url: 'https://www.twoplayergames.org/game/scritchy-scratchy', cat: 'clicker', tags: ['new'] },
  // Action
  { url: 'https://www.twoplayergames.org/game/minibattles-2-6-players', cat: 'action', tags: ['new'] },
  { url: 'https://www.twoplayergames.org/game/mechastick-fighter', cat: 'action', tags: ['new'] },
  { url: 'https://www.twoplayergames.org/game/tank-stars', cat: 'action', tags: ['new'] },
  { url: 'https://www.twoplayergames.org/game/operation-desert-road', cat: 'action', tags: ['new'] },
  // Driving
  { url: 'https://www.twoplayergames.org/game/grand-extreme-racing', cat: 'driving', tags: ['new'] },
  { url: 'https://www.twoplayergames.org/game/ultimate-flying-car', cat: 'driving', tags: ['new'] },
  { url: 'https://www.twoplayergames.org/game/night-city-racing', cat: 'driving', tags: ['new'] },
  // .io
  { url: 'https://hexanaut.io/', cat: 'io', tags: ['new'] },
  { url: 'https://tileman.io/', cat: 'io', tags: ['new'] },
  { url: 'https://skribbl.io/', cat: 'io', tags: ['new'] },
  { url: 'https://www.copter.io/', cat: 'io', tags: ['new'] },
  { url: 'https://dashcraft.io/', cat: 'io', tags: ['driving', 'new'] },
  { url: 'https://lolbeans.io/', cat: 'io', tags: ['new'] },
  { url: 'https://pikto.fun/', cat: 'io', tags: ['new'] },
  { url: 'https://smashkarts.io/', cat: 'io', tags: ['new'] },
  { url: 'https://www.conq.io/', cat: 'io', tags: ['new'] },
  { url: 'https://2v2.io/', cat: 'io', tags: ['new'] }
];

const newGames = [];
for (const entry of newGamesData) {
  const id = parseIdFromUrl(entry.url);
  const title = createTitleFromId(id);
  const isTwoPlayer = entry.url.includes('twoplayergames.org');
  const embedUrl = isTwoPlayer ? `https://www.twoplayergames.org/embed/${id}` : entry.url;
  
  if (!gamesToKeep.find(g => g.id === id)) {
    newGames.push({
      id: id,
      title: title,
      description: `Play ${title} on PixelGamez.`,
      category: entry.cat,
      tags: entry.tags,
      thumbnail: `/images/games/${entry.cat}/${id}.png`,
      embedUrl: embedUrl,
      rating: 0,
      plays: 0
    });
  }
}

gamesToKeep.push(...newGames);

let newGamesStr = 'export const games: Game[] = [\n';
for (const g of gamesToKeep) {
  newGamesStr += `  { id: '${g.id}', title: '${g.title.replace(/'/g, "\\'")}', description: '${g.description.replace(/'/g, "\\'")}', category: '${g.category}', tags: [${g.tags.map(t => `'${t}'`).join(', ')}], thumbnail: '${g.thumbnail}', embedUrl: '${g.embedUrl}', rating: ${g.rating || 0}, plays: ${g.plays || 0} },\n`;
}
newGamesStr += ']';

content = content.substring(0, gamesStart) + newGamesStr + content.substring(gamesEnd);
fs.writeFileSync(dataFile, content);

console.log(`Added ${newGames.length} new games. Total games: ${gamesToKeep.length}`);
