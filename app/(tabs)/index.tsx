import { View } from 'react-native';
import LocationCard from '../components/LocationCard';

export default function Index() {
  return (
    <View className='bg-gray-50 h-screen p-5 pt-10 flex-col gap-5'>
        <LocationCard location={"Fridge"} iconName={"tablet-portrait-outline"} />
        <LocationCard location={"Pantry"} iconName={"beaker-outline"} />
        <LocationCard location={"Freezer"} iconName={"fish-outline"} />
    </View>
  );
}


