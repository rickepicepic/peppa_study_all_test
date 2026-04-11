export function renderOverlay(overlayEl, state, assets) {
  if (state.mode === 'start') {
    overlayEl.innerHTML = `
      <div class="overlay-card">
        <div class="overlay-title">接食物小游戏</div>
        <div class="overlay-sub">游戏规则：左右移动接住食物，避开炸弹。每 100 分提升难度。</div>
        <div class="overlay-rules-title">道具说明</div>
        <ul class="overlay-rules-list">
          <li>磁铁：吸附附近食物</li>
          <li>减速：掉落速度短暂降低</li>
          <li>双倍：食物得分翻倍</li>
          <li>护盾：抵挡一次炸弹伤害</li>
          <li>清场：立即清除炸弹</li>
          <li>混乱：短时间左右反转</li>
          <li>彩蛋-布布大王驾到：触发后 7 秒补给狂潮，炸弹为 0</li>
        </ul>
        <div class="overlay-actions">
          <button class="btn-primary" data-action="start">开始游戏</button>
        </div>
      </div>
    `;
    return;
  }

  if (state.mode === 'paused') {
    overlayEl.innerHTML = `
      <div class="overlay-card">
        <div class="overlay-title">已暂停</div>
        <div class="overlay-actions">
          <button class="btn-primary" data-action="resume">继续</button>
          <button class="btn-secondary" data-action="restart">重开</button>
        </div>
      </div>
    `;
    return;
  }

  if (state.mode === 'gameover') {
    const gameOverImage = assets.gameOver
      ? `<img class="overlay-gameover-gif" src="${assets.gameOver.src}" alt="游戏结束" />`
      : '';
    overlayEl.innerHTML = `
      <div class="overlay-card">
        <div class="overlay-title">游戏结束</div>
        ${gameOverImage}
        <div class="overlay-sub">本局得分 ${state.score}，最高分 ${state.bestScore}</div>
        <div class="overlay-actions">
          <button class="btn-primary" data-action="restart">再来一局</button>
        </div>
      </div>
    `;
    return;
  }

  overlayEl.innerHTML = '';
}
