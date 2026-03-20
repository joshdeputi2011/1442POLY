const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' }
});

app.use(express.static(path.join(__dirname, 'public')));

// ─────────────────────────────────────────────
//  BOARD DATA
// ─────────────────────────────────────────────
const BOARD = [
  {id:0,name:'GO',type:'go',icon:'🚀'},
  {id:1,name:'Mediterranean',type:'property',color:'#8B4513',price:60,rent:[2,10,30,90,160,250],houseCost:50,group:0},
  {id:2,name:'Community Chest',type:'community',icon:'💌'},
  {id:3,name:'Baltic Ave',type:'property',color:'#8B4513',price:60,rent:[4,20,60,180,320,450],houseCost:50,group:0},
  {id:4,name:'Income Tax',type:'tax',icon:'🏛️',amount:200},
  {id:5,name:'Reading Railroad',type:'railroad',icon:'🚂',price:200,rent:[25,50,100,200]},
  {id:6,name:'Oriental Ave',type:'property',color:'#87CEEB',price:100,rent:[6,30,90,270,400,550],houseCost:50,group:1},
  {id:7,name:'Chance',type:'chance',icon:'❓'},
  {id:8,name:'Vermont Ave',type:'property',color:'#87CEEB',price:100,rent:[6,30,90,270,400,550],houseCost:50,group:1},
  {id:9,name:'Connecticut Ave',type:'property',color:'#87CEEB',price:120,rent:[8,40,100,300,450,600],houseCost:50,group:1},
  {id:10,name:'Jail / Visit',type:'jail',icon:'🔒'},
  {id:11,name:'St. Charles',type:'property',color:'#FF69B4',price:140,rent:[10,50,150,450,625,750],houseCost:100,group:2},
  {id:12,name:'Electric Co.',type:'utility',icon:'⚡',price:150},
  {id:13,name:'States Ave',type:'property',color:'#FF69B4',price:140,rent:[10,50,150,450,625,750],houseCost:100,group:2},
  {id:14,name:'Virginia Ave',type:'property',color:'#FF69B4',price:160,rent:[12,60,180,500,700,900],houseCost:100,group:2},
  {id:15,name:'Pennsylvania RR',type:'railroad',icon:'🚂',price:200,rent:[25,50,100,200]},
  {id:16,name:'St. James',type:'property',color:'#FF8C00',price:180,rent:[14,70,200,550,750,950],houseCost:100,group:3},
  {id:17,name:'Community Chest',type:'community',icon:'💌'},
  {id:18,name:'Tennessee Ave',type:'property',color:'#FF8C00',price:180,rent:[14,70,200,550,750,950],houseCost:100,group:3},
  {id:19,name:'New York Ave',type:'property',color:'#FF8C00',price:200,rent:[16,80,220,600,800,1000],houseCost:100,group:3},
  {id:20,name:'Free Parking',type:'parking',icon:'🅿️'},
  {id:21,name:'Kentucky Ave',type:'property',color:'#DC143C',price:220,rent:[18,90,250,700,875,1050],houseCost:150,group:4},
  {id:22,name:'Chance',type:'chance',icon:'❓'},
  {id:23,name:'Indiana Ave',type:'property',color:'#DC143C',price:220,rent:[18,90,250,700,875,1050],houseCost:150,group:4},
  {id:24,name:'Illinois Ave',type:'property',color:'#DC143C',price:240,rent:[20,100,300,750,925,1100],houseCost:150,group:4},
  {id:25,name:'B&O Railroad',type:'railroad',icon:'🚂',price:200,rent:[25,50,100,200]},
  {id:26,name:'Atlantic Ave',type:'property',color:'#DAA520',price:260,rent:[22,110,330,800,975,1150],houseCost:150,group:5},
  {id:27,name:'Ventnor Ave',type:'property',color:'#DAA520',price:260,rent:[22,110,330,800,975,1150],houseCost:150,group:5},
  {id:28,name:'Water Works',type:'utility',icon:'💧',price:150},
  {id:29,name:'Marvin Gardens',type:'property',color:'#DAA520',price:280,rent:[24,120,360,850,1025,1200],houseCost:150,group:5},
  {id:30,name:'Go to Jail',type:'gotojail',icon:'👮'},
  {id:31,name:'Pacific Ave',type:'property',color:'#228B22',price:300,rent:[26,130,390,900,1100,1275],houseCost:200,group:6},
  {id:32,name:'North Carolina',type:'property',color:'#228B22',price:300,rent:[26,130,390,900,1100,1275],houseCost:200,group:6},
  {id:33,name:'Community Chest',type:'community',icon:'💌'},
  {id:34,name:'Pennsylvania Ave',type:'property',color:'#228B22',price:320,rent:[28,150,450,1000,1200,1400],houseCost:200,group:6},
  {id:35,name:'Short Line RR',type:'railroad',icon:'🚂',price:200,rent:[25,50,100,200]},
  {id:36,name:'Chance',type:'chance',icon:'❓'},
  {id:37,name:'Park Place',type:'property',color:'#00008B',price:350,rent:[35,175,500,1100,1300,1500],houseCost:200,group:7},
  {id:38,name:'Luxury Tax',type:'tax',icon:'💎',amount:100},
  {id:39,name:'Boardwalk',type:'property',color:'#00008B',price:400,rent:[50,200,600,1400,1700,2000],houseCost:200,group:7},
];

const CHANCE_CARDS = [
  {text:'Advance to GO. Collect $200.',action:'goto',target:0,collect:200},
  {text:'Bank pays you dividend of $50.',action:'cash',amount:50},
  {text:'Go to Jail. Go directly to Jail.',action:'jail'},
  {text:'Make general repairs: $25/house, $100/hotel.',action:'repairs',house:25,hotel:100},
  {text:'Pay poor tax of $15.',action:'cash',amount:-15},
  {text:'Your building loan matures. Collect $150.',action:'cash',amount:150},
  {text:'You won a crossword competition. Collect $100.',action:'cash',amount:100},
  {text:'Go back 3 spaces.',action:'move',steps:-3},
  {text:'Advance to nearest Railroad.',action:'nearest',nearType:'railroad'},
  {text:'Advance to nearest Utility.',action:'nearest',nearType:'utility'},
  {text:'Bank error in your favor. Collect $200.',action:'cash',amount:200},
  {text:'Pay school fees of $150.',action:'cash',amount:-150},
];

const COMMUNITY_CARDS = [
  {text:'Bank error in your favor. Collect $200.',action:'cash',amount:200},
  {text:"Doctor's fees. Pay $50.",action:'cash',amount:-50},
  {text:'Go to Jail.',action:'jail'},
  {text:'Holiday fund matures. Receive $100.',action:'cash',amount:100},
  {text:'Income tax refund. Collect $20.',action:'cash',amount:20},
  {text:'Life insurance matures. Collect $100.',action:'cash',amount:100},
  {text:'Pay hospital fees of $100.',action:'cash',amount:-100},
  {text:'Receive $25 consultancy fee.',action:'cash',amount:25},
  {text:'Street repairs: $40/house, $115/hotel.',action:'repairs',house:40,hotel:115},
  {text:'Second prize in beauty contest. Collect $10.',action:'cash',amount:10},
  {text:'You inherit $100.',action:'cash',amount:100},
  {text:'From sale of stock you get $50.',action:'cash',amount:50},
];

const TOKENS = ['🚀','🎩','🐶','🚗','🛸','🦁'];
const TOKEN_COLORS = ['#f87171','#60a5fa','#4ade80','#facc15','#a78bfa','#fb923c'];

// ─────────────────────────────────────────────
//  ROOM STORE
// ─────────────────────────────────────────────
const rooms = {}; // roomCode -> roomState

function createRoom(hostSocketId, hostName, settings) {
  const code = Math.random().toString(36).substr(2,5).toUpperCase();
  rooms[code] = {
    code,
    host: hostSocketId,
    settings,
    phase: 'lobby',   // lobby | playing | ended
    players: [],      // {socketId, name, token, cash, position, inJail, jailTurns, bankrupt, idx}
    properties: {},   // cellId -> {owner:playerIdx, houses:0, mortgaged:false}
    vacationPool: 0,
    currentTurn: 0,
    turnPhase: 'roll',// roll | action | end
    pendingAction: null,
    pendingTrade: null,
    log: [],
  };
  return code;
}

function getRoom(code) { return rooms[code] || null; }

function addLog(room, msg, type='info') {
  room.log.push({ msg, type, ts: Date.now() });
  if (room.log.length > 100) room.log.shift();
}

function broadcast(roomCode, event, data) {
  io.to(roomCode).emit(event, data);
}

function syncState(roomCode) {
  const room = getRoom(roomCode);
  if (!room) return;
  broadcast(roomCode, 'stateUpdate', sanitizeRoom(room));
}

function sanitizeRoom(room) {
  // send full state — clients filter what they need
  return {
    code: room.code,
    phase: room.phase,
    settings: room.settings,
    players: room.players,
    properties: room.properties,
    vacationPool: room.vacationPool,
    currentTurn: room.currentTurn,
    turnPhase: room.turnPhase,
    pendingAction: room.pendingAction,
    pendingTrade: room.pendingTrade,
    log: room.log.slice(-30),
  };
}

// ─────────────────────────────────────────────
//  GAME LOGIC (server-authoritative)
// ─────────────────────────────────────────────
function ownsFullSet(room, playerIdx, cell) {
  if (cell.group === undefined) return false;
  const groupCells = BOARD.filter(c => c.group === cell.group);
  return groupCells.every(c => room.properties[c.id] && room.properties[c.id].owner === playerIdx);
}

function findNearest(pos, type) {
  let best = -1, bestDist = 99;
  BOARD.forEach(cell => {
    if (cell.type === type) {
      const dist = (cell.id - pos + 40) % 40;
      if (dist < bestDist) { bestDist = dist; best = cell.id; }
    }
  });
  return best;
}

function railroadCount(room, ownerIdx) {
  return Object.entries(room.properties)
    .filter(([id, pd]) => pd.owner === ownerIdx && BOARD[parseInt(id)].type === 'railroad')
    .length;
}

function checkBankrupt(room, playerIdx) {
  const p = room.players[playerIdx];
  if (p.cash < 0) {
    p.bankrupt = true;
    p.cash = 0;
    Object.keys(room.properties).forEach(id => {
      if (room.properties[id].owner === playerIdx) delete room.properties[id];
    });
    addLog(room, `💀 ${p.name} is BANKRUPT and eliminated!`, 'bad');
    return true;
  }
  return false;
}

function payRent(room, fromIdx, toIdx, amount, propName) {
  const payer = room.players[fromIdx];
  const owner = room.players[toIdx];
  const actual = Math.min(amount, payer.cash);
  payer.cash -= actual;
  owner.cash += actual;
  addLog(room, `${payer.name} paid $${actual} rent to ${owner.name} for ${propName}`, 'bad');
  checkBankrupt(room, fromIdx);
  room.turnPhase = 'end';
}

function applyCard(room, playerIdx, card) {
  const p = room.players[playerIdx];
  let gotoCell = null;

  switch (card.action) {
    case 'cash':
      p.cash += card.amount;
      addLog(room, `${p.name}: ${card.text} (${card.amount > 0 ? '+' : ''}$${card.amount})`, card.amount > 0 ? 'good' : 'bad');
      if (card.amount < 0) checkBankrupt(room, playerIdx);
      room.turnPhase = 'end';
      break;
    case 'goto':
      if (p.position > card.target && card.collect) { p.cash += card.collect; addLog(room, `${p.name} passed GO! +$${card.collect}`, 'good'); }
      p.position = card.target;
      gotoCell = card.target;
      break;
    case 'jail':
      p.position = 10; p.inJail = true; p.jailTurns = 0;
      addLog(room, `${p.name} → Jail! 🔒`, 'bad');
      room.turnPhase = 'end';
      break;
    case 'move':
      const newPos = (p.position + card.steps + 40) % 40;
      if (card.steps < 0 && newPos > p.position) { /* went back, no go bonus */ }
      p.position = newPos;
      gotoCell = newPos;
      break;
    case 'nearest':
      const target = findNearest(p.position, card.nearType);
      if (p.position > target) { p.cash += 200; addLog(room, `${p.name} passed GO! +$200`, 'good'); }
      p.position = target;
      gotoCell = target;
      break;
    case 'repairs':
      let cost = 0;
      Object.entries(room.properties).forEach(([id, pd]) => {
        if (pd.owner === playerIdx) {
          cost += pd.houses < 5 ? pd.houses * card.house : card.hotel;
        }
      });
      p.cash -= cost;
      addLog(room, `${p.name} paid $${cost} for repairs.`, 'bad');
      checkBankrupt(room, playerIdx);
      room.turnPhase = 'end';
      break;
  }

  return gotoCell;
}

function landOnCell(room, playerIdx) {
  const p = room.players[playerIdx];
  const cell = BOARD[p.position];
  addLog(room, `${p.name} landed on ${cell.name}`, 'info');
  room.turnPhase = 'action';

  switch (cell.type) {
    case 'go':
    case 'jail':
      room.turnPhase = 'end';
      break;

    case 'gotojail':
      p.position = 10; p.inJail = true; p.jailTurns = 0;
      addLog(room, `${p.name} → Jail! 🔒`, 'bad');
      room.turnPhase = 'end';
      break;

    case 'parking':
      if (room.settings.vacationCash && room.vacationPool > 0) {
        p.cash += room.vacationPool;
        addLog(room, `${p.name} collected Vacation Pool: $${room.vacationPool}! 🎉`, 'good');
        room.vacationPool = 0;
      }
      room.turnPhase = 'end';
      break;

    case 'tax':
      p.cash -= cell.amount;
      if (room.settings.vacationCash) room.vacationPool += cell.amount;
      addLog(room, `${p.name} paid ${cell.name}: $${cell.amount}`, 'bad');
      checkBankrupt(room, playerIdx);
      room.turnPhase = 'end';
      break;

    case 'chance': {
      const card = CHANCE_CARDS[Math.floor(Math.random() * CHANCE_CARDS.length)];
      addLog(room, `📜 Chance: "${card.text}"`, 'info');
      room.pendingAction = { type: 'card', card, playerIdx };
      broadcast(room.code, 'cardDrawn', { kind: 'chance', card });
      const gotoCell = applyCard(room, playerIdx, card);
      if (gotoCell !== null) {
        setTimeout(() => { landOnCell(room, playerIdx); syncState(room.code); }, 300);
        return;
      }
      break;
    }

    case 'community': {
      const card = COMMUNITY_CARDS[Math.floor(Math.random() * COMMUNITY_CARDS.length)];
      addLog(room, `💌 Community: "${card.text}"`, 'info');
      room.pendingAction = { type: 'card', card, playerIdx };
      broadcast(room.code, 'cardDrawn', { kind: 'community', card });
      const gotoCell = applyCard(room, playerIdx, card);
      if (gotoCell !== null) {
        setTimeout(() => { landOnCell(room, playerIdx); syncState(room.code); }, 300);
        return;
      }
      break;
    }

    case 'property':
    case 'railroad':
    case 'utility': {
      const prop = room.properties[cell.id];
      if (!prop) {
        // unowned — prompt current player to buy
        room.pendingAction = { type: 'buy', cellId: cell.id };
        room.turnPhase = 'action';
      } else if (prop.owner === playerIdx) {
        room.turnPhase = 'end';
      } else if (prop.mortgaged) {
        addLog(room, `${cell.name} is mortgaged. No rent.`, 'info');
        room.turnPhase = 'end';
      } else {
        const owner = room.players[prop.owner];
        if (owner.inJail && room.settings.noPrisonRent) {
          addLog(room, `${owner.name} is in jail. No rent collected.`, 'info');
          room.turnPhase = 'end';
          break;
        }
        let rent = 0;
        if (cell.type === 'property') {
          rent = cell.rent[Math.min(prop.houses, cell.rent.length - 1)];
          if (room.settings.doubleRent && prop.houses === 0 && ownsFullSet(room, prop.owner, cell)) rent *= 2;
        } else if (cell.type === 'railroad') {
          const cnt = railroadCount(room, prop.owner);
          rent = cell.rent[Math.min(cnt - 1, 3)];
        } else {
          // utility
          const d1 = Math.floor(Math.random() * 6) + 1;
          const d2 = Math.floor(Math.random() * 6) + 1;
          const roll = d1 + d2;
          const both = Object.entries(room.properties).filter(([id, pd]) => pd.owner === prop.owner && BOARD[parseInt(id)].type === 'utility').length === 2;
          rent = roll * (both ? 10 : 4);
        }
        payRent(room, playerIdx, prop.owner, rent, cell.name);
      }
      break;
    }

    default:
      room.turnPhase = 'end';
  }
}

function doMove(room, playerIdx, steps) {
  const p = room.players[playerIdx];
  const oldPos = p.position;
  const newPos = (oldPos + steps + 40) % 40;
  if (newPos < oldPos && steps > 0) {
    p.cash += 200;
    addLog(room, `${p.name} passed GO! +$200 🚀`, 'good');
  }
  p.position = newPos;
  landOnCell(room, playerIdx);
}

function nextAlivePlayer(room) {
  let next = (room.currentTurn + 1) % room.players.length;
  let tries = 0;
  while (room.players[next].bankrupt && tries < room.players.length) {
    next = (next + 1) % room.players.length;
    tries++;
  }
  return next;
}

function checkWinner(room) {
  const alive = room.players.filter(p => !p.bankrupt);
  if (alive.length === 1) {
    room.phase = 'ended';
    broadcast(room.code, 'gameOver', { winner: alive[0] });
    addLog(room, `🏆 ${alive[0].name} WINS THE GAME!`, 'good');
    return true;
  }
  return false;
}

// ─────────────────────────────────────────────
//  SOCKET EVENTS
// ─────────────────────────────────────────────
io.on('connection', (socket) => {
  console.log(`+ connected: ${socket.id}`);

  // ── CREATE ROOM ──
  socket.on('createRoom', ({ name, settings }) => {
    const code = createRoom(socket.id, name, settings);
    const room = getRoom(code);
    const tokenIdx = 0;
    room.players.push({
      socketId: socket.id, name, token: tokenIdx,
      cash: settings.startCash, position: 0,
      inJail: false, jailTurns: 0, bankrupt: false,
      idx: 0,
    });
    socket.join(code);
    socket.data.roomCode = code;
    socket.data.playerIdx = 0;
    socket.emit('roomCreated', { code });
    syncState(code);
  });

  // ── JOIN ROOM ──
  socket.on('joinRoom', ({ code, name }) => {
    const room = getRoom(code.toUpperCase());
    if (!room) { socket.emit('error', 'Room not found'); return; }
    if (room.phase !== 'lobby') { socket.emit('error', 'Game already started'); return; }
    if (room.players.length >= 6) { socket.emit('error', 'Room full (max 6)'); return; }

    const tokenIdx = room.players.length;
    const playerIdx = room.players.length;
    room.players.push({
      socketId: socket.id, name, token: tokenIdx,
      cash: room.settings.startCash, position: 0,
      inJail: false, jailTurns: 0, bankrupt: false,
      idx: playerIdx,
    });
    socket.join(code.toUpperCase());
    socket.data.roomCode = code.toUpperCase();
    socket.data.playerIdx = playerIdx;
    addLog(room, `${name} joined the room!`, 'info');
    socket.emit('joinedRoom', { playerIdx, code: code.toUpperCase() });
    syncState(code.toUpperCase());
  });

  // ── START GAME ──
  socket.on('startGame', () => {
    const code = socket.data.roomCode;
    const room = getRoom(code);
    if (!room || socket.id !== room.host) { socket.emit('error', 'Only host can start'); return; }
    if (room.players.length < 2) { socket.emit('error', 'Need at least 2 players'); return; }
    room.phase = 'playing';
    room.currentTurn = 0;
    room.turnPhase = 'roll';
    addLog(room, `Game started! ${room.players.length} players. Starting cash: $${room.settings.startCash}`, 'info');
    addLog(room, `⚠️ "Doubles = Extra Turn" is permanently disabled.`, 'bad');
    syncState(code);
  });

  // ── ROLL DICE ──
  socket.on('rollDice', () => {
    const code = socket.data.roomCode;
    const room = getRoom(code);
    if (!room || room.phase !== 'playing') return;
    const pi = socket.data.playerIdx;
    if (pi !== room.currentTurn) { socket.emit('error', 'Not your turn'); return; }
    if (room.turnPhase !== 'roll') { socket.emit('error', 'Cannot roll now'); return; }

    const p = room.players[pi];
    const d1 = Math.floor(Math.random() * 6) + 1;
    const d2 = Math.floor(Math.random() * 6) + 1;
    const sum = d1 + d2;

    addLog(room, `${p.name} rolled ${d1}+${d2}=${sum}`, 'info');
    broadcast(code, 'diceRolled', { d1, d2, sum, playerIdx: pi });

    // DOUBLES EXTRA TURN: permanently OFF (as requested)

    if (p.inJail) {
      p.jailTurns++;
      if (p.jailTurns >= 3) {
        if (p.cash >= 50) {
          p.cash -= 50;
          p.inJail = false; p.jailTurns = 0;
          addLog(room, `${p.name} paid $50 to leave jail.`, 'info');
          setTimeout(() => { doMove(room, pi, sum); syncState(code); }, 600);
          return;
        } else {
          addLog(room, `${p.name} can't afford $50 jail fee. Skipping.`, 'bad');
          room.turnPhase = 'end';
          syncState(code);
          return;
        }
      } else {
        addLog(room, `${p.name} is in jail (turn ${p.jailTurns}/3).`, 'bad');
        room.turnPhase = 'end';
        syncState(code);
        return;
      }
    }

    setTimeout(() => {
      doMove(room, pi, sum);
      syncState(code);
    }, 600);
  });

  // ── PAY JAIL FEE EARLY ──
  socket.on('payJailFee', () => {
    const code = socket.data.roomCode;
    const room = getRoom(code);
    if (!room) return;
    const pi = socket.data.playerIdx;
    if (pi !== room.currentTurn || room.turnPhase !== 'roll') return;
    const p = room.players[pi];
    if (!p.inJail) return;
    if (p.cash < 50) { socket.emit('error', 'Not enough cash'); return; }
    p.cash -= 50;
    p.inJail = false; p.jailTurns = 0;
    addLog(room, `${p.name} paid $50 to leave jail early.`, 'info');
    syncState(code);
  });

  // ── BUY PROPERTY ──
  socket.on('buyProperty', ({ cellId }) => {
    const code = socket.data.roomCode;
    const room = getRoom(code);
    if (!room) return;
    const pi = socket.data.playerIdx;
    if (pi !== room.currentTurn) return;
    if (!room.pendingAction || room.pendingAction.type !== 'buy' || room.pendingAction.cellId !== cellId) return;

    const p = room.players[pi];
    const cell = BOARD[cellId];
    if (p.cash < cell.price) { socket.emit('error', 'Not enough cash'); return; }
    p.cash -= cell.price;
    room.properties[cellId] = { owner: pi, houses: 0, mortgaged: false };
    addLog(room, `${p.name} bought ${cell.name} for $${cell.price}!`, 'good');
    room.pendingAction = null;
    room.turnPhase = 'end';
    syncState(code);
  });

  // ── SKIP BUY (trigger auction or just skip) ──
  socket.on('skipBuy', ({ cellId }) => {
    const code = socket.data.roomCode;
    const room = getRoom(code);
    if (!room) return;
    const pi = socket.data.playerIdx;
    if (pi !== room.currentTurn) return;
    room.pendingAction = null;

    if (room.settings.auction) {
      room.pendingAction = { type: 'auction', cellId };
      addLog(room, `${BOARD[cellId].name} goes to auction!`, 'info');
      broadcast(code, 'auctionStarted', { cellId, cell: BOARD[cellId] });
    } else {
      room.turnPhase = 'end';
    }
    syncState(code);
  });

  // ── AUCTION BID ──
  socket.on('auctionBid', ({ cellId, amount }) => {
    const code = socket.data.roomCode;
    const room = getRoom(code);
    if (!room || !room.pendingAction || room.pendingAction.type !== 'auction') return;
    if (!room.pendingAction.bids) room.pendingAction.bids = {};
    const pi = socket.data.playerIdx;
    const p = room.players[pi];
    if (amount > p.cash || amount < 1) { socket.emit('error', 'Invalid bid'); return; }
    room.pendingAction.bids[pi] = amount;
    addLog(room, `${p.name} bid $${amount} for ${BOARD[cellId].name}`, 'info');
    broadcast(code, 'bidReceived', { playerIdx: pi, amount });
    syncState(code);
  });

  // ── FINALIZE AUCTION (host only) ──
  socket.on('finalizeAuction', () => {
    const code = socket.data.roomCode;
    const room = getRoom(code);
    if (!room || socket.id !== room.host) return;
    if (!room.pendingAction || room.pendingAction.type !== 'auction') return;

    const { cellId, bids = {} } = room.pendingAction;
    let topBid = 0, topBidder = -1;
    Object.entries(bids).forEach(([pi, amt]) => {
      if (amt > topBid) { topBid = amt; topBidder = parseInt(pi); }
    });

    if (topBidder >= 0 && topBid > 0) {
      room.players[topBidder].cash -= topBid;
      room.properties[cellId] = { owner: topBidder, houses: 0, mortgaged: false };
      addLog(room, `${room.players[topBidder].name} won auction for ${BOARD[cellId].name}: $${topBid}!`, 'good');
    } else {
      addLog(room, `No valid bids. ${BOARD[cellId].name} stays unowned.`, 'info');
    }
    room.pendingAction = null;
    room.turnPhase = 'end';
    syncState(code);
  });

  // ── BUILD HOUSE ──
  socket.on('buildHouse', ({ cellId }) => {
    const code = socket.data.roomCode;
    const room = getRoom(code);
    if (!room) return;
    const pi = socket.data.playerIdx;
    const p = room.players[pi];
    const cell = BOARD[cellId];
    const prop = room.properties[cellId];
    if (!prop || prop.owner !== pi) { socket.emit('error', 'Not your property'); return; }
    if (prop.houses >= 5) { socket.emit('error', 'Already has hotel'); return; }
    if (!ownsFullSet(room, pi, cell)) { socket.emit('error', 'Need full color set'); return; }
    if (room.settings.evenBuild) {
      const group = BOARD.filter(c => c.group === cell.group);
      const myH = prop.houses;
      const minH = Math.min(...group.map(c => room.properties[c.id]?.houses || 0));
      if (myH > minH) { socket.emit('error', 'Must build evenly'); return; }
    }
    if (p.cash < cell.houseCost) { socket.emit('error', 'Not enough cash'); return; }
    p.cash -= cell.houseCost;
    prop.houses++;
    addLog(room, `${p.name} built ${prop.houses >= 5 ? 'hotel' : 'house'} on ${cell.name}.`, 'good');
    syncState(code);
  });

  // ── SELL HOUSE ──
  socket.on('sellHouse', ({ cellId }) => {
    const code = socket.data.roomCode;
    const room = getRoom(code);
    if (!room) return;
    const pi = socket.data.playerIdx;
    const prop = room.properties[cellId];
    if (!prop || prop.owner !== pi || prop.houses === 0) { socket.emit('error', 'Cannot sell'); return; }
    const cell = BOARD[cellId];
    const refund = Math.floor(cell.houseCost / 2);
    prop.houses--;
    room.players[pi].cash += refund;
    addLog(room, `${room.players[pi].name} sold building on ${cell.name} for $${refund}.`, 'info');
    syncState(code);
  });

  // ── MORTGAGE ──
  socket.on('mortgage', ({ cellId }) => {
    const code = socket.data.roomCode;
    const room = getRoom(code);
    if (!room || !room.settings.mortgage) { socket.emit('error', 'Mortgage disabled'); return; }
    const pi = socket.data.playerIdx;
    const prop = room.properties[cellId];
    if (!prop || prop.owner !== pi) { socket.emit('error', 'Not your property'); return; }
    const cell = BOARD[cellId];
    const p = room.players[pi];
    if (prop.mortgaged) {
      const cost = Math.ceil(cell.price * 0.55);
      if (p.cash < cost) { socket.emit('error', 'Not enough cash to unmortgage'); return; }
      p.cash -= cost;
      prop.mortgaged = false;
      addLog(room, `${p.name} unmortgaged ${cell.name}.`, 'info');
    } else {
      if (prop.houses > 0) { socket.emit('error', 'Sell buildings first'); return; }
      const earn = Math.floor(cell.price / 2);
      p.cash += earn;
      prop.mortgaged = true;
      addLog(room, `${p.name} mortgaged ${cell.name} for $${earn}.`, 'info');
    }
    syncState(code);
  });

  // ── END TURN ──
  socket.on('endTurn', () => {
    const code = socket.data.roomCode;
    const room = getRoom(code);
    if (!room || room.phase !== 'playing') return;
    const pi = socket.data.playerIdx;
    if (pi !== room.currentTurn || room.turnPhase !== 'end') return;

    if (checkWinner(room)) { syncState(code); return; }

    room.currentTurn = nextAlivePlayer(room);
    room.turnPhase = 'roll';
    room.pendingAction = null;
    addLog(room, `--- ${room.players[room.currentTurn].name}'s turn ---`, 'info');
    syncState(code);
  });

  // ── PROPOSE TRADE ──
  socket.on('proposeTrade', ({ toIdx, myProps, theirProps, myCash, theirCash }) => {
    const code = socket.data.roomCode;
    const room = getRoom(code);
    if (!room) return;
    const fromIdx = socket.data.playerIdx;
    const from = room.players[fromIdx];
    const to = room.players[toIdx];
    if (!to || to.bankrupt) { socket.emit('error', 'Invalid trade target'); return; }
    if (myCash > from.cash) { socket.emit('error', 'Not enough cash for trade offer'); return; }

    room.pendingTrade = { fromIdx, toIdx, myProps, theirProps, myCash, theirCash };
    addLog(room, `${from.name} proposed a trade to ${to.name}`, 'trade');

    // notify the target player
    const targetSocket = [...io.sockets.sockets.values()].find(s => s.data.roomCode === code && s.data.playerIdx === toIdx);
    if (targetSocket) {
      targetSocket.emit('tradeProposed', { trade: room.pendingTrade, from: from.name });
    }
    syncState(code);
  });

  // ── ACCEPT TRADE ──
  socket.on('acceptTrade', () => {
    const code = socket.data.roomCode;
    const room = getRoom(code);
    if (!room || !room.pendingTrade) return;
    const pi = socket.data.playerIdx;
    const trade = room.pendingTrade;
    if (pi !== trade.toIdx) { socket.emit('error', 'Not your trade to accept'); return; }

    const from = room.players[trade.fromIdx];
    const to = room.players[trade.toIdx];

    if (trade.myCash > from.cash) { socket.emit('error', 'Proposer no longer has enough cash'); return; }
    if (trade.theirCash > to.cash) { socket.emit('error', 'Not enough cash'); return; }

    // transfer props
    trade.myProps.forEach(id => { if (room.properties[id]) room.properties[id].owner = trade.toIdx; });
    trade.theirProps.forEach(id => { if (room.properties[id]) room.properties[id].owner = trade.fromIdx; });
    // transfer cash
    from.cash -= trade.myCash; to.cash += trade.myCash;
    to.cash -= trade.theirCash; from.cash += trade.theirCash;

    addLog(room, `🤝 Trade complete: ${from.name} ↔ ${to.name}`, 'trade');
    room.pendingTrade = null;
    syncState(code);
  });

  // ── REJECT TRADE ──
  socket.on('rejectTrade', () => {
    const code = socket.data.roomCode;
    const room = getRoom(code);
    if (!room || !room.pendingTrade) return;
    const pi = socket.data.playerIdx;
    if (pi !== room.pendingTrade.toIdx) return;
    addLog(room, `${room.players[pi].name} rejected the trade.`, 'info');
    room.pendingTrade = null;
    syncState(code);
  });

  // ── DISCONNECT ──
  socket.on('disconnect', () => {
    const code = socket.data.roomCode;
    const room = getRoom(code);
    if (!room) return;
    const pi = socket.data.playerIdx;
    if (pi !== undefined && room.players[pi]) {
      addLog(room, `⚠️ ${room.players[pi].name} disconnected.`, 'bad');
      // mark as bankrupt so game can continue
      room.players[pi].bankrupt = true;
      if (checkWinner(room)) { syncState(code); return; }
      if (room.currentTurn === pi) {
        room.currentTurn = nextAlivePlayer(room);
        room.turnPhase = 'roll';
      }
      syncState(code);
    }
    console.log(`- disconnected: ${socket.id}`);
  });
});

// ─────────────────────────────────────────────
//  START
// ─────────────────────────────────────────────
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`\n🎲 MonoWorld server running on http://localhost:${PORT}\n`);
});
