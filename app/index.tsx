import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Button, Text, View } from 'react-native';

export default function Index() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState('');

  // Remplace par ton IP
  const GATEWAY_URL = 'http://192.168.0.200:3000';

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${GATEWAY_URL}/users`);
      const data = await response.json();
      setUsers(data);
      setLoading(false);
    } catch (err) {
      console.error('Fetch users error:', err);
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    try {
      const response = await fetch(`${GATEWAY_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'test@example.com', password: '123456' })
      });
      const data = await response.json();
      setToken(data.token);
      Alert.alert('Connexion réussie', `Token: ${data.token.substring(0, 20)}...`);
    } catch (err) {
      console.error('Login error:', err);
      Alert.alert('Erreur', 'Connexion échouée');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#667eea" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#667eea', marginBottom: 20 }}>
        Microservices Demo
      </Text>

      <Button title="Se connecter (Auth)" onPress={handleLogin} />
      
      {token ? (
        <Text style={{ marginTop: 10, fontSize: 12, color: 'green' }}>
          ✅ Connecté
        </Text>
      ) : null}

      <Text style={{ marginTop: 20, fontSize: 18, fontWeight: 'bold' }}>
        Utilisateurs :
      </Text>
      
      {users.map((user: any) => (
        <Text key={user.id} style={{ marginTop: 5 }}>
          • {user.name} ({user.email})
        </Text>
      ))}
    </View>
  );
}