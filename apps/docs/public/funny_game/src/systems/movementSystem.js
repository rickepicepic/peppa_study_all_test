import { GAME_CONFIG } from '../config.js';

export function moveItems(items, dtMs, speedMultiplier = 1) {
  const dt = dtMs / 1000;
  for (const item of items) {
    item.y += item.speed * speedMultiplier * dt;
  }
}

export function applyMagnetPull(items, player, active, dtMs) {
  if (!active) return;

  const dt = dtMs / 1000;

  for (const item of items) {
    if (item.type !== 'food') continue;

    const dx = player.x - item.x;
    const dy = player.y - item.y;
    const distance = Math.hypot(dx, dy);

    if (distance === 0 || distance > GAME_CONFIG.magnetRadius) continue;

    const nx = dx / distance;
    const ny = dy / distance;

    item.x += nx * GAME_CONFIG.magnetPullSpeed * dt;
    item.y += ny * GAME_CONFIG.magnetPullSpeed * dt;
  }
}
