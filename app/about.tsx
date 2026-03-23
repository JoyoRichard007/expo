import { Link } from 'expo-router';
import { Text, View } from 'react-native';

export default function About() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Page À propos</Text>
      <Link href="/">Retour à l'accueil</Link>
    </View>
  );
}