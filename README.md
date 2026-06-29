# GestPlay: Gesture-Controlled Multiplayer Board Games

GestPlay is an innovative, AI-powered multiplayer board game platform that allows users to play classic games like Chess and Tic-Tac-Toe entirely hands-free using webcam hand gestures. 

This project was built using a modern tech stack featuring Next.js, Node.js/Socket.IO, and Python (with MediaPipe for AI hand tracking).

## 🚀 Features
- **Hands-Free Control:** Play games using your webcam. Pinch to select/drop pieces, and use open palms to hover.
- **Real-Time Multiplayer:** Instant synchronization across clients using Socket.IO.
- **Dynamic Game Rooms:** Generate unique room URLs to easily invite friends to your specific match.
- **Spectator Dashboard:** Watch live games in real-time with a dedicated `/spectate` dashboard.
- **Server-Side Validation:** Chess move validation is handled securely by a dedicated Python engine.
- **Premium UI:** Sleek, glassmorphic design built with Tailwind CSS and Framer Motion animations.

## 🛠 Tech Stack
- **Frontend:** Next.js 14 (App Router), React, Tailwind CSS, Framer Motion, Lucide React
- **Backend:** Node.js, Express, Socket.IO
- **AI Engine:** Python, MediaPipe, OpenCV, python-socketio, chess.js

---

## ⚙️ How to Run the Project Locally

The project consists of three separate services that need to run simultaneously. Open **three different terminal windows** and run the following commands.

### 1. Start the Node.js Multiplayer Backend
The backend handles real-time WebSocket communication and active game state.
```bash
cd backend
npm install
npm run dev
```
*(The backend will run on `http://localhost:4000`)*

### 2. Start the Python AI Engine
The Python engine connects to the Node.js server as a client to securely validate chess rules.
```bash
cd game-engine
# Create a virtual environment if you haven't already
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Start the engine
./start.sh
# Alternatively: python engine.py
```

### 3. Start the Next.js Frontend
The frontend serves the user interface and runs the client-side MediaPipe gesture recognition models.
```bash
cd frontend
npm install
npm run dev
```
*(The frontend will run on `http://localhost:3000`)*

---

## 🎮 How to Play

1. **Access the App:** Open `http://localhost:3000` in your browser.
2. **Select a Game:** Click **Start Playing Free** and choose Chess or Tic-Tac-Toe.
3. **Allow Camera Access:** Your browser will ask for webcam permissions. Allow it so the AI can track your hands.
4. **Invite a Friend:** Click the **"Invite Link"** button in the top right corner of the game board. Send this link to your opponent so they can join your exact room.
5. **Use Gestures:**
   - Move your hand to move the on-screen cursor.
   - **PINCH** your index finger and thumb together to click/select.
   - **OPEN PALM** to release.
   - *(Note: If gestures feel tiring, you can also seamlessly use your standard mouse to click the board!)*

## 👁 Spectating
To watch active matches, navigate to `http://localhost:3000/spectate` (or click **Spectate Live Games** from the home page). You will see a dashboard of all active rooms. Clicking "Watch Match" drops you in as a read-only spectator.

---
*Created as a Final Year Project.*
