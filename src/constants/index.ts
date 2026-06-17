import { GameTab } from '../typings/enums';

export const LEVELS_CONFIG = {
  DURATION: 200,

  // layout + count
  NUM_COLUMNS: 3,
  TOTAL_LEVELS: 30,

  // spacing
  HORIZONTAL_PADDING: 8,
  COLUMN_GAP: 8,
  ROW_GAP: 8,
} as const;

export const LEVELS_TABS: { key: GameTab; label: string }[] = [
  { key: GameTab.Levels, label: 'Levels' },
  { key: GameTab.Practice, label: 'Practice' },
  { key: GameTab.Daily, label: 'Daily' },
  { key: GameTab.Progress, label: 'Progress' },
];
