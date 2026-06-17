import { AppText } from '@/src/components/app-text';
import SafeScreenView from '@/src/components/views/safe-screen';
import { useAppTheme } from '@/src/contexts/app-theme-context';
import { useProgress } from '@/src/store/hooks/use-progress';
import { useSettings } from '@/src/store/hooks/use-settings';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { PressableFeedback, Surface, Switch } from 'heroui-native';
import React from 'react';
import { Alert, ScrollView, View } from 'react-native';
import { withUniwind } from 'uniwind';

const StyledIonicons = withUniwind(Ionicons);
type IconName = React.ComponentProps<typeof Ionicons>['name'];

const Row: React.FC<{
  icon: IconName;
  label: string;
  description?: string;
  children?: React.ReactNode;
  onPress?: () => void;
  tint?: string;
}> = ({ icon, label, description, children, onPress, tint = 'text-foreground' }) => {
  const content = (
    <View className="flex-row items-center gap-3 py-3">
      <View className="size-9 items-center justify-center rounded-xl bg-default">
        <StyledIonicons name={icon} size={18} className={tint} />
      </View>
      <View className="flex-1">
        <AppText className="text-base text-default-foreground">{label}</AppText>
        {!!description && (
          <AppText className="text-xs text-muted">{description}</AppText>
        )}
      </View>
      {children}
    </View>
  );

  return onPress ? (
    <PressableFeedback onPress={onPress}>{content}</PressableFeedback>
  ) : (
    content
  );
};

const SectionLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AppText className="mb-1 ml-1 mt-4 text-xs uppercase tracking-wider text-muted">
    {children}
  </AppText>
);

export default function Settings() {
  const router = useRouter();
  const { settings, toggle } = useSettings();
  const { isDark, toggleTheme } = useAppTheme();
  const { reset, totalStars, completedCount } = useProgress();

  const confirmReset = () => {
    Alert.alert(
      'Reset progress?',
      'This clears all stars and locks every level except the first. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Reset', style: 'destructive', onPress: () => reset() },
      ]
    );
  };

  return (
    <SafeScreenView
      edges={['bottom']}
      style={{ flex: 1, paddingHorizontal: 16 }}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <SectionLabel>Preferences</SectionLabel>
        <Surface className="bg-surface/60">
          <Row icon="phone-portrait-outline" label="Haptics" description="Vibrations on taps and answers">
            <Switch
              isSelected={settings.haptics}
              onSelectedChange={() => toggle('haptics')}
            />
          </Row>
          <View className="h-px bg-default" />
          <Row icon="volume-high-outline" label="Sound" description="Sound effects">
            <Switch
              isSelected={settings.sound}
              onSelectedChange={() => toggle('sound')}
            />
          </Row>
        </Surface>

        <SectionLabel>Appearance</SectionLabel>
        <Surface className="bg-surface/60">
          <Row icon="moon-outline" label="Dark mode">
            <Switch isSelected={isDark} onSelectedChange={() => toggleTheme()} />
          </Row>
        </Surface>

        <SectionLabel>Game</SectionLabel>
        <Surface className="bg-surface/60">
          <Row
            icon="trophy-outline"
            label="Your progress"
            description={`${completedCount} levels cleared · ${totalStars} stars`}
            tint="text-warning"
          />
          <View className="h-px bg-default" />
          <Row
            icon="help-circle-outline"
            label="How to play"
            onPress={() => router.push('/how-to-play')}
          >
            <StyledIonicons
              name="chevron-forward"
              size={18}
              className="text-muted"
            />
          </Row>
        </Surface>

        <View className="mt-4">
          <Surface className="bg-surface/60">
            <Row
              icon="trash-outline"
              label="Reset progress"
              description="Clear all stars and unlocked levels"
              tint="text-danger"
              onPress={confirmReset}
            />
          </Surface>
        </View>

        <AppText className="mt-6 text-center text-xs text-muted">
          Mind Puzzle · v1.0.0
        </AppText>
      </ScrollView>
    </SafeScreenView>
  );
}
