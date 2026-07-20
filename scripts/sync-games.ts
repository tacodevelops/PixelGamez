import * as fs from 'fs';
import * as path from 'path';
import { games, Game } from '../lib/data';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const imagesDir = './public/images';
const allowedExts = ['.png', '.webp', '.jfif', '.avif', '.jpeg', '.jpg'];

function getTitleFromFilename(name: string): string {
  if (name.includes('-') || name.includes('_')) {
    return name
      .replace(/[-_]+/g, ' ')
      .split(' ')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
  }
  const spaced = name.replace(/([A-Z])/g, ' $1').trim();
  return spaced.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

function guessCategory(name: string): string {
  const n = name.toLowerCase();
  if (n.includes('clicker') || n.includes('idle') || n.includes('wealth')) return 'clicker';
  if (n.includes('race') || n.includes('kart') || n.includes('drive') || n.includes('road') || n.includes('car') || n.includes('drifter')) return 'driving';
  if (n.includes('soccer') || n.includes('tennis') || n.includes('volley') || n.includes('ball') || n.includes('pogo') || n.includes('run')) return 'sports';
  if (n.includes('shoot') || n.includes('gun') || n.includes('strike') || n.includes('sniper') || n.includes('war') || n.includes('hit') || n.includes('blade')) return 'shooting';
  if (n.includes('puzzle') || n.includes('sand') || n.includes('hexa') || n.includes('slide') || n.includes('draw') || n.includes('word') || n.includes('chess') || n.includes('solitaire') || n.includes('sudoku') || n.includes('dungeon') || n.includes('water')) return 'puzzle';
  if (n.includes('battle') || n.includes('fight') || n.includes('smash') || n.includes('action') || n.includes('slasher') || n.includes('dismount')) return 'action';
  if (n.includes('simulator') || n.includes('sandbox') || n.includes('tycoon') || n.includes('farm') || n.includes('craft') || n.includes('town') || n.includes('restaurant') || n.includes('hospital')) return 'simulation';
  if (n.includes('io')) return 'io';
  return 'arcade';
}

async function main() {
  const dbGames = await prisma.game.findMany({ select: { id: true, description: true } });
  const dbDescriptions: Record<string, string> = {};
  dbGames.forEach(g => {
    if (g.description) dbDescriptions[g.id] = g.description;
  });

  const files = fs.readdirSync(imagesDir);
  const imageFiles = files.filter(f => {
    const ext = path.extname(f).toLowerCase();
    return allowedExts.includes(ext) && f !== 'logo.png';
  });

  const updatedGames = [...games];
  const seenIds = new Set<string>(games.map(g => g.id));

  console.log(`Scanning ${imageFiles.length} images...`);

  for (const filename of imageFiles) {
    const ext = path.extname(filename);
    const basename = path.basename(filename, ext);
    
    let gameId = basename.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    if (gameId === 'mxffroadmaster') gameId = 'mx-offroad-mountain-bike';
    if (gameId === 'papasbakeria') gameId = 'papas-bakeria';
    if (gameId === 'papasburgeria') gameId = 'papas-burgeria';
    if (gameId === 'papascheeseria') gameId = 'papas-cheeseria';
    if (gameId === 'papascupcakeria') gameId = 'papas-cupcakeria';
    if (gameId === 'papasdonuteria') gameId = 'papas-donuteria';
    if (gameId === 'papasfreezeria') gameId = 'papas-freezeria';
    if (gameId === 'papashotdoggeria') gameId = 'papas-hot-doggeria';
    if (gameId === 'papaspancakeria') gameId = 'papas-pancakeria';
    if (gameId === 'papaspastaria') gameId = 'papas-pastaria';
    if (gameId === 'papaspizzeria') gameId = 'papas-pizzeria';
    if (gameId === 'papasscooperia') gameId = 'papas-scooperia';
    if (gameId === 'papassushiria') gameId = 'papas-sushiria';
    if (gameId === 'papaswingeria') gameId = 'papas-wingeria';
    if (gameId === 'dinogame') gameId = 'dino-game';
    if (gameId === 'helifight') gameId = 'helifight';
    if (gameId === 'pixelkart') gameId = 'pixel-kart';
    if (gameId === 'pixelbattles') gameId = 'pixel-battles';

    const existingIdx = updatedGames.findIndex(g => g.id === gameId);

    if (existingIdx !== -1) {
      updatedGames[existingIdx].thumbnail = `/images/${filename}`;
    } else {
      const title = getTitleFromFilename(basename);
      const cat = guessCategory(basename);
      const newGame: Game = {
        id: gameId,
        title,
        description: `Play ${title} on PixelGamez.`,
        category: cat,
        tags: ['new'],
        thumbnail: `/images/${filename}`,
        embedUrl: `https://www.twoplayergames.org/embed/${gameId}`,
        rating: 0,
        plays: 0,
        createdAt: new Date().toISOString()
      };
      updatedGames.push(newGame);
      seenIds.add(gameId);
      console.log(`Added new game: ${gameId} (${title})`);
    }
  }

  let gamesStr = 'export const games: Game[] = [\n';
  for (const g of updatedGames) {
    const tagsStr = g.tags.map(t => `'${t}'`).join(', ');
    const devName = g.developerName ? `, developerName: '${g.developerName.replace(/'/g, "\\'")}'` : '';
    const devLink = g.developerLink ? `, developerLink: '${g.developerLink.replace(/'/g, "\\'")}'` : '';
    const steam = g.steamUrl ? `, steamUrl: '${g.steamUrl}'` : '';
    const discord = g.discordUrl ? `, discordUrl: '${g.discordUrl}'` : '';
    const createdAt = g.createdAt ? `, createdAt: '${g.createdAt}'` : '';
    
    const finalDesc = dbDescriptions[g.id] || g.description;
    gamesStr += `  { id: '${g.id}', title: '${g.title.replace(/'/g, "\\'")}', description: '${finalDesc.replace(/'/g, "\\'")}', category: '${g.category}', tags: [${tagsStr}], thumbnail: '${g.thumbnail}', embedUrl: '${g.embedUrl}', rating: ${g.rating || 0}, plays: ${g.plays || 0}${devName}${devLink}${steam}${discord}${createdAt} },\n`;
  }
  gamesStr += '];';

  let content = fs.readFileSync('./lib/data.ts', 'utf8');
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

  content = content.substring(0, gamesStart) + gamesStr + content.substring(gamesEnd);
  fs.writeFileSync('./lib/data.ts', content);
  console.log(`Successfully synced! Total games: ${updatedGames.length}`);
  await prisma.$disconnect();
}

main().catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});
