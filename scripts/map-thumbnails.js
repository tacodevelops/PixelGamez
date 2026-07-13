const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '..', 'public', 'Thumbnails');
const dataFile = path.join(__dirname, '..', 'lib', 'data.ts');

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

const mapping = {
  "2v2.io.png": "2v2-io",
  "Bubble-Shooter.png": "bubble-shooter",
  "DashCraft.io.png": "dashcraft-io",
  "Fire&Water.png": "fire-and-water",
  "Fireboy&Watergirl5.png": "fireboy-and-watergirl-5-elements",
  "FireboyandWatergirl3.png": "fireboy-and-watergirl-3-in-the-ice-temple",
  "Fortz-Game.png": "fortz",
  "Gangsters.png": "gangsters",
  "Hexa_Puzzle.png": "hexa-puzzle",
  "Hexanaut_OG-logo.png": "hexanaut-io",
  "LOLBeans.io.png": "lolbeans-io",
  "MechaStick-fighter.png": "mechastick-fighter",
  "Operation_Desert_Road.png": "operation-desert-road",
  "Skribbl.io.png": "skribbl-io",
  "Smashkarts.png": "smashkarts-io",
  "Tileman.io.png": "tileman-io",
  "Unroll_Ball.png": "unroll-ball-slide",
  "arrow-slide-puzzle.png": "arrow-slide-puzzle",
  "bubble-shooter-2.png": "bubble-shooter-2",
  "click-click-clicker.png": "click-click-clicker",
  "color-sand-puzzle.png": "color-sand-puzzle",
  "conq.io.png": "conq-io",
  "copter.io.png": "copter-io",
  "fireboy&watergirl1.png": "fireboy-and-watergirl-in-the-forest-temple",
  "fireboy&watergirl2.png": "fireboy-and-watergirl-2-in-the-light-temple",
  "fireboy-watergirl-4.png": "fireboy-and-watergirl-4-the-crystal-temple",
  "fun-clicker.png": "fun-clicker",
  "grand-extreme-racing-new.png": "grand-extreme-racing",
  "gun-mayhem-redux.png": "gun-mayhem-redux",
  "hangman-with-buddies.png": "hangman-with-buddies",
  "minibattles.png": "minibattles-2-6-players",
  "night-city-racing.png": "night-city-racing",
  "park-me.png": "park-me",
  "pikto.fun.png": "pikto-fun",
  "scritchy-scratchy.png": "scritchy-scratchy",
  "tank-stars.png": "tank-stars",
  "terriotory-war-3.png": "territory-war-3",
  "territory-war-2.png": "territory-war-2",
  "territoryWar.png": "territory-war",
  "ultimate-fllying-car.png": "ultimate-flying-car"
};

for (const [filename, gameId] of Object.entries(mapping)) {
  const srcPath = path.join(srcDir, filename);
  if (!fs.existsSync(srcPath)) {
    console.log("Not found:", srcPath);
    continue;
  }

  const game = games.find(g => g.id === gameId);
  if (!game) {
    console.log("Game not found in data.ts:", gameId);
    continue;
  }

  const destDir = path.join(__dirname, '..', 'public', 'images', 'games', game.category);
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }

  const destPath = path.join(destDir, gameId + '.png');
  fs.copyFileSync(srcPath, destPath);
  console.log("Copied", filename, "to", destPath);
}

console.log("Finished moving thumbnails.");
