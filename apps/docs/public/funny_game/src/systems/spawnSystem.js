import { GAME_CONFIG, TOOL_TYPES } from '../config.js';
import { createFallingItem } from '../entities/fallingItem.js';
import { weightedPick } from '../utils/random.js';
import { getBombRatio, getFallSpeed, getSpawnIntervalMs } from './difficultySystem.js';

const FOOD_IMAGE_KEYS = [
  'food_cake',
  'food_popsicle',
  'food_cola',
  'food_choco',
  'food_pudding',
  'food_lollipop',
  'food_burger',
  'food_milk',
  'food_cone',
  'food_watermelon',
  'food_macaron',
  'food_chicken'
];

export function pickItemType(level, randomFn = Math.random) {
  const bombRatio = getBombRatio(level);
  const toolRatio = GAME_CONFIG.baseRatios.tool;
  const foodRatio = Math.max(0, 1 - bombRatio - toolRatio);

  return weightedPick(
    [
      { value: 'food', weight: foodRatio },
      { value: 'bomb', weight: bombRatio },
      { value: 'tool', weight: toolRatio }
    ],
    randomFn
  );
}

function pickBossBuffType(randomFn = Math.random) {
  return weightedPick(
    [
      { value: 'food', weight: GAME_CONFIG.bossBuffRatios.food },
      { value: 'tool', weight: GAME_CONFIG.bossBuffRatios.tool }
    ],
    randomFn
  );
}

export function spawnOne(state, nowMs, randomFn = Math.random) {
  if (nowMs < state.nextSpawnAt) return null;

  const isBossBuffActive = state.bossBuffUntil > nowMs;
  let type = isBossBuffActive ? pickBossBuffType(randomFn) : pickItemType(state.level, randomFn);

  if (!isBossBuffActive && randomFn() < GAME_CONFIG.bossSpawnChance) {
    type = 'boss';
  }

  const x = 24 + randomFn() * (GAME_CONFIG.canvasWidth - 48);
  const speed = getFallSpeed(state.level);

  state.nextSpawnAt = nowMs + (isBossBuffActive
    ? GAME_CONFIG.bossBuffSpawnIntervalMs
    : getSpawnIntervalMs(state.level));

  if (type === 'tool') {
    const toolType = TOOL_TYPES[Math.floor(randomFn() * TOOL_TYPES.length)];
    return createFallingItem('tool', x, -16, speed, {
      toolType,
      spriteKey: `tool_${toolType}`
    });
  }

  if (type === 'bomb') {
    return createFallingItem('bomb', x, -16, speed, { spriteKey: 'bomb' });
  }

  if (type === 'boss') {
    return createFallingItem('boss', x, -16, speed * 0.95, { spriteKey: 'boss' });
  }

  const foodKey = FOOD_IMAGE_KEYS[Math.floor(randomFn() * FOOD_IMAGE_KEYS.length)];
  return createFallingItem('food', x, -16, speed, { spriteKey: foodKey });
}
