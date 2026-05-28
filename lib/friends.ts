import { prisma } from './prisma';

export async function followUser(followerId: string, followingId: string) {
  if (followerId === followingId) return null;

  const existing = await prisma.follow.findFirst({
    where: { followerId, followingId }
  });

  if (existing) return existing;

  return await prisma.follow.create({
    data: { followerId, followingId }
  });
}

export async function unfollowUser(followerId: string, followingId: string) {
  const follow = await prisma.follow.findFirst({
    where: { followerId, followingId }
  });

  if (follow) {
    await prisma.follow.delete({ where: { id: follow.id } });
    return true;
  }
  return false;
}

export async function getFriendsAndFollows(userId: string) {
  const [followingRecords, followerRecords] = await Promise.all([
    prisma.follow.findMany({
      where: { followerId: userId },
      include: {
        following: { select: { id: true, displayName: true, avatarUrl: true } }
      }
    }),
    prisma.follow.findMany({
      where: { followingId: userId },
      include: {
        follower: { select: { id: true, displayName: true, avatarUrl: true } }
      }
    })
  ]);

  const following = followingRecords.map(f => f.following);
  const followers = followerRecords.map(f => f.follower);

  // Friends are those who are in both following and followers
  const followingIds = new Set(following.map(u => u.id));
  const friends = followers.filter(u => followingIds.has(u.id));

  // If they are friends, we might want to exclude them from the pure "followers/following" list in the UI,
  // but usually it's fine to just return all 3 lists and let the UI sort it out.
  return { friends, following, followers };
}

export async function getFriendshipStatus(userId: string, targetId: string) {
  if (userId === targetId) return 'self';
  
  const [iFollowThem, theyFollowMe] = await Promise.all([
    prisma.follow.findFirst({
      where: { followerId: userId, followingId: targetId }
    }),
    prisma.follow.findFirst({
      where: { followerId: targetId, followingId: userId }
    })
  ]);

  if (iFollowThem && theyFollowMe) return 'friends';
  if (iFollowThem) return 'following';
  if (theyFollowMe) return 'follower';
  return 'none';
}
