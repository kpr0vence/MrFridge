import { View } from 'react-native';
import ItemsAccordian from '../components/ItemsAccordian';
import { fridge } from '../dummyData';

export default function ItemsDisplay() {
  const items = fridge
  return (
    <View className='bg-gray-50 h-screen p-5 pt-10 flex-col gap-5'>
      <ItemsAccordian />
    </View>
  );
}
