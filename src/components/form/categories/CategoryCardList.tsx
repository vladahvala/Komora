import React from 'react';
import { View } from 'react-native';
import CatCard from '../../CardsInCards/CatCard';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../../../navigation';

interface CategoryCardListProps {
  cards: typeof import('../../../../data/cat_data.js').default;
  navigateTo: keyof RootStackParamList;
}

const CategoryCardList: React.FC<CategoryCardListProps> = ({ cards, navigateTo }) => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  return (
    <View>
      {cards.map(item => (
        <CatCard
          key={item.id}
          item={{
            name: item.title,
            image: item.image,
            cansCount: Math.floor(Math.random() * 20 + 1),
            category: item.category,
          }}
          onPress={() =>
            navigation.navigate(navigateTo, { category: item.category })
          }
        />
      ))}
    </View>
  );
};

export default CategoryCardList;
