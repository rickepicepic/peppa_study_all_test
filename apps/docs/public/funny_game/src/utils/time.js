import { GAME_CONFIG } from '../config.js';

export function capDelta(deltaMs) {
  return Math.max(0, Math.min(GAME_CONFIG.frameDeltaCapMs, deltaMs));
}

export function secondsLeft(untilMs, nowMs) {
  if (untilMs <= nowMs) return 0;
  return Math.ceil((untilMs - nowMs) / 1000);
}
