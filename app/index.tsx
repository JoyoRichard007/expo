import { useEffect, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';

export default function Index() {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Ta vraie URL Railway
    fetch('https://expo-production-b530.up.railway.app/api/hello')
      .then(res => res.json())
      .then(data => {
        setMessage(data.message);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setMessage('Erreur de connexion');
        setLoading(false);
      });
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {loading ? (
        <ActivityIndicator size="large" color="#667eea" />
      ) : (
        <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#667eea' }}>
          {message}
        </Text>
      )}
    </View>
  );
}