/*
 * SCOUT SYSTEM MODULE 🔍
 * 
 * This handles the intelligence reports on AI horses before races.
 * Players get hints about which horses might be dangerous!
 * 
 * BEGINNER FRIENDLY: Want to change what scouts report? This is the place!
 */

// =============================================================================
// SCOUT REPORT GENERATION 📋
// =============================================================================

/**
 * Generates scout reports for all AI horses in a race
 * Compares them to the player's best horse and provides strategic intel
 * 
 * @param {Array} aiHorses - Array of AI horses to scout
 * @param {Array} playerHorses - Array of player horses for comparison
 * @param {number} raceDistance - The distance of the upcoming race
 * @returns {Object} Scout reports keyed by horse ID
 */
function generateScoutReports(aiHorses, playerHorses, raceDistance) {
  const { TRAIT_DEFINITIONS } = window.GameConfig;
  const { calculateDistanceFit } = window.HorseSystem;
  
  // Find the player's best horse for comparison
  const bestPlayerHorse = findBestPlayerHorse(playerHorses);
  
  const reports = {};
  
  aiHorses.forEach(horse => {
    const scoutNotes = [];
    
    // === SPEED COMPARISON ANALYSIS ===
    analyzeSpeed(horse, bestPlayerHorse, scoutNotes);
    
    // === DISTANCE FIT ANALYSIS ===
    analyzeDistanceFit(horse, raceDistance, scoutNotes);
    
    // === TRAIT ANALYSIS ===
    analyzeTraits(horse, scoutNotes);
    
    // === OVERALL THREAT ASSESSMENT ===
    analyzeThreatLevel(horse, scoutNotes, bestPlayerHorse);
    
    reports[horse.id] = scoutNotes;
  });
  
  return reports;
}

// =============================================================================
// HORSE COMPARISON FUNCTIONS 🔍
// =============================================================================

/**
 * Finds the player's best overall horse for comparison purposes
 */
function findBestPlayerHorse(playerHorses) {
  if (!playerHorses || playerHorses.length === 0) {
    return { speed: 50 }; // Default fallback
  }
  
  return playerHorses.reduce((best, horse) => {
    const currentScore = horse.speed;
    const bestScore = best.speed;
    return currentScore > bestScore ? horse : best;
  }, playerHorses[0]);
}

// =============================================================================
// ANALYSIS FUNCTIONS (MODIFY THESE TO CHANGE WHAT SCOUTS REPORT!)
// =============================================================================

/**
 * Analyzes horse speed compared to player's best
 */
function analyzeSpeed(horse, bestPlayerHorse, scoutNotes) {
  // 🔧 MODIFY THESE THRESHOLDS TO CHANGE WHEN SCOUTS REPORT SPEED
  if (horse.speed > bestPlayerHorse.speed + 10) {
    scoutNotes.push('Much faster than your best');
  } else if (horse.speed > bestPlayerHorse.speed + 5) {
    scoutNotes.push('Faster than your best');
  } else if (horse.speed > bestPlayerHorse.speed) {
    scoutNotes.push('Slightly faster than your best');
  } else if (Math.random() < 0.3) { // 30% chance to reveal exact speed
    scoutNotes.push(`Speed: ${horse.speed}`);
  }
}

/**
 * Analyzes how well the horse fits the race distance
 */
function analyzeDistanceFit(horse, raceDistance, scoutNotes) {
  const { calculateDistanceFit } = window.HorseSystem;
  const distanceFit = calculateDistanceFit(horse, raceDistance);
  
  // 🔧 MODIFY THESE THRESHOLDS TO CHANGE DISTANCE FIT REPORTING
  if (distanceFit > 80) {
    scoutNotes.push('Perfect for distance');
  } else if (distanceFit < 50) {
    scoutNotes.push('Poor distance fit');
  } else if (distanceFit < 60) {
    scoutNotes.push('Suboptimal distance');
  }
}

/**
 * Analyzes dangerous traits that players should know about
 */
function analyzeTraits(horse, scoutNotes) {
  const { TRAIT_DEFINITIONS } = window.GameConfig;
  
  // 🔧 ADD NEW DANGEROUS TRAITS HERE!
  const dangerousTraits = horse.traits.filter(trait => 
    ['sprinter', 'closer', 'earlySpeed'].includes(trait)
  );
  
  // 50% chance to report each dangerous trait
  dangerousTraits.forEach(trait => {
    if (Math.random() < 0.5) { // 🔧 MODIFY THIS: Change trait reporting chance
      scoutNotes.push(`Strong ${TRAIT_DEFINITIONS[trait].name}`);
    }
  });
  
  // Special trait combinations
  if (horse.traits.includes('closer') && horse.traits.includes('sprinter')) {
    scoutNotes.push('Dangerous finisher!');
  }
  
  if (horse.traits.includes('earlySpeed') && horse.traits.includes('frontRunner')) {
    scoutNotes.push('Will lead early');
  }
}

/**
 * Provides overall threat assessment
 */
function analyzeThreatLevel(horse, scoutNotes, bestPlayerHorse) {
  const overallScore = horse.speed / bestPlayerHorse.speed;
  
  // 🔧 MODIFY THESE THRESHOLDS TO CHANGE THREAT LEVELS
  if (overallScore > 1.4) {
    scoutNotes.push('⚠️ MAJOR THREAT');
  } else if (overallScore > 1.2) {
    scoutNotes.push('⚠️ Strong contender');
  } else if (overallScore < 0.75) {
    scoutNotes.push('Weak opposition');
  }
}

// =============================================================================
// REPUTATION SYSTEM 🏆
// =============================================================================

/**
 * Calculates a horse's reputation based on their stats
 * 
 * @param {Object} horse - The horse to evaluate
 * @returns {Object} Reputation info with level and color
 */
function calculateHorseReputation(horse) {
  const overallScore = horse.speed;
  
  // 🔧 MODIFY THESE THRESHOLDS TO CHANGE REPUTATION LEVELS
  if (overallScore > 140) {
    return { level: 'Elite', color: 'text-red-600' };
  } else if (overallScore > 120) {
    return { level: 'Strong', color: 'text-yellow-600' };
  } else if (overallScore > 100) {
    return { level: 'Rising', color: 'text-green-600' };
  } else if (overallScore > 80) {
    return { level: 'Average', color: 'text-gray-600' };
  } else {
    return { level: 'Weak', color: 'text-gray-400' };
  }
}

// =============================================================================
// ADVANCED SCOUT FEATURES (FOR EXPERIENCED PLAYERS)
// =============================================================================

/**
 * Provides detailed statistical analysis of a horse
 * (This could be unlocked as a premium scouting feature!)
 */
function generateDetailedAnalysis(horse, raceDistance) {
  const { calculateDistanceFit } = window.HorseSystem;
  
  return {
    speedRating: horse.speed,
    distanceFit: calculateDistanceFit(horse, raceDistance),
    traitCount: horse.traits.length,
    estimatedWinChance: calculateWinChance(horse, raceDistance),
    strengths: identifyStrengths(horse),
    weaknesses: identifyWeaknesses(horse)
  };
}

/**
 * Estimates a horse's chance to win (simplified calculation)
 */
function calculateWinChance(horse, raceDistance) {
  const { calculateDistanceFit } = window.HorseSystem;
  
  const speedFactor = horse.speed / 100;
  const distanceFactor = calculateDistanceFit(horse, raceDistance) / 100;
  const traitFactor = Math.min(1.2, 1 + (horse.traits.length * 0.1));
  
  return Math.round(speedFactor * distanceFactor * traitFactor * 100);
}

/**
 * Identifies a horse's main strengths
 */
function identifyStrengths(horse) {
  const strengths = [];
  
  if (horse.speed > 70) strengths.push('High Speed');
  if (horse.traits.length > 1) strengths.push('Multi-Talented');
  
  return strengths;
}

/**
 * Identifies a horse's main weaknesses
 */
function identifyWeaknesses(horse) {
  const weaknesses = [];
  
  if (horse.speed < 50) weaknesses.push('Low Speed');
  if (horse.traits.length === 0) weaknesses.push('No Special Traits');
  
  return weaknesses;
}

// =============================================================================
// EXPORT FUNCTIONS FOR USE IN OTHER FILES
// =============================================================================

window.ScoutSystem = {
  generateScoutReports,
  calculateHorseReputation,
  generateDetailedAnalysis,
  calculateWinChance
};