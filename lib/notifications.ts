import { prisma } from './prisma';

export interface SiteNotification {
  id: string;
  title: string;
  message: string;
  createdAt: Date;
}

export async function getNotifications() {
  return await prisma.notification.findMany({
    orderBy: { createdAt: 'desc' }
  });
}

export async function addNotification(title: string, message: string) {
  return await prisma.notification.create({
    data: { title, message }
  });
}

export async function deleteNotification(id: string) {
  await prisma.notification.delete({ where: { id } }).catch(() => {});
}
