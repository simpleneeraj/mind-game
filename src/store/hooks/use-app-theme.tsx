import { ColorScheme } from '@/src/typings/enums';
import { useAtom } from 'jotai';
import { useCallback, useMemo } from 'react';
import { Uniwind, useUniwind } from 'uniwind';
import { themeAtom } from '../atoms/theme';

type ThemePreference = ColorScheme | 'system';

export const useAppTheme = () => {
  const { theme: resolvedTheme, hasAdaptiveThemes } = useUniwind();
  // themeAtom stores the user's preference (ColorScheme or 'system')
  const [t, setThemeAtom] = useAtom(themeAtom as any as any); // keep any if atom typing differs

  // normalize atom value to ThemePreference (fallback to light)
  const pref: ThemePreference =
    t === 'system' || t === ColorScheme.Dark || t === ColorScheme.Light
      ? (t as ThemePreference)
      : ColorScheme.Light;

  // If user preference is 'system' and runtime supports adaptive themes,
  // effectiveTheme should be the resolved theme from Uniwind (which is 'dark'|'light').
  // Otherwise use the user preference.
  const effectiveTheme = useMemo(() => {
    if (pref === 'system' && hasAdaptiveThemes) {
      // resolvedTheme comes from useUniwind and should be 'light' | 'dark' (guard just in case)
      return resolvedTheme === ColorScheme.Dark
        ? ColorScheme.Dark
        : ColorScheme.Light;
    }
    return pref === 'system' ? ColorScheme.Light : pref; // if system not supported, fallback to light
  }, [pref, hasAdaptiveThemes, resolvedTheme]);

  const isDark = effectiveTheme === ColorScheme.Dark;
  const isLight = !isDark;

  const setTheme = useCallback(
    async (newTheme: ThemePreference) => {
      // update Uniwind first (if available), then atom
      try {
        // Uniwind.setTheme may accept 'system' or 'dark'|'light' depending on your runtime
        // pass through the value and let Uniwind handle it (use optional chaining)
        // cast to any to avoid typing mismatch
        await (Uniwind as any)?.setTheme?.(newTheme);
      } catch {
        // ignore Uniwind errors
      }
      // persist user preference in atom (store 'system' when requested)
      setThemeAtom(newTheme as any);
    },
    [setThemeAtom]
  );

  const toggleTheme = useCallback(() => {
    // toggle using the effective theme (not necessarily the preference)
    const currently = effectiveTheme;
    const next =
      currently === ColorScheme.Light ? ColorScheme.Dark : ColorScheme.Light;
    // store the explicit next theme (not 'system')
    setTheme(next);
  }, [effectiveTheme, setTheme]);

  // currentTheme returns the user's preference when 'system' is set, otherwise the active theme
  const currentTheme: ThemePreference | ColorScheme =
    pref === 'system' ? 'system' : effectiveTheme;

  return {
    currentTheme,
    isDark,
    isLight,
    setTheme,
    toggleTheme,
  };
};
