import { AppText } from '@/src/components/app-text';
import SolarLightbulbBoldDuotoneIcon from '@/src/components/icons/SolarLightbulbBoldDuotoneIcon';
import { Ionicons } from '@expo/vector-icons';
import { Button, cn } from 'heroui-native';
import React from 'react';
import { View } from 'react-native';
import { withUniwind } from 'uniwind';

const StyledIonicons = withUniwind(Ionicons);

type ControlsProps = {
  value?: string;
  onPressNumber?: (digit: string) => void;
  onBackspace?: () => void;
  onClear?: () => void;
  onSubmit?: () => void;
  onHint?: () => void;
  hintUsed?: boolean;
};

const DIGIT_ROWS = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9'],
];

const KEY_CLASS = 'flex-1 h-14 rounded-2xl items-center justify-center';

/**
 * Answer display tile + numeric keypad.
 * Rows: 1-9, then [hint] [0] [backspace], with a full-width ENTER below.
 */
const Controls: React.FC<ControlsProps> = React.memo(
  ({
    value = '',
    onPressNumber,
    onBackspace,
    onClear,
    onSubmit,
    onHint,
    hintUsed = false,
  }) => {
    return (
      <View className="w-full gap-2">
        {/* Answer display */}
        <View className="h-16 flex-row items-center justify-between rounded-2xl bg-default px-5">
          <AppText className="text-sm text-muted">Your answer</AppText>
          <View className="flex-row items-center gap-3">
            <AppText
              maxFontSizeMultiplier={1.2}
              className={cn(
                'font-display-bold text-3xl',
                value ? 'text-default-foreground' : 'text-default-foreground/30'
              )}
            >
              {value || '—'}
            </AppText>
            {!!value && (
              <Button
                isIconOnly
                size="sm"
                variant="ghost"
                onPress={onClear}
                className="rounded-full"
              >
                <StyledIonicons name="close" size={16} className="text-muted" />
              </Button>
            )}
          </View>
        </View>

        {/* Digit rows */}
        {DIGIT_ROWS.map((row) => (
          <View key={row.join('')} className="flex-row gap-2">
            {row.map((digit) => (
              <Button
                key={digit}
                variant="tertiary"
                onPress={() => onPressNumber?.(digit)}
                className={KEY_CLASS}
              >
                <Button.Label className="font-display-semibold text-2xl text-default-foreground">
                  {digit}
                </Button.Label>
              </Button>
            ))}
          </View>
        ))}

        {/* Hint · 0 · Backspace */}
        <View className="flex-row gap-2">
          <Button
            variant="tertiary"
            onPress={onHint}
            isDisabled={hintUsed}
            className={KEY_CLASS}
          >
            <SolarLightbulbBoldDuotoneIcon
              className={cn(
                'size-6',
                hintUsed ? 'text-default-foreground/30' : 'text-warning'
              )}
            />
          </Button>
          <Button
            variant="tertiary"
            onPress={() => onPressNumber?.('0')}
            className={KEY_CLASS}
          >
            <Button.Label className="font-display-semibold text-2xl text-default-foreground">
              0
            </Button.Label>
          </Button>
          <Button
            variant="tertiary"
            onPress={onBackspace}
            className={KEY_CLASS}
          >
            <StyledIonicons
              name="backspace-outline"
              size={22}
              className="text-default-foreground"
            />
          </Button>
        </View>

        {/* Submit */}
        <Button
          variant="primary"
          onPress={onSubmit}
          isDisabled={!value}
          className="h-14 rounded-2xl"
        >
          <Button.Label className="font-display-semibold tracking-wider">
            ENTER
          </Button.Label>
        </Button>
      </View>
    );
  }
);

Controls.displayName = 'Controls';

export default Controls;
