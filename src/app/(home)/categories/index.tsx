import { AppText } from '@/src/components/app-text';
import { ScreenScrollView } from '@/src/components/screen-scroll-view';
import React from 'react';
import { View } from 'react-native';

type CategoriesProps = {};

const Categories: React.FC<CategoriesProps> = ({}) => {
  return (
    <ScreenScrollView>
      <View className="items-center justify-center my-4">
        <AppText className="text-muted text-base">v1.0.0-beta.6</AppText>
      </View>
    </ScreenScrollView>
  );
};

export default Categories;
