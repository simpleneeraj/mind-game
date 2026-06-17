import { TOTAL_LEVELS } from '@/src/data/puzzles';
import { useAtom } from 'jotai';
import { useCallback, useMemo } from 'react';
import { progressAtom, type ProgressMap } from '../atoms/progress';

export const useProgress = () => {
  const [progressState, setProgress] = useAtom(progressAtom);
  // `getOnInit` guarantees a synchronous value; the Promise in the type is spurious.
  const progress = progressState as ProgressMap;

  const starsFor = useCallback(
    (level: number) => progress[String(level)] ?? 0,
    [progress]
  );

  const isCompleted = useCallback(
    (level: number) => starsFor(level) > 0,
    [starsFor]
  );

  const isUnlocked = useCallback(
    (level: number) => level === 1 || isCompleted(level - 1),
    [isCompleted]
  );

  const recordStars = useCallback(
    (level: number, stars: number) => {
      setProgress((prev) => {
        const map = prev as ProgressMap;
        return {
          ...map,
          [String(level)]: Math.max(map[String(level)] ?? 0, stars),
        };
      });
    },
    [setProgress]
  );

  const reset = useCallback(() => setProgress({}), [setProgress]);

  const totalStars = useMemo(
    () => Object.values(progress).reduce((sum, value) => sum + value, 0),
    [progress]
  );

  const completedCount = useMemo(
    () => Object.values(progress).filter((value) => value > 0).length,
    [progress]
  );

  /** Lowest level that hasn't been cleared yet (capped at the last level). */
  const nextLevel = useMemo(() => {
    for (let level = 1; level <= TOTAL_LEVELS; level += 1) {
      if ((progress[String(level)] ?? 0) === 0) return level;
    }
    return TOTAL_LEVELS;
  }, [progress]);

  const hasStarted = completedCount > 0;

  return {
    progress,
    starsFor,
    isCompleted,
    isUnlocked,
    recordStars,
    reset,
    totalStars,
    completedCount,
    nextLevel,
    hasStarted,
  };
};
