// ============================================================
// SUPER MARIO BROS - 2D Pixel Art Web Game
// ============================================================

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

// Game constants
const TILE = 16;
const SCALE = 3;
const VIEW_W = 256;
const VIEW_H = 240;
const GRAVITY = 0.4;
const MAX_FALL = 8;
const FPS = 60;

canvas.width = VIEW_W * SCALE;
canvas.height = VIEW_H * SCALE;
ctx.imageSmoothingEnabled = false;

// ============================================================
// PIXEL ART SPRITE DRAWING
// ============================================================
const spriteCache = {};

function createSprite(data, palette, w, h) {
  const key = JSON.stringify({ data, palette, w, h });
  if (spriteCache[key]) return spriteCache[key];
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  const x = c.getContext('2d');
  const img = x.createImageData(w, h);
  for (let i = 0; i < data.length; i++) {
    const color = palette[data[i]];
    if (color) {
      img.data[i * 4] = color[0];
      img.data[i * 4 + 1] = color[1];
      img.data[i * 4 + 2] = color[2];
      img.data[i * 4 + 3] = 255;
    }
  }
  x.putImageData(img, 0, 0);
  spriteCache[key] = c;
  return c;
}

// Color palettes
const PAL = {
  mario: {
    0: null, // transparent
    1: [181, 49, 32],    // red
    2: [234, 158, 34],   // skin
    3: [107, 53, 0],     // brown/hair
    4: [255, 255, 255],  // white
    5: [0, 0, 0],        // black
    6: [234, 158, 34],   // gold buttons
  },
  luigi: {
    0: null,
    1: [0, 147, 0],      // green
    2: [234, 158, 34],
    3: [107, 53, 0],
    4: [255, 255, 255],
    5: [0, 0, 0],
    6: [234, 158, 34],
  },
  goomba: {
    0: null,
    1: [107, 53, 0],     // brown dark
    2: [181, 99, 33],    // brown light
    3: [234, 158, 34],   // tan
    4: [0, 0, 0],        // black
    5: [255, 255, 255],  // white
  },
  koopa: {
    0: null,
    1: [0, 147, 0],      // green
    2: [255, 255, 255],  // white
    3: [234, 158, 34],   // yellow
    4: [0, 0, 0],        // black
    5: [181, 49, 32],    // red
  },
  mushroom: {
    0: null,
    1: [181, 49, 32],    // red
    2: [255, 255, 255],  // white
    3: [234, 158, 34],   // tan
    4: [0, 0, 0],        // black
  },
  star: {
    0: null,
    1: [255, 255, 0],    // yellow
    2: [234, 158, 34],   // orange
    3: [0, 0, 0],        // black eyes
    4: [255, 255, 255],  // white
  },
  fireFlower: {
    0: null,
    1: [255, 100, 0],    // orange
    2: [255, 255, 0],    // yellow
    3: [0, 147, 0],      // green
    4: [255, 255, 255],  // white
  },
  coin: {
    0: null,
    1: [255, 200, 0],
    2: [218, 165, 0],
    3: [255, 230, 100],
  },
  brick: {
    0: null,
    1: [181, 99, 33],
    2: [107, 53, 0],
    3: [234, 158, 34],
  },
  question: {
    0: null,
    1: [234, 158, 34],
    2: [181, 99, 33],
    3: [255, 255, 255],
    4: [0, 0, 0],
  },
  ground: {
    0: null,
    1: [181, 99, 33],
    2: [107, 53, 0],
    3: [0, 147, 0],
    4: [0, 100, 0],
  },
  pipe: {
    0: null,
    1: [0, 168, 0],
    2: [0, 116, 0],
    3: [0, 210, 0],
    4: [0, 64, 0],
  },
  flag: {
    0: null,
    1: [0, 147, 0],
    2: [255, 255, 255],
    3: [107, 53, 0],
    4: [181, 49, 32],
  },
  fireball: {
    0: null,
    1: [255, 100, 0],
    2: [255, 200, 0],
    3: [255, 255, 200],
  },
};

// ============================================================
// SPRITE DATA (16x16 pixel art)
// ============================================================

// Mario standing (16x16)
const MARIO_STAND = [
  0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0,
  0,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0,
  0,0,0,0,3,3,3,2,2,5,2,0,0,0,0,0,
  0,0,0,3,2,3,2,2,2,5,2,2,2,0,0,0,
  0,0,0,3,2,3,3,2,2,2,5,2,2,2,0,0,
  0,0,0,3,3,2,2,2,2,5,5,5,5,0,0,0,
  0,0,0,0,0,2,2,2,2,2,2,2,0,0,0,0,
  0,0,0,0,1,1,4,1,1,1,0,0,0,0,0,0,
  0,0,0,1,1,1,4,1,1,4,1,1,1,0,0,0,
  0,0,1,1,1,1,4,4,4,4,1,1,1,1,0,0,
  0,0,2,2,1,4,6,4,4,6,4,1,2,2,0,0,
  0,0,2,2,2,4,4,4,4,4,4,2,2,2,0,0,
  0,0,2,2,4,4,4,4,4,4,4,4,2,2,0,0,
  0,0,0,0,4,4,4,0,0,4,4,4,0,0,0,0,
  0,0,0,3,3,3,0,0,0,0,3,3,3,0,0,0,
  0,0,3,3,3,3,0,0,0,0,3,3,3,3,0,0,
];

// Mario walking frame 1
const MARIO_WALK1 = [
  0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0,
  0,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0,
  0,0,0,0,3,3,3,2,2,5,2,0,0,0,0,0,
  0,0,0,3,2,3,2,2,2,5,2,2,2,0,0,0,
  0,0,0,3,2,3,3,2,2,2,5,2,2,2,0,0,
  0,0,0,3,3,2,2,2,2,5,5,5,5,0,0,0,
  0,0,0,0,0,2,2,2,2,2,2,2,0,0,0,0,
  0,0,0,0,1,1,1,1,1,4,0,0,0,0,0,0,
  0,0,0,0,1,1,1,1,4,4,4,0,0,0,0,0,
  0,0,0,0,0,1,1,4,4,4,0,0,0,0,0,0,
  0,0,0,0,0,4,4,4,4,0,0,0,0,0,0,0,
  0,0,0,0,4,4,4,3,3,0,0,0,0,0,0,0,
  0,0,0,0,4,4,3,3,0,0,0,0,0,0,0,0,
  0,0,0,3,3,3,3,0,0,0,0,0,0,0,0,0,
  0,0,0,3,3,3,0,0,0,0,0,0,0,0,0,0,
  0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
];

// Mario walking frame 2
const MARIO_WALK2 = [
  0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0,
  0,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0,
  0,0,0,0,3,3,3,2,2,5,2,0,0,0,0,0,
  0,0,0,3,2,3,2,2,2,5,2,2,2,0,0,0,
  0,0,0,3,2,3,3,2,2,2,5,2,2,2,0,0,
  0,0,0,3,3,2,2,2,2,5,5,5,5,0,0,0,
  0,0,0,0,0,2,2,2,2,2,2,2,0,0,0,0,
  0,0,1,1,1,1,4,1,1,0,0,0,0,0,0,0,
  0,1,1,1,1,4,4,4,1,1,0,0,0,0,0,0,
  0,0,0,0,4,4,4,1,1,1,0,0,0,0,0,0,
  0,0,0,0,4,4,3,3,0,0,0,0,0,0,0,0,
  0,0,0,0,0,3,3,3,3,0,0,0,0,0,0,0,
  0,0,0,0,0,0,3,3,3,3,0,0,0,0,0,0,
  0,0,0,0,0,0,0,3,3,3,3,0,0,0,0,0,
  0,0,0,0,0,0,0,3,3,3,0,0,0,0,0,0,
  0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
];

// Mario jumping
const MARIO_JUMP = [
  0,0,0,0,0,0,0,0,0,0,0,2,2,0,0,0,
  0,0,0,0,0,1,1,1,1,1,0,2,2,2,0,0,
  0,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0,
  0,0,0,0,3,3,3,2,2,5,2,0,0,0,0,0,
  0,0,0,3,2,3,2,2,2,5,2,2,2,0,0,0,
  0,0,0,3,2,3,3,2,2,2,5,2,2,2,0,0,
  0,0,0,3,3,2,2,2,2,5,5,5,5,0,0,0,
  0,0,0,0,0,2,2,2,2,2,2,2,0,0,0,0,
  0,0,1,1,1,1,4,1,1,1,4,0,0,0,0,0,
  0,0,0,1,1,1,4,4,4,4,1,1,0,0,0,0,
  0,0,0,0,4,4,6,4,4,6,4,4,0,0,0,0,
  0,0,0,0,4,4,4,4,4,4,4,0,0,0,0,0,
  0,0,0,0,4,4,4,0,4,4,4,0,0,0,0,0,
  0,0,0,3,3,3,0,0,0,0,0,0,0,0,0,0,
  0,0,3,3,3,0,0,0,0,0,0,0,0,0,0,0,
  0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
];

// Mario death
const MARIO_DEAD = [
  0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0,
  0,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0,
  0,0,0,0,3,3,3,2,2,5,2,0,0,0,0,0,
  0,0,0,3,2,3,2,2,2,5,2,2,2,0,0,0,
  0,0,0,3,2,3,3,2,2,2,5,2,2,2,0,0,
  0,0,0,3,3,2,2,2,2,5,5,5,5,0,0,0,
  0,0,0,0,0,2,2,2,2,2,2,2,0,0,0,0,
  0,2,0,0,1,1,4,1,1,1,0,0,0,2,0,0,
  0,0,2,1,1,1,4,1,1,4,1,1,2,0,0,0,
  0,0,0,1,1,1,4,4,4,4,1,1,0,0,0,0,
  0,0,0,2,1,4,6,4,4,6,4,2,0,0,0,0,
  0,0,0,2,2,4,4,4,4,4,4,2,0,0,0,0,
  0,0,0,0,4,4,4,4,4,4,4,4,0,0,0,0,
  0,0,0,0,4,4,4,0,0,4,4,4,0,0,0,0,
  0,0,0,0,3,3,0,0,0,0,3,3,0,0,0,0,
  0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
];

// Big Mario standing (16x32)
const BIG_MARIO_STAND = [
  0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0,
  0,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0,
  0,0,0,0,3,3,3,2,2,5,2,0,0,0,0,0,
  0,0,0,3,2,3,2,2,2,5,2,2,2,0,0,0,
  0,0,0,3,2,3,3,2,2,2,5,2,2,2,0,0,
  0,0,0,3,3,2,2,2,2,5,5,5,5,0,0,0,
  0,0,0,0,0,2,2,2,2,2,2,2,0,0,0,0,
  0,0,0,1,1,1,4,1,1,4,0,0,0,0,0,0,
  0,0,1,1,1,1,4,1,1,4,1,1,0,0,0,0,
  0,1,1,1,1,1,4,4,4,4,1,1,1,0,0,0,
  0,2,2,1,1,4,6,4,4,6,4,1,2,0,0,0,
  0,2,2,2,1,4,4,4,4,4,4,1,2,2,0,0,
  0,2,2,4,4,4,4,4,4,4,4,4,2,2,0,0,
  0,0,0,4,4,4,4,4,4,4,4,4,4,0,0,0,
  0,0,0,4,4,4,0,0,0,0,4,4,4,0,0,0,
  0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
  0,0,0,0,1,1,4,1,1,1,0,0,0,0,0,0,
  0,0,0,1,1,1,4,1,1,4,1,1,0,0,0,0,
  0,0,1,1,1,1,4,4,4,4,1,1,1,0,0,0,
  0,0,1,1,1,4,6,4,4,6,4,1,1,0,0,0,
  0,0,2,1,1,4,4,4,4,4,4,1,1,2,0,0,
  0,0,2,2,4,4,4,4,4,4,4,4,2,2,0,0,
  0,0,0,0,4,4,4,0,0,4,4,4,0,0,0,0,
  0,0,0,0,1,1,4,0,0,4,1,1,0,0,0,0,
  0,0,0,1,1,1,1,0,0,1,1,1,1,0,0,0,
  0,0,0,1,1,1,0,0,0,0,1,1,1,0,0,0,
  0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
  0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
  0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
  0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
  0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
  0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
];

// Big Mario walking
const BIG_MARIO_WALK1 = [
  0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0,
  0,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0,
  0,0,0,0,3,3,3,2,2,5,2,0,0,0,0,0,
  0,0,0,3,2,3,2,2,2,5,2,2,2,0,0,0,
  0,0,0,3,2,3,3,2,2,2,5,2,2,2,0,0,
  0,0,0,3,3,2,2,2,2,5,5,5,5,0,0,0,
  0,0,0,0,0,2,2,2,2,2,2,2,0,0,0,0,
  0,0,0,1,1,1,4,1,1,4,0,0,0,0,0,0,
  0,0,1,1,1,1,4,1,1,4,1,1,0,0,0,0,
  0,1,1,1,1,1,4,4,4,4,1,1,1,0,0,0,
  0,2,2,1,1,4,6,4,4,6,4,1,2,0,0,0,
  0,2,2,2,1,4,4,4,4,4,4,1,2,2,0,0,
  0,2,2,4,4,4,4,4,4,4,4,4,2,2,0,0,
  0,0,0,4,4,4,4,4,4,4,4,4,4,0,0,0,
  0,0,0,4,4,4,0,0,0,0,4,4,4,0,0,0,
  0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
  0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,
  0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,0,
  0,0,0,1,1,1,4,4,1,1,1,0,0,0,0,0,
  0,0,0,1,1,4,4,4,4,1,1,0,0,0,0,0,
  0,0,0,0,4,4,4,4,4,0,0,0,0,0,0,0,
  0,0,0,0,4,4,3,3,0,0,0,0,0,0,0,0,
  0,0,0,0,3,3,3,3,0,0,0,0,0,0,0,0,
  0,0,0,3,3,3,3,0,0,0,0,0,0,0,0,0,
  0,0,0,3,3,3,0,0,0,0,0,0,0,0,0,0,
  0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
  0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
  0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
  0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
  0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
  0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
  0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
];

// Big Mario jump
const BIG_MARIO_JUMP = [
  0,0,0,0,0,0,0,0,0,0,2,2,0,0,0,0,
  0,0,0,0,0,1,1,1,1,1,0,2,2,0,0,0,
  0,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0,
  0,0,0,0,3,3,3,2,2,5,2,0,0,0,0,0,
  0,0,0,3,2,3,2,2,2,5,2,2,2,0,0,0,
  0,0,0,3,2,3,3,2,2,2,5,2,2,2,0,0,
  0,0,0,3,3,2,2,2,2,5,5,5,5,0,0,0,
  0,0,0,0,0,2,2,2,2,2,2,2,0,0,0,0,
  0,0,0,1,1,1,4,1,1,4,0,0,0,0,0,0,
  0,0,1,1,1,1,4,1,1,4,1,1,0,0,0,0,
  0,1,1,1,1,1,4,4,4,4,1,1,1,0,0,0,
  0,2,2,1,1,4,6,4,4,6,4,1,2,0,0,0,
  0,2,2,2,1,4,4,4,4,4,4,1,2,2,0,0,
  0,2,2,4,4,4,4,4,4,4,4,4,2,2,0,0,
  0,0,0,4,4,4,4,4,4,4,4,4,4,0,0,0,
  0,0,0,4,4,4,0,0,0,0,4,4,4,0,0,0,
  0,0,1,1,1,4,4,1,1,4,0,0,0,0,0,0,
  0,1,1,1,1,4,4,4,4,1,1,0,0,0,0,0,
  0,1,1,1,4,6,4,4,6,4,1,1,0,0,0,0,
  0,0,0,4,4,4,4,4,4,4,4,0,0,0,0,0,
  0,0,0,4,4,4,0,4,4,4,0,0,0,0,0,0,
  0,0,0,3,3,0,0,0,0,0,0,0,0,0,0,0,
  0,0,3,3,3,0,0,0,0,0,0,0,0,0,0,0,
  0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
  0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
  0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
  0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
  0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
  0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
  0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
  0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
  0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
];

// Fire Mario palette override
const PAL_FIRE_MARIO = {
  0: null,
  1: [255, 255, 255],   // white (was red)
  2: [234, 158, 34],
  3: [107, 53, 0],
  4: [181, 49, 32],      // red overalls
  5: [0, 0, 0],
  6: [234, 158, 34],
};

// Goomba sprite (16x16)
const GOOMBA_WALK1 = [
  0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,
  0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,
  0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0,
  0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,
  0,0,1,1,4,4,1,1,1,1,4,4,1,1,0,0,
  0,1,1,1,4,5,1,1,1,1,4,5,1,1,1,0,
  0,1,1,1,1,1,1,4,4,1,1,1,1,1,1,0,
  1,1,2,1,1,1,4,4,4,4,1,1,1,2,1,1,
  1,2,2,2,1,1,1,4,4,1,1,1,2,2,2,1,
  1,2,2,2,2,1,1,1,1,1,1,2,2,2,2,1,
  1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,
  0,0,0,2,2,2,2,2,2,2,2,2,2,0,0,0,
  0,0,3,3,3,3,3,3,3,3,3,3,3,3,0,0,
  0,3,3,3,3,0,0,0,0,0,0,3,3,3,3,0,
  0,3,3,3,0,0,0,0,0,0,0,0,3,3,3,0,
  0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
];

const GOOMBA_WALK2 = [
  0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,
  0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,
  0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0,
  0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,
  0,0,1,1,4,4,1,1,1,1,4,4,1,1,0,0,
  0,1,1,1,4,5,1,1,1,1,4,5,1,1,1,0,
  0,1,1,1,1,1,1,4,4,1,1,1,1,1,1,0,
  1,1,2,1,1,1,4,4,4,4,1,1,1,2,1,1,
  1,2,2,2,1,1,1,4,4,1,1,1,2,2,2,1,
  1,2,2,2,2,1,1,1,1,1,1,2,2,2,2,1,
  1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,
  0,0,0,2,2,2,2,2,2,2,2,2,2,0,0,0,
  0,0,3,3,3,3,3,3,3,3,3,3,3,3,0,0,
  0,0,0,0,3,3,3,0,0,3,3,3,0,0,0,0,
  0,0,0,0,0,3,3,0,0,3,3,0,0,0,0,0,
  0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
];

// Goomba squished
const GOOMBA_FLAT = [
  0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
  0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
  0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
  0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
  0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
  0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
  0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
  0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
  0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
  0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
  0,1,1,4,4,1,1,1,1,1,1,4,4,1,1,0,
  1,1,2,4,5,2,1,4,4,1,2,4,5,2,1,1,
  1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,
  0,0,3,3,3,3,3,3,3,3,3,3,3,3,0,0,
  0,3,3,3,3,0,0,0,0,0,0,3,3,3,3,0,
  0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
];

// Koopa walking (16x24 - drawn in 16x16 space shifted up)
const KOOPA_WALK1 = [
  0,0,0,0,0,0,0,0,4,4,0,0,0,0,0,0,
  0,0,0,0,0,0,0,4,4,4,4,0,0,0,0,0,
  0,0,0,0,0,0,4,2,2,4,4,0,0,0,0,0,
  0,0,0,0,0,0,4,2,4,2,4,0,0,0,0,0,
  0,0,0,0,0,4,4,2,2,2,0,0,0,0,0,0,
  0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,
  0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,
  0,0,0,0,1,1,1,1,1,1,1,0,0,0,0,0,
  0,0,0,3,4,1,1,1,1,1,1,0,0,0,0,0,
  0,0,0,3,4,4,1,1,1,1,0,0,0,0,0,0,
  0,0,0,0,3,4,4,1,1,1,0,0,0,0,0,0,
  0,0,0,0,0,3,1,1,1,0,0,0,0,0,0,0,
  0,0,0,0,0,3,3,3,3,0,0,0,0,0,0,0,
  0,0,0,0,3,3,0,0,3,3,0,0,0,0,0,0,
  0,0,0,3,3,0,0,0,0,3,3,0,0,0,0,0,
  0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
];

const KOOPA_WALK2 = [
  0,0,0,0,0,0,0,0,4,4,0,0,0,0,0,0,
  0,0,0,0,0,0,0,4,4,4,4,0,0,0,0,0,
  0,0,0,0,0,0,4,2,2,4,4,0,0,0,0,0,
  0,0,0,0,0,0,4,2,4,2,4,0,0,0,0,0,
  0,0,0,0,0,4,4,2,2,2,0,0,0,0,0,0,
  0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,
  0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,
  0,0,0,0,1,1,1,1,1,1,1,0,0,0,0,0,
  0,0,0,3,4,1,1,1,1,1,1,0,0,0,0,0,
  0,0,0,3,4,4,1,1,1,1,0,0,0,0,0,0,
  0,0,0,0,3,4,4,1,1,1,0,0,0,0,0,0,
  0,0,0,0,0,3,1,1,1,0,0,0,0,0,0,0,
  0,0,0,0,0,0,3,3,3,0,0,0,0,0,0,0,
  0,0,0,0,0,3,3,0,3,3,0,0,0,0,0,0,
  0,0,0,0,3,3,0,0,0,3,3,0,0,0,0,0,
  0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
];

// Koopa shell
const KOOPA_SHELL = [
  0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
  0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
  0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
  0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
  0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
  0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
  0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
  0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,
  0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0,
  0,0,0,1,1,4,1,1,1,1,4,1,1,0,0,0,
  0,0,1,1,4,4,1,1,1,1,4,4,1,1,0,0,
  0,0,1,1,4,4,1,1,1,1,4,4,1,1,0,0,
  0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,
  0,0,0,0,3,3,3,3,3,3,3,3,0,0,0,0,
  0,0,0,0,0,3,3,3,3,3,3,0,0,0,0,0,
  0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
];

// Mushroom sprite (16x16)
const MUSHROOM_SPR = [
  0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,
  0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,
  0,0,1,1,1,2,2,1,1,2,2,1,1,1,0,0,
  0,1,1,1,2,2,2,2,1,2,2,2,1,1,1,0,
  0,1,1,1,2,2,2,2,1,2,2,2,1,1,1,0,
  1,1,1,1,2,2,2,2,1,2,2,2,2,1,1,1,
  1,1,1,1,1,2,2,1,1,1,2,2,1,1,1,1,
  1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
  0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,
  0,0,0,0,3,3,2,2,2,2,3,3,0,0,0,0,
  0,0,0,3,3,3,2,2,2,2,3,3,3,0,0,0,
  0,0,3,3,3,3,2,2,2,2,3,3,3,3,0,0,
  0,0,3,3,3,3,2,2,2,2,3,3,3,3,0,0,
  0,0,0,3,3,2,2,2,2,2,2,3,3,0,0,0,
  0,0,0,0,2,2,2,2,2,2,2,2,0,0,0,0,
  0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
];

// Star sprite (16x16)
const STAR_SPR = [
  0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,
  0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,
  0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,
  0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,
  1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
  0,1,1,1,1,1,3,3,3,3,1,1,1,1,1,0,
  0,0,1,1,1,1,3,3,3,3,1,1,1,1,0,0,
  0,0,0,1,1,1,1,3,3,1,1,1,1,0,0,0,
  0,0,0,1,1,2,1,1,1,1,2,1,1,0,0,0,
  0,0,0,1,2,2,1,1,1,1,2,2,1,0,0,0,
  0,0,1,1,2,2,2,1,1,2,2,2,1,1,0,0,
  0,0,1,1,2,2,2,1,1,2,2,2,1,1,0,0,
  0,1,1,2,2,2,0,0,0,0,2,2,2,1,1,0,
  0,1,1,2,2,0,0,0,0,0,0,2,2,1,1,0,
  0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
  0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
];

// Fire flower (16x16)
const FIRE_FLOWER_SPR = [
  0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,
  0,0,0,0,1,1,2,2,2,2,1,1,0,0,0,0,
  0,0,0,1,2,1,1,2,2,1,1,2,1,0,0,0,
  0,0,1,2,1,0,1,4,4,1,0,1,2,1,0,0,
  0,0,1,2,1,0,1,4,4,1,0,1,2,1,0,0,
  0,0,0,1,2,1,1,4,4,1,1,2,1,0,0,0,
  0,0,0,0,1,1,4,4,4,4,1,1,0,0,0,0,
  0,0,0,0,0,0,3,3,3,3,0,0,0,0,0,0,
  0,0,0,0,0,0,0,3,3,0,0,0,0,0,0,0,
  0,0,0,0,0,3,3,3,3,3,3,0,0,0,0,0,
  0,0,0,0,3,3,3,3,3,3,3,3,0,0,0,0,
  0,0,0,0,3,3,3,3,3,3,3,3,0,0,0,0,
  0,0,0,0,0,3,3,3,3,3,3,0,0,0,0,0,
  0,0,0,0,0,0,3,3,3,3,0,0,0,0,0,0,
  0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
  0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
];

// Coin sprite (8x16)
const COIN_SPR = [
  0,0,0,1,1,0,0,0,
  0,0,1,2,2,1,0,0,
  0,1,2,3,3,2,1,0,
  0,1,3,1,1,3,1,0,
  1,2,3,1,0,3,2,1,
  1,2,3,1,0,3,2,1,
  1,2,3,1,1,3,2,1,
  1,2,3,1,1,3,2,1,
  1,2,3,1,1,3,2,1,
  1,2,3,1,0,3,2,1,
  1,2,3,1,0,3,2,1,
  0,1,3,1,1,3,1,0,
  0,1,2,3,3,2,1,0,
  0,0,1,2,2,1,0,0,
  0,0,0,1,1,0,0,0,
  0,0,0,0,0,0,0,0,
];

// Fireball (8x8)
const FIREBALL_SPR = [
  0,0,1,1,1,0,0,0,
  0,1,2,2,2,1,0,0,
  1,2,3,3,2,2,1,0,
  1,2,3,3,2,2,1,0,
  1,2,2,2,2,2,1,0,
  0,1,2,2,2,1,0,0,
  0,0,1,1,1,0,0,0,
  0,0,0,0,0,0,0,0,
];

// ============================================================
// TILE RENDERING
// ============================================================

function drawBrick(x, y) {
  ctx.fillStyle = '#c84c0c';
  ctx.fillRect(x, y, TILE, TILE);
  ctx.fillStyle = '#e09050';
  ctx.fillRect(x + 1, y + 1, 6, 6);
  ctx.fillRect(x + 9, y + 1, 6, 6);
  ctx.fillRect(x + 1, y + 9, 3, 6);
  ctx.fillRect(x + 5, y + 9, 6, 6);
  ctx.fillRect(x + 13, y + 9, 2, 6);
  ctx.fillStyle = '#6b2800';
  ctx.fillRect(x, y, TILE, 1);
  ctx.fillRect(x, y + 8, TILE, 1);
  ctx.fillRect(x, y, 1, TILE);
  ctx.fillRect(x + 8, y, 1, 8);
  ctx.fillRect(x + 4, y + 8, 1, 8);
  ctx.fillRect(x + 12, y + 8, 1, 8);
}

function drawQuestionBlock(x, y, hit) {
  if (hit) {
    ctx.fillStyle = '#8b6914';
    ctx.fillRect(x, y, TILE, TILE);
    ctx.fillStyle = '#6b4c00';
    ctx.fillRect(x + 1, y + 1, TILE - 2, TILE - 2);
    return;
  }
  ctx.fillStyle = '#e09050';
  ctx.fillRect(x, y, TILE, TILE);
  ctx.fillStyle = '#6b2800';
  ctx.fillRect(x, y, TILE, 1);
  ctx.fillRect(x, y + 15, TILE, 1);
  ctx.fillRect(x, y, 1, TILE);
  ctx.fillRect(x + 15, y, 1, TILE);
  // Question mark
  ctx.fillStyle = '#6b2800';
  ctx.fillRect(x + 5, y + 3, 6, 2);
  ctx.fillRect(x + 9, y + 5, 2, 2);
  ctx.fillRect(x + 7, y + 7, 2, 2);
  ctx.fillRect(x + 7, y + 9, 2, 2);
  ctx.fillRect(x + 7, y + 12, 2, 2);
}

function drawGround(x, y) {
  ctx.fillStyle = '#c84c0c';
  ctx.fillRect(x, y, TILE, TILE);
  ctx.fillStyle = '#e09050';
  ctx.fillRect(x + 1, y + 1, 14, 3);
  ctx.fillRect(x + 1, y + 5, 14, 3);
  ctx.fillRect(x + 1, y + 9, 14, 3);
  ctx.fillRect(x + 1, y + 13, 14, 2);
  ctx.fillStyle = '#6b2800';
  ctx.fillRect(x, y, TILE, 1);
}

function drawPipeTop(x, y) {
  ctx.fillStyle = '#00a800';
  ctx.fillRect(x, y, 32, 16);
  ctx.fillStyle = '#006800';
  ctx.fillRect(x, y, 32, 2);
  ctx.fillRect(x, y, 2, 16);
  ctx.fillRect(x + 30, y, 2, 16);
  ctx.fillStyle = '#00d800';
  ctx.fillRect(x + 3, y + 2, 4, 14);
}

function drawPipeBody(x, y) {
  ctx.fillStyle = '#00a800';
  ctx.fillRect(x + 2, y, 28, 16);
  ctx.fillStyle = '#006800';
  ctx.fillRect(x + 2, y, 2, 16);
  ctx.fillRect(x + 28, y, 2, 16);
  ctx.fillStyle = '#00d800';
  ctx.fillRect(x + 5, y, 4, 16);
}

function drawCloud(x, y) {
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(x + 16, y + 10, 10, 0, Math.PI * 2);
  ctx.arc(x + 30, y + 8, 12, 0, Math.PI * 2);
  ctx.arc(x + 46, y + 10, 10, 0, Math.PI * 2);
  ctx.fill();
}

function drawBush(x, y) {
  ctx.fillStyle = '#00a800';
  ctx.beginPath();
  ctx.arc(x + 10, y + 12, 10, Math.PI, 0);
  ctx.arc(x + 24, y + 10, 12, Math.PI, 0);
  ctx.arc(x + 38, y + 12, 10, Math.PI, 0);
  ctx.fill();
  ctx.fillRect(x, y + 10, 48, 6);
}

function drawHill(x, y) {
  ctx.fillStyle = '#00a800';
  ctx.beginPath();
  ctx.moveTo(x, y + 48);
  ctx.lineTo(x + 40, y);
  ctx.lineTo(x + 80, y + 48);
  ctx.fill();
  ctx.fillStyle = '#00c800';
  ctx.beginPath();
  ctx.moveTo(x + 10, y + 48);
  ctx.lineTo(x + 40, y + 8);
  ctx.lineTo(x + 70, y + 48);
  ctx.fill();
}

function drawFlagPole(x, y) {
  // Pole
  ctx.fillStyle = '#aaaaaa';
  ctx.fillRect(x + 7, y, 2, 160);
  // Ball on top
  ctx.fillStyle = '#00a800';
  ctx.fillRect(x + 4, y - 4, 8, 8);
}

function drawFlag(x, y) {
  ctx.fillStyle = '#00a800';
  ctx.fillRect(x - 16, y, 16, 10);
  ctx.fillStyle = '#008800';
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x - 16, y + 5);
  ctx.lineTo(x, y + 10);
  ctx.fill();
}

function drawCastle(x, y) {
  ctx.fillStyle = '#c84c0c';
  // Main body
  ctx.fillRect(x, y + 16, 80, 64);
  // Turrets
  ctx.fillRect(x - 4, y, 16, 80);
  ctx.fillRect(x + 68, y, 16, 80);
  ctx.fillRect(x + 28, y - 16, 24, 96);
  // Windows
  ctx.fillStyle = '#000';
  ctx.fillRect(x + 34, y + 32, 12, 20);
  ctx.fillRect(x + 34, y + 48, 12, 32);
  // Door
  ctx.fillStyle = '#000';
  ctx.fillRect(x + 30, y + 50, 20, 30);
  // Battlements
  ctx.fillStyle = '#c84c0c';
  for (let i = 0; i < 5; i++) {
    ctx.fillRect(x + i * 16 - 4, y - 8, 8, 8);
  }
  ctx.fillRect(x + 28, y - 24, 8, 8);
  ctx.fillRect(x + 44, y - 24, 8, 8);
}

// ============================================================
// SOUND - Simple Web Audio beeps
// ============================================================
let audioCtx = null;
function getAudio() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  return audioCtx;
}

function playSound(freq, duration, type = 'square', vol = 0.1) {
  try {
    const a = getAudio();
    const o = a.createOscillator();
    const g = a.createGain();
    o.type = type;
    o.frequency.value = freq;
    g.gain.value = vol;
    g.gain.exponentialRampToValueAtTime(0.001, a.currentTime + duration);
    o.connect(g);
    g.connect(a.destination);
    o.start(a.currentTime);
    o.stop(a.currentTime + duration);
  } catch(e) {}
}

const SFX = {
  jump() { playSound(400, 0.1); setTimeout(() => playSound(600, 0.1), 50); },
  bigJump() { playSound(300, 0.15); setTimeout(() => playSound(500, 0.15), 60); },
  coin() { playSound(988, 0.05); setTimeout(() => playSound(1319, 0.15), 50); },
  stomp() { playSound(200, 0.15, 'triangle'); },
  powerup() {
    [523,659,784,1047].forEach((f,i) => setTimeout(() => playSound(f, 0.1), i*80));
  },
  pipe() { playSound(100, 0.3, 'triangle', 0.15); },
  bump() { playSound(150, 0.1, 'triangle'); },
  kick() { playSound(500, 0.08); playSound(300, 0.08); },
  die() {
    playSound(400, 0.15); setTimeout(() => playSound(300, 0.15), 150);
    setTimeout(() => playSound(200, 0.3), 300);
  },
  fireball() { playSound(800, 0.05); setTimeout(() => playSound(600, 0.05), 30); },
  laser() {
    [1200,1400,1600,1800,2000].forEach((f,i) => setTimeout(() => playSound(f, 0.08, 'sawtooth', 0.08), i*30));
    setTimeout(() => playSound(200, 0.3, 'triangle', 0.12), 150);
  },
  flagpole() {
    [523,587,659,698,784,880,988,1047].forEach((f,i) =>
      setTimeout(() => playSound(f, 0.15), i*100));
  },
  oneUp() {
    [523,659,784,659,784,1047].forEach((f,i) => setTimeout(() => playSound(f, 0.08), i*60));
  },
  gameover() {
    [392,330,262,220,262,196].forEach((f,i) => setTimeout(() => playSound(f, 0.2, 'triangle'), i*200));
  },
  clear() {
    [523,523,523,0,415,523,0,659,0,0,523,0,659,784].forEach((f,i) =>
      setTimeout(() => { if(f) playSound(f, 0.12); }, i*100));
  }
};

// ============================================================
// INPUT HANDLING
// ============================================================
const keys = {};
window.addEventListener('keydown', e => { keys[e.code] = true; e.preventDefault(); });
window.addEventListener('keyup', e => { keys[e.code] = false; e.preventDefault(); });

// ============================================================
// GAME STATE
// ============================================================
let gameState = 'title'; // title, playing, dying, gameover, win, transition, levelclear, levelselect
let score = 0;
let coins = 0;
let lives = 3;
let timer = 400;
let timerCount = 0;
let transitionTimer = 0;
let world = '1-1';
let currentLevel = 1; // 1..3
let levelClearTimer = 0;
let maxUnlockedLevel = 1; // highest unlocked level
let highScore = 0;

// ---- LocalStorage persistence ----
const SAVE_KEY = 'mario_game_save';
function saveProgress() {
  try {
    const data = { maxUnlockedLevel, highScore };
    localStorage.setItem(SAVE_KEY, JSON.stringify(data));
  } catch (e) {}
}
function loadProgress() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (raw) {
      const data = JSON.parse(raw);
      if (data.maxUnlockedLevel) maxUnlockedLevel = data.maxUnlockedLevel;
      if (data.highScore) highScore = data.highScore;
    }
  } catch (e) {}
}
loadProgress();
let levelSelectCursor = 0; // 0-indexed cursor on level select screen
let levelSelectKeyPrev = {}; // debounce keys on level select

// Camera
let cameraX = 0;

// Particles
let particles = [];
let floatingTexts = [];

// ============================================================
// LEVEL DATA
// ============================================================
// Level is array of tile definitions
// Tiles: 0=empty, 1=ground, 2=brick, 3=question(coin), 4=question(mushroom/flower),
//        5=pipe_tl, 6=pipe_tr, 7=pipe_bl, 8=pipe_br, 9=hard block,
//        10=question(star), 11=invisible(1up), 12=question(1up)

const LEVEL_WIDTH = 220;
const LEVEL_HEIGHT = 15;

function createLevel() {
  const level = [];
  for (let y = 0; y < LEVEL_HEIGHT; y++) {
    level[y] = new Array(LEVEL_WIDTH).fill(0);
  }

  // Ground
  for (let x = 0; x < LEVEL_WIDTH; x++) {
    level[13][x] = 1;
    level[14][x] = 1;
  }

  // Segment A: tutorial (jump + reward)
  level[9][16] = 3;
  level[9][22] = 2;
  level[9][23] = 3;
  level[9][24] = 2;
  level[7][23] = 4;

  // Gentle intro staircase
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j <= i; j++) {
      level[12 - j][30 + i] = 9;
    }
  }
  placePipe(level, 36, 11, 2);

  // Segment B: rhythm (pipe timing + block route)
  placePipe(level, 48, 11, 2);
  placePipe(level, 60, 10, 3);

  for (let x = 67; x <= 71; x++) level[9][x] = 2;
  level[9][69] = 3;
  level[7][70] = 4;

  for (let x = 78; x <= 84; x++) level[9][x] = 2;
  level[9][80] = 3;
  level[9][82] = 10;

  // Segment C: exam (stairs + combo challenge)
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j <= i; j++) {
      level[12 - j][102 + i] = 9;
    }
  }
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j <= i; j++) {
      level[12 - (3 - j)][112 - i] = 9;
    }
  }

  for (let x = 118; x <= 123; x++) level[9][x] = 2;
  level[9][120] = 3;
  level[9][122] = 4;
  placePipe(level, 128, 10, 3);

  for (let x = 136; x <= 144; x++) level[9][x] = (x % 2 === 0 ? 2 : 3);
  level[7][140] = 2;
  level[7][141] = 3;
  for (let x = 147; x <= 150; x++) level[10][x] = 9;

  // Final pressure before flag
  for (let i = 0; i < 5; i++) {
    for (let j = 0; j <= i; j++) {
      level[12 - j][156 + i] = 9;
    }
  }

  // Flag position at x=164
  level[12][164] = 9; // flag base

  return level;
}

function placePipe(level, x, y, height) {
  level[y][x] = 5;
  level[y][x + 1] = 6;
  for (let i = 1; i < height; i++) {
    level[y + i][x] = 7;
    level[y + i][x + 1] = 8;
  }
}

// ============================================================
// ENTITY CLASSES
// ============================================================

class Mario {
  constructor() {
    this.x = 40;
    this.y = 192;
    this.vx = 0;
    this.vy = 0;
    this.w = 12;
    this.h = 16;
    this.dir = 1;
    this.grounded = false;
    this.big = false;
    this.fire = false;
    this.star = false;
    this.starTimer = 0;
    this.animFrame = 0;
    this.animTimer = 0;
    this.invincible = 0;
    this.dead = false;
    this.deathTimer = 0;
    this.deathVy = 0;
    this.growing = 0;
    this.shrinking = 0;
    this.flagSliding = false;
    this.flagDone = false;
      this.walkInTimer = 0;
      this.prevVy = 0;
      this.doubleFireball = false; // unlocked by 2nd fire flower
    }

    get hitbox() {
    return {
      x: this.x + 2,
      y: this.y,
      w: this.w,
      h: this.big ? 46 : 14,
    };
  }

  update(level) {
    if (this.dead) {
      this.deathTimer++;
      if (this.deathTimer > 20) {
        this.deathVy += GRAVITY;
        this.y += this.deathVy;
      }
        if (this.deathTimer > 180) {
          lives--;
          if (lives <= 0) {
            gameState = 'gameover';
            SFX.gameover();
          } else {
            gameState = 'levelselect';
            levelSelectCursor = currentLevel - 1;
          }
        }
      return;
    }

    if (this.flagSliding) {
      this.vy = 2;
      this.y += this.vy;
      const groundY = 13 * TILE - (this.big ? 48 : 16);
      if (this.y >= groundY) {
        this.y = groundY;
        this.flagSliding = false;
        this.flagDone = true;
        this.walkInTimer = 60;
        this.dir = 1;
        SFX.clear();
      }
      return;
    }

    if (this.flagDone) {
      this.walkInTimer--;
      this.vx = 1.5;
      this.x += this.vx;
      this.animTimer++;
      if (this.animTimer > 6) { this.animFrame = (this.animFrame + 1) % 3; this.animTimer = 0; }
      if (this.walkInTimer <= 0) {
              let timeBonus = timer * 50;
              score += timeBonus;
              if (currentLevel < TOTAL_LEVELS) {
                if (maxUnlockedLevel < currentLevel + 1) { maxUnlockedLevel = currentLevel + 1; }
                if (score > highScore) highScore = score;
                saveProgress();
                gameState = 'levelclear';
                levelClearTimer = 180;
              } else {
                if (score > highScore) highScore = score;
                saveProgress();
                gameState = 'win';
              }
            }
      return;
    }

    if (this.growing > 0) {
      this.growing--;
      return;
    }
    if (this.shrinking > 0) {
      this.shrinking--;
      return;
    }

    // Star timer
    if (this.star) {
      this.starTimer--;
      if (this.starTimer <= 0) this.star = false;
    }

    if (this.invincible > 0) this.invincible--;

    // Movement
        const running = keys['ShiftLeft'] || keys['ShiftRight'] || keys['KeyJ'];
        const accel = this.grounded ? (running ? 0.5 : 0.35) : 0.2;
        const maxSpeed = running ? 5 : 2.2;
        const friction = this.grounded ? 0.88 : 0.98;

      if (keys['ArrowRight'] || keys['KeyD']) {
      this.vx += accel;
      this.dir = 1;
    } else if (keys['ArrowLeft'] || keys['KeyA']) {
      this.vx -= accel;
      this.dir = -1;
    } else {
      this.vx *= friction;
    }

    if (Math.abs(this.vx) > maxSpeed) this.vx = maxSpeed * Math.sign(this.vx);
    if (Math.abs(this.vx) < 0.1) this.vx = 0;

      // Jump
      if ((keys['ArrowUp'] || keys['Space'] || keys['KeyW'] || keys['KeyK']) && this.grounded) {
          this.vy = this.big ? -9.5 : -8;
        this.grounded = false;
        SFX[this.big ? 'bigJump' : 'jump']();
      }

      // Variable jump height
      if (!(keys['ArrowUp'] || keys['Space'] || keys['KeyW'] || keys['KeyK']) && this.vy < -2) {
      this.vy = -2;
    }

      // Save vertical velocity before physics for stomp detection
      this.prevVy = this.vy;

      // Gravity
      this.vy += GRAVITY;
      if (this.vy > MAX_FALL) this.vy = MAX_FALL;

    // Horizontal collision
    this.x += this.vx;
    this.resolveCollisionX(level);

    // Vertical collision
    this.y += this.vy;
    this.resolveCollisionY(level);

      // Don't go left of level start
      if (this.x < 0) this.x = 0;

    // Fall death
    if (this.y > VIEW_H + 32) {
      this.die();
    }

    // Animation
    if (!this.grounded) {
      this.animFrame = 3; // jump frame
    } else if (Math.abs(this.vx) > 0.5) {
      this.animTimer++;
      if (this.animTimer > (6 - Math.abs(this.vx))) {
        this.animFrame = (this.animFrame + 1) % 3;
        this.animTimer = 0;
      }
    } else {
      this.animFrame = 0;
    }
  }

  resolveCollisionX(level) {
    const h = this.big ? 46 : 14;
    const top = Math.floor(this.y / TILE);
    const bot = Math.floor((this.y + h) / TILE);
    const startY = Math.max(0, top);
    const endY = Math.min(LEVEL_HEIGHT - 1, bot);
    const lw = getLevelWidth();

    if (this.vx > 0) {
      const right = Math.floor((this.x + this.w) / TILE);
      for (let ty = startY; ty <= endY; ty++) {
        if (right >= 0 && right < lw && isSolid(level[ty][right])) {
            this.x = right * TILE - this.w - 0.01;
            this.vx = 0;
            break;
          }
        }
      } else if (this.vx < 0) {
        const left = Math.floor(this.x / TILE);
        for (let ty = startY; ty <= endY; ty++) {
          if (left >= 0 && left < lw && isSolid(level[ty][left])) {
            this.x = (left + 1) * TILE + 0.01;
            this.vx = 0;
            break;
          }
        }
      }
    }

    resolveCollisionY(level) {
      const h = this.big ? 46 : 14;
      const lw = getLevelWidth();

      if (this.vy > 0) {
        // Falling
        const bot = Math.floor((this.y + h) / TILE);
        const left = Math.floor((this.x + 1) / TILE);
        const right = Math.floor((this.x + this.w - 1) / TILE);
        this.grounded = false;
        for (let tx = left; tx <= right; tx++) {
          if (tx >= 0 && tx < lw && bot >= 0 && bot < LEVEL_HEIGHT && isSolid(level[bot][tx])) {
            this.y = bot * TILE - h - 0.01;
            this.vy = 0;
            this.grounded = true;
            break;
          }
        }
      } else if (this.vy < 0) {
        // Rising - hit block above
        const top = Math.floor(this.y / TILE);
        const left = Math.floor((this.x + 2) / TILE);
        const right = Math.floor((this.x + this.w - 2) / TILE);
        for (let tx = left; tx <= right; tx++) {
          if (tx >= 0 && tx < lw && top >= 0 && top < LEVEL_HEIGHT && isSolid(level[top][tx])) {
          this.y = (top + 1) * TILE + 0.01;
          this.vy = 0;
          hitBlock(tx, top, this.big);
          break;
        }
      }
    }
  }

  die() {
    if (this.dead) return;
    if (this.star) return;

    if (this.big) {
      this.big = false;
      this.fire = false;
      this.invincible = 120;
      this.shrinking = 30;
      SFX.pipe();
      return;
    }

    this.dead = true;
    this.deathTimer = 0;
    this.deathVy = -8;
    this.vy = 0;
    this.vx = 0;
    SFX.die();
  }

  draw() {
    if (this.dead) {
      const spr = createSprite(MARIO_DEAD, this.fire ? PAL_FIRE_MARIO : PAL.mario, 16, 16);
      ctx.drawImage(spr, Math.round(this.x - cameraX - 2), Math.round(this.y), 16, 16);
      return;
    }

    if (this.invincible > 0 && Math.floor(this.invincible / 3) % 2) return;

    let pal = this.fire ? PAL_FIRE_MARIO : PAL.mario;
    if (this.star && Math.floor(Date.now() / 60) % 3 === 0) pal = PAL.luigi;
    if (this.star && Math.floor(Date.now() / 60) % 3 === 1) pal = PAL_FIRE_MARIO;

    ctx.save();
    const drawX = Math.round(this.x - cameraX - 2);
    const drawY = Math.round(this.y);

    if (this.big) {
      let sprData;
      if (this.animFrame === 3) sprData = BIG_MARIO_JUMP;
      else if (this.animFrame === 1) sprData = BIG_MARIO_WALK1;
      else sprData = BIG_MARIO_STAND;

      if (this.growing > 0 || this.shrinking > 0) {
        // Flicker between small and big during transition
        const flicker = Math.floor((this.growing || this.shrinking) / 4) % 2;
        if (flicker) {
          sprData = MARIO_STAND;
          const spr = createSprite(sprData, pal, 16, 16);
          if (this.dir === -1) {
            ctx.scale(-1, 1);
            ctx.drawImage(spr, -(drawX + 16), drawY + 32, 16, 16);
          } else {
            ctx.drawImage(spr, drawX, drawY + 32, 16, 16);
          }
          ctx.restore();
          return;
        }
      }

      const spr = createSprite(sprData, pal, 16, 32);
      if (this.dir === -1) {
        ctx.scale(-1, 1);
        ctx.drawImage(spr, -(drawX + 16), drawY - 1, 16, 48);
      } else {
        ctx.drawImage(spr, drawX, drawY - 1, 16, 48);
      }
    } else {
      let sprData;
      if (this.animFrame === 3) sprData = MARIO_JUMP;
      else if (this.animFrame === 1) sprData = MARIO_WALK1;
      else if (this.animFrame === 2) sprData = MARIO_WALK2;
      else sprData = MARIO_STAND;

      const spr = createSprite(sprData, pal, 16, 16);
      if (this.dir === -1) {
        ctx.scale(-1, 1);
        ctx.drawImage(spr, -(drawX + 16), drawY, 16, 16);
      } else {
        ctx.drawImage(spr, drawX, drawY, 16, 16);
      }
    }
    ctx.restore();
  }

  shootFireball() {
    if (!this.fire || !this.big) return;
    const maxFb = this.doubleFireball ? 4 : 2;
    if (fireballs.length >= maxFb) return;
    fireballs.push({
      x: this.x + (this.dir > 0 ? 12 : -4),
      y: this.y + (this.big ? 16 : 8),
      vx: this.dir * 5,
      vy: -2,
      alive: true,
    });
    if (this.doubleFireball) {
      // Second fireball slightly offset
      fireballs.push({
        x: this.x + (this.dir > 0 ? 12 : -4),
        y: this.y + (this.big ? 28 : 12),
        vx: this.dir * 5,
        vy: -1,
        alive: true,
      });
    }
    SFX.fireball();
  }
}

// Enemy base
class Enemy {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.vx = -0.8;
    this.vy = 0;
    this.w = 14;
    this.h = 14;
    this.alive = true;
    this.active = false;
    this.grounded = false;
    this.removeTimer = -1;
    this.animFrame = 0;
    this.animTimer = 0;
  }

  activate() {
    this.active = true;
  }

  canBeStomped() {
    return true;
  }

  canDamageMario() {
    return true;
  }

  canBeHitByProjectiles() {
    return true;
  }

    updatePhysics(level) {
      this.vy += GRAVITY;
      if (this.vy > MAX_FALL) this.vy = MAX_FALL;

      this.x += this.vx;
      // Horizontal collision
      const h = this.h;
      const top = Math.floor(this.y / TILE);
      const bot = Math.floor((this.y + h) / TILE);
      const lw = getLevelWidth();
      if (this.vx > 0) {
        const right = Math.floor((this.x + this.w) / TILE);
        for (let ty = top; ty <= bot; ty++) {
          if (right >= 0 && right < lw && ty >= 0 && ty < LEVEL_HEIGHT && isSolid(level[ty][right])) {
          this.x = right * TILE - this.w - 0.01;
          this.vx = -this.vx;
          break;
        }
      }
    } else {
      const left = Math.floor(this.x / TILE);
      for (let ty = top; ty <= bot; ty++) {
          if (left >= 0 && left < lw && ty >= 0 && ty < LEVEL_HEIGHT && isSolid(level[ty][left])) {
            this.x = (left + 1) * TILE + 0.01;
            this.vx = -this.vx;
            break;
          }
        }
      }

      this.y += this.vy;
      // Vertical collision
      this.grounded = false;
      if (this.vy >= 0) {
        const bot2 = Math.floor((this.y + h) / TILE);
        const left = Math.floor((this.x + 1) / TILE);
        const right = Math.floor((this.x + this.w - 1) / TILE);
        for (let tx = left; tx <= right; tx++) {
          if (tx >= 0 && tx < lw && bot2 >= 0 && bot2 < LEVEL_HEIGHT && isSolid(level[bot2][tx])) {
          this.y = bot2 * TILE - h - 0.01;
          this.vy = 0;
          this.grounded = true;
          break;
        }
      }
    }

    // Fall off screen
    if (this.y > VIEW_H + 32) this.alive = false;
  }
}

class Goomba extends Enemy {
  constructor(x, y) {
    super(x, y);
    this.flat = false;
    this.flatTimer = 0;
  }

  update(level) {
    if (!this.active) return;
    if (this.flat) {
      this.flatTimer++;
      if (this.flatTimer > 30) this.alive = false;
      return;
    }
    if (!this.alive) return;

    this.animTimer++;
    if (this.animTimer > 8) {
      this.animFrame = 1 - this.animFrame;
      this.animTimer = 0;
    }

    this.updatePhysics(level);
  }

  stomp() {
    this.flat = true;
    this.vx = 0;
    score += 100;
    addFloatingText(this.x, this.y, '100');
    SFX.stomp();
  }

  draw() {
    if (!this.active || !this.alive) return;
    const drawX = Math.round(this.x - cameraX);
    const drawY = Math.round(this.y);
    let sprData = this.flat ? GOOMBA_FLAT : (this.animFrame ? GOOMBA_WALK2 : GOOMBA_WALK1);
    const spr = createSprite(sprData, PAL.goomba, 16, 16);
    ctx.drawImage(spr, drawX - 1, drawY + (this.flat ? 2 : 0), 16, 16);
  }
}

class HopperGoomba extends Goomba {
  constructor(x, y) {
    super(x, y);
    this.vx = -1;
    this.hopTimer = 45;
  }

  update(level) {
    if (!this.active) return;
    if (this.flat) {
      this.flatTimer++;
      if (this.flatTimer > 30) this.alive = false;
      return;
    }
    if (!this.alive) return;

    this.animTimer++;
    if (this.animTimer > 8) {
      this.animFrame = 1 - this.animFrame;
      this.animTimer = 0;
    }

    if (this.grounded) {
      this.hopTimer--;
      if (this.hopTimer <= 0) {
        this.vy = -6.2;
        this.hopTimer = 45;
      }
    }

    this.updatePhysics(level);
  }
}

class Koopa extends Enemy {
  constructor(x, y) {
    super(x, y);
    this.shell = false;
    this.shellMoving = false;
    this.h = 22;
  }

  update(level) {
    if (!this.active || !this.alive) return;

    this.animTimer++;
    if (this.animTimer > 8) {
      this.animFrame = 1 - this.animFrame;
      this.animTimer = 0;
    }

    if (this.shell && !this.shellMoving) {
      // Stationary shell
      return;
    }

    this.updatePhysics(level);

    // Shell kills other enemies
    if (this.shell && this.shellMoving) {
      for (const e of enemies) {
        if (e === this || !e.alive || !e.active) continue;
        if (rectsOverlap(this, e)) {
          e.alive = false;
          score += 100;
          addFloatingText(e.x, e.y, '100');
          // Flip enemy away
          particles.push({ x: e.x, y: e.y, vx: 0, vy: -5, life: 30, type: 'enemy', enemy: e });
        }
      }
    }
  }

  stomp() {
    if (!this.shell) {
      this.shell = true;
      this.vx = 0;
      this.h = 14;
      this.y += 8;
      score += 100;
      addFloatingText(this.x, this.y, '100');
      SFX.stomp();
    } else if (!this.shellMoving) {
      this.shellMoving = true;
      this.vx = mario.x < this.x ? 5 : -5;
      score += 100;
      SFX.kick();
    } else {
      this.shellMoving = false;
      this.vx = 0;
      score += 100;
      SFX.stomp();
    }
  }

  draw() {
    if (!this.active || !this.alive) return;
    const drawX = Math.round(this.x - cameraX);
    const drawY = Math.round(this.y);

    ctx.save();
    if (this.shell) {
      const spr = createSprite(KOOPA_SHELL, PAL.koopa, 16, 16);
      ctx.drawImage(spr, drawX - 1, drawY, 16, 16);
    } else {
      const sprData = this.animFrame ? KOOPA_WALK2 : KOOPA_WALK1;
      const spr = createSprite(sprData, PAL.koopa, 16, 16);
      if (this.vx > 0) {
        ctx.scale(-1, 1);
        ctx.drawImage(spr, -(drawX + 15), drawY - 8, 16, 16);
      } else {
        ctx.drawImage(spr, drawX - 1, drawY - 8, 16, 16);
      }
    }
    ctx.restore();
  }
}

class PiranhaPlant extends Enemy {
  constructor(x, pipeTopY) {
    super(x, pipeTopY + 12);
    this.w = 12;
    this.h = 20;
    this.vx = 0;
    this.vy = 0;
    this.noSpawnSnap = true;
    this.pipeTopY = pipeTopY;
    this.hiddenY = pipeTopY + 12;
    this.exposedY = pipeTopY - 15;
    this.y = this.hiddenY;
    this.state = 'waitHidden';
    this.stateTimer = 36;
  }

  canBeStomped() {
    return false;
  }

  canDamageMario() {
    return this.y <= this.pipeTopY - 2;
  }

  canBeHitByProjectiles() {
    return this.y <= this.pipeTopY + 1;
  }

  update() {
    if (!this.active || !this.alive) return;

    const marioCenter = mario.x + mario.w / 2;
    const plantCenter = this.x + this.w / 2;
    const marioNearPipe = Math.abs(marioCenter - plantCenter) < 24;

    if (this.state === 'waitHidden') {
      this.stateTimer--;
      if (this.stateTimer <= 0 && !marioNearPipe) this.state = 'rising';
      return;
    }

    if (this.state === 'rising') {
      this.y -= 0.5;
      if (this.y <= this.exposedY) {
        this.y = this.exposedY;
        this.state = 'waitTop';
        this.stateTimer = 46;
      }
      return;
    }

    if (this.state === 'waitTop') {
      this.stateTimer--;
      if (this.stateTimer <= 0) this.state = 'sinking';
      return;
    }

    if (this.state === 'sinking') {
      this.y += 0.5;
      if (this.y >= this.hiddenY) {
        this.y = this.hiddenY;
        this.state = 'waitHidden';
        this.stateTimer = 32;
      }
    }
  }

  stomp() {
    // Piranha cannot be stomped.
  }

  draw() {
    if (!this.active || !this.alive) return;
    const drawX = Math.round(this.x - cameraX);
    const drawY = Math.round(this.y);
    const bite = ((Math.floor(Date.now() / 180) + Math.floor(this.x / 16)) % 2) ? 1 : 0;

    // Clip to the area above pipe lip so hidden state looks natural.
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, 0, VIEW_W, this.pipeTopY + 1);
    ctx.clip();

    // Stem
    const stemTop = drawY + 9;
    const stemHeight = Math.max(0, this.pipeTopY - stemTop + 1);
    if (stemHeight > 0) {
      ctx.fillStyle = '#0b8a0b';
      ctx.fillRect(drawX + 4, stemTop, 4, stemHeight);
      ctx.fillStyle = '#15b315';
      ctx.fillRect(drawX + 5, stemTop, 2, stemHeight);
    }

    // Head
    ctx.fillStyle = '#cf3b33';
    ctx.fillRect(drawX + 1, drawY + 1, 10, 9);
    ctx.fillStyle = '#f7f7f7';
    ctx.fillRect(drawX + 2, drawY + 3, 2, 2);
    ctx.fillRect(drawX + 8, drawY + 3, 2, 2);

    // Mouth + teeth
    ctx.fillStyle = '#1b0707';
    ctx.fillRect(drawX + 2, drawY + 7 + bite, 8, 2);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(drawX + 2, drawY + 7, 1, 1);
    ctx.fillRect(drawX + 4, drawY + 7, 1, 1);
    ctx.fillRect(drawX + 7, drawY + 7, 1, 1);
    ctx.fillRect(drawX + 9, drawY + 7, 1, 1);

    // Jaw
    ctx.fillStyle = '#b5302a';
    ctx.fillRect(drawX + 2, drawY + 9 + bite, 8, 2);

    ctx.restore();
  }
}

// Power-up items
class PowerUp {
  constructor(x, y, type) {
    this.x = x;
    this.y = y;
    this.startY = y;
    this.vx = 0;
    this.vy = 0;
    this.w = 14;
    this.h = 14;
    this.type = type; // 'mushroom', 'flower', 'star', '1up'
    this.alive = true;
    this.emerging = true;
    this.emergeY = 0;
  }

  update(level) {
    if (!this.alive) return;

    if (this.emerging) {
      this.emergeY += 0.5;
      this.y = this.startY - this.emergeY;
      if (this.emergeY >= TILE) {
        this.emerging = false;
        if (this.type !== 'flower') {
          this.vx = 1.5;
        }
        if (this.type === 'star') {
          this.vy = -4;
        }
      }
      return;
    }

    // Physics
    if (this.type === 'star') {
      this.vy += GRAVITY;
    } else if (this.type !== 'flower') {
      this.vy += GRAVITY;
    }

    if (this.vy > MAX_FALL) this.vy = MAX_FALL;

      this.x += this.vx;
      // Horizontal collision
      const top = Math.floor(this.y / TILE);
      const bot = Math.floor((this.y + this.h) / TILE);
      const lw = getLevelWidth();
      if (this.vx > 0) {
        const right = Math.floor((this.x + this.w) / TILE);
        for (let ty = top; ty <= bot; ty++) {
          if (right >= 0 && right < lw && ty >= 0 && ty < LEVEL_HEIGHT && isSolid(level[ty][right])) {
            this.x = right * TILE - this.w;
            this.vx = -this.vx;
            break;
          }
        }
      } else if (this.vx < 0) {
        const left = Math.floor(this.x / TILE);
        for (let ty = top; ty <= bot; ty++) {
          if (left >= 0 && left < lw && ty >= 0 && ty < LEVEL_HEIGHT && isSolid(level[ty][left])) {
            this.x = (left + 1) * TILE;
            this.vx = -this.vx;
            break;
          }
        }
      }

      this.y += this.vy;
      if (this.vy >= 0) {
        const bot2 = Math.floor((this.y + this.h) / TILE);
        const left = Math.floor((this.x + 1) / TILE);
        const right = Math.floor((this.x + this.w - 1) / TILE);
        for (let tx = left; tx <= right; tx++) {
          if (tx >= 0 && tx < lw && bot2 >= 0 && bot2 < LEVEL_HEIGHT && isSolid(level[bot2][tx])) {
          this.y = bot2 * TILE - this.h;
          this.vy = this.type === 'star' ? -6 : 0;
          break;
        }
      }
    }

    if (this.y > VIEW_H + 32) this.alive = false;
  }

  draw() {
    if (!this.alive) return;
    const drawX = Math.round(this.x - cameraX);
    const drawY = Math.round(this.y);

    let spr;
    if (this.type === 'mushroom' || this.type === '1up') {
      const pal = this.type === '1up' ?
        { 0: null, 1: [0, 147, 0], 2: [255, 255, 255], 3: [234, 158, 34], 4: [0, 0, 0] } :
        PAL.mushroom;
      spr = createSprite(MUSHROOM_SPR, pal, 16, 16);
    } else if (this.type === 'star') {
      spr = createSprite(STAR_SPR, PAL.star, 16, 16);
    } else if (this.type === 'flower') {
      spr = createSprite(FIRE_FLOWER_SPR, PAL.fireFlower, 16, 16);
    }

      if (this.emerging) {
        // Clip to block
        ctx.save();
        ctx.beginPath();
        ctx.rect(drawX, drawY, 16, Math.floor(this.emergeY));
        ctx.clip();
        ctx.drawImage(spr, drawX, drawY, 16, 16);
        ctx.restore();
        return;
      }

      ctx.drawImage(spr, drawX, drawY, 16, 16);
    }
  }

// ============================================================
// UTILITY FUNCTIONS
// ============================================================

function isSolid(tile) {
  return tile === 1 || tile === 2 || tile === 3 || tile === 4 ||
         tile === 5 || tile === 6 || tile === 7 || tile === 8 ||
         tile === 9 || tile === 10 || tile === 11 || tile === 12;
}

function overlapsSolidTiles(levelData, x, y, w, h) {
  const lw = levelData && levelData[0] ? levelData[0].length : LEVEL_WIDTH;
  const left = Math.floor(x / TILE);
  const right = Math.floor((x + w - 1) / TILE);
  const top = Math.floor(y / TILE);
  const bot = Math.floor((y + h - 1) / TILE);

  for (let ty = top; ty <= bot; ty++) {
    if (ty < 0 || ty >= LEVEL_HEIGHT) continue;
    for (let tx = left; tx <= right; tx++) {
      if (tx < 0 || tx >= lw) continue;
      if (isSolid(levelData[ty][tx])) return true;
    }
  }
  return false;
}

function settleEnemySpawn(enemy, levelData) {
  if (!enemy || enemy.noSpawnSnap) return;
  const lw = levelData && levelData[0] ? levelData[0].length : LEVEL_WIDTH;
  const maxX = lw * TILE - enemy.w - 1;
  enemy.x = Math.max(1, Math.min(enemy.x, maxX));

  const baseX = enemy.x;
  if (overlapsSolidTiles(levelData, enemy.x, enemy.y, enemy.w, enemy.h)) {
    let fixed = false;
    for (let step = 1; step <= 3 && !fixed; step++) {
      for (const dir of [1, -1]) {
        const nx = baseX + dir * step * TILE;
        if (nx < 1 || nx > maxX) continue;
        if (!overlapsSolidTiles(levelData, nx, enemy.y, enemy.w, enemy.h)) {
          enemy.x = nx;
          fixed = true;
          break;
        }
      }
    }
  }

  let lift = 0;
  while (overlapsSolidTiles(levelData, enemy.x, enemy.y, enemy.w, enemy.h) && lift < 48) {
    enemy.y -= 1;
    lift++;
  }

  let drop = 0;
  while (!overlapsSolidTiles(levelData, enemy.x, enemy.y + 1, enemy.w, enemy.h) && drop < 64) {
    enemy.y += 1;
    drop++;
  }

  enemy.grounded = overlapsSolidTiles(levelData, enemy.x, enemy.y + 1, enemy.w, enemy.h);
}

function normalizeEnemySpawns(levelData, enemyList) {
  for (const enemy of enemyList) {
    settleEnemySpawn(enemy, levelData);
  }
  return enemyList;
}

function getLevelWidth() {
    return level && level[0] ? level[0].length : LEVEL_WIDTH;
  }

function getLevelWidthConst() {
  if (currentLevel === 3) return LEVEL3_WIDTH;
  if (currentLevel === 2) return LEVEL2_WIDTH;
  return LEVEL_WIDTH;
}

function getFlagTileX() {
  if (currentLevel === 3) return 202;
  if (currentLevel === 2) return 178;
  return 164;
}

function getCastleTileX() {
  if (currentLevel === 3) return 212;
  if (currentLevel === 2) return 190;
  return 176;
}

function rectsOverlap(a, b) {
  return a.x < b.x + b.w && a.x + a.w > b.x &&
         a.y < b.y + b.h && a.y + a.h > b.y;
}

function addFloatingText(x, y, text) {
  floatingTexts.push({ x: x - cameraX, y, text, life: 40, vy: -1.5 });
}

// ============================================================
// BLOCK INTERACTION
// ============================================================
let blockBumps = []; // {tx, ty, timer, originalTile}

function hitBlock(tx, ty, isBig) {
  const tile = level[ty][tx];
  if (tile === 2) {
    // Brick
    if (isBig) {
      level[ty][tx] = 0;
      SFX.bump();
      score += 50;
      // Brick break particles
      for (let i = 0; i < 4; i++) {
        particles.push({
          x: tx * TILE + (i % 2) * 8,
          y: ty * TILE + Math.floor(i / 2) * 8,
          vx: (i % 2 === 0 ? -2 : 2) + Math.random(),
          vy: -5 - Math.random() * 3,
          life: 40,
          type: 'brick',
        });
      }
    } else {
      SFX.bump();
      blockBumps.push({ tx, ty, timer: 8, originalTile: tile });
    }
  } else if (tile === 3) {
    // Question block with coin
    level[ty][tx] = 0; // mark as hit (will draw as used block)
    SFX.coin();
    coins++;
    score += 200;
    addFloatingText(tx * TILE, ty * TILE - 8, '200');
    if (coins >= 100) { coins -= 100; lives++; SFX.oneUp(); }
    // Coin pop animation
    particles.push({
      x: tx * TILE + 4, y: ty * TILE - 8,
      vx: 0, vy: -5, life: 20, type: 'coin',
    });
    level[ty][tx] = 9; // becomes hard block (used)
    blockBumps.push({ tx, ty, timer: 8, originalTile: 9 });
  } else if (tile === 4) {
    // Question block with mushroom/flower
    level[ty][tx] = 9;
    SFX.bump();
    blockBumps.push({ tx, ty, timer: 8, originalTile: 9 });
    if (mario.big) {
      powerups.push(new PowerUp(tx * TILE, ty * TILE, 'flower'));
    } else {
      powerups.push(new PowerUp(tx * TILE, ty * TILE, 'mushroom'));
    }
  } else if (tile === 10) {
    // Star block
    level[ty][tx] = 9;
    SFX.bump();
    blockBumps.push({ tx, ty, timer: 8, originalTile: 9 });
    powerups.push(new PowerUp(tx * TILE, ty * TILE, 'star'));
  } else if (tile === 12) {
    // 1-up block
    level[ty][tx] = 9;
    SFX.bump();
    blockBumps.push({ tx, ty, timer: 8, originalTile: 9 });
    powerups.push(new PowerUp(tx * TILE, ty * TILE, '1up'));
  } else if (tile === 9) {
    SFX.bump();
  }
}

// ============================================================
// GAME VARIABLES
// ============================================================
let mario;
let level;
let enemies = [];
let powerups = [];
let fireballs = [];
let flagY = 0;
let questionAnimTimer = 0;

// ============================================================
// ENEMY SPAWN DATA
// ============================================================
function createEnemies() {
  const e = [];

  // Segment A: tutorial pressure
  e.push(new Goomba(24 * TILE, 12 * TILE - 2));
  e.push(new HopperGoomba(34 * TILE, 12 * TILE - 2));

  // Segment B: pipe rhythm
  e.push(new Goomba(52 * TILE, 12 * TILE - 2));
  e.push(new Koopa(74 * TILE, 12 * TILE - 2));
  e.push(new PiranhaPlant(48 * TILE + 2, 11 * TILE));
  e.push(new PiranhaPlant(60 * TILE + 2, 10 * TILE));

  // Segment C: mixed challenge
  e.push(new HopperGoomba(104 * TILE, 12 * TILE - 2));
  e.push(new Goomba(120 * TILE, 12 * TILE - 2));
  e.push(new Koopa(138 * TILE, 12 * TILE - 2));
  e.push(new PiranhaPlant(128 * TILE + 2, 10 * TILE));

  // Finale pressure
  e.push(new Goomba(154 * TILE, 12 * TILE - 2));

  return e;
}

// ============================================================
// LEVEL 2 DATA (World 1-2 - Underground Theme)
// ============================================================
const LEVEL2_WIDTH = 240;

function createLevel2() {
  const level = [];
  for (let y = 0; y < LEVEL_HEIGHT; y++) {
    level[y] = new Array(LEVEL2_WIDTH).fill(0);
  }

  // Ground
  for (let x = 0; x < LEVEL2_WIDTH; x++) {
      // No gaps - solid ground throughout
    level[13][x] = 1;
    level[14][x] = 1;
  }

  // Ceiling (underground feel)
  for (let x = 4; x < 170; x++) {
    level[0][x] = 9;
    level[1][x] = 9;
  }

  // Entry pipe
  placePipe(level, 2, 11, 2);

  // First section: brick platforms
  for (let x = 10; x <= 14; x++) level[9][x] = 2;
  level[9][12] = 3; // coin block

  // Elevated platform
  for (let x = 18; x <= 22; x++) level[7][x] = 2;
  level[7][20] = 4; // mushroom/flower

  // Coin row
  for (let x = 26; x <= 32; x++) level[9][x] = 3;

  // Staircase up
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j <= i; j++) {
      level[12 - j][36 + i] = 9;
    }
  }

  // Floating brick platforms over gap
  level[10][44] = 2;
  level[10][46] = 2;
  level[10][48] = 2;

  // After gap - brick formation
  for (let x = 50; x <= 56; x++) level[9][x] = 2;
  level[9][52] = 4; // mushroom/flower
  level[9][54] = 10; // star

  // Low ceiling section (tight passage)
  for (let x = 60; x <= 72; x++) level[5][x] = 9;
  for (let x = 62; x <= 70; x++) level[9][x] = 2;
  level[9][66] = 3;

  // Pipes section
  placePipe(level, 74, 11, 2);
  placePipe(level, 82, 10, 3);

  // Platforms over second gap
  level[10][77] = 2;
  level[10][79] = 2;
  level[10][81] = 2;

  // Middle section - question blocks and bricks
  for (let x = 85; x <= 92; x++) level[9][x] = 2;
  level[9][87] = 3;
  level[9][89] = 3;
  level[9][91] = 4; // flower

  // Elevated coin blocks
  level[6][88] = 3;
  level[6][90] = 3;

  // Staircase section
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j <= i; j++) {
      level[12 - j][96 + i] = 9;
    }
  }
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j <= i; j++) {
      level[12 - (3-j)][104 - i] = 9;
    }
  }

  // Brick bridge section
  for (let x = 108; x <= 116; x++) level[9][x] = 2;
  level[9][112] = 3;

  // Platforms over third gap
  level[10][119] = 2;
  level[10][121] = 2;
  level[10][123] = 2;
  level[10][125] = 2;

  // After gap - intensive section
  for (let x = 127; x <= 135; x++) level[9][x] = 2;
  level[9][129] = 3;
  level[9][131] = 4;
  level[9][133] = 3;

  // Low ceiling with coin blocks
  for (let x = 138; x <= 148; x++) level[5][x] = 9;
  level[9][140] = 3;
  level[9][142] = 3;
  level[9][144] = 3;
  level[9][146] = 3;

  // Platforms over fourth gap
  level[10][154] = 2;
  level[10][156] = 2;
  level[10][158] = 2;

  // Final section - exit
  for (let x = 160; x <= 168; x++) level[9][x] = 2;
  level[9][164] = 3;

  // Exit staircase
  for (let i = 0; i < 5; i++) {
    for (let j = 0; j <= i; j++) {
      level[12 - j][172 + i] = 9;
    }
  }

  // Flag at x=178
  level[12][178] = 9;

  return level;
}

function createEnemies2() {
  const e = [];
  e.push(new Goomba(15 * TILE, 12 * TILE - 2));
  e.push(new Goomba(25 * TILE, 12 * TILE - 2));
  e.push(new HopperGoomba(42 * TILE, 12 * TILE - 2));
  e.push(new Goomba(53 * TILE, 12 * TILE - 2));
  e.push(new Goomba(65 * TILE, 12 * TILE - 2));
  e.push(new Goomba(68 * TILE, 12 * TILE - 2));
  e.push(new Goomba(90 * TILE, 12 * TILE - 2));
  e.push(new Goomba(110 * TILE, 12 * TILE - 2));
  e.push(new HopperGoomba(130 * TILE, 12 * TILE - 2));
  e.push(new Goomba(143 * TILE, 12 * TILE - 2));
  e.push(new Goomba(163 * TILE, 12 * TILE - 2));
  // Koopas
  e.push(new Koopa(88 * TILE, 12 * TILE - 2));
  e.push(new Koopa(145 * TILE, 12 * TILE - 2));
  // Pipe traps
  e.push(new PiranhaPlant(74 * TILE + 2, 11 * TILE));
  e.push(new PiranhaPlant(82 * TILE + 2, 10 * TILE));
  return e;
}

// ============================================================
// LEVEL 3 DATA (World 1-3 - Athletic Sky Theme)
// ============================================================
const LEVEL3_WIDTH = 260;

function createLevel3() {
  const level = [];
  for (let y = 0; y < LEVEL_HEIGHT; y++) {
    level[y] = new Array(LEVEL3_WIDTH).fill(0);
  }

  // Starting ground platform
  for (let x = 0; x < 12; x++) {
    level[13][x] = 1;
    level[14][x] = 1;
  }

  // Floating platforms section 1
  for (let x = 14; x <= 18; x++) level[11][x] = 9;
  for (let x = 21; x <= 24; x++) level[9][x] = 9;
  level[9][22] = 3; // coin block

  for (let x = 27; x <= 30; x++) level[11][x] = 9;
  level[11][28] = 3;

  // Small ground island
  for (let x = 33; x <= 38; x++) {
    level[13][x] = 1;
    level[14][x] = 1;
  }
  level[9][35] = 4; // mushroom/flower
  level[9][37] = 3;

  // Ascending platforms
  for (let x = 41; x <= 43; x++) level[11][x] = 9;
  for (let x = 46; x <= 48; x++) level[9][x] = 9;
  for (let x = 51; x <= 53; x++) level[7][x] = 9;
  level[7][52] = 3;

  // Descending to ground island
  for (let x = 56; x <= 58; x++) level[9][x] = 9;
  for (let x = 61; x <= 66; x++) {
    level[13][x] = 1;
    level[14][x] = 1;
  }
  placePipe(level, 63, 11, 2);

  // Brick bridge section (narrow, dangerous)
  for (let x = 69; x <= 72; x++) level[10][x] = 2;
  level[10][70] = 3;
  for (let x = 75; x <= 78; x++) level[10][x] = 2;
  for (let x = 81; x <= 84; x++) level[10][x] = 2;
  level[10][82] = 4; // flower

  // Ground island with pipes
  for (let x = 87; x <= 96; x++) {
    level[13][x] = 1;
    level[14][x] = 1;
  }
  placePipe(level, 88, 11, 2);
  placePipe(level, 94, 10, 3);

  // Block formations mid-air
  level[7][90] = 3;
  level[7][92] = 3;
  level[7][94] = 10; // star

  // Challenging platform section
  for (let x = 99; x <= 101; x++) level[11][x] = 9;
  for (let x = 104; x <= 106; x++) level[9][x] = 9;
  for (let x = 109; x <= 111; x++) level[11][x] = 9;
  for (let x = 114; x <= 116; x++) level[9][x] = 9;
  level[9][115] = 3;

  // Ground island
  for (let x = 119; x <= 126; x++) {
    level[13][x] = 1;
    level[14][x] = 1;
  }

  // Elevated brick platform with coins
  for (let x = 120; x <= 125; x++) level[9][x] = 2;
  level[9][121] = 3;
  level[9][123] = 3;
  level[9][125] = 4; // flower

  // High platforms section
  for (let x = 129; x <= 131; x++) level[7][x] = 9;
  level[6][132] = 9; // step block to make upper ? reachable
  level[6][133] = 9;
  for (let x = 134; x <= 136; x++) level[6][x] = 9;
  level[6][135] = 3;
  for (let x = 139; x <= 141; x++) level[7][x] = 9;

  // Staircase platforms descending
  for (let x = 144; x <= 146; x++) level[9][x] = 9;
  for (let x = 149; x <= 152; x++) level[11][x] = 9;

  // Large ground section before finale
  for (let x = 155; x <= 170; x++) {
    level[13][x] = 1;
    level[14][x] = 1;
  }

  // Block rows above ground
  for (let x = 157; x <= 163; x++) level[9][x] = 2;
  level[9][159] = 3;
  level[9][161] = 3;
  level[7][160] = 4; // mushroom/flower

  placePipe(level, 166, 11, 2);

  // Final challenge: floating platforms to flag
  for (let x = 173; x <= 175; x++) level[11][x] = 9;
  for (let x = 178; x <= 180; x++) level[9][x] = 9;
  for (let x = 183; x <= 186; x++) level[11][x] = 9;

  // Final ground with staircase to flag
  for (let x = 189; x <= 210; x++) {
    level[13][x] = 1;
    level[14][x] = 1;
  }

  // Final staircase
  for (let i = 0; i < 6; i++) {
    for (let j = 0; j <= i; j++) {
      level[12 - j][194 + i] = 9;
    }
  }

  // Flag at x=202
  level[12][202] = 9;

  return level;
}

function createEnemies3() {
  const e = [];
  // Goombas on platforms and ground
  e.push(new Goomba(16 * TILE, 10 * TILE - 2));
  e.push(new Goomba(35 * TILE, 12 * TILE - 2));
  e.push(new Goomba(64 * TILE, 12 * TILE - 2));
  e.push(new HopperGoomba(70 * TILE, 9 * TILE - 2));
  e.push(new Goomba(76 * TILE, 9 * TILE - 2));
  e.push(new Goomba(82 * TILE, 9 * TILE - 2));
  e.push(new Goomba(91 * TILE, 12 * TILE - 2));
  e.push(new Goomba(110 * TILE, 10 * TILE - 2));
  e.push(new Goomba(122 * TILE, 12 * TILE - 2));
  e.push(new Goomba(158 * TILE, 12 * TILE - 2));
  e.push(new HopperGoomba(162 * TILE, 12 * TILE - 2));
  e.push(new Goomba(192 * TILE, 12 * TILE - 2));
  // Koopas
  e.push(new Koopa(37 * TILE, 12 * TILE - 2));
  e.push(new Koopa(95 * TILE, 12 * TILE - 2));
  e.push(new Koopa(160 * TILE, 12 * TILE - 2));
  // Pipe traps
  e.push(new PiranhaPlant(63 * TILE + 2, 11 * TILE));
  e.push(new PiranhaPlant(94 * TILE + 2, 10 * TILE));
  e.push(new PiranhaPlant(166 * TILE + 2, 11 * TILE));
  return e;
}

// ============================================================
// FIREBALL SYSTEM
// ============================================================
function updateFireballs() {
  const lw = getLevelWidth();
  for (const fb of fireballs) {
    if (!fb.alive) continue;
    fb.vy += GRAVITY;
    fb.x += fb.vx;
    fb.y += fb.vy;

    // Ground bounce
    const bot = Math.floor((fb.y + 6) / TILE);
    const col = Math.floor((fb.x + 4) / TILE);
    if (bot >= 0 && bot < LEVEL_HEIGHT && col >= 0 && col < lw && isSolid(level[bot][col])) {
      fb.y = bot * TILE - 6;
      fb.vy = -4;
    }

    // Wall collision
    if (col >= 0 && col < lw) {
      const row = Math.floor(fb.y / TILE);
      if (row >= 0 && row < LEVEL_HEIGHT && isSolid(level[row][col])) {
        fb.alive = false;
      }
    }

    // Off screen
    if (fb.x < cameraX - 16 || fb.x > cameraX + VIEW_W + 16 || fb.y > VIEW_H + 16) {
      fb.alive = false;
    }

    // Hit enemies
    for (const e of enemies) {
      if (!e.alive || !e.active) continue;
      const canHit = typeof e.canBeHitByProjectiles === 'function' ? e.canBeHitByProjectiles() : true;
      if (!canHit) continue;
      if (fb.x > e.x && fb.x < e.x + e.w && fb.y > e.y && fb.y < e.y + e.h) {
        e.alive = false;
        fb.alive = false;
        score += 100;
        addFloatingText(e.x, e.y, '100');
        SFX.kick();
      }
    }
  }
  fireballs = fireballs.filter(f => f.alive);
}

function drawFireballs() {
  const spr = createSprite(FIREBALL_SPR, PAL.fireball, 8, 8);
  for (const fb of fireballs) {
    if (!fb.alive) continue;
    ctx.save();
    ctx.translate(Math.round(fb.x - cameraX + 4), Math.round(fb.y + 4));
    ctx.rotate(Date.now() / 100);
    ctx.drawImage(spr, -4, -4, 8, 8);
    ctx.restore();
  }
}

// ============================================================
// LASER BEAM SYSTEM (Super Skill for Fire Mario)
// ============================================================
let laserBeam = null; // { x, y, dir, timer, maxTimer, particles }
let laserCharges = 1; // laser charges (fire flower adds more, max 2)
const LASER_DURATION = 30;
let laserKeyPrev = false;

function shootLaser() {
  if (!mario.fire || !mario.big || mario.dead) return;
  if (laserBeam || laserCharges <= 0) return;

    const levelW = getLevelWidthConst();
    laserBeam = {
    x: mario.x + (mario.dir > 0 ? mario.w : 0),
    y: mario.y + (mario.big ? 20 : 6),
    dir: mario.dir,
    timer: LASER_DURATION,
    maxTimer: LASER_DURATION,
    hitTiles: [],
    hitEnemies: [],
    reachX: mario.x + (mario.dir > 0 ? mario.w : 0),
  };
  laserCharges--;
  SFX.laser();

    // Trace the laser beam path - destroys destructible blocks, stops at ground/hard blocks
    const startTileX = Math.floor(laserBeam.x / TILE);
    const laserTileY = Math.floor(laserBeam.y / TILE);
    const dir = laserBeam.dir;

    let reachPixelX = laserBeam.x;

    // Tiles the laser can destroy (bricks, pipes, question blocks)
    function isDestructible(t) {
      return t === 2 || t === 3 || t === 4 || t === 5 || t === 6 || t === 7 || t === 8 || t === 10 || t === 12;
    }
    // Tiles that block the laser completely (ground, hard block)
    function isIndestructible(t) {
      return t === 1 || t === 9;
    }

    function destroyTile(tx, ty) {
      if (ty < 0 || ty >= LEVEL_HEIGHT || tx < 0) return;
      const t = level[ty] ? level[ty][tx] : 0;
      if (!t) return;
      level[ty][tx] = 0;
      // Brick explosion particles
      for (let p = 0; p < 4; p++) {
        particles.push({
          x: tx * TILE + 4 + (p % 2) * 8,
          y: ty * TILE + 4 + Math.floor(p / 2) * 8,
          vx: (p % 2 === 0 ? -1 : 1) * (1 + Math.random() * 2),
          vy: -3 - Math.random() * 3,
          life: 25 + Math.random() * 15,
          type: 'brick'
        });
      }
    }

    if (dir > 0) {
      for (let tx = startTileX; tx < levelW; tx++) {
        if (tx < 0) continue;
        const tile = level[laserTileY] ? level[laserTileY][tx] : 0;
        if (isIndestructible(tile)) {
          reachPixelX = tx * TILE;
          break;
        }
        if (isDestructible(tile)) {
          destroyTile(tx, laserTileY);
          // Also destroy the other half of pipes
          if (tile === 5 && level[laserTileY] && level[laserTileY][tx + 1] === 6) destroyTile(tx + 1, laserTileY);
          if (tile === 6 && tx > 0 && level[laserTileY] && level[laserTileY][tx - 1] === 5) destroyTile(tx - 1, laserTileY);
          if (tile === 7 && level[laserTileY] && level[laserTileY][tx + 1] === 8) destroyTile(tx + 1, laserTileY);
          if (tile === 8 && tx > 0 && level[laserTileY] && level[laserTileY][tx - 1] === 7) destroyTile(tx - 1, laserTileY);
          // Destroy pipe tiles above/below too
          if (tile >= 5 && tile <= 8) {
            for (let dy = -2; dy <= 2; dy++) {
              const ny = laserTileY + dy;
              if (ny >= 0 && ny < LEVEL_HEIGHT && level[ny]) {
                const nt = level[ny][tx];
                if (nt >= 5 && nt <= 8) destroyTile(tx, ny);
                // Also destroy adjacent pipe column
                if (tx + 1 < levelW && level[ny][tx + 1] >= 5 && level[ny][tx + 1] <= 8) destroyTile(tx + 1, ny);
                if (tx - 1 >= 0 && level[ny][tx - 1] >= 5 && level[ny][tx - 1] <= 8) destroyTile(tx - 1, ny);
              }
            }
          }
          laserBeam.hitTiles.push({ x: tx * TILE, y: laserTileY * TILE });
        }
        reachPixelX = (tx + 1) * TILE;
        if (reachPixelX > cameraX + VIEW_W + 200) {
          reachPixelX = cameraX + VIEW_W + 200;
          break;
        }
      }
    } else {
      for (let tx = startTileX; tx >= 0; tx--) {
        const tile = level[laserTileY] ? level[laserTileY][tx] : 0;
        if (isIndestructible(tile)) {
          reachPixelX = (tx + 1) * TILE;
          break;
        }
        if (isDestructible(tile)) {
          destroyTile(tx, laserTileY);
          if (tile === 5 && level[laserTileY] && level[laserTileY][tx + 1] === 6) destroyTile(tx + 1, laserTileY);
          if (tile === 6 && tx > 0 && level[laserTileY] && level[laserTileY][tx - 1] === 5) destroyTile(tx - 1, laserTileY);
          if (tile === 7 && level[laserTileY] && level[laserTileY][tx + 1] === 8) destroyTile(tx + 1, laserTileY);
          if (tile === 8 && tx > 0 && level[laserTileY] && level[laserTileY][tx - 1] === 7) destroyTile(tx - 1, laserTileY);
          if (tile >= 5 && tile <= 8) {
            for (let dy = -2; dy <= 2; dy++) {
              const ny = laserTileY + dy;
              if (ny >= 0 && ny < LEVEL_HEIGHT && level[ny]) {
                const nt = level[ny][tx];
                if (nt >= 5 && nt <= 8) destroyTile(tx, ny);
                if (tx + 1 < levelW && level[ny][tx + 1] >= 5 && level[ny][tx + 1] <= 8) destroyTile(tx + 1, ny);
                if (tx - 1 >= 0 && level[ny][tx - 1] >= 5 && level[ny][tx - 1] <= 8) destroyTile(tx - 1, ny);
              }
            }
          }
          laserBeam.hitTiles.push({ x: tx * TILE, y: laserTileY * TILE });
        }
        reachPixelX = tx * TILE;
        if (reachPixelX < cameraX - 200) {
          reachPixelX = cameraX - 200;
          break;
        }
      }
    }

  laserBeam.reachX = reachPixelX;

  // Kill all enemies in the laser path
  for (const e of enemies) {
    if (!e.alive || !e.active) continue;
    if (e instanceof Goomba && e.flat) continue;
    const canHit = typeof e.canBeHitByProjectiles === 'function' ? e.canBeHitByProjectiles() : true;
    if (!canHit) continue;
    const ey = e.y + e.h / 2;
    const laserY = laserBeam.y;
    if (Math.abs(ey - laserY) < 16) {
      const ex = e.x + e.w / 2;
      if (dir > 0) {
        if (ex >= laserBeam.x && ex <= reachPixelX) {
          e.alive = false;
          laserBeam.hitEnemies.push({ x: e.x, y: e.y });
          score += 200;
          addFloatingText(e.x, e.y, '200');
          // Death particle
          particles.push({ x: e.x, y: e.y, vx: 0, vy: -5, life: 30, type: 'enemy', enemy: e });
        }
      } else {
        if (ex <= laserBeam.x && ex >= reachPixelX) {
          e.alive = false;
          laserBeam.hitEnemies.push({ x: e.x, y: e.y });
          score += 200;
          addFloatingText(e.x, e.y, '200');
          particles.push({ x: e.x, y: e.y, vx: 0, vy: -5, life: 30, type: 'enemy', enemy: e });
        }
      }
    }
  }
}

function updateLaser() {
  if (!laserBeam) return;
  laserBeam.timer--;
  if (laserBeam.timer <= 0) {
    laserBeam = null;
  }
}

function drawLaser() {
  if (!laserBeam) return;
  const progress = 1 - laserBeam.timer / laserBeam.maxTimer;
  const alpha = laserBeam.timer / laserBeam.maxTimer;

  const startX = Math.round(laserBeam.x - cameraX);
  const y = Math.round(laserBeam.y);
  const endX = Math.round(laserBeam.reachX - cameraX);

  const beamLeft = Math.min(startX, endX);
  const beamRight = Math.max(startX, endX);
  const beamWidth = beamRight - beamLeft;

  // Draw expanding/fading beam
  ctx.save();
  ctx.globalAlpha = alpha;

  // Outer glow (wide, red)
  const glowH = 10 + (1 - alpha) * 6;
  ctx.fillStyle = `rgba(255, 60, 20, ${alpha * 0.3})`;
  ctx.fillRect(beamLeft, y - glowH / 2, beamWidth, glowH);

  // Middle beam (orange)
  const midH = 6 + (1 - alpha) * 2;
  ctx.fillStyle = `rgba(255, 150, 30, ${alpha * 0.6})`;
  ctx.fillRect(beamLeft, y - midH / 2, beamWidth, midH);

  // Core beam (white-yellow)
  const coreH = 3;
  ctx.fillStyle = `rgba(255, 255, 200, ${alpha * 0.9})`;
  ctx.fillRect(beamLeft, y - coreH / 2, beamWidth, coreH);

  // Bright flash at start
  if (laserBeam.timer > laserBeam.maxTimer - 5) {
    ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
    ctx.beginPath();
    ctx.arc(startX, y, 8, 0, Math.PI * 2);
    ctx.fill();
  }

  // Spark particles along beam
  if (laserBeam.timer > 5) {
    for (let i = 0; i < 5; i++) {
      const sparkX = beamLeft + Math.random() * beamWidth;
      const sparkY = y + (Math.random() - 0.5) * 12;
      ctx.fillStyle = `rgba(255, 255, 100, ${alpha})`;
      ctx.fillRect(sparkX, sparkY, 2, 2);
    }
  }

  ctx.restore();

  // Draw laser usage indicator (small icon under Mario)
  if (laserCharges <= 0 && mario.fire && mario.big) {
    // Show "used" indicator - red X
    const barX = Math.round(mario.x - cameraX - 2);
    const barY = Math.round(mario.y + (mario.big ? 50 : 18));
    ctx.fillStyle = '#f00';
    ctx.fillRect(barX, barY, 16, 2);
  }
}

function drawLaserCooldownHUD() {
  if (!mario.fire || !mario.big || mario.dead) return;
  const barX = Math.round(mario.x - cameraX - 2);
  const barY = Math.round(mario.y + (mario.big ? 50 : 18));
  if (laserCharges <= 0) {
    // Used - dim red bar
    ctx.fillStyle = '#600';
    ctx.fillRect(barX, barY, 16, 2);
  } else {
    // Show charges as green dots
    if (Math.floor(Date.now() / 300) % 2) {
      ctx.fillStyle = '#0f0';
      for (let i = 0; i < laserCharges; i++) {
        ctx.fillRect(barX + i * 9, barY, 7, 2);
      }
    }
  }
}

// ============================================================
// COLLISION DETECTION - MARIO VS ENEMIES & POWERUPS
// ============================================================
function checkMarioEnemyCollisions() {
  if (mario.dead || mario.flagSliding || mario.flagDone) return;

  for (const e of enemies) {
    if (!e.alive || !e.active) continue;
    // Skip flat (already stomped) goombas
    if (e instanceof Goomba && e.flat) continue;
    const canDamage = typeof e.canDamageMario === 'function' ? e.canDamageMario() : true;
    if (!canDamage) continue;

    if (e instanceof Koopa && e.shell && !e.shellMoving) {
      // Can kick stationary shell
      const hb = mario.hitbox;
      if (rectsOverlap(hb, e)) {
        e.stomp();
        mario.vy = -3;
      }
      continue;
    }

    const hb = mario.hitbox;
    if (!rectsOverlap(hb, e)) continue;

    // Check if stomping: mario was falling (use saved prevVy) and mario's
    // vertical center is above the enemy's vertical center
    const marioCenter = hb.y + hb.h / 2;
    const enemyCenter = e.y + e.h / 2;
    const canStomp = typeof e.canBeStomped === 'function' ? e.canBeStomped() : true;
    if (canStomp && mario.prevVy >= 0 && marioCenter < enemyCenter) {
      e.stomp();
        mario.vy = keys['ArrowUp'] || keys['Space'] || keys['KeyW'] || keys['KeyK'] ? -8 : -5;
      // Push mario above enemy to avoid re-collision
      mario.y = e.y - (mario.big ? 46 : 14) - 1;
      mario.grounded = false;
    } else {
      // Mario gets hurt
      if (mario.star) {
        e.alive = false;
        score += 200;
        addFloatingText(e.x, e.y, '200');
        SFX.kick();
      } else if (mario.invincible <= 0) {
        mario.die();
      }
    }
  }
}

function checkMarioPowerupCollisions() {
  if (mario.dead) return;

  for (const p of powerups) {
    if (!p.alive || p.emerging) continue;
    const hb = mario.hitbox;
    if (rectsOverlap(hb, p)) {
      p.alive = false;
      if (p.type === 'mushroom') {
          if (!mario.big) {
            mario.big = true;
            mario.growing = 30;
            mario.y -= 32; // grow from 16px to 48px
          }
          lives++;
          score += 1000;
          addFloatingText(p.x, p.y, '1UP');
          SFX.powerup();
          SFX.oneUp();
      } else if (p.type === 'flower') {
        if (mario.fire && mario.big) {
          // Already fire mario - upgrade: add laser charge + double fireball
          if (laserCharges < 2) laserCharges++;
          mario.doubleFireball = true;
          score += 1000;
          addFloatingText(p.x, p.y, '1000');
        } else {
          mario.fire = true;
          if (!mario.big) {
            mario.big = true;
            mario.growing = 30;
            mario.y -= 32;
          }
          // First fire flower gives 1 laser charge
          if (laserCharges < 1) laserCharges = 1;
          score += 1000;
          addFloatingText(p.x, p.y, '1000');
        }
        SFX.powerup();
      } else if (p.type === 'star') {
        mario.star = true;
        mario.starTimer = 600;
        score += 1000;
        addFloatingText(p.x, p.y, '1000');
        SFX.powerup();
      } else if (p.type === '1up') {
        lives++;
        addFloatingText(p.x, p.y, '1UP');
        SFX.oneUp();
      }
    }
  }
}

// ============================================================
// FLAGPOLE
// ============================================================
function checkFlagpole() {
    if (mario.dead || mario.flagSliding || mario.flagDone) return;
      const flagTileX = getFlagTileX();
      if (mario.x + mario.w >= flagTileX * TILE + 6 && mario.x <= flagTileX * TILE + 10) {
    mario.flagSliding = true;
    mario.vx = 0;
    mario.vy = 0;
    mario.x = flagTileX * TILE - 2;
    flagY = mario.y;
    // Score based on height
    const height = 13 * TILE - mario.y;
    let pts = 100;
    if (height > 100) pts = 2000;
    else if (height > 80) pts = 1000;
    else if (height > 50) pts = 500;
    score += pts;
    addFloatingText(mario.x, mario.y, String(pts));
    SFX.flagpole();
  }
}

// ============================================================
// PARTICLES & FLOATING TEXT
// ============================================================
function updateParticles() {
  for (const p of particles) {
    p.vy += 0.3;
    p.x += p.vx;
    p.y += p.vy;
    p.life--;
  }
  particles = particles.filter(p => p.life > 0);

  for (const t of floatingTexts) {
    t.y += t.vy;
    t.life--;
  }
  floatingTexts = floatingTexts.filter(t => t.life > 0);
}

function drawParticles() {
  for (const p of particles) {
    if (p.type === 'brick') {
      ctx.fillStyle = '#c84c0c';
      ctx.fillRect(Math.round(p.x - cameraX), Math.round(p.y), 6, 6);
      ctx.fillStyle = '#e09050';
      ctx.fillRect(Math.round(p.x - cameraX) + 1, Math.round(p.y) + 1, 4, 4);
    } else if (p.type === 'coin') {
      const spr = createSprite(COIN_SPR, PAL.coin, 8, 16);
      ctx.drawImage(spr, Math.round(p.x - cameraX), Math.round(p.y), 8, 16);
    }
  }

  ctx.fillStyle = '#fff';
  ctx.font = '8px monospace';
  for (const t of floatingTexts) {
    ctx.fillText(t.text, Math.round(t.x), Math.round(t.y));
  }
}

// ============================================================
// GAME INITIALIZATION & RESET
// ============================================================
function createLevelAndEnemies() {
  let data;
  if (currentLevel === 3) {
    data = { level: createLevel3(), enemies: createEnemies3() };
  } else if (currentLevel === 2) {
    data = { level: createLevel2(), enemies: createEnemies2() };
  } else {
    data = { level: createLevel(), enemies: createEnemies() };
  }
  data.enemies = normalizeEnemySpawns(data.level, data.enemies);
  return data;
}

function resetGame() {
    mario = new Mario();
    const data = createLevelAndEnemies();
    level = data.level;
    enemies = data.enemies;
    powerups = [];
    fireballs = [];
    particles = [];
    floatingTexts = [];
    blockBumps = [];
    cameraX = 0;
    timer = 400;
    timerCount = 0;
    flagY = 0;
    questionAnimTimer = 0;
    laserBeam = null;
    laserCharges = 1;
  }
  
  function restartLevel() {
    mario = new Mario();
    const data = createLevelAndEnemies();
    level = data.level;
    enemies = data.enemies;
    powerups = [];
    fireballs = [];
    particles = [];
    floatingTexts = [];
    blockBumps = [];
    cameraX = 0;
    timer = 400;
    timerCount = 0;
    flagY = 0;
    laserBeam = null;
    laserCharges = 1;
  }

function startLevel2() {
  currentLevel = 2;
  world = '1-2';
  // Preserve Mario's power-up state
  const wasBig = mario.big;
  const wasFire = mario.fire;
  const wasDouble = mario.doubleFireball;
  const savedCharges = laserCharges;
  mario = new Mario();
  mario.big = wasBig;
  mario.fire = wasFire;
  mario.doubleFireball = wasDouble;
  if (mario.big) mario.y -= 32;
  level = createLevel2();
  enemies = normalizeEnemySpawns(level, createEnemies2());
  powerups = [];
  fireballs = [];
  particles = [];
  floatingTexts = [];
  blockBumps = [];
  cameraX = 0;
  timer = 400;
  timerCount = 0;
  flagY = 0;
  laserBeam = null;
  laserCharges = savedCharges > 0 ? savedCharges : 1; // at least 1 for new level
}

function newGame() {
    score = 0;
    coins = 0;
    lives = 3;
    world = '1-1';
    currentLevel = 1;
    gameState = 'levelselect';
    levelSelectCursor = 0;
  }

// ============================================================
// FIRE KEY TRACKING
// ============================================================
let fireKeyPrev = false;

// ============================================================
// CAMERA
// ============================================================
function updateCamera() {
    const targetX = mario.x - VIEW_W / 3;
    cameraX += (targetX - cameraX) * 0.15;
    if (cameraX < 0) cameraX = 0;
      const levelW = getLevelWidthConst();
      const maxCam = levelW * TILE - VIEW_W;
    if (cameraX > maxCam) cameraX = maxCam;
  }

// ============================================================
// DRAWING
// ============================================================
function drawBackground() {
  // Sky
  ctx.fillStyle = '#6b8cff';
  ctx.fillRect(0, 0, VIEW_W, VIEW_H);

  // Background elements (hills, clouds, bushes)
  const cx = Math.floor(cameraX);
  // Hills
  drawHill(-cx * 0.3 % 400 + 20, 13 * TILE - 48);
  drawHill(-cx * 0.3 % 400 + 300, 13 * TILE - 48);
  drawHill(-cx * 0.3 % 400 + 600, 13 * TILE - 48);

  // Clouds
  for (let i = 0; i < 6; i++) {
    const cloudX = (i * 200 + 50 - cx * 0.2) % (VIEW_W + 400) - 100;
    drawCloud(cloudX, 30 + (i % 3) * 20);
  }

  // Bushes
  for (let i = 0; i < 5; i++) {
    const bushX = (i * 250 + 80 - cx * 0.8) % (VIEW_W + 400) - 100;
    drawBush(bushX, 13 * TILE - 6);
  }
}

function drawLevel() {
  const startTileX = Math.floor(cameraX / TILE);
  const endTileX = Math.ceil((cameraX + VIEW_W) / TILE) + 1;

  questionAnimTimer++;

  for (let ty = 0; ty < LEVEL_HEIGHT; ty++) {
    for (let tx = startTileX; tx <= endTileX && tx < getLevelWidth(); tx++) {
      if (tx < 0) continue;
      const tile = level[ty][tx];
      if (tile === 0) continue;

      let drawX = tx * TILE - Math.floor(cameraX);
      let drawY = ty * TILE;

      // Block bump offset
      let bumpOffset = 0;
      for (const b of blockBumps) {
        if (b.tx === tx && b.ty === ty) {
          bumpOffset = b.timer > 4 ? -(8 - b.timer) * 2 : -(b.timer) * 2;
          break;
        }
      }
      drawY += bumpOffset;

      switch (tile) {
        case 1: drawGround(drawX, drawY); break;
        case 2: drawBrick(drawX, drawY); break;
        case 3:
        case 4:
        case 10:
        case 12:
          drawQuestionBlock(drawX, drawY, false);
          break;
        case 5: // pipe top-left
          drawPipeTop(drawX, drawY);
          break;
        case 6: break; // pipe top-right (drawn by top-left)
        case 7: // pipe body-left
          drawPipeBody(drawX, drawY);
          break;
        case 8: break; // pipe body-right (drawn by body-left)
        case 9: // hard/used block
          drawQuestionBlock(drawX, drawY, true);
          break;
        case 11: break; // invisible
      }
    }
  }

  // Update block bumps
  for (let i = blockBumps.length - 1; i >= 0; i--) {
    blockBumps[i].timer--;
    if (blockBumps[i].timer <= 0) blockBumps.splice(i, 1);
  }
}

function drawFlagPoleAndFlag() {
  const flagTileX = getFlagTileX();
  const poleX = flagTileX * TILE - Math.floor(cameraX);
  drawFlagPole(poleX, 3 * TILE);

  let fy;
  if (mario.flagSliding) {
    fy = mario.y;
  } else if (mario.flagDone) {
    fy = 13 * TILE - 16;
  } else {
    fy = 3 * TILE + 8;
  }
  drawFlag(poleX + 7, fy);
}

function drawCastleArea() {
  const castleTileX = getCastleTileX();
  const castleX = castleTileX * TILE - Math.floor(cameraX);
  drawCastle(castleX, 13 * TILE - 80);
}

function drawHUD() {
  ctx.fillStyle = '#fff';
  ctx.font = '8px monospace';

  ctx.fillText('MARIO', 20, 12);
  ctx.fillText(String(score).padStart(6, '0'), 20, 22);

  ctx.fillText('x' + String(coins).padStart(2, '0'), 90, 22);
  // Draw small coin icon
  ctx.fillStyle = '#ffcc00';
  ctx.fillRect(83, 16, 5, 7);
  ctx.fillStyle = '#fff';

  ctx.fillText('WORLD', 140, 12);
  ctx.fillText(' ' + world, 140, 22);

  ctx.fillText('TIME', 200, 12);
  ctx.fillText(' ' + String(Math.max(0, Math.floor(timer))).padStart(3, '0'), 200, 22);
}

// ============================================================
// TITLE SCREEN
// ============================================================
function drawTitleScreen() {
  ctx.fillStyle = '#6b8cff';
  ctx.fillRect(0, 0, VIEW_W, VIEW_H);

  // Ground
  for (let x = 0; x < VIEW_W; x += TILE) {
    drawGround(x, 13 * TILE);
    drawGround(x, 14 * TILE);
  }

  drawHill(30, 13 * TILE - 48);
  drawCloud(60, 40);
  drawCloud(180, 30);
  drawBush(120, 13 * TILE - 6);

  // Title text
  ctx.fillStyle = '#e09050';
  ctx.font = 'bold 16px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('SUPER MARIO BROS', VIEW_W / 2, 60);

  ctx.fillStyle = '#fff';
  ctx.font = '8px monospace';
  ctx.fillText('\u00A9 PIXEL WEB EDITION', VIEW_W / 2, 80);

  // Mario sprite on title
  const spr = createSprite(MARIO_STAND, PAL.mario, 16, 16);
  ctx.drawImage(spr, VIEW_W / 2 - 8, 100, 16, 16);

  // Menu
  ctx.fillStyle = '#fff';
  ctx.font = '8px monospace';
  const blink = Math.floor(Date.now() / 500) % 2;
  if (blink) ctx.fillText('PRESS ENTER TO START', VIEW_W / 2, 160);

        ctx.fillText('ARROWS/WASD: MOVE  SPACE/K: JUMP', VIEW_W / 2, 180);
        ctx.fillText('J/SHIFT: RUN  Z/X: FIREBALL', VIEW_W / 2, 192);
        ctx.fillStyle = '#ffcc00';
        ctx.fillText('L: LASER BEAM (FIRE MARIO)', VIEW_W / 2, 204);
        ctx.fillStyle = '#fff';
        ctx.fillText('ENTER: START', VIEW_W / 2, 218);

  ctx.textAlign = 'left';
}

function drawTransitionScreen() {
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, VIEW_W, VIEW_H);

  ctx.fillStyle = '#fff';
  ctx.font = '8px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('WORLD ' + world, VIEW_W / 2, VIEW_H / 2 - 20);

  const spr = createSprite(MARIO_STAND, PAL.mario, 16, 16);
  ctx.drawImage(spr, VIEW_W / 2 - 30, VIEW_H / 2 - 10, 16, 16);

  ctx.fillText('x  ' + lives, VIEW_W / 2 + 5, VIEW_H / 2 + 2);
  ctx.textAlign = 'left';
}

function drawGameOverScreen() {
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, VIEW_W, VIEW_H);

  ctx.fillStyle = '#fff';
  ctx.font = '12px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('GAME OVER', VIEW_W / 2, VIEW_H / 2 - 10);

  ctx.font = '8px monospace';
  const blink = Math.floor(Date.now() / 500) % 2;
  if (blink) ctx.fillText('PRESS ENTER', VIEW_W / 2, VIEW_H / 2 + 20);
  ctx.textAlign = 'left';
}

function drawWinScreen() {
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, VIEW_W, VIEW_H);

  ctx.fillStyle = '#fff';
  ctx.font = '12px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('COURSE CLEAR!', VIEW_W / 2, VIEW_H / 2 - 30);

  ctx.font = '8px monospace';
  ctx.fillText('SCORE: ' + String(score).padStart(6, '0'), VIEW_W / 2, VIEW_H / 2);
  ctx.fillText('COINS: ' + coins, VIEW_W / 2, VIEW_H / 2 + 15);
  ctx.fillText('CONGRATULATIONS!', VIEW_W / 2, VIEW_H / 2 + 30);

  const blink = Math.floor(Date.now() / 500) % 2;
  if (blink) ctx.fillText('PRESS ENTER', VIEW_W / 2, VIEW_H / 2 + 55);
  ctx.textAlign = 'left';
}

// ============================================================
// LEVEL SELECT SCREEN
// ============================================================
const TOTAL_LEVELS = 3;

function drawLevelSelectScreen() {
  ctx.fillStyle = '#6b8cff';
  ctx.fillRect(0, 0, VIEW_W, VIEW_H);

  // Ground
  for (let x = 0; x < VIEW_W; x += TILE) {
    drawGround(x, 13 * TILE);
    drawGround(x, 14 * TILE);
  }

  // Title
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 10px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('SELECT WORLD', VIEW_W / 2, 28);

  // Stats
  ctx.font = '7px monospace';
  ctx.fillStyle = '#ffcc00';
  ctx.fillText('SCORE: ' + String(score).padStart(6, '0') + '  LIVES: ' + lives, VIEW_W / 2, 42);
  if (highScore > 0) {
    ctx.fillStyle = '#aaa';
    ctx.fillText('HI: ' + String(highScore).padStart(6, '0'), VIEW_W / 2, 52);
  }

  // Level cards - compact layout
  const cardW = 52;
  const cardH = 58;
  const gap = 16;
  const totalW = TOTAL_LEVELS * cardW + (TOTAL_LEVELS - 1) * gap;
  const startX = (VIEW_W - totalW) / 2;
  const cardY = 64;

  for (let i = 0; i < TOTAL_LEVELS; i++) {
    const lv = i + 1;
    const cx = startX + i * (cardW + gap);
    const unlocked = lv <= maxUnlockedLevel;
    const selected = i === levelSelectCursor;

    // Selection highlight border
    if (selected) {
      ctx.fillStyle = '#ffcc00';
      ctx.fillRect(cx - 2, cardY - 2, cardW + 4, cardH + 4);
    }

    ctx.fillStyle = unlocked ? '#203080' : '#333333';
    ctx.fillRect(cx, cardY, cardW, cardH);

    // Inner border
    ctx.strokeStyle = unlocked ? '#6090e0' : '#555555';
    ctx.lineWidth = 1;
    ctx.strokeRect(cx + 2, cardY + 2, cardW - 4, cardH - 4);

    // World number
    ctx.fillStyle = unlocked ? '#fff' : '#777';
    ctx.font = 'bold 7px monospace';
    ctx.fillText('WORLD', cx + cardW / 2, cardY + 14);
    ctx.font = 'bold 14px monospace';
    ctx.fillText('1-' + lv, cx + cardW / 2, cardY + 32);

    // Level theme icon
    const iconCx = cx + cardW / 2;
    if (lv === 1) {
      ctx.fillStyle = unlocked ? '#00a800' : '#555';
      ctx.fillRect(iconCx - 4, cardY + 36, 8, 6);
      ctx.fillStyle = unlocked ? '#00d800' : '#666';
      ctx.fillRect(iconCx - 2, cardY + 38, 2, 4);
    } else if (lv === 2) {
      ctx.fillStyle = unlocked ? '#c84c0c' : '#555';
      ctx.fillRect(iconCx - 5, cardY + 36, 10, 6);
      ctx.fillStyle = unlocked ? '#e09050' : '#666';
      ctx.fillRect(iconCx - 3, cardY + 38, 3, 3);
      ctx.fillRect(iconCx + 1, cardY + 38, 3, 3);
    } else {
      ctx.fillStyle = unlocked ? '#fff' : '#666';
      ctx.fillRect(iconCx - 4, cardY + 39, 8, 3);
      ctx.fillRect(iconCx - 2, cardY + 37, 4, 2);
    }

    // Status text
    ctx.font = '5px monospace';
    if (!unlocked) {
      ctx.fillStyle = '#777';
      ctx.fillText('LOCKED', cx + cardW / 2, cardY + 52);
    } else {
      ctx.fillStyle = '#0f0';
      ctx.fillText('OPEN', cx + cardW / 2, cardY + 52);
    }
  }

  // Mario cursor
  const cursorCardX = startX + levelSelectCursor * (cardW + gap) + cardW / 2;
  const spr = createSprite(MARIO_STAND, PAL.mario, 16, 16);
  ctx.drawImage(spr, cursorCardX - 8, cardY - 18, 14, 14);

  // Instructions
  ctx.fillStyle = '#fff';
  ctx.font = '7px monospace';
  const blink = Math.floor(Date.now() / 500) % 2;
  ctx.fillText('LEFT/RIGHT: SELECT   ENTER: START', VIEW_W / 2, cardY + cardH + 18);
  if (blink && levelSelectCursor < TOTAL_LEVELS && levelSelectCursor + 1 <= maxUnlockedLevel) {
    ctx.fillStyle = '#ffcc00';
    ctx.fillText('PRESS ENTER', VIEW_W / 2, cardY + cardH + 30);
  }

  ctx.textAlign = 'left';
}

function startLevelFromSelect(lv) {
  // Preserve equipment if mario exists and is alive
  let wasBig = false, wasFire = false, wasDouble = false, savedCharges = 1;
  if (mario && !mario.dead) {
    wasBig = mario.big;
    wasFire = mario.fire;
    wasDouble = mario.doubleFireball;
    savedCharges = laserCharges > 0 ? laserCharges : 1;
  }
  currentLevel = lv;
  world = '1-' + lv;
  resetGame();
  // Restore equipment
  mario.big = wasBig;
  mario.fire = wasFire;
  mario.doubleFireball = wasDouble;
  if (mario.big) mario.y -= 32;
  laserCharges = savedCharges;
  gameState = 'playing';
}

function drawLevelClearScreen() {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, VIEW_W, VIEW_H);

    ctx.fillStyle = '#fff';
    ctx.font = '12px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('WORLD ' + world + ' CLEAR!', VIEW_W / 2, VIEW_H / 2 - 20);

    ctx.font = '8px monospace';
    ctx.fillText('SCORE: ' + String(score).padStart(6, '0'), VIEW_W / 2, VIEW_H / 2 + 5);

    const nextWorld = '1-' + (currentLevel + 1);
    const blink = Math.floor(Date.now() / 400) % 2;
    if (blink) ctx.fillText('NEXT: WORLD ' + nextWorld, VIEW_W / 2, VIEW_H / 2 + 30);
    ctx.textAlign = 'left';
  }

function drawBackground2() {
    // Underground theme - dark background
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, VIEW_W, VIEW_H);
  }

function drawBackground3() {
    // Sky/athletic theme - light blue with high clouds
    ctx.fillStyle = '#88aaff';
    ctx.fillRect(0, 0, VIEW_W, VIEW_H);

    const cx = Math.floor(cameraX);
    // More clouds for sky theme
    for (let i = 0; i < 8; i++) {
      const cloudX = (i * 160 + 30 - cx * 0.15) % (VIEW_W + 500) - 100;
      drawCloud(cloudX, 15 + (i % 4) * 18);
    }
  }

// ============================================================
// MAIN UPDATE
// ============================================================
function update() {
  if (gameState === 'title') {
    if (keys['Enter']) {
      newGame();
    }
    return;
  }

  if (gameState === 'gameover' || gameState === 'win') {
        if (keys['Enter']) {
          if (gameState === 'gameover') {
            // Reset lives/score on game over
            lives = 3;
            score = 0;
            coins = 0;
          }
          gameState = 'levelselect';
          levelSelectCursor = 0;
          keys['Enter'] = false;
        }
        return;
      }

      if (gameState === 'levelselect') {
        const leftKey = keys['ArrowLeft'] || keys['KeyA'];
        const rightKey = keys['ArrowRight'] || keys['KeyD'];
        const enterKey = keys['Enter'];

        if (leftKey && !levelSelectKeyPrev.left) {
          levelSelectCursor = Math.max(0, levelSelectCursor - 1);
        }
        if (rightKey && !levelSelectKeyPrev.right) {
          levelSelectCursor = Math.min(TOTAL_LEVELS - 1, levelSelectCursor + 1);
        }
        if (enterKey && !levelSelectKeyPrev.enter) {
          const selectedLevel = levelSelectCursor + 1;
          if (selectedLevel <= maxUnlockedLevel) {
            startLevelFromSelect(selectedLevel);
          } else {
            SFX.bump();
          }
        }
        levelSelectKeyPrev.left = leftKey;
        levelSelectKeyPrev.right = rightKey;
        levelSelectKeyPrev.enter = enterKey;
        return;
      }

    if (gameState === 'levelclear') {
        levelClearTimer--;
        if (levelClearTimer <= 0) {
          gameState = 'levelselect';
          levelSelectCursor = maxUnlockedLevel - 1;
        }
        return;
      }

    if (gameState === 'transition') {
    transitionTimer--;
    if (transitionTimer <= 0) {
      restartLevel();
      gameState = 'playing';
    }
    return;
  }

  if (gameState !== 'playing') return;

  // Timer
  timerCount++;
  if (timerCount >= 24) {
    timerCount = 0;
    timer--;
    if (timer <= 0) {
      mario.die();
    }
  }

      // Fire button (X or Z, NOT J which is for running)
      const fireKey = keys['KeyZ'] || keys['KeyX'];
      if (fireKey && !fireKeyPrev && mario.fire && mario.big && !mario.dead) {
    mario.shootFireball();
  }
    fireKeyPrev = fireKey;

    // Laser beam key (L)
    const laserKey = keys['KeyL'];
    if (laserKey && !laserKeyPrev && !mario.dead) {
      shootLaser();
    }
    laserKeyPrev = laserKey;

    // Update mario
  mario.update(level);

  // Activate enemies near camera
  for (const e of enemies) {
    if (!e.active && e.x < cameraX + VIEW_W + 32 && e.x > cameraX - 32) {
      e.activate();
    }
  }

  // Update enemies
  for (const e of enemies) {
    e.update(level);
  }
  enemies = enemies.filter(e => e.alive || (e instanceof Goomba && e.flat && e.flatTimer < 30));

  // Update powerups
  for (const p of powerups) {
    p.update(level);
  }
  powerups = powerups.filter(p => p.alive);

    // Update fireballs
    updateFireballs();

    // Update laser
    updateLaser();

  // Collisions
  checkMarioEnemyCollisions();
  checkMarioPowerupCollisions();
  checkFlagpole();

  // Particles
  updateParticles();

  // Camera
  if (!mario.dead) updateCamera();
}

// ============================================================
// MAIN DRAW
// ============================================================
function draw() {
  ctx.save();
  ctx.scale(SCALE, SCALE);

  if (gameState === 'title') {
    drawTitleScreen();
    ctx.restore();
    return;
  }
  if (gameState === 'transition') {
    drawTransitionScreen();
    ctx.restore();
    return;
  }
  if (gameState === 'gameover') {
    drawGameOverScreen();
    ctx.restore();
    return;
  }
      if (gameState === 'win') {
        drawWinScreen();
        ctx.restore();
        return;
      }
      if (gameState === 'levelselect') {
        drawLevelSelectScreen();
        ctx.restore();
        return;
      }
      if (gameState === 'levelclear') {
      drawLevelClearScreen();
      ctx.restore();
      return;
    }

      // Playing state
      if (currentLevel === 2) {
        drawBackground2();
      } else if (currentLevel === 3) {
        drawBackground3();
      } else {
        drawBackground();
      }
    drawLevel();
    drawFlagPoleAndFlag();
    drawCastleArea();

    // Draw powerups
    for (const p of powerups) p.draw();

    // Draw enemies
    for (const e of enemies) e.draw();

    // Draw mario
    mario.draw();

    // Draw fireballs
    drawFireballs();

    // Draw laser beam
    drawLaser();
    drawLaserCooldownHUD();

    // Draw particles
    drawParticles();

  // HUD
  drawHUD();

  ctx.restore();
}

// ============================================================
// GAME LOOP
// ============================================================
let lastTime = 0;
let accumulator = 0;
const STEP = 1000 / FPS;

function gameLoop(timestamp) {
  if (!lastTime) lastTime = timestamp;
  const delta = timestamp - lastTime;
  lastTime = timestamp;
  accumulator += delta;

  while (accumulator >= STEP) {
    update();
    accumulator -= STEP;
  }

  draw();
  requestAnimationFrame(gameLoop);
}

// ============================================================
// MOBILE TOUCH CONTROLS
// ============================================================
function addTouchControls() {
  const touchState = { left: false, right: false, jump: false, fire: false };

  const btnStyle = (el) => {
    el.style.position = 'fixed';
    el.style.zIndex = '1000';
    el.style.background = 'rgba(255,255,255,0.2)';
    el.style.border = '2px solid rgba(255,255,255,0.4)';
    el.style.borderRadius = '50%';
    el.style.color = '#fff';
    el.style.fontSize = '20px';
    el.style.display = 'flex';
    el.style.alignItems = 'center';
    el.style.justifyContent = 'center';
    el.style.userSelect = 'none';
    el.style.touchAction = 'none';
    el.style.width = '56px';
    el.style.height = '56px';
  };

  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) || (navigator.maxTouchPoints > 1);
  if (!isMobile) return;

  const btnLeft = document.createElement('div');
  btnLeft.textContent = '\u25C0';
  btnStyle(btnLeft);
  btnLeft.style.bottom = '20px';
  btnLeft.style.left = '20px';
  document.body.appendChild(btnLeft);

  const btnRight = document.createElement('div');
  btnRight.textContent = '\u25B6';
  btnStyle(btnRight);
  btnRight.style.bottom = '20px';
  btnRight.style.left = '90px';
  document.body.appendChild(btnRight);

  const btnJump = document.createElement('div');
  btnJump.textContent = 'A';
  btnStyle(btnJump);
  btnJump.style.bottom = '20px';
  btnJump.style.right = '20px';
  document.body.appendChild(btnJump);

  const btnFire = document.createElement('div');
  btnFire.textContent = 'B';
  btnStyle(btnFire);
  btnFire.style.bottom = '20px';
  btnFire.style.right = '90px';
  document.body.appendChild(btnFire);

  function bind(el, key) {
    el.addEventListener('touchstart', (e) => { e.preventDefault(); keys[key] = true; });
    el.addEventListener('touchend', (e) => { e.preventDefault(); keys[key] = false; });
    el.addEventListener('touchcancel', (e) => { e.preventDefault(); keys[key] = false; });
  }

  bind(btnLeft, 'ArrowLeft');
  bind(btnRight, 'ArrowRight');
  bind(btnJump, 'Space');
  bind(btnFire, 'KeyZ');

    // Tap anywhere on title to start
    canvas.addEventListener('touchstart', () => {
      if (gameState === 'title' || gameState === 'gameover' || gameState === 'win' || gameState === 'levelselect') {
        keys['Enter'] = true;
        setTimeout(() => keys['Enter'] = false, 100);
      }
    });
}

// ============================================================
// START
// ============================================================
addTouchControls();
requestAnimationFrame(gameLoop);
