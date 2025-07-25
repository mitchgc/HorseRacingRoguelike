/*
 * MAIN GAME APPLICATION 🎮
 * 
 * This file contains all the React components and game logic combined.
 * It uses JSX syntax which is compiled by Babel in the browser.
 */

const { useState, useEffect, useCallback, useMemo } = React;

// =============================================================================
// UI COMPONENTS 🎨
// =============================================================================

// Horse icon component
function HorseIcon({ color = '#8B4513', size = 'md' }) {
  const sizeClasses = {
    sm: 'w-4 h-4 text-xs',
    md: 'w-6 h-6 text-sm',
    lg: 'w-8 h-8 text-lg',
    xl: 'w-10 h-10 text-xl'
  };

  return (
    <div 
      className={`${sizeClasses[size]} rounded-full flex items-center justify-center`}
      style={{ backgroundColor: color }}
    >
      🏇
    </div>
  );
}

// Trait badge component
function TraitBadge({ trait }) {
  const { TRAIT_DEFINITIONS } = window.GameConfig;
  const traitDef = TRAIT_DEFINITIONS[trait];
  if (!traitDef) return null;

  const colorClasses = {
    yellow: 'bg-yellow-100 text-yellow-800',
    purple: 'bg-purple-100 text-purple-800', 
    blue: 'bg-blue-100 text-blue-800',
    orange: 'bg-orange-100 text-orange-800',
    green: 'bg-green-100 text-green-800',
    red: 'bg-red-100 text-red-800'
  };

  return (
    <span 
      className={`px-2 py-1 ${colorClasses[traitDef.color] || 'bg-gray-100 text-gray-800'} rounded text-xs font-medium cursor-help tooltip`}
      data-tooltip={`${traitDef.name}: ${traitDef.description} | Math Impact: ${traitDef.mathImpact}`}
    >
      {traitDef.icon} {traitDef.name}
    </span>
  );
}

// Header component
function Header({ wallet, raceNumber, horsesCount, raceDistance }) {
  const { GAME_CONSTANTS } = window.GameConfig;
  
  return (
    <div className="bg-white rounded-lg shadow-lg p-3 sm:p-6 mb-4 sm:mb-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
        <h1 className="text-xl sm:text-3xl font-bold text-green-700">🏇 Stable Manager</h1>
        <div className="flex flex-wrap justify-center gap-2 sm:gap-4 text-sm sm:text-lg">
          <span className="font-bold text-yellow-600">💰 ${wallet}</span>
          <span className="font-bold text-blue-600">🏁 Race {raceNumber}</span>
          <span className="font-bold text-purple-600">🐴 {horsesCount} Horses</span>
          <span className="font-bold text-green-600">📏 {raceDistance}m</span>
        </div>
      </div>
      {wallet >= GAME_CONSTANTS.WIN_CONDITION && (
        <div className="text-center mt-4 text-2xl font-bold text-green-600 animate-pulse">
          🎉 Victory is within reach! Reach ${GAME_CONSTANTS.WIN_CONDITION} to win! 🎉
        </div>
      )}
    </div>
  );
}

// Game over modal
function GameOverModal({ hasWon, onRestart }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 sm:p-8 max-w-md text-center">
        {hasWon ? (
          <>
            <h2 className="text-3xl sm:text-4xl font-bold text-green-600 mb-4">🏆 You Won! 🏆</h2>
            <p className="text-lg sm:text-xl mb-6">Congratulations! You've built a championship stable!</p>
          </>
        ) : (
          <>
            <h2 className="text-3xl sm:text-4xl font-bold text-red-600 mb-4">💔 Game Over 💔</h2>
            <p className="text-lg sm:text-xl mb-6">You ran out of money. Better luck next time!</p>
          </>
        )}
        <button
          onClick={onRestart}
          className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors text-lg font-bold"
        >
          Play Again
        </button>
      </div>
    </div>
  );
}

// Entry fee selector
function EntryFeeSelector({ fees, selectedFee, onSelectFee, wallet, raceNumber }) {
  const { calculatePrizePool } = window.RaceSystem;
  
  return (
    <div className="mb-6">
      <h3 className="text-base sm:text-lg font-bold mb-3">💰 Select Entry Fee & View Prize Money:</h3>
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4 text-sm">
        <div className="flex items-center mb-1">
          <span className="text-blue-600 mr-2">💡</span>
          <span className="font-medium text-blue-800">How it works:</span>
        </div>
        <div className="text-blue-700 ml-6">
          Pay the entry fee to race. Finish 1st, 2nd, or 3rd to win prize money!
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4">
        {fees.map((fee, index) => {
          const prizePool = calculatePrizePool(fee);
          return (
            <button
              key={index}
              onClick={() => onSelectFee(fee)}
              disabled={fee.amount > wallet}
              className={`p-3 sm:p-4 rounded-lg border-2 transition-all ${
                selectedFee?.amount === fee.amount
                  ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                  : fee.amount > wallet
                  ? 'border-gray-300 bg-gray-100 opacity-50 cursor-not-allowed'
                  : 'border-gray-300 hover:border-blue-400 hover:bg-blue-25'
              }`}
            >
              <div className="font-bold text-base sm:text-lg text-gray-800">
                ${fee.amount}
              </div>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span>🥇 1st:</span>
                  <span className="font-bold text-green-600">${prizePool.first}</span>
                </div>
                <div className="flex justify-between">
                  <span>🥈 2nd:</span>
                  <span className="font-bold text-gray-600">${prizePool.second}</span>
                </div>
                <div className="flex justify-between">
                  <span>🥉 3rd:</span>
                  <span className="font-bold text-orange-600">${prizePool.third}</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
      <div className="mt-3 text-xs text-gray-600 text-center">
        💡 Tip: Higher entry fees mean bigger prize pools but more risk!
      </div>
    </div>
  );
}

// Horse card component - Compact version
function HorseCard({ horse, isSelected, onSelect, raceDistance, getDistanceExpertise }) {
  const { TRAIT_DEFINITIONS } = window.GameConfig;
  const { calculateDistanceFit } = window.HorseSystem;
  
  const distanceFit = calculateDistanceFit(horse, raceDistance);
  const expertise = getDistanceExpertise(distanceFit);
  
  return (
    <div
      onClick={onSelect}
      className={`p-3 border-2 rounded-lg cursor-pointer transition-all ${
        isSelected 
          ? 'border-blue-500 bg-blue-50' 
          : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
      } ${horse.fatigue > 80 ? 'opacity-75' : ''}`}
    >
      <div className="flex items-start space-y-2 flex-col w-full">
        {/* Horse Name and Icon */}
        <div className="flex items-center space-x-3">
          <HorseIcon color={horse.color} size="md" />
          <div className="flex flex-col">
            <div className="font-bold text-sm">{horse.name}</div>
            {horse.fatigue > 0 && (
              <div className={`flex items-center space-x-1 text-xs ${horse.fatigue > 80 ? 'text-red-600' : horse.fatigue > 40 ? 'text-yellow-600' : 'text-orange-600'}`}>
                <span>😴</span>
                <span className="font-medium">Fatigue: {horse.fatigue}%</span>
              </div>
            )}
          </div>
        </div>
        
        {/* STATS SECTION */}
        <div className="w-full">
          <div className="text-xs font-semibold text-gray-700 mb-1">STATS</div>
          <div className="flex items-center space-x-3 bg-blue-50 rounded px-3 py-2">
            <div 
              className="text-xs cursor-help tooltip"
              data-tooltip="Speed: How fast this horse runs. Higher = better chance to win!"
            >
              <span className="text-gray-500">Speed:</span> <span className="font-bold text-blue-600">{horse.speed}</span>
            </div>
            <div 
              className="text-xs cursor-help tooltip"
              data-tooltip="Booster Power: Amplifies all trait and race effects. Higher = stronger trait bonuses!"
            >
              <span className="text-gray-500">Booster:</span> <span className="font-bold text-green-600">{horse.boosterPower}</span>
            </div>
          </div>
        </div>
        
        {/* DISTANCE EXPERTISE SECTION */}
        <div className="w-full">
          <div className="text-xs font-semibold text-gray-700 mb-1">DISTANCE EXPERTISE</div>
          <div 
            className={`flex items-center space-x-2 rounded px-3 py-2 cursor-help tooltip ${expertise.bgColor} ${expertise.color}`}
            data-tooltip={`Distance Preference: ${horse.distancePreference}m`}
          >
            <span className="text-sm">{expertise.icon}</span>
            <span className="text-xs font-medium">{expertise.text}</span>
          </div>
        </div>
        
        {/* TRAITS SECTION */}
        <div className="w-full">
          <div className="text-xs font-semibold text-gray-700 mb-1">TRAITS</div>
          {horse.traits.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {horse.traits.map(trait => {
                const traitDef = TRAIT_DEFINITIONS[trait];
                const isNegative = ['temperamental', 'lazy', 'nervous', 'brittle'].includes(trait);
                const traitColorClass = isNegative 
                  ? 'bg-red-100 text-red-800 border border-red-200' 
                  : 'bg-green-100 text-green-800 border border-green-200';
                
                return (
                  <span 
                    key={trait} 
                    className={`${traitColorClass} px-2 py-1 rounded text-xs font-medium cursor-help tooltip`}
                    data-tooltip={`${traitDef.name}: ${traitDef.description} | Math Impact: ${traitDef.mathImpact}`}
                  >
                    {traitDef.icon} {traitDef.name}
                  </span>
                );
              })}
            </div>
          ) : (
            <div className="text-xs text-gray-500 italic bg-gray-50 rounded px-3 py-2">No special traits</div>
          )}
        </div>
        
        {/* CONDITION */}
        {horse.fatigue > 0 && (
          <div className={`flex items-center space-x-2 rounded px-2 py-1 text-xs ${horse.fatigue > 80 ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
            <span>😴</span>
            <span>{horse.fatigue > 80 ? 'Very Tired' : 'Tired'}</span>
          </div>
        )}
      </div>
    </div>
  );
}

// Race track component
function RaceTrack({ horses, racePositions, selectedHorse, entryFee }) {
  const trackLength = 100;
  
  return (
    <div className="bg-white rounded-lg p-4 sm:p-6 shadow-lg">
      <h2 className="text-xl sm:text-2xl font-bold mb-4">🏁 Race in Progress! 🏁</h2>
      
      <div className="space-y-3">
        {horses.map((horse, index) => {
          const position = racePositions[horse.id]?.position || 0;
          const phaseInfo = racePositions[horse.id]?.phaseInfo;
          const finishPlace = racePositions[horse.id]?.finishPlace;
          const hasFinished = racePositions[horse.id]?.hasFinished;
          const isPlayer = horse.id === selectedHorse.id;
          
          // Medal display logic
          const getMedalDisplay = (place) => {
            if (place === 1) return { emoji: '🥇', text: '1st Place!', color: 'bg-yellow-100 text-yellow-800 font-bold' };
            if (place === 2) return { emoji: '🥈', text: '2nd Place!', color: 'bg-gray-100 text-gray-800 font-bold' };
            if (place === 3) return { emoji: '🥉', text: '3rd Place!', color: 'bg-orange-100 text-orange-800 font-bold' };
            return null;
          };
          
          const medal = hasFinished && finishPlace <= 3 ? getMedalDisplay(finishPlace) : null;
          
          return (
            <div key={horse.id} className="relative">
              {/* Horse name and info - Fixed height to prevent shifting */}
              <div className="flex items-center justify-between mb-1 h-6">
                <span className={`text-xs sm:text-sm font-medium ${isPlayer ? 'text-blue-600' : 'text-gray-700'}`}>
                  {horse.name} {isPlayer && '(You)'}
                </span>
                <div className="min-w-0 flex justify-end">
                  {medal ? (
                    <span className={`text-xs px-2 py-1 rounded animate-pulse ${medal.color}`}>
                      {medal.emoji} {medal.text}
                    </span>
                  ) : phaseInfo ? (
                    <span className={`text-xs px-2 py-1 rounded animate-pulse ${
                      phaseInfo.type === 'surge' ? 'bg-yellow-100 text-yellow-800 font-bold' :
                      phaseInfo.type === 'steady' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      ⚡ {phaseInfo.name}!
                    </span>
                  ) : (
                    <span className="text-xs px-2 py-1 invisible">placeholder</span>
                  )}
                </div>
              </div>
              
              {/* Race track */}
              <div className="relative h-8 bg-gray-200 rounded-full overflow-hidden">
                {/* Speed boost trail effect */}
                {phaseInfo?.type === 'surge' && (
                  <div 
                    className="absolute h-full bg-gradient-to-r from-transparent via-yellow-300 to-transparent opacity-50 animate-pulse"
                    style={{ 
                      width: `${Math.min(position + 15, 100)}%`,
                      background: 'linear-gradient(90deg, transparent, #fef08a 30%, #f59e0b 70%, transparent)'
                    }}
                  />
                )}
                
                {/* Main progress bar */}
                <div
                  className={`absolute h-full transition-all duration-300 ${
                    isPlayer 
                      ? phaseInfo?.type === 'surge' 
                        ? 'bg-gradient-to-r from-blue-400 to-blue-600' 
                        : 'bg-blue-500'
                      : phaseInfo?.type === 'surge'
                        ? 'bg-gradient-to-r from-gray-400 to-gray-600'
                        : 'bg-gray-500'
                  } ${phaseInfo?.type === 'surge' ? 'surge-glow shadow-lg' : ''}`}
                  style={{ width: `${position}%` }}
                >
                  {/* Sparkle effects for surge */}
                  {phaseInfo?.type === 'surge' && (
                    <>
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-ping" />
                      <div className="absolute top-0 left-1/2 w-1 h-1 bg-yellow-300 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                      <div className="absolute top-2 left-1/3 w-1 h-1 bg-yellow-300 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }} />
                      <div className="absolute top-1 right-1/4 w-1 h-1 bg-yellow-300 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    </>
                  )}
                  
                  {/* Horse icon with boost effects */}
                  <div className={`absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 ${
                    phaseInfo?.type === 'surge' ? 'animate-bounce' : ''
                  }`}>
                    {phaseInfo?.type === 'surge' && (
                      <div className="absolute -inset-2 bg-yellow-300 rounded-full opacity-60 animate-ping" />
                    )}
                    <HorseIcon color={horse.color} size="sm" />
                    {phaseInfo?.type === 'surge' && (
                      <div className="absolute -right-1 -top-1 text-xs animate-bounce">💨</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="mt-6 text-center">
        <div className="inline-flex items-center space-x-2 text-lg font-bold">
          <span className="animate-pulse">🏇</span>
          <span>Racing...</span>
          <span className="animate-pulse">🏇</span>
        </div>
      </div>
    </div>
  );
}

// Horse picker component
function HorsePicker({ horses, onSelect, title, raceDistance, getDistanceExpertise }) {
  const { TRAIT_DEFINITIONS } = window.GameConfig;
  const { calculateDistanceFit } = window.HorseSystem;
  
  return (
    <div className="bg-white rounded-lg p-4 sm:p-6 shadow-lg">
      <h2 className="text-xl sm:text-2xl font-bold mb-4">{title}</h2>
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="space-y-2">
          {[...horses].sort((a, b) => a.distancePreference - b.distancePreference).map(horse => {
            const distanceFit = calculateDistanceFit(horse, raceDistance);
            const expertise = getDistanceExpertise(distanceFit);
            
            return (
              <div 
                key={horse.id}
                onClick={() => onSelect(horse)}
                className="flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all bg-white hover:bg-blue-50 border border-gray-200 hover:border-blue-500"
              >
                <div className="grid grid-cols-4 gap-4 items-center w-full">
                  {/* Horse Name and Icon */}
                  <div className="flex items-center space-x-2 min-w-0">
                    <HorseIcon color={horse.color} size="sm" />
                    <div className="flex flex-col min-w-0">
                      <span className="text-sm font-bold text-blue-800 truncate">{horse.name}</span>
                      {horse.fatigue > 0 && (
                        <div className={`flex items-center space-x-1 text-xs ${horse.fatigue > 80 ? 'text-red-600' : horse.fatigue > 40 ? 'text-yellow-600' : 'text-orange-600'}`}>
                          <span>😴</span>
                          <span className="font-medium">Fatigue: {horse.fatigue}%</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* STATS */}
                  <div className="flex items-center justify-center">
                    <div className="flex items-center space-x-2 bg-blue-50 rounded px-3 py-1">
                      <div className="text-xs">
                        <span className="text-gray-600">Speed:</span> <span className="font-bold text-blue-700">{horse.speed}</span>
                      </div>
                      <div className="text-xs">
                        <span className="text-gray-600">Booster:</span> <span className="font-bold text-green-700">{horse.boosterPower}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* DISTANCE EXPERTISE */}
                  <div className="flex items-center justify-center">
                    <div 
                      className={`flex items-center space-x-1 rounded px-2 py-1 cursor-help tooltip ${expertise.bgColor} ${expertise.color}`}
                      data-tooltip={`Distance Preference: ${horse.distancePreference}m`}
                    >
                      <span className="text-sm">{expertise.icon}</span>
                      <span className="text-xs font-medium">{expertise.text}</span>
                    </div>
                  </div>
                  
                  {/* TRAITS */}
                  <div className="flex gap-1 flex-wrap justify-center min-w-0">
                    {horse.traits.length > 0 ? (
                      horse.traits.map(trait => {
                        const traitDef = TRAIT_DEFINITIONS[trait];
                        const isNegative = ['temperamental', 'lazy', 'nervous', 'brittle'].includes(trait);
                        const traitColorClass = isNegative 
                          ? 'bg-red-100 text-red-800 border border-red-200' 
                          : 'bg-green-100 text-green-800 border border-green-200';
                          
                        return (
                          <span 
                            key={trait} 
                            className={`${traitColorClass} px-1 py-0.5 rounded text-xs font-medium flex-shrink-0 cursor-help tooltip`}
                            data-tooltip={`${traitDef.name}: ${traitDef.description} | Math Impact: ${traitDef.mathImpact}`}
                          >
                            {traitDef.icon} {traitDef.name}
                          </span>
                        );
                      })
                    ) : (
                      <span className="text-xs text-gray-500 italic">No traits</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// Breeding interface component
function BreedingInterface({ horses, onBreed, onCancel, raceDistance, getDistanceExpertise }) {
  const [parent1, setParent1] = useState(null);
  const [parent2, setParent2] = useState(null);
  const { TRAIT_DEFINITIONS } = window.GameConfig;
  const { calculateDistanceFit } = window.HorseSystem;
  
  const canBreed = parent1 && parent2 && parent1.id !== parent2.id;
  
  return (
    <div className="bg-white rounded-lg p-4 sm:p-6 shadow-lg">
      <h2 className="text-xl sm:text-2xl font-bold mb-4">🐴 Breed Horses 🐴</h2>
      
      {/* Next Race Info */}
      <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex items-center justify-center space-x-2 mb-2">
          <span className="text-blue-600 font-semibold">🏁 Next Race:</span>
          <span className="text-blue-800 font-bold">{raceDistance}m</span>
          <span className="text-blue-600">
            ({raceDistance === 1000 ? 'Sprint' : raceDistance === 1800 ? 'Medium Distance' : 'Endurance'})
          </span>
        </div>
      </div>
      
      {/* Breeding Tips */}
      <div className="mb-6 p-4 bg-green-50 rounded-lg border border-green-200">
        <h3 className="font-bold text-green-800 mb-2">💡 Breeding Tips</h3>
        <div className="text-sm text-green-700 space-y-1">
          <div>• <strong>Stats:</strong> Offspring inherit average parent stats with variation</div>
          <div>• <strong>Distance:</strong> Choose parents with preferences close to upcoming race</div>
          <div>• <strong>Traits:</strong> Each parent trait has 60% chance to pass down</div>
          <div>• <strong>Bonus:</strong> 20% chance for offspring to gain a new random trait</div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Parent 1 Selection */}
        <div>
          <h3 className="font-bold mb-3">Select First Parent:</h3>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="space-y-2">
              {[...horses].sort((a, b) => a.distancePreference - b.distancePreference).map(horse => {
                const distanceFit = calculateDistanceFit(horse, raceDistance);
                const expertise = getDistanceExpertise(distanceFit);
                const isSelected = parent1?.id === horse.id;
                const isDisabled = parent2?.id === horse.id;
                
                return (
                  <div
                    key={horse.id}
                    onClick={() => !isDisabled && setParent1(horse)}
                    className={`p-2 rounded cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-blue-100 border-2 border-blue-500'
                        : isDisabled
                        ? 'bg-gray-100 border border-gray-300 cursor-not-allowed opacity-50'
                        : 'bg-white hover:bg-blue-50 border border-gray-200'
                    }`}
                  >
                    <div className="grid grid-cols-4 gap-2 items-center text-xs">
                      {/* Name & Fatigue */}
                      <div className="flex items-center space-x-1">
                        <HorseIcon color={horse.color} size="sm" />
                        <div>
                          <div className="font-bold truncate">{horse.name}</div>
                          {horse.fatigue > 0 && (
                            <div className={`text-xs ${horse.fatigue > 80 ? 'text-red-600' : horse.fatigue > 40 ? 'text-yellow-600' : 'text-orange-600'}`}>
                              😴 {horse.fatigue}%
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Stats */}
                      <div className="text-center">
                        <span className="text-gray-600">S:</span> <span className="font-bold">{horse.speed}</span>
                        <span className="mx-1">|</span>
                        <span className="text-gray-600">B:</span> <span className="font-bold">{horse.boosterPower}</span>
                      </div>
                      
                      {/* Distance */}
                      <div className="text-center">
                        <div 
                          className={`inline-block px-2 py-1 rounded cursor-help tooltip ${expertise.bgColor} ${expertise.color}`}
                          data-tooltip={`Distance Preference: ${horse.distancePreference}m`}
                        >
                          {expertise.text}
                        </div>
                      </div>
                      
                      {/* Traits */}
                      <div className="text-center">
                        {horse.traits.length > 0 ? (
                          <div className="flex gap-1 justify-center">
                            {horse.traits.map(trait => {
                              const traitDef = TRAIT_DEFINITIONS[trait];
                              return (
                                <span key={trait} title={traitDef.name}>
                                  {traitDef.icon}
                                </span>
                              );
                            })}
                          </div>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        
        {/* Parent 2 Selection */}
        <div>
          <h3 className="font-bold mb-3">Select Second Parent:</h3>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
            <div className="space-y-2">
              {[...horses].sort((a, b) => a.distancePreference - b.distancePreference).map(horse => {
                const distanceFit = calculateDistanceFit(horse, raceDistance);
                const expertise = getDistanceExpertise(distanceFit);
                const isSelected = parent2?.id === horse.id;
                const isDisabled = parent1?.id === horse.id;
                
                return (
                  <div
                    key={horse.id}
                    onClick={() => !isDisabled && setParent2(horse)}
                    className={`p-2 rounded cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-purple-100 border-2 border-purple-500'
                        : isDisabled
                        ? 'bg-gray-100 border border-gray-300 cursor-not-allowed opacity-50'
                        : 'bg-white hover:bg-purple-50 border border-gray-200'
                    }`}
                  >
                    <div className="grid grid-cols-4 gap-2 items-center text-xs">
                      {/* Name & Fatigue */}
                      <div className="flex items-center space-x-1">
                        <HorseIcon color={horse.color} size="sm" />
                        <div>
                          <div className="font-bold truncate">{horse.name}</div>
                          {horse.fatigue > 0 && (
                            <div className={`text-xs ${horse.fatigue > 80 ? 'text-red-600' : horse.fatigue > 40 ? 'text-yellow-600' : 'text-orange-600'}`}>
                              😴 {horse.fatigue}%
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Stats */}
                      <div className="text-center">
                        <span className="text-gray-600">S:</span> <span className="font-bold">{horse.speed}</span>
                        <span className="mx-1">|</span>
                        <span className="text-gray-600">B:</span> <span className="font-bold">{horse.boosterPower}</span>
                      </div>
                      
                      {/* Distance */}
                      <div className="text-center">
                        <div 
                          className={`inline-block px-2 py-1 rounded cursor-help tooltip ${expertise.bgColor} ${expertise.color}`}
                          data-tooltip={`Distance Preference: ${horse.distancePreference}m`}
                        >
                          {expertise.text}
                        </div>
                      </div>
                      
                      {/* Traits */}
                      <div className="text-center">
                        {horse.traits.length > 0 ? (
                          <div className="flex gap-1 justify-center">
                            {horse.traits.map(trait => {
                              const traitDef = TRAIT_DEFINITIONS[trait];
                              return (
                                <span key={trait} title={traitDef.name}>
                                  {traitDef.icon}
                                </span>
                              );
                            })}
                          </div>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      
      {/* Breeding Preview */}
      {parent1 && parent2 && (
        <div className="mt-6 p-4 bg-green-50 rounded-lg">
          <h4 className="font-bold mb-2">Breeding Preview:</h4>
          <div className="text-sm space-y-1">
            <p>Parent 1: {parent1.name} (Speed: {parent1.speed}, Booster: {parent1.boosterPower})</p>
            <p>Parent 2: {parent2.name} (Speed: {parent2.speed}, Booster: {parent2.boosterPower})</p>
            <p className="text-green-600 font-medium">
              Offspring will inherit traits and stats from both parents!
            </p>
          </div>
        </div>
      )}
      
      {/* Action Buttons */}
      <div className="mt-6 flex gap-4">
        <button
          onClick={() => canBreed && onBreed(parent1, parent2)}
          disabled={!canBreed}
          className={`flex-1 py-3 rounded-lg font-bold transition-colors ${
            canBreed
              ? 'bg-green-500 text-white hover:bg-green-600'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Breed Horses
        </button>
        <button
          onClick={onCancel}
          className="flex-1 bg-gray-500 text-white py-3 rounded-lg hover:bg-gray-600 transition-colors font-bold"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

// Horse Buying Interface Component
function HorseBuyingInterface({ horses, onPurchase, onCancel, getDistanceExpertise }) {
  const { TRAIT_DEFINITIONS, calculateDistanceFit } = window.HorseSystem || {};
  
  return (
    <div className="bg-white rounded-lg p-6 shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-center">🏪 Horse Market</h2>
      <p className="text-gray-600 mb-6 text-center">Choose your new horse - each specializes in different race distances</p>
      
      <div className="grid gap-4">
        {horses.map((horse, index) => {
          // Calculate distance expertise for each race distance
          const shortFit = calculateDistanceFit ? calculateDistanceFit(horse, 1000) : 0;
          const middleFit = calculateDistanceFit ? calculateDistanceFit(horse, 1800) : 0;
          const longFit = calculateDistanceFit ? calculateDistanceFit(horse, 2400) : 0;
          
          
          return (
            <div key={index} className="border-2 border-gray-300 rounded-lg p-4 hover:border-blue-400 transition-colors">
              {/* Horse Name and Basic Info */}
              <div className="flex items-center space-x-3 mb-4">
                <HorseIcon color={horse.color} size="lg" />
                <div>
                  <h3 className="text-lg font-bold">{horse.name}</h3>
                  <p className="text-sm text-gray-600">{horse.description}</p>
                </div>
              </div>
              
              {/* Stats */}
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">STATS</h4>
                <div className="flex items-center space-x-4 bg-blue-50 rounded px-3 py-2">
                  <div className="text-sm">Speed: <span className="font-bold text-blue-700">{horse.speed}</span></div>
                  <div className="text-sm">Booster: <span className="font-bold text-green-700">{horse.boosterPower}</span></div>
                </div>
              </div>
              
              {/* Distance Specializations */}
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">DISTANCE EXPERTISE</h4>
                <div className="grid grid-cols-3 gap-2 cursor-help tooltip" data-tooltip={`Distance Preference: ${horse.distancePreference}m`}>
                  {[
                    { distance: '1000m', fit: shortFit, label: 'Sprint' },
                    { distance: '1800m', fit: middleFit, label: 'Medium' },
                    { distance: '2400m', fit: longFit, label: 'Endurance' }
                  ].map(({distance, fit, label}) => {
                    const expertise = getDistanceExpertise(fit);
                    return (
                      <div key={distance} className={`text-center p-2 rounded ${expertise.bgColor}`}>
                        <div className="text-xs font-medium">{label}</div>
                        <div className="text-xs">{distance}</div>
                        <div className={`text-xs font-bold ${expertise.color}`}>{expertise.text}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              {/* Traits Hidden */}
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">TRAITS</h4>
                <div className="text-sm text-gray-500 italic bg-gray-50 rounded px-3 py-2">
                  Unknown - traits will be revealed after purchase
                </div>
              </div>
              
              {/* Purchase Button */}
              <button
                onClick={() => onPurchase(horse)}
                className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition-colors font-bold"
              >
                Purchase Horse
              </button>
            </div>
          );
        })}
      </div>
      
      {/* Cancel Button */}
      <div className="mt-6 text-center">
        <button
          onClick={onCancel}
          className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors font-bold"
        >
          Cancel Purchase
        </button>
      </div>
    </div>
  );
}

// =============================================================================
// MAIN GAME COMPONENT 🎯
// =============================================================================

function StableRacingGame() {
  const { GAME_CONSTANTS, GAME_PHASES, RACE_DISTANCES, randomChoice } = window.GameConfig;
  const { generateHorse, breedHorses } = window.HorseSystem;
  const { generateScoutReports, calculateHorseReputation } = window.ScoutSystem;
  const { simulateRace, processRaceResults, calculatePrizePool, processPlayerWinnings } = window.RaceSystem;
  const { generateUpgradeOptions, applyUpgradeToHorse, applyUpgradeToAllHorses, getComebackInfo } = window.UpgradeSystem;

  // === GAME STATE ===
  const [wallet, setWallet] = useState(GAME_CONSTANTS.INITIAL_WALLET);
  const [gamePhase, setGamePhase] = useState(GAME_PHASES.HORSE_SELECTION);
  const [playerHorses, setPlayerHorses] = useState([]);
  const [aiHorses, setAiHorses] = useState([]);
  const [selectedHorse, setSelectedHorse] = useState(null);
  const [selectedEntryFee, setSelectedEntryFee] = useState(null);
  const [raceResults, setRaceResults] = useState([]);
  const [raceNumber, setRaceNumber] = useState(1);
  const [racePositions, setRacePositions] = useState({});
  const [isRacing, setIsRacing] = useState(false);
  const [upgradeOptions, setUpgradeOptions] = useState([]);
  const [raceDistance, setRaceDistance] = useState(1200);
  const [nextRaceDistance, setNextRaceDistance] = useState(null);
  const [selectedBoost, setSelectedBoost] = useState(null);
  const [pendingUpgrade, setPendingUpgrade] = useState(null);
  const [lastRaceResult, setLastRaceResult] = useState(null);
  const [horseBuyingOptions, setHorseBuyingOptions] = useState([]);
  const [scoutReports, setScoutReports] = useState({});

  // === EFFECTS ===
  
  // Scroll to top when game phase changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [gamePhase]);

  // === CALCULATED VALUES ===
  
  // Calculate dynamic entry fees based on race number and wallet
  const entryFees = useMemo(() => {
    const minBet = Math.floor(10 * Math.pow(GAME_CONSTANTS.MIN_ENTRY_MULTIPLIER, raceNumber - 1));
    const maxAllowed = Math.min(wallet, 200);
    
    return [
      { amount: Math.min(minBet, maxAllowed), multiplier: 1, label: 'Min' },
      { amount: Math.min(Math.floor(minBet * 2.5), maxAllowed), multiplier: 2, label: 'Med' },
      { amount: Math.min(Math.floor(minBet * 5), maxAllowed), multiplier: 3, label: 'Max' }
    ].filter(fee => fee.amount <= wallet && fee.amount > 0);
  }, [raceNumber, wallet]);

  // Calculate prize pool for selected entry fee
  const prizePool = useMemo(() => 
    calculatePrizePool(selectedEntryFee), 
    [selectedEntryFee]
  );

  // === GAME INITIALIZATION ===
  
  // Initialize game with starting horses
  useEffect(() => {
    initializeGame();
  }, []);

  const initializeGame = useCallback(() => {
    // Create 3 starting horses with different distance preferences
    const startingHorses = [
      generateHorse(true, 1, 1000 + randomBetween(-400,400) ),  // Short distance specialist
      generateHorse(true, 1, 1800 + randomBetween(-400,400) ),  // Middle distance horse
      generateHorse(true, 1, 2400 + randomBetween(-400,400) ),  // Long distance specialist
    ];
    
    setPlayerHorses(startingHorses);
    setSelectedHorse(startingHorses[0]);
    
    // Set up first race
    generateNewRace();
  }, []);

  // === SHARED UTILITY FUNCTIONS ===
  
  // Distance expertise calculation - used for all horses
  const getDistanceExpertise = (fit) => {
    if (fit >= 0.95) return { text: 'Master (5)', color: 'text-purple-600', bgColor: 'bg-purple-50', icon: '👑' };
    if (fit >= 0.85) return { text: 'Expert (4)', color: 'text-green-600', bgColor: 'bg-green-50', icon: '⭐' };
    if (fit >= 0.70) return { text: 'Skilled (3)', color: 'text-blue-600', bgColor: 'bg-blue-50', icon: '💪' };
    if (fit >= 0.55) return { text: 'Decent (2)', color: 'text-yellow-600', bgColor: 'bg-yellow-50', icon: '👍' };
    if (fit >= 0.40) return { text: 'Learning (1)', color: 'text-orange-600', bgColor: 'bg-orange-50', icon: '📚' };
    return { text: 'Rookie (0)', color: 'text-red-600', bgColor: 'bg-red-50', icon: '🎯' };
  };

  // === RACE MANAGEMENT ===
  
  // Generate new race with AI horses and scout reports
  const generateHorseBuyingOptions = useCallback(() => {
    const { generateHorseBuyingOptions: generateOptions } = window.HorseSystem;
    const options = generateOptions(playerHorses);
    setHorseBuyingOptions(options);
  }, [playerHorses]);

  const generateNewRace = useCallback(() => {
    // Use the pre-generated next race distance if available, otherwise generate new
    const newDistance = nextRaceDistance || randomChoice(RACE_DISTANCES);
    setRaceDistance(newDistance);
    
    // Find player's best horse speed for AI scaling
    const playerBestSpeed = playerHorses.length > 0 
      ? Math.max(...playerHorses.map(h => h.speed))
      : GAME_CONSTANTS.BASE_SPEED;
    
    // Generate AI horses with player-relative scaling
    const newAiHorses = Array.from({ length: GAME_CONSTANTS.AI_HORSES_COUNT }, () => 
      generateHorse(false, raceNumber, null, playerBestSpeed)
    );
    setAiHorses(newAiHorses);
    
    // Generate scout reports
    const reports = generateScoutReports(newAiHorses, playerHorses, newDistance);
    setScoutReports(reports);
  }, [raceNumber, playerHorses, nextRaceDistance]);

  // Start a race
  const startRace = useCallback(() => {
    if (!selectedHorse || !selectedEntryFee || selectedEntryFee.amount > wallet) return;
    
    // Deduct entry fee
    setWallet(prev => prev - selectedEntryFee.amount);
    setGamePhase(GAME_PHASES.RACING);
    setIsRacing(true);
    
    // Add fatigue to selected horse
    setPlayerHorses(prev => prev.map(horse => 
      horse.id === selectedHorse.id 
        ? { ...horse, fatigue: Math.min(100, horse.fatigue + GAME_CONSTANTS.FATIGUE_PER_RACE) }
        : horse
    ));
    
    // Start race simulation
    const allHorses = [selectedHorse, ...aiHorses];
    simulateRace(
      allHorses,
      selectedHorse,
      selectedBoost,
      raceDistance,
      setRacePositions,  // Position update callback
      handleRaceFinish   // Race finish callback
    );
  }, [selectedHorse, selectedEntryFee, wallet, aiHorses, selectedBoost, raceDistance]);

  // Handle race completion
  const handleRaceFinish = useCallback((raceData) => {
    const sortedResults = processRaceResults(raceData);
    setRaceResults(sortedResults);
    
    // Calculate player winnings
    const playerResult = processPlayerWinnings(sortedResults, selectedHorse, prizePool);
    
    if (playerResult.winnings > 0) {
      setWallet(prev => prev + playerResult.winnings);
    }
    
    setLastRaceResult(playerResult);
    setSelectedBoost(null);
    setIsRacing(false);
    setGamePhase(GAME_PHASES.POST_RACE);
  }, [selectedHorse, prizePool]);

  // === UPGRADE SYSTEM ===
  
  // Generate upgrade options when entering post-race phase
  useEffect(() => {
    if (gamePhase === GAME_PHASES.POST_RACE) {
      const options = generateUpgradeOptions(raceNumber, wallet, playerHorses.length);
      setUpgradeOptions(options);
      
      // Generate next race distance for upgrade/breeding decisions
      const nextDistance = randomChoice(RACE_DISTANCES);
      setNextRaceDistance(nextDistance);
    }
  }, [gamePhase, raceNumber, wallet]);

  // Apply an upgrade
  const applyUpgrade = useCallback((upgrade) => {
    if (upgrade.requiresHorsePick) {
      setPendingUpgrade(upgrade);
      setGamePhase(GAME_PHASES.HORSE_PICKER);
      return;
    }
    
    // Apply upgrades that affect all horses
    switch (upgrade.type) {
      case 'stableSpeed':
      case 'stableConsistency':
        setPlayerHorses(prev => applyUpgradeToAllHorses(upgrade, prev));
        break;
        
      case 'buyHorse':
        generateHorseBuyingOptions();
        setGamePhase(GAME_PHASES.HORSE_BUYING);
        return;
        
      case 'breed':
        setGamePhase(GAME_PHASES.BREEDING);
        return;
    }
    
    proceedToNextRace();
  }, [raceNumber]);

  // Apply upgrade to specific horse
  const applyUpgradeToSpecificHorse = useCallback((horse) => {
    if (!pendingUpgrade) return;
    
    setPlayerHorses(prev => prev.map(h => 
      h.id === horse.id ? applyUpgradeToHorse(pendingUpgrade, h, prev) : h
    ));
    
    setPendingUpgrade(null);
    proceedToNextRace();
  }, [pendingUpgrade]);

  // === BREEDING SYSTEM ===
  
  // Handle horse breeding
  const handleBreeding = useCallback((parent1, parent2) => {
    const offspring = breedHorses(parent1, parent2);
    setPlayerHorses(prev => [...prev, offspring]);
    proceedToNextRace();
  }, []);

  // Handle horse purchase  
  const handleHorsePurchase = useCallback((horse) => {
    // Add the purchased horse to stable
    const purchasedHorse = {
      ...horse,
      traits: horse.traits // Keep the traits (they were hidden during selection)
    };
    
    setPlayerHorses(prev => [...prev, purchasedHorse]);
    proceedToNextRace();
  }, [proceedToNextRace]);

  // === GAME FLOW ===
  
  // Proceed to next race
  const proceedToNextRace = useCallback(() => {
    setRaceNumber(prev => prev + 1);
    generateNewRace();
    setNextRaceDistance(null); // Clear the pre-generated distance after using it
    setGamePhase(GAME_PHASES.HORSE_SELECTION);
    setRaceResults([]);
    setRacePositions({});
    setSelectedEntryFee(null);
  }, [generateNewRace]);

  // Restart entire game
  const restartGame = useCallback(() => {
    setWallet(GAME_CONSTANTS.INITIAL_WALLET);
    setRaceNumber(1);
    setGamePhase(GAME_PHASES.HORSE_SELECTION);
    setRaceResults([]);
    setRacePositions({});
    setSelectedEntryFee(null);
    setSelectedBoost(null);
    setPendingUpgrade(null);
    setLastRaceResult(null);
    initializeGame();
  }, [initializeGame]);

  // === GAME STATE CHECKS ===
  
  const hasWon = wallet >= GAME_CONSTANTS.WIN_CONDITION;
  const hasLost = gamePhase === GAME_PHASES.POST_RACE && 
                  wallet === 0 && 
                  lastRaceResult && 
                  lastRaceResult.position >= 3;

  // === ACTION BAR COMPONENT ===
  
  const ActionBar = () => {
    if (gamePhase === GAME_PHASES.HORSE_SELECTION && selectedHorse && selectedEntryFee) {
      return (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-300 p-4 shadow-lg z-40">
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
            <div className="text-sm sm:text-lg text-center sm:text-left">
              <span className="font-bold">Selected:</span> {selectedHorse.name} | 
              <span className="font-bold ml-2">Entry:</span> ${selectedEntryFee.amount}
            </div>
            <button
              onClick={startRace}
              className="bg-green-500 text-white px-6 sm:px-8 py-3 rounded-lg hover:bg-green-600 transition-colors text-base sm:text-lg font-bold w-full sm:w-auto"
            >
              Start Race 🏁
            </button>
          </div>
        </div>
      );
    }
    return null;
  };

  // === MAIN RENDER ===
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-800 to-green-600 p-2 sm:p-4">
      <div className="max-w-6xl mx-auto">
        <Header 
          wallet={wallet} 
          raceNumber={raceNumber} 
          horsesCount={playerHorses.length} 
          raceDistance={raceDistance} 
        />

        {(hasWon || hasLost) && (
          <GameOverModal hasWon={hasWon} onRestart={restartGame} />
        )}

        {/* Horse Selection Phase */}
        {gamePhase === GAME_PHASES.HORSE_SELECTION && (
          <div className="pb-24 sm:pb-32">
            {/* Beginner Tutorial for First Race */}
            {raceNumber === 1 && (
              <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 mb-6 shadow-lg">
                <div className="flex items-start space-x-3">
                  <div className="text-2xl">🏇</div>
                  <div>
                    <h3 className="font-bold text-green-800 mb-2">Welcome to Stable Manager!</h3>
                    <div className="text-sm text-green-700 space-y-1">
                      <div>• <strong>Goal:</strong> Build your stable to $1,000 wealth</div>
                      <div>• <strong>How to play:</strong> Pick an entry fee → Select your best horse → Race!</div>
                      <div>• <strong>Win money:</strong> Finish 1st, 2nd, or 3rd place to earn prize money</div>
                      <div>• <strong>Strategy:</strong> Match horses to race distances and manage your horses' fatigue</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div className="bg-white rounded-lg p-4 sm:p-6 shadow-lg">
              <h2 className="text-xl sm:text-2xl font-bold mb-4">
                🏁 Race {raceNumber} - Choose Your Strategy
              </h2>
              
              <EntryFeeSelector
                fees={entryFees}
                selectedFee={selectedEntryFee}
                onSelectFee={setSelectedEntryFee}
                wallet={wallet}
                raceNumber={raceNumber}
              />
              
              {entryFees.length === 0 && (
                <div className="text-red-600 font-bold text-center mb-4">
                  ⚠️ Not enough money for entry fees! You need at least ${Math.floor(10 * Math.pow(GAME_CONSTANTS.MIN_ENTRY_MULTIPLIER, raceNumber - 1))}
                </div>
              )}
              
              {/* Player Horses */}
              <div className="mb-6">
                <h3 className="text-base sm:text-lg font-bold mb-3 text-blue-600">🏇 Your Stable - Select Your Champion</h3>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="space-y-2">
                    {[...playerHorses].sort((a, b) => a.distancePreference - b.distancePreference).map(horse => {
                      const { calculateDistanceFit } = window.HorseSystem;
                      const distanceFit = calculateDistanceFit(horse, raceDistance);
                      const expertise = getDistanceExpertise(distanceFit);
                      
                      return (
                        <div 
                          key={horse.id}
                          onClick={() => setSelectedHorse(horse)}
                          className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all ${
                            selectedHorse?.id === horse.id
                              ? 'bg-blue-100 border-2 border-blue-500'
                              : 'bg-white hover:bg-blue-50 border border-gray-200'
                          }`}
                        >
                          <div className="grid grid-cols-4 gap-4 items-center w-full">
                            {/* Horse Name and Icon */}
                            <div className="flex items-center space-x-2 min-w-0">
                              <HorseIcon color={horse.color} size="sm" />
                              <div className="flex flex-col min-w-0">
                                <span className="text-sm font-bold text-blue-800 truncate">{horse.name}</span>
                                {horse.fatigue > 0 && (
                                  <div className={`flex items-center space-x-1 text-xs ${horse.fatigue > 80 ? 'text-red-600' : horse.fatigue > 40 ? 'text-yellow-600' : 'text-orange-600'}`}>
                                    <span>😴</span>
                                    <span className="font-medium">Fatigue: {horse.fatigue}%</span>
                                  </div>
                                )}
                              </div>
                            </div>
                            
                            {/* STATS */}
                            <div className="flex items-center justify-center">
                              <div className="flex items-center space-x-2 bg-blue-50 rounded px-3 py-1">
                                <div className="text-xs">
                                  <span className="text-gray-600">Speed:</span> <span className="font-bold text-blue-700">{horse.speed}</span>
                                </div>
                                <div className="text-xs">
                                  <span className="text-gray-600">Booster:</span> <span className="font-bold text-green-700">{horse.boosterPower}</span>
                                </div>
                              </div>
                            </div>
                            
                            {/* DISTANCE EXPERTISE */}
                            <div className="flex items-center justify-center">
                              <div 
                                className={`flex items-center space-x-1 rounded px-2 py-1 cursor-help tooltip ${expertise.bgColor} ${expertise.color}`}
                                data-tooltip={`Distance Preference: ${horse.distancePreference}m`}
                              >
                                <span className="text-sm">{expertise.icon}</span>
                                <span className="text-xs font-medium">{expertise.text}</span>
                              </div>
                            </div>
                            
                            {/* TRAITS */}
                            <div className="flex gap-1 flex-wrap justify-center min-w-0">
                              {horse.traits.length > 0 ? (
                                horse.traits.map(trait => {
                                  const traitDef = TRAIT_DEFINITIONS[trait];
                                  const isNegative = ['temperamental', 'lazy', 'nervous', 'brittle'].includes(trait);
                                  const traitColorClass = isNegative 
                                    ? 'bg-red-100 text-red-800 border border-red-200' 
                                    : 'bg-green-100 text-green-800 border border-green-200';
                                    
                                  return (
                                    <span 
                                      key={trait} 
                                      className={`${traitColorClass} px-1 py-0.5 rounded text-xs font-medium flex-shrink-0 cursor-help tooltip`}
                                      data-tooltip={`${traitDef.name}: ${traitDef.description} | Math Impact: ${traitDef.mathImpact}`}
                                    >
                                      {traitDef.icon} {traitDef.name}
                                    </span>
                                  );
                                })
                              ) : (
                                <span className="text-xs text-gray-500 italic">No traits</span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Scout Report */}
              <div className="mt-6">
                <h3 className="text-base sm:text-lg font-bold mb-3 text-red-600">🕵️ Scout Report - Your Competition</h3>
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-3 text-sm">
                  <div className="flex items-center mb-1">
                    <span className="text-red-600 mr-2">💡</span>
                    <span className="font-medium text-red-800">Intel on your opponents:</span>
                  </div>
                  <div className="text-red-700 ml-6">
                    Check their traits and reputation to plan your strategy!
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="space-y-2">
                    {[...aiHorses].sort((a, b) => {
                      // Calculate estimated speeds as shown to player
                      const aVisible = (a.id * 1234) % 10 >= 4;
                      const bVisible = (b.id * 1234) % 10 >= 4;
                      
                      const aEstimatedSpeed = aVisible ? Math.floor(a.speed * 0.85 + ((a.id * 777) % 30)) : a.speed;
                      const bEstimatedSpeed = bVisible ? Math.floor(b.speed * 0.85 + ((b.id * 777) % 30)) : b.speed;
                      
                      return bEstimatedSpeed - aEstimatedSpeed; // Sort by estimated speed descending
                    }).map(horse => {
                      const reputation = calculateHorseReputation(horse);
                      const scoutNotes = scoutReports[horse.id] || [];
                      const { calculateDistanceFit } = window.HorseSystem;
                      const distanceFit = calculateDistanceFit(horse, raceDistance);
                      const expertise = getDistanceExpertise(distanceFit);
                      
                      return (
                        <div key={horse.id} className="border-b border-gray-200 pb-2 last:border-b-0">
                          <div className="p-3 rounded-lg bg-white border border-gray-200">
                            <div className="grid grid-cols-4 gap-4 items-center w-full">
                              {/* Horse Name and Icon */}
                              <div className="flex items-center space-x-2 min-w-0">
                                <HorseIcon color={horse.color} size="sm" />
                                <span className="text-sm font-bold text-red-800 truncate">{horse.name}</span>
                              </div>
                              
                              {/* STATS - 60% chance to show */}
                              <div className="flex items-center justify-center">
                                {(horse.id * 1234) % 10 >= 4 ? (
                                  <div className="flex items-center space-x-2 bg-red-50 rounded px-3 py-1">
                                    <div className="text-xs cursor-help tooltip" data-tooltip="Speed: How fast this horse runs. Higher = better chance to win!">
                                      <span className="text-gray-600">Speed:</span> <span className="font-bold text-red-700">{Math.floor(horse.speed * 0.85 + ((horse.id * 777) % 30))}</span>
                                    </div>
                                    <div className="text-xs cursor-help tooltip" data-tooltip="Booster Power: Amplifies all trait and race effects. Higher = stronger trait bonuses!">
                                      <span className="text-gray-600">Booster:</span> <span className="font-bold text-green-700">{Math.floor(horse.boosterPower * 0.85 + ((horse.id * 888) % 30))}</span>
                                    </div>
                                  </div>
                                ) : (
                                  (() => {
                                    // Calculate threat level based on speed comparison to best player horse
                                    const bestPlayerSpeed = Math.max(...playerHorses.map(h => h.speed));
                                    const threatRatio = horse.speed / bestPlayerSpeed;
                                    
                                    let threatLevel, threatColor, threatIcon;
                                    if (threatRatio > 1.4) {
                                      threatLevel = 'MAJOR THREAT';
                                      threatColor = 'text-red-700 bg-red-100';
                                      threatIcon = '⚠️';
                                    } else if (threatRatio > 1.2) {
                                      threatLevel = 'Strong';
                                      threatColor = 'text-orange-700 bg-orange-100';
                                      threatIcon = '⚡';
                                    } else if (threatRatio > 1.0) {
                                      threatLevel = 'Competitive';
                                      threatColor = 'text-yellow-700 bg-yellow-100';
                                      threatIcon = '💪';
                                    } else if (threatRatio > 0.85) {
                                      threatLevel = 'Moderate';
                                      threatColor = 'text-blue-700 bg-blue-100';
                                      threatIcon = '👍';
                                    } else {
                                      threatLevel = 'Weak';
                                      threatColor = 'text-green-700 bg-green-100';
                                      threatIcon = '😴';
                                    }
                                    
                                    return (
                                      <div className={`flex items-center space-x-1 rounded px-2 py-1 text-xs cursor-help tooltip ${threatColor}`} data-tooltip={`Threat Level: Based on scout's assessment of their speed relative to your best horse`}>
                                        <span>{threatIcon}</span>
                                        <span className="font-medium">{threatLevel}</span>
                                      </div>
                                    );
                                  })()
                                )}
                              </div>
                              
                              {/* DISTANCE EXPERTISE - 60% chance to show */}
                              <div className="flex items-center justify-center">
                                {(horse.id * 5678) % 10 >= 4 ? (
                                  <div 
                                    className={`flex items-center space-x-1 rounded px-2 py-1 cursor-help tooltip ${expertise.bgColor} ${expertise.color}`}
                                    data-tooltip={`Distance Preference: ${horse.distancePreference}m`}
                                  >
                                    <span className="text-sm">{expertise.icon}</span>
                                    <span className="text-xs font-medium">{expertise.text}</span>
                                  </div>
                                ) : (
                                  <span className="text-xs text-gray-500 italic">Distance unknown</span>
                                )}
                              </div>
                              
                              {/* TRAITS - 60% chance to show each trait */}
                              <div className="flex gap-1 flex-wrap justify-center min-w-0">
                                {(() => {
                                  const visibleTraits = horse.traits.filter((trait, index) => 
                                    ((horse.id * (index + 100) * 91) % 10) >= 4
                                  );
                                  
                                  if (visibleTraits.length > 0) {
                                    return visibleTraits.map(trait => {
                                      const traitDef = TRAIT_DEFINITIONS[trait];
                                      const isNegative = ['temperamental', 'lazy', 'nervous', 'brittle'].includes(trait);
                                      const traitColorClass = isNegative 
                                        ? 'bg-red-100 text-red-800 border border-red-200' 
                                        : 'bg-green-100 text-green-800 border border-green-200';
                                      
                                      return (
                                        <span 
                                          key={trait}
                                          className={`${traitColorClass} px-1 py-0.5 rounded text-xs font-medium cursor-help tooltip flex-shrink-0`}
                                          data-tooltip={`${traitDef.name}: ${traitDef.description} | Math Impact: ${traitDef.mathImpact}`}
                                        >
                                          {traitDef.icon} {traitDef.name}
                                        </span>
                                      );
                                    });
                                  } else {
                                    return <span className="text-xs text-gray-500 italic">Traits unknown</span>;
                                  }
                                })()}
                              </div>
                              
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Racing Phase */}
        {gamePhase === GAME_PHASES.RACING && (
          <RaceTrack
            horses={[selectedHorse, ...aiHorses]}
            racePositions={racePositions}
            selectedHorse={selectedHorse}
            entryFee={selectedEntryFee}
          />
        )}

        {/* Horse Picker for Upgrades */}
        {gamePhase === GAME_PHASES.HORSE_PICKER && (
          <HorsePicker
            horses={playerHorses}
            onSelect={applyUpgradeToSpecificHorse}
            title={`Select horse for: ${pendingUpgrade?.name}`}
            raceDistance={nextRaceDistance || raceDistance}
            getDistanceExpertise={getDistanceExpertise}
          />
        )}

        {/* Breeding Interface */}
        {gamePhase === GAME_PHASES.BREEDING && (
          <BreedingInterface
            horses={playerHorses}
            onBreed={handleBreeding}
            onCancel={proceedToNextRace}
            raceDistance={nextRaceDistance || raceDistance}
            getDistanceExpertise={getDistanceExpertise}
          />
        )}

        {/* Horse Buying Interface */}
        {gamePhase === GAME_PHASES.HORSE_BUYING && (
          <HorseBuyingInterface
            horses={horseBuyingOptions}
            onPurchase={handleHorsePurchase}
            onCancel={proceedToNextRace}
            getDistanceExpertise={getDistanceExpertise}
          />
        )}

        {/* Post Race Results and Upgrades */}
        {gamePhase === GAME_PHASES.POST_RACE && (
          <div className="space-y-6">
            {/* Upgrade Options */}
            <div className="bg-white rounded-lg p-4 sm:p-6 shadow-lg">
              <h2 className="text-xl sm:text-2xl font-bold mb-4">Choose an Upgrade</h2>
              
              {/* Next Race Info */}
              <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center justify-center space-x-2">
                  <span className="text-blue-600 font-semibold">🏁 Next Race:</span>
                  <span className="text-blue-800 font-bold text-lg">{nextRaceDistance || raceDistance}m</span>
                  <span className="text-blue-600">
                    ({(nextRaceDistance || raceDistance) === 1000 ? 'Sprint' : (nextRaceDistance || raceDistance) === 1800 ? 'Medium Distance' : 'Endurance'})
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {upgradeOptions.map((upgrade, index) => (
                  <div
                    key={index}
                    onClick={() => applyUpgrade(upgrade)}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      upgrade.cost > wallet
                        ? 'border-gray-300 bg-gray-100 opacity-50 cursor-not-allowed'
                        : 'border-gray-300 hover:border-blue-500 hover:bg-blue-50'
                    }`}
                  >
                    <h3 className="font-bold text-base sm:text-lg mb-2">{upgrade.name}</h3>
                    <p className="text-sm text-gray-600 mb-3">{upgrade.desc}</p>
                    {upgrade.cost > 0 ? (
                      <div className={`text-base sm:text-lg font-bold ${upgrade.cost > wallet ? 'text-red-600' : 'text-green-600'}`}>
                        Cost: ${upgrade.cost}
                      </div>
                    ) : (
                      <div className="text-base sm:text-lg font-bold text-green-600">FREE</div>
                    )}
                  </div>
                ))}
              </div>
              
              {/* Comeback Bonus Indicator */}
              {(() => {
                const comebackInfo = getComebackInfo(raceNumber, wallet);
                if (comebackInfo.isActive) {
                  return (
                    <div className={`mt-4 p-3 rounded-lg text-center ${comebackInfo.color}`}>
                      <span className="text-sm">
                        {comebackInfo.message}
                      </span>
                    </div>
                  );
                }
                return null;
              })()}
            </div>

            {/* Race Results */}
            <div className="bg-white rounded-lg p-4 sm:p-6 shadow-lg">
              <h2 className="text-xl sm:text-2xl font-bold mb-4">Race {raceNumber} Results</h2>
              <div className="space-y-2">
                {raceResults.map((horse, index) => (
                  <div 
                    key={horse.id} 
                    className={`flex items-center justify-between p-3 rounded ${
                      index === 0 ? 'bg-yellow-100' : 
                      index === 1 ? 'bg-gray-100' : 
                      index === 2 ? 'bg-orange-100' : 'bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="font-bold text-lg">#{index + 1}</span>
                      <span className="font-medium text-sm sm:text-base">{horse.name}</span>
                      {horse.isPlayer && (
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs sm:text-sm">
                          Your Horse
                        </span>
                      )}
                      <div className="flex gap-1">
                        {horse.traits.map(trait => (
                          <span key={trait} className="text-xs">
                            {window.GameConfig.TRAIT_DEFINITIONS[trait].icon}
                          </span>
                        ))}
                      </div>
                    </div>
                    {index === 0 && <span className="text-2xl">🏆</span>}
                  </div>
                ))}
              </div>
              
              {/* Results Summary */}
              <div className="mt-4 p-4 border-t">
                {lastRaceResult && (
                  lastRaceResult.position < 3 ? (
                    <div className="text-green-600 font-bold text-base sm:text-lg">
                      🎉 {['1st', '2nd', '3rd'][lastRaceResult.position]} Place! {selectedHorse.name} won ${lastRaceResult.winnings}!
                    </div>
                  ) : (
                    <div className="text-red-600 font-bold text-base sm:text-lg">
                      ❌ {selectedHorse.name} finished {lastRaceResult.position + 1}th. No prize money.
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        )}

        <ActionBar />
      </div>
    </div>
  );
}

// Export the game component
window.StableRacingGame = StableRacingGame;