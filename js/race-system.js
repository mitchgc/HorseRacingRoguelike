/*
 * RACE SYSTEM MODULE 🏁
 * 
 * This handles the complex race simulation with traits, phases, and real-time updates.
 * Want to modify how races work? This is the place!
 * 
 * ADVANCED: This is the most complex module - modify with caution!
 */

// =============================================================================
// RACE SIMULATION ENGINE ⚡
// =============================================================================

/**
 * Simulates a complete horse race with real-time updates
 * 
 * @param {Array} horses - All horses in the race (player + AI)
 * @param {Object} selectedHorse - The player's horse
 * @param {Object} selectedBoost - Any boost applied to player's horse
 * @param {number} raceDistance - Distance of the race
 * @param {Function} onPositionUpdate - Callback for position updates
 * @param {Function} onRaceFinish - Callback when race ends
 */
function simulateRace(horses, selectedHorse, selectedBoost, raceDistance, onPositionUpdate, onRaceFinish) {
  const { GAME_CONSTANTS, TRAIT_DEFINITIONS, PHASE_DEFINITIONS } = window.GameConfig;
  const { calculateHorsePerformance } = window.HorseSystem;
  
  // Initialize race data for each horse
  const raceData = horses.map(horse => ({
    ...horse,
    basePerformance: calculateHorsePerformance(horse, raceDistance, horse.id === selectedHorse.id ? selectedBoost : null),
    progress: 0,
    momentum: 0.5 + Math.random() * GAME_CONSTANTS.MOMENTUM_VARIANCE,
    energy: 80 + Math.random() * GAME_CONSTANTS.ENERGY_VARIANCE,
    intervalsSinceEvent: 0,
    eventCount: 0,
    targetEvents: 4, 
    activePhase: null,
    phaseEndTime: null,
    finishTime: null,
    hasFinished: false,
    currentPhase: null
  }));

  let raceTime = 0;
  const finishedHorses = [];

  // Start the race simulation loop
  const raceInterval = setInterval(() => {
    raceTime++;
    const raceProgress = raceTime / GAME_CONSTANTS.MAX_RACE_TIME;
    
    // Update each horse
    raceData.forEach(horse => {
      if (horse.hasFinished) return;
      
      // Check if horse finished
      if (horse.progress >= 100 && !horse.hasFinished) {
        horse.hasFinished = true;
        horse.finishTime = raceTime;
        finishedHorses.push(horse);
      }
      
      // Update horse state
      updateHorseRacing(horse, raceTime, raceProgress);
    });

    // Send position updates to UI
    const positions = createPositionUpdate(raceData);
    onPositionUpdate(positions);

    // Check if race should end
    const shouldEndRace = checkRaceEndConditions(raceData, finishedHorses, raceTime);
    if (shouldEndRace) {
      clearInterval(raceInterval);
      
      // Add 1-second delay before finishing to show final positions and medals
      setTimeout(() => {
        onRaceFinish(raceData);
      }, 1000);
    }
  }, GAME_CONSTANTS.RACE_INTERVAL_MS);
}

// =============================================================================
// HORSE RACING MECHANICS 🐎
// =============================================================================

/**
 * Updates a single horse's state during racing
 */
function updateHorseRacing(horse, raceTime, raceProgress) {
  const { TRAIT_DEFINITIONS, PHASE_DEFINITIONS } = window.GameConfig;
  
  horse.intervalsSinceEvent++;
  
  // === PHASE SYSTEM ===
  // Calculate chance for trait-based phases to trigger with escalating odds
  let phaseChance = 0.02; // Base 2% chance per interval
  horse.traits.forEach(trait => {
    const traitDef = TRAIT_DEFINITIONS[trait];
    phaseChance += traitDef.phaseChance / 50; // Scale down for frequent updates
  });
  
  // Escalating odds: longer without event = higher chance
  const intervalMultiplier = 1 + (horse.intervalsSinceEvent * 0.05); // +5% per interval
  const raceProgressMultiplier = 1 + (raceProgress * 0.8); // +80% more likely late in race
  phaseChance *= intervalMultiplier * raceProgressMultiplier;
  
  const canTriggerPhase = horse.eventCount < horse.targetEvents && !horse.activePhase;
  
  // Try to trigger a new phase
  if (canTriggerPhase && Math.random() < phaseChance) {
    triggerHorsePhase(horse, raceTime, raceProgress);
  }
  
  // === MOVEMENT CALCULATION ===
  const movement = calculateHorseMovement(horse, raceTime);
  horse.progress += movement;
  
  // === ENERGY MANAGEMENT ===
  updateHorseEnergy(horse);
}

/**
 * Triggers a trait-based phase for a horse
 */
function triggerHorsePhase(horse, raceTime, raceProgress) {
  const { TRAIT_DEFINITIONS, PHASE_DEFINITIONS } = window.GameConfig;
  
  horse.intervalsSinceEvent = 0;
  horse.eventCount++;
  
  // Find available phases based on race progress and horse traits
  const availablePhases = findAvailablePhases(horse, raceProgress);
  
  // 20% chance for negative struggle phase
  if (Math.random() < 0.2) {
    availablePhases.push({ phase: 'struggle', trait: null, weight: 1 });
  }
  
  if (availablePhases.length === 0) return;
  
  // Select phase using weighted random selection
  const selectedPhase = selectWeightedPhase(availablePhases);
  const phaseDef = PHASE_DEFINITIONS[selectedPhase.phase];
  const traitDef = selectedPhase.trait ? TRAIT_DEFINITIONS[selectedPhase.trait] : null;
  let powerModifier = traitDef ? traitDef.powerModifier : 1;
  
  // Apply booster power enhancement using the horse's booster power stat
  if (horse.boosterPower) {
    const boosterPowerMod = (1 + (horse.boosterPower / 100)) / 2; // Convert stat to multiplier
    powerModifier *= boosterPowerMod; // Enhance the power of all phases
  }
  
  // Apply EVENT_POWER_SCALING to control overall event strength
  const { GAME_CONSTANTS } = window.GameConfig;
  const eventScaledBonus = phaseDef.baseBonus * powerModifier * GAME_CONSTANTS.EVENT_POWER_SCALING;
  
  // Apply the phase
  horse.activePhase = {
    type: phaseDef.type,
    name: selectedPhase.phase,
    flatBonus: eventScaledBonus,
    duration: Math.floor(phaseDef.baseDuration * powerModifier)
  };
  
  horse.phaseEndTime = raceTime + horse.activePhase.duration;
  horse.currentPhase = horse.activePhase;
}

/**
 * Finds phases available to a horse based on race progress
 */
function findAvailablePhases(horse, raceProgress) {
  const { TRAIT_DEFINITIONS } = window.GameConfig;
  const availablePhases = [];
  
  horse.traits.forEach(trait => {
    const traitDef = TRAIT_DEFINITIONS[trait];
    traitDef.phases.forEach(phase => {
      // 🔧 MODIFY THESE CONDITIONS TO CHANGE WHEN PHASES TRIGGER
      if (raceProgress < 0.2 && ['earlyBurst', 'quickStart'].includes(phase)) {
        availablePhases.push({ phase, trait, weight: 2 });
      } else if (raceProgress < 0.7 && ['midRaceSurge', 'steadyPush', 'grind', 'sprint'].includes(phase)) {
        availablePhases.push({ phase, trait, weight: 1.25 });
      } else if (raceProgress >= 0.7 && ['finalKick', 'desperateCharge', 'sprint'].includes(phase)) {
        availablePhases.push({ phase, trait, weight: 2 }); // Final phases are most weighted
      }
    });
  });
  
  return availablePhases;
}

/**
 * Selects a phase using weighted random selection
 */
function selectWeightedPhase(availablePhases) {
  const totalWeight = availablePhases.reduce((sum, p) => sum + p.weight, 0);
  let random = Math.random() * totalWeight;
  
  for (const phaseOption of availablePhases) {
    random -= phaseOption.weight;
    if (random <= 0) {
      return phaseOption;
    }
  }
  
  return availablePhases[0]; // Fallback
}

/**
 * Calculates how far a horse moves in this interval
 */
function calculateHorseMovement(horse, raceTime) {
  // Get phase bonus if active
  let phaseBonusIncrement = 0;
  if (horse.activePhase && raceTime < horse.phaseEndTime) {
    phaseBonusIncrement = horse.activePhase.flatBonus;
    
    // Phases affect momentum
    if (horse.activePhase.type === 'surge') {
      horse.momentum = Math.min(1.5, horse.momentum + 0.05);
    } else if (horse.activePhase.type === 'struggle') {
      horse.momentum = Math.max(0.3, horse.momentum - 0.1);
    }
  } else if (horse.activePhase && raceTime >= horse.phaseEndTime) {
    // Phase ended
    horse.activePhase = null;
    horse.currentPhase = null;
    horse.phaseEndTime = null;
  }
  
  // Random momentum changes
  const momentumChange = (Math.random() - 0.5) * 0.06;
  horse.momentum = Math.max(0.4, Math.min(1.6, horse.momentum + momentumChange));
  
  // Calculate movement
  const { GAME_CONSTANTS } = window.GameConfig;
  const fatigueEffect = Math.max(0.3, horse.energy / 100);
  const baseIncrement = 2.5 * GAME_CONSTANTS.RACE_SPEED_MULTIPLIER; // Configurable race speed
  const performanceMultiplier = horse.basePerformance * 2;
  
  const coreIncrement = baseIncrement * performanceMultiplier * horse.momentum * fatigueEffect;
  const totalIncrement = coreIncrement + phaseBonusIncrement;
  
  // Add some randomness
  const variation = (Math.random() - 0.5) * 0.4;
  return Math.max(0.3, totalIncrement + variation);
}

/**
 * Updates a horse's energy during the race
 */
function updateHorseEnergy(horse) {
  const effortLevel = horse.momentum + Math.abs((horse.activePhase?.flatBonus || 0) * 0.2);
  horse.energy = Math.max(10, horse.energy - (0.8 + effortLevel * 0.3));
}

// =============================================================================
// RACE MANAGEMENT 🏁
// =============================================================================

/**
 * Creates position update object for UI
 */
function createPositionUpdate(raceData) {
  const positions = {};
  
  // Sort finished horses by finish time to determine placing
  const finishedHorses = raceData.filter(h => h.hasFinished).sort((a, b) => a.finishTime - b.finishTime);
  
  raceData.forEach(horse => {
    let finishPlace = null;
    if (horse.hasFinished) {
      finishPlace = finishedHorses.findIndex(h => h.id === horse.id) + 1;
    }
    
    positions[horse.id] = {
      position: Math.min(100, horse.progress),
      phaseInfo: horse.currentPhase ? {
        type: horse.currentPhase.type,
        name: horse.currentPhase.name
      } : null,
      finishPlace: finishPlace,
      hasFinished: horse.hasFinished
    };
  });
  return positions;
}

/**
 * Checks if the race should end
 */
function checkRaceEndConditions(raceData, finishedHorses, raceTime) {
  const allFinished = raceData.every(h => h.hasFinished);
  const topThreeFinished = finishedHorses.length >= 3 && raceTime > 35;
  
  return allFinished || topThreeFinished;
}

/**
 * Processes race results and determines final standings
 */
function processRaceResults(raceData) {
  return [...raceData].sort((a, b) => {
    // Sort by finish time if both finished
    if (a.finishTime && b.finishTime) return a.finishTime - b.finishTime;
    // Finished horses beat unfinished
    if (a.finishTime && !b.finishTime) return -1;
    if (!a.finishTime && b.finishTime) return 1;
    // If neither finished, sort by progress
    return b.progress - a.progress;
  });
}

// =============================================================================
// PRIZE SYSTEM 💰
// =============================================================================

/**
 * Calculates prize money based on entry fee and race number
 */
function calculatePrizePool(entryFee) {
  if (!entryFee) return { first: 0, second: 0, third: 0 };
  
  const { GAME_CONSTANTS } = window.GameConfig;
  const totalPool = entryFee.amount * (GAME_CONSTANTS.AI_HORSES_COUNT + 1);
  
  return {
    first: Math.floor(totalPool * 0.7),   // 70% to winner
    second: Math.floor(totalPool * 0.2),  // 20% to second
    third: Math.floor(totalPool * 0.1)    // 10% to third
  };
}

/**
 * Processes winnings for the player based on their horse's placement
 */
function processPlayerWinnings(raceResults, selectedHorse, prizePool) {
  const playerPosition = raceResults.findIndex(horse => horse.id === selectedHorse.id);
  const prizes = [prizePool.first, prizePool.second, prizePool.third];
  
  let winnings = 0;
  if (playerPosition < 3) {
    winnings = prizes[playerPosition];
  }
  
  return {
    position: playerPosition,
    winnings: winnings,
    placed: playerPosition < 3
  };
}

// =============================================================================
// EXPORT FUNCTIONS FOR USE IN OTHER FILES
// =============================================================================

window.RaceSystem = {
  simulateRace,
  processRaceResults,
  calculatePrizePool,
  processPlayerWinnings
};