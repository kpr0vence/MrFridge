import { View } from 'react-native';
import ItemCard from '../components/ItemCard';
import { fridge } from '../dummyData';
import { item } from '../types';

export default function ItemsDisplay() {
  const items = fridge
  return (
    <View className='bg-gray-50 h-screen p-5 pt-10 flex-col gap-5'>
      {renderItemCards(items)}
    </View>
  );
}

function renderItemCards(items: item[]) {
  return items.map( (item) => < ItemCard item={item} key={item.name} />)
}