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

// Game Guide Component
function GameGuide({ onStartGame }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-800 to-green-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full p-6 sm:p-10">
        <div className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-green-700 mb-4">
            🏇 Stable Manager 🏇
          </h1>
          <p className="text-lg text-gray-600">Build the ultimate horse racing stable!</p>
        </div>
        
        {/* Start Button - Moved to top for experienced players */}
        <button
          onClick={onStartGame}
          className="w-full bg-green-500 text-white text-xl font-bold py-4 rounded-lg hover:bg-green-600 transition-all transform hover:scale-105 shadow-lg mb-8"
        >
          🏁 Start Playing! 🏁
        </button>
        
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* How to Play */}
          <div className="bg-blue-50 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-blue-700 mb-4">📖 How to Play</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-start">
                <span className="text-blue-600 mr-2">1.</span>
                <div>
                  <strong>Select Your Horse:</strong> Choose from your stable based on race distance and condition
                </div>
              </div>
              <div className="flex items-start">
                <span className="text-blue-600 mr-2">2.</span>
                <div>
                  <strong>Pick Entry Fee:</strong> Higher fees mean bigger prizes - but greater risk!
                </div>
              </div>
              <div className="flex items-start">
                <span className="text-blue-600 mr-2">3.</span>
                <div>
                  <strong>Watch the Race:</strong> Your horse will compete based on stats, traits, and luck
                </div>
              </div>
              <div className="flex items-start">
                <span className="text-blue-600 mr-2">4.</span>
                <div>
                  <strong>Win Prizes:</strong> Finish 1st, 2nd, or 3rd to earn money
                </div>
              </div>
              <div className="flex items-start">
                <span className="text-blue-600 mr-2">5.</span>
                <div>
                  <strong>Upgrade & Breed:</strong> Improve your stable between races
                </div>
              </div>
            </div>
          </div>
          
          {/* Key Concepts */}
          <div className="bg-green-50 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-green-700 mb-4">🔑 Key Concepts</h2>
            <div className="space-y-3 text-sm">
              <div>
                <strong className="text-green-700">🎯 Goal:</strong> Build your wealth to $1,000 to win!
              </div>
              <div>
                <strong className="text-green-700">📏 Distance Match:</strong> Horses perform best at their preferred distance
              </div>
              <div>
                <strong className="text-green-700">⚡ Traits:</strong> Special abilities that affect race performance
              </div>
              <div>
                <strong className="text-green-700">😴 Fatigue:</strong> Racing tires horses - rest them or they'll underperform
              </div>
              <div>
                <strong className="text-green-700">🔥 Surge Events:</strong> Random speed boosts during races
              </div>
              <div>
                <strong className="text-green-700">🐴 Breeding:</strong> Combine horses to create better offspring
              </div>
            </div>
          </div>
        </div>
        
        {/* Strategy Tips */}
        <div className="bg-yellow-50 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-yellow-700 mb-4">💡 Strategy Tips</h2>
          <div className="grid sm:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-yellow-600">📊</span> <strong>Match horses to race distances</strong> for best results
            </div>
            <div>
              <span className="text-yellow-600">💰</span> <strong>Balance risk vs reward</strong> with entry fees
            </div>
            <div>
              <span className="text-yellow-600">🧬</span> <strong>Breed horses with complementary traits</strong>
            </div>
            <div>
              <span className="text-yellow-600">🕵️</span> <strong>Study the competition</strong> before racing
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Utility function to sort horses by performance and distance fit
function sortHorsesByPerformance(horses) {
  return [...horses].sort((a, b) => {
    // Always sort by speed
    return b.speed - a.speed;
  });
}

// Tab-based Horse Selection Component  
function HorseSelectionTabs({ playerHorses, aiHorses, selectedHorse, setSelectedHorse, raceDistance, getDistanceExpertise }) {
  const [activeTab, setActiveTab] = useState('stable');
  
  return (
    <div className="pb-20"> {/* Add bottom padding for banner */}
      {/* Mobile - Tab Navigation */}
      <div className="block lg:hidden">
        <div className="bg-white rounded-lg shadow-lg">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('stable')}
              className={`flex-1 py-4 px-6 text-center font-bold transition-colors ${
                activeTab === 'stable'
                  ? 'bg-blue-500 text-white border-b-2 border-blue-500'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              🏇 Your Stable ({playerHorses.length})
            </button>
            <button
              onClick={() => setActiveTab('competition')}
              className={`flex-1 py-4 px-6 text-center font-bold transition-colors ${
                activeTab === 'competition'
                  ? 'bg-red-500 text-white border-b-2 border-red-500'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              🕵️ Competition ({aiHorses.length})
            </button>
          </div>
          
          {/* Tab Content */}
          <div className="p-4">
            {activeTab === 'stable' && (
              <div>
                <div className="space-y-3">
                  {sortHorsesByPerformance(playerHorses).map(horse => (
                    <HorseCard
                      key={horse.id}
                      horse={horse}
                      isSelected={selectedHorse?.id === horse.id}
                      onSelect={() => setSelectedHorse(horse)}
                      raceDistance={raceDistance}
                      getDistanceExpertise={getDistanceExpertise}
                      isPlayerHorse={true}
                    />
                  ))}
                </div>
              </div>
            )}
            
            {activeTab === 'competition' && (
              <CompetitionIntel 
                aiHorses={aiHorses}
                raceDistance={raceDistance}
                getDistanceExpertise={getDistanceExpertise}
                isInTab={true}
              />
            )}
          </div>
        </div>
      </div>

      {/* Desktop - Side by Side Layout */}
      <div className="hidden lg:grid lg:grid-cols-2 lg:gap-6">
        {/* Your Stable */}
        <div className="bg-white rounded-lg shadow-lg">
          <div className="bg-blue-500 text-white py-4 px-6 rounded-t-lg">
            <h3 className="text-lg font-bold">🏇 Your Stable ({playerHorses.length})</h3>
          </div>
          <div className="p-4">
            <div className="space-y-3">
              {sortHorsesByPerformance(playerHorses).map(horse => (
                <HorseCard
                  key={horse.id}
                  horse={horse}
                  isSelected={selectedHorse?.id === horse.id}
                  onSelect={() => setSelectedHorse(horse)}
                  raceDistance={raceDistance}
                  getDistanceExpertise={getDistanceExpertise}
                  isPlayerHorse={true}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Competition */}
        <div className="bg-white rounded-lg shadow-lg">
          <div className="bg-red-500 text-white py-4 px-6 rounded-t-lg">
            <h3 className="text-lg font-bold">🕵️ Competition ({aiHorses.length})</h3>
            <p className="text-sm text-red-100">Intelligence Reports</p>
          </div>
          <div className="p-4">
            <CompetitionIntel 
              aiHorses={aiHorses}
              raceDistance={raceDistance}
              getDistanceExpertise={getDistanceExpertise}
              isInTab={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
}


// Expandable Competition Intel Component
function CompetitionIntel({ aiHorses, raceDistance, getDistanceExpertise, isInTab = false }) {
  const { TRAIT_DEFINITIONS } = window.GameConfig;
  const [isExpanded, setIsExpanded] = useState(isInTab); // Auto-expand when in tab
  
  return (
    <div className={isInTab ? '' : 'bg-white rounded-lg shadow-lg'}>
      {/* Collapsible Header (only show when not in tab) */}
      {!isInTab && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full p-4 text-left hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-red-600">
              🕵️ Competition Intel {!isExpanded && `(${aiHorses.length} opponents)`}
            </h3>
            <span className={`text-2xl transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
              ⌄
            </span>
          </div>
          {!isExpanded && (
            <p className="text-sm text-gray-600 mt-1">
              Tap to view detailed scouting reports on your competition
            </p>
          )}
        </button>
      )}
      
      {/* Content */}
      {(isExpanded || isInTab) && (
        <div className={isInTab ? '' : 'px-4 pb-4'}>
          <div className="space-y-3">
            {[...aiHorses].sort((a, b) => {
              // Sort by speed
              return b.speed - a.speed;
            }).map(horse => {
              // Intelligence gathering (consistent based on horse ID)
              const speedVisible = (horse.id * 1234) % 10 >= 4;
              const traitsVisible = (horse.id * 5678) % 10 >= 3;
              const distanceVisible = (horse.id * 9876) % 10 >= 5;
              
              // Consistent estimated speed (no random component)
              const estimatedSpeed = speedVisible ? Math.floor(horse.speed * 0.9 + (horse.id % 10)) : null;
              
              return (
                <div key={horse.id} className="bg-white border-2 border-gray-200 rounded-xl p-4 hover:shadow-lg transition-shadow">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <HorseIcon color={horse.color} size="md" />
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-lg text-gray-900">{horse.name}</span>
                          {/* Trait Pills */}
                          {traitsVisible && (
                            <div className="flex space-x-1">
                              {horse.traits.map(trait => {
                                const traitDef = TRAIT_DEFINITIONS[trait];
                                const isPositive = !['temperamental', 'lazy', 'nervous', 'brittle'].includes(trait);
                                const colorClass = isPositive 
                                  ? 'bg-green-100 text-green-700 border-green-200' 
                                  : 'bg-red-100 text-red-700 border-red-200';
                                
                                return (
                                  <span 
                                    key={trait}
                                    className={`px-2 py-0.5 text-xs font-medium rounded-full border ${colorClass}`}
                                  >
                                    {traitDef.name}
                                  </span>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Intelligence Grid */}
                  <div className="grid grid-cols-2 gap-3">
                    {/* Speed Intel */}
                    <div className="text-center p-2 bg-blue-50 rounded-lg">
                      <div className="text-xs font-semibold text-blue-600 mb-1">SPEED</div>
                      <div className="font-bold text-lg text-blue-700">
                        {speedVisible ? estimatedSpeed : '???'}
                      </div>
                      <div className="text-xs text-blue-500">
                        {speedVisible ? 'Estimated' : 'Unknown'}
                      </div>
                    </div>
                    
                    {/* Distance Intel */}
                    {distanceVisible ? (() => {
                      const { calculateDistanceFit } = window.HorseSystem;
                      const fit = calculateDistanceFit(horse, raceDistance);
                      const expertise = getDistanceExpertise(fit);
                      return (
                        <div className={`text-center p-2 rounded-lg ${expertise.bgColor}`}>
                          <div className={`text-xs font-semibold mb-1 ${expertise.color}`}>DISTANCE</div>
                          <div className="text-lg">{expertise.icon}</div>
                          <div className={`text-xs font-medium ${expertise.color}`}>{expertise.text}</div>
                        </div>
                      );
                    })() : (
                      <div className="text-center p-2 bg-gray-50 rounded-lg">
                        <div className="text-xs font-semibold text-gray-600 mb-1">DISTANCE</div>
                        <div className="text-lg text-gray-400">❓</div>
                        <div className="text-xs text-gray-500">Unknown</div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}


// Consistent Horse Card (matches opponent format)
function HorseCard({ horse, isSelected, onSelect, raceDistance, getDistanceExpertise, showBestDistance = false, getBestDistance }) {
  const { TRAIT_DEFINITIONS } = window.GameConfig;
  const { calculateDistanceFit } = window.HorseSystem;
  
  const distanceFit = calculateDistanceFit(horse, raceDistance);
  const expertise = getDistanceExpertise(distanceFit);
  
  // Get best distance if requested
  const bestDistance = showBestDistance && getBestDistance ? getBestDistance(horse) : null;
  
  // Clear new flag after first display
  useEffect(() => {
    if (horse.isNew) {
      // Clear the new flag after a short delay
      const timer = setTimeout(() => {
        horse.isNew = false;
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [horse]);
  
  return (
    <div
      onClick={onSelect}
      className={`cursor-pointer transition-all hover:shadow-lg ${
        isSelected 
          ? 'bg-white border-2 border-blue-500 rounded-xl p-4 shadow-lg ring-2 ring-blue-200' 
          : horse.isNew
            ? 'bg-white border-2 border-yellow-400 rounded-xl p-4 shadow-lg ring-2 ring-yellow-200'
            : 'bg-white border-2 border-gray-200 rounded-xl p-4'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <HorseIcon color={horse.color} size="md" />
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-lg text-gray-900">{horse.name}</span>
              {horse.isNew && (
                <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-yellow-100 text-yellow-800 border border-yellow-300">
                  NEW
                </span>
              )}
              {/* Trait Pills */}
              <div className="flex space-x-1">
                {horse.traits.map(trait => {
                  const traitDef = TRAIT_DEFINITIONS[trait];
                  const isPositive = !['temperamental', 'lazy', 'nervous', 'brittle'].includes(trait);
                  const colorClass = isPositive 
                    ? 'bg-green-100 text-green-700 border-green-200' 
                    : 'bg-red-100 text-red-700 border-red-200';
                  
                  return (
                    <span 
                      key={trait}
                      className={`px-2 py-0.5 text-xs font-medium rounded-full border ${colorClass}`}
                    >
                      {traitDef.name}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Fatigue Warning */}
      {horse.fatigue > 0 && (
        <div className="mb-3">
          <div className={`text-sm ${horse.fatigue > 80 ? 'text-red-600' : 'text-yellow-600'}`}>
            ⚠️ {horse.fatigue > 80 ? 'Very tired - reduced performance' : 'Tired - slight impact'}
          </div>
        </div>
      )}
      
      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        {/* Speed */}
        <div className="text-center p-2 bg-blue-50 rounded-lg">
          <div className="text-xs font-semibold text-blue-600 mb-1">SPEED</div>
          <div className="font-bold text-lg text-blue-700">{horse.speed}</div>
        </div>
        
        {/* Distance Match */}
        <div className={`text-center p-2 rounded-lg ${showBestDistance ? 'bg-purple-50' : expertise.bgColor}`}>
          <div className={`text-xs font-semibold mb-1 ${showBestDistance ? 'text-purple-600' : expertise.color}`}>
            {showBestDistance ? 'BEST AT' : 'DISTANCE'}
          </div>
          {showBestDistance ? (
            <div className="font-bold text-lg text-purple-700">{bestDistance}m</div>
          ) : (
            <>
              <div className="text-lg">{expertise.icon}</div>
              <div className={`text-xs font-medium ${expertise.color}`}>{expertise.text}</div>
            </>
          )}
        </div>
      </div>
      
      {/* Selection indicator */}
      {isSelected && (
        <div className="text-center text-xs mt-3 font-bold text-blue-600">
          ✓ SELECTED FOR RACE
        </div>
      )}
    </div>
  );
}

// Race track component
function RaceTrack({ horses, racePositions, selectedHorse }) {
  
  return (
    <div className="bg-white rounded-lg p-4 sm:p-6 shadow-lg">
      <h2 className="text-xl sm:text-2xl font-bold mb-4">🏁 Race in Progress! 🏁</h2>
      
      <div className="space-y-3">
        {horses.map((horse) => {
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
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 sm:p-4">
        <div className="space-y-2">
          {sortHorsesByPerformance(horses).map(horse => {
            const distanceFit = calculateDistanceFit(horse, raceDistance);
            const expertise = getDistanceExpertise(distanceFit);
            
            return (
              <div 
                key={horse.id}
                onClick={() => onSelect(horse)}
                className="flex flex-col sm:flex-row p-3 sm:p-3 rounded-lg cursor-pointer transition-all bg-white hover:bg-blue-50 border-2 border-gray-200 hover:border-blue-500 active:border-blue-600 active:scale-[0.98]"
              >
                {/* Mobile Layout - Stacked */}
                <div className="flex flex-col space-y-3 sm:hidden w-full">
                  {/* Horse Header - Name, Icon, and Distance */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <HorseIcon color={horse.color} size="md" />
                      <div className="flex flex-col">
                        <span className="text-base font-bold text-blue-800">{horse.name}</span>
                        {horse.fatigue > 0 && (
                          <div className={`flex items-center space-x-1 text-xs ${horse.fatigue > 80 ? 'text-red-600' : horse.fatigue > 40 ? 'text-yellow-600' : 'text-orange-600'}`}>
                            <span>😴</span>
                            <span className="font-medium">Fatigue: {horse.fatigue}%</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className={`flex items-center space-x-1 rounded-full px-3 py-1 ${expertise.bgColor} ${expertise.color}`}>
                      <span className="text-sm">{expertise.icon}</span>
                      <span className="text-xs font-bold">{expertise.text}</span>
                    </div>
                  </div>
                  
                  {/* Stats Row */}
                  <div className="flex items-center justify-between px-2">
                    <div className="flex items-center space-x-4">
                      <div className="text-sm">
                        <span className="text-gray-600">Speed:</span>
                        <span className="font-bold text-blue-700 ml-1">{horse.speed}</span>
                      </div>
                      <div className="text-sm">
                        <span className="text-gray-600">Booster:</span>
                        <span className="font-bold text-green-700 ml-1">{horse.boosterPower}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      {horse.traits.map(trait => (
                        <span key={trait} className="text-base" title={TRAIT_DEFINITIONS[trait].name}>
                          {TRAIT_DEFINITIONS[trait].icon}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Desktop Layout - Original Grid */}
                <div className="hidden sm:grid grid-cols-4 gap-4 items-center w-full">
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

// Horse buying interface component
function HorseBuyingInterface({ horses, onPurchase, onCancel, getDistanceExpertise, getBestDistance }) {
  const [selectedHorse, setSelectedHorse] = useState(null);
  
  return (
    <div className="bg-white rounded-lg p-4 sm:p-6 shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-center">🛒 Buy New Horse</h2>
      
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4 mb-6 border border-green-200">
        <div className="text-center mb-2">
          <span className="text-lg font-bold text-gray-800">
            💰 Expand Your Stable
          </span>
        </div>
        <div className="text-sm text-gray-600 text-center">
          Choose a specialized horse to add to your stable. Each horse is optimized for different race distances!
        </div>
      </div>

      <div className="space-y-4 mb-6">
        {horses.map(horse => (
          <div
            key={horse.id}
            onClick={() => setSelectedHorse(horse)}
            className={`cursor-pointer transition-all ${
              selectedHorse?.id === horse.id
                ? 'opacity-100'
                : 'opacity-80 hover:opacity-100'
            }`}
          >
            <HorseCard
              horse={horse}
              isSelected={selectedHorse?.id === horse.id}
              onSelect={() => setSelectedHorse(horse)}
              raceDistance={1600} // Default distance for display
              getDistanceExpertise={getDistanceExpertise}
              showBestDistance={true}
              getBestDistance={getBestDistance}
              isPlayerHorse={false}
            />
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={onCancel}
          className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-bold"
        >
          Skip Purchase
        </button>
        <button
          onClick={() => selectedHorse && onPurchase(selectedHorse)}
          disabled={!selectedHorse}
          className={`px-6 py-3 rounded-lg transition-colors font-bold flex-1 ${
            selectedHorse
              ? 'bg-green-500 text-white hover:bg-green-600'
              : 'bg-gray-400 text-gray-600 cursor-not-allowed'
          }`}
        >
          {selectedHorse ? '🛒 Purchase Horse' : 'Select a Horse'}
        </button>
      </div>
    </div>
  );
}

// Breeding interface component
function BreedingInterface({ horses, onBreed, onCancel, raceDistance, getDistanceExpertise, getBestDistance }) {
  const [selectedHorses, setSelectedHorses] = useState([]);
  
  const handleHorseClick = (horse) => {
    if (selectedHorses.find(h => h.id === horse.id)) {
      // Unselect if already selected
      setSelectedHorses(selectedHorses.filter(h => h.id !== horse.id));
    } else if (selectedHorses.length < 2) {
      // Select if less than 2 selected
      setSelectedHorses([...selectedHorses, horse]);
    }
  };
  
  const canBreed = selectedHorses.length === 2;
  const raceType = raceDistance === 1000 ? 'Sprint' : raceDistance === 1800 ? 'Medium' : 'Endurance';
  
  return (
    <div className="bg-white rounded-lg p-4 sm:p-6 shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-center">🐴 Breed New Champion</h2>
      
      {/* Breeding Summary */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4 mb-6 border border-green-200">
        <div className="text-center mb-2">
          <span className="text-lg font-bold text-gray-800">
            🏁 Next Race: {raceDistance}m {raceType}
          </span>
        </div>
        <div className="text-sm text-gray-600 text-center">
          Select two parent horses to create an offspring. Click a selected horse to unselect it.
        </div>
        {selectedHorses.length > 0 && (
          <div className="mt-2 text-center">
            <span className="text-sm font-medium text-blue-600">
              Selected: {selectedHorses.map(h => h.name).join(' & ')}
            </span>
          </div>
        )}
      </div>

      {/* Horse Selection */}
      <div>
        <h3 className="text-lg font-bold mb-3 text-center">Select Two Parents</h3>
        <div className="space-y-3">
          {[...horses].sort((a, b) => b.speed - a.speed).map(horse => {
            const isSelected = selectedHorses.find(h => h.id === horse.id);
            const selectionNumber = isSelected ? selectedHorses.findIndex(h => h.id === horse.id) + 1 : null;
            
            return (
              <div
                key={horse.id}
                onClick={() => handleHorseClick(horse)}
                className={`cursor-pointer transition-all ${
                  isSelected 
                    ? 'opacity-100' 
                    : 'opacity-80 hover:opacity-100'
                }`}
              >
                <div className="relative">
                  {isSelected && (
                    <div className="absolute -top-2 -right-2 z-10 bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">
                      {selectionNumber}
                    </div>
                  )}
                  <HorseCard
                    horse={horse}
                    isSelected={isSelected}
                    onSelect={() => handleHorseClick(horse)}
                    raceDistance={raceDistance}
                    getDistanceExpertise={getDistanceExpertise}
                    showBestDistance={true}
                    getBestDistance={getBestDistance}
                    isPlayerHorse={true}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 mt-6">
        <button
          onClick={onCancel}
          className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-bold"
        >
          Skip Breeding
        </button>
        <button
          onClick={() => canBreed && onBreed(selectedHorses[0], selectedHorses[1])}
          disabled={!canBreed}
          className={`px-6 py-3 rounded-lg transition-colors font-bold flex-1 ${
            canBreed 
              ? 'bg-green-500 text-white hover:bg-green-600' 
              : 'bg-gray-400 text-gray-600 cursor-not-allowed'
          }`}
        >
          {canBreed ? '🐴 Create Offspring' : 'Select Two Parents'}
        </button>
      </div>
    </div>
  );
}

// =============================================================================
// MAIN GAME COMPONENT 🎯
// =============================================================================

function StableRacingGame() {
  const { GAME_CONSTANTS, GAME_PHASES, RACE_DISTANCES, randomBetween } = window.GameConfig;
  const { generateHorse, breedHorses } = window.HorseSystem;
  const { generateScoutReports } = window.ScoutSystem;
  const { simulateRace, processRaceResults, calculatePrizePool, processPlayerWinnings } = window.RaceSystem;
  const { generateUpgradeOptions, applyUpgradeToHorse, applyUpgradeToAllHorses, getComebackInfo } = window.UpgradeSystem;

  // === GAME STATE ===
  const [wallet, setWallet] = useState(GAME_CONSTANTS.INITIAL_WALLET);
  const [gamePhase, setGamePhase] = useState(GAME_PHASES.GAME_GUIDE);
  const [playerHorses, setPlayerHorses] = useState([]);
  const [aiHorses, setAiHorses] = useState([]);
  const [selectedHorse, setSelectedHorse] = useState(null);
  const [selectedEntryFee, setSelectedEntryFee] = useState(null);
  const [raceResults, setRaceResults] = useState([]);
  const [raceNumber, setRaceNumber] = useState(1);
  const [racePositions, setRacePositions] = useState({});
  const [upgradeOptions, setUpgradeOptions] = useState([]);
  const [raceDistance, setRaceDistance] = useState(1000);
  const [raceDistanceIndex, setRaceDistanceIndex] = useState(0);
  const [selectedBoost, setSelectedBoost] = useState(null);
  const [pendingUpgrade, setPendingUpgrade] = useState(null);
  const [lastRaceResult, setLastRaceResult] = useState(null);
  const [horseBuyingOptions, setHorseBuyingOptions] = useState([]);

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
    
    const fees = [
      { amount: Math.min(minBet, maxAllowed), multiplier: 1, label: 'Min' },
      { amount: Math.min(Math.floor(minBet * 2.5), maxAllowed), multiplier: 2, label: 'Med' },
      { amount: Math.min(Math.floor(minBet * 5), maxAllowed), multiplier: 3, label: 'Max' }
    ].filter(fee => fee.amount <= wallet && fee.amount > 0);
    
    // Remove duplicates by amount (keep the one with higher multiplier)
    const uniqueFees = [];
    const seenAmounts = new Set();
    
    for (const fee of fees.reverse()) { // Reverse to keep higher multipliers
      if (!seenAmounts.has(fee.amount)) {
        uniqueFees.unshift(fee); // Add to beginning to maintain original order
        seenAmounts.add(fee.amount);
      }
    }
    
    return uniqueFees;
  }, [raceNumber, wallet]);

  // Auto-select minimum fee if available and none selected
  useEffect(() => {
    if (!selectedEntryFee && entryFees.length > 0) {
      setSelectedEntryFee(entryFees[0]); // Select the minimum fee by default
    }
  }, [entryFees, selectedEntryFee]);

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
    if (fit >= 0.95) return { text: 'Master', color: 'text-green-600', bgColor: 'bg-green-50', icon: '👑' };
    if (fit >= 0.85) return { text: 'Expert', color: 'text-green-600', bgColor: 'bg-green-50', icon: '⭐' };
    if (fit >= 0.70) return { text: 'Skilled', color: 'text-gray-600', bgColor: 'bg-gray-50', icon: '💪' };
    if (fit >= 0.55) return { text: 'Decent', color: 'text-gray-600', bgColor: 'bg-gray-50', icon: '👍' };
    if (fit >= 0.40) return { text: 'Learning', color: 'text-red-600', bgColor: 'bg-red-50', icon: '📚' };
    return { text: 'Rookie', color: 'text-red-600', bgColor: 'bg-red-50', icon: '🎯' };
  };
  
  // Find the best distance for a horse
  const getBestDistance = (horse) => {
    const { calculateDistanceFit } = window.HorseSystem;
    const distances = [1000, 1800, 2400];
    
    let bestDistance = distances[0];
    let bestFit = calculateDistanceFit(horse, distances[0]);
    
    for (const distance of distances) {
      const fit = calculateDistanceFit(horse, distance);
      if (fit > bestFit) {
        bestFit = fit;
        bestDistance = distance;
      }
    }
    
    return bestDistance;
  };

  // === RACE MANAGEMENT ===
  
  // Generate new race with AI horses and scout reports
  const generateHorseBuyingOptions = useCallback(() => {
    const { generateHorseBuyingOptions: generateOptions } = window.HorseSystem;
    const options = generateOptions(playerHorses);
    setHorseBuyingOptions(options);
  }, [playerHorses]);

  const generateNewRace = useCallback(() => {
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
    generateScoutReports(newAiHorses, playerHorses, raceDistance);
  }, [raceNumber, playerHorses, raceDistance]);

  // Start a race
  const startRace = useCallback(() => {
    if (!selectedHorse || !selectedEntryFee || selectedEntryFee.amount > wallet) return;
    
    // Deduct entry fee
    setWallet(prev => prev - selectedEntryFee.amount);
    setGamePhase(GAME_PHASES.RACING);
    
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
    setGamePhase(GAME_PHASES.POST_RACE);
  }, [selectedHorse, prizePool]);

  // === UPGRADE SYSTEM ===
  
  // Generate upgrade options when entering post-race phase
  useEffect(() => {
    if (gamePhase === GAME_PHASES.POST_RACE) {
      const options = generateUpgradeOptions(raceNumber, wallet, playerHorses.length);
      setUpgradeOptions(options);
      
      // Generate next race distance for upgrade/breeding decisions
      // Next distance is already determined by the sequence
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
  }, [generateHorseBuyingOptions, proceedToNextRace]);

  // Apply upgrade to specific horse
  const applyUpgradeToSpecificHorse = useCallback((horse) => {
    if (!pendingUpgrade) return;
    
    setPlayerHorses(prev => prev.map(h => 
      h.id === horse.id ? applyUpgradeToHorse(pendingUpgrade, h, prev) : h
    ));
    
    setPendingUpgrade(null);
    proceedToNextRace();
  }, [pendingUpgrade, proceedToNextRace]);

  // === BREEDING SYSTEM ===
  
  // Handle horse breeding
  const handleBreeding = useCallback((parent1, parent2) => {
    const offspring = breedHorses(parent1, parent2);
    offspring.isNew = true; // Mark as new
    setPlayerHorses(prev => [...prev, offspring]);
    proceedToNextRace();
  }, []);

  // Handle horse purchase  
  const handleHorsePurchase = useCallback((horse) => {
    // Add the purchased horse to stable
    const purchasedHorse = {
      ...horse,
      traits: horse.traits, // Keep the traits (they were hidden during selection)
      isNew: true // Mark as new
    };
    
    setPlayerHorses(prev => [...prev, purchasedHorse]);
    proceedToNextRace();
  }, [proceedToNextRace]);

  // === GAME FLOW ===
  
  // Proceed to next race
  const proceedToNextRace = useCallback(() => {
    setRaceNumber(prev => prev + 1);
    
    // Advance race distance index first
    setRaceDistanceIndex(prevIndex => {
      const newIndex = (prevIndex + 1) % RACE_DISTANCES.length;
      const newDistance = RACE_DISTANCES[newIndex];
      setRaceDistance(newDistance);
      
      // Generate new race with the new distance
      setTimeout(() => {
        // Find player's best horse speed for AI scaling
        const playerBestSpeed = playerHorses.length > 0 
          ? Math.max(...playerHorses.map(h => h.speed))
          : GAME_CONSTANTS.BASE_SPEED;
        
        // Generate AI horses with player-relative scaling
        const newAiHorses = Array.from({ length: GAME_CONSTANTS.AI_HORSES_COUNT }, () => 
          generateHorse(false, raceNumber + 1, null, playerBestSpeed)
        );
        setAiHorses(newAiHorses);
        
        // Generate scout reports
        generateScoutReports(newAiHorses, playerHorses, newDistance);
      }, 0);
      
      return newIndex;
    });
    
    setGamePhase(GAME_PHASES.HORSE_SELECTION);
    setRaceResults([]);
    setRacePositions({});
    setSelectedEntryFee(null);
  }, [playerHorses, raceNumber]);

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
    if (gamePhase === GAME_PHASES.HORSE_SELECTION) {
      const canStart = selectedHorse && selectedEntryFee;
      const raceType = raceDistance === 1000 ? 'Sprint' : raceDistance === 1800 ? 'Medium' : 'Endurance';
      
      return (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-300 p-4 shadow-lg z-40">
          <div className="max-w-6xl mx-auto">
            {/* Race Info */}
            <div className="text-center mb-3">
              <span className="text-lg font-bold text-gray-800">
                🏁 Race {raceNumber}: {raceDistance}m {raceType}
              </span>
            </div>
            
            {/* Controls */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
              {/* Horse Selection Status */}
              <div className="flex-1 text-center sm:text-left">
                {selectedHorse ? (
                  <span className="text-sm sm:text-base">
                    <span className="font-bold">Horse:</span> {selectedHorse.name}
                  </span>
                ) : (
                  <span className="text-gray-600 text-sm sm:text-base">
                    Select a horse above
                  </span>
                )}
              </div>
              
              {/* Entry Fee Dropdown */}
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700">Entry:</label>
                <select
                  value={selectedEntryFee?.amount || ''}
                  onChange={(e) => {
                    const amount = parseInt(e.target.value);
                    const fee = entryFees.find(f => f.amount === amount);
                    setSelectedEntryFee(fee || null);
                  }}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium bg-white"
                  disabled={entryFees.length === 0}
                >
                  <option value="">Select Fee</option>
                  {entryFees.map(fee => (
                    <option key={`${fee.amount}-${fee.multiplier}`} value={fee.amount}>
                      ${fee.amount}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Start Button */}
              <button
                onClick={canStart ? startRace : undefined}
                disabled={!canStart}
                className={`px-6 py-3 rounded-lg transition-colors text-base font-bold ${
                  canStart 
                    ? 'bg-green-500 text-white hover:bg-green-600' 
                    : 'bg-gray-400 text-gray-600 cursor-not-allowed'
                }`}
              >
                {canStart ? 'Start Race 🏁' : 'Select Horse & Fee'}
              </button>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  // === MAIN RENDER ===
  
  // Show game guide first
  if (gamePhase === GAME_PHASES.GAME_GUIDE) {
    return <GameGuide onStartGame={() => setGamePhase(GAME_PHASES.HORSE_SELECTION)} />;
  }
  
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
            
            {/* Not Enough Money Warning */}
            {entryFees.length === 0 && (
              <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 mb-6 text-center">
                <div className="text-red-600 font-bold text-lg">
                  ⚠️ Not enough money for entry fees!
                </div>
                <div className="text-red-500 text-sm mt-1">
                  You need at least ${Math.floor(10 * Math.pow(GAME_CONSTANTS.MIN_ENTRY_MULTIPLIER, raceNumber - 1))} to enter this race
                </div>
              </div>
            )}

            {/* Tab System for Mobile */}
            <HorseSelectionTabs
              playerHorses={playerHorses}
              aiHorses={aiHorses}
              selectedHorse={selectedHorse}
              setSelectedHorse={setSelectedHorse}
              raceDistance={raceDistance}
              getDistanceExpertise={getDistanceExpertise}
            />
          </div>
        )}

        {/* Racing Phase */}
        {gamePhase === GAME_PHASES.RACING && (
          <RaceTrack
            horses={[selectedHorse, ...aiHorses]}
            racePositions={racePositions}
            selectedHorse={selectedHorse}
          />
        )}

        {/* Horse Picker for Upgrades */}
        {gamePhase === GAME_PHASES.HORSE_PICKER && (
          <HorsePicker
            horses={playerHorses}
            onSelect={applyUpgradeToSpecificHorse}
            title={`Select horse for: ${pendingUpgrade?.name}`}
            raceDistance={RACE_DISTANCES[raceDistanceIndex]}
            getDistanceExpertise={getDistanceExpertise}
          />
        )}

        {/* Breeding Interface */}
        {gamePhase === GAME_PHASES.BREEDING && (
          <BreedingInterface
            horses={playerHorses}
            onBreed={handleBreeding}
            onCancel={proceedToNextRace}
            raceDistance={RACE_DISTANCES[raceDistanceIndex]}
            getDistanceExpertise={getDistanceExpertise}
            getBestDistance={getBestDistance}
          />
        )}

        {/* Horse Buying Interface */}
        {gamePhase === GAME_PHASES.HORSE_BUYING && (
          <HorseBuyingInterface
            horses={horseBuyingOptions}
            onPurchase={handleHorsePurchase}
            onCancel={proceedToNextRace}
            getDistanceExpertise={getDistanceExpertise}
            getBestDistance={getBestDistance}
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
                  <span className="text-blue-800 font-bold text-lg">{RACE_DISTANCES[raceDistanceIndex]}m</span>
                  <span className="text-blue-600">
                    ({RACE_DISTANCES[raceDistanceIndex] === 1000 ? 'Sprint' : RACE_DISTANCES[raceDistanceIndex] === 1800 ? 'Medium Distance' : 'Endurance'})
                  </span>
                </div>
              </div>
              
              {/* Mobile - Stack vertically with larger cards */}
              <div className="flex flex-col space-y-4 sm:hidden">
                {upgradeOptions.map((upgrade, index) => (
                  <div
                    key={index}
                    onClick={() => upgrade.cost <= wallet && applyUpgrade(upgrade)}
                    className={`p-5 border-2 rounded-lg transition-all min-h-[100px] ${
                      upgrade.cost > wallet
                        ? 'border-gray-300 bg-gray-100 opacity-50 cursor-not-allowed'
                        : 'border-gray-300 hover:border-blue-500 hover:bg-blue-50 cursor-pointer active:scale-[0.98]'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-bold text-lg mb-2">{upgrade.name}</h3>
                        <p className="text-sm text-gray-600">{upgrade.desc}</p>
                      </div>
                      <div className="ml-4">
                        {upgrade.cost > 0 ? (
                          <div className={`text-lg font-bold whitespace-nowrap ${upgrade.cost > wallet ? 'text-red-600' : 'text-green-600'}`}>
                            ${upgrade.cost}
                          </div>
                        ) : (
                          <div className="text-lg font-bold text-green-600">FREE</div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Desktop - Original grid */}
              <div className="hidden sm:grid grid-cols-1 md:grid-cols-3 gap-4">
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