import { AppText } from '@/src/components/app-text';
import { LevelItem } from '@/src/components/levels/elements';
import { RatingStars } from '@/src/components/levels/rating-stars';
import SafeScreenView from '@/src/components/views/safe-screen';
import { LEVELS_CONFIG } from '@/src/constants';
import { useRouter } from 'expo-router';
import { useHeaderHeight } from 'expo-router/react-navigation';
import React from 'react';
import { FlatList, useWindowDimensions, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Level = {
  id: number;
  locked: boolean;
  stars: number;
};

const LevelSelect: React.FC = () => {
  const {
    ROW_GAP,
    COLUMN_GAP,
    NUM_COLUMNS,
    TOTAL_LEVELS,
    HORIZONTAL_PADDING,
  } = LEVELS_CONFIG;

  const router = useRouter();
  const headerHeight = useHeaderHeight();
  const insets = useSafeAreaInsets();
  const { width: windowWidth } = useWindowDimensions();

  const itemWidth = React.useMemo(() => {
    const totalGaps = COLUMN_GAP * (NUM_COLUMNS - 1);
    const available = windowWidth - HORIZONTAL_PADDING * 2 - totalGaps;
    return Math.floor(available / NUM_COLUMNS);
  }, [COLUMN_GAP, NUM_COLUMNS, windowWidth, HORIZONTAL_PADDING]);

  // Demo progress: level 1 cleared, level 2 unlocked & playable, rest locked.
  const levels = React.useMemo<Level[]>(
    () =>
      Array.from({ length: TOTAL_LEVELS }).map((_, idx) => {
        const id = idx + 1;
        return {
          id,
          locked: id > 2,
          stars: id === 1 ? 3 : 0,
        };
      }),
    [TOTAL_LEVELS]
  );

  const currentId = React.useMemo(
    () => levels.find((lvl) => !lvl.locked && lvl.stars === 0)?.id,
    [levels]
  );

  const completed = levels.filter((lvl) => lvl.stars > 0).length;
  const totalStars = levels.reduce((sum, lvl) => sum + lvl.stars, 0);

  return (
    <SafeScreenView
      style={{
        flex: 1,
        paddingTop: Math.max(0, headerHeight - insets.top),
        paddingHorizontal: HORIZONTAL_PADDING,
      }}
    >
      <FlatList
        data={levels}
        numColumns={NUM_COLUMNS}
        keyExtractor={(item) => String(item.id)}
        showsVerticalScrollIndicator={false}
        columnWrapperStyle={{ gap: COLUMN_GAP, marginBottom: ROW_GAP }}
        contentContainerStyle={{ paddingBottom: insets.bottom + 16 }}
        ListHeaderComponent={
          <View className="mb-4 mt-1 gap-3 px-1">
            <AppText
              maxFontSizeMultiplier={1.3}
              className="font-display-bold text-3xl text-default-foreground"
            >
              Levels
            </AppText>
            <View className="flex-row items-center justify-between rounded-2xl bg-surface/60 px-4 py-3">
              <View>
                <AppText className="text-xs text-muted">Completed</AppText>
                <AppText className="font-display-semibold text-lg text-default-foreground">
                  {completed}
                  <AppText className="text-base text-muted"> / {TOTAL_LEVELS}</AppText>
                </AppText>
              </View>
              <View className="items-end gap-1">
                <AppText className="text-xs text-muted">Stars earned</AppText>
                <View className="flex-row items-center gap-1.5">
                  <RatingStars filled={1} count={1} starClassName="size-4" />
                  <AppText className="font-display-semibold text-lg text-default-foreground">
                    {totalStars}
                  </AppText>
                </View>
              </View>
            </View>
          </View>
        }
        renderItem={({ item, index }) => (
          <Animated.View entering={FadeInDown.duration(280).delay(index * 35)}>
            <LevelItem
              id={item.id}
              locked={item.locked}
              stars={item.stars}
              current={item.id === currentId}
              width={itemWidth}
              onPress={() => router.push(`/levels/game/${String(item.id)}`)}
            />
          </Animated.View>
        )}
      />
    </SafeScreenView>
  );
};

export default LevelSelect;
