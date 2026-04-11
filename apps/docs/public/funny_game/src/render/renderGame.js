import { GAME_CONFIG, TOOL_META } from '../config.js';

function drawBackground(ctx, assets) {
  const image = assets.background;
  if (!image) {
    const gradient = ctx.createLinearGradient(0, 0, 0, GAME_CONFIG.canvasHeight);
    gradient.addColorStop(0, '#163050');
    gradient.addColorStop(1, '#1f3f68');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, GAME_CONFIG.canvasWidth, GAME_CONFIG.canvasHeight);
    return;
  }

  const sourceRatio = image.width / image.height;
  const targetRatio = GAME_CONFIG.canvasWidth / GAME_CONFIG.canvasHeight;

  let sx = 0;
  let sy = 0;
  let sw = image.width;
  let sh = image.height;

  if (sourceRatio > targetRatio) {
    sw = image.height * targetRatio;
    sx = (image.width - sw) / 2;
  } else {
    sh = image.width / targetRatio;
    sy = (image.height - sh) / 2;
  }

  ctx.drawImage(image, sx, sy, sw, sh, 0, 0, GAME_CONFIG.canvasWidth, GAME_CONFIG.canvasHeight);
}

function drawPlayer(ctx, player, assets) {
  const image = assets.player;
  if (image) {
    return;
  }

  const width = GAME_CONFIG.playerRenderWidth;
  const height = GAME_CONFIG.playerRenderHeight;
  const x = player.x - width / 2;
  const y = player.y - height / 2;

  ctx.fillStyle = '#ffd166';
  ctx.beginPath();
  ctx.roundRect(player.x - player.width / 2, player.y - player.height / 2, player.width, player.height, 10);
  ctx.fill();
}

function drawItem(ctx, item, assets) {
  if (item.type === 'boss' && assets.boss) {
    return;
  }

  const image = item.spriteKey ? assets[item.spriteKey] : null;
  const renderSize = GAME_CONFIG.itemRenderSize[item.type] ?? 38;

  if (image) {
    ctx.drawImage(image, item.x - renderSize / 2, item.y - renderSize / 2, renderSize, renderSize);
    return;
  }

  if (item.type === 'food') ctx.fillStyle = '#80ed99';
  if (item.type === 'bomb') ctx.fillStyle = '#ef476f';
  if (item.type === 'boss') ctx.fillStyle = '#ffb84d';
  if (item.type === 'tool') {
    ctx.fillStyle = TOOL_META[item.toolType]?.color ?? '#4cc9f0';
  }

  ctx.beginPath();
  ctx.arc(item.x, item.y, item.radius, 0, Math.PI * 2);
  ctx.fill();

  if (item.type === 'tool') {
    ctx.save();
    ctx.strokeStyle = 'rgba(255,255,255,0.45)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(item.x, item.y, item.radius - 1.5, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  if (item.type === 'tool') {
    drawToolGlyph(ctx, item);
    return;
  }

  if (item.type === 'boss') {
    ctx.fillStyle = '#3e2413';
    ctx.font = 'bold 10px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('B', item.x, item.y);
  }
}

function drawToolGlyph(ctx, item) {
  const x = item.x;
  const y = item.y;

  ctx.save();
  ctx.strokeStyle = '#11324d';
  ctx.fillStyle = '#11324d';
  ctx.lineWidth = 1.9;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  if (item.toolType === 'shield') {
    ctx.beginPath();
    ctx.arc(x, y, 7, 0, Math.PI * 2);
    ctx.stroke();
  } else if (item.toolType === 'double') {
    ctx.font = 'bold 8px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('2x', x, y);
  } else if (item.toolType === 'magnet') {
    ctx.beginPath();
    ctx.arc(x - 3, y, 3, Math.PI * 0.5, Math.PI * 1.5);
    ctx.arc(x + 3, y, 3, Math.PI * 1.5, Math.PI * 0.5);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x - 6, y + 1.5);
    ctx.lineTo(x - 6, y + 4);
    ctx.moveTo(x + 6, y + 1.5);
    ctx.lineTo(x + 6, y + 4);
    ctx.stroke();
  } else if (item.toolType === 'slow') {
    ctx.beginPath();
    ctx.moveTo(x - 4, y + 4);
    ctx.lineTo(x + 4, y - 4);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x - 5, y - 2);
    ctx.lineTo(x - 2, y - 5);
    ctx.stroke();
  } else if (item.toolType === 'clear') {
    ctx.beginPath();
    ctx.moveTo(x - 4, y - 4);
    ctx.lineTo(x + 4, y + 4);
    ctx.moveTo(x + 4, y - 4);
    ctx.lineTo(x - 4, y + 4);
    ctx.stroke();
  } else if (item.toolType === 'reverse') {
    ctx.beginPath();
    ctx.moveTo(x - 5, y);
    ctx.lineTo(x + 5, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x - 5, y);
    ctx.lineTo(x - 2, y - 2);
    ctx.moveTo(x - 5, y);
    ctx.lineTo(x - 2, y + 2);
    ctx.moveTo(x + 5, y);
    ctx.lineTo(x + 2, y - 2);
    ctx.moveTo(x + 5, y);
    ctx.lineTo(x + 2, y + 2);
    ctx.stroke();
  } else {
    const token = TOOL_META[item.toolType]?.token ?? '?';
    ctx.font = 'bold 9px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(token, x, y);
  }

  ctx.restore();
}

export function renderGame(ctx, state, assets) {
  ctx.clearRect(0, 0, GAME_CONFIG.canvasWidth, GAME_CONFIG.canvasHeight);

  drawBackground(ctx, assets);

  drawPlayer(ctx, state.player, assets);

  for (const item of state.items) {
    drawItem(ctx, item, assets);
  }
}
