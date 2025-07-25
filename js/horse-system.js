/*
 * HORSE SYSTEM MODULE
 * 
 * This handles everything related to horses:
 * - Generating new horses
 * - Breeding horses together
 * - Calculating horse performance
 * 
 * BEGINNER FRIENDLY: Want to modify how horses are created or bred? This is the place!
 */

// =============================================================================
// HORSE GENERATION SYSTEM 🐎
// =============================================================================

/**
 * Creates a new horse with random stats and traits
 * 
 * @param {boolean} isPlayer - Is this a player-owned horse?
 * @param {number} raceNum - Current race number (affects difficulty)
 * @param {number} specificDistance - Force a specific distance preference (optional)
 * @param {number} playerBestSpeed - Best speed among player horses (for AI scaling)
 * @returns {Object} New horse object
 */
function generateHorse(isPlayer = false, raceNum = 1, specificDistance = null, playerBestSpeed = null) {
  const { GAME_CONSTANTS, HORSE_NAMES, TRAIT_DEFINITIONS, randomBetween, randomChoice, shuffleArray, clamp } = window.GameConfig;
  
  // Calculate base stats - later races have stronger horses
  let baseSpeed;
  let speedVariability;
  
  if (isPlayer) {
    // Player horses use normal base speed
    baseSpeed = GAME_CONSTANTS.BASE_SPEED;
    speedVariability = GAME_CONSTANTS.SPEED_RANGE;
  } else {
    // AI horses use calibrated settings with player-relative scaling
    baseSpeed = GAME_CONSTANTS.BASE_SPEED + 
                GAME_CONSTANTS.AI_BASE_SPEED_BONUS + 
                (raceNum * GAME_CONSTANTS.AI_SPEED_SCALING);
    
    // Add player-relative scaling if player's best speed is provided
    if (playerBestSpeed !== null) {
      const playerDifference = playerBestSpeed - GAME_CONSTANTS.BASE_SPEED;
      baseSpeed += playerDifference * GAME_CONSTANTS.AI_PLAYER_RELATIVE;
    }
    
    // AI horses use custom variability
    speedVariability = GAME_CONSTANTS.AI_SPEED_VARIABILITY;
  }
  
  const speed = randomBetween(
    baseSpeed - speedVariability,
    baseSpeed + speedVariability
  );
  
  // Distance preference: 800-2600 scale (affects performance at different race distances)
  const distancePreference = specificDistance || randomBetween(800, 2600);
  
  // Booster power: 1-100 scale (amplifies trait and race effects)
  const boosterPower = randomBetween(30, 100);
  
  // Assign random traits - AI horses use calibrated trait chance
  const allTraits = Object.keys(TRAIT_DEFINITIONS);
  const traitChance = isPlayer ? 0.3 : GAME_CONSTANTS.AI_TRAIT_CHANCE;
  const numTraits = Math.random() > (1 - traitChance) ? 2 : 1;
  const traits = shuffleArray(allTraits).slice(0, numTraits);
  
  // Player horses get a small bonus on their first race
  const statBonus = isPlayer && raceNum === 1 ? 3 : 0;
  
  // Apply min/max limits for AI horses
  const finalSpeed = isPlayer 
    ? clamp(speed + statBonus, 30, 100)
    : clamp(speed, GAME_CONSTANTS.AI_MIN_SPEED, GAME_CONSTANTS.AI_MAX_SPEED);
    
  return {
    id: Math.random(), // Unique identifier
    name: randomChoice(HORSE_NAMES),
    speed: finalSpeed,
    boosterPower: clamp(boosterPower + statBonus, 30, 100),
    distancePreference,
    color: `hsl(${Math.random() * 360}, 70%, 50%)`, // Random color
    isPlayer,
    fatigue: 0, // Builds up after races
    traits,
    currentPhase: null // Used during racing
  };
}

// =============================================================================
// HORSE BREEDING SYSTEM 💕 (MODIFY THIS TO CHANGE BREEDING!)
// =============================================================================

/**
 * Breeds two parent horses to create offspring
 * The offspring inherits traits and stats from both parents with some randomness
 * 
 * @param {Object} parent1 - First parent horse
 * @param {Object} parent2 - Second parent horse
 * @returns {Object} New offspring horse
 */
function breedHorses(parent1, parent2) {
  const { GAME_CONSTANTS, HORSE_NAMES, TRAIT_DEFINITIONS, randomBetween, randomChoice, shuffleArray, clamp, normalDistribution } = window.GameConfig;
  
  // Calculate average stats from both parents
  const avgSpeed = (parent1.speed + parent2.speed) / 2;
  const avgBoosterPower = (parent1.boosterPower + parent2.boosterPower) / 2;
  const avgDistance = (parent1.distancePreference + parent2.distancePreference) / 2;
  
  // 🔥 BREEDING BONUS - Change this to make breeding more/less powerful!
  const breedingBonus = 1.00; // 5% bonus to speed
  
  // Add some randomness using normal distribution (realistic variation)
  const speedVariation = normalDistribution(5, 5);      // Usually small changes
  const boosterVariation = normalDistribution(0, 10);    // Can vary more
  const distanceVariation = normalDistribution(0, 200);  // Can vary more
  
  // Calculate final stats
  const newSpeed = clamp(Math.round((avgSpeed * breedingBonus) + speedVariation), 30, 105);
  const newBoosterPower = clamp(Math.round((avgBoosterPower * breedingBonus) + boosterVariation), 30, 105);
  const newDistance = clamp(Math.round(avgDistance + distanceVariation), 600, 2800);
  
  // === TRAIT INHERITANCE SYSTEM ===
  // Combine all parent traits
  const allParentTraits = [...new Set([...parent1.traits, ...parent2.traits])];
  const inheritedTraits = [];
  
  // Each parent trait has a 60% chance to be inherited
  allParentTraits.forEach(trait => {
    if (Math.random() < 0.6) { // 🔧 MODIFY THIS: Change inheritance chance
      inheritedTraits.push(trait);
    }
  });
  
  // 20% chance to get a completely new random trait (mutation!)
  if (Math.random() < 0.2) { // 🔧 MODIFY THIS: Change mutation chance
    const availableTraits = Object.keys(TRAIT_DEFINITIONS).filter(t => !inheritedTraits.includes(t));
    if (availableTraits.length > 0) {
      inheritedTraits.push(randomChoice(availableTraits));
    }
  }
  
  // Limit to maximum 3 traits
  const finalTraits = shuffleArray(inheritedTraits).slice(0, 3);
  
  // === COLOR INHERITANCE ===
  // Blend parent colors together
  const parent1Hue = parseInt(parent1.color.match(/\d+/)[0]);
  const parent2Hue = parseInt(parent2.color.match(/\d+/)[0]);
  const newHue = Math.round((parent1Hue + parent2Hue) / 2 + randomBetween(-30, 30)) % 360;
  
  // Create the offspring
  return {
    id: Math.random(),
    name: randomChoice(HORSE_NAMES),
    speed: newSpeed,
    boosterPower: newBoosterPower,
    distancePreference: newDistance,
    color: `hsl(${newHue}, 70%, 50%)`,
    isPlayer: true, // Bred horses are always player-owned
    fatigue: 0,
    traits: finalTraits.length > 0 ? finalTraits : [randomChoice(Object.keys(TRAIT_DEFINITIONS))],
    parents: [parent1.name, parent2.name] // Track lineage
  };
}

// =============================================================================
// HORSE PERFORMANCE CALCULATION ⚡
// =============================================================================

/**
 * Calculates how well a horse will perform in a race
 * Takes into account distance fit, fatigue, and boosts
 * 
 * @param {Object} horse - The horse to calculate performance for
 * @param {number} raceDistance - The distance of the race
 * @param {Object} boost - Any performance boost applied (optional)
 * @returns {number} Performance multiplier (0.0 to 1.0+)
 */
function calculateHorsePerformance(horse, raceDistance, boost = null) {
  const { GAME_CONSTANTS } = window.GameConfig;
  
  // Speed factor: controlled impact based on scaling setting
  // Speed 100 vs 30 will only differ by SPEED_IMPACT_SCALING amount
  const speedNormalized = (horse.speed - 65) / 35; // Normalize around midpoint (65), range -1 to +1
  const speedFactor = 1.0 + (speedNormalized * GAME_CONSTANTS.SPEED_IMPACT_SCALING);
  
  // Distance factor: controlled impact based on scaling setting  
  const rawDistanceFit = calculateDistanceFit(horse, raceDistance);
  const distanceNormalized = (rawDistanceFit - 0.55) / 0.45; // Normalize around midpoint, range -1 to +1
  const distanceFactor = 1.0 + (distanceNormalized * GAME_CONSTANTS.DISTANCE_IMPACT_SCALING);
  
  // Fatigue effect: tired horses perform worse
  const fatigueEffect = Math.max(0.5, 1 - (horse.fatigue / 100));
  
  // Boost effects (if any boost items are used)
  let boostEffect = 1;
  if (boost) {
    switch (boost.type) {
      case 'energy': boostEffect = 1.3; break;  // +30% performance
      case 'focus': boostEffect = 1.2; break;   // +20% performance
      case 'luck': boostEffect = 1.1 + (Math.random() * 0.3); break; // +10-40% random
      default: boostEffect = 1;
    }
  }
  
  // Combine all factors with base performance of 1.0
  return speedFactor * distanceFactor * fatigueEffect * boostEffect;
}

// =============================================================================
// DISTANCE FIT CALCULATION 📏
// =============================================================================

/**
 * Calculates how well a horse fits a specific race distance
 * 
 * @param {Object} horse - The horse to check
 * @param {number} raceDistance - The race distance in meters
 * @returns {number} Fit ratio (0.0-1.0)
 */
function calculateDistanceFit(horse, raceDistance) {
  // Calculate how close the horse's preferred distance is to the race distance
  const deviation = Math.abs(horse.distancePreference - raceDistance);
  const maxPossibleDeviation = 1800; // Max deviation (2600 - 800)
  
  // Convert to a 0.0-1.0 ratio where 1.0 is perfect fit
  const fitRatio = Math.max(0.1, 1 - (deviation / maxPossibleDeviation));
  return fitRatio;
}

// =============================================================================
// HORSE BUYING SYSTEM 🛒
// =============================================================================

/**
 * Generates 3 horses for the buying interface
 * Each horse specializes in a different race distance
 * Speed is based on the fastest horse in the player's stable +/- 10
 * 
 * @param {Array} playerHorses - Current player horses for speed reference
 * @returns {Array} Array of 3 horses with different distance specializations
 */
function generateHorseBuyingOptions(playerHorses) {
  const { RACE_DISTANCES, randomBetween, clamp } = window.GameConfig;
  
  // Find the fastest horse in the player's stable
  const fastestSpeed = playerHorses.reduce((max, horse) => 
    Math.max(max, horse.speed), 30);
  
  const horses = [];
  
  // Generate one horse for each race distance
  RACE_DISTANCES.forEach((distance) => {
    // Speed based on fastest horse +/- 10
    const baseSpeed = randomBetween(fastestSpeed - 10, fastestSpeed + 10);
    
    // Distance specialization: distance +/- 400
    const distanceSpec = randomBetween(distance - 400, distance + 400);
    
    const horse = generateHorse(false, 1, distanceSpec);
    horse.speed = clamp(baseSpeed, 30, 100);
    horse.isPlayer = false; // Will become player horse when purchased
    
    horses.push(horse);
  });
  
  return horses;
}

// =============================================================================
// EXPORT FUNCTIONS FOR USE IN OTHER FILES
// =============================================================================

window.HorseSystem = {
  generateHorse,
  breedHorses,
  calculateHorsePerformance,
  calculateDistanceFit,
  generateHorseBuyingOptions
};