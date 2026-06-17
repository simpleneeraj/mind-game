import { mkdirSync, writeFileSync } from 'node:fs';
import { Buffer } from 'node:buffer';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';

// satori always requires a font, even when we render no text.
console.log('Fetching Alice font...');
const ALICE_TTF =
  'https://raw.githubusercontent.com/google/fonts/main/ofl/alice/Alice-Regular.ttf';
const fontResponse = await fetch(ALICE_TTF);
if (!fontResponse.ok) {
  throw new Error(`Failed to fetch font: ${fontResponse.statusText}`);
}
const fontData = await fontResponse.arrayBuffer();
const fonts = [{ name: 'Alice', data: fontData, weight: 400, style: 'normal' }];

// Goodreads-inspired palette — warm cream + dark brown. Flat, no gradients.
const CREAM = '#F4F1EA'; // Goodreads tan/cream background
const BROWN = '#382110'; // Goodreads dark brown

// Bold lightbulb glyph — the app's motif for "spot the hidden pattern".
const BULB_PATH =
  'M12 2C8.13 2 5 5.13 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.87-3.13-7-7-7zm-3 18c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1z';

const bulbDataUri = (color) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="${color}" d="${BULB_PATH}"/></svg>`;
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
};

/** Render a satori element tree to a PNG Buffer. */
async function renderPNG(element, width, height) {
  const svg = await satori(element, { width, height, fonts });
  const resvg = new Resvg(svg, { fitTo: { mode: 'width', value: width } });
  return resvg.render().asPng();
}

/** A centered lightbulb on a (optionally transparent) flat background. */
function canvas(px, { background = 'transparent', color = BROWN, scale = 0.52 } = {}) {
  return {
    type: 'div',
    props: {
      style: {
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background,
      },
      children: {
        type: 'img',
        props: {
          src: bulbDataUri(color),
          width: Math.round(px * scale),
          height: Math.round(px * scale),
        },
      },
    },
  };
}

/** Full app icon: flat cream background + brown lightbulb. */
async function generateFullIcon(px) {
  return renderPNG(canvas(px, { background: CREAM, color: BROWN, scale: 0.52 }), px, px);
}

/** Adaptive background layer (flat cream). */
async function generateBackground(px) {
  const element = {
    type: 'div',
    props: { style: { width: '100%', height: '100%', display: 'flex', background: CREAM } },
  };
  return renderPNG(element, px, px);
}

/**
 * Adaptive foreground layer (transparent + brown bulb).
 * Kept inside the center ~66% safe zone Android may crop to.
 */
async function generateForeground(px, { monochrome = false } = {}) {
  const color = monochrome ? '#FFFFFF' : BROWN;
  return renderPNG(canvas(px, { background: 'transparent', color, scale: 0.46 }), px, px);
}

// Ensure assets/images directory exists
const root = new URL('..', import.meta.url);
const imagesDir = new URL('assets/images/', root);
mkdirSync(imagesDir, { recursive: true });

const write = (relPath, buf) => {
  writeFileSync(new URL(relPath, root), buf);
  console.log(`Wrote ${relPath} (${buf.length.toLocaleString()} bytes)`);
};

console.log('Generating simple Goodreads-inspired app icon and assets...');

write('assets/images/icon.png', await generateFullIcon(1024));
write('assets/images/android-icon-background.png', await generateBackground(1024));
write('assets/images/android-icon-foreground.png', await generateForeground(1024));
write(
  'assets/images/android-icon-monochrome.png',
  await generateForeground(1024, { monochrome: true })
);
write('assets/images/splash-icon.png', await generateFullIcon(512));

console.log('\n✓ Asset set generated successfully!');
