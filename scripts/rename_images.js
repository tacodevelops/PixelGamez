const fs = require('fs');
const path = require('path');

const renames = [
  ['blade-&-bedlam.png', 'blade-bedlam.png'],
  ['chemist-tower.png', 'chemistower.png'],
  ['decisions behind the screen.png', 'dbts-decisions-behind-the-screen.png'],
  ['die-in-the-dungeon-classic.png', 'die-in-the-dungeon.png'],
  ['endless-road-drifter.png', 'endless-road-drifter-minibus-edition.png'],
  ['get-yoked.png', 'get-yoked-2.png'],
  ['gu-fighters.png', 'gu-fighters-open-playtest.png'],
  ['solitaire.png', 'kenney-solitaire.png'],
  ['no-brake.png', 'help-no-brake.png'],
  ['poke-plunder.png', 'pokeplunder.png'],
  ['poker-x-slots.png', 'pokerxslots.png']
];

renames.forEach(([oldName, newName]) => {
  const oldPath = path.join('public/images', oldName);
  const newPath = path.join('public/images', newName);
  if (fs.existsSync(oldPath)) {
    fs.renameSync(oldPath, newPath);
    console.log(`Renamed ${oldName} -> ${newName}`);
  } else {
    console.log(`File not found: ${oldName}`);
  }
});
