import { getGameById, getRelatedGames } from '../../../lib/data';
import GamePlayer from '../../../components/GamePlayer';
import GameGrid from '../../../components/GameGrid';
import GameCard from '../../../components/GameCard';
import { notFound } from 'next/navigation';
import * as fs from 'fs';
import * as path from 'path';
import { Metadata } from 'next';
import { prisma } from '../../../lib/prisma';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const game = getGameById(id);
  if (!game) return { title: 'Game Not Found' };
  
  let seoDescription = game.description;
  try {
    const dbGame = await prisma.game.findUnique({ where: { id }, select: { description: true } });
    if (dbGame && dbGame.description) {
      seoDescription = dbGame.description;
    }
  } catch (e) {
    // Ignore error, fallback to static description
  }
  
  return {
    title: `${game.title} - Play Free on PixelGamez`,
    description: seoDescription,
  };
}

const manualMap: Record<string, string> = {
  'gartic-phone-io': 'GarticPhone.txt',
  'johny-trigger': 'JohnnyTrigger.txt',
  'johny-revenge': 'JohnnyRevenge.txt',
  'moto-x3m-3-pool-party': 'MotoX3M5.txt',
  'moto-x3m-two': 'MotoX3M2.txt',
  'moto-x3m-4-winter': 'MotoX3M4.txt',
  'moto-x3m-6-spooky-land': 'MotoX3M6.txt',
  'worldguessr': 'WorldGuesser.txt',
  'slope-2-players': 'Slope2Player.txt',
  'smash-karts-io': 'SmashKarts.txt',
  'smashkarts-io': 'SmashKarts.txt',
};

function parseMarkdown(md: string): string {
  // Convert headers (## Header)
  let html = md.replace(/^## (.*$)/gim, '<h2 class="game-description__section-title">$1</h2>');
  html = html.replace(/^### (.*$)/gim, '<h3 class="game-description__subsection-title">$1</h3>');
  html = html.replace(/^# (.*$)/gim, '<h2 class="game-description__title">$1</h2>');
  
  // Convert bold (**text**)
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  
  // Convert lists (bullet points)
  const lines = html.split('\n');
  let inList = false;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.startsWith('- ') || line.startsWith('* ')) {
      const content = line.substring(2);
      if (!inList) {
        lines[i] = '<ul class="game-description__list">\n<li>' + content + '</li>';
        inList = true;
      } else {
        lines[i] = '<li>' + content + '</li>';
      }
    } else {
      if (inList) {
        lines[i - 1] = lines[i - 1] + '\n</ul>';
        inList = false;
      }
      if (line && !line.startsWith('<h') && !line.startsWith('<ul') && !line.startsWith('<li')) {
        lines[i] = '<p class="game-description__paragraph">' + line + '</p>';
      }
    }
  }
  if (inList) {
    lines[lines.length - 1] = lines[lines.length - 1] + '\n</ul>';
  }
  
  return lines.join('\n');
}

async function loadDescription(gameId: string, gameTitle: string): Promise<string | null> {
  try {
    const publicDir = path.join(process.cwd(), 'public');
    let targetFilename = manualMap[gameId];

    if (!targetFilename) {
      // Try to find a direct match in public folder
      const files = await fs.promises.readdir(publicDir);
      const txtFiles = files.filter(f => f.endsWith('.txt'));

      const cleanString = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
      const cleanedId = cleanString(gameId);
      const cleanedTitle = cleanString(gameTitle);

      for (const file of txtFiles) {
        const cleanedFile = cleanString(path.basename(file, '.txt'));
        if (cleanedFile === cleanedId || cleanedFile === cleanedTitle) {
          targetFilename = file;
          break;
        }
      }
    }

    if (targetFilename) {
      const filePath = path.join(publicDir, targetFilename);
      const content = await fs.promises.readFile(filePath, 'utf8');
      return parseMarkdown(content);
    }
  } catch (err) {
    console.error(`Failed to load description for ${gameId}:`, err);
  }
  return null;
}

export default async function GamePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const game = getGameById(id);

  if (!game) {
    notFound();
  }

  const detailedDescriptionHtml = await loadDescription(game.id, game.title);
  const relatedGames = getRelatedGames(game.id, 12);

  return (
    <div className="game-page animate-fade-in">
      <div className="game-layout-container">
        <div className="game-main-content">
          <GamePlayer game={game} detailedDescriptionHtml={detailedDescriptionHtml || undefined} />
        </div>
        {relatedGames.length > 0 && (
          <aside className="game-side-content">
            <h3 className="side-title">Related Games</h3>
            <div className="side-grid">
              {relatedGames.slice(0, 6).map(g => (
                <GameCard key={g.id} game={g} />
              ))}
            </div>
          </aside>
        )}
      </div>

      {relatedGames.length > 6 && (
        <GameGrid title="More Games You Might Like" games={relatedGames.slice(6)} />
      )}
    </div>
  );
}
