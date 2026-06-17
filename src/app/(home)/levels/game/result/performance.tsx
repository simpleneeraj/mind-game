import { AppText } from '@/src/components/app-text';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { View } from 'react-native';
import { withUniwind } from 'uniwind';

const StyledIonicons = withUniwind(Ionicons);

type IconName = React.ComponentProps<typeof Ionicons>['name'];

type StatsGridProps = {
  timeSpent?: number;
  accuracy?: number;
  coinsEarned?: number;
  xpEarned?: number;
};

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
};

/** Four-tile summary of the run shown on the result screen. */
const StatsGrid: React.FC<StatsGridProps> = ({
  timeSpent = 0,
  accuracy = 100,
  coinsEarned = 0,
  xpEarned = 0,
}) => {
  const stats: { icon: IconName; label: string; value: string; tint: string }[] =
    [
      { icon: 'time-outline', label: 'Time', value: formatTime(timeSpent), tint: 'text-accent' },
      { icon: 'locate-outline', label: 'Accuracy', value: `${Math.round(accuracy)}%`, tint: 'text-success' },
      { icon: 'server-outline', label: 'Coins', value: `+${coinsEarned}`, tint: 'text-warning' },
      { icon: 'flash-outline', label: 'XP', value: `+${xpEarned}`, tint: 'text-violet-400' },
    ];

  return (
    <View className="flex-row gap-2">
      {stats.map((stat) => (
        <View
          key={stat.label}
          className="flex-1 items-center gap-1 rounded-2xl bg-default py-3"
        >
          <StyledIonicons name={stat.icon} size={22} className={stat.tint} />
          <AppText className="text-xs text-muted">{stat.label}</AppText>
          <AppText className="font-mono-medium text-sm text-default-foreground">
            {stat.value}
          </AppText>
        </View>
      ))}
    </View>
  );
};

export default StatsGrid;
