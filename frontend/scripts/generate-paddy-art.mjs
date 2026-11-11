/**
 * Draws the AgriConnect background art and writes it into `assets/images/`.
 *
 * The app used to lean on a dark theme, so the new look needs artwork to sit
 * under it: a paddy field in warm harvest light for the hero bands, a softer
 * version of the same scene for the page background, and a flat illustration
 * for each of the five Marketplace categories.
 *
 * Everything is drawn here rather than shipped as loose binaries so the artwork
 * can be re-tuned by editing numbers and re-running:
 *
 *   node scripts/generate-paddy-art.mjs
 *
 * It uses only `node:fs`, `node:path` and `node:zlib`, so it adds no
 * dependencies to the app. The PNG encoder at the bottom is the short version
 * of the spec: signature, IHDR, IDAT and IEND.
 */

import { deflateSync } from 'node:zlib';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const IMAGES_DIR = join(HERE, '..', 'assets', 'images');

// ── The palette the artwork is painted with ─────────────────────────────────
//
// These are the same values the app uses in `src/constants/agri-theme.ts`. The
// art is painted slightly lighter than the UI so a translucent scrim over it
// still leaves the photograph feeling bright rather than muddy.

const PADDY_DEEP = [0x24, 0x5c, 0x2c];
const PADDY_GREEN = [0x36, 0x7d, 0x32];
const PADDY_LUSH = [0x4f, 0x9c, 0x3d];
const LEAF_GREEN = [0x66, 0xa6, 0x1e];
const LEAF_LIGHT = [0x8c, 0xc2, 0x4a];
const WATER_SKY = [0xa9, 0xcd, 0x8b];
const SOIL = [0x6b, 0x4a, 0x2f];
const HARVEST = [0xf4, 0xc5, 0x42];
const SUN = [0xff, 0xe9, 0xa8];
const SKY_TOP = [0xd9, 0xee, 0xcf];
const SKY_MID = [0xfd, 0xf3, 0xd0];
const SKY_HORIZON = [0xf8, 0xd4, 0x7c];

// ── A tiny software rasteriser ──────────────────────────────────────────────

/** An RGB canvas with alpha-blended drawing and no external dependencies. */
class Canvas {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.pixels = new Uint8Array(width * height * 3);
    this.fill(SKY_MID);
  }

  /** Replaces every pixel with one colour. */
  fill(color) {
    for (let index = 0; index < this.pixels.length; index += 3) {
      this.pixels[index] = color[0];
      this.pixels[index + 1] = color[1];
      this.pixels[index + 2] = color[2];
    }
  }

  /** Blends one pixel, `alpha` from 0 (untouched) to 1 (solid). */
  blend(x, y, color, alpha = 1) {
    if (alpha <= 0 || x < 0 || y < 0 || x >= this.width || y >= this.height) {
      return;
    }

    const offset = (y * this.width + x) * 3;
    const inverse = 1 - alpha;
    this.pixels[offset] = color[0] * alpha + this.pixels[offset] * inverse;
    this.pixels[offset + 1] = color[1] * alpha + this.pixels[offset + 1] * inverse;
    this.pixels[offset + 2] = color[2] * alpha + this.pixels[offset + 2] * inverse;
  }

  /** Fills the rectangle between two points, inclusive of both. */
  rect(x0, y0, x1, y1, color, alpha = 1) {
    const left = Math.max(0, Math.min(Math.round(x0), Math.round(x1)));
    const right = Math.min(this.width - 1, Math.max(Math.round(x0), Math.round(x1)));
    const top = Math.max(0, Math.min(Math.round(y0), Math.round(y1)));
    const bottom = Math.min(this.height - 1, Math.max(Math.round(y0), Math.round(y1)));

    for (let y = top; y <= bottom; y += 1) {
      for (let x = left; x <= right; x += 1) {
        this.blend(x, y, color, alpha);
      }
    }
  }

  /** Fills an axis-aligned ellipse given its centre and its two radii. */
  ellipse(cx, cy, rx, ry, color, alpha = 1) {
    if (rx <= 0 || ry <= 0) {
      return;
    }

    const left = Math.max(0, Math.floor(cx - rx));
    const right = Math.min(this.width - 1, Math.ceil(cx + rx));
    const top = Math.max(0, Math.floor(cy - ry));
    const bottom = Math.min(this.height - 1, Math.ceil(cy + ry));

    for (let y = top; y <= bottom; y += 1) {
      for (let x = left; x <= right; x += 1) {
        const dx = (x - cx) / rx;
        const dy = (y - cy) / ry;

        if (dx * dx + dy * dy <= 1) {
          this.blend(x, y, color, alpha);
        }
      }
    }
  }

  /**
   * Fills a convex polygon with the even-odd rule by scanning each row, so the
   * field rows and the silhouettes are drawn as real shapes rather than stacks
   * of rectangles.
   */
  polygon(points, color, alpha = 1) {
    const rows = Math.max(...points.map((point) => point[1]));
    const top = Math.max(0, Math.floor(Math.min(...points.map((point) => point[1]))));

    for (let y = top; y <= Math.ceil(rows); y += 1) {
      const crossings = [];

      for (let index = 0; index < points.length; index += 1) {
        const [x0, y0] = points[index];
        const [x1, y1] = points[(index + 1) % points.length];

        if (y0 === y1) {
          continue;
        }

        const lower = Math.min(y0, y1);
        const upper = Math.max(y0, y1);

        if (y + 0.5 < lower || y + 0.5 >= upper) {
          continue;
        }

        crossings.push(x0 + ((y + 0.5 - y0) / (y1 - y0)) * (x1 - x0));
      }

      crossings.sort((a, b) => a - b);

      for (let index = 0; index + 1 < crossings.length; index += 2) {
        this.rect(crossings[index], y, crossings[index + 1], y, color, alpha);
      }
    }
  }

  /** Draws a line of the given thickness by stamping a square brush along it. */
  line(x0, y0, x1, y1, thickness, color, alpha = 1) {
    const steps = Math.ceil(Math.hypot(x1 - x0, y1 - y0) * 2) + 1;
    const radius = Math.max(0.5, thickness / 2);

    for (let step = 0; step <= steps; step += 1) {
      const t = step / steps;
      this.ellipse(
        x0 + (x1 - x0) * t,
        y0 + (y1 - y0) * t,
        radius,
        radius,
        color,
        alpha
      );
    }
  }

  /** A soft radial glow, the sunrise bloom behind the fields. */
  glow(cx, cy, radius, color, strength = 1) {
    const left = Math.max(0, Math.floor(cx - radius));
    const right = Math.min(this.width - 1, Math.ceil(cx + radius));
    const top = Math.max(0, Math.floor(cy - radius));
    const bottom = Math.min(this.height - 1, Math.ceil(cy + radius));

    for (let y = top; y <= bottom; y += 1) {
      for (let x = left; x <= right; x += 1) {
        const distance = Math.hypot(x - cx, y - cy) / radius;

        if (distance < 1) {
          // Smoothstep, so the glow has no visible rim.
          const falloff = (1 - distance) ** 2;
          this.blend(x, y, color, falloff * falloff * strength);
        }
      }
    }
  }

  /**
   * Moves every pixel towards the colour given, by `amount`. Used to lift the
   * whole scene towards cream for the subtle page background.
   */
  wash(color, amount) {
    const inverse = 1 - amount;

    for (let index = 0; index < this.pixels.length; index += 3) {
      this.pixels[index] = this.pixels[index] * inverse + color[0] * amount;
      this.pixels[index + 1] = this.pixels[index + 1] * inverse + color[1] * amount;
      this.pixels[index + 2] = this.pixels[index + 2] * inverse + color[2] * amount;
    }
  }
}

/** Deterministic pseudo-randomness, so re-running produces identical files. */
function makeRandom(seed) {
  let state = seed;

  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state / 4294967296;
  };
}

// ── The paddy field scene ───────────────────────────────────────────────────

/**
 * Paints the field, the tree line and the sunrise into one canvas.
 *
 * The same routine draws all three background assets; `options.soft` decides
 * how far the result is washed towards cream, which is the difference between
 * the artwork under a hero heading and the artwork behind a scrolling list.
 */
function drawPaddyField(width, height, options = {}) {
  const canvas = new Canvas(width, height);
  const horizon = Math.round(height * 0.415);
  const sunX = width * 0.7;
  const sunY = horizon - height * 0.055;
  const random = makeRandom(options.seed ?? 20260929);

  // The sky: warm gold down at the tree line, cooling towards pale green above.
  for (let y = 0; y < horizon; y += 1) {
    const t = y / horizon;
    const color = mixColors(SKY_TOP, SKY_MID, smoothstep(0, 0.72, t));
    const nearHorizon = smoothstep(0.62, 1, t);
    const row = mixColors(color, SKY_HORIZON, nearHorizon * 0.92);

    canvas.rect(0, y, width, y, row);
  }

  // Sunrise bloom, so the warm light reads as a low sun rather than a gradient.
  canvas.glow(sunX, sunY, width * 0.5, SUN, 0.85);
  canvas.glow(sunX, sunY, width * 0.16, [0xff, 0xf6, 0xdc], 0.95);

  // A few long, flat cloud bands catching the same light.
  for (let index = 0; index < 7; index += 1) {
    const cloudY = horizon * (0.16 + random() * 0.42);
    const cloudX = width * random() * 0.9;
    const cloudWidth = width * (0.14 + random() * 0.26);
    const cloudHeight = Math.max(3, height * 0.012);
    canvas.ellipse(cloudX, cloudY, cloudWidth / 2, cloudHeight, [0xff, 0xff, 0xf2], 0.3);
  }

  drawTreeLine(canvas, horizon, width, random);
  drawFields(canvas, horizon, height, width, random);
  drawWaterSheen(canvas, horizon, height, width, sunX);
  drawHaze(canvas, horizon, height, width);

  if (options.soft) {
    // The page-background variant is pulled towards cream so a card is still
    // the brightest thing on screen wherever it lands.
    canvas.wash([0xff, 0xfb, 0xea], options.soft);
  }

  return canvas;
}

/** The far coconut palms and hedgerow that close the view. */
function drawTreeLine(canvas, horizon, width, random) {
  const treeCount = Math.round(width / 46);
  const baseColor = mixColors(PADDY_GREEN, SKY_HORIZON, 0.45);

  for (let index = 0; index <= treeCount; index += 1) {
    const x = (index / treeCount) * (width + 40) - 20;
    const height = 14 + random() * 26;
    const trunkWidth = 1.5 + random() * 1.5;

    canvas.rect(x - trunkWidth / 2, horizon - height, x + trunkWidth / 2, horizon, SOIL, 0.5);

    // Fronds fan out from the crown, drooping towards the tips.
    for (let frond = 0; frond < 6; frond += 1) {
      const angle = -Math.PI + (frond / 5) * Math.PI;
      const length = height * (0.5 + random() * 0.3);
      const tipX = x + Math.cos(angle) * length;
      const tipY = horizon - height + Math.sin(angle) * length * 0.42 + length * 0.34;
      canvas.line(x, horizon - height, tipX, tipY, 2.6, baseColor, 0.75);
    }
  }

  // A low band of scrub closes the gap between the palms and the first crop row.
  for (let y = horizon - 6; y < horizon + 4; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const wobble = Math.sin(x * 0.05) * 1.6 + Math.sin(x * 0.013) * 2.4;
      if (y + wobble < horizon + 1) {
        canvas.blend(x, y, mixColors(PADDY_DEEP, SKY_HORIZON, 0.4), 0.55);
      }
    }
  }
}

/**
 * The field itself.
 *
 * Paddy rows run away from the farmer, so they converge on a vanishing point on
 * the horizon rather than stacking into horizontal bands. The ground is filled
 * first and the rows are laid over it as wedges between neighbouring rays, which
 * is what keeps the whole lower half covered right up to the tree line.
 */
function drawFields(canvas, horizon, height, width, random) {
  const vanishingX = width * 0.46;
  const fieldHeight = height - horizon;

  // Base ground, warm and pale at the far end and deeper green in the
  // foreground. The rows below sit on top of it and only need to blend into it.
  for (let y = horizon; y < height; y += 1) {
    const t = (y - horizon) / fieldHeight;
    canvas.rect(
      0,
      y,
      width,
      y,
      mixColors(mixColors(LEAF_LIGHT, PADDY_GREEN, 0.35), PADDY_DEEP, t ** 0.8)
    );
  }

  // Every other ray bounds a crop row; the gaps between them are the flooded
  // strips that mirror the sky. The rays fan out past both edges of the frame
  // so the pattern never stops short.
  const rayStart = -width * 1.6;
  const rayEnd = width * 2.6;
  const rayStep = Math.max(5, width / 150);
  const bundRows = new Set([7, 23]);

  for (let xb = rayStart; xb < rayEnd; xb += rayStep * 2) {
    const nextXb = Math.min(rayEnd, xb + rayStep * 2);
    const rowIndex = Math.round(xb / (rayStep * 2));

    // Two rows out of every eleven are the raised earth bunds that divide one
    // plot from the next.
    const isBund = bundRows.has(((rowIndex % 11) + 11) % 11);
    const isCrop = rowIndex % 2 === 0;

    for (let y = horizon + 1; y < height; y += 1) {
      const t = (y - horizon) / fieldHeight;
      const left = vanishingX + (xb - vanishingX) * t;
      const right = vanishingX + (nextXb - vanishingX) * t;

      let color;
      if (isBund) {
        color = mixColors(SOIL, PADDY_DEEP, t * 0.5);
      } else if (isCrop) {
        color = mixColors(LEAF_LIGHT, PADDY_DEEP, t ** 0.7);
      } else {
        color = mixColors(WATER_SKY, PADDY_GREEN, t * 0.7);
      }

      canvas.rect(left, y, right, y, color, 1);
    }
  }

  drawSeedlings(canvas, horizon, height, width, vanishingX, random);
}

/** A run of rice seedlings standing in the flooded rows. */
function drawSeedlings(canvas, horizon, height, width, vanishingX, random) {
  for (let row = 0; row < 26; row += 1) {
    const t = ((row + 1) / 26) ** 1.6;
    const y = horizon + t * (height - horizon);
    const spacing = Math.max(6, width * 0.012 * (0.3 + t));
    const bladeHeight = 3 + t * 34;
    const left = vanishingX - width * 1.1 * t;
    const right = vanishingX + width * 1.4 * t;

    for (let x = left; x < right; x += spacing) {
      if (random() < 0.35) {
        continue;
      }

      const color = mixColors(LEAF_GREEN, PADDY_DEEP, 0.2 + t * 0.45);
      for (const lean of [-1, 0, 1]) {
        canvas.line(
          x,
          y,
          x + lean * bladeHeight * 0.5,
          y - bladeHeight * (0.65 + random() * 0.5),
          Math.max(1, bladeHeight * 0.14),
          color,
          0.8
        );
      }
    }
  }
}

/**
 * Atmospheric haze.
 *
 * The far end of the field lifts towards the warm light of the sun, which is
 * what stops the converging rows from reading as a flat pattern, and it is
 * applied per row because the strength falls off with distance.
 */
function drawHaze(canvas, horizon, height, width) {
  const haze = [0xff, 0xe4, 0xa8];

  for (let y = horizon; y < height; y += 1) {
    const t = (y - horizon) / (height - horizon);
    const strength = (1 - t) ** 2.4 * 0.5;
    if (strength <= 0.002) {
      continue;
    }

    for (let x = 0; x < width; x += 1) {
      canvas.blend(x, y, haze, strength);
    }
  }
}

/** Sunlight running along the water in the strips, brightest near the sun. */
function drawWaterSheen(canvas, horizon, height, width, sunX) {
  for (let row = 0; row < 90; row += 1) {
    const t = row / 90;
    const y = horizon + (t ** 2.1) * (height - horizon);
    const widthAtRow = width * (0.04 + t * 0.5);
    const offset = Math.sin(t * 9) * width * 0.06;
    const alpha = 0.05 + (1 - t) * 0.16;

    canvas.ellipse(
      sunX + offset,
      y,
      widthAtRow / 2,
      Math.max(1, height * 0.004),
      SUN,
      alpha
    );
  }
}

// ── Category illustrations ──────────────────────────────────────────────────

/**
 * The Marketplace categories each get a flat panel: a pale green field, a warm
 * sun behind it, and one silhouette the farmer can recognise at a glance.
 *
 * They are drawn on a light background because the card underneath them is
 * white, and the dark shapes are what give the header its green.
 */
function drawCategoryPanel(key, width, height) {
  const canvas = new Canvas(width, height);
  const gradient = new Canvas(width, height);

  for (let y = 0; y < height; y += 1) {
    const t = y / height;
    const color = mixColors([0xf2, 0xfa, 0xea], [0xd8, 0xee, 0xc6], t);
    gradient.rect(0, y, width, y, color);
  }
  copyAll(canvas, gradient);

  const horizon = height * 0.58;

  // Warm sun low on the right, matching the light in the hero artwork.
  canvas.glow(width * 0.76, horizon - height * 0.18, height * 0.5, SUN, 0.9);
  canvas.ellipse(width * 0.76, horizon - height * 0.2, height * 0.11, height * 0.11, [
    0xff, 0xdd, 0x8a,
  ]);

  // Flat bands of field beneath the horizon.
  for (let row = 0; row < 5; row += 1) {
    const t = row / 5;
    const y = horizon + (t ** 1.6) * (height - horizon);
    const bandHeight = ((t + 0.16) ** 1.6) * (height - horizon);
    const color = mixColors(LEAF_LIGHT, PADDY_GREEN, 0.25 + t * 0.55);
    canvas.rect(0, y, width, y + bandHeight, color, 0.9);
  }

  const draw = CATEGORY_ART[key];
  draw(canvas, { width, height, horizon });

  return canvas;
}

const CATEGORY_ART = {
  /** 🏞️ Land: a bund running across a plot, with palms on the skyline. */
  land(canvas, { width, height, horizon }) {
    for (let index = 0; index < 5; index += 1) {
      const x = width * (0.1 + index * 0.19);
      const treeHeight = height * (0.2 + (index % 2) * 0.06);
      canvas.rect(x - 2, horizon - treeHeight, x + 2, horizon, mixColors(SOIL, PADDY_DEEP, 0.4));

      for (let frond = 0; frond < 6; frond += 1) {
        const angle = -Math.PI + (frond / 5) * Math.PI;
        const length = treeHeight * 0.6;
        canvas.line(
          x,
          horizon - treeHeight,
          x + Math.cos(angle) * length,
          horizon - treeHeight + Math.sin(angle) * length * 0.45 + length * 0.3,
          3.4,
          PADDY_DEEP,
          0.82
        );
      }
    }

    // Crop lines running to the horizon.
    for (let index = 0; index < 9; index += 1) {
      const startX = width * (index / 8);
      canvas.line(startX * 0.35 + width * 0.15, height, startX, horizon + height * 0.04, 3, PADDY_DEEP, 0.28);
    }
  },

  /** 🚜 Machinery: a tractor in side view, with a wheel behind the engine. */
  machinery(canvas, { width, height, horizon }) {
    const green = PADDY_GREEN;
    const dark = PADDY_DEEP;
    const groundY = height * 0.86;
    const bodyLeft = width * 0.2;
    const bodyRight = width * 0.78;
    const wheelRadius = height * 0.11;

    // Cab, bonnet and rear body.
    canvas.polygon(
      [
        [bodyLeft, groundY - wheelRadius * 1.1],
        [bodyLeft, groundY - wheelRadius * 2.3],
        [bodyLeft + width * 0.14, groundY - wheelRadius * 2.3],
        [bodyLeft + width * 0.2, groundY - wheelRadius * 3.1],
        [bodyLeft + width * 0.33, groundY - wheelRadius * 3.1],
        [bodyLeft + width * 0.33, groundY - wheelRadius * 2.3],
        [bodyRight, groundY - wheelRadius * 2.1],
        [bodyRight, groundY - wheelRadius * 1.1],
      ],
      green
    );

    // Window band, so it reads as a cab and not a box.
    canvas.rect(
      bodyLeft + width * 0.215,
      groundY - wheelRadius * 2.95,
      bodyLeft + width * 0.32,
      groundY - wheelRadius * 2.25,
      [0xff, 0xfd, 0xe6],
      0.9
    );

    // Exhaust and a gold highlight along the bonnet.
    canvas.rect(bodyRight - width * 0.02, groundY - wheelRadius * 2.7, bodyRight - width * 0.005, groundY - wheelRadius * 1.6, dark, 0.9);
    canvas.rect(bodyLeft, groundY - wheelRadius * 1.35, bodyRight, groundY - wheelRadius * 1.15, HARVEST, 0.55);

    // Wheels: a big rear one and a small front one.
    canvas.ellipse(bodyLeft + width * 0.17, groundY - wheelRadius * 0.95, wheelRadius, wheelRadius, dark);
    canvas.ellipse(bodyLeft + width * 0.17, groundY - wheelRadius * 0.95, wheelRadius * 0.42, wheelRadius * 0.42, HARVEST);
    canvas.ellipse(bodyRight - width * 0.06, groundY - wheelRadius * 0.75, wheelRadius * 0.62, wheelRadius * 0.62, dark);
    canvas.ellipse(bodyRight - width * 0.06, groundY - wheelRadius * 0.75, wheelRadius * 0.26, wheelRadius * 0.26, HARVEST);
  },

  /** 🛠️ Tools: a knapsack sprayer with its lance and spray. */
  tools(canvas, { width, height, horizon }) {
    const green = PADDY_GREEN;
    const dark = PADDY_DEEP;
    const groundY = height * 0.88;
    const tankLeft = width * 0.28;
    const tankRight = width * 0.58;
    const tankTop = height * 0.28;
    const tankBottom = groundY - height * 0.05;

    // Tank body with rounded shoulders.
    canvas.ellipse(tankLeft + (tankRight - tankLeft) / 2, tankTop, (tankRight - tankLeft) / 2, height * 0.05, green);
    canvas.rect(tankLeft, tankTop, tankRight, tankBottom, green);
    canvas.ellipse((tankLeft + tankRight) / 2, tankBottom, (tankRight - tankLeft) / 2, height * 0.04, green);
    canvas.rect(tankLeft + width * 0.01, tankTop + height * 0.06, tankRight - width * 0.01, tankTop + height * 0.1, HARVEST, 0.7);

    // Straps over the shoulders.
    canvas.rect(tankLeft + width * 0.02, tankTop, tankLeft + width * 0.045, tankBottom, dark, 0.55);
    canvas.rect(tankRight - width * 0.045, tankTop, tankRight - width * 0.02, tankBottom, dark, 0.55);

    // Lance held out to the right, with a cone of spray.
    canvas.line(width * 0.58, tankTop + height * 0.04, width * 0.8, height * 0.2, 6, dark);
    canvas.polygon(
      [
        [width * 0.8, height * 0.19],
        [width * 0.95, height * 0.1],
        [width * 0.95, height * 0.3],
      ],
      [0xa9, 0xcd, 0x8b],
      0.55
    );

    // A sickle laid across the bottom of the frame.
    canvas.line(width * 0.1, groundY, width * 0.3, height * 0.72, 5, dark, 0.8);
    canvas.ellipse(width * 0.1, groundY - 4, 7, 7, dark, 0.8);
  },

  /** 🌱 Seeds & products: a seed packet with a sprout growing out of it. */
  products(canvas, { width, height, horizon }) {
    const green = PADDY_GREEN;
    const dark = PADDY_DEEP;
    const baseY = height * 0.86;
    const packetLeft = width * 0.34;
    const packetRight = width * 0.62;
    const packetTop = height * 0.42;

    canvas.polygon(
      [
        [packetLeft, baseY],
        [packetLeft, packetTop],
        [(packetLeft + packetRight) / 2, packetTop - height * 0.06],
        [packetRight, packetTop],
        [packetRight, baseY],
      ],
      green
    );

    // The label on the packet, in harvest yellow.
    canvas.rect(
      packetLeft + width * 0.045,
      packetTop + height * 0.1,
      packetRight - width * 0.045,
      baseY - height * 0.1,
      HARVEST,
      0.9
    );
    for (let line = 0; line < 3; line += 1) {
      const y = packetTop + height * 0.16 + line * height * 0.07;
      canvas.rect(
        packetLeft + width * 0.065,
        y,
        packetRight - width * (line === 2 ? 0.12 : 0.065),
        y + height * 0.022,
        dark,
        0.55
      );
    }

    // A sprout out of the top of the packet.
    const stemX = (packetLeft + packetRight) / 2;
    canvas.line(stemX, packetTop - height * 0.02, stemX, height * 0.16, 5, dark);
    canvas.ellipse(stemX - width * 0.035, height * 0.2, width * 0.035, height * 0.05, LEAF_GREEN);
    canvas.ellipse(stemX + width * 0.035, height * 0.26, width * 0.035, height * 0.05, PADDY_LUSH);
  },

  /** 🧪 Fertilizers: an open sack with a scoop of compost in it. */
  fertilizers(canvas, { width, height, horizon }) {
    const green = PADDY_GREEN;
    const dark = PADDY_DEEP;
    const groundY = height * 0.88;
    const sackLeft = width * 0.3;
    const sackRight = width * 0.66;
    const sackTop = height * 0.34;

    canvas.polygon(
      [
        [sackLeft, groundY],
        [sackLeft + width * 0.02, sackTop + height * 0.08],
        [sackLeft + width * 0.08, sackTop],
        [sackRight - width * 0.08, sackTop],
        [sackRight - width * 0.02, sackTop + height * 0.08],
        [sackRight, groundY],
      ],
      green
    );

    // The rolled-down rim, and compost spilling over it.
    canvas.rect(sackLeft + width * 0.07, sackTop - height * 0.02, sackRight - width * 0.07, sackTop + height * 0.04, dark);
    canvas.ellipse((sackLeft + sackRight) / 2, sackTop + height * 0.01, width * 0.13, height * 0.045, SOIL);
    for (let grain = 0; grain < 26; grain += 1) {
      const x = (sackLeft + sackRight) / 2 + (grain % 7 - 3) * width * 0.022;
      const y = sackTop + height * 0.01 + (Math.floor(grain / 7) - 1.5) * height * 0.02;
      canvas.ellipse(x, y, 3.2, 2.4, mixColors(SOIL, HARVEST, (grain % 3) * 0.2));
    }

    // A band of product colour on the sack.
    canvas.rect(sackLeft + width * 0.035, groundY - height * 0.22, sackRight - width * 0.035, groundY - height * 0.14, HARVEST, 0.85);

    // A second, smaller sack behind it, for depth.
    canvas.polygon(
      [
        [width * 0.68, groundY],
        [width * 0.7, groundY - height * 0.3],
        [width * 0.8, groundY - height * 0.34],
        [width * 0.9, groundY - height * 0.28],
        [width * 0.9, groundY],
      ],
      PADDY_LUSH,
      0.85
    );
  },
};

// ── The launch splash icon ──────────────────────────────────────────────────

/**
 * The rice stalk shown on the native splash screen.
 *
 * The splash background is the app's cream, so the icon is drawn on the same
 * cream rather than on transparency: nothing has to be composited at runtime,
 * and the stalk is left breathing room the splash's own `imageWidth` scales.
 */
function drawSplashIcon(size) {
  const canvas = new Canvas(size, size);
  canvas.wash([0xff, 0xfb, 0xea], 1);

  const centre = size / 2;
  const stalkTop = size * 0.14;
  const stalkBase = size * 0.88;
  const headWidth = size * 0.052;

  // The stem.
  canvas.line(centre, stalkTop, centre, stalkBase, size * 0.028, PADDY_GREEN);

  // Leaves curving off the stem, in the fresh green.
  for (const side of [-1, 1]) {
    for (let leaf = 0; leaf < 3; leaf += 1) {
      const y = stalkTop + (0.3 + leaf * 0.17) * (stalkBase - stalkTop);
      const length = size * (0.3 - leaf * 0.045);
      canvas.polygon(
        [
          [centre, y + size * 0.02],
          [centre + side * length, y - size * 0.055],
          [centre + side * length * 0.92, y - size * 0.012],
          [centre, y + size * 0.075],
        ],
        side < 0 ? PADDY_GREEN : LEAF_GREEN
      );
    }
  }

  // The head: grains in harvest yellow, curving over at the tip.
  for (let grain = 0; grain < 11; grain += 1) {
    const t = grain / 10;
    const y = stalkTop + t * size * 0.34;
    const bend = t ** 2 * size * 0.1;
    const offset = Math.sin(t * Math.PI) * headWidth;
    const length = headWidth * (1.05 - t * 0.3);
    const color = t < 0.45 ? HARVEST : mixColors(HARVEST, LEAF_GREEN, (t - 0.45) * 1.4);

    canvas.line(centre + bend, y, centre + bend - offset - length, y - size * 0.018, size * 0.021, color);
    canvas.line(centre + bend, y, centre + bend + offset + length, y - size * 0.018, size * 0.021, color);
  }

  // A soft sun behind the head, so the mark reads as harvest rather than grass.
  canvas.glow(centre + size * 0.16, stalkTop + size * 0.08, size * 0.26, SUN, 0.7);

  return canvas;
}

// ── Colour helpers ──────────────────────────────────────────────────────────

function clamp(value, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}

function smoothstep(edge0, edge1, value) {
  const t = clamp((value - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
}

function mixColors(from, to, amount) {
  const t = clamp(amount);

  return [
    from[0] + (to[0] - from[0]) * t,
    from[1] + (to[1] - from[1]) * t,
    from[2] + (to[2] - from[2]) * t,
  ];
}

/** Copies the whole `source` canvas over `target`. */
function copyAll(target, source) {
  target.pixels.set(source.pixels);
}

// ── PNG encoding ────────────────────────────────────────────────────────────

const CRC_TABLE = (() => {
  const table = new Uint32Array(256);

  for (let n = 0; n < 256; n += 1) {
    let c = n;

    for (let k = 0; k < 8; k += 1) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }

    table[n] = c >>> 0;
  }

  return table;
})();

function crc32(buffer) {
  let crc = 0xffffffff;

  for (const byte of buffer) {
    crc = CRC_TABLE[(crc ^ byte) & 0xff] ^ (crc >>> 8);
  }

  return (crc ^ 0xffffffff) >>> 0;
}

function pngChunk(type, data) {
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length, 0);

  const typeAndData = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(typeAndData), 0);

  return Buffer.concat([length, typeAndData, crc]);
}

/**
 * Encodes the canvas as an 8-bit truecolour PNG. Each scanline is prefixed with
 * filter type 0 (none); the image compresses well enough on its own and keeps
 * the encoder short enough to trust.
 */
function encodePng(canvas) {
  const { width, height, pixels } = canvas;
  const stride = width * 3;
  const raw = Buffer.alloc((stride + 1) * height);

  for (let y = 0; y < height; y += 1) {
    raw[y * (stride + 1)] = 0;
    Buffer.from(pixels.buffer, pixels.byteOffset + y * stride, stride).copy(
      raw,
      y * (stride + 1) + 1
    );
  }

  const header = Buffer.alloc(13);
  header.writeUInt32BE(width, 0);
  header.writeUInt32BE(height, 4);
  header[8] = 8; // bit depth
  header[9] = 2; // colour type: truecolour
  header[10] = 0; // deflate
  header[11] = 0; // adaptive filtering
  header[12] = 0; // no interlace

  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    pngChunk('IHDR', header),
    pngChunk('IDAT', deflateSync(raw, { level: 9 })),
    pngChunk('IEND', Buffer.alloc(0)),
  ]);
}

// ── Entry point ─────────────────────────────────────────────────────────────

function write(name, canvas) {
  const target = join(IMAGES_DIR, name);
  writeFileSync(target, encodePng(canvas));
  console.log(`${name}  ${canvas.width}x${canvas.height}`);
}

mkdirSync(IMAGES_DIR, { recursive: true });

// The hero band. Wide, so it crops well on a phone and fills a tablet. Kept
// below a megapixel in total: it is a background, not a photo gallery, and it
// is decoded on every screen that shows a hero.
write('paddy-field-hero.png', drawPaddyField(1200, 780));

// The page background. The same scene washed well towards cream, so a card is
// still the brightest thing on screen wherever it lands.
write('paddy-field-soft.png', drawPaddyField(760, 1060, { soft: 0.62 }));

// The Marketplace category headers.
for (const key of Object.keys(CATEGORY_ART)) {
  write(`category-${key}.png`, drawCategoryPanel(key, 900, 420));
}

// The native splash mark. Square, on the app's cream, so it needs no alpha.
write('splash-icon.png', drawSplashIcon(512));
