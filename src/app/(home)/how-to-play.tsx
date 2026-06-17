import { AppText } from '@/src/components/app-text';
import SafeScreenView from '@/src/components/views/safe-screen';
import { Ionicons } from '@expo/vector-icons';
import { Surface } from 'heroui-native';
import React from 'react';
import { ScrollView, View } from 'react-native';
import { withUniwind } from 'uniwind';

const StyledIonicons = withUniwind(Ionicons);
type IconName = React.ComponentProps<typeof Ionicons>['name'];

const STEPS: { icon: IconName; title: string; body: string }[] = [
  {
    icon: 'eye-outline',
    title: 'Study the examples',
    body: 'Each level shows a few examples of how an input number turns into an output number.',
  },
  {
    icon: 'bulb-outline',
    title: 'Find the hidden rule',
    body: 'Work out the single operation that transforms every input into its output.',
  },
  {
    icon: 'calculator-outline',
    title: 'Solve the last one',
    body: 'Apply the rule to the final number and type your answer on the keypad.',
  },
  {
    icon: 'star-outline',
    title: 'Earn up to 3 stars',
    body: 'Solve it first try without a hint for a perfect score. Hints and wrong guesses cost stars.',
  },
];

export default function HowToPlay() {
  return (
    <SafeScreenView edges={['bottom']} style={{ flex: 1, paddingHorizontal: 16 }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Surface className="my-4 gap-3 bg-surface/60">
          <AppText className="text-center text-xs uppercase tracking-widest text-accent">
            Example
          </AppText>
          <View className="gap-1">
            <AppText className="text-center font-mono-bold text-2xl text-default-foreground">
              2 → 6
            </AppText>
            <AppText className="text-center font-mono-bold text-2xl text-default-foreground">
              5 → 30
            </AppText>
            <AppText className="text-center font-mono-bold text-2xl text-accent">
              8 → ?
            </AppText>
          </View>
          <AppText className="text-center text-sm text-muted">
            The rule is “multiply the number by the next one”. So 8 → 72.
          </AppText>
        </Surface>

        <View className="gap-3 pb-6">
          {STEPS.map((step, idx) => (
            <View key={step.title} className="flex-row gap-3">
              <View className="size-10 items-center justify-center rounded-2xl bg-accent/15">
                <StyledIonicons
                  name={step.icon}
                  size={20}
                  className="text-accent"
                />
              </View>
              <View className="flex-1">
                <AppText className="text-base text-default-foreground">
                  {idx + 1}. {step.title}
                </AppText>
                <AppText className="text-sm text-muted">{step.body}</AppText>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeScreenView>
  );
}
