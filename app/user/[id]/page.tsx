import { getSubmissionsByUser } from '../../../lib/submissions';
import UserProfile from '../../../components/UserProfile';
import { notFound } from 'next/navigation';
import { prisma } from '../../../lib/prisma';
import { games } from '../../../lib/data';

export default async function UserPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  // Look up by playerId (convert to Int) or UUID if we want backwards compatibility
  const playerId = parseInt(id);
  const dbUser = await prisma.user.findUnique({
    where: isNaN(playerId) ? { id } : { playerId },
    include: { favoriteGames: { select: { id: true } } }
  });

  if (!dbUser) {
    notFound();
  }

  const user = {
    ...dbUser,
    createdAt: dbUser.createdAt.toISOString(),
    favoriteGames: dbUser.favoriteGames.map(g => g.id)
  };
  delete (user as any).passwordHash;

  const allSubmissions = await getSubmissionsByUser(dbUser.id);
  const submissions = allSubmissions.filter(s => s.status === 'approved').map(s => ({
    ...s,
    thumbnail: s.thumbnail || '',
    submittedAt: s.submittedAt.toISOString()
  }));

  return (
    <div className="animate-fade-in">
      <UserProfile profileUser={user} submissions={submissions} />
    </div>
  );
}
