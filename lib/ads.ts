import { prisma } from './prisma';

export type AdPlacement = 'sidebar' | 'banner-home' | 'game-below' | 'game-side' | 'profile';

export async function getAllAds() {
  return await prisma.ad.findMany({ orderBy: { createdAt: 'desc' } });
}

export async function getAdsByPlacement(placement: string) {
  return await prisma.ad.findMany({ where: { placement, active: true } });
}

export async function getAdById(id: string) {
  return await prisma.ad.findUnique({ where: { id } });
}

export async function addAd(data: { imageUrl: string; linkUrl: string; placement: AdPlacement; label: string }) {
  return await prisma.ad.create({
    data: {
      imageUrl: data.imageUrl,
      linkUrl: data.linkUrl,
      placement: data.placement,
      label: data.label || 'Advertisement',
      active: true,
      clicks: 0,
      impressions: 0
    }
  });
}

export async function toggleAd(id: string) {
  const ad = await prisma.ad.findUnique({ where: { id } });
  if (!ad) return null;
  return await prisma.ad.update({
    where: { id },
    data: { active: !ad.active }
  });
}

export async function deleteAd(id: string) {
  try {
    await prisma.ad.delete({ where: { id } });
    return true;
  } catch {
    return false;
  }
}

export async function recordImpression(id: string) {
  await prisma.ad.update({
    where: { id },
    data: { impressions: { increment: 1 } }
  }).catch(() => {});
}

export async function recordClick(id: string) {
  await prisma.ad.update({
    where: { id },
    data: { clicks: { increment: 1 } }
  }).catch(() => {});
}
