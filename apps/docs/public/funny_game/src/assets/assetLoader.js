const FOOD_KEYS = [
  'food_cake',
  'food_popsicle',
  'food_cola',
  'food_choco',
  'food_pudding',
  'food_lollipop',
  'food_burger',
  'food_milk',
  'food_cone',
  'food_watermelon',
  'food_macaron',
  'food_chicken'
];

const TOOL_IMAGE_KEYS = {
  magnet: 'tool_magnet',
  slow: 'tool_slow',
  double: 'tool_double',
  shield: 'tool_shield',
  clear: 'tool_clear',
  reverse: 'tool_reverse'
};

const STATIC_IMAGE_FILES = {
  background: 'bg.png',
  player: 'player.gif',
  boss: 'boss.gif',
  bomb: 'bomb.png',
  gameOver: 'gameover.gif',
  food_cake: 'food_cake.png',
  food_popsicle: 'food_popsicle.png',
  food_cola: 'food_cola.png',
  food_choco: 'food_choco.png',
  food_pudding: 'food_pudding.png',
  food_lollipop: 'food_lollipop.png',
  food_burger: 'food_burger.png',
  food_milk: 'food_milk.png',
  food_cone: 'food_cone.png',
  food_watermelon: 'food_watermelon.png',
  food_macaron: 'food_macaron.png',
  food_chicken: 'food_chicken.png',
  tool_magnet: 'tool_magnet.png',
  tool_slow: 'tool_slow.png',
  tool_double: 'tool_double.png',
  tool_shield: 'tool_shield.png',
  tool_clear: 'tool_clear.png',
  tool_reverse: 'tool_reverse.png'
};

function loadImage(fileName) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error(`Failed to load image: ${fileName}`));
    image.src = `./assets/${fileName}`;
  });
}

export async function loadAssets() {
  const entries = await Promise.all(
    Object.entries(STATIC_IMAGE_FILES).map(async ([key, fileName]) => {
      const image = await loadImage(fileName);
      return [key, image];
    })
  );

  const images = Object.fromEntries(entries);

  return {
    ...images,
    foodKeys: FOOD_KEYS,
    toolImageKeys: TOOL_IMAGE_KEYS,
    ready: true
  };
}

export function createAssetFallback() {
  return {
    ready: false,
    foodKeys: FOOD_KEYS,
    toolImageKeys: TOOL_IMAGE_KEYS
  };
}
