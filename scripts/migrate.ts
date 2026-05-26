import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { games } from '../lib/data';

const prisma = new PrismaClient();

async function main() {
  console.log('Migrating Games...');
  for (const game of games) {
    const existing = await prisma.game.findUnique({ where: { id: game.id } });
    if (!existing) {
      await prisma.game.create({
        data: {
          id: game.id,
          title: game.title,
          description: game.description,
          category: game.category,
          tags: game.tags,
          thumbnail: game.thumbnail,
          embedUrl: game.embedUrl,
          rating: game.rating,
          plays: game.plays,
          developerName: (game as any).developerName,
          developerLink: (game as any).developerLink,
          steamUrl: game.steamUrl,
          discordUrl: game.discordUrl,
        }
      });
      console.log(`Created game: ${game.id}`);
    } else {
      console.log(`Game ${game.id} already exists, skipping.`);
    }
  }

  const usersPath = path.join(process.cwd(), 'data', 'users.json');
  if (fs.existsSync(usersPath)) {
    console.log('Migrating Users...');
    const users = JSON.parse(fs.readFileSync(usersPath, 'utf8'));
    for (const u of users) {
      const existing = await prisma.user.findUnique({ where: { email: u.email } });
      if (!existing) {
        await prisma.user.create({
          data: {
            id: u.id,
            email: u.email,
            displayName: u.displayName,
            passwordHash: u.passwordHash,
            role: u.role || 'user',
            avatarUrl: u.avatarUrl || '',
            bannerUrl: u.bannerUrl || '',
            aboutMe: u.aboutMe || '',
            workingOn: u.workingOn || '',
            country: u.country || '',
            createdAt: new Date(u.createdAt || Date.now())
          }
        });
        console.log(`Created user: ${u.email}`);
      } else {
        console.log(`User ${u.email} already exists, skipping.`);
      }
    }
  }

  const submissionsPath = path.join(process.cwd(), 'data', 'submissions.json');
  if (fs.existsSync(submissionsPath)) {
    console.log('Migrating Submissions...');
    const submissions = JSON.parse(fs.readFileSync(submissionsPath, 'utf8'));
    for (const s of submissions) {
      const existing = await prisma.submission.findUnique({ where: { id: s.id } });
      if (!existing) {
        await prisma.submission.create({
          data: {
            id: s.id,
            title: s.title,
            description: s.description,
            category: s.category,
            gameType: s.gameType,
            embedUrl: s.embedUrl,
            gameFileUrl: s.gameFileUrl,
            thumbnailFileUrl: s.thumbnailFileUrl,
            developerName: s.developerName,
            submitterEmail: s.submitterEmail,
            status: s.status || 'pending',
            submittedAt: new Date(s.submittedAt || Date.now())
          }
        });
        console.log(`Created submission: ${s.title}`);
      }
    }
  }

  const adsPath = path.join(process.cwd(), 'data', 'ads.json');
  if (fs.existsSync(adsPath)) {
    console.log('Migrating Ads...');
    const ads = JSON.parse(fs.readFileSync(adsPath, 'utf8'));
    for (const a of ads) {
      const existing = await prisma.ad.findUnique({ where: { id: a.id } });
      if (!existing) {
        await prisma.ad.create({
          data: {
            id: a.id,
            imageUrl: a.imageUrl,
            linkUrl: a.linkUrl,
            placement: a.placement,
            label: a.label,
            active: a.active,
            clicks: a.clicks || 0,
            impressions: a.impressions || 0,
            createdAt: new Date(a.createdAt || Date.now())
          }
        });
        console.log(`Created ad: ${a.label}`);
      }
    }
  }

  const noticesPath = path.join(process.cwd(), 'data', 'notifications.json');
  if (fs.existsSync(noticesPath)) {
    console.log('Migrating Notifications...');
    const notices = JSON.parse(fs.readFileSync(noticesPath, 'utf8'));
    for (const n of notices) {
      const existing = await prisma.notification.findUnique({ where: { id: n.id } });
      if (!existing) {
        await prisma.notification.create({
          data: {
            id: n.id,
            title: n.title,
            message: n.message,
            createdAt: new Date(n.createdAt || Date.now())
          }
        });
        console.log(`Created notification: ${n.title}`);
      }
    }
  }

  console.log('Migration complete!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
