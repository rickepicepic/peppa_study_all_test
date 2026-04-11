import { GAME_CONFIG } from '../config.js';

function loadBestScore() {
  try {
    const raw = localStorage.getItem('funny_game_best_score');
    const value = Number(raw);
    return Number.isFinite(value) && value > 0 ? value : 0;
  } catch {
    return 0;
  }
}

export function createInitialState() {
  return {
    mode: 'start',
    score: 0,
    bestScore: loadBestScore(),
    life: GAME_CONFIG.startLife,
    level: 1,
    bossBuffUntil: 0,
    elapsedMs: 0,
    nextSpawnAt: 0,
    items: [],
    notifications: [],
    player: {
      x: GAME_CONFIG.canvasWidth / 2,
      y: GAME_CONFIG.canvasHeight - 44,
      width: GAME_CONFIG.playerWidth,
      height: GAME_CONFIG.playerHeight
    },
    input: {
      left: false,
      right: false
    },
    activeEffects: {
      magnetUntil: 0,
      slowUntil: 0,
      doubleUntil: 0,
      reverseUntil: 0,
      shield: false
    }
  };
}

export function persistBestScore(score) {
  try {
    localStorage.setItem('funny_game_best_score', String(score));
  } catch {
    // Ignore storage write errors.
  }
}
