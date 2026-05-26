import { prisma } from './prisma';

export async function getVotes(gameId: string) {
  const likes = await prisma.vote.count({ where: { gameId, type: 'like' } });
  const dislikes = await prisma.vote.count({ where: { gameId, type: 'dislike' } });
  return { likes, dislikes };
}

export async function addVote(gameId: string, userId: string, type: 'like' | 'dislike') {
  const existing = await prisma.vote.findFirst({
    where: { gameId, userId }
  });
  if (existing) {
    if (existing.type !== type) {
      await prisma.vote.update({ where: { id: existing.id }, data: { type } });
    }
  } else {
    
    
    
    
    
    
    
    await prisma.game.upsert({
      where: { id: gameId },
      update: {},
      create: {
        id: gameId,
        title: gameId,
        description: '',
        category: 'unknown',
        thumbnail: '',
        embedUrl: ''
      }
    });

    await prisma.vote.create({ data: { gameId, userId, type } });
  }
  return getVotes(gameId);
}

export async function removeVote(gameId: string, userId: string) {
  const existing = await prisma.vote.findFirst({
    where: { gameId, userId }
  });
  if (existing) {
    await prisma.vote.delete({ where: { id: existing.id } });
  }
  return getVotes(gameId);
}
