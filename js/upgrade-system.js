/*
 * UPGRADE SYSTEM MODULE ⬆️
 * 
 * This handles all the upgrade options players get between races.
 * Want to add new upgrades or change the comeback system? This is the place!
 * 
 * BEGINNER FRIENDLY: Easy to add new upgrade types and modify existing ones
 */

// =============================================================================
// UPGRADE GENERATION SYSTEM 🎯
// =============================================================================

/**
 * Generates upgrade options based on player's current situation
 * Includes comeback mechanics for struggling players
 * 
 * @param {number} raceNumber - Current race number
 * @param {number} wallet - Player's current money
 * @param {number} playerHorsesCount - Number of horses in player's stable
 * @returns {Array} Array of upgrade options
 */
function generateUpgradeOptions(raceNumber, wallet, playerHorsesCount) {
  const { GAME_CONSTANTS, TRAIT_DEFINITIONS, randomChoice, shuffleArray } = window.GameConfig;
  
  // === COMEBACK MECHANIC ===
  const comebackBonus = calculateComebackBonus(raceNumber, wallet);
  
  // === BASE UPGRADE OPTIONS ===
  const allOptions = [
    {
      type: 'speed',
      name: 'Speed Training',
      desc: `+${Math.floor(8 * comebackBonus)} Speed to selected horse`,
      cost: 0,
      requiresHorsePick: true,
      value: Math.floor(8 * comebackBonus)
    },
    {
      type: 'recovery',
      name: 'Rest Day',
      desc: 'Remove all fatigue from selected horse',
      cost: 0,
      requiresHorsePick: true
    },
    {
      type: 'veteran',
      name: 'Veteran Bonus',
      desc: `+${Math.floor(3 * comebackBonus)} to all stats for selected horse`,
      cost: 0,
      requiresHorsePick: true,
      value: Math.floor(3 * comebackBonus)
    },
    {
      type: 'stableSpeed',
      name: 'Better Training',
      desc: `+${Math.floor(2 * comebackBonus)} Speed to all horses`,
      cost: 0,
      value: Math.floor(2 * comebackBonus)
    },
    {
      type: 'newTrait',
      name: 'Trait Training',
      desc: 'Add a random trait to selected horse',
      cost: 0,
      requiresHorsePick: true
    },
    {
      type: 'buyHorse',
      name: 'Buy New Horse',
      desc: 'Choose from 3 specialized horses',
      cost: 0
    }
  ];
  
  // === CONDITIONAL UPGRADES ===
  
  // Breeding (requires 2+ horses)
  if (playerHorsesCount >= 2) {
    allOptions.push({
      type: 'breed',
      name: 'Breed Horses',
      desc: 'Combine two horses to create offspring',
      cost: 0
    });
  }
  
  // Miracle upgrade (only for very struggling players)
  if (comebackBonus >= 3) {
    allOptions.push({
      type: 'miracleHorse',
      name: 'Miracle Training',
      desc: '+15 Speed to selected horse',
      cost: 0,
      requiresHorsePick: true,
      value: 15
    });
  }
  
  // === ADVANCED UPGRADES ===
  
  // Trait-specific upgrades
  allOptions.push({
    type: 'addSprinter',
    name: 'Sprint Training',
    desc: 'Add Sprinter trait to selected horse',
    cost: 0,
    requiresHorsePick: true,
    traitToAdd: 'sprinter'
  });
  
  allOptions.push({
    type: 'addCloser',
    name: 'Endurance Training',
    desc: 'Add Closer trait to selected horse',
    cost: 0,
    requiresHorsePick: true,
    traitToAdd: 'closer'
  });
  
  allOptions.push({
    type: 'addVersatile',
    name: 'Versatility Training',
    desc: 'Add Versatile trait to selected horse',
    cost: 0,
    requiresHorsePick: true,
    traitToAdd: 'versatile'
  });
  
  // Stable-wide upgrades
  allOptions.push({
    type: 'stableRest',
    name: 'Spa Day',
    desc: 'Remove all fatigue from entire stable',
    cost: 0
  });
  
  allOptions.push({
    type: 'removeBadTrait',
    name: 'Behavioral Training',
    desc: 'Remove a negative trait from selected horse',
    cost: 0,
    requiresHorsePick: true
  });
  
  
  // Distance specialization
  allOptions.push({
    type: 'optimizeDistance',
    name: 'Distance Optimization',
    desc: 'Optimize selected horse for current race distance',
    cost: 0,
    requiresHorsePick: true
  });
  
  // === SELECTION LOGIC ===
  return selectUpgradeOptions(allOptions, comebackBonus);
}

// =============================================================================
// COMEBACK SYSTEM 💪
// =============================================================================

/**
 * Calculates comeback bonus multiplier based on player's financial situation
 * 
 * @param {number} raceNumber - Current race number  
 * @param {number} wallet - Player's current wallet
 * @returns {number} Comeback bonus multiplier (1.0 = normal, 3.0 = max boost)
 */
function calculateComebackBonus(raceNumber, wallet) {
  const { GAME_CONSTANTS } = window.GameConfig;
  
  const minEntryFee = Math.floor(10 * Math.pow(GAME_CONSTANTS.MIN_ENTRY_MULTIPLIER, raceNumber - 1));
  const affordabilityRatio = wallet / minEntryFee;
  
  // 🔧 MODIFY THESE THRESHOLDS TO CHANGE COMEBACK SYSTEM
  if (affordabilityRatio < 1.2) {
    return 3;    // Desperate situation - maximum help
  } else if (affordabilityRatio < 2) {
    return 2;    // Struggling - significant help
  } else if (affordabilityRatio < 4) {
    return 1.5;  // Mild difficulties - small help
  } else {
    return 1;    // Doing very well - normal upgrades
  }
}

/**
 * Selects which upgrade options to show the player
 */
function selectUpgradeOptions(allOptions, comebackBonus) {
  const { randomChoice, shuffleArray } = window.GameConfig;
  
  // If player is struggling, prioritize good upgrades
  if (comebackBonus > 1) {
    const goodOptions = allOptions.filter(opt => 
      ['speed', 'veteran', 'miracleHorse', 'newTrait', 'addSprinter', 'addCloser', 'addVersatile', 'removeBadTrait', 'stableRest'].includes(opt.type) && opt.cost === 0
    );
    const otherOptions = allOptions.filter(opt => !goodOptions.includes(opt));
    
    const selected = [
      randomChoice(goodOptions),
      ...shuffleArray(otherOptions).slice(0, 2)
    ];
    
    // Remove duplicates and limit to 3 options
    return selected.filter((opt, index, self) => 
      index === self.findIndex(o => o.type === opt.type)
    ).slice(0, 3);
  }
  
  // Normal selection - random 3 options
  return shuffleArray(allOptions).slice(0, 3);
}

// =============================================================================
// UPGRADE APPLICATION SYSTEM 🔧
// =============================================================================

/**
 * Applies an upgrade to a specific horse
 * 
 * @param {Object} upgrade - The upgrade to apply
 * @param {Object} horse - The horse to upgrade
 * @param {Array} allHorses - All player horses (for reference)
 * @param {number} raceDistance - Current race distance (optional)
 * @returns {Object} Updated horse object or null if upgrade doesn't apply to specific horses
 */
function applyUpgradeToHorse(upgrade, horse, allHorses, raceDistance = 1800) {
  const { clamp, randomChoice, TRAIT_DEFINITIONS } = window.GameConfig;
  
  switch (upgrade.type) {
    case 'speed':
      return {
        ...horse,
        speed: Math.min(100, horse.speed + upgrade.value)
      };
      
      
    case 'recovery':
      return {
        ...horse,
        fatigue: 0
      };
      
    case 'veteran':
      return {
        ...horse,
        speed: Math.min(100, horse.speed + upgrade.value)
      };
      
    case 'miracleHorse':
      return {
        ...horse,
        speed: Math.min(100, horse.speed + 15)
      };
      
    case 'newTrait':
      if (horse.traits.length < 3) {
        const availableTraits = Object.keys(TRAIT_DEFINITIONS).filter(t => !horse.traits.includes(t));
        if (availableTraits.length > 0) {
          return {
            ...horse,
            traits: [...horse.traits, randomChoice(availableTraits)]
          };
        }
      }
      return horse; // No change if horse already has 3 traits or no traits available
      
    // Specific trait additions
    case 'addSprinter':
    case 'addCloser':
    case 'addVersatile':
      if (horse.traits.length < 3 && !horse.traits.includes(upgrade.traitToAdd)) {
        return {
          ...horse,
          traits: [...horse.traits, upgrade.traitToAdd]
        };
      }
      return horse;
      
    case 'removeBadTrait':
      const negativeTraits = ['temperamental', 'lazy', 'nervous', 'brittle'];
      const badTraits = horse.traits.filter(t => negativeTraits.includes(t));
      if (badTraits.length > 0) {
        const traitToRemove = randomChoice(badTraits);
        return {
          ...horse,
          traits: horse.traits.filter(t => t !== traitToRemove)
        };
      }
      return horse;
      
    case 'optimizeDistance':
      // Optimize horse for the current race distance
      return {
        ...horse,
        distancePreference: raceDistance
      };
      
    default:
      return horse; // No change for unknown upgrade types
  }
}

/**
 * Applies an upgrade to all horses in the stable
 * 
 * @param {Object} upgrade - The upgrade to apply
 * @param {Array} horses - All player horses
 * @returns {Array} Updated horses array
 */
function applyUpgradeToAllHorses(upgrade, horses) {
  switch (upgrade.type) {
    case 'stableSpeed':
      return horses.map(horse => ({
        ...horse,
        speed: Math.min(100, horse.speed + upgrade.value),
        isUpgraded: true
      }));
      
    case 'stableRest':
      return horses.map(horse => ({
        ...horse,
        fatigue: 0,
        isUpgraded: true
      }));
      
    default:
      return horses; // No change for unknown upgrade types
  }
}

/**
 * Checks if an upgrade can be afforded and applied
 */
function canApplyUpgrade(upgrade, wallet, playerHorsesCount) {
  // Check if player can afford it
  if (upgrade.cost > wallet) {
    return { canApply: false, reason: 'Not enough money' };
  }
  
  // Check special requirements
  if (upgrade.type === 'breed' && playerHorsesCount < 2) {
    return { canApply: false, reason: 'Need at least 2 horses to breed' };
  }
  
  return { canApply: true };
}

// =============================================================================
// COMEBACK MECHANIC INFO 📊
// =============================================================================

/**
 * Gets information about the current comeback bonus for UI display
 */
function getComebackInfo(raceNumber, wallet) {
  const comebackBonus = calculateComebackBonus(raceNumber, wallet);
  
  if (comebackBonus >= 3) {
    return {
      isActive: true,
      level: 'Maximum',
      message: '💪 MAXIMUM Comeback Bonus Active! Triple upgrade values!',
      color: 'bg-red-50 text-red-800'
    };
  } else if (comebackBonus >= 2) {
    return {
      isActive: true,
      level: 'Strong',
      message: '💪 Strong Comeback Bonus Active! Double upgrade values!',
      color: 'bg-orange-50 text-orange-800'
    };
  } else if (comebackBonus > 1) {
    return {
      isActive: true,
      level: 'Minor',
      message: '💪 Comeback Bonus Active! Enhanced upgrade values!',
      color: 'bg-yellow-50 text-yellow-800'
    };
  } else {
    return {
      isActive: false,
      level: 'None',
      message: '',
      color: ''
    };
  }
}

// =============================================================================
// EXPORT FUNCTIONS FOR USE IN OTHER FILES
// =============================================================================

window.UpgradeSystem = {
  generateUpgradeOptions,
  calculateComebackBonus,
  applyUpgradeToHorse,
  applyUpgradeToAllHorses,
  canApplyUpgrade,
  getComebackInfo
};