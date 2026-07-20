"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Filter = require('bad-words');
const profanityFilter = new Filter();
const next_1 = __importDefault(require("next"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const multer_1 = __importDefault(require("multer"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const votes_1 = require("./lib/votes");
const submissions_1 = require("./lib/submissions");
const users_1 = require("./lib/users");
const ads_1 = require("./lib/ads");
const sessions_1 = require("./lib/sessions");
const notifications_1 = require("./lib/notifications");
const friends_1 = require("./lib/friends");
const prisma_1 = require("./lib/prisma");
const email_1 = require("./lib/email");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const dev = process.env.NODE_ENV !== 'production';
const app = (0, next_1.default)({ dev });
const handle = app.getRequestHandler();
const port = process.env.PORT || 3000;
const communityGamesDir = path_1.default.join(process.cwd(), 'public', 'community-games');
if (!fs_1.default.existsSync(communityGamesDir)) {
    fs_1.default.mkdirSync(communityGamesDir, { recursive: true });
}
const uploadsDir = path_1.default.join(process.cwd(), 'data', 'uploads');
if (!fs_1.default.existsSync(uploadsDir))
    fs_1.default.mkdirSync(uploadsDir, { recursive: true });
const upload = (0, multer_1.default)({
    dest: uploadsDir,
    limits: { fileSize: 50 * 1024 * 1024 },
    fileFilter: (_req, file, cb) => {
        const allowed = ['.zip', '.html', '.htm'];
        const ext = path_1.default.extname(file.originalname).toLowerCase();
        cb(null, allowed.includes(ext));
    },
});
const avatarsDir = path_1.default.join(process.cwd(), 'public', 'avatars');
if (!fs_1.default.existsSync(avatarsDir))
    fs_1.default.mkdirSync(avatarsDir, { recursive: true });
const avatarUpload = (0, multer_1.default)({
    dest: path_1.default.join(process.cwd(), 'data', 'uploads'),
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (_req, file, cb) => {
        const allowed = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
        const ext = path_1.default.extname(file.originalname).toLowerCase();
        cb(null, allowed.includes(ext));
    },
});
const bannersDir = path_1.default.join(process.cwd(), 'public', 'banners');
if (!fs_1.default.existsSync(bannersDir))
    fs_1.default.mkdirSync(bannersDir, { recursive: true });
const bannerUpload = (0, multer_1.default)({
    dest: path_1.default.join(process.cwd(), 'data', 'uploads'),
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (_req, file, cb) => {
        const allowed = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
        const ext = path_1.default.extname(file.originalname).toLowerCase();
        cb(null, allowed.includes(ext));
    },
});
async function getAuthUser(req) {
    var _a;
    const token = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a[sessions_1.SESSION_COOKIE_NAME];
    if (!token)
        return null;
    const session = await prisma_1.prisma.session.findUnique({ where: { token } });
    if (!session || session.expiresAt < new Date())
        return null;
    const user = await prisma_1.prisma.user.findUnique({
        where: { id: session.userId },
        include: { favoriteGames: { select: { id: true } } }
    });
    if (!user)
        return null;
    const { passwordHash: _ } = user, rest = __rest(user, ["passwordHash"]);
    const publicUser = Object.assign(Object.assign({}, rest), { role: user.role, favoriteGames: user.favoriteGames.map(g => g.id), createdAt: user.createdAt.toISOString() });
    return publicUser;
}
app.prepare().then(() => {
    const server = (0, express_1.default)();
    server.use(express_1.default.json());
    server.use((0, cookie_parser_1.default)());
    server.get('/api/health', (_req, res) => {
        res.json({ status: 'ok' });
    });
    server.post('/api/auth/register-otp', async (req, res) => {
        try {
            const { email } = req.body;
            if (!email) {
                res.status(400).json({ error: 'Email is required.' });
                return;
            }
            const normalizedEmail = email.toLowerCase().trim();
            const existingUser = await prisma_1.prisma.user.findUnique({ where: { email: normalizedEmail } });
            if (existingUser) {
                res.status(400).json({ error: 'An account with this email already exists.' });
                return;
            }
            const code = Math.floor(100000 + Math.random() * 900000).toString();
            const expiresAt = new Date(Date.now() + 15 * 60 * 1000);
            await prisma_1.prisma.verificationCode.upsert({
                where: { email: normalizedEmail },
                update: { code, expiresAt },
                create: { email: normalizedEmail, code, expiresAt },
            });
            const emailResult = await (0, email_1.sendOTP)(normalizedEmail, code);
            if (emailResult && emailResult.error) {
                console.error('Failed to send OTP via Resend:', emailResult.error);
                const errMsg = emailResult.error.message || JSON.stringify(emailResult.error);
                res.status(500).json({ error: 'Failed to send email: ' + errMsg });
                return;
            }
            res.json({ success: true });
        }
        catch (err) {
            console.error('OTP Error:', err);
            res.status(500).json({ error: 'Internal server error: ' + (err.message || 'Unknown error') });
        }
    });
    server.post('/api/auth/register', async (req, res) => {
        try {
            const { email, password, displayName, code } = req.body;
            if (!email || !password || !displayName || !code) {
                res.status(400).json({ error: 'Email, password, display name, and code are required.' });
                return;
            }
            const normalizedEmail = email.toLowerCase().trim();
            const existingUser = await prisma_1.prisma.user.findUnique({ where: { email: normalizedEmail } });
            if (existingUser) {
                res.status(400).json({ error: 'An account with this email already exists.' });
                return;
            }
            const existingName = await prisma_1.prisma.user.findFirst({
                where: { displayName: { equals: displayName.trim(), mode: 'insensitive' } }
            });
            if (existingName) {
                res.status(400).json({ error: 'This display name is already taken.' });
                return;
            }
            if (password.length < 6) {
                res.status(400).json({ error: 'Password must be at least 6 characters.' });
                return;
            }
            const salt = bcryptjs_1.default.genSaltSync(10);
            const passwordHash = bcryptjs_1.default.hashSync(password, salt);
            const newUser = await prisma_1.prisma.user.create({
                data: {
                    email: normalizedEmail,
                    displayName: displayName.trim(),
                    passwordHash,
                    role: normalizedEmail === 'dahiruhammajam@gmail.com' ? 'owner' : 'user',
                }
            });
            await prisma_1.prisma.verificationCode.delete({ where: { email: normalizedEmail } }).catch(() => { });
            // Send welcome message
            try {
                const owner = await prisma_1.prisma.user.findFirst({ where: { role: 'owner' } });
                if (owner && owner.id !== newUser.id) {
                    const conv = await prisma_1.prisma.conversation.create({
                        data: {
                            isGroup: false,
                            participants: { create: [{ userId: owner.id }, { userId: newUser.id }] }
                        }
                    });
                    await prisma_1.prisma.message.create({
                        data: { conversationId: conv.id, senderId: owner.id, text: `Welcome to PixelGamez, ${newUser.displayName}! We're glad to have you here.` }
                    });
                }
            }
            catch (err) {
                console.error('Failed to send welcome msg:', err);
            }
            const token = await (0, sessions_1.createSession)(newUser.id);
            res.cookie(sessions_1.SESSION_COOKIE_NAME, token, {
                httpOnly: true,
                maxAge: sessions_1.SESSION_COOKIE_MAX_AGE * 1000,
                sameSite: 'lax',
                path: '/',
            });
            const { passwordHash: _ } = newUser, publicUser = __rest(newUser, ["passwordHash"]);
            res.json({ user: publicUser });
        }
        catch (err) {
            console.error('Register Error:', err);
            res.status(500).json({ error: 'Internal server error: ' + (err.message || 'Unknown error') });
        }
    });
    server.post('/api/auth/login', async (req, res) => {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                res.status(400).json({ error: 'Email and password are required.' });
                return;
            }
            const normalizedEmail = email.toLowerCase().trim();
            const user = await prisma_1.prisma.user.findUnique({
                where: { email: normalizedEmail },
                include: { favoriteGames: { select: { id: true } } }
            });
            if (!user || !user.passwordHash || !bcryptjs_1.default.compareSync(password, user.passwordHash)) {
                res.status(401).json({ error: 'Invalid email or password.' });
                return;
            }
            const token = await (0, sessions_1.createSession)(user.id);
            res.cookie(sessions_1.SESSION_COOKIE_NAME, token, {
                httpOnly: true,
                maxAge: sessions_1.SESSION_COOKIE_MAX_AGE * 1000,
                sameSite: 'lax',
                path: '/',
            });
            const { passwordHash: _ } = user, rest = __rest(user, ["passwordHash"]);
            const publicUser = Object.assign(Object.assign({}, rest), { favoriteGames: user.favoriteGames.map(g => g.id) });
            res.json({ user: publicUser });
        }
        catch (err) {
            console.error('Login Error:', err);
            res.status(500).json({ error: 'Internal server error: ' + (err.message || 'Unknown error') });
        }
    });
    server.post('/api/auth/logout', async (req, res) => {
        var _a;
        const token = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a[sessions_1.SESSION_COOKIE_NAME];
        if (token)
            await (0, sessions_1.deleteSession)(token);
        res.clearCookie(sessions_1.SESSION_COOKIE_NAME, { path: '/' });
        res.json({ success: true });
    });
    server.post('/api/auth/google', async (req, res) => {
        try {
            const { credential } = req.body;
            if (!credential) {
                res.status(400).json({ error: 'No credential provided.' });
                return;
            }
            const { OAuth2Client } = require('google-auth-library');
            const client = new OAuth2Client(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID);
            const ticket = await client.verifyIdToken({
                idToken: credential,
                audience: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
            });
            const payload = ticket.getPayload();
            if (!payload) {
                res.status(401).json({ error: 'Invalid Google token.' });
                return;
            }
            const { sub: googleId, email, name, picture } = payload;
            const normalizedEmail = email ? email.toLowerCase().trim() : '';
            let isNewUser = false;
            let user = await prisma_1.prisma.user.findFirst({
                where: {
                    OR: [
                        { googleId },
                        { email: normalizedEmail }
                    ]
                },
                include: { favoriteGames: { select: { id: true } } }
            });
            if (!user) {
                let baseName = name || 'Google User';
                let finalName = baseName;
                let suffix = 1;
                while (await prisma_1.prisma.user.findFirst({ where: { displayName: { equals: finalName, mode: 'insensitive' } } })) {
                    finalName = `${baseName}${suffix}`;
                    suffix++;
                }
                // Create new user
                user = await prisma_1.prisma.user.create({
                    data: {
                        email: normalizedEmail,
                        displayName: finalName,
                        googleId,
                        passwordHash: null,
                        avatarUrl: picture || '',
                        role: normalizedEmail === 'dahiruhammajam@gmail.com' ? 'owner' : 'user',
                    },
                    include: { favoriteGames: { select: { id: true } } }
                });
                isNewUser = true;
                // Send welcome message
                try {
                    const owner = await prisma_1.prisma.user.findFirst({ where: { role: 'owner' } });
                    if (owner && owner.id !== user.id) {
                        const conv = await prisma_1.prisma.conversation.create({
                            data: {
                                isGroup: false,
                                participants: { create: [{ userId: owner.id }, { userId: user.id }] }
                            }
                        });
                        await prisma_1.prisma.message.create({
                            data: { conversationId: conv.id, senderId: owner.id, text: `Welcome to PixelGamez, ${user.displayName}! We're glad to have you here.` }
                        });
                    }
                }
                catch (err) {
                    console.error('Failed to send welcome msg:', err);
                }
            }
            else if (!user.googleId) {
                // Link existing user to googleId
                user = await prisma_1.prisma.user.update({
                    where: { id: user.id },
                    data: { googleId },
                    include: { favoriteGames: { select: { id: true } } }
                });
            }
            const token = await (0, sessions_1.createSession)(user.id);
            res.cookie(sessions_1.SESSION_COOKIE_NAME, token, {
                httpOnly: true,
                maxAge: sessions_1.SESSION_COOKIE_MAX_AGE * 1000,
                sameSite: 'lax',
                path: '/',
            });
            const { passwordHash: _ } = user, rest = __rest(user, ["passwordHash"]);
            const publicUser = Object.assign(Object.assign({}, rest), { favoriteGames: user.favoriteGames.map(g => g.id) });
            res.json({ user: publicUser, isNewUser });
        }
        catch (err) {
            console.error('Google Auth Error:', err);
            res.status(500).json({ error: 'Internal server error: ' + (err.message || 'Unknown error') });
        }
    });
    server.get('/api/auth/me', async (req, res) => {
        const user = await getAuthUser(req);
        if (!user) {
            res.json({ user: null });
            return;
        }
        res.json({ user });
    });
    server.post('/api/auth/display-name', async (req, res) => {
        const user = await getAuthUser(req);
        if (!user) {
            res.status(401).json({ error: 'Not authenticated.' });
            return;
        }
        const { displayName } = req.body;
        if (!displayName || displayName.trim().length < 3) {
            res.status(400).json({ error: 'Display name must be at least 3 characters.' });
            return;
        }
        try {
            const existingName = await prisma_1.prisma.user.findFirst({
                where: {
                    displayName: { equals: displayName.trim(), mode: 'insensitive' },
                    id: { not: user.id }
                }
            });
            if (existingName) {
                res.status(400).json({ error: 'This display name is already taken.' });
                return;
            }
            const updatedUser = await prisma_1.prisma.user.update({
                where: { id: user.id },
                data: { displayName: displayName.trim() },
                include: { favoriteGames: { select: { id: true } } }
            });
            const { passwordHash: _ } = updatedUser, rest = __rest(updatedUser, ["passwordHash"]);
            res.json({ user: Object.assign(Object.assign({}, rest), { favoriteGames: updatedUser.favoriteGames.map(g => g.id) }) });
        }
        catch (err) {
            res.status(500).json({ error: 'Failed to update display name.' });
        }
    });
    server.post('/api/auth/avatar', avatarUpload.single('avatar'), async (req, res) => {
        const user = await getAuthUser(req);
        if (!user) {
            res.status(401).json({ error: 'Not authenticated.' });
            return;
        }
        if (!req.file) {
            res.status(400).json({ error: 'No image uploaded.' });
            return;
        }
        const ext = path_1.default.extname(req.file.originalname).toLowerCase() || '.jpg';
        const filename = `${user.id}${ext}`;
        const destPath = path_1.default.join(avatarsDir, filename);
        try {
            const files = fs_1.default.readdirSync(avatarsDir);
            for (const f of files) {
                if (f.startsWith(user.id))
                    fs_1.default.unlinkSync(path_1.default.join(avatarsDir, f));
            }
        }
        catch (_a) { }
        fs_1.default.copyFileSync(req.file.path, destPath);
        fs_1.default.unlinkSync(req.file.path);
        const avatarUrl = `/avatars/${filename}?t=${Date.now()}`;
        try {
            const updated = await prisma_1.prisma.user.update({
                where: { id: user.id },
                data: { avatarUrl },
                include: { favoriteGames: { select: { id: true } } }
            });
            const { passwordHash: _ } = updated, rest = __rest(updated, ["passwordHash"]);
            const publicUser = Object.assign(Object.assign({}, rest), { favoriteGames: updated.favoriteGames.map(g => g.id) });
            res.json({ success: true, user: publicUser });
        }
        catch (e) {
            res.status(500).json({ error: 'Failed to update avatar.' });
        }
    });
    server.post('/api/auth/banner', bannerUpload.single('banner'), async (req, res) => {
        const user = await getAuthUser(req);
        if (!user) {
            res.status(401).json({ error: 'Not authenticated.' });
            return;
        }
        if (!req.file) {
            res.status(400).json({ error: 'No image uploaded.' });
            return;
        }
        const ext = path_1.default.extname(req.file.originalname).toLowerCase() || '.jpg';
        const filename = `${user.id}${ext}`;
        const destPath = path_1.default.join(bannersDir, filename);
        try {
            const files = fs_1.default.readdirSync(bannersDir);
            for (const f of files) {
                if (f.startsWith(user.id))
                    fs_1.default.unlinkSync(path_1.default.join(bannersDir, f));
            }
        }
        catch (_a) { }
        fs_1.default.copyFileSync(req.file.path, destPath);
        fs_1.default.unlinkSync(req.file.path);
        const bannerUrl = `/banners/${filename}?t=${Date.now()}`;
        try {
            const updated = await prisma_1.prisma.user.update({
                where: { id: user.id },
                data: { bannerUrl },
                include: { favoriteGames: { select: { id: true } } }
            });
            const { passwordHash: _ } = updated, rest = __rest(updated, ["passwordHash"]);
            const publicUser = Object.assign(Object.assign({}, rest), { favoriteGames: updated.favoriteGames.map(g => g.id) });
            res.json({ success: true, user: publicUser });
        }
        catch (e) {
            res.status(500).json({ error: 'Failed to update banner.' });
        }
    });
    server.post('/api/auth/banner-color', async (req, res) => {
        const user = await getAuthUser(req);
        if (!user) {
            res.status(401).json({ error: 'Not authenticated.' });
            return;
        }
        const { color } = req.body;
        if (!color) {
            res.status(400).json({ error: 'Color is required.' });
            return;
        }
        try {
            const files = fs_1.default.readdirSync(bannersDir);
            for (const f of files) {
                if (f.startsWith(user.id))
                    fs_1.default.unlinkSync(path_1.default.join(bannersDir, f));
            }
        }
        catch (_a) { }
        try {
            const updated = await prisma_1.prisma.user.update({
                where: { id: user.id },
                data: { bannerUrl: color },
                include: { favoriteGames: { select: { id: true } } }
            });
            const { passwordHash: _ } = updated, rest = __rest(updated, ["passwordHash"]);
            const publicUser = Object.assign(Object.assign({}, rest), { favoriteGames: updated.favoriteGames.map(g => g.id) });
            res.json({ user: publicUser });
        }
        catch (e) {
            res.status(500).json({ error: 'Failed to update banner.' });
        }
    });
    server.post('/api/auth/profile', async (req, res) => {
        const user = await getAuthUser(req);
        if (!user) {
            res.status(401).json({ error: 'Not authenticated.' });
            return;
        }
        const { displayName } = req.body;
        try {
            const updated = await prisma_1.prisma.user.update({
                where: { id: user.id },
                data: { displayName: displayName.trim() },
                include: { favoriteGames: { select: { id: true } } }
            });
            const { passwordHash: _ } = updated, rest = __rest(updated, ["passwordHash"]);
            const publicUser = Object.assign(Object.assign({}, rest), { favoriteGames: updated.favoriteGames.map(g => g.id) });
            res.json({ user: publicUser });
        }
        catch (e) {
            res.status(500).json({ error: 'Failed to update profile.' });
        }
    });
    server.post('/api/user/recent', async (req, res) => {
        const user = await getAuthUser(req);
        if (!user) {
            res.status(401).json({ error: 'Not authenticated.' });
            return;
        }
        const { gameId } = req.body;
        if (!gameId) {
            res.status(400).json({ error: 'gameId required.' });
            return;
        }
        const recent = user.recentGames || [];
        const newRecent = [gameId, ...recent.filter((id) => id !== gameId)].slice(0, 10);
        try {
            const updated = await prisma_1.prisma.user.update({
                where: { id: user.id },
                data: { recentGames: newRecent },
                include: { favoriteGames: { select: { id: true } } }
            });
            const { passwordHash: _ } = updated, rest = __rest(updated, ["passwordHash"]);
            const publicUser = Object.assign(Object.assign({}, rest), { favoriteGames: updated.favoriteGames.map(g => g.id) });
            res.json({ success: true, user: publicUser });
        }
        catch (e) {
            res.status(500).json({ error: 'Failed to update recent games.' });
        }
    });
    server.get('/api/users/search', async (req, res) => {
        const q = req.query.q;
        if (!q) {
            res.json([]);
            return;
        }
        try {
            const users = await prisma_1.prisma.user.findMany({
                where: { displayName: { contains: q, mode: 'insensitive' } },
                select: { id: true, displayName: true, avatarUrl: true },
                take: 10
            });
            res.json(users);
        }
        catch (_a) {
            res.status(500).json({ error: 'Search failed' });
        }
    });
    let cachedPlaysMap = null;
    let lastPlaysCacheTime = 0;
    const PLAYS_CACHE_TTL = 5 * 60 * 1000; // 5 minutes
    server.get('/api/games/plays', async (req, res) => {
        try {
            const now = Date.now();
            if (cachedPlaysMap && (now - lastPlaysCacheTime < PLAYS_CACHE_TTL)) {
                res.json(cachedPlaysMap);
                return;
            }
            const games = await prisma_1.prisma.game.findMany({
                select: { id: true, plays: true }
            });
            const playsMap = games.reduce((acc, game) => {
                acc[game.id] = game.plays;
                return acc;
            }, {});
            cachedPlaysMap = playsMap;
            lastPlaysCacheTime = now;
            res.json(playsMap);
        }
        catch (e) {
            res.status(500).json({ error: 'Failed to fetch plays' });
        }
    });
    server.post('/api/games/:id/play', async (req, res) => {
        try {
            const gameId = req.params.id;
            await prisma_1.prisma.game.update({
                where: { id: gameId },
                data: { plays: { increment: 1 } }
            }).catch(() => { });
            res.json({ success: true });
        }
        catch (e) {
            res.status(500).json({ error: 'Failed to track play' });
        }
    });
    server.get('/api/votes/:gameId', async (req, res) => {
        const votes = await (0, votes_1.getVotes)(req.params.gameId);
        res.json(votes);
    });
    server.post('/api/votes/:gameId', async (req, res) => {
        const user = await getAuthUser(req);
        if (!user) {
            res.status(401).json({ error: 'Sign in to vote.' });
            return;
        }
        const gameId = req.params.gameId;
        const { type, action } = req.body;
        if (!type || !['like', 'dislike'].includes(type)) {
            res.status(400).json({ error: 'Invalid vote type.' });
            return;
        }
        if (!action || !['add', 'remove'].includes(action)) {
            res.status(400).json({ error: 'Invalid action.' });
            return;
        }
        const votes = action === 'add' ? await (0, votes_1.addVote)(gameId, user.id, type) : await (0, votes_1.removeVote)(gameId, user.id);
        res.json(votes);
    });
    server.get('/api/developer/games', async (_req, res) => {
        res.json(await (0, submissions_1.getApprovedSubmissions)());
    });
    server.get('/api/developer/my-games', async (req, res) => {
        const user = await getAuthUser(req);
        if (!user) {
            res.status(401).json({ error: 'Not authenticated.' });
            return;
        }
        res.json(await (0, submissions_1.getSubmissionsByUser)(user.id));
    });
    server.post('/api/developer/submit', upload.fields([{ name: 'gameFile' }, { name: 'bannerFile' }]), async (req, res) => {
        var _a, _b;
        const user = await getAuthUser(req);
        if (!user) {
            res.status(401).json({ error: 'Sign in to submit games.' });
            return;
        }
        try {
            const { title, description, category, gameType, embedUrl, thumbnail, discordUrl, steamUrl } = req.body;
            if (!title || !description || !category || !gameType) {
                res.status(400).json({ error: 'Missing required fields.' });
                return;
            }
            let finalEmbedUrl = embedUrl || '';
            const files = req.files;
            const gameFile = (_a = files === null || files === void 0 ? void 0 : files['gameFile']) === null || _a === void 0 ? void 0 : _a[0];
            const bannerFile = (_b = files === null || files === void 0 ? void 0 : files['bannerFile']) === null || _b === void 0 ? void 0 : _b[0];
            if (!bannerFile) {
                res.status(400).json({ error: 'Game banner is required.' });
                return;
            }
            const bannerExt = path_1.default.extname(bannerFile.originalname) || '.png';
            const bannerFilename = `banner-${Date.now()}${bannerExt}`;
            const bannerPath = path_1.default.join(bannerFile.destination, bannerFilename);
            fs_1.default.renameSync(bannerFile.path, bannerPath);
            const finalBannerUrl = `/api/uploads/${bannerFilename}`;
            if (gameFile && gameType === 'html') {
                const gameId = `game-${Date.now().toString(36)}`;
                const gameDir = path_1.default.join(communityGamesDir, gameId);
                fs_1.default.mkdirSync(gameDir, { recursive: true });
                const ext = path_1.default.extname(gameFile.originalname).toLowerCase();
                if (ext === '.zip') {
                    fs_1.default.renameSync(gameFile.path, path_1.default.join(gameDir, 'game.zip'));
                    finalEmbedUrl = `/community-games/${gameId}/index.html`;
                }
                else {
                    fs_1.default.renameSync(gameFile.path, path_1.default.join(gameDir, 'index.html'));
                    finalEmbedUrl = `/community-games/${gameId}/index.html`;
                }
            }
            if (!finalEmbedUrl) {
                res.status(400).json({ error: 'Upload a game file or provide an embed URL.' });
                return;
            }
            const submission = await (0, submissions_1.addSubmission)({
                title,
                description,
                category,
                gameType,
                embedUrl: finalEmbedUrl,
                thumbnail: thumbnail || '',
                bannerUrl: finalBannerUrl,
                userId: user.id,
                developerName: user.displayName,
                discordUrl: discordUrl || '',
                steamUrl: steamUrl || '',
            });
            res.json({ success: true, game: submission });
        }
        catch (error) {
            console.error('Submission error:', error);
            res.status(500).json({ error: error instanceof Error ? error.message : 'Failed to submit game' });
        }
    });
    server.get('/api/admin/users', async (req, res) => {
        try {
            const user = await getAuthUser(req);
            if (!user || (user.role !== 'owner' && user.role !== 'moderator')) {
                res.status(403).json({ error: 'Forbidden' });
                return;
            }
            const users = await prisma_1.prisma.user.findMany({
                select: { id: true, email: true, displayName: true, role: true, createdAt: true },
                orderBy: { createdAt: 'desc' }
            });
            res.json(users);
        }
        catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal server error' });
        }
    });
    server.put('/api/admin/users/:id/role', async (req, res) => {
        try {
            const user = await getAuthUser(req);
            if (!user || user.role !== 'owner') {
                res.status(403).json({ error: 'Forbidden. Only owners can change roles.' });
                return;
            }
            const { role } = req.body;
            if (!['user', 'moderator', 'owner'].includes(role)) {
                res.status(400).json({ error: 'Invalid role' });
                return;
            }
            const targetUser = await prisma_1.prisma.user.findUnique({ where: { id: req.params.id } });
            if (targetUser && targetUser.role === 'owner') {
                res.status(403).json({ error: 'Owners cannot be demoted through the UI.' });
                return;
            }
            const updatedUser = await prisma_1.prisma.user.update({
                where: { id: req.params.id },
                data: { role }
            });
            res.json({ success: true, role: updatedUser.role });
        }
        catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal server error' });
        }
    });
    server.get('/api/admin/pending', async (req, res) => {
        const user = await getAuthUser(req);
        if (!user || !(0, users_1.isAdmin)(user.id)) {
            res.status(403).json({ error: 'Admin access required.' });
            return;
        }
        res.json(await (0, submissions_1.getPendingSubmissions)());
    });
    server.post('/api/admin/approve/:id', async (req, res) => {
        const user = await getAuthUser(req);
        if (!user || !(0, users_1.isAdmin)(user.id)) {
            res.status(403).json({ error: 'Admin access required.' });
            return;
        }
        const result = await (0, submissions_1.approveSubmission)(req.params.id, user.id);
        if (!result) {
            res.status(404).json({ error: 'Submission not found.' });
            return;
        }
        try {
            const dataPath = path_1.default.join(process.cwd(), 'lib', 'data.ts');
            let dataContent = fs_1.default.readFileSync(dataPath, 'utf-8');
            const gameString = `\n  { id: '${result.id}', title: '${result.title.replace(/'/g, "\\'")}', description: '${result.description.replace(/'/g, "\\'")}', category: '${result.category}', tags: ['new'], thumbnail: '${result.thumbnail || ''}', embedUrl: '${result.embedUrl}', rating: 0, plays: 0, developerName: '${result.developerName.replace(/'/g, "\\'")}', bannerUrl: '${result.bannerUrl || ''}' },`;
            dataContent = dataContent.replace('export const games: Game[] = [', `export const games: Game[] = [${gameString}`);
            fs_1.default.writeFileSync(dataPath, dataContent, 'utf-8');
        }
        catch (err) {
            console.error('Failed to inject game into data.ts:', err);
        }
        res.json({ success: true, game: result });
    });
    server.post('/api/admin/reject/:id', async (req, res) => {
        const user = await getAuthUser(req);
        if (!user || !(0, users_1.isAdmin)(user.id)) {
            res.status(403).json({ error: 'Admin access required.' });
            return;
        }
        const result = await (0, submissions_1.rejectSubmission)(req.params.id, user.id);
        if (!result) {
            res.status(404).json({ error: 'Submission not found.' });
            return;
        }
        res.json({ success: true, game: result });
    });
    server.get('/api/users/:id', async (req, res) => {
        const idParam = req.params.id;
        let user;
        if (!isNaN(Number(idParam))) {
            user = await prisma_1.prisma.user.findFirst({ where: { playerId: Number(idParam) } });
        }
        else {
            user = await prisma_1.prisma.user.findUnique({ where: { id: idParam } });
        }
        if (!user) {
            res.status(404).json({ error: 'User not found.' });
            return;
        }
        const followersCount = await prisma_1.prisma.follow.count({ where: { followingId: user.id } });
        const followingCount = await prisma_1.prisma.follow.count({ where: { followerId: user.id } });
        const allSubmissions = await prisma_1.prisma.submission.findMany({ where: { userId: user.id, status: 'approved' } });
        const { passwordHash } = user, publicUser = __rest(user, ["passwordHash"]);
        res.json({
            user: publicUser,
            submissions: allSubmissions,
            followersCount,
            followingCount
        });
    });
    server.post('/api/auth/bio', async (req, res) => {
        const user = await getAuthUser(req);
        if (!user) {
            res.status(401).json({ error: 'Not authenticated.' });
            return;
        }
        let { aboutMe, workingOn, country } = req.body;
        if (aboutMe)
            aboutMe = profanityFilter.clean(aboutMe);
        if (workingOn)
            workingOn = profanityFilter.clean(workingOn);
        try {
            const updated = await prisma_1.prisma.user.update({
                where: { id: user.id },
                data: {
                    aboutMe: aboutMe !== undefined ? aboutMe.slice(0, 500) : undefined,
                    workingOn: workingOn !== undefined ? workingOn.slice(0, 500) : undefined,
                    country: country !== undefined ? country.slice(0, 60) : undefined
                },
                include: { favoriteGames: { select: { id: true } } }
            });
            const { passwordHash: _ } = updated, rest = __rest(updated, ["passwordHash"]);
            const publicUser = Object.assign(Object.assign({}, rest), { favoriteGames: updated.favoriteGames.map(g => g.id) });
            res.json({ user: publicUser });
        }
        catch (e) {
            res.status(500).json({ error: 'Failed to update bio.' });
        }
    });
    server.post('/api/auth/favorite/:gameId', async (req, res) => {
        const user = await getAuthUser(req);
        if (!user) {
            res.status(401).json({ error: 'Not authenticated.' });
            return;
        }
        const gameId = req.params.gameId;
        const { action } = req.body;
        try {
            const updated = await prisma_1.prisma.user.update({
                where: { id: user.id },
                data: action === 'remove'
                    ? { favoriteGames: { disconnect: { id: gameId } } }
                    : { favoriteGames: { connect: { id: gameId } } },
                include: { favoriteGames: { select: { id: true } } }
            });
            const publicUser = Object.assign(Object.assign({}, updated), { favoriteGames: updated.favoriteGames.map(g => g.id) });
            delete publicUser.passwordHash;
            res.json({ user: publicUser });
        }
        catch (e) {
            res.status(500).json({ error: 'Failed to update favorites.' });
        }
    });
    server.get('/api/users/lookup/:name', async (req, res) => {
        const name = req.params.name;
        const user = await prisma_1.prisma.user.findFirst({
            where: {
                displayName: {
                    equals: name,
                    mode: 'insensitive'
                }
            }
        });
        if (!user) {
            res.status(404).json({ error: 'User not found.' });
            return;
        }
        res.json({ id: user.playerId || user.id, displayName: user.displayName });
    });
    server.get('/api/ads/:placement', async (req, res) => {
        const placement = req.params.placement;
        const ads = await (0, ads_1.getAdsByPlacement)(placement);
        res.json(ads);
    });
    server.post('/api/ads/:id/click', async (req, res) => {
        await (0, ads_1.recordClick)(req.params.id);
        res.json({ success: true });
    });
    server.post('/api/ads/:id/impression', async (req, res) => {
        await (0, ads_1.recordImpression)(req.params.id);
        res.json({ success: true });
    });
    server.get('/api/admin/analytics', async (req, res) => {
        const user = await getAuthUser(req);
        if (!user || user.role !== 'owner') {
            res.status(403).json({ error: 'Access denied' });
            return;
        }
        try {
            const analytics = await prisma_1.prisma.game.findMany({
                orderBy: { plays: 'desc' },
                include: {
                    _count: { select: { favoritedBy: true } },
                    votes: { select: { type: true } }
                }
            });
            res.json(analytics);
        }
        catch (error) {
            res.status(500).json({ error: 'Failed to fetch analytics' });
        }
    });
    server.put('/api/admin/games/:id', async (req, res) => {
        const user = await getAuthUser(req);
        if (!user || user.role !== 'owner') {
            res.status(403).json({ error: 'Access denied' });
            return;
        }
        try {
            const gameId = req.params.id;
            const { description } = req.body;
            const updated = await prisma_1.prisma.game.update({
                where: { id: gameId },
                data: { description }
            });
            res.json(updated);
        }
        catch (error) {
            res.status(500).json({ error: 'Failed to update game' });
        }
    });
    server.get('/api/admin/analytics/:id', async (req, res) => {
        const user = await getAuthUser(req);
        if (!user || user.role !== 'owner') {
            res.status(403).json({ error: 'Access denied' });
            return;
        }
        try {
            const gameId = req.params.id;
            const analytics = await prisma_1.prisma.game.findUnique({
                where: { id: gameId },
                include: {
                    _count: { select: { favoritedBy: true } },
                    votes: { select: { type: true } }
                }
            });
            if (!analytics) {
                res.status(404).json({ error: 'Game not found' });
                return;
            }
            res.json(analytics);
        }
        catch (error) {
            res.status(500).json({ error: 'Failed to fetch analytics' });
        }
    });
    server.get('/api/admin/ads', async (req, res) => {
        const user = await getAuthUser(req);
        if (!user || user.role !== 'owner') {
            res.status(403).json({ error: 'Forbidden' });
            return;
        }
        res.json(await (0, ads_1.getAllAds)());
    });
    server.post('/api/admin/ads', upload.single('image'), async (req, res) => {
        const user = await getAuthUser(req);
        if (!user || user.role !== 'owner') {
            res.status(403).json({ error: 'Forbidden' });
            return;
        }
        if (!req.file) {
            res.status(400).json({ error: 'Image is required.' });
            return;
        }
        const { linkUrl, placement, label } = req.body;
        if (!linkUrl || !placement) {
            res.status(400).json({ error: 'Link and placement are required.' });
            return;
        }
        const ext = path_1.default.extname(req.file.originalname) || '.png';
        const newFilename = `${req.file.filename}${ext}`;
        const newPath = path_1.default.join(req.file.destination, newFilename);
        fs_1.default.renameSync(req.file.path, newPath);
        const imageUrl = `/api/uploads/${newFilename}`;
        const ad = await (0, ads_1.addAd)({ imageUrl, linkUrl, placement: placement, label });
        res.json(ad);
    });
    server.post('/api/admin/ads/:id/toggle', async (req, res) => {
        const user = await getAuthUser(req);
        if (!user || user.role !== 'owner') {
            res.status(403).json({ error: 'Forbidden' });
            return;
        }
        const updated = await (0, ads_1.toggleAd)(req.params.id);
        if (!updated) {
            res.status(404).json({ error: 'Ad not found' });
            return;
        }
        res.json(updated);
    });
    server.delete('/api/admin/ads/:id', async (req, res) => {
        const user = await getAuthUser(req);
        if (!user || user.role !== 'owner') {
            res.status(403).json({ error: 'Forbidden' });
            return;
        }
        const success = await (0, ads_1.deleteAd)(req.params.id);
        if (!success) {
            res.status(404).json({ error: 'Ad not found' });
            return;
        }
        res.json({ success: true });
    });
    server.get('/api/notifications', async (req, res) => {
        res.json(await (0, notifications_1.getNotifications)());
    });
    server.post('/api/admin/notifications', async (req, res) => {
        const user = await getAuthUser(req);
        if (!user || (user.role !== 'owner' && user.role !== 'moderator')) {
            res.status(403).json({ error: 'Forbidden' });
            return;
        }
        const { title, message } = req.body;
        if (!title || !message) {
            res.status(400).json({ error: 'Title and message are required.' });
            return;
        }
        const notif = await (0, notifications_1.addNotification)(title, message);
        res.json(notif);
    });
    server.delete('/api/admin/notifications/:id', async (req, res) => {
        const user = await getAuthUser(req);
        if (!user || (user.role !== 'owner' && user.role !== 'moderator')) {
            res.status(403).json({ error: 'Forbidden' });
            return;
        }
        await (0, notifications_1.deleteNotification)(req.params.id);
        res.json({ success: true });
    });
    server.get('/api/friends', async (req, res) => {
        const user = await getAuthUser(req);
        if (!user) {
            res.status(401).json({ error: 'Not authenticated' });
            return;
        }
        res.json(await (0, friends_1.getFriendsAndFollows)(user.id));
    });
    server.get('/api/friends/status/:targetId', async (req, res) => {
        const user = await getAuthUser(req);
        if (!user) {
            res.status(401).json({ error: 'Not authenticated' });
            return;
        }
        res.json({ status: await (0, friends_1.getFriendshipStatus)(user.id, req.params.targetId) });
    });
    server.post('/api/friends/follow/:targetId', async (req, res) => {
        const user = await getAuthUser(req);
        if (!user) {
            res.status(401).json({ error: 'Not authenticated' });
            return;
        }
        const result = await (0, friends_1.followUser)(user.id, req.params.targetId);
        res.json({ success: !!result, follow: result });
    });
    server.post('/api/friends/unfollow/:targetId', async (req, res) => {
        const user = await getAuthUser(req);
        if (!user) {
            res.status(401).json({ error: 'Not authenticated' });
            return;
        }
        const success = await (0, friends_1.unfollowUser)(user.id, req.params.targetId);
        res.json({ success });
    });
    server.get('/api/proxy-game', async (req, res) => {
        const targetUrl = req.query.url;
        if (!targetUrl) {
            res.status(400).send('URL required');
            return;
        }
        try {
            const fetchRes = await fetch(targetUrl, {
                headers: {
                    'Referer': 'https://itch.io/',
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
                }
            });
            if (!fetchRes.ok) {
                res.status(fetchRes.status).send('Proxy error');
                return;
            }
            let html = await fetchRes.text();
            const baseUrl = new URL('.', targetUrl).href;
            const injectCss = `<style>
        html, body { width: 100% !important; height: 100% !important; margin: 0 !important; padding: 0 !important; overflow: hidden !important; background-color: #000 !important; }
        canvas, #canvas-container, #unity-container, #game-container, iframe { width: 100% !important; height: 100% !important; max-width: none !important; max-height: none !important; margin: 0 !important; object-fit: contain !important; }
      </style>`;
            if (html.includes('<head>')) {
                html = html.replace('<head>', `<head><base href="${baseUrl}">${injectCss}`);
            }
            else {
                html = `<head><base href="${baseUrl}">${injectCss}</head>` + html;
            }
            // Strip out itch.io's anti-hotlinking script which replaces the DOM
            html = html.replace(/<script[^>]*src=["']https:\/\/static\.itch\.io\/htmlgame\.js["'][^>]*><\/script>/gi, '');
            res.send(html);
        }
        catch (e) {
            console.error('Proxy Error:', e);
            res.status(500).send('Error proxying game: ' + e.message);
        }
    });
    server.post('/api/contact', async (req, res) => {
        try {
            const { name, email, company, message, budget } = req.body;
            await prisma_1.prisma.brandInquiry.create({
                data: {
                    name,
                    email,
                    company: company || null,
                    budget: budget || null,
                    message,
                }
            });
            res.status(200).json({ success: true });
        }
        catch (err) {
            console.error('Failed to save inquiry:', err);
            res.status(500).json({ error: 'Failed to save inquiry' });
        }
    });
    server.get('/api/admin/inquiries', async (req, res) => {
        const user = await getAuthUser(req);
        if (!user || user.role !== 'owner') {
            res.status(403).json({ error: 'Forbidden' });
            return;
        }
        try {
            const inquiries = await prisma_1.prisma.brandInquiry.findMany({
                orderBy: { createdAt: 'desc' }
            });
            res.status(200).json(inquiries);
        }
        catch (err) {
            console.error('Error fetching inquiries:', err);
            res.status(500).json({ error: 'Failed to fetch inquiries' });
        }
    });
    server.post('/api/admin/inquiries/:id/read', async (req, res) => {
        const user = await getAuthUser(req);
        if (!user || user.role !== 'owner') {
            res.status(403).json({ error: 'Forbidden' });
            return;
        }
        try {
            await prisma_1.prisma.brandInquiry.update({
                where: { id: req.params.id },
                data: { status: 'read' }
            });
            res.status(200).json({ success: true });
        }
        catch (err) {
            console.error('Error updating inquiry:', err);
            res.status(500).json({ error: 'Failed to update inquiry' });
        }
    });
    server.get('/api/chat/conversations', async (req, res) => {
        const user = await getAuthUser(req);
        if (!user) {
            res.status(401).json({ error: 'Not authenticated.' });
            return;
        }
        try {
            const conversations = await prisma_1.prisma.conversation.findMany({
                where: { participants: { some: { userId: user.id } } },
                include: {
                    participants: { include: { user: { select: { id: true, displayName: true, avatarUrl: true } } } },
                    messages: { orderBy: { createdAt: 'desc' }, take: 1 }
                },
                orderBy: { createdAt: 'desc' }
            });
            res.json(conversations);
        }
        catch (_a) {
            res.status(500).json({ error: 'Failed to fetch conversations' });
        }
    });
    server.get('/api/chat/messages/:conversationId', async (req, res) => {
        const user = await getAuthUser(req);
        if (!user) {
            res.status(401).json({ error: 'Not authenticated.' });
            return;
        }
        const conversationId = req.params.conversationId;
        try {
            const isParticipant = await prisma_1.prisma.participant.findFirst({ where: { conversationId, userId: user.id } });
            if (!isParticipant) {
                res.status(403).json({ error: 'Forbidden' });
                return;
            }
            const messages = await prisma_1.prisma.message.findMany({
                where: { conversationId },
                orderBy: { createdAt: 'asc' },
                include: { sender: { select: { id: true, displayName: true, avatarUrl: true } } }
            });
            res.json(messages);
        }
        catch (_a) {
            res.status(500).json({ error: 'Failed to fetch messages' });
        }
    });
    server.post('/api/chat/messages', async (req, res) => {
        const user = await getAuthUser(req);
        if (!user) {
            res.status(401).json({ error: 'Not authenticated.' });
            return;
        }
        const text = req.body.text;
        const conversationId = req.body.conversationId;
        if (!text || !conversationId) {
            res.status(400).json({ error: 'Missing fields' });
            return;
        }
        try {
            const isParticipant = await prisma_1.prisma.participant.findFirst({ where: { conversationId, userId: user.id } });
            if (!isParticipant) {
                res.status(403).json({ error: 'Forbidden' });
                return;
            }
            const message = await prisma_1.prisma.message.create({
                data: { conversationId, senderId: user.id, text },
                include: { sender: { select: { id: true, displayName: true, avatarUrl: true } } }
            });
            res.json(message);
        }
        catch (_a) {
            res.status(500).json({ error: 'Failed to send message' });
        }
    });
    server.post('/api/chat/conversations', async (req, res) => {
        const user = await getAuthUser(req);
        if (!user) {
            res.status(401).json({ error: 'Not authenticated.' });
            return;
        }
        const { participantIds, isGroup, name } = req.body;
        if (!participantIds || !Array.isArray(participantIds)) {
            res.status(400).json({ error: 'Invalid participants' });
            return;
        }
        try {
            const pIds = Array.from(new Set([...participantIds, user.id]));
            if (!isGroup && pIds.length === 2) {
                const existing = await prisma_1.prisma.conversation.findFirst({
                    where: {
                        isGroup: false,
                        AND: [
                            { participants: { some: { userId: pIds[0] } } },
                            { participants: { some: { userId: pIds[1] } } }
                        ]
                    },
                    include: {
                        participants: { include: { user: { select: { id: true, displayName: true, avatarUrl: true } } } },
                        messages: { orderBy: { createdAt: 'desc' }, take: 1 }
                    }
                });
                if (existing) {
                    res.json(existing);
                    return;
                }
            }
            const conversation = await prisma_1.prisma.conversation.create({
                data: {
                    isGroup: !!isGroup,
                    name: name || null,
                    participants: { create: pIds.map(id => ({ userId: id })) }
                },
                include: {
                    participants: { include: { user: { select: { id: true, displayName: true, avatarUrl: true } } } }
                }
            });
            res.json(conversation);
        }
        catch (_a) {
            res.status(500).json({ error: 'Failed to create conversation' });
        }
    });
    server.use((req, res) => {
        return handle(req, res);
    });
    server.listen(port, () => {
        console.log(`> Ready on http://localhost:${port}`);
    });
}).catch((err) => {
    console.error('Error starting server:', err);
    process.exit(1);
});
