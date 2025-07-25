# 🐎 Virtual Horse Racer

A browser-based horse racing management game where you breed, train, and race horses to build the ultimate stable and become a racing champion!

## 🎮 Game Features

- **Horse Breeding System** - Breed horses to create offspring with combined traits and improved stats
- **Dynamic Racing** - Real-time races with surge/struggle phases and visual effects
- **Trait System** - 10+ unique traits that affect horse performance (Early Speed, Closer, Sprinter, etc.)
- **Upgrade System** - Choose upgrades between races to improve your stable
- **AI Scaling** - AI opponents that get progressively stronger as you advance
- **Multiple Race Distances** - Sprint (1000m), Medium (1800m), and Endurance (2400m) races
- **Performance Scaling** - Configurable game balance settings to control difficulty
- **Scout Reports** - Get insider information about your AI opponents before races

## 📥 How to Download and Play

### Option 1: Simple Local Server (Recommended)

1. Click the green **Code** button at the top of this repository
2. Select **Download ZIP**
3. Extract the ZIP file to a folder on your computer
4. Open a terminal/command prompt in the extracted folder
5. Run a simple local server:

**Python 3:**
```bash
python -m http.server 8000
```

**Python 2:**
```bash
python -m SimpleHTTPServer 8000
```

**Node.js (if installed):**
```bash
npx serve
```

**Alternative - Use VS Code:**
- Open the folder in VS Code
- Install the "Live Server" extension
- Right-click `index.html` and select "Open with Live Server"

6. Open your browser and go to `http://localhost:8000`
7. Start playing!

### Option 2: Clone with Git

```bash
git clone https://github.com/YOUR_USERNAME/virtual-horse-racer.git
cd virtual-horse-racer
python -m http.server 8000
```

Then open `http://localhost:8000` in your web browser.

### ⚠️ Important Note

This game requires a local server to run due to browser security restrictions with external resources (React, Tailwind CSS). Simply opening the HTML file directly in your browser will not work.

## 🖥️ System Requirements

- Any modern web browser (Chrome, Firefox, Safari, Edge)
- Python (pre-installed on Mac/Linux) OR Node.js for local server
- Internet connection needed for initial setup (downloads React, Tailwind CSS from CDN)

## 🎯 How to Play

1. **Start the Game** - You begin with $100 and need to reach $1000 to win
2. **Buy Your First Horse** - Purchase a horse from the initial selection
3. **Enter Races** - Choose your horse and entry fee for each race
4. **Watch Races** - See real-time races with surge phases and position updates
5. **Upgrade Between Races** - Pick upgrades to improve your horses
6. **Breed Champions** - Combine your best horses to create superior offspring
7. **Win the Game** - Reach $1000 to become the ultimate horse racing champion!

## 🔧 Configuration

The game includes extensive configuration options in `js/game-config.js`:

- **Starting Money** - Default: $100
- **Win Condition** - Default: $1000
- **AI Difficulty** - Adjustable AI horse scaling
- **Performance Impact** - Control how much speed/distance/events affect races
- **Race Speed** - Make races faster or slower
- **Horse Names** - Add your own custom horse names
- **Traits** - Modify or add new horse traits

## 📁 File Structure

```
virtual-horse-racer/
├── index.html           # Game menu/landing page
├── play-game.html       # Main game file
├── complete-game.html   # Victory screen
├── game-app.js          # Main game logic
├── js/
│   ├── game-config.js   # Game settings and constants
│   ├── horse-system.js  # Horse generation and breeding
│   ├── race-system.js   # Race simulation engine
│   ├── upgrade-system.js # Upgrade mechanics
│   └── scout-system.js  # Scout report generation
└── README.md           # This file
```

## 🎨 Customization

### Easy Modifications

1. **Change Starting Money** - Edit `INITIAL_WALLET` in `js/game-config.js`
2. **Adjust Win Condition** - Edit `WIN_CONDITION` in `js/game-config.js`
3. **Add Horse Names** - Add to the `HORSE_NAMES` array in `js/game-config.js`
4. **Modify Race Speed** - Change `RACE_SPEED_MULTIPLIER` (0.5 = slower, 2.0 = faster)

### Advanced Modifications

- **Create New Traits** - Add to `TRAIT_DEFINITIONS` in `js/game-config.js`
- **Add Upgrade Types** - Modify `js/upgrade-system.js`
- **Change Race Mechanics** - Edit `js/race-system.js`
- **Modify AI Behavior** - Adjust AI settings in game config

## 🐛 Troubleshooting

**Game won't load?**
- Make sure you're running a local server (see installation instructions above)
- Don't try to open `index.html` directly - use `http://localhost:8000` instead
- Check that you have an internet connection (needed for React/Tailwind CSS)
- Try a different browser if issues persist

**Can't see race animations?**
- Ensure JavaScript is enabled in your browser
- Check browser console (F12) for any error messages

**Game feels too hard/easy?**
- Adjust `AI_SPEED_SCALING` in `js/game-config.js`
- Modify `SPEED_IMPACT_SCALING` to change how much stats matter

## 📜 License

This game is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest new features
- Submit pull requests
- Fork and create your own version

## 🎮 Gameplay Tips

- **Watch Distance Preferences** - Match horses to race distances for better performance
- **Manage Fatigue** - Rest tired horses between races
- **Breed Strategically** - Combine complementary traits for powerful offspring
- **Use Scout Reports** - Plan your race strategy based on opponent information
- **Balance Risk/Reward** - Higher entry fees mean bigger prizes but greater risk

---

Made with ❤️ and JavaScript. Enjoy the races! 🏇