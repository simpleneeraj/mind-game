import SafeScreenView from '@/src/components/views/safe-screen';
import React from 'react';
import { Text, View, ViewProps } from 'react-native';

type SafeAreaProps = ViewProps & {};

const SafeAreaTest: React.FC<SafeAreaProps> = ({}) => {
  //   const he = useHeaderHeight();
  return (
    <SafeScreenView className="bg-default">
      <View className="flex-1 border border-accent">
        <Text>Hello </Text>
      </View>
    </SafeScreenView>
  );
};

export default SafeAreaTest;
