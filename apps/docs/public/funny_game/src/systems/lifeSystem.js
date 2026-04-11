export function applyBombHit(state, nowMs) {
  if (state.activeEffects.shield) {
    state.activeEffects.shield = false;
    state.notifications.push({
      id: `${nowMs}-shield`,
      text: '护盾抵挡了一次伤害',
      until: nowMs + 1200
    });
    return { consumedShield: true, gameOver: false };
  }

  state.life -= 1;
  if (state.life <= 0) {
    state.mode = 'gameover';
    return { consumedShield: false, gameOver: true };
  }

  return { consumedShield: false, gameOver: false };
}
