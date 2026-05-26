import { prisma } from './prisma';

export async function getAllSubmissions() {
  return await prisma.submission.findMany();
}

export async function getApprovedSubmissions() {
  return await prisma.submission.findMany({ where: { status: 'approved' } });
}

export async function getPendingSubmissions() {
  return await prisma.submission.findMany({ where: { status: 'pending' } });
}

export async function getSubmissionsByUser(userId: string) {
  return await prisma.submission.findMany({ where: { userId } });
}

export async function getSubmissionById(id: string) {
  return await prisma.submission.findUnique({ where: { id } });
}

export async function addSubmission(data: {
  title: string;
  description: string;
  category: string;
  gameType: string;
  embedUrl: string;
  thumbnail?: string;
  userId: string;
  developerName: string;
  discordUrl?: string;
  steamUrl?: string;
}) {
  return await prisma.submission.create({
    data: {
      title: data.title,
      description: data.description,
      category: data.category,
      gameType: data.gameType,
      embedUrl: data.embedUrl,
      thumbnail: data.thumbnail || '',
      userId: data.userId,
      developerName: data.developerName,
      discordUrl: data.discordUrl || null,
      steamUrl: data.steamUrl || null,
      status: 'pending',
      plays: 0,
      rating: 0,
    }
  });
}

export async function approveSubmission(id: string, adminUserId: string) {
  try {
    return await prisma.submission.update({
      where: { id },
      data: { status: 'approved', reviewedBy: adminUserId, reviewedAt: new Date() }
    });
  } catch {
    return null;
  }
}

export async function rejectSubmission(id: string, adminUserId: string) {
  try {
    return await prisma.submission.update({
      where: { id },
      data: { status: 'rejected', reviewedBy: adminUserId, reviewedAt: new Date() }
    });
  } catch {
    return null;
  }
}
