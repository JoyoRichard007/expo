import { Link } from 'expo-router';
import { Text, View } from 'react-native';

export default function Index() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#667eea' }}>
        Hello World avec Expo! 👋
      </Text>
      <Link href="/about" style={{ marginTop: 20, color: '#764ba2' }}>
        Aller à la page about
      </Link>
    </View>
  );
}