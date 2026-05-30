export interface Category {
  id: string;
  name: string;
  icon: string;
}

export interface Game {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  thumbnail: string;
  embedUrl: string;
  rating: number;
  plays: number;
  discordUrl?: string;
  originalUrl?: string;
  developerLink?: string;
  developerName?: string;
  steamUrl?: string;
  downloadUrl?: string;
}

export interface Submission {
  id: string;
  title: string;
  description: string;
  category: string;
  thumbnail: string;
  embedUrl: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  plays: number;
  rating: number;
  tags: string[];
  discordUrl?: string;
  originalUrl?: string;
  developerLink?: string;
  developerName?: string;
  steamUrl?: string;
}

export const categories: Category[] = [
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


const categoryColors: Record<string, { bg: string; fg: string }> = {
  action:     { bg: 'DC2626', fg: 'FECACA' },
  adventure:  { bg: '7C3AED', fg: 'DDD6FE' },
  arcade:     { bg: '2563EB', fg: 'BFDBFE' },
  board:      { bg: '92400E', fg: 'FDE68A' },
  card:       { bg: '065F46', fg: 'A7F3D0' },
  clicker:    { bg: 'DB2777', fg: 'FBCFE8' },
  driving:    { bg: 'EA580C', fg: 'FED7AA' },
  io:         { bg: '0891B2', fg: 'CFFAFE' },
  puzzle:     { bg: '4F46E5', fg: 'C7D2FE' },
  shooting:   { bg: '991B1B', fg: 'FECACA' },
  simulation: { bg: '15803D', fg: 'BBF7D0' },
  sports:     { bg: '1D4ED8', fg: 'BFDBFE' },
  strategy:   { bg: '6D28D9', fg: 'DDD6FE' },
};

function makeThumbnail(title: string, category: string): string {
  const colors = categoryColors[category] || { bg: '1A1B28', fg: 'A78BFA' };
  return `https://placehold.co/400x225/${colors.bg}/${colors.fg}?text=${encodeURIComponent(title)}&font=raleway`;
}

const EMBED_BASE = '/placeholder.html';

function makeEmbed(seed: string): string {
  return `${EMBED_BASE}?seed=${seed}`;
}




export const games: Game[] = [
  { id: 'house-of-hazards', title: 'House of Hazards', description: 'Try to survive the House of Hazards! Watch out for traps set by your friends in this hilarious party game.', category: 'action', tags: ['new', 'popular'], thumbnail: '/images/house-of-hazards.png', embedUrl: 'https://unblockedgames66.gitlab.io/house-of-hazards/', rating: 4.8, plays: 450000 },
  { id: 'basket-random', title: 'Basket Random', description: 'A fun, chaotic, and completely random physics-based basketball game!', category: 'sports', tags: ['new', 'popular'], thumbnail: '/images/basket-random.png', embedUrl: 'https://unblockedgames66.gitlab.io/basket-random/', rating: 4.6, plays: 320000 },
  { id: 'boxing-random', title: 'Boxing Random', description: 'A fun, chaotic, and completely random physics-based boxing game.', category: 'sports', tags: ['new', 'popular', 'action'], thumbnail: '/images/boxing-random.png', embedUrl: 'https://unblockedgames66.gitlab.io/boxing-random/', rating: 4.4, plays: 250000 },
  { id: 'basketball-legends', title: 'Basketball Legends', description: 'A fun, chaotic, and completely random physics-based basketball game.', category: 'sports', tags: ['new', 'popular', 'action'], thumbnail: '/images/basketball-legends.png', embedUrl: 'https://unblockedgames66.gitlab.io/basketball-legends/', rating: 4.4, plays: 250000 },
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
  { id: 'bloxd-io', title: 'Bloxd.io', description: 'A adventure game.', category: 'adventure', tags: ['popular', 'action'], thumbnail: '/images/bloxd-io.png', embedUrl: 'https://bloxd.io', rating: 4.7, plays: 5000000 },
  { id: 'dice-is-the-way', title: 'Dice is the Way', description: 'A brilliant dice and card based strategy game. Support the developer at the original link!', category: 'strategy', tags: ['new'], thumbnail: '/images/dice.png', embedUrl: 'https://html-classic.itch.zone/html/6173481/DiceIsTheWay/index.html?v=1732313700', developerLink: 'https://cx10.itch.io/dice-is-the-way', rating: 4.5, plays: 12000 },
  { id: 'legion-breaker', title: 'Legion Breaker', description: 'Break through the skeleton legion in this intense pixel art action game. Support the dev!', category: 'action', tags: ['new'], thumbnail: '/images/legion-breaker.png', embedUrl: 'https://html-classic.itch.zone/html/17464640/index.html?v=1778237816', developerLink: 'https://baffledengineer.itch.io/legion-breaker', rating: 4.6, plays: 8500 },
  { id: 'potion-master', title: 'Potion Master', description: 'Brew potions and discover new recipes in this charming pixelated simulation game.', category: 'simulation', tags: ['new'], thumbnail: '/images/potion-master.png', embedUrl: 'https://html-classic.itch.zone/html/16110070/index.html', developerLink: 'https://ome6a1717.itch.io/potion-master', rating: 4.8, plays: 15000 },
  { id: 'farm-cook', title: 'Farm & Cook', description: 'Grow your crops and cook delicious meals in this relaxing farming simulator.', category: 'simulation', tags: ['new'], thumbnail: '/images/farm-cook.png', embedUrl: 'https://html-classic.itch.zone/html/13198934/Farm%20%26%20Cook%20Web/index.html', developerLink: 'https://rob-demo.itch.io/farm-cook', rating: 4.4, plays: 5000 },
  { id: 'living-for-plants', title: 'Living for Plants', description: 'A relaxing game about taking care of plants. Support the developer!', category: 'simulation', tags: ['new'], thumbnail: '/images/living-for-plants.png', embedUrl: 'https://html.itch.zone/html/8888374/index_1.0.2/index.html?v=1732313619', developerLink: 'https://shawcat.itch.io/living-for-plants', rating: 4.5, plays: 15000 },
  { id: 'dungeon-deck', title: 'Dungeon Deck', description: 'A roguelike deckbuilding game. Support the developer!', category: 'strategy', tags: ['new'], thumbnail: '/images/dungeon-deck.png', embedUrl: 'https://html-classic.itch.zone/html/15850529/index.html', developerLink: 'https://incinious.itch.io/dungeon-deck', rating: 4.6, plays: 12000 },
  { id: 'dndg', title: 'DNDG', description: 'A dungeon crawling adventure. Support the developer!', category: 'adventure', tags: ['new'], thumbnail: '/images/dungeons-and-degenerate-gamblers.png', embedUrl: 'https://html-classic.itch.zone/html/15020933/index.html', developerLink: 'https://purplemosscollectors.itch.io/dndg', rating: 4.4, plays: 8000 },
  { id: 'kraft-slash', title: 'Kraft & Slash', description: 'Action packed crafting and slashing. Support the developer!', category: 'action', tags: ['new'], thumbnail: '/images/kraft-slash.png', embedUrl: 'https://html-classic.itch.zone/html/14904819/index.html', developerLink: 'https://purejamgames.itch.io/kraft-slash', rating: 4.7, plays: 20000 },
  { id: 'gladihoppers', title: 'Gladihoppers', description: 'Gladiator combat game with physics. Support the developer!', category: 'action', tags: ['popular'], thumbnail: '/images/gladiahppers.png', embedUrl: 'https://itch.io/embed/238179', developerLink: 'https://dreamonstudios.itch.io/gladihoppers', rating: 4.8, plays: 50000, downloadUrl: '/images/games/Gladihoppers_Win64_v_3_0_1.zip' },
  { id: 'scale-the-depths', title: 'Scale the Depths', description: 'An atmospheric underwater platformer. Support the developer!', category: 'adventure', tags: ['new'], thumbnail: '/images/scale-the-depths.png', embedUrl: 'https://html-classic.itch.zone/html/11252461/index.html?v=1732313552', developerLink: 'https://serpexnessie.itch.io/scale-the-depths', rating: 4.5, plays: 10000 },
  { id: 'wbwwb', title: 'We Become What We Behold', description: 'A game about news cycles, vicious cycles, infinite cycles. Support the developer!', category: 'simulation', tags: ['popular'], thumbnail: '/images/wdwwb.png', embedUrl: 'https://html-classic.itch.zone/html/300364/index.html?v=1542781840', developerLink: 'https://ncase.itch.io/wbwwb', rating: 4.9, plays: 100000 },
  { id: 'sort-the-court', title: 'Sort the Court!', description: 'Make decisions as a king to build your kingdom. Support the developer!', category: 'simulation', tags: ['popular'], thumbnail: '/images/sort-the-court.png', embedUrl: 'https://html-classic.itch.zone/html/347310/index.html?v=1542780889', developerLink: 'https://graebor.itch.io/sort-the-court', rating: 4.8, plays: 80000 },
  { id: 'lumbot-legacy', title: 'Lumbot Legacy', description: 'A sci-fi action platformer. Support the developer!', category: 'action', tags: ['new'], thumbnail: '/images/lumbot-legacy.png', embedUrl: 'https://html-classic.itch.zone/html/12239092/index.html', developerLink: 'https://silenceman.itch.io/lumbot-legacy', rating: 4.3, plays: 5000 },
  { id: 'polytrack', title: 'Polytrack', description: 'Trackmania-style low poly racing game. Support the developer!', category: 'driving', tags: ['popular'], thumbnail: '/images/poly-track.png', embedUrl: 'https://html-classic.itch.zone/html/17690473/index.html?v=1779794745', developerLink: 'https://kodub.itch.io/polytrack', rating: 4.7, plays: 40000 },
  { id: 'retro-racing-dd', title: 'Retro Racing DD', description: 'Top down retro racing game. Support the developer!', category: 'driving', tags: ['new'], thumbnail: '/images/retro-racing-double-dash.png', embedUrl: 'https://html-classic.itch.zone/html/11465763/index.html', developerLink: 'https://richo.itch.io/retro-racing-dd', rating: 4.4, plays: 12000 },
  { id: 'hardware-tycoon', title: 'Hardware Tycoon', description: 'Manage your own hardware company. Support the developer!', category: 'simulation', tags: ['new'], thumbnail: '/images/hardware-tycoon.png', embedUrl: 'https://html-classic.itch.zone/html/5114557/index.html?v=1732313731', developerLink: 'https://haxor1337.itch.io/hardware-tycoon', rating: 4.6, plays: 25000 },
  { id: 'soccer-physics', title: 'Soccer Physics', description: 'Hilarious one-button soccer game. Support the developer!', category: 'sports', tags: ['popular'], thumbnail: '/images/soccer-physics.png', embedUrl: 'https://html-classic.itch.zone/html/9244452/index.html?v=1732313608', developerLink: 'https://ottoojala.itch.io/soccer-physics', rating: 4.7, plays: 60000 },
  { id: 'sosand', title: 'SOSand', description: 'Action survival game. Support the developer!', category: 'action', tags: ['new'], thumbnail: '/images/spirits-of-steel.png', embedUrl: 'https://itch.io/embed/3043599', developerLink: 'https://gavgrub.itch.io/sosand', rating: 4.3, plays: 7000, downloadUrl: '/images/games/sosandwin.zip' },
  { id: 'trees-hate-you', title: 'Trees Hate You', description: 'A fun game where the environment fights back! Support the developer!', category: 'action', tags: ['new'], thumbnail: '/images/trees-hate-you.png', embedUrl: 'https://html-classic.itch.zone/html/14007573-1629712/index.html?v=1776846988', developerLink: 'https://tykenn.itch.io/trees-hate-you', rating: 4.5, plays: 10000 },
  { id: 'outhold', title: 'Outhold', description: 'A short, minimalistic incremental game with tower defense mechanics.', category: 'strategy', tags: ['new'], thumbnail: '/images/outhold.png', embedUrl: 'https://html-classic.itch.zone/html/13820450-1489126/index.html', developerLink: 'https://tellusgames.itch.io/outhold', rating: 4.7, plays: 7000 },
  { id: 'tiny-trenches', title: 'Tiny Trenches', description: 'WW1 Side Scrolling Battle Sandbox!', category: 'action', tags: ['new'], thumbnail: '/images/tiny-trenches.png', embedUrl: 'https://html-classic.itch.zone/html/13792690/index.html', developerLink: 'https://dubiousrooster.itch.io/tiny-trenches', rating: 4.3, plays: 13000 },
  { id: 'randomancer', title: 'Randomancer', description: 'A dice-rolling action-lane-defense game where your dice are your units!', category: 'strategy', tags: ['new'], thumbnail: '/images/randomancer.png', embedUrl: 'https://html-classic.itch.zone/html/10898051/index.html?v=1732313561', developerLink: 'https://riuku.itch.io/randomancer', rating: 4.1, plays: 11000 },
  { id: 'saxon-kings', title: 'Saxon Kings', description: 'Medieval risk and diplomacy', category: 'strategy', tags: ['new'], thumbnail: '/images/saxon-kings.png', embedUrl: 'https://html-classic.itch.zone/html/7410410/index.html?v=1732313659', developerLink: 'https://ben.itch.io/saxon-kings', rating: 4.1, plays: 11000 },
  { id: 'klifur', title: 'Klifur', description: 'Indoor climbing puzzle game', category: 'puzzle', tags: ['new'], thumbnail: '/images/klifur.png', embedUrl: 'https://html-classic.itch.zone/html/17614747/index.html?v=1779303164', developerLink: 'https://torfi.itch.io/klifur', rating: 4.6, plays: 6000 },
  { id: 'hungry-lamu', title: 'Hungry Lamu', description: 'Help Lamu find food for that big stomach!', category: 'action', tags: ['new'], thumbnail: '/images/hungry-lamu.png', embedUrl: 'https://html-classic.itch.zone/html/6469466/WebGL/index.html?v=1732313691', developerLink: 'https://kulurc.itch.io/hungry-lamu', rating: 4.1, plays: 11000 },
  { id: 'green-new-deal-simulator', title: 'Green New Deal Simulator', description: 'Achieve zero emissions before it’s too late!', category: 'simulation', tags: ['new'], thumbnail: '/images/green-new-deal-simulator.png', embedUrl: 'https://html-classic.itch.zone/html/10052011/index.html?v=1732313584', developerLink: 'https://molleindustria.itch.io/green-new-deal-simulator', rating: 4.4, plays: 24000 },
  { id: 'dungeonsweeper', title: 'DungeonSweeper', description: 'A minesweeper rogue-like. Can you survive the dungeon?', category: 'puzzle', tags: ['new'], thumbnail: '/images/dungeon-sweeper.png', embedUrl: 'https://html-classic.itch.zone/html/17493119/index.html', developerLink: 'https://cnava.itch.io/dungeonsweeper', rating: 4.4, plays: 14000 },
  { id: 'rat-king', title: 'Rat King', description: 'a broughlike about a rat and a rat', category: 'puzzle', tags: ['new'], thumbnail: '/images/rat-king.png', embedUrl: 'https://html-classic.itch.zone/html/14948709/index.html', developerLink: 'https://torcado.itch.io/rat-king', rating: 4.8, plays: 8000 },
  { id: 'solar-sandbox', title: 'Solar Sandbox', description: 'Physics Sandbox Simulation', category: 'simulation', tags: ['new'], thumbnail: '/images/solar-sandbox.png', embedUrl: 'https://totoriel.itch.io/solarsandbox', developerLink: 'https://totoriel.itch.io/solarsandbox', rating: 4.3, plays: 13000 },
  { id: 'lucky-dig', title: 'Lucky Dig', description: 'Dig - Sell - Upgrade', category: 'clicker', tags: ['new'], thumbnail: '/images/lucky-dig.png', embedUrl: 'https://html-classic.itch.zone/html/13694006/_dig_game_html/index.html', developerLink: 'https://jetamp.itch.io/lucky-dig', rating: 4.9, plays: 9000 },
  { id: 'plinko-idle', title: 'Plinko Idle', description: 'Drop balls. Make money. Number go up. Happy.', category: 'simulation', tags: ['new'], thumbnail: '/images/plink-idle.png', embedUrl: 'https://html-classic.itch.zone/html/13923093-1295520/HTML/index.html', developerLink: 'https://aboxwithinabox.itch.io/plinko-idle', rating: 4.1, plays: 11000 },
  { id: 'snow-rider-3d', title: 'Snow Rider 3D', description: 'Ride your snow sled through icy slopes and endless obstacles.', category: 'sports', tags: ['new'], thumbnail: '/images/snow-rider-3d.png', embedUrl: 'https://snowrider.com/game/', developerLink: 'https://snowrider.com/game/', rating: 4.3, plays: 13000 },
  { id: 'pixel-gun-3d', title: 'Pixel Gun 3D', description: 'A fun multiplayer blocky shooter game.', category: 'shooting', tags: ['new', 'popular', 'featured'], thumbnail: '/images/pixel-gun-3d.png', embedUrl: 'https://pixelgun3d.com/', developerLink: 'https://pixelgun3d.com/', rating: 4.8, plays: 45000 },
  {
    id: 'kenney-solitaire',
    title: 'Kenney Solitaire',
    description: 'Play Kenney Solitaire by Kenney on PixelGamez.',
    category: 'arcade',
    tags: ['new'],
    thumbnail: '/images/kenney-solitaire.png',
    embedUrl: 'https://html-classic.itch.zone/html/17727200/index.html?v=1780057972',
    originalUrl: 'https://kenney.itch.io/kenney-solitaire',
    developerLink: 'https://kenney.itch.io',
    developerName: 'Kenney',
    rating: Number((Math.random() * 1.5 + 3.5).toFixed(1)),
    plays: Math.floor(Math.random() * 50000) + 1000
  },
  {
    id: 'smashing-bottles',
    title: 'Smashing Bottles',
    description: 'Play Smashing Bottles by Blue Makes Games on PixelGamez.',
    category: 'arcade',
    tags: ['new'],
    thumbnail: '/images/smashing-bottles.png',
    embedUrl: 'https://html-classic.itch.zone/html/17723034/html/index.html?v=1780019605',
    originalUrl: 'https://blue-makes-games.itch.io/smashing-bottles',
    developerLink: 'https://blue-makes-games.itch.io',
    developerName: 'Blue Makes Games',
    rating: Number((Math.random() * 1.5 + 3.5).toFixed(1)),
    plays: Math.floor(Math.random() * 50000) + 1000
  },
  {
    id: 'minato',
    title: 'Minato',
    description: 'Play Minato by Noshuio on PixelGamez.',
    category: 'arcade',
    tags: ['new'],
    thumbnail: '/images/minato.png',
    embedUrl: 'https://html-classic.itch.zone/html/11102721-1464293/Web/index.html',
    originalUrl: 'https://noshuio.itch.io/minato',
    developerLink: 'https://noshuio.itch.io',
    developerName: 'Noshuio',
    rating: Number((Math.random() * 1.5 + 3.5).toFixed(1)),
    plays: Math.floor(Math.random() * 50000) + 1000
  },
  {
    id: 'my-rusty-submarine',
    title: 'My Rusty Submarine',
    description: 'Play My Rusty Submarine by Soerbgames on PixelGamez.',
    category: 'arcade',
    tags: ['new'],
    thumbnail: '/images/my-rusty-submarine.png',
    embedUrl: 'https://html-classic.itch.zone/html/1972674/MyRustySubmarineWebGL/index.html?v=1583444505',
    originalUrl: 'https://soerbgames.itch.io/my-rusty-submarine',
    developerLink: 'https://soerbgames.itch.io',
    developerName: 'Soerbgames',
    rating: Number((Math.random() * 1.5 + 3.5).toFixed(1)),
    plays: Math.floor(Math.random() * 50000) + 1000
  },
  {
    id: 'get-yoked-2',
    title: 'Get Yoked 2',
    description: 'Play Get Yoked 2 by Gregs Games on PixelGamez.',
    category: 'arcade',
    tags: ['new'],
    thumbnail: '/images/get-yoked-2.png',
    embedUrl: 'https://html-classic.itch.zone/html/15707106/Web/index.html',
    originalUrl: 'https://gregs-games.itch.io/get-yoked-2',
    developerLink: 'https://gregs-games.itch.io',
    developerName: 'Gregs Games',
    rating: Number((Math.random() * 1.5 + 3.5).toFixed(1)),
    plays: Math.floor(Math.random() * 50000) + 1000
  },
  {
    id: 'help-no-brake',
    title: 'Help No Brake',
    description: 'Play Help No Brake by Edgarmendoza on PixelGamez.',
    category: 'arcade',
    tags: ['new'],
    thumbnail: '/images/help-no-brake.png',
    embedUrl: 'https://html-classic.itch.zone/html/6749357/index.html?v=1732313683',
    originalUrl: 'https://edgarmendoza.itch.io/help-no-brake',
    developerLink: 'https://edgarmendoza.itch.io',
    developerName: 'Edgarmendoza',
    rating: Number((Math.random() * 1.5 + 3.5).toFixed(1)),
    plays: Math.floor(Math.random() * 50000) + 1000
  },
  {
    id: 'silhouette-showdown',
    title: 'Silhouette Showdown',
    description: 'Play Silhouette Showdown by Weentermakesgames on PixelGamez.',
    category: 'arcade',
    tags: ['new'],
    thumbnail: '/images/silhouette-showdown.png',
    embedUrl: 'https://html-classic.itch.zone/html/12735707/SilhouetteShowdownHTML_V090/index.html',
    originalUrl: 'https://weentermakesgames.itch.io/silhouette-showdown',
    developerLink: 'https://weentermakesgames.itch.io',
    developerName: 'Weentermakesgames',
    rating: Number((Math.random() * 1.5 + 3.5).toFixed(1)),
    plays: Math.floor(Math.random() * 50000) + 1000
  },
  {
    id: 'blade-bedlam',
    title: 'Blade Bedlam',
    description: 'Play Blade Bedlam by Dpolk on PixelGamez.',
    category: 'arcade',
    tags: ['new'],
    thumbnail: '/images/blade-bedlam.png',
    embedUrl: 'https://html-classic.itch.zone/html/15142925/index.html',
    originalUrl: 'https://dpolk.itch.io/blade-bedlam',
    developerLink: 'https://dpolk.itch.io',
    developerName: 'Dpolk',
    rating: Number((Math.random() * 1.5 + 3.5).toFixed(1)),
    plays: Math.floor(Math.random() * 50000) + 1000
  },
  {
    id: 'stickman-warrior',
    title: 'Stickman Warrior',
    description: 'Play Stickman Warrior by Zeropixel on PixelGamez.',
    category: 'arcade',
    tags: ['new'],
    thumbnail: '/images/stickman-warrior.png',
    embedUrl: 'https://html-classic.itch.zone/html/7375251/index.html',
    originalUrl: 'https://zeropixel.itch.io/stickman-warrior',
    developerLink: 'https://zeropixel.itch.io',
    developerName: 'Zeropixel',
    rating: Number((Math.random() * 1.5 + 3.5).toFixed(1)),
    plays: Math.floor(Math.random() * 50000) + 1000
  },
  {
    id: 'gu-fighters-open-playtest',
    title: 'Gu Fighters Open Playtest',
    description: 'Play Gu Fighters Open Playtest by Instantdevx on PixelGamez.',
    category: 'arcade',
    tags: ['new'],
    thumbnail: '/images/gu-fighters-open-playtest.png',
    embedUrl: 'https://html-classic.itch.zone/html/14133478/GU_Fighters_HTML/index.html',
    originalUrl: 'https://instantdevx.itch.io/gu-fighters-open-playtest',
    developerLink: 'https://instantdevx.itch.io',
    developerName: 'Instantdevx',
    rating: Number((Math.random() * 1.5 + 3.5).toFixed(1)),
    plays: Math.floor(Math.random() * 50000) + 1000
  },
  {
    id: 'screw-it',
    title: 'Screw It',
    description: 'Play Screw It by Martinecko30 on PixelGamez.',
    category: 'arcade',
    tags: ['new'],
    thumbnail: '/images/screw-it.png',
    embedUrl: 'https://html-classic.itch.zone/html/6265893/index.html',
    originalUrl: 'https://martinecko30.itch.io/screw-it',
    developerLink: 'https://martinecko30.itch.io',
    developerName: 'Martinecko30',
    rating: Number((Math.random() * 1.5 + 3.5).toFixed(1)),
    plays: Math.floor(Math.random() * 50000) + 1000
  },
  {
    id: 'die-in-the-dungeon',
    title: 'Die In The Dungeon',
    description: 'Play Die In The Dungeon by Alarts on PixelGamez.',
    category: 'arcade',
    tags: ['new'],
    thumbnail: '/images/die-in-the-dungeon.png',
    embedUrl: 'https://html-classic.itch.zone/html/7330268/Die',
    originalUrl: 'https://alarts.itch.io/die-in-the-dungeon',
    developerLink: 'https://alarts.itch.io',
    developerName: 'Alarts',
    rating: Number((Math.random() * 1.5 + 3.5).toFixed(1)),
    plays: Math.floor(Math.random() * 50000) + 1000
  },
  {
    id: 'roots',
    title: 'Roots',
    description: 'Play Roots by Pierre Vandermaesen on PixelGamez.',
    category: 'arcade',
    tags: ['new'],
    thumbnail: '/images/roots.png',
    embedUrl: 'https://html-classic.itch.zone/html/3873510/index.html?v=1732313766',
    originalUrl: 'https://pierre-vandermaesen.itch.io/roots',
    developerLink: 'https://pierre-vandermaesen.itch.io',
    developerName: 'Pierre Vandermaesen',
    rating: Number((Math.random() * 1.5 + 3.5).toFixed(1)),
    plays: Math.floor(Math.random() * 50000) + 1000
  },
  {
    id: 'big-donut',
    title: 'Big Donut',
    description: 'Play Big Donut by Skinner Space on PixelGamez.',
    category: 'arcade',
    tags: ['new'],
    thumbnail: '/images/big-donut.png',
    embedUrl: 'https://html-classic.itch.zone/html/4118451/index.html?v=1732313759',
    originalUrl: 'https://skinner-space.itch.io/big-donut',
    developerLink: 'https://skinner-space.itch.io',
    developerName: 'Skinner Space',
    rating: Number((Math.random() * 1.5 + 3.5).toFixed(1)),
    plays: Math.floor(Math.random() * 50000) + 1000
  },
  {
    id: 'formula-prototype',
    title: 'Formula Prototype',
    description: 'Play Formula Prototype by Corujatsu on PixelGamez.',
    category: 'arcade',
    tags: ['new'],
    thumbnail: '/images/formula-prototype.png',
    embedUrl: 'https://html-classic.itch.zone/html/17043552/index.html?v=1775250286',
    originalUrl: 'https://corujatsu.itch.io/formula-prototype',
    developerLink: 'https://corujatsu.itch.io',
    developerName: 'Corujatsu',
    rating: Number((Math.random() * 1.5 + 3.5).toFixed(1)),
    plays: Math.floor(Math.random() * 50000) + 1000
  },
  {
    id: 'endless-road-drifter-minibus-edition',
    title: 'Endless Road Drifter Minibus Edition',
    description: 'Play Endless Road Drifter Minibus Edition by Oarcinae on PixelGamez.',
    category: 'arcade',
    tags: ['new'],
    thumbnail: '/images/endless-road-drifter-minibus-edition.png',
    embedUrl: 'https://html-classic.itch.zone/html/9489059/index.html',
    originalUrl: 'https://oarcinae.itch.io/endless-road-drifter-minibus-edition',
    developerLink: 'https://oarcinae.itch.io',
    developerName: 'Oarcinae',
    rating: Number((Math.random() * 1.5 + 3.5).toFixed(1)),
    plays: Math.floor(Math.random() * 50000) + 1000
  },
  {
    id: 'tech-giants',
    title: 'Tech Giants',
    description: 'Play Tech Giants by Rebellium on PixelGamez.',
    category: 'arcade',
    tags: ['new'],
    thumbnail: '/images/tech-giants.png',
    embedUrl: 'https://html-classic.itch.zone/html/11116463/index.html?v=1732313556',
    originalUrl: 'https://rebellium.itch.io/tech-giants',
    developerLink: 'https://rebellium.itch.io',
    developerName: 'Rebellium',
    rating: Number((Math.random() * 1.5 + 3.5).toFixed(1)),
    plays: Math.floor(Math.random() * 50000) + 1000
  },
  {
    id: 'soul-roulette',
    title: 'Soul Roulette',
    description: 'Play Soul Roulette by Vfqd on PixelGamez.',
    category: 'arcade',
    tags: ['new'],
    thumbnail: '/images/soul-roulette.png',
    embedUrl: 'https://html-classic.itch.zone/html/14261962/index.html',
    originalUrl: 'https://vfqd.itch.io/soul-roulette',
    developerLink: 'https://vfqd.itch.io',
    developerName: 'Vfqd',
    rating: Number((Math.random() * 1.5 + 3.5).toFixed(1)),
    plays: Math.floor(Math.random() * 50000) + 1000
  },
  {
    id: 'pokeplunder',
    title: 'Pokeplunder',
    description: 'Play Pokeplunder by Khydra98 on PixelGamez.',
    category: 'arcade',
    tags: ['new'],
    thumbnail: '/images/pokeplunder.png',
    embedUrl: 'https://html-classic.itch.zone/html/16129135/itchio-pp/index.html',
    originalUrl: 'https://khydra98.itch.io/pokeplunder',
    developerLink: 'https://khydra98.itch.io',
    developerName: 'Khydra98',
    rating: Number((Math.random() * 1.5 + 3.5).toFixed(1)),
    plays: Math.floor(Math.random() * 50000) + 1000
  },
  {
    id: 'wildfire',
    title: 'Wildfire',
    description: 'Play Wildfire by Salvadorpalma on PixelGamez.',
    category: 'arcade',
    tags: ['new'],
    thumbnail: '/images/wildfire.png',
    embedUrl: 'https://html-classic.itch.zone/html/9277324/index.html?v=1732313607',
    originalUrl: 'https://salvadorpalma.itch.io/wildfire',
    developerLink: 'https://salvadorpalma.itch.io',
    developerName: 'Salvadorpalma',
    rating: Number((Math.random() * 1.5 + 3.5).toFixed(1)),
    plays: Math.floor(Math.random() * 50000) + 1000
  },
  {
    id: 'chesses',
    title: 'Chesses',
    description: 'Play Chesses by Pippinbarr on PixelGamez.',
    category: 'arcade',
    tags: ['new'],
    thumbnail: '/images/chesses.png',
    embedUrl: 'https://html-classic.itch.zone/html/1587779/chesses/index.html?v=1574335179',
    originalUrl: 'https://pippinbarr.itch.io/chesses',
    developerLink: 'https://pippinbarr.itch.io',
    developerName: 'Pippinbarr',
    rating: Number((Math.random() * 1.5 + 3.5).toFixed(1)),
    plays: Math.floor(Math.random() * 50000) + 1000
  },
  {
    id: 'ahoy',
    title: 'Ahoy',
    description: 'Play Ahoy by Pidibit on PixelGamez.',
    category: 'arcade',
    tags: ['new'],
    thumbnail: '/images/ahoy.png',
    embedUrl: 'https://html-classic.itch.zone/html/1704221/Ahoy_Final/index.html?v=1574334881',
    originalUrl: 'https://pidibit.itch.io/ahoy',
    developerLink: 'https://pidibit.itch.io',
    developerName: 'Pidibit',
    rating: Number((Math.random() * 1.5 + 3.5).toFixed(1)),
    plays: Math.floor(Math.random() * 50000) + 1000
  },
  {
    id: 'crown-siege',
    title: 'Crown Siege',
    description: 'Play Crown Siege by Jorbits on PixelGamez.',
    category: 'arcade',
    tags: ['new'],
    thumbnail: '/images/crown-siege.png',
    embedUrl: 'https://html-classic.itch.zone/html/16483741/web/index.html?v=1771128729',
    originalUrl: 'https://jorbits.itch.io/crown-siege',
    developerLink: 'https://jorbits.itch.io',
    developerName: 'Jorbits',
    rating: Number((Math.random() * 1.5 + 3.5).toFixed(1)),
    plays: Math.floor(Math.random() * 50000) + 1000
  },
  {
    id: 'villager-kings',
    title: 'Villager Kings',
    description: 'Play Villager Kings by Xamer on PixelGamez.',
    category: 'arcade',
    tags: ['new'],
    thumbnail: '/images/villager-kings.png',
    embedUrl: 'https://html-classic.itch.zone/html/7179911/index.html?v=1732313665',
    originalUrl: 'https://xamer.itch.io/villager-kings',
    developerLink: 'https://xamer.itch.io',
    developerName: 'Xamer',
    rating: Number((Math.random() * 1.5 + 3.5).toFixed(1)),
    plays: Math.floor(Math.random() * 50000) + 1000
  },
  {
    id: 'the-mist',
    title: 'The Mist',
    description: 'Play The Mist by Tunapamir on PixelGamez.',
    category: 'arcade',
    tags: ['new'],
    thumbnail: '/images/the-mist.png',
    embedUrl: 'https://html-classic.itch.zone/html/1174169/index.html?v=1574336295',
    originalUrl: 'https://tunapamir.itch.io/the-mist',
    developerLink: 'https://tunapamir.itch.io',
    developerName: 'Tunapamir',
    rating: Number((Math.random() * 1.5 + 3.5).toFixed(1)),
    plays: Math.floor(Math.random() * 50000) + 1000
  },
  {
    id: 'pokerxslots',
    title: 'Pokerxslots',
    description: 'Play Pokerxslots by Valkamo on PixelGamez.',
    category: 'arcade',
    tags: ['new'],
    thumbnail: '/images/pokerxslots.png',
    embedUrl: 'https://html-classic.itch.zone/html/17475277/index.html?v=1778319236',
    originalUrl: 'https://valkamo.itch.io/pokerxslots',
    developerLink: 'https://valkamo.itch.io',
    developerName: 'Valkamo',
    rating: Number((Math.random() * 1.5 + 3.5).toFixed(1)),
    plays: Math.floor(Math.random() * 50000) + 1000
  },
  {
    id: 'burger-stack',
    title: 'Burger Stack',
    description: 'Play Burger Stack by Sebzanardo on PixelGamez.',
    category: 'arcade',
    tags: ['new'],
    thumbnail: '/images/burger-stack.png',
    embedUrl: 'https://html-classic.itch.zone/html/4058459/BURGER',
    originalUrl: 'https://sebzanardo.itch.io/burger-stack',
    developerLink: 'https://sebzanardo.itch.io',
    developerName: 'Sebzanardo',
    rating: Number((Math.random() * 1.5 + 3.5).toFixed(1)),
    plays: Math.floor(Math.random() * 50000) + 1000
  },
  {
    id: 'chemistower',
    title: 'Chemistower',
    description: 'Play Chemistower by Wunoumenal on PixelGamez.',
    category: 'arcade',
    tags: ['new'],
    thumbnail: '/images/chemistower.png',
    embedUrl: 'https://html-classic.itch.zone/html/16756806/ChemistowerDemoFullWebBuild/index.html?v=1773152030',
    originalUrl: 'https://wunoumenal.itch.io/chemistower',
    developerLink: 'https://wunoumenal.itch.io',
    developerName: 'Wunoumenal',
    rating: Number((Math.random() * 1.5 + 3.5).toFixed(1)),
    plays: Math.floor(Math.random() * 50000) + 1000
  },
  {
    id: 'dbts-decisions-behind-the-screen',
    title: 'Dbts Decisions Behind The Screen',
    description: 'Play Dbts Decisions Behind The Screen by Tashi501 on PixelGamez.',
    category: 'arcade',
    tags: ['new'],
    thumbnail: '/images/dbts-decisions-behind-the-screen.png',
    embedUrl: 'https://html-classic.itch.zone/html/17614612/index.html?v=1779304104',
    originalUrl: 'https://tashi501.itch.io/dbts-decisions-behind-the-screen',
    developerLink: 'https://tashi501.itch.io',
    developerName: 'Tashi501',
    rating: Number((Math.random() * 1.5 + 3.5).toFixed(1)),
    plays: Math.floor(Math.random() * 50000) + 1000
  }
];


games.forEach(g => {
  if (!g.thumbnail) {
    g.thumbnail = makeThumbnail(g.title, g.category);
  }
});





export function getAllGames(): Game[] {
  return games;
}

export function getGameById(id: string): Game | undefined {
  return games.find(g => g.id === id);
}

export function getGamesByCategory(categoryId: string): Game[] {
  return games.filter(g => g.category === categoryId);
}

export function getFeaturedGames(): Game[] {
  return games.filter(g => g.tags.includes('featured'));
}

export function getPopularGames(): Game[] {
  return games.filter(g => g.tags.includes('popular'));
}

export function getNewGames(): Game[] {
  return games.filter(g => g.tags.includes('new'));
}

export function getTrendingGames(): Game[] {

  return [...games].sort((a, b) => (b.plays * b.rating) - (a.plays * a.rating));
}

export function getUpAndComingGames(): Game[] {

  return games.filter(g => g.tags.includes('new')).sort((a, b) => b.rating - a.rating);
}

export function getMostVisitedGames(): Game[] {

  return [...games].sort((a, b) => b.plays - a.plays);
}

export function getRecommendedGames(): Game[] {

  return games.filter(g => g.rating >= 4.5).sort((a, b) => {
    if (b.rating === a.rating) return b.plays - a.plays;
    return b.rating - a.rating;
  });
}

export function searchGames(query: string): Game[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  return games.filter(g =>
    g.title.toLowerCase().includes(q) ||
    g.description.toLowerCase().includes(q) ||
    g.category.toLowerCase().includes(q) ||
    g.tags.some(t => t.toLowerCase().includes(q))
  );
}

export function getRelatedGames(gameId: string, limit: number = 6): Game[] {
  const game = getGameById(gameId);
  if (!game) return [];
  return games
    .filter(g => g.id !== gameId && g.category === game.category)
    .slice(0, limit);
}

export function getCategoryById(id: string): Category | undefined {
  return categories.find(c => c.id === id);
}

export function getGameCountByCategory(categoryId: string): number {
  return games.filter(g => g.category === categoryId).length;
}

export function formatPlays(plays: number): string {
  if (plays >= 1000000) return `${(plays / 1000000).toFixed(1)}M`;
  if (plays >= 1000) return `${(plays / 1000).toFixed(0)}K`;
  return plays.toString();
}
