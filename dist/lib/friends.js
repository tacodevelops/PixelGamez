"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.followUser = followUser;
exports.unfollowUser = unfollowUser;
exports.getFriendsAndFollows = getFriendsAndFollows;
exports.getFriendshipStatus = getFriendshipStatus;
const prisma_1 = require("./prisma");
async function followUser(followerId, followingId) {
    if (followerId === followingId)
        return null;
    const existing = await prisma_1.prisma.follow.findFirst({
        where: { followerId, followingId }
    });
    if (existing)
        return existing;
    return await prisma_1.prisma.follow.create({
        data: { followerId, followingId }
    });
}
async function unfollowUser(followerId, followingId) {
    const follow = await prisma_1.prisma.follow.findFirst({
        where: { followerId, followingId }
    });
    if (follow) {
        await prisma_1.prisma.follow.delete({ where: { id: follow.id } });
        return true;
    }
    return false;
}
async function getFriendsAndFollows(userId) {
    const [followingRecords, followerRecords] = await Promise.all([
        prisma_1.prisma.follow.findMany({
            where: { followerId: userId },
            include: {
                following: { select: { id: true, displayName: true, avatarUrl: true } }
            }
        }),
        prisma_1.prisma.follow.findMany({
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
async function getFriendshipStatus(userId, targetId) {
    if (userId === targetId)
        return 'self';
    const [iFollowThem, theyFollowMe] = await Promise.all([
        prisma_1.prisma.follow.findFirst({
            where: { followerId: userId, followingId: targetId }
        }),
        prisma_1.prisma.follow.findFirst({
            where: { followerId: targetId, followingId: userId }
        })
    ]);
    if (iFollowThem && theyFollowMe)
        return 'friends';
    if (iFollowThem)
        return 'following';
    if (theyFollowMe)
        return 'follower';
    return 'none';
}
