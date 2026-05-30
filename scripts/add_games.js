const fs = require('fs');

const urls = [
"https://kenney.itch.io/kenney-solitaire",
"https://blue-makes-games.itch.io/smashing-bottles",
"https://noshuio.itch.io/minato",
"https://soerbgames.itch.io/my-rusty-submarine",
"https://gregs-games.itch.io/get-yoked-2",
"https://edgarmendoza.itch.io/help-no-brake",
"https://weentermakesgames.itch.io/silhouette-showdown",
"https://dpolk.itch.io/blade-bedlam",
"https://zeropixel.itch.io/stickman-warrior",
"https://instantdevx.itch.io/gu-fighters-open-playtest",
"https://martinecko30.itch.io/screw-it",
"https://alarts.itch.io/die-in-the-dungeon",
"https://pierre-vandermaesen.itch.io/roots",
"https://skinner-space.itch.io/big-donut",
"https://corujatsu.itch.io/formula-prototype",
"https://oarcinae.itch.io/endless-road-drifter-minibus-edition",
"https://rebellium.itch.io/tech-giants",
"https://vfqd.itch.io/soul-roulette",
"https://khydra98.itch.io/pokeplunder",
"https://salvadorpalma.itch.io/wildfire",
"https://pippinbarr.itch.io/chesses",
"https://pidibit.itch.io/ahoy",
"https://jorbits.itch.io/crown-siege",
"https://xamer.itch.io/villager-kings",
"https://tunapamir.itch.io/the-mist",
"https://valkamo.itch.io/pokerxslots",
"https://sebzanardo.itch.io/burger-stack",
"https://wunoumenal.itch.io/chemistower",
"https://tashi501.itch.io/dbts-decisions-behind-the-screen"
];

const newGames = urls.map(url => {
  const parts = url.split('/');
  const id = parts[parts.length - 1];
  const domain = parts[2];
  const developer = domain.split('.')[0];
  
  const title = id.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  const developerName = developer.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  
  return `  {
    id: '${id}',
    title: '${title.replace(/'/g, "\\'")}',
    description: 'Play ${title.replace(/'/g, "\\'")} by ${developerName.replace(/'/g, "\\'")} on PixelGamez.',
    category: 'arcade',
    tags: ['new'],
    thumbnail: '/images/${id}.png',
    embedUrl: '${url}',
    originalUrl: '${url}',
    developerLink: 'https://${domain}',
    developerName: '${developerName.replace(/'/g, "\\'")}',
    rating: Number((Math.random() * 1.5 + 3.5).toFixed(1)),
    plays: Math.floor(Math.random() * 50000) + 1000
  }`;
});

const dataPath = './lib/data.ts';
let content = fs.readFileSync(dataPath, 'utf8');

const endOfGamesMarker = '];\r\n\r\n\r\ngames.forEach';
const endOfGamesMarkerAlt = '];\n\n\ngames.forEach';

let insertionPoint = content.indexOf(endOfGamesMarker);
if (insertionPoint === -1) {
    insertionPoint = content.indexOf(endOfGamesMarkerAlt);
}

if (insertionPoint !== -1) {
  const before = content.slice(0, insertionPoint);
  const after = content.slice(insertionPoint);
  
  let updatedBefore = before.trimRight();
  if (updatedBefore.endsWith('}')) {
    updatedBefore += ',';
  }
  
  const finalContent = updatedBefore + '\n' + newGames.join(',\n') + '\n' + after;
  fs.writeFileSync(dataPath, finalContent);
  console.log('Added ' + newGames.length + ' games.');
} else {
  console.error('Could not find insertion point');
  
  // Dump tail for debugging
  console.log(content.slice(-500));
}
