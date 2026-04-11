import { GAME_CONFIG } from '../config.js';

let nextId = 1;

export function createFallingItem(type, x, y, speed, extra = {}) {
  return {
    id: nextId++,
    type,
    x,
    y,
    speed,
    radius: GAME_CONFIG.itemRadius,
    ...extra
  };
}
