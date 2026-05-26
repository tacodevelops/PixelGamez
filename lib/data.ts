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
  steamUrl?: string;
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
  steamUrl?: string;
}

export const categories: Category[] = [
  { id: 'action', name: 'Action', icon: 'action' },
  { id: 'adventure', name: 'Adventure', icon: 'adventure' },
  { id: 'arcade', name: 'Arcade', icon: 'arcade' },
  { id: 'board', name: 'Board', icon: 'board' },
  { id: 'card', name: 'Card', icon: 'card' },
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
  { id: 'house-of-hazards', title: 'House of Hazards', description: 'Try to survive the House of Hazards! Watch out for traps set by your friends in this hilarious party game.', category: 'action', tags: ['new', 'popular'], thumbnail: '', embedUrl: 'https:
  { id: 'basket-random', title: 'Basket Random', description: 'A fun, chaotic, and completely random physics-based basketball game!', category: 'sports', tags: ['new', 'popular'], thumbnail: '', embedUrl: 'https:
  { id: 'ninja-warrior', title: 'Ninja Warrior', description: 'Become the ultimate ninja! Slash through waves of enemies, dodge deadly traps, and master ancient combat techniques in this fast-paced action game.', category: 'action', tags: ['popular', 'featured'], thumbnail: '', embedUrl: makeEmbed('a10c1b9fc87747a9'), rating: 4.5, plays: 284300 },
  { id: 'zombie-survival', title: 'Zombie Survival', description: 'Survive the zombie apocalypse! Scavenge for weapons, build defenses, and fight off hordes of undead in this intense survival game.', category: 'action', tags: ['new'], thumbnail: '', embedUrl: makeEmbed('6b8c1f5e3d7a49b2'), rating: 4.2, plays: 156700 },
  { id: 'battle-royale', title: 'Battle Royale', description: 'Drop into an ever-shrinking arena and fight to be the last one standing. Loot weapons and outplay your opponents.', category: 'action', tags: ['popular'], thumbnail: '', embedUrl: makeEmbed('c2d4e6f8a0b2c4d6'), rating: 4.7, plays: 512000 },
  { id: 'shadow-blade', title: 'Shadow Blade', description: 'Wield the legendary shadow blade and cut through darkness. Fast-paced combat with devastating combos and epic boss fights.', category: 'action', tags: ['featured'], thumbnail: '', embedUrl: makeEmbed('d4e6f8a0b2c4d601'), rating: 4.3, plays: 189200 },
  { id: 'cyber-punch', title: 'Cyber Punch', description: 'Street fighting in a neon cyberpunk city. Chain combos, dodge attacks, and rise through underground fight clubs.', category: 'action', tags: ['new'], thumbnail: '', embedUrl: makeEmbed('e6f8a0b2c4d6e801'), rating: 4.1, plays: 97600 },
  { id: 'metal-fury', title: 'Metal Fury', description: 'Pilot a heavily armed mech through hostile territory. Upgrade weapons, unlock new mechs, and destroy everything in your path.', category: 'action', tags: ['popular'], thumbnail: '', embedUrl: makeEmbed('f8a0b2c4d6e8f001'), rating: 4.4, plays: 223400 },
  { id: 'arena-combat', title: 'Arena Combat', description: 'Enter the gladiator arena and prove your worth! Choose your fighter, master unique abilities, and become champion.', category: 'action', tags: [], thumbnail: '', embedUrl: makeEmbed('a0b2c4d6e8f0a201'), rating: 3.9, plays: 78300 },
  { id: 'dragon-slayer', title: 'Dragon Slayer', description: 'Hunt legendary dragons across mythical lands. Craft powerful weapons from dragon scales and become the ultimate slayer.', category: 'action', tags: ['featured'], thumbnail: '', embedUrl: makeEmbed('b2c4d6e8f0a2b401'), rating: 4.6, plays: 341200 },
  { id: 'rage-runner', title: 'Rage Runner', description: 'Run, jump, and fight through an endless gauntlet of enemies and obstacles. How far can you go before rage quitting?', category: 'action', tags: [], thumbnail: '', embedUrl: makeEmbed('c4d6e8f0a2b4c601'), rating: 4.0, plays: 112400 },
  { id: 'void-striker', title: 'Void Striker', description: 'Harness the power of the void to strike down cosmic threats. Fluid combat mechanics with devastating special attacks.', category: 'action', tags: ['new'], thumbnail: '', embedUrl: makeEmbed('d6e8f0a2b4c6d801'), rating: 4.2, plays: 67800 },
  { id: 'blade-storm', title: 'Blade Storm', description: 'Dual-wield enchanted blades and carve through armies. Unlock legendary weapons and master the art of the storm.', category: 'action', tags: ['popular'], thumbnail: '', embedUrl: makeEmbed('e8f0a2b4c6d8e001'), rating: 4.5, plays: 298700 },
  { id: 'super-brawl', title: 'Super Brawl', description: 'Pick your hero and brawl it out in chaotic multiplayer battles! Special moves, power-ups, and endless fun.', category: 'action', tags: [], thumbnail: '', embedUrl: makeEmbed('f0a2b4c6d8e0f201'), rating: 4.1, plays: 134500 },
  { id: 'samurai-legends', title: 'Samurai Legends', description: 'Walk the path of the samurai. Precise swordplay, honor-based decisions, and breathtaking duels await.', category: 'action', tags: ['featured'], thumbnail: '', embedUrl: makeEmbed('a2b4c6d8e0f2a401'), rating: 4.7, plays: 267800 },
  { id: 'titan-clash', title: 'Titan Clash', description: 'Giant titans clash in earth-shaking battles. Control your titan, upgrade its abilities, and dominate the battlefield.', category: 'action', tags: [], thumbnail: '', embedUrl: makeEmbed('b4c6d8e0f2a4b601'), rating: 3.8, plays: 56200 },
  { id: 'pixel-knights', title: 'Pixel Knights', description: 'Retro-style knight combat with modern mechanics. Explore pixel dungeons and defeat the dark lord.', category: 'action', tags: ['new', 'popular'], thumbnail: '', embedUrl: makeEmbed('c6d8e0f2a4b6c801'), rating: 4.3, plays: 187600 },
  { id: 'storm-force', title: 'Storm Force', description: 'Lead an elite strike team through dangerous missions. Tactical action with explosive combat sequences.', category: 'action', tags: [], thumbnail: '', embedUrl: makeEmbed('d8e0f2a4b6c8d001'), rating: 4.0, plays: 91300 },
  { id: 'fury-fists', title: 'Fury Fists', description: 'Underground boxing with a twist — supernatural powers! Punch your way through increasingly powerful opponents.', category: 'action', tags: ['popular'], thumbnail: '', embedUrl: makeEmbed('e0f2a4b6c8d0e201'), rating: 4.4, plays: 203400 },
  { id: 'iron-assault', title: 'Iron Assault', description: 'Command an iron-clad war machine in intense vehicular combat. Ram, shoot, and crush your enemies.', category: 'action', tags: [], thumbnail: '', embedUrl: makeEmbed('f2a4b6c8d0e2f401'), rating: 3.7, plays: 45600 },
  { id: 'phantom-strike', title: 'Phantom Strike', description: 'Become invisible, strike from the shadows, vanish again. Stealth action at its finest with varied kill methods.', category: 'action', tags: ['new'], thumbnail: '', embedUrl: makeEmbed('a4b6c8d0e2f4a601'), rating: 4.5, plays: 156800 },
  { id: 'war-machine', title: 'War Machine', description: 'Build the ultimate war machine from scrap parts. Battle other players\' creations in a demolition derby arena.', category: 'action', tags: [], thumbnail: '', embedUrl: makeEmbed('b6c8d0e2f4a6b801'), rating: 4.1, plays: 123400 },


  { id: 'treasure-quest', title: 'Treasure Quest', description: 'Embark on an epic adventure across mysterious lands. Solve ancient puzzles and discover hidden treasures.', category: 'adventure', tags: ['featured'], thumbnail: '', embedUrl: makeEmbed('d4e6f8a0b2c4d602'), rating: 4.4, plays: 234100 },
  { id: 'dungeon-crawler', title: 'Dungeon Crawler', description: 'Descend into the darkest dungeons, battle fearsome monsters, and collect legendary loot.', category: 'adventure', tags: ['new', 'popular'], thumbnail: '', embedUrl: makeEmbed('e6f8a0b2c4d6e802'), rating: 4.6, plays: 312500 },
  { id: 'lost-ruins', title: 'Lost Ruins', description: 'Explore ancient ruins filled with traps and treasures. Every corridor hides a secret waiting to be discovered.', category: 'adventure', tags: ['popular'], thumbnail: '', embedUrl: makeEmbed('f8a0b2c4d6e8f002'), rating: 4.3, plays: 198700 },
  { id: 'mystic-forest', title: 'Mystic Forest', description: 'Wander through an enchanted forest where magic is real. Befriend mythical creatures and uncover ancient mysteries.', category: 'adventure', tags: ['featured'], thumbnail: '', embedUrl: makeEmbed('a0b2c4d6e8f0a202'), rating: 4.5, plays: 267300 },
  { id: 'pirate-voyage', title: 'Pirate Voyage', description: 'Set sail on the high seas! Discover islands, find buried treasure, and battle rival pirates in epic ship combat.', category: 'adventure', tags: ['popular'], thumbnail: '', embedUrl: makeEmbed('b2c4d6e8f0a2b402'), rating: 4.7, plays: 356200 },
  { id: 'sky-explorer', title: 'Sky Explorer', description: 'Soar through floating islands in the sky. Discover hidden civilizations and unlock the secrets of flight.', category: 'adventure', tags: ['new'], thumbnail: '', embedUrl: makeEmbed('c4d6e8f0a2b4c602'), rating: 4.2, plays: 89400 },
  { id: 'cave-expedition', title: 'Cave Expedition', description: 'Spelunk through vast underground cave systems. Map uncharted territories and survive the darkness.', category: 'adventure', tags: [], thumbnail: '', embedUrl: makeEmbed('d6e8f0a2b4c6d802'), rating: 4.0, plays: 67800 },
  { id: 'time-traveler', title: 'Time Traveler', description: 'Journey through different eras of history. Change the past, shape the future, and fix temporal paradoxes.', category: 'adventure', tags: ['featured'], thumbnail: '', embedUrl: makeEmbed('e8f0a2b4c6d8e002'), rating: 4.8, plays: 423100 },
  { id: 'jungle-trek', title: 'Jungle Trek', description: 'Navigate dense jungles filled with wild animals and hidden temples. Survival skills are your best friend.', category: 'adventure', tags: [], thumbnail: '', embedUrl: makeEmbed('f0a2b4c6d8e0f202'), rating: 3.9, plays: 56300 },
  { id: 'ocean-depths', title: 'Ocean Depths', description: 'Dive into the deep ocean and explore underwater caves, shipwrecks, and mysterious sea creatures.', category: 'adventure', tags: ['new'], thumbnail: '', embedUrl: makeEmbed('a2b4c6d8e0f2a402'), rating: 4.3, plays: 134500 },
  { id: 'dragon-quest-rpg', title: 'Dragon Quest RPG', description: 'An epic RPG adventure with dragons, magic, and a world to save. Level up your hero and forge alliances.', category: 'adventure', tags: ['popular', 'featured'], thumbnail: '', embedUrl: makeEmbed('b4c6d8e0f2a4b602'), rating: 4.9, plays: 567800 },
  { id: 'haunted-mansion', title: 'Haunted Mansion', description: 'Explore a creepy haunted mansion filled with ghosts and puzzles. Can you escape before midnight?', category: 'adventure', tags: [], thumbnail: '', embedUrl: makeEmbed('c6d8e0f2a4b6c802'), rating: 4.1, plays: 98700 },
  { id: 'arctic-survival', title: 'Arctic Survival', description: 'Survive the frozen tundra. Build shelters, hunt for food, and brave blizzards in this harsh wilderness adventure.', category: 'adventure', tags: ['new'], thumbnail: '', embedUrl: makeEmbed('d8e0f2a4b6c8d002'), rating: 4.0, plays: 78900 },
  { id: 'space-odyssey', title: 'Space Odyssey', description: 'Travel across galaxies, discover alien civilizations, and unravel the mystery of the cosmos.', category: 'adventure', tags: ['popular'], thumbnail: '', embedUrl: makeEmbed('e0f2a4b6c8d0e202'), rating: 4.6, plays: 289400 },
  { id: 'desert-wanderer', title: 'Desert Wanderer', description: 'Cross an endless desert with nothing but your wits. Find oases, ancient tombs, and sand-buried cities.', category: 'adventure', tags: [], thumbnail: '', embedUrl: makeEmbed('f2a4b6c8d0e2f402'), rating: 3.8, plays: 45600 },
  { id: 'volcano-escape', title: 'Volcano Escape', description: 'The volcano is erupting! Race through collapsing caves and rivers of lava to reach safety.', category: 'adventure', tags: [], thumbnail: '', embedUrl: makeEmbed('a4b6c8d0e2f4a602'), rating: 4.2, plays: 112300 },


  { id: 'slope-runner', title: 'Slope Runner', description: 'Race down an endless neon slope at breakneck speed! Dodge obstacles and navigate sharp turns.', category: 'arcade', tags: ['popular', 'featured'], thumbnail: '', embedUrl: makeEmbed('f8a0b2c4d6e8f003'), rating: 4.6, plays: 487200 },
  { id: 'space-shooter', title: 'Space Shooter', description: 'Pilot your starfighter through waves of alien invaders! Upgrade weapons and save the galaxy.', category: 'arcade', tags: ['popular'], thumbnail: '', embedUrl: makeEmbed('a0b2c4d6e8f0a203'), rating: 4.3, plays: 234500 },
  { id: 'block-breaker', title: 'Block Breaker', description: 'Smash colorful blocks with precision ball bounces! Classic brick-breaking with modern power-ups.', category: 'arcade', tags: [], thumbnail: '', embedUrl: makeEmbed('b2c4d6e8f0a2b403'), rating: 4.1, plays: 178900 },
  { id: 'pac-chase', title: 'Pac Chase', description: 'Navigate mazes, eat dots, and avoid ghosts in this modern take on the classic arcade formula.', category: 'arcade', tags: ['featured'], thumbnail: '', embedUrl: makeEmbed('c4d6e8f0a2b4c603'), rating: 4.5, plays: 356700 },
  { id: 'pinball-wizard', title: 'Pinball Wizard', description: 'Master the flippers in this physics-based pinball game with multiple themed tables and high score challenges.', category: 'arcade', tags: ['new'], thumbnail: '', embedUrl: makeEmbed('d6e8f0a2b4c6d803'), rating: 4.2, plays: 123400 },
  { id: 'fruit-ninja-slash', title: 'Fruit Ninja Slash', description: 'Slice through flying fruits with precision! Avoid bombs and chain combos for maximum points.', category: 'arcade', tags: ['popular'], thumbnail: '', embedUrl: makeEmbed('e8f0a2b4c6d8e003'), rating: 4.4, plays: 289100 },
  { id: 'tetris-blitz', title: 'Tetris Blitz', description: 'Fast-paced block stacking with power-ups and time challenges. Clear lines before time runs out!', category: 'arcade', tags: ['popular', 'featured'], thumbnail: '', embedUrl: makeEmbed('f0a2b4c6d8e0f203'), rating: 4.7, plays: 445600 },
  { id: 'bubble-pop', title: 'Bubble Pop', description: 'Aim, shoot, and pop matching bubbles! Hundreds of levels with special bubble types and power-ups.', category: 'arcade', tags: [], thumbnail: '', embedUrl: makeEmbed('a2b4c6d8e0f2a403'), rating: 4.0, plays: 156700 },
  { id: 'neon-jump', title: 'Neon Jump', description: 'Jump between glowing neon platforms in this hypnotic arcade game. One wrong move and you fall into the void.', category: 'arcade', tags: ['new'], thumbnail: '', embedUrl: makeEmbed('b4c6d8e0f2a4b603'), rating: 4.3, plays: 98700 },
  { id: 'color-switch', title: 'Color Switch', description: 'Match your ball color to pass through barriers. Lightning reflexes needed as the speed increases!', category: 'arcade', tags: [], thumbnail: '', embedUrl: makeEmbed('c6d8e0f2a4b6c803'), rating: 4.1, plays: 167800 },
  { id: 'flappy-rocket', title: 'Flappy Rocket', description: 'Guide your rocket through asteroid fields and narrow gaps. Simple controls, impossibly addictive gameplay.', category: 'arcade', tags: ['popular'], thumbnail: '', embedUrl: makeEmbed('d8e0f2a4b6c8d003'), rating: 4.2, plays: 234500 },
  { id: 'snake-classic', title: 'Snake Classic', description: 'The classic snake game reimagined with power-ups, obstacles, and multiple game modes.', category: 'arcade', tags: [], thumbnail: '', embedUrl: makeEmbed('e0f2a4b6c8d0e203'), rating: 4.0, plays: 189300 },
  { id: 'geometry-dash-lite', title: 'Geometry Dash Lite', description: 'Jump, fly, and flip through dangerous passages and spiky obstacles in rhythm-based gameplay.', category: 'arcade', tags: ['popular', 'featured'], thumbnail: '', embedUrl: makeEmbed('f2a4b6c8d0e2f403'), rating: 4.8, plays: 678900 },
  { id: 'stack-tower', title: 'Stack Tower', description: 'Stack blocks perfectly to build the tallest tower. Each misaligned block shrinks your platform.', category: 'arcade', tags: ['new'], thumbnail: '', embedUrl: makeEmbed('a4b6c8d0e2f4a603'), rating: 4.1, plays: 87600 },
  { id: 'whack-a-mole', title: 'Whack-a-Mole', description: 'Whack the moles as they pop up! Multiple difficulty levels and special golden moles for bonus points.', category: 'arcade', tags: [], thumbnail: '', embedUrl: makeEmbed('b6c8d0e2f4a6b803'), rating: 3.9, plays: 67800 },
  { id: 'coin-pusher', title: 'Coin Pusher', description: 'Drop coins strategically to push prizes off the edge. Addictive physics-based arcade fun.', category: 'arcade', tags: [], thumbnail: '', embedUrl: makeEmbed('c8d0e2f4a6b8c003'), rating: 4.0, plays: 134500 },
  { id: 'pong-extreme', title: 'Pong Extreme', description: 'The original arcade game with extreme power-ups, multiple balls, and laser paddles.', category: 'arcade', tags: ['new'], thumbnail: '', embedUrl: makeEmbed('d0e2f4a6b8c0d203'), rating: 3.8, plays: 45600 },
  { id: 'endless-runner', title: 'Endless Runner', description: 'Sprint through procedurally generated worlds. Dodge, slide, and jump your way to a new high score.', category: 'arcade', tags: ['popular'], thumbnail: '', embedUrl: makeEmbed('e2f4a6b8c0d2e403'), rating: 4.4, plays: 312400 },


  { id: 'chess-master', title: 'Chess Master', description: 'Test your strategic mind in this beautifully crafted chess game. Play against AI or solve daily puzzles.', category: 'board', tags: ['featured'], thumbnail: '', embedUrl: makeEmbed('c4d6e8f0a2b4c604'), rating: 4.6, plays: 345600 },
  { id: 'checkers-classic', title: 'Checkers Classic', description: 'Enjoy the timeless game of checkers with polished graphics and smart AI.', category: 'board', tags: [], thumbnail: '', embedUrl: makeEmbed('d6e8f0a2b4c6d804'), rating: 4.0, plays: 123400 },
  { id: 'reversi-pro', title: 'Reversi Pro', description: 'Flip your opponent\'s pieces and dominate the board in this classic strategy game also known as Othello.', category: 'board', tags: ['popular'], thumbnail: '', embedUrl: makeEmbed('e8f0a2b4c6d8e004'), rating: 4.2, plays: 189700 },
  { id: 'backgammon', title: 'Backgammon', description: 'One of the oldest board games in history, beautifully rendered. Roll dice, move pieces, bear off to win.', category: 'board', tags: [], thumbnail: '', embedUrl: makeEmbed('f0a2b4c6d8e0f204'), rating: 4.1, plays: 98700 },
  { id: 'go-master', title: 'Go Master', description: 'The ancient game of Go with varying board sizes and AI difficulty levels. Place stones and control territory.', category: 'board', tags: ['featured'], thumbnail: '', embedUrl: makeEmbed('a2b4c6d8e0f2a404'), rating: 4.7, plays: 267800 },
  { id: 'ludo-king', title: 'Ludo King', description: 'Roll the dice and race your tokens home! Classic Ludo with colorful graphics and fun animations.', category: 'board', tags: ['popular'], thumbnail: '', embedUrl: makeEmbed('b4c6d8e0f2a4b604'), rating: 4.3, plays: 234500 },
  { id: 'mancala', title: 'Mancala', description: 'The ancient seed-sowing game. Strategically distribute stones to capture the most in your store.', category: 'board', tags: [], thumbnail: '', embedUrl: makeEmbed('c6d8e0f2a4b6c804'), rating: 4.0, plays: 56700 },
  { id: 'connect-four', title: 'Connect Four', description: 'Drop colored discs and connect four in a row — horizontally, vertically, or diagonally to win!', category: 'board', tags: ['new'], thumbnail: '', embedUrl: makeEmbed('d8e0f2a4b6c8d004'), rating: 4.2, plays: 145600 },
  { id: 'dominoes', title: 'Dominoes', description: 'Match numbered tiles and be the first to play all your pieces. Multiple game modes available.', category: 'board', tags: [], thumbnail: '', embedUrl: makeEmbed('e0f2a4b6c8d0e204'), rating: 3.9, plays: 67800 },
  { id: 'tic-tac-toe-pro', title: 'Tic-Tac-Toe Pro', description: 'The classic game elevated — play on 4x4, 5x5 grids with power-ups and online challenges.', category: 'board', tags: ['new'], thumbnail: '', embedUrl: makeEmbed('f2a4b6c8d0e2f404'), rating: 3.7, plays: 34500 },
  { id: 'snakes-ladders', title: 'Snakes & Ladders', description: 'Roll the dice and climb ladders to victory — but watch out for the snakes that send you sliding down!', category: 'board', tags: ['popular'], thumbnail: '', embedUrl: makeEmbed('a4b6c8d0e2f4a604'), rating: 4.1, plays: 178900 },
  { id: 'battleship', title: 'Battleship', description: 'Place your fleet and fire shots to sink your opponent\'s ships. Classic naval strategy in digital form.', category: 'board', tags: ['featured'], thumbnail: '', embedUrl: makeEmbed('b6c8d0e2f4a6b804'), rating: 4.4, plays: 223400 },
  { id: 'nine-mens-morris', title: 'Nine Men\'s Morris', description: 'Form mills of three pieces in a row to remove your opponent\'s pieces. Ancient strategy board game.', category: 'board', tags: [], thumbnail: '', embedUrl: makeEmbed('c8d0e2f4a6b8c004'), rating: 3.8, plays: 23400 },
  { id: 'stratego', title: 'Stratego', description: 'A game of battlefield strategy where you must capture the flag. Bluff, plan, and outmaneuver your opponent.', category: 'board', tags: ['new'], thumbnail: '', embedUrl: makeEmbed('d0e2f4a6b8c0d204'), rating: 4.3, plays: 112300 },


  { id: 'card-clash', title: 'Card Clash', description: 'Build powerful decks and battle opponents in epic card duels! Collect rare cards and rise through the ranks.', category: 'card', tags: ['new', 'featured'], thumbnail: '', embedUrl: makeEmbed('e8f0a2b4c6d8e005'), rating: 4.5, plays: 267800 },
  { id: 'solitaire-deluxe', title: 'Solitaire Deluxe', description: 'The classic card game reimagined. Multiple modes including Klondike, Spider, and FreeCell.', category: 'card', tags: ['popular'], thumbnail: '', embedUrl: makeEmbed('f0a2b4c6d8e0f205'), rating: 4.3, plays: 345600 },
  { id: 'poker-night', title: 'Poker Night', description: 'Texas Hold\'em with smart AI opponents. Bluff, raise, and go all-in to win big at the virtual poker table.', category: 'card', tags: ['popular', 'featured'], thumbnail: '', embedUrl: makeEmbed('a2b4c6d8e0f2a405'), rating: 4.6, plays: 412300 },
  { id: 'blackjack-21', title: 'Blackjack 21', description: 'Hit or stand? Play the classic casino card game and try to beat the dealer without going over 21.', category: 'card', tags: ['popular'], thumbnail: '', embedUrl: makeEmbed('b4c6d8e0f2a4b605'), rating: 4.4, plays: 289700 },
  { id: 'uno-blast', title: 'UNO Blast', description: 'The beloved card game goes digital! Match colors, play action cards, and shout UNO before your opponents.', category: 'card', tags: ['featured'], thumbnail: '', embedUrl: makeEmbed('c6d8e0f2a4b6c805'), rating: 4.7, plays: 523400 },
  { id: 'hearts-online', title: 'Hearts Online', description: 'Avoid hearts and the queen of spades. Pass cards wisely and shoot for the moon in this trick-taking game.', category: 'card', tags: [], thumbnail: '', embedUrl: makeEmbed('d8e0f2a4b6c8d005'), rating: 4.1, plays: 134500 },
  { id: 'spades-master', title: 'Spades Master', description: 'Bid strategically and take tricks with your partner. Communication through cards is the key to victory.', category: 'card', tags: ['new'], thumbnail: '', embedUrl: makeEmbed('e0f2a4b6c8d0e205'), rating: 4.2, plays: 98700 },
  { id: 'rummy-500', title: 'Rummy 500', description: 'Meld cards into sets and runs to score points. Classic rummy with smooth gameplay and smart AI.', category: 'card', tags: [], thumbnail: '', embedUrl: makeEmbed('f2a4b6c8d0e2f405'), rating: 4.0, plays: 78900 },
  { id: 'war-cards', title: 'War Cards', description: 'The simplest card game ever — flip and compare! But with exciting power-ups and special cards added.', category: 'card', tags: [], thumbnail: '', embedUrl: makeEmbed('a4b6c8d0e2f4a605'), rating: 3.8, plays: 45600 },
  { id: 'crazy-eights', title: 'Crazy Eights', description: 'Match suits or numbers and play eights to change the suit. Fast-paced card fun for everyone.', category: 'card', tags: ['new'], thumbnail: '', embedUrl: makeEmbed('b6c8d0e2f4a6b805'), rating: 4.0, plays: 67800 },
  { id: 'bridge-club', title: 'Bridge Club', description: 'Join the virtual bridge club. Bid, play, and score in this sophisticated partnership card game.', category: 'card', tags: [], thumbnail: '', embedUrl: makeEmbed('c8d0e2f4a6b8c005'), rating: 4.3, plays: 156700 },
  { id: 'deck-builder', title: 'Deck Builder', description: 'Start with a basic deck and build it into a powerhouse through strategic card acquisitions and upgrades.', category: 'card', tags: ['popular'], thumbnail: '', embedUrl: makeEmbed('d0e2f4a6b8c0d205'), rating: 4.5, plays: 234500 },
  { id: 'memory-match', title: 'Memory Match', description: 'Flip cards and find matching pairs! Train your memory with increasingly challenging card layouts.', category: 'card', tags: [], thumbnail: '', embedUrl: makeEmbed('e2f4a6b8c0d2e405'), rating: 3.9, plays: 89700 },
  { id: 'gin-rummy', title: 'Gin Rummy', description: 'Form melds and knock to win! Classic two-player gin rummy with multiple difficulty levels.', category: 'card', tags: ['new'], thumbnail: '', embedUrl: makeEmbed('f4a6b8c0d2e4f605'), rating: 4.1, plays: 112300 },


  { id: 'cookie-empire', title: 'Cookie Empire', description: 'Click your way to a cookie empire! Build an automated cookie factory and become the ultimate tycoon.', category: 'clicker', tags: ['popular'], thumbnail: '', embedUrl: makeEmbed('a2b4c6d8e0f2a406'), rating: 4.4, plays: 345600 },
  { id: 'idle-miners', title: 'Idle Miners', description: 'Dig deep and discover precious gems! Upgrade mining equipment and expand your underground empire.', category: 'clicker', tags: ['new'], thumbnail: '', embedUrl: makeEmbed('b4c6d8e0f2a4b606'), rating: 4.2, plays: 189200 },
  { id: 'money-clicker', title: 'Money Clicker', description: 'Start with a penny and click your way to billions! Invest in businesses and become a virtual billionaire.', category: 'clicker', tags: ['popular', 'featured'], thumbnail: '', embedUrl: makeEmbed('c6d8e0f2a4b6c806'), rating: 4.6, plays: 456700 },
  { id: 'planet-builder', title: 'Planet Builder', description: 'Click to create planets, solar systems, and entire galaxies. Watch your universe expand and evolve.', category: 'clicker', tags: ['featured'], thumbnail: '', embedUrl: makeEmbed('d8e0f2a4b6c8d006'), rating: 4.3, plays: 234500 },
  { id: 'hero-clicker', title: 'Hero Clicker', description: 'Click to defeat monsters and level up your hero. Unlock powerful abilities and hire companions.', category: 'clicker', tags: ['popular'], thumbnail: '', embedUrl: makeEmbed('e0f2a4b6c8d0e206'), rating: 4.5, plays: 312400 },
  { id: 'factory-idle', title: 'Factory Idle', description: 'Design and optimize factory production lines. Automate everything and watch your profits soar.', category: 'clicker', tags: [], thumbnail: '', embedUrl: makeEmbed('f2a4b6c8d0e2f406'), rating: 4.1, plays: 123400 },
  { id: 'ant-colony', title: 'Ant Colony', description: 'Build and manage an ant colony. Click to gather resources, expand tunnels, and grow your ant army.', category: 'clicker', tags: ['new'], thumbnail: '', embedUrl: makeEmbed('a4b6c8d0e2f4a606'), rating: 4.0, plays: 78900 },
  { id: 'zombie-idle', title: 'Zombie Idle', description: 'Build a zombie horde through idle mechanics. Upgrade your zombies and conquer the living world.', category: 'clicker', tags: [], thumbnail: '', embedUrl: makeEmbed('b6c8d0e2f4a6b806'), rating: 3.9, plays: 56700 },
  { id: 'kingdom-idle', title: 'Kingdom Idle', description: 'Rule an idle kingdom! Collect taxes, upgrade buildings, and expand your territory automatically.', category: 'clicker', tags: ['popular'], thumbnail: '', embedUrl: makeEmbed('c8d0e2f4a6b8c006'), rating: 4.3, plays: 267800 },
  { id: 'space-clicker', title: 'Space Clicker', description: 'Click to launch rockets, discover planets, and build space stations. Explore the cosmos one click at a time.', category: 'clicker', tags: ['new'], thumbnail: '', embedUrl: makeEmbed('d0e2f4a6b8c0d206'), rating: 4.1, plays: 89400 },
  { id: 'candy-clicker', title: 'Candy Clicker', description: 'Click to make candy! Upgrade your candy machines and fill the world with sweets.', category: 'clicker', tags: [], thumbnail: '', embedUrl: makeEmbed('e2f4a6b8c0d2e406'), rating: 3.8, plays: 45600 },
  { id: 'tree-clicker', title: 'Tree Clicker', description: 'Plant and grow trees to save the environment. Click to water, fertilize, and watch forests spread.', category: 'clicker', tags: ['featured'], thumbnail: '', embedUrl: makeEmbed('f4a6b8c0d2e4f606'), rating: 4.2, plays: 134500 },
  { id: 'dino-evolution', title: 'Dino Evolution', description: 'Click to evolve dinosaurs through millions of years. Merge species and discover new prehistoric creatures.', category: 'clicker', tags: ['new'], thumbnail: '', embedUrl: makeEmbed('a6b8c0d2e4f6a806'), rating: 4.4, plays: 178900 },
  { id: 'gem-tycoon', title: 'Gem Tycoon', description: 'Mine gems, craft jewelry, and build a gem empire. Idle mechanics meet resource management.', category: 'clicker', tags: [], thumbnail: '', embedUrl: makeEmbed('b8c0d2e4f6a8b006'), rating: 4.0, plays: 98700 },


  { id: 'drift-king', title: 'Drift King', description: 'Master the art of drifting! Race through city streets and mountain passes. Customize your dream car.', category: 'driving', tags: ['popular', 'featured'], thumbnail: '', embedUrl: makeEmbed('c6d8e0f2a4b6c807'), rating: 4.6, plays: 423100 },
  { id: 'moto-madness', title: 'Moto Madness', description: 'Rev your engine and tear through insane obstacle courses! Perform stunts and unlock new bikes.', category: 'driving', tags: ['new'], thumbnail: '', embedUrl: makeEmbed('d8e0f2a4b6c8d007'), rating: 4.3, plays: 189200 },
  { id: 'truck-simulator', title: 'Truck Simulator', description: 'Hit the open road in your heavy-duty truck! Deliver cargo across vast landscapes.', category: 'driving', tags: ['updated'], thumbnail: '', embedUrl: makeEmbed('e0f2a4b6c8d0e207'), rating: 4.1, plays: 156700 },
  { id: 'formula-racer', title: 'Formula Racer', description: 'Experience the thrill of Formula 1 racing! Master tight corners, pit stop strategy, and reach the podium.', category: 'driving', tags: ['popular', 'featured'], thumbnail: '', embedUrl: makeEmbed('f2a4b6c8d0e2f407'), rating: 4.7, plays: 456700 },
  { id: 'rally-champion', title: 'Rally Champion', description: 'Navigate dirt roads, mud tracks, and forest trails. Rally racing at its finest with realistic physics.', category: 'driving', tags: ['popular'], thumbnail: '', embedUrl: makeEmbed('a4b6c8d0e2f4a607'), rating: 4.4, plays: 234500 },
  { id: 'parking-master', title: 'Parking Master', description: 'Park your car in increasingly tight spaces. Precision driving skills required — don\'t scratch the paint!', category: 'driving', tags: [], thumbnail: '', embedUrl: makeEmbed('b6c8d0e2f4a6b807'), rating: 4.0, plays: 112300 },
  { id: 'monster-truck', title: 'Monster Truck', description: 'Crush cars and fly over ramps in your massive monster truck! Over-the-top driving fun.', category: 'driving', tags: ['popular'], thumbnail: '', embedUrl: makeEmbed('c8d0e2f4a6b8c007'), rating: 4.5, plays: 312400 },
  { id: 'taxi-rush', title: 'Taxi Rush', description: 'Pick up passengers and race against the clock to drop them off. Navigate city traffic and earn tips.', category: 'driving', tags: ['new'], thumbnail: '', embedUrl: makeEmbed('d0e2f4a6b8c0d207'), rating: 4.1, plays: 89400 },
  { id: 'boat-racing', title: 'Boat Racing', description: 'Speed across tropical waters in high-powered racing boats. Avoid obstacles and ride the waves.', category: 'driving', tags: [], thumbnail: '', embedUrl: makeEmbed('e2f4a6b8c0d2e407'), rating: 4.0, plays: 67800 },
  { id: 'go-kart-grand-prix', title: 'Go-Kart Grand Prix', description: 'Fun kart racing with power-ups and wacky tracks! Use bananas, shells, and boosts to win.', category: 'driving', tags: ['featured'], thumbnail: '', embedUrl: makeEmbed('f4a6b8c0d2e4f607'), rating: 4.6, plays: 378900 },
  { id: 'highway-chase', title: 'Highway Chase', description: 'High-speed police chase on the highway! Dodge traffic and evade the cops for as long as you can.', category: 'driving', tags: ['popular'], thumbnail: '', embedUrl: makeEmbed('a6b8c0d2e4f6a807'), rating: 4.3, plays: 234500 },
  { id: 'off-road-4x4', title: 'Off-Road 4x4', description: 'Take your 4x4 off the beaten path. Mud, rocks, and steep hills — your truck can handle it all.', category: 'driving', tags: [], thumbnail: '', embedUrl: makeEmbed('b8c0d2e4f6a8b007'), rating: 4.1, plays: 123400 },
  { id: 'bus-driver', title: 'Bus Driver', description: 'Drive a city bus on scheduled routes. Pick up passengers on time and follow traffic rules.', category: 'driving', tags: ['new'], thumbnail: '', embedUrl: makeEmbed('c0d2e4f6a8b0c207'), rating: 3.9, plays: 56700 },
  { id: 'drag-race', title: 'Drag Race', description: 'Quarter-mile straight-line speed. Perfect your launch, shift at the right time, and dominate the strip.', category: 'driving', tags: [], thumbnail: '', embedUrl: makeEmbed('d2e4f6a8b0c2d407'), rating: 4.2, plays: 145600 },
  { id: 'atv-extreme', title: 'ATV Extreme', description: 'Race ATVs through extreme terrain. Perform flips and tricks while racing against the clock.', category: 'driving', tags: ['new'], thumbnail: '', embedUrl: makeEmbed('e4f6a8b0c2d4e607'), rating: 4.0, plays: 78900 },
  { id: 'night-rider', title: 'Night Rider', description: 'Race through neon-lit city streets at night. Atmospheric driving with a synthwave soundtrack.', category: 'driving', tags: ['featured'], thumbnail: '', embedUrl: makeEmbed('f6a8b0c2d4e6f807'), rating: 4.5, plays: 289100 },


  { id: 'blob-io', title: 'Blob.io', description: 'Grow your blob by consuming smaller ones! Navigate the arena and dominate the leaderboard.', category: 'io', tags: ['popular'], thumbnail: '', embedUrl: makeEmbed('f2a4b6c8d0e2f408'), rating: 4.3, plays: 312400 },
  { id: 'snake-arena', title: 'Snake Arena', description: 'Control your snake and collect glowing orbs. Trap other players in this competitive .io game.', category: 'io', tags: ['popular', 'featured'], thumbnail: '', embedUrl: makeEmbed('a4b6c8d0e2f4a608'), rating: 4.5, plays: 456700 },
  { id: 'tank-wars-io', title: 'Tank Wars.io', description: 'Control a tank, destroy opponents, and upgrade your firepower. Last tank standing wins!', category: 'io', tags: ['popular'], thumbnail: '', embedUrl: makeEmbed('b6c8d0e2f4a6b808'), rating: 4.4, plays: 289100 },
  { id: 'paper-io', title: 'Paper.io', description: 'Claim territory by drawing shapes with your trail. But don\'t let anyone cross your line!', category: 'io', tags: ['popular', 'featured'], thumbnail: '', embedUrl: makeEmbed('c8d0e2f4a6b8c008'), rating: 4.6, plays: 534200 },
  { id: 'zombie-io', title: 'Zombie.io', description: 'Start as a zombie or a survivor. Zombies infect, survivors defend. Which side will prevail?', category: 'io', tags: ['new'], thumbnail: '', embedUrl: makeEmbed('d0e2f4a6b8c0d208'), rating: 4.2, plays: 134500 },
  { id: 'hole-io', title: 'Hole.io', description: 'Control a black hole and swallow everything in the city! Grow bigger and consume buildings.', category: 'io', tags: ['popular'], thumbnail: '', embedUrl: makeEmbed('e2f4a6b8c0d2e408'), rating: 4.5, plays: 378900 },
  { id: 'wings-io', title: 'Wings.io', description: 'Fly your plane, collect power-ups, and shoot down enemy aircraft in this aerial .io game.', category: 'io', tags: ['featured'], thumbnail: '', embedUrl: makeEmbed('f4a6b8c0d2e4f608'), rating: 4.3, plays: 198700 },
  { id: 'spin-io', title: 'Spin.io', description: 'Spin your fidget spinner to knock opponents off the arena. Upgrade spin speed and unlock new spinners.', category: 'io', tags: [], thumbnail: '', embedUrl: makeEmbed('a6b8c0d2e4f6a808'), rating: 3.9, plays: 67800 },
  { id: 'build-io', title: 'Build.io', description: 'Build structures faster than your opponents! Collect resources and construct the tallest tower.', category: 'io', tags: ['new'], thumbnail: '', embedUrl: makeEmbed('b8c0d2e4f6a8b008'), rating: 4.1, plays: 89400 },
  { id: 'stab-io', title: 'Stab.io', description: 'Wield a lance and charge at opponents. Time your attacks and dodge incoming strikes.', category: 'io', tags: [], thumbnail: '', embedUrl: makeEmbed('c0d2e4f6a8b0c208'), rating: 4.0, plays: 112300 },
  { id: 'diep-io-clone', title: 'Diep.io Clone', description: 'Destroy shapes and enemy tanks to level up. Choose your upgrade path and dominate the arena.', category: 'io', tags: ['popular'], thumbnail: '', embedUrl: makeEmbed('d2e4f6a8b0c2d408'), rating: 4.4, plays: 267800 },
  { id: 'crowd-io', title: 'Crowd.io', description: 'Gather the biggest crowd and overwhelm your opponents. Numbers are your power!', category: 'io', tags: ['new'], thumbnail: '', embedUrl: makeEmbed('e4f6a8b0c2d4e608'), rating: 4.1, plays: 78900 },
  { id: 'battle-io', title: 'Battle.io', description: 'Intense real-time multiplayer battles. Pick your weapon, enter the arena, and fight for supremacy.', category: 'io', tags: [], thumbnail: '', embedUrl: makeEmbed('f6a8b0c2d4e6f808'), rating: 4.2, plays: 145600 },
  { id: 'fish-io', title: 'Fish.io', description: 'Swim as a fish, eat smaller fish, and grow. Avoid predators and become the biggest fish in the sea.', category: 'io', tags: ['featured'], thumbnail: '', embedUrl: makeEmbed('a8b0c2d4e6f8a008'), rating: 4.3, plays: 198700 },


  { id: 'block-puzzle', title: 'Block Puzzle', description: 'Fit the blocks and clear the lines! Challenges your spatial thinking with complex shapes.', category: 'puzzle', tags: ['popular', 'featured'], thumbnail: '', embedUrl: makeEmbed('b6c8d0e2f4a6b809'), rating: 4.5, plays: 456700 },
  { id: 'word-scramble', title: 'Word Scramble', description: 'Unscramble the letters to find hidden words! Test your vocabulary across thousands of puzzles.', category: 'puzzle', tags: ['new'], thumbnail: '', embedUrl: makeEmbed('c8d0e2f4a6b8c009'), rating: 4.2, plays: 134500 },
  { id: 'match-3-mania', title: 'Match 3 Mania', description: 'Swap and match colorful gems to create explosive combos! Hundreds of levels with power-ups.', category: 'puzzle', tags: [], thumbnail: '', embedUrl: makeEmbed('d0e2f4a6b8c0d209'), rating: 4.3, plays: 289100 },
  { id: 'sudoku-master', title: 'Sudoku Master', description: 'Fill the 9x9 grid with numbers 1–9. Daily challenges and multiple difficulty levels.', category: 'puzzle', tags: ['popular', 'featured'], thumbnail: '', embedUrl: makeEmbed('e2f4a6b8c0d2e409'), rating: 4.7, plays: 534200 },
  { id: 'crossword-daily', title: 'Crossword Daily', description: 'New crossword puzzles every day! From easy to expert, there\'s a crossword for everyone.', category: 'puzzle', tags: ['popular'], thumbnail: '', embedUrl: makeEmbed('f4a6b8c0d2e4f609'), rating: 4.4, plays: 312400 },
  { id: 'jigsaw-paradise', title: 'Jigsaw Paradise', description: 'Beautiful jigsaw puzzles with gorgeous images. Choose your piece count and enjoy relaxing puzzling.', category: 'puzzle', tags: ['featured'], thumbnail: '', embedUrl: makeEmbed('a6b8c0d2e4f6a809'), rating: 4.3, plays: 234500 },
  { id: 'mahjong-solitaire', title: 'Mahjong Solitaire', description: 'Match identical tiles to clear the board in this beautiful and relaxing Mahjong game.', category: 'puzzle', tags: ['popular'], thumbnail: '', embedUrl: makeEmbed('b8c0d2e4f6a8b009'), rating: 4.5, plays: 378900 },
  { id: 'nonogram', title: 'Nonogram', description: 'Fill in cells based on number clues to reveal hidden pictures. Logic puzzle perfection.', category: 'puzzle', tags: ['new'], thumbnail: '', embedUrl: makeEmbed('c0d2e4f6a8b0c209'), rating: 4.2, plays: 98700 },
  { id: 'water-pipes', title: 'Water Pipes', description: 'Rotate pipe segments to create a path for water flow. Increasingly complex pipe networks await!', category: 'puzzle', tags: [], thumbnail: '', embedUrl: makeEmbed('d2e4f6a8b0c2d409'), rating: 4.0, plays: 67800 },
  { id: 'slide-puzzle', title: 'Slide Puzzle', description: 'Slide numbered tiles into order. Simple to learn, challenging to master — a timeless classic.', category: 'puzzle', tags: [], thumbnail: '', embedUrl: makeEmbed('e4f6a8b0c2d4e609'), rating: 3.9, plays: 45600 },
  { id: 'color-fill', title: 'Color Fill', description: 'Fill the entire board with one color in limited moves. Strategy meets colorful satisfaction.', category: 'puzzle', tags: ['new'], thumbnail: '', embedUrl: makeEmbed('f6a8b0c2d4e6f809'), rating: 4.1, plays: 112300 },
  { id: 'brain-teaser', title: 'Brain Teaser', description: 'Mind-bending puzzles that test your logic, math, and lateral thinking. Can you solve them all?', category: 'puzzle', tags: ['featured'], thumbnail: '', embedUrl: makeEmbed('a8b0c2d4e6f8a009'), rating: 4.4, plays: 189200 },
  { id: 'maze-runner-puzzle', title: 'Maze Runner', description: 'Navigate through complex mazes with multiple paths. Find the exit before time runs out!', category: 'puzzle', tags: [], thumbnail: '', embedUrl: makeEmbed('b0c2d4e6f8a0b209'), rating: 4.0, plays: 78900 },
  { id: 'tower-of-hanoi', title: 'Tower of Hanoi', description: 'Move disks between pegs following the rules. The classic mathematical puzzle with increasing difficulty.', category: 'puzzle', tags: [], thumbnail: '', embedUrl: makeEmbed('c2d4e6f8a0b2c409'), rating: 3.8, plays: 34500 },
  { id: 'connect-dots', title: 'Connect the Dots', description: 'Draw lines to connect numbered dots and reveal hidden pictures. Relaxing and satisfying gameplay.', category: 'puzzle', tags: ['new'], thumbnail: '', embedUrl: makeEmbed('d4e6f8a0b2c4d609'), rating: 4.1, plays: 89400 },
  { id: 'word-search', title: 'Word Search', description: 'Find hidden words in a grid of letters. Themed word searches with hundreds of categories.', category: 'puzzle', tags: ['popular'], thumbnail: '', embedUrl: makeEmbed('e6f8a0b2c4d6e809'), rating: 4.2, plays: 198700 },


  { id: 'sniper-elite', title: 'Sniper Elite', description: 'Take aim and eliminate targets with precision! Complete covert missions in this tactical sniper game.', category: 'shooting', tags: ['popular', 'featured'], thumbnail: '', embedUrl: makeEmbed('e2f4a6b8c0d2e410'), rating: 4.6, plays: 412300 },
  { id: 'pixel-warfare', title: 'Pixel Warfare', description: 'Jump into blocky FPS action! Choose weapons and battle across multiple maps.', category: 'shooting', tags: ['popular'], thumbnail: '', embedUrl: makeEmbed('f4a6b8c0d2e4f610'), rating: 4.4, plays: 345600 },
  { id: 'zombie-shooter', title: 'Zombie Shooter', description: 'Mow down waves of zombies with an arsenal of weapons. Survive as long as you can!', category: 'shooting', tags: ['popular', 'featured'], thumbnail: '', embedUrl: makeEmbed('a6b8c0d2e4f6a810'), rating: 4.5, plays: 378900 },
  { id: 'laser-defense', title: 'Laser Defense', description: 'Defend your base with laser turrets. Aim precisely and manage your energy to stop the alien invasion.', category: 'shooting', tags: ['new'], thumbnail: '', embedUrl: makeEmbed('b8c0d2e4f6a8b010'), rating: 4.2, plays: 134500 },
  { id: 'bow-master', title: 'Bow Master', description: 'Ancient archery meets modern challenges. Account for wind, distance, and gravity in every shot.', category: 'shooting', tags: ['featured'], thumbnail: '', embedUrl: makeEmbed('c0d2e4f6a8b0c210'), rating: 4.4, plays: 234500 },
  { id: 'duck-hunt-retro', title: 'Duck Hunt Retro', description: 'The classic duck hunting game is back! Aim and shoot ducks before they fly away. Don\'t miss!', category: 'shooting', tags: [], thumbnail: '', embedUrl: makeEmbed('d2e4f6a8b0c2d410'), rating: 4.1, plays: 167800 },
  { id: 'paintball-battle', title: 'Paintball Battle', description: 'Colorful paintball warfare! Splatter your opponents and capture the flag in fast-paced matches.', category: 'shooting', tags: ['popular'], thumbnail: '', embedUrl: makeEmbed('e4f6a8b0c2d4e610'), rating: 4.3, plays: 223400 },
  { id: 'alien-blaster', title: 'Alien Blaster', description: 'Blast aliens from every direction! Power up your blaster and protect Earth from the invasion.', category: 'shooting', tags: ['new'], thumbnail: '', embedUrl: makeEmbed('f6a8b0c2d4e6f810'), rating: 4.0, plays: 89400 },
  { id: 'shotgun-fury', title: 'Shotgun Fury', description: 'Close-range shotgun action through tight corridors and enclosed spaces. Pump and blast!', category: 'shooting', tags: [], thumbnail: '', embedUrl: makeEmbed('a8b0c2d4e6f8a010'), rating: 4.2, plays: 145600 },
  { id: 'target-practice', title: 'Target Practice', description: 'Hone your aim at the shooting range. Moving targets, wind challenges, and time trials.', category: 'shooting', tags: [], thumbnail: '', embedUrl: makeEmbed('b0c2d4e6f8a0b210'), rating: 3.9, plays: 67800 },
  { id: 'western-duel', title: 'Western Duel', description: 'High noon showdowns in the Wild West. Draw faster than your opponent to survive.', category: 'shooting', tags: ['featured'], thumbnail: '', embedUrl: makeEmbed('c2d4e6f8a0b2c410'), rating: 4.3, plays: 189200 },
  { id: 'turret-defense', title: 'Turret Defense', description: 'Man the turret and mow down incoming waves. Upgrade your turret between rounds for maximum damage.', category: 'shooting', tags: ['popular'], thumbnail: '', embedUrl: makeEmbed('d4e6f8a0b2c4d610'), rating: 4.4, plays: 267800 },
  { id: 'robot-wars', title: 'Robot Wars', description: 'Battle rogue robots in a futuristic cityscape. Use advanced weapons and take down mechanical menaces.', category: 'shooting', tags: ['new'], thumbnail: '', embedUrl: makeEmbed('e6f8a0b2c4d6e810'), rating: 4.1, plays: 98700 },
  { id: 'pirate-cannon', title: 'Pirate Cannon', description: 'Fire cannonballs at enemy ships! Adjust angle and power to sink the entire fleet.', category: 'shooting', tags: [], thumbnail: '', embedUrl: makeEmbed('f8a0b2c4d6e8f010'), rating: 4.0, plays: 78900 },
  { id: 'tank-battle', title: 'Tank Battle', description: 'Strategic tank combat with destructible terrain. Aim, fire, and adjust for wind and distance.', category: 'shooting', tags: ['popular'], thumbnail: '', embedUrl: makeEmbed('a0b2c4d6e8f0a210'), rating: 4.5, plays: 312400 },
  { id: 'crossbow-hero', title: 'Crossbow Hero', description: 'Medieval crossbow action! Defend your castle from sieging armies with precise bolt placement.', category: 'shooting', tags: [], thumbnail: '', embedUrl: makeEmbed('b2c4d6e8f0a2b410'), rating: 4.1, plays: 112300 },


  { id: 'farm-paradise', title: 'Farm Paradise', description: 'Build your dream farm! Plant crops, raise animals, and expand your farmland. Trade with neighbors.', category: 'simulation', tags: ['popular', 'featured'], thumbnail: '', embedUrl: makeEmbed('a6b8c0d2e4f6a811'), rating: 4.5, plays: 423100 },
  { id: 'cooking-master', title: 'Cooking Master', description: 'Run your own restaurant kitchen! Prepare meals, serve customers, and expand your culinary empire.', category: 'simulation', tags: ['new'], thumbnail: '', embedUrl: makeEmbed('b8c0d2e4f6a8b011'), rating: 4.3, plays: 234500 },
  { id: 'city-builder-sim', title: 'City Builder', description: 'Design and manage your own city. Zone areas, build infrastructure, and keep citizens happy.', category: 'simulation', tags: ['popular', 'featured'], thumbnail: '', embedUrl: makeEmbed('c0d2e4f6a8b0c211'), rating: 4.7, plays: 567800 },
  { id: 'hospital-sim', title: 'Hospital Sim', description: 'Run a hospital — manage staff, treat patients, research cures, and expand your medical empire.', category: 'simulation', tags: ['featured'], thumbnail: '', embedUrl: makeEmbed('d2e4f6a8b0c2d411'), rating: 4.4, plays: 289100 },
  { id: 'flight-simulator', title: 'Flight Simulator', description: 'Take control of various aircraft and fly through realistic weather. Master takeoffs and landings.', category: 'simulation', tags: ['popular'], thumbnail: '', embedUrl: makeEmbed('e4f6a8b0c2d4e611'), rating: 4.6, plays: 378900 },
  { id: 'pet-shop', title: 'Pet Shop', description: 'Run an adorable pet shop! Care for animals, match them with perfect owners, and expand your business.', category: 'simulation', tags: [], thumbnail: '', embedUrl: makeEmbed('f6a8b0c2d4e6f811'), rating: 4.2, plays: 134500 },
  { id: 'theme-park', title: 'Theme Park', description: 'Build the ultimate theme park! Design roller coasters, manage queues, and keep visitors entertained.', category: 'simulation', tags: ['popular', 'featured'], thumbnail: '', embedUrl: makeEmbed('a8b0c2d4e6f8a011'), rating: 4.8, plays: 634200 },
  { id: 'train-conductor', title: 'Train Conductor', description: 'Manage a railway network. Schedule trains, handle signals, and avoid collisions across the country.', category: 'simulation', tags: ['new'], thumbnail: '', embedUrl: makeEmbed('b0c2d4e6f8a0b211'), rating: 4.1, plays: 98700 },
  { id: 'zoo-tycoon', title: 'Zoo Tycoon', description: 'Build and manage a zoo. Choose animals, design habitats, and attract visitors to your wildlife park.', category: 'simulation', tags: ['popular'], thumbnail: '', embedUrl: makeEmbed('c2d4e6f8a0b2c411'), rating: 4.5, plays: 345600 },
  { id: 'school-manager', title: 'School Manager', description: 'Run a school — hire teachers, manage budgets, build facilities, and educate the next generation.', category: 'simulation', tags: [], thumbnail: '', embedUrl: makeEmbed('d4e6f8a0b2c4d611'), rating: 4.0, plays: 67800 },
  { id: 'coffee-shop', title: 'Coffee Shop', description: 'Brew the perfect cup! Manage your café, create new recipes, and build a coffee empire.', category: 'simulation', tags: ['new'], thumbnail: '', embedUrl: makeEmbed('e6f8a0b2c4d6e811'), rating: 4.3, plays: 156700 },
  { id: 'car-mechanic', title: 'Car Mechanic', description: 'Fix broken cars in your garage. Diagnose problems, order parts, and restore vehicles to glory.', category: 'simulation', tags: [], thumbnail: '', embedUrl: makeEmbed('f8a0b2c4d6e8f011'), rating: 4.1, plays: 112300 },
  { id: 'fashion-studio', title: 'Fashion Studio', description: 'Design clothes, organize fashion shows, and build your brand in the competitive world of fashion.', category: 'simulation', tags: ['featured'], thumbnail: '', embedUrl: makeEmbed('a0b2c4d6e8f0a211'), rating: 4.2, plays: 189200 },
  { id: 'aquarium-sim', title: 'Aquarium Sim', description: 'Build beautiful aquariums! Choose fish, decorate tanks, and maintain the perfect aquatic ecosystem.', category: 'simulation', tags: [], thumbnail: '', embedUrl: makeEmbed('b2c4d6e8f0a2b411'), rating: 3.9, plays: 56700 },
  { id: 'spaceship-builder', title: 'Spaceship Builder', description: 'Design and build spaceships from scratch. Test them in flight and explore the solar system.', category: 'simulation', tags: ['new'], thumbnail: '', embedUrl: makeEmbed('c4d6e8f0a2b4c611'), rating: 4.4, plays: 198700 },
  { id: 'bakery-story', title: 'Bakery Story', description: 'Bake cakes, pastries, and bread in your own bakery. Decorate treats and serve happy customers.', category: 'simulation', tags: ['popular'], thumbnail: '', embedUrl: makeEmbed('d6e8f0a2b4c6d811'), rating: 4.3, plays: 234500 },


  { id: 'soccer-stars', title: 'Soccer Stars', description: 'Score amazing goals in this physics-based soccer game! Master formations and become champion.', category: 'sports', tags: ['popular', 'featured'], thumbnail: '', embedUrl: makeEmbed('c0d2e4f6a8b0c212'), rating: 4.5, plays: 456700 },
  { id: 'basketball-frenzy', title: 'Basketball Frenzy', description: 'Shoot hoops and rack up points! Swipe to aim and score baskets with trick shots.', category: 'sports', tags: [], thumbnail: '', embedUrl: makeEmbed('d2e4f6a8b0c2d412'), rating: 4.2, plays: 189200 },
  { id: 'tennis-ace', title: 'Tennis Ace', description: 'Serve, volley, and smash your way to tennis glory. Realistic physics and fluid animations.', category: 'sports', tags: ['popular'], thumbnail: '', embedUrl: makeEmbed('e4f6a8b0c2d4e612'), rating: 4.4, plays: 267800 },
  { id: 'home-run-hero', title: 'Home Run Hero', description: 'Step up to the plate and smash home runs! Time your swings perfectly for maximum distance.', category: 'sports', tags: ['featured'], thumbnail: '', embedUrl: makeEmbed('f6a8b0c2d4e6f812'), rating: 4.3, plays: 198700 },
  { id: 'boxing-champion', title: 'Boxing Champion', description: 'Train your boxer, improve stats, and fight your way to the world championship belt.', category: 'sports', tags: ['popular'], thumbnail: '', embedUrl: makeEmbed('a8b0c2d4e6f8a012'), rating: 4.5, plays: 312400 },
  { id: 'golf-pro', title: 'Golf Pro', description: 'Play golf on beautiful courses around the world. Master clubs, read the green, and go for eagle.', category: 'sports', tags: [], thumbnail: '', embedUrl: makeEmbed('b0c2d4e6f8a0b212'), rating: 4.1, plays: 134500 },
  { id: 'ski-jump', title: 'Ski Jump', description: 'Race down the ramp and launch into the sky! Nail the perfect landing for maximum distance.', category: 'sports', tags: ['new'], thumbnail: '', embedUrl: makeEmbed('c2d4e6f8a0b2c412'), rating: 4.0, plays: 78900 },
  { id: 'swimming-race', title: 'Swimming Race', description: 'Compete in Olympic-style swimming events. Manage your stamina and time your strokes perfectly.', category: 'sports', tags: [], thumbnail: '', embedUrl: makeEmbed('d4e6f8a0b2c4d612'), rating: 3.9, plays: 56700 },
  { id: 'cricket-world', title: 'Cricket World', description: 'Bat, bowl, and field in exciting cricket matches. Multiple formats from T20 to Test cricket.', category: 'sports', tags: ['popular'], thumbnail: '', embedUrl: makeEmbed('e6f8a0b2c4d6e812'), rating: 4.3, plays: 223400 },
  { id: 'hockey-stars', title: 'Hockey Stars', description: 'Hit the ice and score goals! Fast-paced hockey action with body checks and power plays.', category: 'sports', tags: ['featured'], thumbnail: '', embedUrl: makeEmbed('f8a0b2c4d6e8f012'), rating: 4.4, plays: 178900 },
  { id: 'pool-master', title: 'Pool Master', description: 'Line up your shots and sink the balls in this realistic billiards game. Multiple game modes.', category: 'sports', tags: ['popular'], thumbnail: '', embedUrl: makeEmbed('a0b2c4d6e8f0a212'), rating: 4.6, plays: 389100 },
  { id: 'bowling-strike', title: 'Bowling Strike', description: 'Aim for the perfect strike! Realistic bowling physics with multiple alleys and ball types.', category: 'sports', tags: [], thumbnail: '', embedUrl: makeEmbed('b2c4d6e8f0a2b412'), rating: 4.0, plays: 112300 },
  { id: 'rugby-rush', title: 'Rugby Rush', description: 'Charge through defenders, pass to teammates, and score tries in intense rugby action.', category: 'sports', tags: ['new'], thumbnail: '', embedUrl: makeEmbed('c4d6e8f0a2b4c612'), rating: 4.1, plays: 89400 },
  { id: 'table-tennis', title: 'Table Tennis', description: 'Fast reflexes needed for this ping-pong simulation. Spin, slice, and smash your way to victory.', category: 'sports', tags: ['featured'], thumbnail: '', embedUrl: makeEmbed('d6e8f0a2b4c6d812'), rating: 4.3, plays: 156700 },
  { id: 'volleyball-beach', title: 'Volleyball Beach', description: 'Spike, block, and dive on sun-drenched beaches. Fast-paced beach volleyball action!', category: 'sports', tags: ['new'], thumbnail: '', embedUrl: makeEmbed('e8f0a2b4c6d8e012'), rating: 4.2, plays: 98700 },
  { id: 'wrestling-mania', title: 'Wrestling Mania', description: 'Slam, pin, and suplex your opponents in the ring. Create your wrestler and rise to fame.', category: 'sports', tags: [], thumbnail: '', embedUrl: makeEmbed('f0a2b4c6d8e0f212'), rating: 4.0, plays: 67800 },


  { id: 'tower-defense', title: 'Tower Defense', description: 'Build and upgrade towers to defend your base from waves of enemies! Plan strategy carefully.', category: 'strategy', tags: ['popular', 'featured'], thumbnail: '', embedUrl: makeEmbed('e4f6a8b0c2d4e613'), rating: 4.6, plays: 478900 },
  { id: 'kingdom-builder', title: 'Kingdom Builder', description: 'Expand your medieval kingdom by conquering territories and managing resources.', category: 'strategy', tags: ['new'], thumbnail: '', embedUrl: makeEmbed('f6a8b0c2d4e6f813'), rating: 4.4, plays: 234500 },
  { id: 'age-of-empires-lite', title: 'Age of Empires Lite', description: 'Build civilizations, advance through ages, and wage wars. Lite version of the beloved RTS classic.', category: 'strategy', tags: ['popular', 'featured'], thumbnail: '', embedUrl: makeEmbed('a8b0c2d4e6f8a013'), rating: 4.8, plays: 678900 },
  { id: 'hex-conquest', title: 'Hex Conquest', description: 'Conquer hexagonal territories turn by turn. Manage armies, resources, and diplomacy.', category: 'strategy', tags: ['featured'], thumbnail: '', embedUrl: makeEmbed('b0c2d4e6f8a0b213'), rating: 4.5, plays: 312400 },
  { id: 'space-commander', title: 'Space Commander', description: 'Command a space fleet across the galaxy. Build ships, research tech, and conquer star systems.', category: 'strategy', tags: ['popular'], thumbnail: '', embedUrl: makeEmbed('c2d4e6f8a0b2c413'), rating: 4.6, plays: 389100 },
  { id: 'pirate-empire', title: 'Pirate Empire', description: 'Build a pirate fleet, raid coastal towns, and dominate the Caribbean in this naval strategy game.', category: 'strategy', tags: ['new'], thumbnail: '', embedUrl: makeEmbed('d4e6f8a0b2c4d613'), rating: 4.3, plays: 178900 },
  { id: 'defense-grid', title: 'Defense Grid', description: 'Place defensive structures on a grid to create the ultimate defense maze. No enemy gets through!', category: 'strategy', tags: [], thumbnail: '', embedUrl: makeEmbed('e6f8a0b2c4d6e813'), rating: 4.2, plays: 145600 },
  { id: 'war-strategy', title: 'War Strategy', description: 'Plan military campaigns on a world map. Move armies, manage supply lines, and achieve victory.', category: 'strategy', tags: ['popular'], thumbnail: '', embedUrl: makeEmbed('f8a0b2c4d6e8f013'), rating: 4.4, plays: 267800 },
  { id: 'zombie-tower', title: 'Zombie Tower', description: 'Defend your tower from zombie hordes. Upgrade defenses and unlock special anti-zombie weapons.', category: 'strategy', tags: ['featured'], thumbnail: '', embedUrl: makeEmbed('a0b2c4d6e8f0a213'), rating: 4.5, plays: 334500 },
  { id: 'island-empire', title: 'Island Empire', description: 'Develop a deserted island into a thriving empire. Manage resources and expand your territory.', category: 'strategy', tags: ['new'], thumbnail: '', embedUrl: makeEmbed('b2c4d6e8f0a2b413'), rating: 4.1, plays: 98700 },
  { id: 'castle-siege', title: 'Castle Siege', description: 'Besiege enemy castles with catapults, rams, and soldiers. Or defend your own against invaders.', category: 'strategy', tags: ['popular'], thumbnail: '', embedUrl: makeEmbed('c4d6e8f0a2b4c613'), rating: 4.3, plays: 223400 },
  { id: 'chess-war', title: 'Chess War', description: 'Chess meets real-time strategy. Each piece has special abilities and must be commanded in battle.', category: 'strategy', tags: [], thumbnail: '', embedUrl: makeEmbed('d6e8f0a2b4c6d813'), rating: 4.2, plays: 134500 },
  { id: 'galactic-conquest', title: 'Galactic Conquest', description: 'Take over the galaxy one planet at a time. Research alien tech and build unstoppable fleets.', category: 'strategy', tags: ['featured'], thumbnail: '', embedUrl: makeEmbed('e8f0a2b4c6d8e013'), rating: 4.6, plays: 356700 },
  { id: 'village-wars', title: 'Village Wars', description: 'Clash with rival villages! Build your village, train troops, and attack others for resources.', category: 'strategy', tags: ['popular'], thumbnail: '', embedUrl: makeEmbed('f0a2b4c6d8e0f213'), rating: 4.4, plays: 289100 },
  { id: 'dungeon-keeper', title: 'Dungeon Keeper', description: 'Build an evil dungeon and lure heroes to their doom! Set traps, summon monsters, and rule the underworld.', category: 'strategy', tags: ['new'], thumbnail: '', embedUrl: makeEmbed('a2b4c6d8e0f2a413'), rating: 4.5, plays: 198700 },
  { id: 'merchant-trade', title: 'Merchant Trade', description: 'Buy low, sell high! Navigate trade routes, manage your caravan, and build a merchant empire.', category: 'strategy', tags: [], thumbnail: '', embedUrl: makeEmbed('b4c6d8e0f2a4b613'), rating: 4.0, plays: 78900 },
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
