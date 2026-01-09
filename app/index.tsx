import { router } from 'expo-router';
import { Text, TouchableOpacity, View } from 'react-native';

export default function App() {
  return (
    <View className="flex-1 bg-white items-center justify-center space-y-8">
      <Text className="text-black text-xl font-bold">Hello World</Text>
      
      <TouchableOpacity 
        onPress={() => router.push('/login')}
        className="bg-blue-500 px-6 py-3 rounded-full"
      >
        <Text className="text-white font-semibold">Go to Login</Text>
      </TouchableOpacity>
    </View>
  );
}
