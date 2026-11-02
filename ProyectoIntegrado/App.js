import { View } from 'react-native';
import RootNavigator from './src/navigation/RootNavigator';

export default function App() {
  return (
    <View style={{ flex: 1 }}>
      <RootNavigator />
    </View>
  );
}