import { mkdirSync, writeFileSync } from 'node:fs';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';

// 1. Load Font (Alice)
console.log('Fetching Alice font...');
const ALICE_TTF = 'https://raw.githubusercontent.com/google/fonts/main/ofl/alice/Alice-Regular.ttf';
const fontResponse = await fetch(ALICE_TTF);
if (!fontResponse.ok) {
  throw new Error(`Failed to fetch font: ${fontResponse.statusText}`);
}
const fontData = await fontResponse.arrayBuffer();
const fonts = [{ name: 'Alice', data: fontData, weight: 400, style: 'normal' }];

// Premium Sunset Clay Palette
const CLAY_LIGHT = '#D46A43'; // Warm sunset orange-clay
const CLAY_DARK = '#5D2A18';  // Deep rich terracotta/burnt umber
const IVORY = '#FAF9F5';      // Elegant off-white cream

/**
 * Render to PNG Buffer using Satori and Resvg
 */
async function renderPNG(element, width, height) {
  const svg = await satori(element, {
    width,
    height,
    fonts,
  });
  const resvg = new Resvg(svg, {
    fitTo: {
      mode: 'width',
      value: width,
    },
  });
  const pngData = resvg.render();
  return pngData.asPng();
}

/**
 * Generates a full composite icon (gradient background + glass overlay + 'm')
 */
async function generateFullIcon(px, { char = 'm' } = {}) {
  const element = {
    type: 'div',
    props: {
      style: {
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: `linear-gradient(135deg, ${CLAY_LIGHT}, ${CLAY_DARK})`,
        padding: `${Math.round(px * 0.08)}px`,
      },
      children: {
        type: 'div',
        props: {
          style: {
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: `${Math.round(px * 0.012)}px solid rgba(250, 249, 245, 0.15)`,
            borderRadius: `${Math.round(px * 0.18)}px`,
            background: 'rgba(250, 249, 245, 0.03)',
          },
          children: {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '60%',
                height: '60%',
                borderRadius: '50%',
                background: 'rgba(250, 249, 245, 0.05)',
                border: `${Math.round(px * 0.002)}px solid rgba(250, 249, 245, 0.05)`,
              },
              children: {
                type: 'div',
                props: {
                  style: {
                    color: IVORY,
                    fontFamily: 'Alice',
                    fontSize: Math.round(px * 0.32),
                    fontWeight: 400,
                    lineHeight: 1,
                    marginTop: -Math.round(px * 0.02),
                  },
                  children: char,
                },
              },
            },
          },
        },
      },
    },
  };
  return await renderPNG(element, px, px);
}

/**
 * Generates the background layer (clay gradient) for adaptive icons
 */
async function generateBackground(px) {
  const element = {
    type: 'div',
    props: {
      style: {
        width: '100%',
        height: '100%',
        display: 'flex',
        background: `linear-gradient(135deg, ${CLAY_LIGHT}, ${CLAY_DARK})`,
      },
    },
  };
  return await renderPNG(element, px, px);
}

/**
 * Generates the foreground layer (glass squircle + 'm') for adaptive icons
 */
async function generateForeground(px, { monochrome = false } = {}) {
  const fgColor = monochrome ? '#FFFFFF' : IVORY;
  const frameOpacity = monochrome ? 0.25 : 0.15;
  const glowOpacity = monochrome ? 0.1 : 0.05;

  // Safe zone: Android adaptive foreground content must scale down to stay within the center 66% safe zone.
  const contentScale = 0.72;

  const element = {
    type: 'div',
    props: {
      style: {
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'transparent',
      },
      children: {
        type: 'div',
        props: {
          style: {
            width: `${contentScale * 100}%`,
            height: `${contentScale * 100}%`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: `${Math.round(px * 0.012)}px solid rgba(250, 249, 245, ${frameOpacity})`,
            borderRadius: `${Math.round(px * 0.18)}px`,
            background: `rgba(250, 249, 245, ${glowOpacity})`,
          },
          children: {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '60%',
                height: '60%',
                borderRadius: '50%',
                background: `rgba(250, 249, 245, ${glowOpacity})`,
                border: `${Math.round(px * 0.002)}px solid rgba(250, 249, 245, ${glowOpacity})`,
              },
              children: {
                type: 'div',
                props: {
                  style: {
                    color: fgColor,
                    fontFamily: 'Alice',
                    fontSize: Math.round(px * 0.32),
                    fontWeight: 400,
                    lineHeight: 1,
                    marginTop: -Math.round(px * 0.02),
                  },
                  children: 'm',
                },
              },
            },
          },
        },
      },
    },
  };
  return await renderPNG(element, px, px);
}

// Ensure assets/images directory exists
const root = new URL('..', import.meta.url);
const imagesDir = new URL('assets/images/', root);
mkdirSync(imagesDir, { recursive: true });

const write = (relPath, buf) => {
  writeFileSync(new URL(relPath, root), buf);
  console.log(`Wrote ${relPath} (${buf.length.toLocaleString()} bytes)`);
};

console.log('Generating premium app icon and assets...');

// 1. iOS / Standard App Icon
write('assets/images/icon.png', await generateFullIcon(1024));

// 2. Android Adaptive Background
write('assets/images/android-icon-background.png', await generateBackground(1024));

// 3. Android Adaptive Foreground
write('assets/images/android-icon-foreground.png', await generateForeground(1024));

// 4. Android Adaptive Monochrome
write('assets/images/android-icon-monochrome.png', await generateForeground(1024, { monochrome: true }));

// 5. Splash Screen Emblem (Full premium tile, scaled to 512x512)
write('assets/images/splash-icon.png', await generateFullIcon(512));

console.log('\n✓ Premium asset set generated successfully!');
