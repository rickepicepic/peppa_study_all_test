import { GAME_CONFIG } from '../config.js';

export function movePlayer(player, direction, dtMs) {
  const deltaX = direction * GAME_CONFIG.playerSpeed * (dtMs / 1000);
  player.x += deltaX;

  const half = player.width / 2;
  if (player.x < half) player.x = half;
  if (player.x > GAME_CONFIG.canvasWidth - half) {
    player.x = GAME_CONFIG.canvasWidth - half;
  }
}
