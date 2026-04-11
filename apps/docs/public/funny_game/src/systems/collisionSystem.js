export function isColliding(player, item) {
  const left = player.x - player.width / 2;
  const right = player.x + player.width / 2;
  const top = player.y - player.height / 2;
  const bottom = player.y + player.height / 2;

  const closestX = Math.max(left, Math.min(item.x, right));
  const closestY = Math.max(top, Math.min(item.y, bottom));
  const dx = item.x - closestX;
  const dy = item.y - closestY;

  return dx * dx + dy * dy <= item.radius * item.radius;
}

export function collectCollisionEvents(player, items) {
  return items.filter((item) => isColliding(player, item));
}
