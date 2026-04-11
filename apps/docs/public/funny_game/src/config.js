export const GAME_CONFIG = {
  canvasWidth: 420,
  canvasHeight: 700,
  startLife: 3,
  levelScoreStep: 100,
  maxDifficultyScore: 1800,
  foodScore: 10,
  playerSpeed: 315,
  playerWidth: 68,
  playerHeight: 56,
  playerRenderWidth: 86,
  playerRenderHeight: 98,
  baseSpawnIntervalMs: 720,
  minSpawnIntervalMs: 260,
  spawnIntervalLevelDeltaMs: 42,
  baseFallSpeed: 132,
  maxFallSpeed: 390,
  fallSpeedLevelDelta: 18,
  baseRatios: {
    food: 0.7,
    bomb: 0.2,
    tool: 0.1
  },
  maxBombRatio: 0.3,
  bombRatioLevelDelta: 0.015,
  itemRadius: 15,
  itemRenderSize: {
    food: 40,
    bomb: 42,
    tool: 40,
    boss: 40
  },
  bossSpawnChance: 0.007,
  bossBuffDurationMs: 7000,
  bossBuffSpawnIntervalMs: 55,
  bossBuffRatios: {
    food: 0.75,
    tool: 0.25,
    bomb: 0
  },
  bossBonusScore: 50,
  magnetRadius: 110,
  magnetPullSpeed: 180,
  slowMultiplier: 0.65,
  effectDurationsMs: {
    magnet: 6000,
    slow: 5000,
    double: 8000,
    reverse: 4000
  },
  frameDeltaCapMs: 40
};

export const TOOL_TYPES = ['magnet', 'slow', 'double', 'shield', 'clear', 'reverse'];

export const TOOL_META = {
  magnet: { name: '磁铁', token: 'U', color: '#ffb703' },
  slow: { name: '减速', token: 'S', color: '#8ecae6' },
  double: { name: '双倍', token: '2x', color: '#f28482' },
  shield: { name: '护盾', token: 'O', color: '#90be6d' },
  clear: { name: '清屏', token: 'C', color: '#e9c46a' },
  reverse: { name: '混乱', token: '<>', color: '#9d4edd' },
  boss: { name: '彩蛋', token: 'BOSS', color: '#ffb84d' }
};
