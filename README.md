# mind-game

A pattern-puzzle mobile game built with **React Native (Expo)** and [HeroUI Native](https://github.com/heroui-inc/heroui-native). Players study a few input → output examples, work out the hidden rule, and solve for the missing value.

## Features

- **Levels grid** — progress, earned stars, and the next playable level highlighted.
- **Puzzle screen** — pattern equations with a live answer, hint, and a custom numeric keypad.
- **Result screen** — animated trophy, star rating, run stats, and confetti on a perfect score.
- Space Grotesk display font for numbers, Inter for body text, light/dark theming.

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

File-based routing with Expo Router. The game lives under `src/app/(home)/levels`.

## Tech

- Expo Router · React Native
- HeroUI Native (Uniwind / Tailwind for React Native)
- React Native Reanimated · Lottie
