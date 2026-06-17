import { AppText } from '@/src/components/app-text';
import SolarLightbulbBoldDuotoneIcon from '@/src/components/icons/SolarLightbulbBoldDuotoneIcon';
import SafeScreenView from '@/src/components/views/safe-screen';
import { LEVELS_CONFIG } from '@/src/constants';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useHeaderHeight } from 'expo-router/react-navigation';
import { Surface, useToast } from 'heroui-native';
import React, { useState } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { withUniwind } from 'uniwind';
import GameMenu from './menu';
import Controls from './number-pad';

const StyledIonicons = withUniwind(Ionicons);

const MAX_ANSWER_LENGTH = 6;

const puzzleData = {
  equations: [
    { input: 8, output: 72 },
    { input: 2, output: 6 },
    { input: 5, output: 30 },
  ],
  question: 9,
  answer: '90',
  hint: 'Look for a pattern in how each number transforms. Try relating the input to the output using multiplication or addition.',
};

const Equation: React.FC<{
  input: number | string;
  output: string;
  highlight?: boolean;
}> = ({ input, output, highlight }) => (
  <View className="flex-row items-center justify-center gap-4">
    <AppText
      maxFontSizeMultiplier={1.2}
      className="font-display-bold text-4xl text-default-foreground"
    >
      {input}
    </AppText>
    <StyledIonicons
      name="arrow-forward"
      size={22}
      className="text-muted"
    />
    <AppText
      maxFontSizeMultiplier={1.2}
      className={
        highlight
          ? 'font-display-bold text-4xl text-accent'
          : 'font-display-bold text-4xl text-default-foreground'
      }
    >
      {output}
    </AppText>
  </View>
);

const Game: React.FC = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { toast } = useToast();
  const { level } = useLocalSearchParams<{ level: string }>();

  const { HORIZONTAL_PADDING } = LEVELS_CONFIG;
  const headerHeight = useHeaderHeight();

  const [answer, setAnswer] = useState('');
  const hintUsedRef = React.useRef(false);
  const [hintUsed, setHintUsed] = useState(false);

  const handleSubmit = () => {
    router.push({
      pathname: '/levels/game/result',
      params: { level: level ?? '1' },
    });
  };

  const handleRestart = () => {
    setAnswer('');
    hintUsedRef.current = false;
    setHintUsed(false);
  };

  const showHowToPlay = () => {
    toast.show({
      variant: 'default',
      label: 'How to play',
      description:
        'Each example shows how an input becomes an output. Work out the rule, then enter the result for the final number.',
      duration: 5000,
    });
  };

  const showHint = () => {
    if (hintUsedRef.current) return;
    hintUsedRef.current = true;
    setHintUsed(true);

    toast.show({
      variant: 'success',
      label: 'Hint unlocked',
      description: puzzleData.hint,
      icon: <SolarLightbulbBoldDuotoneIcon className="size-8 text-success" />,
      actionLabel: 'Got it',
      duration: 5000,
      onActionPress: ({ hide }) => hide(),
    });
  };

  return (
    <SafeScreenView
      style={{
        flex: 1,
        paddingHorizontal: HORIZONTAL_PADDING,
        paddingTop: Math.max(0, headerHeight - insets.top),
      }}
    >
      <View className="flex-1 gap-2">
        <Surface className="flex-1 justify-center gap-8 bg-surface/50">
          <View className="absolute right-2 top-2 z-10">
            <GameMenu
              onRestart={handleRestart}
              onHowToPlay={showHowToPlay}
              onQuit={() => router.navigate('/levels')}
            />
          </View>

          <View className="items-center gap-1.5">
            <AppText className="text-xs uppercase tracking-widest text-accent">
              Level {level ?? '1'}
            </AppText>
            <AppText className="text-base text-muted">
              Spot the pattern, solve for the missing value
            </AppText>
          </View>

          <View className="gap-4">
            {puzzleData.equations.map((eq, idx) => (
              <Equation key={idx} input={eq.input} output={String(eq.output)} />
            ))}

            <View className="my-1 h-px self-center w-24 bg-default" />

            <Equation
              input={puzzleData.question}
              output={answer || '?'}
              highlight
            />
          </View>
        </Surface>

        <Surface className="bg-surface/50 p-2.5">
          <Controls
            value={answer}
            hintUsed={hintUsed}
            onHint={showHint}
            onSubmit={handleSubmit}
            onClear={() => setAnswer('')}
            onBackspace={() => setAnswer((p) => p.slice(0, -1))}
            onPressNumber={(d) =>
              setAnswer((p) =>
                p.length >= MAX_ANSWER_LENGTH ? p : p === '0' ? d : p + d
              )
            }
          />
        </Surface>
      </View>
    </SafeScreenView>
  );
};

export default Game;
