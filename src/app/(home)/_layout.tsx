import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useThemeColor } from 'heroui-native';
import { View } from 'react-native';
import { ThemeToggle } from '../../components/theme-toggle';
import { useAppTheme } from '../../contexts/app-theme-context';

export default function Layout() {
  const { isDark } = useAppTheme();
  const [foreground, background] = useThemeColor(['foreground', 'background']);

  return (
    <View className="flex-1 bg-background">
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerTitleAlign: 'center',
          headerShadowVisible: false,
          headerStyle: { backgroundColor: background },
          headerTintColor: foreground,
          headerTitleStyle: { fontFamily: 'Alice_400Regular', fontSize: 18 },
          headerBackButtonDisplayMode: 'minimal',
          contentStyle: { backgroundColor: background },
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen
          name="levels/index"
          options={{ title: 'Levels', headerRight: () => <ThemeToggle /> }}
        />
        <Stack.Screen name="levels/game/[level]" options={{ title: 'Level' }} />
        <Stack.Screen
          name="levels/game/result/index"
          options={{ headerShown: false, gestureEnabled: false }}
        />
        <Stack.Screen name="settings" options={{ title: 'Settings' }} />
        <Stack.Screen
          name="how-to-play"
          options={{ title: 'How to Play', presentation: 'modal' }}
        />
      </Stack>
    </View>
  );
}
