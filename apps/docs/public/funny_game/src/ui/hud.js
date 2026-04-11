import { secondsLeft } from '../utils/time.js';
import { TOOL_META } from '../config.js';

export function renderHud(hudEl, state, nowMs) {
  const { activeEffects } = state;

  const timers = [
    [TOOL_META.magnet.name, secondsLeft(activeEffects.magnetUntil, nowMs)],
    [TOOL_META.slow.name, secondsLeft(activeEffects.slowUntil, nowMs)],
    [TOOL_META.double.name, secondsLeft(activeEffects.doubleUntil, nowMs)],
    [TOOL_META.reverse.name, secondsLeft(activeEffects.reverseUntil, nowMs)]
  ]
    .filter(([, sec]) => sec > 0)
    .map(([name, sec]) => `[${name}]${sec}s`);

  const shieldText = activeEffects.shield ? '护盾:有' : '护盾:无';
  const effectsText = timers.length > 0 ? timers.join(' ') : '无计时道具';
  const bossLeft = secondsLeft(state.bossBuffUntil ?? 0, nowMs);
  const bossText = bossLeft > 0 ? ` | 彩蛋狂欢:${bossLeft}s` : '';

  hudEl.textContent = `分数 ${state.score} | 生命 ${state.life} | 难度 Lv.${state.level} | ${shieldText} | ${effectsText}${bossText}`;
}
