# 🎲 MonoWorld – Deployment Guide

## Project Structure
```
monoworld/
├── server.js          ← Node.js + Socket.io server (game logic lives here)
├── package.json       ← Dependencies
└── public/
    └── index.html     ← Full client game (auto-served by Express)
```

---

## 🖥️ Run Locally (for testing in your home)

### Step 1 – Install Node.js
Download from https://nodejs.org (choose LTS version)

### Step 2 – Install dependencies
```bash
cd monoworld
npm install
```

### Step 3 – Start the server
```bash
npm start
```

Server starts at: http://localhost:3000

### Step 4 – Friends join on same WiFi
Find your local IP address:
- **Windows**: open CMD → type `ipconfig` → look for "IPv4 Address" e.g. 192.168.1.5
- **Mac/Linux**: open Terminal → type `ifconfig` → look for `inet` under en0

Friends open: **http://192.168.1.5:3000** (replace with your IP)
You all must be on the **same WiFi network**.

---

## 🌍 Host Online (friends anywhere in the world)

### Option A – Railway (Recommended, free tier)

1. Create account at https://railway.app
2. Install Railway CLI:
   ```bash
   npm install -g @railway/cli
   railway login
   ```
3. Deploy:
   ```bash
   cd monoworld
   railway init
   railway up
   ```
4. Railway gives you a URL like: `https://monoworld-production.up.railway.app`
5. Share that URL with friends — done! ✅

---

### Option B – Render (Also free)

1. Push your code to GitHub:
   ```bash
   git init
   git add .
   git commit -m "MonoWorld init"
   gh repo create monoworld --public --push
   ```
2. Go to https://render.com → New → Web Service
3. Connect your GitHub repo
4. Settings:
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment**: Node
5. Click Deploy → get your public URL

---

### Option C – Fly.io (Best performance, free tier)

1. Install flyctl: https://fly.io/docs/hands-on/install-flyctl/
2. ```bash
   cd monoworld
   fly launch
   fly deploy
   ```
3. Get URL from: `fly open`

---

## 🎮 How to Play (Multiplayer)

1. **One person** (host) goes to the URL and clicks **"Create Room"**
2. Host sets rules (starting cash, vacation cash, auction, etc.)
3. Host clicks **"Create Room"** → gets a **5-letter room code** (e.g. `XK7PQ`)
4. Host shares the code with friends
5. Friends go to the same URL → click **"Join Room"** → enter the code
6. Once everyone joins, **host clicks "Start Game"**
7. Each player rolls on their own device — all moves sync in real-time!

---

## ⚙️ Rules Summary

| Rule | Description |
|------|-------------|
| x2 Rent | Double rent when you own a full color set (no houses) |
| Vacation Cash | All taxes go into Free Parking pot |
| Auction | Skipped properties go to auction among all players |
| No Prison Rent | Jailed players don't collect rent |
| Mortgage | Mortgage properties for 50% value |
| Even Build | Houses must be built evenly across a color set |
| **Doubles Extra Turn** | **PERMANENTLY OFF** (as requested) |

---

## 🔧 Development Mode (auto-restart on changes)

```bash
npm run dev
```

Requires nodemon (already in devDependencies).

---

## 📝 Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| PORT | 3000 | Server port |

Set on Railway/Render automatically.
