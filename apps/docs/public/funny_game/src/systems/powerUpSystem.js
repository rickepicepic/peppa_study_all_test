import { GAME_CONFIG, TOOL_META } from '../config.js';

export function applyToolEffect(state, toolType, nowMs) {
  const effect = state.activeEffects;

  if (toolType === 'magnet') effect.magnetUntil = nowMs + GAME_CONFIG.effectDurationsMs.magnet;
  if (toolType === 'slow') effect.slowUntil = nowMs + GAME_CONFIG.effectDurationsMs.slow;
  if (toolType === 'double') effect.doubleUntil = nowMs + GAME_CONFIG.effectDurationsMs.double;
  if (toolType === 'reverse') effect.reverseUntil = nowMs + GAME_CONFIG.effectDurationsMs.reverse;
  if (toolType === 'shield') effect.shield = true;
  if (toolType === 'clear') state.items = state.items.filter((item) => item.type !== 'bomb');

  state.notifications.push({
    id: `${nowMs}-${toolType}`,
    text: toolType === 'clear' ? '清屏生效' : `${TOOL_META[toolType].name}生效`,
    toolType,
    until: nowMs + 1200
  });
}

export function isEffectActive(state, key, nowMs) {
  const effect = state.activeEffects;

  if (key === 'shield') return effect.shield;
  if (key === 'magnet') return effect.magnetUntil > nowMs;
  if (key === 'slow') return effect.slowUntil > nowMs;
  if (key === 'double') return effect.doubleUntil > nowMs;
  if (key === 'reverse') return effect.reverseUntil > nowMs;

  return false;
}

export function getSpeedMultiplier(state, nowMs) {
  return isEffectActive(state, 'slow', nowMs) ? GAME_CONFIG.slowMultiplier : 1;
}
