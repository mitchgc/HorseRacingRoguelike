/*
 * GAME CONFIGURATION
 * 
 * This file contains all the game settings, traits, and constants.
 * This is the main place to modify game balance and add new features!
 * 
 * BEGINNER FRIENDLY: Each section is clearly labeled and easy to modify
 */

// =============================================================================
// BASIC GAME SETTINGS (Easy to modify for beginners!)
// =============================================================================

const GAME_CONSTANTS = {
  INITIAL_WALLET: 100,          // Starting money
  WIN_CONDITION: 1000,          // Money needed to win
  BASE_SPEED: 45,              // Base horse speed
  SPEED_RANGE: 15,             // How much speed can vary (+/-)
  FATIGUE_PER_RACE: 20,        // How much fatigue horses gain per race
  MAX_RACE_TIME: 50,           // Maximum race duration (in game ticks)
  RACE_INTERVAL_MS: 100,       // How fast the race animation updates (milliseconds)
  RACE_SPEED_MULTIPLIER: 0.7,  // Overall race speed (0.5 = slower, 2.0 = faster)
  AI_HORSES_COUNT: 7,          // Number of AI horses per race
  MIN_ENTRY_MULTIPLIER: 1.25,  // How much entry fees increase each race
  BREED_COST: 0,               // Cost to breed horses (currently free)
  
  // =============================================================================
  // AI HORSE POWER CALIBRATION (Adjust AI difficulty here!)
  // =============================================================================
  AI_BASE_SPEED_BONUS: 0,      // Flat bonus to AI horse base speed (0 = same as player)
  AI_SPEED_SCALING: 4,         // How much stronger AI gets per race (2 = +2 speed per race)
  AI_PLAYER_RELATIVE: 0.3,     // How much AI scales with player's best horse (0.5 = 50% of difference)
  AI_SPEED_VARIABILITY: 5,     // Random variation in AI horse speed (+/- this value)
  AI_TRAIT_CHANCE: 0.3,        // Chance for AI horses to get 2 traits (0.3 = 30%)
  AI_MIN_SPEED: 30,            // Minimum speed for AI horses
  AI_MAX_SPEED: 105,           // Maximum speed for AI horses
  
  // =============================================================================
  // PERFORMANCE IMPACT SCALING (Control genuine mechanical differences!)
  // =============================================================================
  SPEED_IMPACT_SCALING: 0.3,      // How much speed differences matter (0.3 = 30% max difference)
  DISTANCE_IMPACT_SCALING: 0.4,   // How much distance fit matters (0.4 = 40% max difference)  
  EVENT_POWER_SCALING: 0.8,       // How powerful surge/struggle events are (1.0 = normal)
  MOMENTUM_VARIANCE: 0.2,          // Starting momentum variance (lower = more consistent)
  ENERGY_VARIANCE: 30              // Starting energy variance (lower = more consistent)
};

// =============================================================================
// HORSE NAMES (Add your own names here!)
// =============================================================================

const HORSE_NAMES = [
  'Thunder Bolt', 'Lightning Strike', 'Wind Runner', 'Storm Chaser',
  'Fire Spirit', 'Golden Arrow', 'Silver Bullet', 'Midnight Express',
  'Royal Champion', 'Swift Shadow', 'Desert Storm', 'Ocean Breeze',
  'Mountain King', 'Star Dancer', 'Wild Thunder', 'Blazing Comet',
  'Dawn Rider', 'Storm Cloud', 'Flash Point', 'Night Fury',
  // New horse names:
  'Crimson Flame', 'Arctic Frost', 'Copper Canyon', 'Velvet Storm',
  'Diamond Dust', 'Emerald Knight', 'Sunset Warrior', 'Morning Glory',
  'Iron Will', 'Mystic Moon', 'Thunder Heart', 'Shadow Walker',
  'Phantom Rider', 'Crystal Falls', 'Burning Sky', 'Steel Tempest',
  'Sapphire Dream', 'Raging River', 'Autumn Blaze', 'Winters Edge',
  'Starlight Express', 'Rebel Spirit', 'Noble Quest', 'Silver Storm',
  'Golden Thunder', 'Dark Knight', 'Blazing Trail', 'Storm Rider',
  'Lightning Flash', 'Wind Dancer', 'Fire Storm', 'Moonbeam',
  'Spirit Walker', 'Thunder Strike', 'Wildfire', 'Storm King',
  'Shadow Lightning', 'Crystal Thunder', 'Midnight Storm', 'Golden Storm',
  'Silver Lightning', 'Fire Walker', 'Storm Spirit', 'Thunder Rider',
  'Lightning King', 'Wind Storm', 'Fire Thunder', 'Storm Shadow',
  'Thunder Wind', 'Lightning Storm', 'Fire Spirit', 'Storm Fire'
];

// =============================================================================
// RACE SETTINGS
// =============================================================================

const RACE_DISTANCES = [1000, 1800, 2400]; // Race distances in meters

const GAME_PHASES = {
  GAME_GUIDE: 'gameGuide',
  HORSE_SELECTION: 'horseSelection',
  RACING: 'racing',
  POST_RACE: 'postRace',
  UPGRADE: 'upgrade',
  HORSE_PICKER: 'horsePicker',
  BREEDING: 'breeding',
  HORSE_BUYING: 'horseBuying'
};

// =============================================================================
// HORSE TRAITS SYSTEM ⭐ MODIFY THIS TO ADD NEW TRAITS! ⭐
// =============================================================================

const TRAIT_DEFINITIONS = {
  // Early Speed - Good at race starts
  earlySpeed: {
    name: 'Early Speed',
    icon: '⚡',
    color: 'yellow',
    description: 'Quick out of the gate',
    phases: ['earlyBurst', 'quickStart'],    // Which phases this trait can trigger
    phaseChance: 0.45,                       // Chance to trigger phases (higher = more likely)
    powerModifier: 1.2,                      // How powerful the phases are
    mathImpact: '+20% speed boost in first 30% of race'
  },

  // Closer - Good at race finishes  
  closer: {
    name: 'Closer',
    icon: '🚀',
    color: 'purple',
    description: 'Strong finish',
    phases: ['finalKick', 'desperateCharge'],
    phaseChance: 0.5,
    powerModifier: 1.3,
    mathImpact: '+30% speed boost in final 30% of race'
  },

  // Mudder - Consistent performer
  mudder: {
    name: 'Mudder',
    icon: '🌧️',
    color: 'blue',
    description: 'Thrives in tough conditions',
    phases: ['steadyPush', 'grind'],
    phaseChance: 0.30,
    powerModifier: 1.1,
    mathImpact: '+10% consistent speed'
  },

  // Front Runner - Likes to lead
  frontRunner: {
    name: 'Front Runner',
    icon: '🏃',
    color: 'orange',
    description: 'Likes to lead',
    phases: ['earlyBurst', 'maintainLead'],
    phaseChance: 0.5,
    powerModifier: 1.15,
    mathImpact: '+15% speed when in 1st place'
  },

  // Versatile - Adapts to anything
  versatile: {
    name: 'Versatile',
    icon: '🎯',
    color: 'green',
    description: 'Adapts to any situation',
    phases: ['midRaceSurge', 'steadyPush'],
    phaseChance: 0.25,
    powerModifier: 1.0,
    mathImpact: 'No distance penalty, adapts to all tracks'
  },

  // Sprinter - Explosive bursts
  sprinter: {
    name: 'Sprinter',
    icon: '💨',
    color: 'red',
    description: 'Explosive speed bursts',
    phases: ['sprint', 'quickBurst'],
    phaseChance: 0.45,
    powerModifier: 1.4,
    mathImpact: '+40% speed for 5 second bursts'
  },


  // NEGATIVE TRAITS
  
  // Temperamental - Unreliable performance
  temperamental: {
    name: 'Temperamental',
    icon: '😤',
    color: 'red',
    description: 'Unpredictable and moody',
    phases: ['tantrum', 'struggle'],
    phaseChance: 0.30,
    powerModifier: 0.7,
    mathImpact: '-30% speed during negative phases'
  },

  // Lazy - Lacks motivation
  lazy: {
    name: 'Lazy',
    icon: '😴',
    color: 'red',
    description: 'Lacks drive and motivation',
    phases: ['slowStart', 'fade'],
    phaseChance: 0.35,
    powerModifier: 0.8,
    mathImpact: '-20% speed, more likely to fade late'
  },

  // Nervous - Gets overwhelmed
  nervous: {
    name: 'Nervous',
    icon: '😰',
    color: 'red',
    description: 'Easily spooked and anxious',
    phases: ['panic', 'stumble'],
    phaseChance: 0.25,
    powerModifier: 0.6,
    mathImpact: '-40% speed when panicked'
  },

  // Brittle - Injury prone
  brittle: {
    name: 'Brittle',
    icon: '🤕',
    color: 'red',
    description: 'Prone to fatigue and injury',
    phases: ['cramp', 'slowdown'],
    phaseChance: 0.20,
    powerModifier: 0.5,
    mathImpact: 'Gains fatigue 50% faster'
  }

  // 🚀 ADD NEW TRAITS HERE! 🚀
  // Copy the format above and create your own traits!
  // Example:
  // newTrait: {
  //   name: 'Your Trait Name',
  //   icon: '🔥',  // Pick an emoji
  //   color: 'red', // yellow, purple, blue, orange, green, red
  //   description: 'What this trait does',
  //   phases: ['sprint', 'earlyBurst'], // Which phases it can use
  //   phaseChance: 0.30, // 0.0 to 1.0 (higher = more frequent)
  //   powerModifier: 1.2, // 1.0 is normal, higher is stronger
  //   mathImpact: 'Explain the effect for players'
  // }
};

// =============================================================================
// RACE PHASES SYSTEM (Advanced: modify with caution!)
// =============================================================================

const PHASE_DEFINITIONS = {
  // Surge phases (positive boosts)
  earlyBurst:     { baseBonus: 0.6,  baseDuration: 8,  type: 'surge' },
  quickStart:     { baseBonus: 0.5,  baseDuration: 6,  type: 'surge' },
  midRaceSurge:   { baseBonus: 0.4,  baseDuration: 10, type: 'surge' },
  finalKick:      { baseBonus: 0.7,  baseDuration: 12, type: 'surge' },
  desperateCharge:{ baseBonus: 0.8,  baseDuration: 10, type: 'surge' },
  sprint:         { baseBonus: 0.9,  baseDuration: 5,  type: 'surge' },
  quickBurst:     { baseBonus: 0.7,  baseDuration: 4,  type: 'surge' },
  powerSurge:     { baseBonus: 1.0,  baseDuration: 8,  type: 'surge' },
  amplify:        { baseBonus: 0.6,  baseDuration: 15, type: 'surge' },

  // Steady phases (consistent boosts)
  steadyPush:     { baseBonus: 0.3,  baseDuration: 15, type: 'steady' },
  grind:          { baseBonus: 0.25, baseDuration: 20, type: 'steady' },
  maintainLead:   { baseBonus: 0.35, baseDuration: 12, type: 'steady' },

  // Struggle phases (negative effects)
  struggle:       { baseBonus: -0.4, baseDuration: 8,  type: 'struggle' },
  fade:           { baseBonus: -0.3, baseDuration: 10, type: 'struggle' },
  tantrum:        { baseBonus: -0.5, baseDuration: 6,  type: 'struggle' },
  slowStart:      { baseBonus: -0.4, baseDuration: 12, type: 'struggle' },
  panic:          { baseBonus: -0.6, baseDuration: 8,  type: 'struggle' },
  stumble:        { baseBonus: -0.3, baseDuration: 4,  type: 'struggle' },
  cramp:          { baseBonus: -0.7, baseDuration: 10, type: 'struggle' },
  slowdown:       { baseBonus: -0.2, baseDuration: 15, type: 'struggle' }
};

// =============================================================================
// BOOST ITEMS (Future feature - currently unused)
// =============================================================================

const BOOST_TYPES = [
  { type: 'energy', name: 'Energy Drink', desc: '+30% performance this race', cost: 25 },
  { type: 'focus', name: 'Focus Training', desc: '+20% performance this race', cost: 15 },
  { type: 'luck', name: 'Lucky Charm', desc: '+10-40% random performance boost', cost: 10 }
];

// =============================================================================
// UTILITY FUNCTIONS (Don't modify unless you know what you're doing!)
// =============================================================================

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
const randomBetween = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const randomChoice = (array) => array[Math.floor(Math.random() * array.length)];
const shuffleArray = (array) => [...array].sort(() => 0.5 - Math.random());

// Normal distribution for realistic breeding results
const normalDistribution = (mean, stdDev) => {
  let u = 0, v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return mean + stdDev * Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
};

// Export all configuration for use in other files
window.GameConfig = {
  GAME_CONSTANTS,
  HORSE_NAMES,
  RACE_DISTANCES,
  GAME_PHASES,
  TRAIT_DEFINITIONS,
  PHASE_DEFINITIONS,
  BOOST_TYPES,
  clamp,
  randomBetween,
  randomChoice,
  shuffleArray,
  normalDistribution
};