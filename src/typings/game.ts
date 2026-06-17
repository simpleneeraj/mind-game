import { StatKey } from './enums';

export type StatItem = {
  key: StatKey;
  label: string;
  icon: string;
  bg: string;
  value: string | number;
};
