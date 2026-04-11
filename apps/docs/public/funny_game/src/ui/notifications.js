import { TOOL_META } from '../config.js';

export function renderNotifications(layerEl, notifications) {
  const signature = notifications.map((item) => `${item.id}:${item.text}`).join('|');
  if (layerEl.dataset.signature === signature) return;

  layerEl.dataset.signature = signature;
  layerEl.innerHTML = notifications
    .map((item) => {
      const toolType = item.toolType ?? 'generic';
      const meta = TOOL_META[toolType];
      const label = meta ? `${meta.token} ${meta.name}` : '提示';
      return `<div class="toast" data-tool="${toolType}"><span class="toast-tag">${label}</span>${item.text}</div>`;
    })
    .join('');
}
