import { getSubmissionsByUser } from '../../../lib/submissions';
import UserProfile from '../../../components/UserProfile';
import { notFound } from 'next/navigation';
import { prisma } from '../../../lib/prisma';
import { games } from '../../../lib/data';

export default async function UserPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const dbUser = await prisma.user.findUnique({
    where: { id },
    include: { favoriteGames: { select: { id: true } } }
  });

  if (!dbUser) {
    notFound();
  }

  
  const user = {
    ...dbUser,
    favoriteGames: dbUser.favoriteGames.map(g => g.id)
  };
  delete (user as any).passwordHash;

  const allSubmissions = await getSubmissionsByUser(id);
  const submissions = allSubmissions.filter(s => s.status === 'approved');

  return (
    <div className="animate-fade-in">
      <UserProfile profileUser={user} submissions={submissions} />
    </div>
  );
}
