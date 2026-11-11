/**
 * Reports the average colour and brightness of each band of a generated PNG.
 *
 * The artwork in this project is drawn by `generate-paddy-art.mjs` rather than
 * hand-drawn, so there is nothing to look at when a band comes out the wrong
 * shade. This prints the numbers instead: a green field should read as green,
 * the sky as warm and pale, and no band should collapse to a single flat
 * colour, which is what an empty region of the drawing would look like.
 *
 *   node scripts/check-paddy-art.mjs
 */

import { readFileSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { inflateSync } from 'node:zlib';
import { fileURLToPath } from 'node:url';

const IMAGES_DIR = join(dirname(fileURLToPath(import.meta.url)), '..', 'assets', 'images');

/** Walks the PNG chunks far enough to read IHDR and the filtered scanlines. */
function decodePng(buffer) {
  if (buffer.readUInt32BE(0) !== 0x89504e47) {
    throw new Error('not a PNG');
  }

  let offset = 8;
  let width = 0;
  let height = 0;
  const idat = [];

  while (offset < buffer.length) {
    const length = buffer.readUInt32BE(offset);
    const type = buffer.toString('ascii', offset + 4, offset + 8);
    const data = buffer.subarray(offset + 8, offset + 8 + length);

    if (type === 'IHDR') {
      width = data.readUInt32BE(0);
      height = data.readUInt32BE(4);
      if (data[8] !== 8 || data[9] !== 2) {
        throw new Error(`unexpected pixel format: depth ${data[8]}, type ${data[9]}`);
      }
    } else if (type === 'IDAT') {
      idat.push(data);
    } else if (type === 'IEND') {
      break;
    }

    offset += 12 + length;
  }

  const raw = inflateSync(Buffer.concat(idat));
  const stride = width * 3;
  const pixels = new Uint8Array(width * height * 3);

  // Undo the per-scanline filters. Only the four the encoder can emit are
  // handled, which is all a PNG written by our own encoder can contain.
  for (let y = 0; y < height; y += 1) {
    const filter = raw[y * (stride + 1)];
    const line = raw.subarray(y * (stride + 1) + 1, y * (stride + 1) + 1 + stride);

    for (let x = 0; x < stride; x += 1) {
      const left = x >= 3 ? pixels[y * stride + x - 3] : 0;
      const up = y > 0 ? pixels[(y - 1) * stride + x] : 0;
      const upLeft = y > 0 && x >= 3 ? pixels[(y - 1) * stride + x - 3] : 0;
      let value = line[x];

      if (filter === 1) {
        value += left;
      } else if (filter === 2) {
        value += up;
      } else if (filter === 3) {
        value += (left + up) >> 1;
      } else if (filter === 4) {
        const estimate = left + up - upLeft;
        const toLeft = Math.abs(estimate - left);
        const toUp = Math.abs(estimate - up);
        const toUpLeft = Math.abs(estimate - upLeft);
        const nearest = toLeft <= toUp && toLeft <= toUpLeft ? left : toUp <= toUpLeft ? up : upLeft;
        value += nearest;
      }

      pixels[y * stride + x] = value & 0xff;
    }
  }

  return { width, height, pixels };
}

/** Average colour and the spread between the lightest and darkest pixel. */
function summarise(image, x0, y0, x1, y1) {
  let r = 0;
  let g = 0;
  let b = 0;
  let count = 0;
  let darkest = 255;
  let lightest = 0;

  for (let y = y0; y < y1; y += 1) {
    for (let x = x0; x < x1; x += 1) {
      const offset = (y * image.width + x) * 3;
      r += image.pixels[offset];
      g += image.pixels[offset + 1];
      b += image.pixels[offset + 2];
      count += 1;

      const luminance =
        (image.pixels[offset] * 299 +
          image.pixels[offset + 1] * 587 +
          image.pixels[offset + 2] * 114) /
        1000;
      darkest = Math.min(darkest, luminance);
      lightest = Math.max(lightest, luminance);
    }
  }

  return {
    r: Math.round(r / count),
    g: Math.round(g / count),
    b: Math.round(b / count),
    spread: Math.round(lightest - darkest),
  };
}

const toHex = ({ r, g, b }) =>
  `#${[r, g, b].map((value) => value.toString(16).padStart(2, '0')).join('')}`;

/** Only the files this project's generator writes; the rest are stock assets. */
const GENERATED = /^paddy-field-|^category-/;

for (const name of readdirSync(IMAGES_DIR)
  .filter((file) => GENERATED.test(file))
  .sort()) {
  const image = decodePng(readFileSync(join(IMAGES_DIR, name)));
  const bands = 5;

  console.log(`\n${name}  ${image.width}x${image.height}`);

  for (let band = 0; band < bands; band += 1) {
    const y0 = Math.floor((band / bands) * image.height);
    const y1 = Math.floor(((band + 1) / bands) * image.height);
    const stats = summarise(image, 0, y0, image.width, y1);
    console.log(
      `  rows ${String(y0).padStart(4)}-${String(y1).padStart(4)}  ${toHex(stats)}  spread ${String(stats.spread).padStart(3)}`
    );
  }
}
