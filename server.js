const express = require('express');
const http    = require('http');
const { Server } = require('socket.io');
const path    = require('path');

const app    = express();
const server = http.createServer(app);
const io     = new Server(server, { cors: { origin: '*' } });
app.use(express.static(path.join(__dirname, 'public')));

// ─────────────────────────────────────────────
//  BOARD
// ─────────────────────────────────────────────
const BOARD = [
  {id:0,  name:'GO',              type:'go',        icon:'🚀'},
  {id:1,  name:'Mediterranean',   type:'property',  color:'#8B4513', price:60,  rent:[2,10,30,90,160,250],  houseCost:50,  group:0},
  {id:2,  name:'Community Chest', type:'community', icon:'💌'},
  {id:3,  name:'Baltic Ave',      type:'property',  color:'#8B4513', price:60,  rent:[4,20,60,180,320,450], houseCost:50,  group:0},
  {id:4,  name:'Income Tax',      type:'tax',       icon:'🏛️', amount:200},
  {id:5,  name:'Reading RR',      type:'railroad',  icon:'🚂', price:200, rent:[25,50,100,200]},
  {id:6,  name:'Oriental Ave',    type:'property',  color:'#87CEEB', price:100, rent:[6,30,90,270,400,550],  houseCost:50,  group:1},
  {id:7,  name:'Chance',          type:'chance',    icon:'❓'},
  {id:8,  name:'Vermont Ave',     type:'property',  color:'#87CEEB', price:100, rent:[6,30,90,270,400,550],  houseCost:50,  group:1},
  {id:9,  name:'Connecticut Ave', type:'property',  color:'#87CEEB', price:120, rent:[8,40,100,300,450,600], houseCost:50,  group:1},
  {id:10, name:'Jail / Visit',    type:'jail',      icon:'🔒'},
  {id:11, name:'St. Charles',     type:'property',  color:'#FF69B4', price:140, rent:[10,50,150,450,625,750],houseCost:100, group:2},
  {id:12, name:'Electric Co.',    type:'utility',   icon:'⚡', price:150},
  {id:13, name:'States Ave',      type:'property',  color:'#FF69B4', price:140, rent:[10,50,150,450,625,750],houseCost:100, group:2},
  {id:14, name:'Virginia Ave',    type:'property',  color:'#FF69B4', price:160, rent:[12,60,180,500,700,900],houseCost:100, group:2},
  {id:15, name:'Pennsylvania RR', type:'railroad',  icon:'🚂', price:200, rent:[25,50,100,200]},
  {id:16, name:'St. James',       type:'property',  color:'#FF8C00', price:180, rent:[14,70,200,550,750,950],houseCost:100, group:3},
  {id:17, name:'Community Chest', type:'community', icon:'💌'},
  {id:18, name:'Tennessee Ave',   type:'property',  color:'#FF8C00', price:180, rent:[14,70,200,550,750,950],houseCost:100, group:3},
  {id:19, name:'New York Ave',    type:'property',  color:'#FF8C00', price:200, rent:[16,80,220,600,800,1000],houseCost:100,group:3},
  {id:20, name:'Vacation',      type:'parking',   icon:'🏖️'},
  {id:21, name:'Kentucky Ave',    type:'property',  color:'#DC143C', price:220, rent:[18,90,250,700,875,1050],houseCost:150,group:4},
  {id:22, name:'Chance',          type:'chance',    icon:'❓'},
  {id:23, name:'Indiana Ave',     type:'property',  color:'#DC143C', price:220, rent:[18,90,250,700,875,1050],houseCost:150,group:4},
  {id:24, name:'Illinois Ave',    type:'property',  color:'#DC143C', price:240, rent:[20,100,300,750,925,1100],houseCost:150,group:4},
  {id:25, name:'B&O Railroad',    type:'railroad',  icon:'🚂', price:200, rent:[25,50,100,200]},
  {id:26, name:'Atlantic Ave',    type:'property',  color:'#DAA520', price:260, rent:[22,110,330,800,975,1150],houseCost:150,group:5},
  {id:27, name:'Ventnor Ave',     type:'property',  color:'#DAA520', price:260, rent:[22,110,330,800,975,1150],houseCost:150,group:5},
  {id:28, name:'Water Works',     type:'utility',   icon:'💧', price:150},
  {id:29, name:'Marvin Gardens',  type:'property',  color:'#DAA520', price:280, rent:[24,120,360,850,1025,1200],houseCost:150,group:5},
  {id:30, name:'Go to Jail',      type:'gotojail',  icon:'👮'},
  {id:31, name:'Pacific Ave',     type:'property',  color:'#228B22', price:300, rent:[26,130,390,900,1100,1275],houseCost:200,group:6},
  {id:32, name:'North Carolina',  type:'property',  color:'#228B22', price:300, rent:[26,130,390,900,1100,1275],houseCost:200,group:6},
  {id:33, name:'Community Chest', type:'community', icon:'💌'},
  {id:34, name:'Pennsylvania Ave',type:'property',  color:'#228B22', price:320, rent:[28,150,450,1000,1200,1400],houseCost:200,group:6},
  {id:35, name:'Short Line RR',   type:'railroad',  icon:'🚂', price:200, rent:[25,50,100,200]},
  {id:36, name:'Chance',          type:'chance',    icon:'❓'},
  {id:37, name:'Park Place',      type:'property',  color:'#00008B', price:350, rent:[35,175,500,1100,1300,1500],houseCost:200,group:7},
  {id:38, name:'Luxury Tax',      type:'tax',       icon:'💎', amount:100},
  {id:39, name:'Boardwalk',       type:'property',  color:'#00008B', price:400, rent:[50,200,600,1400,1700,2000],houseCost:200,group:7},
];

const CHANCE_CARDS = [
  {text:'Advance to GO. Collect $200.',                action:'goto',    target:0, collect:200},
  {text:'Bank pays you a dividend of $50.',            action:'cash',    amount:50},
  {text:'Go to Jail.',                                 action:'jail'},
  {text:'Make repairs: $25/house, $100/hotel.',        action:'repairs', house:25, hotel:100},
  {text:'Pay poor tax of $15.',                        action:'cash',    amount:-15},
  {text:'Building loan matures. Collect $150.',        action:'cash',    amount:150},
  {text:'You won a competition. Collect $100.',        action:'cash',    amount:100},
  {text:'Go back 3 spaces.',                           action:'move',    steps:-3},
  {text:'Advance to nearest Railroad.',                action:'nearest', nearType:'railroad'},
  {text:'Advance to nearest Utility.',                 action:'nearest', nearType:'utility'},
  {text:'Bank error in your favor. Collect $200.',     action:'cash',    amount:200},
  {text:'Pay school fees of $150.',                    action:'cash',    amount:-150},
];

const COMMUNITY_CARDS = [
  {text:'Bank error in your favor. Collect $200.',     action:'cash',    amount:200},
  {text:"Doctor's fees. Pay $50.",                     action:'cash',    amount:-50},
  {text:'Go to Jail.',                                 action:'jail'},
  {text:'Holiday fund matures. Receive $100.',         action:'cash',    amount:100},
  {text:'Income tax refund. Collect $20.',             action:'cash',    amount:20},
  {text:'Life insurance matures. Collect $100.',       action:'cash',    amount:100},
  {text:'Pay hospital fees of $100.',                  action:'cash',    amount:-100},
  {text:'Receive $25 consultancy fee.',                action:'cash',    amount:25},
  {text:'Street repairs: $40/house, $115/hotel.',      action:'repairs', house:40, hotel:115},
  {text:'Second prize in beauty contest. Collect $10.',action:'cash',    amount:10},
  {text:'You inherit $100.',                           action:'cash',    amount:100},
  {text:'From sale of stock you get $50.',             action:'cash',    amount:50},
];

const TOKENS       = ['🚀','🎩','🐶','🚗','🛸','🦁'];
const TOKEN_COLORS = ['#f87171','#60a5fa','#4ade80','#facc15','#a78bfa','#fb923c'];

// ─────────────────────────────────────────────
//  ECONOMIC CONSTANTS
// ─────────────────────────────────────────────
const ECO = {
  // STOCK
  SHARE_PRICE_BASE_PCT : 0.10,   // 1 share = 10 % of property price at IPO
  LAND_BUMP_PCT        : 0.05,   // price +5 % each time anyone lands
  CYCLE_1_VISITOR      : 0.08,   // end-of-cycle: 1 unique visitor  → +8 %
  CYCLE_2_VISITORS     : 0.20,   // 2 unique visitors              → +20 %
  CYCLE_3_VISITORS     : 0.40,   // 3+ unique visitors             → +40 %
  CYCLE_NO_VISITOR     : -0.12,  // 0 visitors                     → -12 %
  NEW_INVESTOR_GAIN    : 0.03,   // existing holders gain 3 % when 2-3 new investors buy in
  SELL_HOLDER_LOSS     : 0.02,   // existing holders lose 2 % when someone sells out
  STOCK_CAP_MULT       : 3.0,    // price capped at 3× initial IPO price

  // LOAN
  LOAN_MAX             : 1500,
  LOAN_GRACE_CYCLES    : 2,      // first 2 cycles: 5 % rate
  LOAN_GRACE_RATE      : 0.05,
  LOAN_NORMAL_RATE     : 0.12,
  LOAN_HARDSHIP_RATE   : 0.03,   // if cash < $300
  LOAN_HARDSHIP_CASH   : 300,

  // SAVINGS
  SAV_TIER1_MAX        : 500,
  SAV_TIER1_RATE       : 0.10,
  SAV_TIER2_MAX        : 1500,
  SAV_TIER2_RATE       : 0.06,
  SAV_TIER3_RATE       : 0.02,
  SAV_CAP              : 2000,
  SAV_QUICK_FEE        : 0.05,   // withdrawn same cycle as deposited
  SAV_NORMAL_FEE       : 0.01,

  // INSURANCE
  INS_PREMIUM          : 75,     // flat premium charged every time player passes GO
  INS_RESCUE_BONUS     : 500,    // after rescuing, player left with +$500

  // INFLATION
  INF_RATE             : 0.05,
  INF_EVERY_N          : 3,      // every 3 cycles
  INF_GAP_TRIGGER      : 3.0,    // only if richest / poorest ≥ 3×
};

// ─────────────────────────────────────────────
//  ROOM STORE
// ─────────────────────────────────────────────
const rooms = {};

function makeRoom(hostId, settings) {
  const code = Math.random().toString(36).substr(2, 5).toUpperCase();
  rooms[code] = {
    code, host: hostId, settings,
    phase      : 'lobby',
    players    : [],
    properties : {},
    vacationPool: 0,
    currentTurn: 0,
    turnPhase  : 'roll',
    pendingAction: null,
    pendingTrade : null,
    log        : [],
    cycleCount : 0,
    vacationSkip: {}, // playerIdx → true if they must skip their roll next turn
    stocks     : {},
    bank       : {},
    insurance  : {},
    inflationMult: 1.0,
  };
  return code;
}

function getRoom(c) { return rooms[c] || null; }

function initPlayer(r, socketId, name) {
  const pi = r.players.length;
  r.players.push({
    socketId, name, token: pi, idx: pi,
    cash     : r.settings.startCash,
    position : 0,
    inJail   : false, jailTurns: 0,
    bankrupt : false,
  });
  r.bank[pi] = {
    loanBalance  : 0,
    loanBorrowed : 0,   // lifetime total borrowed (for cap)
    loanGraceCycles: ECO.LOAN_GRACE_CYCLES,
    savBalance   : 0,
    savDepCycle  : -99, // cycle when last deposited (quick-fee check)
  };
  r.insurance[pi] = r.settings.insurance
    ? { active: false, used: false }  // player must manually buy
    : null;
  return pi;
}

function log_(r, msg, type = 'info') {
  r.log.push({ msg, type }); if (r.log.length > 200) r.log.shift();
}

function bc(code, ev, d) { io.to(code).emit(ev, d); }

function sync(code) {
  const r = getRoom(code); if (!r) return;
  bc(code, 'stateUpdate', {
    code         : r.code,
    phase        : r.phase,
    settings     : r.settings,
    players      : r.players,
    properties   : r.properties,
    vacationPool : r.vacationPool,
    vacationSkip : r.vacationSkip,
    currentTurn  : r.currentTurn,
    turnPhase    : r.turnPhase,
    pendingAction: r.pendingAction,
    pendingTrade : r.pendingTrade,
    log          : r.log.slice(-60),
    cycleCount   : r.cycleCount,
    stocks       : r.stocks,
    bank         : r.bank,
    insurance    : r.insurance,
    inflationMult: r.inflationMult,
  });
}

// ─────────────────────────────────────────────
//  WEALTH HELPERS
// ─────────────────────────────────────────────
function totalWealth(r, pi) {
  const p = r.players[pi]; if (!p || p.bankrupt) return 0;
  let w = p.cash + (r.bank[pi].savBalance || 0) - (r.bank[pi].loanBalance || 0);
  Object.entries(r.properties).forEach(([id, pd]) => {
    if (pd.owner === pi) {
      const c = BOARD[parseInt(id)];
      w += (c.price || 0) + pd.houses * (c.houseCost || 0) * 0.5;
    }
  });
  // add stock portfolio value
  Object.entries(r.stocks).forEach(([id, s]) => {
    w += (s.holders[pi] || 0) * s.price;
  });
  return Math.max(0, w);
}

function richestPi(r) {
  let best = -1, bw = -1;
  r.players.forEach((p, i) => { if (!p.bankrupt) { const w = totalWealth(r, i); if (w > bw) { bw = w; best = i; } } });
  return best;
}

function poorestPi(r) {
  let best = -1, bw = Infinity;
  r.players.forEach((p, i) => { if (!p.bankrupt) { const w = totalWealth(r, i); if (w < bw) { bw = w; best = i; } } });
  return best;
}

function isTopHalf(r, pi) {
  const alive = r.players.filter(p => !p.bankrupt).map((_, i) => i);
  const sorted = alive.slice().sort((a, b) => totalWealth(r, b) - totalWealth(r, a));
  const rank = sorted.indexOf(pi);
  return rank < Math.ceil(sorted.length / 2);
}

// ─────────────────────────────────────────────
//  STOCK HELPERS
// ─────────────────────────────────────────────
function listStock(r, cellId) {
  const cell = BOARD[cellId];
  if (!cell || !['property','railroad','utility'].includes(cell.type)) return;
  if (r.stocks[cellId]) return; // already listed
  const ipo = Math.round((cell.price || 150) * ECO.SHARE_PRICE_BASE_PCT);
  r.stocks[cellId] = {
    ipoPrice     : ipo,
    price        : ipo,
    history      : [ipo],
    cycleLandings: {},   // pi → count this cycle
    totalShares  : 0,
    holders      : {},   // pi → shares
  };
  log_(r, `📈 ${cell.name} listed on the market at $${ipo}/share`, 'info');
}

function delistStock(r, cellId) {
  const s = r.stocks[cellId]; if (!s) return;
  // pay out holders at current price
  Object.entries(s.holders).forEach(([pi, shares]) => {
    if (shares > 0) {
      const payout = shares * s.price;
      r.players[parseInt(pi)].cash += payout;
      log_(r, `📤 ${r.players[parseInt(pi)].name} paid out $${payout} (${shares} shares of ${BOARD[cellId].name})`, 'good');
    }
  });
  delete r.stocks[cellId];
}

function adjustHolders(r, cellId, pctChange) {
  // Apply a percentage change to all existing holders' share value
  // (we do this by adjusting price, which is already shared)
  // Actually just announce it — price change does the work
}

function stockBumpForNewInvestors(r, cellId, newInvestorCount) {
  const s = r.stocks[cellId]; if (!s) return;
  if (newInvestorCount >= 2) {
    // existing holders' value rises 3%
    const cap = s.ipoPrice * ECO.STOCK_CAP_MULT;
    s.price = Math.min(Math.round(s.price * (1 + ECO.NEW_INVESTOR_GAIN)), cap);
    s.history.push(s.price);
    if (s.history.length > 40) s.history.shift();
    log_(r, `📊 ${BOARD[cellId].name}: 2+ new investors joined — holders gain 3% (now $${s.price}/share)`, 'good');
  }
}

function stockDropForSell(r, cellId) {
  const s = r.stocks[cellId]; if (!s) return;
  s.price = Math.max(1, Math.round(s.price * (1 - ECO.SELL_HOLDER_LOSS)));
  s.history.push(s.price); if (s.history.length > 40) s.history.shift();
  log_(r, `📉 ${BOARD[cellId].name}: sell-off — holders lose 2% (now $${s.price}/share)`, 'bad');
}

function recordLanding(r, cellId, pi) {
  const s = r.stocks[cellId]; if (!s) return;
  s.cycleLandings[pi] = (s.cycleLandings[pi] || 0) + 1;
  const cap = s.ipoPrice * ECO.STOCK_CAP_MULT;
  s.price = Math.min(Math.round(s.price * (1 + ECO.LAND_BUMP_PCT)), cap);
  s.history.push(s.price); if (s.history.length > 40) s.history.shift();
}

function processStockCycleEnd(r) {
  Object.entries(r.stocks).forEach(([id, s]) => {
    const unique = Object.keys(s.cycleLandings).length;
    const cap = s.ipoPrice * ECO.STOCK_CAP_MULT;
    let pct = 0, label = '';
    if      (unique >= 3) { pct = ECO.CYCLE_3_VISITORS; label = `+40% (${unique} visitors)`; }
    else if (unique === 2) { pct = ECO.CYCLE_2_VISITORS; label = `+20% (2 visitors)`; }
    else if (unique === 1) { pct = ECO.CYCLE_1_VISITOR;  label = `+8% (1 visitor)`; }
    else                  { pct = ECO.CYCLE_NO_VISITOR;  label = `-12% (no visitors)`; }

    s.price = Math.max(1, Math.min(Math.round(s.price * (1 + pct)), cap));
    s.history.push(s.price); if (s.history.length > 40) s.history.shift();
    const dir = pct >= 0 ? '📈' : '📉';
    log_(r, `${dir} ${BOARD[parseInt(id)].name} stock ${label} → $${s.price}/share`, pct >= 0 ? 'good' : 'bad');
    s.cycleLandings = {}; // reset for next cycle
  });
}

// ─────────────────────────────────────────────
//  SAVINGS INTEREST (tiered)
// ─────────────────────────────────────────────
function calcInterest(bal) {
  if (bal <= 0) return 0;
  let interest = 0;
  const t1 = Math.min(bal, ECO.SAV_TIER1_MAX);
  interest += t1 * ECO.SAV_TIER1_RATE;
  if (bal > ECO.SAV_TIER1_MAX) {
    const t2 = Math.min(bal - ECO.SAV_TIER1_MAX, ECO.SAV_TIER2_MAX - ECO.SAV_TIER1_MAX);
    interest += t2 * ECO.SAV_TIER2_RATE;
  }
  if (bal > ECO.SAV_TIER2_MAX) {
    interest += (bal - ECO.SAV_TIER2_MAX) * ECO.SAV_TIER3_RATE;
  }
  return Math.round(interest);
}

// ─────────────────────────────────────────────
//  GO PASS — full cycle processing
// ─────────────────────────────────────────────
function onPassGo(r, pi) {
  const p = r.players[pi];
  r.cycleCount++;

  // ── STOCK CYCLE END (process once per full round, track via cycleCount) ──
  if (r.settings.stockMarket) {
    processStockCycleEnd(r);
  }

  // ── SAVINGS INTEREST ──
  if (r.settings.bank) {
    const bk = r.bank[pi];
    if (bk.savBalance > 0) {
      const interest = calcInterest(bk.savBalance);
      bk.savBalance = Math.min(bk.savBalance + interest, ECO.SAV_CAP);
      log_(r, `💾 ${p.name}'s savings: +$${interest} interest (balance $${bk.savBalance})`, 'good');
    }

    // ── LOAN INTEREST ──
    if (bk.loanBalance > 0) {
      let rate = ECO.LOAN_NORMAL_RATE;
      if (p.cash < ECO.LOAN_HARDSHIP_CASH) rate = ECO.LOAN_HARDSHIP_RATE;
      else if (bk.loanGraceCycles > 0)     { rate = ECO.LOAN_GRACE_RATE; bk.loanGraceCycles--; }
      const interest = Math.round(bk.loanBalance * rate);
      bk.loanBalance += interest;
      log_(r, `💸 ${p.name} loan interest: $${interest} @ ${Math.round(rate*100)}% → balance $${bk.loanBalance}`, 'bad');
    }
  }

  // Insurance is manually purchased by the player — no auto-deduction here

  // ── INFLATION ──
  if (r.settings.inflation && r.cycleCount % ECO.INF_EVERY_N === 0 && r.cycleCount > 0) {
    const ri = richestPi(r), po = poorestPi(r);
    if (ri >= 0 && po >= 0 && ri !== po) {
      const gap = totalWealth(r, ri) / Math.max(1, totalWealth(r, po));
      if (gap >= ECO.INF_GAP_TRIGGER) {
        r.inflationMult = parseFloat((r.inflationMult * (1 + ECO.INF_RATE)).toFixed(3));
        log_(r, `🔺 Inflation! Gap is ${gap.toFixed(1)}×. Rents now ${Math.round(r.inflationMult*100)}% for top half.`, 'bad');
      }
    }
  }
}

// ─────────────────────────────────────────────
//  RENT CALCULATION
// ─────────────────────────────────────────────
function calcRent(r, payerPi, baseRent) {
  if (!r.settings.inflation) return baseRent;
  if (isTopHalf(r, payerPi)) return Math.round(baseRent * r.inflationMult);
  return baseRent;
}

// ─────────────────────────────────────────────
//  BANKRUPTCY CHECK
// ─────────────────────────────────────────────
function bustCheck(r, pi) {
  const p = r.players[pi];
  if (p.cash >= 0) return false;

  // Insurance rescue
  if (r.settings.insurance) {
    const ins = r.insurance[pi];
    if (ins && ins.active && !ins.used) {
      const rescue = -p.cash + ECO.INS_RESCUE_BONUS;
      p.cash += rescue;
      ins.used   = true;
      ins.active = false;
      log_(r, `🛡️ ${p.name}'s insurance rescued them! +$${rescue} (including $${ECO.INS_RESCUE_BONUS} bonus). Shield now used.`, 'good');
      bc(r.code, 'insuranceTriggered', { pi, rescued: rescue });
      return false;
    }
  }

  // Bankrupt
  p.bankrupt = true; p.cash = 0;
  Object.keys(r.properties).forEach(id => {
    if (r.properties[id].owner === pi) {
      if (r.settings.stockMarket) delistStock(r, parseInt(id));
      delete r.properties[id];
    }
  });
  log_(r, `💀 ${p.name} is BANKRUPT and eliminated!`, 'bad');
  return true;
}

// ─────────────────────────────────────────────
//  PAY RENT
// ─────────────────────────────────────────────
function payRent(r, fromPi, toPi, baseRent, name) {
  const rent   = calcRent(r, fromPi, baseRent);
  const payer  = r.players[fromPi];
  const owner  = r.players[toPi];
  const actual = Math.min(rent, Math.max(0, payer.cash));
  payer.cash  -= rent;
  owner.cash  += actual;
  log_(r, `${payer.name} paid $${actual} rent to ${owner.name} for ${name}${rent > baseRent ? ` (inflated from $${baseRent})` : ''}`, 'bad');
  bustCheck(r, fromPi);
  r.turnPhase = 'end';
}

// ─────────────────────────────────────────────
//  CARD APPLICATION
// ─────────────────────────────────────────────
function applyCard(r, pi, card) {
  const p = r.players[pi];
  switch (card.action) {
    case 'cash':
      p.cash += card.amount;
      if (card.amount < 0) bustCheck(r, pi);
      r.turnPhase = 'end';
      return null;
    case 'goto':
      if (p.position > card.target && card.collect) {
        p.cash += card.collect;
        log_(r, `${p.name} passed GO via card — +$${card.collect}`, 'good');
        onPassGo(r, pi);
      }
      p.position = card.target;
      return card.target;
    case 'jail':
      p.position = 10; p.inJail = true; p.jailTurns = 0;
      log_(r, `${p.name} → Jail! 🔒`, 'bad');
      r.turnPhase = 'end';
      return null;
    case 'move':
      p.position = (p.position + card.steps + 40) % 40;
      return p.position;
    case 'nearest': {
      let best = -1, bd = 99;
      BOARD.forEach(c => { if (c.type === card.nearType) { const d = (c.id - p.position + 40) % 40; if (d < bd) { bd = d; best = c.id; } } });
      if (p.position > best) { p.cash += 300; log_(r, `${p.name} passed GO via card — +$300`, 'good'); onPassGo(r, pi); }
      p.position = best;
      return best;
    }
    case 'repairs': {
      let cost = 0;
      Object.entries(r.properties).forEach(([id, pd]) => {
        if (pd.owner === pi) cost += pd.houses < 5 ? pd.houses * card.house : card.hotel;
      });
      p.cash -= cost;
      if (cost > 0) bustCheck(r, pi);
      r.turnPhase = 'end';
      return null;
    }
  }
  r.turnPhase = 'end';
  return null;
}

// ─────────────────────────────────────────────
//  LAND ON CELL
// ─────────────────────────────────────────────
function landOn(r, pi) {
  const p    = r.players[pi];
  const cell = BOARD[p.position];
  log_(r, `${p.name} landed on ${cell.name}`, 'info');
  r.turnPhase = 'action';

  // Stock: record landing on listed city
  if (r.settings.stockMarket && r.stocks[cell.id]) recordLanding(r, cell.id, pi);

  switch (cell.type) {
    case 'go':
    case 'jail':
      r.turnPhase = 'end';
      break;

    case 'gotojail':
      p.position = 10; p.inJail = true; p.jailTurns = 0;
      log_(r, `${p.name} → Jail! 🔒`, 'bad');
      r.turnPhase = 'end';
      break;

    case 'parking':
      if (r.vacationPool > 0) {
        p.cash += r.vacationPool;
        log_(r, `🏖️ ${p.name} landed on Vacation! Collected tax pool: $${r.vacationPool}. Roll skipped next turn.`, 'good');
        bc(r.code, 'vacationTriggered', { pi, amount: r.vacationPool });
        r.vacationPool = 0;
      } else {
        log_(r, `🏖️ ${p.name} is on Vacation. Pool empty. Roll skipped next turn.`, 'info');
      }
      r.vacationSkip[pi] = true;
      r.turnPhase = 'end';
      break;

    case 'tax':
      p.cash -= cell.amount;
      // Always pool taxes (not just when vacationCash setting is on — Vacation always collects)
      r.vacationPool += cell.amount;
      log_(r, `${p.name} paid ${cell.name}: $${cell.amount} → added to Vacation pool ($${r.vacationPool})`, 'bad');
      bustCheck(r, pi);
      r.turnPhase = 'end';
      break;

    case 'chance': {
      const c = CHANCE_CARDS[Math.floor(Math.random() * CHANCE_CARDS.length)];
      log_(r, `📜 Chance: "${c.text}"`, 'info');
      bc(r.code, 'cardDrawn', { kind: 'chance', card: c });
      const g = applyCard(r, pi, c);
      if (g !== null) { setTimeout(() => { landOn(r, pi); sync(r.code); }, 500); }
      break;
    }

    case 'community': {
      const c = COMMUNITY_CARDS[Math.floor(Math.random() * COMMUNITY_CARDS.length)];
      log_(r, `💌 Community: "${c.text}"`, 'info');
      bc(r.code, 'cardDrawn', { kind: 'community', card: c });
      const g = applyCard(r, pi, c);
      if (g !== null) { setTimeout(() => { landOn(r, pi); sync(r.code); }, 500); }
      break;
    }

    case 'property':
    case 'railroad':
    case 'utility': {
      const prop = r.properties[cell.id];
      if (!prop) {
        r.pendingAction = { type: 'buy', cellId: cell.id };
      } else if (prop.owner === pi) {
        r.turnPhase = 'end';
      } else if (prop.mortgaged) {
        log_(r, `${cell.name} is mortgaged. No rent.`, 'info');
        r.turnPhase = 'end';
      } else {
        const owner = r.players[prop.owner];
        if (owner.inJail && r.settings.noPrisonRent) { r.turnPhase = 'end'; break; }
        let base = 0;
        if (cell.type === 'property') {
          base = cell.rent[Math.min(prop.houses, cell.rent.length - 1)];
          if (r.settings.doubleRent && prop.houses === 0 && ownsFullSet(r, prop.owner, cell)) base *= 2;
        } else if (cell.type === 'railroad') {
          const cnt = Object.entries(r.properties).filter(([id, pd]) => pd.owner === prop.owner && BOARD[parseInt(id)].type === 'railroad').length;
          base = cell.rent[Math.min(cnt - 1, 3)];
        } else {
          const roll = Math.floor(Math.random() * 6) + Math.floor(Math.random() * 6) + 2;
          const both = Object.entries(r.properties).filter(([id, pd]) => pd.owner === prop.owner && BOARD[parseInt(id)].type === 'utility').length === 2;
          base = roll * (both ? 10 : 4);
        }
        payRent(r, pi, prop.owner, base, cell.name);
      }
      break;
    }

    default:
      r.turnPhase = 'end';
  }
}

function doMove(r, pi, steps) {
  const p = r.players[pi];
  const newPos = (p.position + steps + 40) % 40;
  if (newPos < p.position && steps > 0) {
    p.cash += 300;
    log_(r, `${p.name} passed GO! +$300 🚀`, 'good');
    onPassGo(r, pi);
  }
  p.position = newPos;
  landOn(r, pi);
}

function ownsFullSet(r, pi, cell) {
  if (cell.group === undefined) return false;
  return BOARD.filter(c => c.group === cell.group).every(c => r.properties[c.id]?.owner === pi);
}

function nextAlive(r) {
  let n = (r.currentTurn + 1) % r.players.length, t = 0;
  while (r.players[n].bankrupt && t++ < r.players.length) n = (n + 1) % r.players.length;
  return n;
}

function checkWin(r) {
  const alive = r.players.filter(p => !p.bankrupt);
  if (alive.length === 1) {
    r.phase = 'ended';
    bc(r.code, 'gameOver', { winner: alive[0] });
    log_(r, `🏆 ${alive[0].name} WINS THE GAME!`, 'good');
    return true;
  }
  return false;
}

// ─────────────────────────────────────────────
//  SOCKET EVENTS
// ─────────────────────────────────────────────
io.on('connection', socket => {
  console.log(`+ ${socket.id}`);

  // CREATE ROOM
  socket.on('createRoom', ({ name, settings }) => {
    const code = makeRoom(socket.id, settings);
    const r    = getRoom(code);
    const pi   = initPlayer(r, socket.id, name);
    socket.join(code);
    socket.data.roomCode   = code;
    socket.data.playerIdx  = pi;
    socket.emit('roomCreated', { code });
    sync(code);
  });

  // JOIN ROOM
  socket.on('joinRoom', ({ code, name }) => {
    const r = getRoom(code.toUpperCase());
    if (!r)                     { socket.emit('error', 'Room not found');       return; }
    if (r.phase !== 'lobby')    { socket.emit('error', 'Game already started'); return; }
    if (r.players.length >= 6)  { socket.emit('error', 'Room is full (max 6)'); return; }
    const pi = initPlayer(r, socket.id, name);
    socket.join(code.toUpperCase());
    socket.data.roomCode  = code.toUpperCase();
    socket.data.playerIdx = pi;
    log_(r, `${name} joined the room.`, 'info');
    socket.emit('joinedRoom', { playerIdx: pi, code: code.toUpperCase() });
    sync(code.toUpperCase());
  });

  // START GAME
  socket.on('startGame', () => {
    const code = socket.data.roomCode;
    const r    = getRoom(code);
    if (!r || socket.id !== r.host)     { socket.emit('error', 'Only host can start'); return; }
    if (r.players.length < 2)           { socket.emit('error', 'Need at least 2 players'); return; }
    r.phase       = 'playing';
    r.currentTurn = 0;
    r.turnPhase   = 'roll';
    log_(r, `Game started! ${r.players.length} players. Doubles=Extra Turn: DISABLED.`, 'info');
    if (r.settings.insurance) log_(r, `🛡️ Insurance ON — buy for $${ECO.INS_PREMIUM} from the Bank tab. Rescues you from negative balance + $${ECO.INS_RESCUE_BONUS} bonus.`, 'info');
    if (r.settings.bank)      log_(r, `🏦 Bank ON — loans up to $${ECO.LOAN_MAX}, savings up to $${ECO.SAV_CAP}.`, 'info');
    if (r.settings.stockMarket) log_(r, `📈 Stock Market ON — properties are listed when bought.`, 'info');
    if (r.settings.inflation)   log_(r, `🔺 Inflation ON — activates when wealth gap ≥ 3×.`, 'info');
    sync(code);
  });

  // ROLL DICE
  socket.on('rollDice', () => {
    const code = socket.data.roomCode;
    const r    = getRoom(code);
    if (!r || r.phase !== 'playing') return;
    const pi = socket.data.playerIdx;
    if (pi !== r.currentTurn)   { socket.emit('error', 'Not your turn');         return; }
    if (r.turnPhase !== 'roll') { socket.emit('error', 'Cannot roll right now'); return; }

    const p = r.players[pi];

    // ── VACATION SKIP: player landed on Vacation last turn, skip this roll ──
    if (r.vacationSkip[pi]) {
      delete r.vacationSkip[pi];
      log_(r, `🏖️ ${p.name} is still on Vacation — roll skipped this turn.`, 'info');
      r.turnPhase = 'end';
      sync(code);
      return;
    }

    const d1 = Math.floor(Math.random() * 6) + 1;
    const d2 = Math.floor(Math.random() * 6) + 1;
    const sum = d1 + d2;
    log_(r, `${p.name} rolled ${d1}+${d2} = ${sum}`, 'info');
    bc(code, 'diceRolled', { d1, d2, sum, playerIdx: pi });
    // DOUBLES EXTRA TURN: permanently OFF

    if (p.inJail) {
      if (sum === 7) {
        p.inJail = false;
        p.jailTurns = 0;
        log_(r, `${p.name} rolled 7 and escaped jail for free! 🎲`, 'good');
        bc(code, 'jailEscape', { pi, roll: sum });
        setTimeout(() => { doMove(r, pi, sum); sync(code); }, 600);
        return;
      }

      p.jailTurns++;
      if (p.jailTurns >= 3) {
        if (p.cash >= 50) {
          p.cash -= 50; p.inJail = false; p.jailTurns = 0;
          log_(r, `${p.name} paid $50 bail.`, 'info');
          setTimeout(() => { doMove(r, pi, sum); sync(code); }, 600);
        } else {
          log_(r, `${p.name} can't afford bail — stays in jail.`, 'bad');
          r.turnPhase = 'end'; sync(code);
        }
      } else {
        log_(r, `${p.name} in jail (turn ${p.jailTurns}/3).`, 'bad');
        r.turnPhase = 'end'; sync(code);
      }
      return;
    }
    setTimeout(() => { doMove(r, pi, sum); sync(code); }, 600);
  });

  // PAY JAIL FEE
  socket.on('payJailFee', () => {
    const code = socket.data.roomCode; const r = getRoom(code); if (!r) return;
    const pi = socket.data.playerIdx; const p = r.players[pi];
    if (!p.inJail) return;
    if (p.cash < 50) { socket.emit('error', 'Need $50 to pay bail'); return; }
    p.cash -= 50; p.inJail = false; p.jailTurns = 0;
    log_(r, `${p.name} paid $50 bail early.`, 'info');
    sync(code);
  });

  // BUY PROPERTY
  socket.on('buyProperty', ({ cellId }) => {
    const code = socket.data.roomCode; const r = getRoom(code); if (!r) return;
    const pi = socket.data.playerIdx;
    if (pi !== r.currentTurn || !r.pendingAction || r.pendingAction.cellId !== cellId) return;
    const p = r.players[pi]; const cell = BOARD[cellId];
    if (p.cash < cell.price) { socket.emit('error', 'Not enough cash'); return; }
    p.cash -= cell.price;
    r.properties[cellId] = { owner: pi, houses: 0, mortgaged: false };
    log_(r, `${p.name} bought ${cell.name} for $${cell.price}!`, 'good');
    // List on stock market
    if (r.settings.stockMarket) listStock(r, cellId);
    r.pendingAction = null; r.turnPhase = 'end';
    sync(code);
  });

  // SKIP BUY
  socket.on('skipBuy', ({ cellId }) => {
    const code = socket.data.roomCode; const r = getRoom(code); if (!r) return;
    const pi = socket.data.playerIdx;
    if (pi !== r.currentTurn) return;
    r.pendingAction = null;
    if (r.settings.auction) {
      r.pendingAction = { type: 'auction', cellId, bids: {} };
      log_(r, `${BOARD[cellId].name} goes to auction!`, 'info');
      bc(code, 'auctionStarted', { cellId, cell: BOARD[cellId] });
    } else { r.turnPhase = 'end'; }
    sync(code);
  });

  // AUCTION BID
  socket.on('auctionBid', ({ cellId, amount }) => {
    const code = socket.data.roomCode; const r = getRoom(code);
    if (!r || !r.pendingAction || r.pendingAction.type !== 'auction') return;
    const pi = socket.data.playerIdx; const p = r.players[pi];
    if (amount < 1 || amount > p.cash) { socket.emit('error', 'Invalid bid'); return; }
    r.pendingAction.bids[pi] = amount;
    log_(r, `${p.name} bid $${amount} for ${BOARD[cellId].name}`, 'info');
    bc(code, 'bidReceived', { playerIdx: pi, amount });
    sync(code);
  });

  // FINALIZE AUCTION
  socket.on('finalizeAuction', () => {
    const code = socket.data.roomCode; const r = getRoom(code);
    if (!r || socket.id !== r.host || !r.pendingAction || r.pendingAction.type !== 'auction') return;
    const { cellId, bids = {} } = r.pendingAction;
    let top = 0, topBi = -1;
    Object.entries(bids).forEach(([pi, amt]) => { if (amt > top) { top = amt; topBi = parseInt(pi); } });
    if (topBi >= 0 && top > 0) {
      r.players[topBi].cash -= top;
      r.properties[cellId] = { owner: topBi, houses: 0, mortgaged: false };
      if (r.settings.stockMarket) listStock(r, cellId);
      log_(r, `${r.players[topBi].name} won auction: ${BOARD[cellId].name} for $${top}!`, 'good');
    } else {
      log_(r, `No valid bids. ${BOARD[cellId].name} stays unowned.`, 'info');
    }
    r.pendingAction = null; r.turnPhase = 'end';
    sync(code);
  });

  // BUILD HOUSE
  socket.on('buildHouse', ({ cellId }) => {
    const code = socket.data.roomCode; const r = getRoom(code); if (!r) return;
    const pi = socket.data.playerIdx; const p = r.players[pi];
    const prop = r.properties[cellId]; const cell = BOARD[cellId];
    if (!prop || prop.owner !== pi)        { socket.emit('error', 'Not your property'); return; }
    if (prop.houses >= 5)                  { socket.emit('error', 'Already has a hotel'); return; }
    if (!ownsFullSet(r, pi, cell))         { socket.emit('error', 'Need the full colour set'); return; }
    if (r.settings.evenBuild) {
      const grp = BOARD.filter(c => c.group === cell.group);
      if (prop.houses > Math.min(...grp.map(c => r.properties[c.id]?.houses || 0))) {
        socket.emit('error', 'Must build evenly across the set'); return;
      }
    }
    if (p.cash < cell.houseCost) { socket.emit('error', 'Not enough cash'); return; }
    p.cash -= cell.houseCost; prop.houses++;
    log_(r, `${p.name} built a ${prop.houses >= 5 ? 'hotel 🏨' : 'house 🏠'} on ${cell.name}.`, 'good');
    sync(code);
  });

  // SELL HOUSE
  socket.on('sellHouse', ({ cellId }) => {
    const code = socket.data.roomCode; const r = getRoom(code); if (!r) return;
    const pi = socket.data.playerIdx; const prop = r.properties[cellId];
    if (!prop || prop.owner !== pi || prop.houses === 0) { socket.emit('error', 'Cannot sell'); return; }
    const refund = Math.floor(BOARD[cellId].houseCost / 2);
    prop.houses--; r.players[pi].cash += refund;
    log_(r, `${r.players[pi].name} sold a building on ${BOARD[cellId].name} for $${refund}.`, 'info');
    sync(code);
  });

  // MORTGAGE
  socket.on('mortgage', ({ cellId }) => {
    const code = socket.data.roomCode; const r = getRoom(code);
    if (!r || !r.settings.mortgage) { socket.emit('error', 'Mortgage rule is off'); return; }
    const pi = socket.data.playerIdx; const prop = r.properties[cellId];
    const p = r.players[pi]; const cell = BOARD[cellId];
    if (!prop || prop.owner !== pi) { socket.emit('error', 'Not your property'); return; }
    if (prop.mortgaged) {
      const cost = Math.ceil(cell.price * 0.55);
      if (p.cash < cost) { socket.emit('error', 'Not enough to unmortgage'); return; }
      p.cash -= cost; prop.mortgaged = false;
      log_(r, `${p.name} unmortgaged ${cell.name} for $${cost}.`, 'info');
    } else {
      if (prop.houses > 0) { socket.emit('error', 'Sell all buildings first'); return; }
      const earn = Math.floor(cell.price / 2);
      p.cash += earn; prop.mortgaged = true;
      log_(r, `${p.name} mortgaged ${cell.name} for $${earn}.`, 'info');
    }
    sync(code);
  });

  // END TURN
  socket.on('endTurn', () => {
    const code = socket.data.roomCode; const r = getRoom(code);
    if (!r || r.phase !== 'playing') return;
    const pi = socket.data.playerIdx;
    if (pi !== r.currentTurn || r.turnPhase !== 'end') return;
    if (checkWin(r)) { sync(code); return; }
    r.currentTurn   = nextAlive(r);
    r.turnPhase     = 'roll';
    r.pendingAction = null;
    log_(r, `--- ${r.players[r.currentTurn].name}'s turn ---`, 'info');
    sync(code);
  });

  // ─── STOCK MARKET ───────────────────────────

  socket.on('buyStock', ({ cellId, shares }) => {
    const code = socket.data.roomCode; const r = getRoom(code); if (!r) return;
    if (!r.settings.stockMarket) { socket.emit('error', 'Stock market is off'); return; }
    const pi = socket.data.playerIdx; const p = r.players[pi];
    const s  = r.stocks[cellId];
    if (!s) { socket.emit('error', 'Not listed on market'); return; }
    if (shares < 1) { socket.emit('error', 'Min 1 share'); return; }
    const cost = s.price * shares;
    if (p.cash < cost) { socket.emit('error', `Need $${cost} (have $${p.cash})`); return; }

    const prevHolders = Object.values(s.holders).filter(sh => sh > 0).length;
    p.cash -= cost;
    s.holders[pi] = (s.holders[pi] || 0) + shares;
    s.totalShares += shares;
    log_(r, `${p.name} bought ${shares} share(s) of ${BOARD[cellId].name} @ $${s.price}/share`, 'good');

    // If 2-3 NEW investors now hold (count of unique holders increased by 1 and is now 2 or 3)
    const newHolders = Object.values(s.holders).filter(sh => sh > 0).length;
    const justJoined = newHolders > prevHolders; // this was a brand-new investor
    if (justJoined && newHolders >= 2 && newHolders <= 3) {
      stockBumpForNewInvestors(r, cellId, newHolders);
    }
    sync(code);
  });

  socket.on('sellStock', ({ cellId, shares }) => {
    const code = socket.data.roomCode; const r = getRoom(code); if (!r) return;
    if (!r.settings.stockMarket) { socket.emit('error', 'Stock market is off'); return; }
    const pi = socket.data.playerIdx; const p = r.players[pi];
    const s  = r.stocks[cellId];
    if (!s) { socket.emit('error', 'Not listed'); return; }
    const held = s.holders[pi] || 0;
    if (held < shares) { socket.emit('error', `Only hold ${held} shares`); return; }

    const earned = s.price * shares;
    p.cash += earned;
    s.holders[pi] -= shares;
    s.totalShares -= shares;
    if (s.holders[pi] === 0) delete s.holders[pi];
    log_(r, `${p.name} sold ${shares} share(s) of ${BOARD[cellId].name} @ $${s.price}/share = +$${earned}`, 'good');
    // Existing holders lose 2%
    stockDropForSell(r, cellId);
    sync(code);
  });

  // ─── BANK — LOANS ───────────────────────────

  socket.on('takeLoan', ({ amount }) => {
    const code = socket.data.roomCode; const r = getRoom(code); if (!r) return;
    if (!r.settings.bank) { socket.emit('error', 'Bank is off'); return; }
    const pi = socket.data.playerIdx; const p = r.players[pi];
    const bk = r.bank[pi];
    // Richest player cannot borrow
    if (richestPi(r) === pi) { socket.emit('error', "The richest player can't take a loan"); return; }
    const remaining = ECO.LOAN_MAX - bk.loanBorrowed;
    if (amount < 1 || amount > remaining) { socket.emit('error', `Max remaining loan: $${remaining}`); return; }
    p.cash += amount;
    bk.loanBalance  += amount;
    bk.loanBorrowed += amount;
    log_(r, `🏦 ${p.name} borrowed $${amount}. Remaining limit: $${remaining - amount}`, 'info');
    sync(code);
  });

  socket.on('repayLoan', ({ amount }) => {
    const code = socket.data.roomCode; const r = getRoom(code); if (!r) return;
    if (!r.settings.bank) return;
    const pi = socket.data.playerIdx; const p = r.players[pi];
    const bk = r.bank[pi];
    if (bk.loanBalance <= 0) { socket.emit('error', 'No active loan'); return; }
    if (p.cash < amount)     { socket.emit('error', 'Not enough cash'); return; }
    const actual = Math.min(amount, bk.loanBalance);
    p.cash -= actual; bk.loanBalance -= actual;
    log_(r, `🏦 ${p.name} repaid $${actual}. Loan balance: $${bk.loanBalance}`, 'info');
    sync(code);
  });

  // ─── BANK — SAVINGS ─────────────────────────

  socket.on('deposit', ({ amount }) => {
    const code = socket.data.roomCode; const r = getRoom(code); if (!r) return;
    if (!r.settings.bank) { socket.emit('error', 'Bank is off'); return; }
    const pi = socket.data.playerIdx; const p = r.players[pi];
    const bk = r.bank[pi];
    if (amount < 1 || p.cash < amount) { socket.emit('error', 'Invalid amount'); return; }
    if (bk.savBalance + amount > ECO.SAV_CAP) { socket.emit('error', `Savings capped at $${ECO.SAV_CAP}`); return; }
    p.cash -= amount;
    bk.savBalance   += amount;
    bk.savDepCycle   = r.cycleCount;
    log_(r, `💾 ${p.name} deposited $${amount}. Savings: $${bk.savBalance}`, 'info');
    sync(code);
  });

  socket.on('withdraw', ({ amount }) => {
    const code = socket.data.roomCode; const r = getRoom(code); if (!r) return;
    if (!r.settings.bank) return;
    const pi = socket.data.playerIdx; const p = r.players[pi];
    const bk = r.bank[pi];
    if (amount < 1 || bk.savBalance < amount) { socket.emit('error', 'Not enough in savings'); return; }
    const sameC = bk.savDepCycle === r.cycleCount;
    const fee   = Math.round(amount * (sameC ? ECO.SAV_QUICK_FEE : ECO.SAV_NORMAL_FEE));
    const recv  = amount - fee;
    bk.savBalance -= amount;
    p.cash        += recv;
    log_(r, `💾 ${p.name} withdrew $${amount} (fee $${fee}). Received $${recv}.`, 'info');
    sync(code);
  });

  // ─── BUY INSURANCE ──────────────────────────

  socket.on('buyInsurance', () => {
    const code = socket.data.roomCode; const r = getRoom(code); if (!r) return;
    if (!r.settings.insurance) { socket.emit('error', 'Insurance is disabled'); return; }
    const pi = socket.data.playerIdx; const p = r.players[pi];
    const ins = r.insurance[pi];
    if (!ins)           { socket.emit('error', 'Insurance not available'); return; }
    if (ins.active)     { socket.emit('error', 'You already have an active shield'); return; }
    if (ins.used)       { socket.emit('error', 'Insurance already used — one per game'); return; }
    if (p.cash < ECO.INS_PREMIUM) { socket.emit('error', `Need $${ECO.INS_PREMIUM} to buy insurance`); return; }
    p.cash      -= ECO.INS_PREMIUM;
    ins.active   = true;
    log_(r, `🛡️ ${p.name} bought bankruptcy insurance for $${ECO.INS_PREMIUM}. Shield is active!`, 'good');
    sync(code);
  });

  // ─── TRADE ──────────────────────────────────

  socket.on('proposeTrade', ({ toIdx, myProps, theirProps, myCash, theirCash }) => {
    const code = socket.data.roomCode; const r = getRoom(code); if (!r) return;
    const fi = socket.data.playerIdx;
    const from = r.players[fi]; const to = r.players[toIdx];
    if (!to || to.bankrupt)  { socket.emit('error', 'Invalid trade target'); return; }
    if (myCash > from.cash)  { socket.emit('error', 'Not enough cash');      return; }
    r.pendingTrade = { fromIdx: fi, toIdx, myProps, theirProps, myCash, theirCash };
    log_(r, `${from.name} proposed a trade to ${to.name}`, 'trade');
    const ts = [...io.sockets.sockets.values()].find(s => s.data.roomCode === code && s.data.playerIdx === toIdx);
    if (ts) ts.emit('tradeProposed', { trade: r.pendingTrade, from: from.name });
    sync(code);
  });

  socket.on('acceptTrade', () => {
    const code = socket.data.roomCode; const r = getRoom(code);
    if (!r || !r.pendingTrade) return;
    const pi = socket.data.playerIdx; const t = r.pendingTrade;
    if (pi !== t.toIdx) return;
    const from = r.players[t.fromIdx]; const to = r.players[t.toIdx];
    if (t.myCash > from.cash || t.theirCash > to.cash) { socket.emit('error', 'Funds changed'); return; }
    t.myProps.forEach(id => {
      if (r.properties[id]) {
        if (r.settings.stockMarket) delistStock(r, id); // delist on ownership change
        r.properties[id].owner = t.toIdx;
        if (r.settings.stockMarket) listStock(r, id);   // relist under new owner
      }
    });
    t.theirProps.forEach(id => {
      if (r.properties[id]) {
        if (r.settings.stockMarket) delistStock(r, id);
        r.properties[id].owner = t.fromIdx;
        if (r.settings.stockMarket) listStock(r, id);
      }
    });
    from.cash -= t.myCash;   to.cash   += t.myCash;
    to.cash   -= t.theirCash; from.cash += t.theirCash;
    log_(r, `🤝 Trade complete: ${from.name} ↔ ${to.name}`, 'trade');
    r.pendingTrade = null;
    sync(code);
  });

  socket.on('rejectTrade', () => {
    const code = socket.data.roomCode; const r = getRoom(code);
    if (!r || !r.pendingTrade) return;
    const pi = socket.data.playerIdx;
    if (pi !== r.pendingTrade.toIdx) return;
    log_(r, `${r.players[pi].name} rejected the trade.`, 'info');
    r.pendingTrade = null;
    sync(code);
  });

  // ─── DISCONNECT ─────────────────────────────

  socket.on('disconnect', () => {
    const code = socket.data.roomCode; const r = getRoom(code); if (!r) return;
    const pi = socket.data.playerIdx;
    if (pi !== undefined && r.players[pi]) {
      log_(r, `⚠️ ${r.players[pi].name} disconnected.`, 'bad');
      r.players[pi].bankrupt = true;
      if (r.settings.stockMarket) {
        Object.keys(r.properties).forEach(id => { if (r.properties[id].owner === pi) delistStock(r, parseInt(id)); });
      }
      if (checkWin(r)) { sync(code); return; }
      if (r.currentTurn === pi) { r.currentTurn = nextAlive(r); r.turnPhase = 'roll'; }
      sync(code);
    }
    console.log(`- ${socket.id}`);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`\n🎲 MonoWorld v3 → http://localhost:${PORT}\n`));
