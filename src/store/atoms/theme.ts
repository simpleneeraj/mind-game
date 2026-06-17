import { ColorScheme } from '@/src/typings/enums';
import { atom } from 'jotai';
import { Uniwind } from 'uniwind';

// attempt to read existing Uniwind theme if available
function getInitialTheme(): ColorScheme {
  const maybe = Uniwind?.currentTheme;
  if (maybe?.includes(ColorScheme.Dark)) {
    return ColorScheme.Dark;
  }
  return ColorScheme.Light;
}

export const themeAtom = atom<ColorScheme>(getInitialTheme());
