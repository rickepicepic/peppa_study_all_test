import { GAME_CONFIG } from '../config.js';

export function calculateLevel(score) {
  const cappedScore = Math.min(score, GAME_CONFIG.maxDifficultyScore);
  return Math.floor(cappedScore / GAME_CONFIG.levelScoreStep) + 1;
}

export function getSpawnIntervalMs(level) {
  const interval = GAME_CONFIG.baseSpawnIntervalMs - (level - 1) * GAME_CONFIG.spawnIntervalLevelDeltaMs;
  return Math.max(GAME_CONFIG.minSpawnIntervalMs, interval);
}

export function getFallSpeed(level) {
  const speed = GAME_CONFIG.baseFallSpeed + (level - 1) * GAME_CONFIG.fallSpeedLevelDelta;
  return Math.min(GAME_CONFIG.maxFallSpeed, speed);
}

export function getBombRatio(level) {
  const ratio = GAME_CONFIG.baseRatios.bomb + (level - 1) * GAME_CONFIG.bombRatioLevelDelta;
  return Math.min(GAME_CONFIG.maxBombRatio, ratio);
}
