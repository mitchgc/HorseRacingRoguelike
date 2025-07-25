#!/bin/bash

echo "🏇 Starting Stable Manager Game Server..."
echo ""
echo "Opening game in your default browser..."
echo ""

# Start Python HTTP server in background
python3 -m http.server 8000 &
SERVER_PID=$!

# Wait a moment for server to start
sleep 1

# Open browser
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    open http://localhost:8000
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    # Linux
    xdg-open http://localhost:8000
elif [[ "$OSTYPE" == "msys" || "$OSTYPE" == "cygwin" ]]; then
    # Windows
    start http://localhost:8000
fi

echo "✅ Game server running at http://localhost:8000"
echo ""
echo "📋 Instructions:"
echo "   - Click on 'index.html' to play the game"
echo "   - Press Ctrl+C to stop the server"
echo ""

# Wait for user to stop
wait $SERVER_PID