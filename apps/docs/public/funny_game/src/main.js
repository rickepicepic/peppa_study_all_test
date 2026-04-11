import { GAME_CONFIG } from './config.js';
import { createInitialState, persistBestScore } from './state/gameState.js';
import { bindKeyboard, bindTouch, resolveDirection } from './input/inputController.js';
import { movePlayer } from './entities/player.js';
import { spawnOne } from './systems/spawnSystem.js';
import { moveItems, applyMagnetPull } from './systems/movementSystem.js';
import { collectCollisionEvents } from './systems/collisionSystem.js';
import { calculateFoodScore } from './systems/scoreSystem.js';
import { calculateLevel } from './systems/difficultySystem.js';
import { applyToolEffect, getSpeedMultiplier, isEffectActive } from './systems/powerUpSystem.js';
import { applyBombHit } from './systems/lifeSystem.js';
import { renderGame } from './render/renderGame.js';
import { renderHud } from './ui/hud.js';
import { renderOverlay } from './ui/overlays.js';
import { renderNotifications } from './ui/notifications.js';
import { capDelta } from './utils/time.js';
import { createAssetFallback, loadAssets } from './assets/assetLoader.js';

const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const playerSpriteEl = document.getElementById('player-sprite');
const hudEl = document.getElementById('hud');
const overlayEl = document.getElementById('overlay');
const toastLayerEl = document.getElementById('toast-layer');
const leftBtn = document.getElementById('btn-left');
const rightBtn = document.getElementById('btn-right');
const bossSpriteEls = new Map();
const bgm = new Audio('./assets/bgm.mp3');
bgm.loop = true;
bgm.volume = 0.42;
let bgmUnlocked = false;

const state = createInitialState();
const assets = createAssetFallback();
let lastTs = performance.now();
let overlaySignature = '';

function resetGame() {
  const fresh = createInitialState();
  state.mode = 'playing';
  state.score = fresh.score;
  state.life = fresh.life;
  state.level = fresh.level;
  state.bossBuffUntil = fresh.bossBuffUntil;
  state.elapsedMs = fresh.elapsedMs;
  state.nextSpawnAt = fresh.nextSpawnAt;
  state.items = [];
  state.notifications = [];
  state.player = fresh.player;
  state.input.left = false;
  state.input.right = false;
  state.activeEffects = fresh.activeEffects;
  syncBgmWithMode();
}

async function tryPlayBgm() {
  try {
    await bgm.play();
    bgmUnlocked = true;
  } catch {
    // Playback will be retried after next user interaction.
  }
}

function syncBgmWithMode() {
  if (state.mode === 'playing') {
    if (bgmUnlocked && bgm.paused) {
      void tryPlayBgm();
    }
    return;
  }

  if (!bgm.paused) {
    bgm.pause();
  }
}

function updateGameOverScore() {
  if (state.score > state.bestScore) {
    state.bestScore = state.score;
    persistBestScore(state.bestScore);
  }
}

function handleCollisions(nowMs) {
  const collisions = collectCollisionEvents(state.player, state.items);
  if (collisions.length === 0) return;

  const hitIds = new Set(collisions.map((item) => item.id));

  for (const item of collisions) {
    if (item.type === 'food') {
      const gain = calculateFoodScore(
        GAME_CONFIG.foodScore,
        isEffectActive(state, 'double', nowMs)
      );
      state.score += gain;
      continue;
    }

    if (item.type === 'bomb') {
      const result = applyBombHit(state, nowMs);
      if (!result.consumedShield) {
        canvas.classList.remove('hit-flash');
        void canvas.offsetWidth;
        canvas.classList.add('hit-flash');
      }
      continue;
    }

    if (item.type === 'tool') {
      applyToolEffect(state, item.toolType, nowMs);
    }

    if (item.type === 'boss') {
      state.bossBuffUntil = nowMs + GAME_CONFIG.bossBuffDurationMs;
      state.score += GAME_CONFIG.bossBonusScore;
      state.notifications.push({
        id: `${nowMs}-boss-score`,
        text: `布布大王驾到 · +${GAME_CONFIG.bossBonusScore}`,
        toolType: 'boss',
        until: nowMs + 1800
      });
      state.notifications.push({
        id: `${nowMs}-boss-buff`,
        text: '布布大王驾到',
        toolType: 'boss',
        until: nowMs + 1500
      });
    }
  }

  state.items = state.items.filter((item) => !hitIds.has(item.id));
}

function cleanupItems() {
  state.items = state.items.filter((item) => item.y - item.radius <= GAME_CONFIG.canvasHeight + 10);
}

function refreshOverlayIfNeeded() {
  const signature =
    state.mode === 'gameover'
      ? `${state.mode}:${state.score}:${state.bestScore}:${assets.ready}`
      : state.mode;

  if (signature === overlaySignature) return;

  overlaySignature = signature;
  renderOverlay(overlayEl, state, assets);
}

function updatePlayerSprite() {
  if (!playerSpriteEl) return;

  if (!assets.player) {
    playerSpriteEl.style.display = 'none';
    return;
  }

  if (playerSpriteEl.src !== assets.player.src) {
    playerSpriteEl.src = assets.player.src;
  }

  const rect = canvas.getBoundingClientRect();
  const scaleX = rect.width / GAME_CONFIG.canvasWidth;
  const scaleY = rect.height / GAME_CONFIG.canvasHeight;

  playerSpriteEl.style.display = 'block';
  playerSpriteEl.style.left = `${state.player.x * scaleX}px`;
  playerSpriteEl.style.top = `${state.player.y * scaleY}px`;
  playerSpriteEl.style.width = `${GAME_CONFIG.playerRenderWidth * scaleX}px`;
  playerSpriteEl.style.height = `${GAME_CONFIG.playerRenderHeight * scaleY}px`;
}

function updateBossSprites() {
  for (const [id, el] of bossSpriteEls.entries()) {
    if (!state.items.some((item) => item.id === id && item.type === 'boss')) {
      el.remove();
      bossSpriteEls.delete(id);
    }
  }

  if (!assets.boss) {
    for (const [, el] of bossSpriteEls.entries()) {
      el.remove();
    }
    bossSpriteEls.clear();
    return;
  }

  const rect = canvas.getBoundingClientRect();
  const scaleX = rect.width / GAME_CONFIG.canvasWidth;
  const scaleY = rect.height / GAME_CONFIG.canvasHeight;
  const bossItems = state.items.filter((item) => item.type === 'boss');
  const parent = canvas.parentElement;
  if (!parent) return;

  for (const item of bossItems) {
    let el = bossSpriteEls.get(item.id);
    if (!el) {
      el = document.createElement('img');
      el.className = 'boss-sprite';
      el.alt = '布布大王';
      el.src = assets.boss.src;
      parent.appendChild(el);
      bossSpriteEls.set(item.id, el);
    }

    el.style.left = `${item.x * scaleX}px`;
    el.style.top = `${item.y * scaleY}px`;
    el.style.width = `${GAME_CONFIG.playerRenderWidth * scaleX}px`;
    el.style.height = `${GAME_CONFIG.playerRenderHeight * scaleY}px`;
  }
}

function tick(ts) {
  const dtMs = capDelta(ts - lastTs);
  lastTs = ts;

  if (state.mode === 'playing') {
    state.elapsedMs += dtMs;

    const reverseActive = isEffectActive(state, 'reverse', ts);
    const direction = resolveDirection(state.input, reverseActive);
    movePlayer(state.player, direction, dtMs);

    const spawned = spawnOne(state, ts);
    if (spawned) state.items.push(spawned);

    const speedMultiplier = getSpeedMultiplier(state, ts);
    moveItems(state.items, dtMs, speedMultiplier);
    applyMagnetPull(state.items, state.player, isEffectActive(state, 'magnet', ts), dtMs);

    handleCollisions(ts);
    cleanupItems();

    state.level = calculateLevel(state.score);

    if (state.mode === 'gameover') {
      updateGameOverScore();
    }
  }

  state.notifications = state.notifications.filter((n) => n.until > ts);

  renderGame(ctx, state, assets);
  updatePlayerSprite();
  updateBossSprites();
  renderHud(hudEl, state, ts);
  refreshOverlayIfNeeded();
  renderNotifications(toastLayerEl, state.notifications);
  syncBgmWithMode();

  requestAnimationFrame(tick);
}

bindKeyboard(state.input);
bindTouch(state.input, leftBtn, rightBtn);

overlayEl.addEventListener('click', (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) return;

  const action = target.dataset.action;
  if (action === 'start') {
    state.mode = 'playing';
    void tryPlayBgm();
  }
  if (action === 'resume') {
    state.mode = 'playing';
    void tryPlayBgm();
  }
  if (action === 'restart') {
    resetGame();
    void tryPlayBgm();
  }
  syncBgmWithMode();
});

window.addEventListener('keydown', (event) => {
  const isSpace = event.code === 'Space' || event.key === ' ' || event.key === 'Spacebar';
  if (!isSpace) return;
  event.preventDefault();

  if (state.mode === 'playing') {
    state.mode = 'paused';
  } else if (state.mode === 'paused') {
    state.mode = 'playing';
    void tryPlayBgm();
  }

  syncBgmWithMode();
});

window.addEventListener('pointerdown', () => {
  if (!bgmUnlocked) {
    void tryPlayBgm();
  }
}, { once: true });

window.addEventListener('keydown', () => {
  if (!bgmUnlocked) {
    void tryPlayBgm();
  }
}, { once: true });

requestAnimationFrame((ts) => {
  lastTs = ts;
  refreshOverlayIfNeeded();
  tick(ts);
});

loadAssets()
  .then((loaded) => {
    Object.assign(assets, loaded);
    overlaySignature = '';
  })
  .catch((error) => {
    console.warn('Asset loading failed, fallback rendering enabled.', error);
  });
