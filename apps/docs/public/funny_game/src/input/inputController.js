export function resolveDirection(input, reverse) {
  let direction = 0;
  if (input.left && !input.right) direction = -1;
  if (input.right && !input.left) direction = 1;
  return reverse ? direction * -1 : direction;
}

export function bindKeyboard(inputState) {
  const onDown = (event) => {
    const key = event.key.toLowerCase();
    if (key === 'arrowleft' || key === 'a') inputState.left = true;
    if (key === 'arrowright' || key === 'd') inputState.right = true;
  };

  const onUp = (event) => {
    const key = event.key.toLowerCase();
    if (key === 'arrowleft' || key === 'a') inputState.left = false;
    if (key === 'arrowright' || key === 'd') inputState.right = false;
  };

  window.addEventListener('keydown', onDown);
  window.addEventListener('keyup', onUp);

  return () => {
    window.removeEventListener('keydown', onDown);
    window.removeEventListener('keyup', onUp);
  };
}

export function bindTouch(inputState, leftBtn, rightBtn) {
  const startLeft = (event) => {
    event.preventDefault();
    inputState.left = true;
    inputState.right = false;
  };

  const startRight = (event) => {
    event.preventDefault();
    inputState.right = true;
    inputState.left = false;
  };

  const stopMove = (event) => {
    event.preventDefault();
    inputState.left = false;
    inputState.right = false;
  };

  leftBtn.addEventListener('pointerdown', startLeft);
  rightBtn.addEventListener('pointerdown', startRight);

  leftBtn.addEventListener('pointerup', stopMove);
  rightBtn.addEventListener('pointerup', stopMove);
  leftBtn.addEventListener('pointercancel', stopMove);
  rightBtn.addEventListener('pointercancel', stopMove);
  leftBtn.addEventListener('pointerleave', stopMove);
  rightBtn.addEventListener('pointerleave', stopMove);

  return () => {
    leftBtn.removeEventListener('pointerdown', startLeft);
    rightBtn.removeEventListener('pointerdown', startRight);
    leftBtn.removeEventListener('pointerup', stopMove);
    rightBtn.removeEventListener('pointerup', stopMove);
    leftBtn.removeEventListener('pointercancel', stopMove);
    rightBtn.removeEventListener('pointercancel', stopMove);
    leftBtn.removeEventListener('pointerleave', stopMove);
    rightBtn.removeEventListener('pointerleave', stopMove);
  };
}
