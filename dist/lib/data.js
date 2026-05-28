"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.games = exports.categories = void 0;
exports.getAllGames = getAllGames;
exports.getGameById = getGameById;
exports.getGamesByCategory = getGamesByCategory;
exports.getFeaturedGames = getFeaturedGames;
exports.getPopularGames = getPopularGames;
exports.getNewGames = getNewGames;
exports.getTrendingGames = getTrendingGames;
exports.getUpAndComingGames = getUpAndComingGames;
exports.getMostVisitedGames = getMostVisitedGames;
exports.getRecommendedGames = getRecommendedGames;
exports.searchGames = searchGames;
exports.getRelatedGames = getRelatedGames;
exports.getCategoryById = getCategoryById;
exports.getGameCountByCategory = getGameCountByCategory;
exports.formatPlays = formatPlays;
exports.categories = [
    { id: 'action', name: 'Action', icon: 'action' },
    { id: 'adventure', name: 'Adventure', icon: 'adventure' },
    { id: 'arcade', name: 'Arcade', icon: 'arcade' },
    { id: 'clicker', name: 'Clicker', icon: 'clicker' },
    { id: 'driving', name: 'Driving', icon: 'driving' },
    { id: 'io', name: '.io', icon: 'io' },
    { id: 'puzzle', name: 'Puzzle', icon: 'puzzle' },
    { id: 'shooting', name: 'Shooting', icon: 'shooting' },
    { id: 'simulation', name: 'Simulation', icon: 'simulation' },
    { id: 'sports', name: 'Sports', icon: 'sports' },
    { id: 'strategy', name: 'Strategy', icon: 'strategy' },
];
const categoryColors = {
    action: { bg: 'DC2626', fg: 'FECACA' },
    adventure: { bg: '7C3AED', fg: 'DDD6FE' },
    arcade: { bg: '2563EB', fg: 'BFDBFE' },
    board: { bg: '92400E', fg: 'FDE68A' },
    card: { bg: '065F46', fg: 'A7F3D0' },
    clicker: { bg: 'DB2777', fg: 'FBCFE8' },
    driving: { bg: 'EA580C', fg: 'FED7AA' },
    io: { bg: '0891B2', fg: 'CFFAFE' },
    puzzle: { bg: '4F46E5', fg: 'C7D2FE' },
    shooting: { bg: '991B1B', fg: 'FECACA' },
    simulation: { bg: '15803D', fg: 'BBF7D0' },
    sports: { bg: '1D4ED8', fg: 'BFDBFE' },
    strategy: { bg: '6D28D9', fg: 'DDD6FE' },
};
function makeThumbnail(title, category) {
    const colors = categoryColors[category] || { bg: '1A1B28', fg: 'A78BFA' };
    return `https://placehold.co/400x225/${colors.bg}/${colors.fg}?text=${encodeURIComponent(title)}&font=raleway`;
}
const EMBED_BASE = '/placeholder.html';
function makeEmbed(seed) {
    return `${EMBED_BASE}?seed=${seed}`;
}
exports.games = [
    { id: 'house-of-hazards', title: 'House of Hazards', description: 'Try to survive the House of Hazards! Watch out for traps set by your friends in this hilarious party game.', category: 'action', tags: ['new', 'popular'], thumbnail: '', embedUrl: 'https://unblockedgames66.gitlab.io/house-of-hazards/', rating: 4.8, plays: 450000 },
    { id: 'basket-random', title: 'Basket Random', description: 'A fun, chaotic, and completely random physics-based basketball game!', category: 'sports', tags: ['new', 'popular'], thumbnail: '', embedUrl: 'https://unblockedgames66.gitlab.io/basket-random/', rating: 4.6, plays: 320000 },
    { id: 'boxing-random', title: 'Boxing Random', description: 'A fun, chaotic, and completely random physics-based boxing game.', category: 'sports', tags: ['new', 'popular', 'action'], thumbnail: '/images/boxing-random.png', embedUrl: 'https://unblockedgames66.gitlab.io/boxing-random/', rating: 4.4, plays: 250000 },
    { id: 'basketball-legends', title: 'Basketball Legends', description: 'A fun, chaotic, and completely random physics-based basketball game.', category: 'sports', tags: ['new', 'popular', 'action'], thumbnail: '', embedUrl: 'https://unblockedgames66.gitlab.io/basketball-legends/', rating: 4.4, plays: 250000 },
    { id: 'soccer-random', title: 'Soccer Random', description: 'Experience soccer like never before in this completely unpredictable, physics-based soccer game!', category: 'sports', tags: ['new', 'popular', 'action'], thumbnail: '/images/soccer-random.png', embedUrl: 'https://unblockedgames66.gitlab.io/soccer-random/', rating: 4.5, plays: 210000 },
    { id: 'rooftop-snipers', title: 'Rooftop Snipers', description: 'A chaotic two-button sniper game. Try to shoot your opponent off the roof!', category: 'shooting', tags: ['popular', 'action'], thumbnail: '/images/rooftop-snipers.png', embedUrl: 'https://unblockedgames66.gitlab.io/rooftop-snipers/', rating: 4.7, plays: 500000 },
    { id: 'rooftop-snipers-2', title: 'Rooftop Snipers 2', description: 'The sequel to the classic! More chaos, more weapons, more fun!', category: 'shooting', tags: ['new', 'action'], thumbnail: '/images/rooftop-snipers-2.png', embedUrl: 'https://unblockedgames66.gitlab.io/rooftop-snipers-2/', rating: 4.6, plays: 180000 },
    { id: 'volley-random', title: 'Volley Random', description: 'Physics-based volleyball madness. Expect the unexpected in every serve!', category: 'sports', tags: ['new', 'popular'], thumbnail: '/images/volley-random.png', embedUrl: 'https://unblockedgames66.gitlab.io/volley-random/', rating: 4.5, plays: 195000 },
    { id: 'raft-wars-2', title: 'Raft Wars 2', description: 'Infiltrate the water park and find your buried treasure in this hilarious sequel!', category: 'shooting', tags: ['action', 'popular'], thumbnail: '/images/raft-wars-2.png', embedUrl: 'https://unblockedgames66.gitlab.io/raft-wars-2/', rating: 4.7, plays: 420000 },
    { id: 'boxing-physics-2', title: 'Boxing Physics 2', description: 'Experience the craziest boxing matches with bizarre physics and characters.', category: 'sports', tags: ['action', 'new'], thumbnail: '/images/boxing-physics-2.png', embedUrl: 'https://unblockedgames66.gitlab.io/boxing-physics-2/', rating: 4.3, plays: 115000 },
    { id: 'royale-dudes', title: 'Royale Dudes', description: 'A fast-paced 2D multiplayer battle royale game. Loot, shoot, and survive!', category: 'io', tags: ['action', 'popular', 'new'], thumbnail: '/images/royale-dudes.png', embedUrl: 'https://unblockedgames66.gitlab.io/royale-dudes/', rating: 4.6, plays: 890000 },
    { id: 'moto-x3m-3-pool-party', title: 'Moto X3M Pool Party', description: 'Take your dirt bike to the pool party! Perform stunts and avoid deadly traps.', category: 'driving', tags: ['action', 'popular'], thumbnail: '/images/moto3xm-pool-party.png', embedUrl: 'https://unblockedgames66.gitlab.io/moto-x3m-3-pool-party/', rating: 4.8, plays: 1200000 },
    { id: 'moto-x3m-6-spooky-land', title: 'Moto X3M Spooky Land', description: 'A terrifyingly fun dirt bike experience through a haunted landscape!', category: 'driving', tags: ['action', 'popular'], thumbnail: '/images/moto-x3m-spooky-land.png', embedUrl: 'https://unblockedgames66.gitlab.io/moto-x3m-6-spooky-land/', rating: 4.8, plays: 950000 },
    { id: 'moto-x3m-two', title: 'Moto X3M 2', description: 'The second installment of the legendary dirt bike racing series.', category: 'driving', tags: ['action'], thumbnail: '/images/moto-x3m-two.png', embedUrl: 'https://unblockedgames66.gitlab.io/moto-x3m-two/', rating: 4.7, plays: 600000 },
    { id: 'moto-x3m-4-winter', title: 'Moto X3M 4 Winter', description: 'Race your bike across icy mountains and festive tracks in this winter edition!', category: 'driving', tags: ['action', 'popular'], thumbnail: '/images/moto-x3m4-winter.png', embedUrl: 'https://unblockedgames66.gitlab.io/moto-x3m4-winter/', rating: 4.8, plays: 1050000 },
    { id: 'gartic-phone-io', title: 'Gartic Phone', description: 'The telephone game meets drawing! Hilarious fun with friends.', category: 'io', tags: ['popular', 'new'], thumbnail: '/images/gartic-phone-io.png', embedUrl: 'https://unblockedgames66.gitlab.io/gartic-phone-io/', rating: 4.9, plays: 2500000 },
    { id: 'pixel-gun-3d', title: 'Pixel Gun 3D', description: 'Action packed multiplayer shooter!', category: 'shooting', tags: ['popular', 'action'], thumbnail: '', embedUrl: 'https://unblockedgames66.gitlab.io/pixel-gun-3d/', rating: 4.8, plays: 600000 },
    { id: 'crossy-road', title: 'Crossy Road', description: 'Why did the chicken cross the road? Find out in this classic endless hopper!', category: 'arcade', tags: ['popular'], thumbnail: '/images/crossy-road.png', embedUrl: 'https://unblockedgames66.gitlab.io/crossy-road/', rating: 4.6, plays: 1200000 },
    { id: 'bob-the-robber-2', title: 'Bob The Robber 2', description: 'Sneak past guards and cameras to steal the loot!', category: 'puzzle', tags: ['popular'], thumbnail: '/images/bob-the-robber-2.png', embedUrl: 'https://unblockedgames66.gitlab.io/bob-the-robber-2/', rating: 4.5, plays: 800000 },
    { id: 'drive-mad', title: 'Drive Mad', description: 'Physics-based driving game where you must reach the finish line in one piece.', category: 'driving', tags: ['popular'], thumbnail: '/images/drive-mad.png', embedUrl: 'https://unblockedgames66.gitlab.io/drive-mad/', rating: 4.7, plays: 950000 },
    { id: 'pixel-smash-duel', title: 'Pixel Smash Duel', description: 'Intense pixelated duels. Knock your opponent off the platform!', category: 'action', tags: ['action'], thumbnail: '/images/pixel-smash-duel.png', embedUrl: 'https://unblockedgames66.gitlab.io/pixel-smash-duel/', rating: 4.4, plays: 150000 },
    { id: 'aquapark-io', title: 'Aquapark.io', description: 'Race down the massive water slide and knock others off!', category: 'io', tags: ['popular', 'action'], thumbnail: '/images/aquapark-io.png', embedUrl: 'https://unblockedgames66.gitlab.io/aquapark-io/', rating: 4.5, plays: 2200000 },
    { id: 'hole-io', title: 'Hole.io', description: 'Consume everything in your path and become the biggest black hole!', category: 'io', tags: ['popular', 'action'], thumbnail: '/images/hole-io.png', embedUrl: 'https://unblockedgames66.gitlab.io/hole-io/', rating: 4.7, plays: 3100000 },
    { id: 'idle-mining-empire', title: 'Idle Mining Empire', description: 'Manage your mining facilities and become an industrial tycoon.', category: 'clicker', tags: ['popular'], thumbnail: '/images/idle-mining-empire.png', embedUrl: 'https://unblockedgames66.gitlab.io/idle-mining-empire/', rating: 4.4, plays: 400000 },
    { id: 'idle-breakout', title: 'Idle Breakout', description: 'Breakout meets idle clicking. Upgrade your balls to destroy blocks faster.', category: 'clicker', tags: ['popular'], thumbnail: '/images/idle-breakout.png', embedUrl: 'https://unblockedgames66.gitlab.io/idle-breakout/', rating: 4.6, plays: 1200000 },
    { id: 'burger-clicker', title: 'Burger Clicker', description: 'Click to make burgers and build your fast food empire!', category: 'clicker', tags: [], thumbnail: '/images/burger-clicker.png', embedUrl: 'https://unblockedgames66.gitlab.io/burger-clicker/', rating: 4.2, plays: 300000 },
    { id: 'idle-restaurants', title: 'Idle Restaurants', description: 'Manage and upgrade your restaurant business.', category: 'clicker', tags: [], thumbnail: '/images/idle-restaurants.png', embedUrl: 'https://unblockedgames66.gitlab.io/idle-restaurants/', rating: 4.3, plays: 250000 },
    { id: 'flip-bottle', title: 'Flip Bottle', description: 'Can you master the bottle flip challenge?', category: 'arcade', tags: ['popular'], thumbnail: '/images/flip-bottle.png', embedUrl: 'https://unblockedgames66.gitlab.io/flip-bottle/', rating: 4.1, plays: 600000 },
    { id: 'baldis-basics', title: 'Baldi\'s Basics', description: 'A surreal horror educational game. Collect 7 notebooks and escape!', category: 'adventure', tags: ['popular', 'action'], thumbnail: '/images/baldis-basics.png', embedUrl: 'https://unblockedgames66.gitlab.io/baldis-basics/', rating: 4.6, plays: 1800000 },
    { id: 'granny', title: 'Granny', description: 'Escape the house before Granny catches you!', category: 'adventure', tags: ['popular', 'action'], thumbnail: '/images/granny.png', embedUrl: 'https://unblockedgames66.gitlab.io/granny/', rating: 4.7, plays: 2100000 },
    { id: 'happy-wheels', title: 'Happy Wheels', description: 'A ragdoll physics-based platformer. Dodge deadly obstacles!', category: 'action', tags: ['popular'], thumbnail: '/images/happy-wheels.png', embedUrl: 'https://unblockedgames66.gitlab.io/happy-wheels/', rating: 4.8, plays: 4500000 },
    { id: 'sausage-flip', title: 'Sausage Flip', description: 'Fling the sausage to the finish line in this weirdly fun physics game.', category: 'arcade', tags: [], thumbnail: '/images/sausage-flip.png', embedUrl: 'https://unblockedgames66.gitlab.io/sausage-flip/', rating: 4.3, plays: 200000 },
    { id: 'slope-2-players', title: 'Slope 2 Players', description: 'Roll down the endless slope and compete with a friend!', category: 'arcade', tags: ['popular'], thumbnail: '/images/slope-2-players.png', embedUrl: 'https://unblockedgames66.gitlab.io/slope-2-players/', rating: 4.5, plays: 1500000 },
    { id: 'stack-bump-3d', title: 'Stack Bump 3D', description: 'Smash through the helix platforms and reach the bottom.', category: 'arcade', tags: [], thumbnail: '/images/stack-bump-3d.png', embedUrl: 'https://unblockedgames66.gitlab.io/stack-bump-3d/', rating: 4.2, plays: 400000 },
    { id: 'snake-io', title: 'Snake.io', description: 'Slither your way to the top in this competitive multiplayer snake game.', category: 'io', tags: ['popular'], thumbnail: '/images/snake-io.png', embedUrl: 'https://unblockedgames66.gitlab.io/snake-io/', rating: 4.6, plays: 2800000 },
    { id: 'smash-karts-io', title: 'Smash Karts', description: 'Multiplayer kart battle arena! Collect weapons and blow up your opponents.', category: 'io', tags: ['popular', 'action', 'driving'], thumbnail: '/images/smash-karts-io.png', embedUrl: 'https://unblockedgames66.gitlab.io/smash-karts-io/', rating: 4.8, plays: 1700000 },
    { id: 'getaway-shootout', title: 'Getaway Shootout', description: 'Race to the getaway vehicle while jumping and shooting your rivals.', category: 'action', tags: ['popular'], thumbnail: '/images/getaway-shootout.png', embedUrl: 'https://unblockedgames66.gitlab.io/getaway-shootout/', rating: 4.7, plays: 850000 },
    { id: 'drift-boss', title: 'Drift Boss', description: 'Timing is everything! Drift around tight corners to survive.', category: 'driving', tags: ['popular'], thumbnail: '/images/drift-boss.png', embedUrl: 'https://unblockedgames66.gitlab.io/drift-boss/', rating: 4.4, plays: 900000 },
    { id: 'johny-revenge', title: 'Johnny Revenge', description: 'Flip, shoot, and take down the bad guys in slow motion.', category: 'shooting', tags: ['action'], thumbnail: '/images/johny-revenge.png', embedUrl: 'https://unblockedgames66.gitlab.io/johny-revenge/', rating: 4.5, plays: 300000 },
    { id: 'johny-trigger', title: 'Johnny Trigger', description: 'More slow-motion shooting action as you clear out rooms of enemies.', category: 'shooting', tags: ['action', 'popular'], thumbnail: '/images/johny-trigger.png', embedUrl: 'https://unblockedgames66.gitlab.io/johny-trigger/', rating: 4.6, plays: 1100000 },
    { id: 'stickman-hook', title: 'Stickman Hook', description: 'Swing like Spider-Man through hundreds of challenging levels.', category: 'action', tags: ['popular'], thumbnail: '/images/stickman-hook.png', embedUrl: 'https://unblockedgames66.gitlab.io/stickman-hook/', rating: 4.8, plays: 3200000 },
    { id: 'getting-over-it', title: 'Getting Over It', description: 'A punishing climbing game. Can you reach the top without losing your mind?', category: 'adventure', tags: ['popular', 'action'], thumbnail: '/images/getting-over-it.png', embedUrl: 'https://unblockedgames66.gitlab.io/getting-over-it/', rating: 4.7, plays: 5000000 },
    { id: 'bloxd-io', title: 'Bloxd.io', description: 'A adventure game.', category: 'adventure', tags: ['popular', 'action'], thumbnail: '', embedUrl: 'https://bloxd.io', rating: 4.7, plays: 5000000 },
    { id: 'dice-is-the-way', title: 'Dice is the Way', description: 'A brilliant dice and card based strategy game. Support the developer at the original link!', category: 'strategy', tags: ['new'], thumbnail: '/images/dice.png', embedUrl: 'https://html-classic.itch.zone/html/6173481/DiceIsTheWay/index.html?v=1732313700', developerLink: 'https://cx10.itch.io/dice-is-the-way', rating: 4.5, plays: 12000 },
    { id: 'legion-breaker', title: 'Legion Breaker', description: 'Break through the skeleton legion in this intense pixel art action game. Support the dev!', category: 'action', tags: ['new'], thumbnail: '/images/legion-breaker.png', embedUrl: 'https://html-classic.itch.zone/html/17464640/index.html?v=1778237816', developerLink: 'https://baffledengineer.itch.io/legion-breaker', rating: 4.6, plays: 8500 },
    { id: 'potion-master', title: 'Potion Master', description: 'Brew potions and discover new recipes in this charming pixelated simulation game.', category: 'simulation', tags: ['new'], thumbnail: '/images/potion-master.png', embedUrl: 'https://html-classic.itch.zone/html/16110070/index.html', developerLink: 'https://ome6a1717.itch.io/potion-master', rating: 4.8, plays: 15000 },
    { id: 'farm-cook', title: 'Farm & Cook', description: 'Grow your crops and cook delicious meals in this relaxing farming simulator.', category: 'simulation', tags: ['new'], thumbnail: '/images/farm-cook.png', embedUrl: 'https://html-classic.itch.zone/html/13198934/Farm%20%26%20Cook%20Web/index.html', developerLink: 'https://rob-demo.itch.io/farm-cook', rating: 4.4, plays: 5000 },
    { id: 'living-for-plants', title: 'Living for Plants', description: 'A relaxing game about taking care of plants. Support the developer!', category: 'simulation', tags: ['new'], thumbnail: '/images/living-for-plants.png', embedUrl: 'https://html.itch.zone/html/8888374/index_1.0.2/index.html?v=1732313619', developerLink: 'https://shawcat.itch.io/living-for-plants', rating: 4.5, plays: 15000 },
    { id: 'dungeon-deck', title: 'Dungeon Deck', description: 'A roguelike deckbuilding game. Support the developer!', category: 'strategy', tags: ['new'], thumbnail: '/images/dungeon-deck.png', embedUrl: 'https://html-classic.itch.zone/html/15850529/index.html', developerLink: 'https://incinious.itch.io/dungeon-deck', rating: 4.6, plays: 12000 },
    { id: 'dndg', title: 'DNDG', description: 'A dungeon crawling adventure. Support the developer!', category: 'adventure', tags: ['new'], thumbnail: '/images/dungeons-and-degenerate-gamblers.png', embedUrl: 'https://html-classic.itch.zone/html/15020933/index.html', developerLink: 'https://purplemosscollectors.itch.io/dndg', rating: 4.4, plays: 8000 },
    { id: 'kraft-slash', title: 'Kraft & Slash', description: 'Action packed crafting and slashing. Support the developer!', category: 'action', tags: ['new'], thumbnail: '/images/kraft-slash.png', embedUrl: 'https://html-classic.itch.zone/html/14904819/index.html', developerLink: 'https://purejamgames.itch.io/kraft-slash', rating: 4.7, plays: 20000 },
    { id: 'gladihoppers', title: 'Gladihoppers', description: 'Gladiator combat game with physics. Support the developer!', category: 'action', tags: ['popular'], thumbnail: '/images/gladiahppers.png', embedUrl: 'https://itch.io/embed/238179', developerLink: 'https://dreamonstudios.itch.io/gladihoppers', rating: 4.8, plays: 50000 },
    { id: 'scale-the-depths', title: 'Scale the Depths', description: 'An atmospheric underwater platformer. Support the developer!', category: 'adventure', tags: ['new'], thumbnail: '/images/scale-the-depths.png', embedUrl: 'https://html-classic.itch.zone/html/11252461/index.html?v=1732313552', developerLink: 'https://serpexnessie.itch.io/scale-the-depths', rating: 4.5, plays: 10000 },
    { id: 'wbwwb', title: 'We Become What We Behold', description: 'A game about news cycles, vicious cycles, infinite cycles. Support the developer!', category: 'simulation', tags: ['popular'], thumbnail: '/images/wdwwb.png', embedUrl: 'https://html-classic.itch.zone/html/300364/index.html?v=1542781840', developerLink: 'https://ncase.itch.io/wbwwb', rating: 4.9, plays: 100000 },
    { id: 'sort-the-court', title: 'Sort the Court!', description: 'Make decisions as a king to build your kingdom. Support the developer!', category: 'simulation', tags: ['popular'], thumbnail: '/images/sort-the-court.png', embedUrl: 'https://html-classic.itch.zone/html/347310/index.html?v=1542780889', developerLink: 'https://graebor.itch.io/sort-the-court', rating: 4.8, plays: 80000 },
    { id: 'lumbot-legacy', title: 'Lumbot Legacy', description: 'A sci-fi action platformer. Support the developer!', category: 'action', tags: ['new'], thumbnail: '/images/lumbot-legacy.png', embedUrl: 'https://html-classic.itch.zone/html/12239092/index.html', developerLink: 'https://silenceman.itch.io/lumbot-legacy', rating: 4.3, plays: 5000 },
    { id: 'polytrack', title: 'Polytrack', description: 'Trackmania-style low poly racing game. Support the developer!', category: 'driving', tags: ['popular'], thumbnail: '/images/poly-track.png', embedUrl: 'https://html-classic.itch.zone/html/17690473/index.html?v=1779794745', developerLink: 'https://kodub.itch.io/polytrack', rating: 4.7, plays: 40000 },
    { id: 'retro-racing-dd', title: 'Retro Racing DD', description: 'Top down retro racing game. Support the developer!', category: 'driving', tags: ['new'], thumbnail: '/images/retro-racing-double-dash.png', embedUrl: 'https://html-classic.itch.zone/html/11465763/index.html', developerLink: 'https://richo.itch.io/retro-racing-dd', rating: 4.4, plays: 12000 },
    { id: 'hardware-tycoon', title: 'Hardware Tycoon', description: 'Manage your own hardware company. Support the developer!', category: 'simulation', tags: ['new'], thumbnail: '/images/hardware-tycoon.png', embedUrl: 'https://html-classic.itch.zone/html/5114557/index.html?v=1732313731', developerLink: 'https://haxor1337.itch.io/hardware-tycoon', rating: 4.6, plays: 25000 },
    { id: 'soccer-physics', title: 'Soccer Physics', description: 'Hilarious one-button soccer game. Support the developer!', category: 'sports', tags: ['popular'], thumbnail: '/images/soccer-physics.png', embedUrl: 'https://html-classic.itch.zone/html/9244452/index.html?v=1732313608', developerLink: 'https://ottoojala.itch.io/soccer-physics', rating: 4.7, plays: 60000 },
    { id: 'sosand', title: 'SOSand', description: 'Action survival game. Support the developer!', category: 'action', tags: ['new'], thumbnail: '/images/spirits-of-steel.png', embedUrl: 'https://itch.io/embed/3043599', developerLink: 'https://gavgrub.itch.io/sosand', rating: 4.3, plays: 7000 },
    { id: 'trees-hate-you', title: 'Trees Hate You', description: 'A fun game where the environment fights back! Support the developer!', category: 'action', tags: ['new'], thumbnail: '/images/trees-hate-you.png', embedUrl: 'https://html-classic.itch.zone/html/14007573-1629712/index.html?v=1776846988', developerLink: 'https://tykenn.itch.io/trees-hate-you', rating: 4.5, plays: 10000 },
    { id: 'outhold', title: 'Outhold', description: 'A short, minimalistic incremental game with tower defense mechanics.', category: 'strategy', tags: ['new'], thumbnail: '/images/outhold.png', embedUrl: 'https://html-classic.itch.zone/html/13820450-1489126/index.html', developerLink: 'https://tellusgames.itch.io/outhold', rating: 4.7, plays: 7000 },
    { id: 'tiny-trenches', title: 'Tiny Trenches', description: 'WW1 Side Scrolling Battle Sandbox!', category: 'action', tags: ['new'], thumbnail: '/images/tiny-trenches.png', embedUrl: 'https://dubiousrooster.itch.io/tiny-trenches', developerLink: 'https://dubiousrooster.itch.io/tiny-trenches', rating: 4.3, plays: 13000 },
    { id: 'randomancer', title: 'Randomancer', description: 'A dice-rolling action-lane-defense game where your dice are your units!', category: 'strategy', tags: ['new'], thumbnail: '/images/randomancer.png', embedUrl: 'https://riuku.itch.io/randomancer', developerLink: 'https://riuku.itch.io/randomancer', rating: 4.1, plays: 11000 },
    { id: 'saxon-kings', title: 'Saxon Kings', description: 'Medieval risk and diplomacy', category: 'strategy', tags: ['new'], thumbnail: '/images/saxon-kings.png', embedUrl: 'https://ben.itch.io/saxon-kings', developerLink: 'https://ben.itch.io/saxon-kings', rating: 4.1, plays: 11000 },
    { id: 'klifur', title: 'Klifur', description: 'Indoor climbing puzzle game', category: 'puzzle', tags: ['new'], thumbnail: '/images/klifur.png', embedUrl: 'https://torfi.itch.io/klifur', developerLink: 'https://torfi.itch.io/klifur', rating: 4.6, plays: 6000 },
    { id: 'hungry-lamu', title: 'Hungry Lamu', description: 'Help Lamu find food for that big stomach!', category: 'action', tags: ['new'], thumbnail: '/images/hungry-lamu.png', embedUrl: 'https://kulurc.itch.io/hungry-lamu', developerLink: 'https://kulurc.itch.io/hungry-lamu', rating: 4.1, plays: 11000 },
    { id: 'green-new-deal-simulator', title: 'Green New Deal Simulator', description: 'Achieve zero emissions before it’s too late!', category: 'simulation', tags: ['new'], thumbnail: '/images/green-new-deal-simulator.png', embedUrl: 'https://molleindustria.itch.io/green-new-deal-simulator', developerLink: 'https://molleindustria.itch.io/green-new-deal-simulator', rating: 4.4, plays: 24000 },
    { id: 'dungeonsweeper', title: 'DungeonSweeper', description: 'A minesweeper rogue-like. Can you survive the dungeon?', category: 'puzzle', tags: ['new'], thumbnail: '/images/dungeonsweeper.png', embedUrl: 'https://html-classic.itch.zone/html/17493119/index.html', developerLink: 'https://cnava.itch.io/dungeonsweeper', rating: 4.4, plays: 14000 },
    { id: 'rat-king', title: 'Rat King', description: 'a broughlike about a rat and a rat', category: 'action', tags: ['new'], thumbnail: '/images/rat-king.png', embedUrl: 'https://html-classic.itch.zone/html/14948709/index.html', developerLink: 'https://torcado.itch.io/rat-king', rating: 4.8, plays: 8000 },
    { id: 'solar-sandbox', title: 'Solar Sandbox', description: 'Physics Sandbox Simulation', category: 'simulation', tags: ['new'], thumbnail: '/images/solar-sandbox.png', embedUrl: 'https://totoriel.itch.io/solarsandbox', developerLink: 'https://totoriel.itch.io/solarsandbox', rating: 4.3, plays: 13000 },
    { id: 'lucky-dig', title: 'Lucky Dig', description: 'Dig - Sell - Upgrade', category: 'action', tags: ['new'], thumbnail: '/images/lucky-dig.png', embedUrl: 'https://html-classic.itch.zone/html/13694006/_dig_game_html/index.html', developerLink: 'https://jetamp.itch.io/lucky-dig', rating: 4.9, plays: 9000 },
    { id: 'plinko-idle', title: 'Plinko Idle', description: 'Drop balls. Make money. Number go up. Happy.', category: 'simulation', tags: ['new'], thumbnail: '/images/plinko-idle.png', embedUrl: 'https://aboxwithinabox.itch.io/plinko-idle', developerLink: 'https://aboxwithinabox.itch.io/plinko-idle', rating: 4.1, plays: 11000 },
    { id: 'snow-rider-3d', title: 'Snow Rider 3D', description: 'Ride your snow sled through icy slopes and endless obstacles.', category: 'sports', tags: ['new'], thumbnail: '/images/snow-rider-3d.png', embedUrl: 'https://snowrider.com/game/', developerLink: 'https://snowrider.com/game/', rating: 4.3, plays: 13000 }
];
exports.games.forEach(g => {
    if (!g.thumbnail) {
        g.thumbnail = makeThumbnail(g.title, g.category);
    }
});
function getAllGames() {
    return exports.games;
}
function getGameById(id) {
    return exports.games.find(g => g.id === id);
}
function getGamesByCategory(categoryId) {
    return exports.games.filter(g => g.category === categoryId);
}
function getFeaturedGames() {
    return exports.games.filter(g => g.tags.includes('featured'));
}
function getPopularGames() {
    return exports.games.filter(g => g.tags.includes('popular'));
}
function getNewGames() {
    return exports.games.filter(g => g.tags.includes('new'));
}
function getTrendingGames() {
    return [...exports.games].sort((a, b) => (b.plays * b.rating) - (a.plays * a.rating));
}
function getUpAndComingGames() {
    return exports.games.filter(g => g.tags.includes('new')).sort((a, b) => b.rating - a.rating);
}
function getMostVisitedGames() {
    return [...exports.games].sort((a, b) => b.plays - a.plays);
}
function getRecommendedGames() {
    return exports.games.filter(g => g.rating >= 4.5).sort((a, b) => {
        if (b.rating === a.rating)
            return b.plays - a.plays;
        return b.rating - a.rating;
    });
}
function searchGames(query) {
    const q = query.toLowerCase().trim();
    if (!q)
        return [];
    return exports.games.filter(g => g.title.toLowerCase().includes(q) ||
        g.description.toLowerCase().includes(q) ||
        g.category.toLowerCase().includes(q) ||
        g.tags.some(t => t.toLowerCase().includes(q)));
}
function getRelatedGames(gameId, limit = 6) {
    const game = getGameById(gameId);
    if (!game)
        return [];
    return exports.games
        .filter(g => g.id !== gameId && g.category === game.category)
        .slice(0, limit);
}
function getCategoryById(id) {
    return exports.categories.find(c => c.id === id);
}
function getGameCountByCategory(categoryId) {
    return exports.games.filter(g => g.category === categoryId).length;
}
function formatPlays(plays) {
    if (plays >= 1000000)
        return `${(plays / 1000000).toFixed(1)}M`;
    if (plays >= 1000)
        return `${(plays / 1000).toFixed(0)}K`;
    return plays.toString();
}
