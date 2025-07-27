import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useAuth } from '../context/AuthContext';

const RegisterScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();

  const handleRegister = async () => {
    if (!name || !email || !password) {
        Alert.alert('Eroare', 'Te rog completează toate câmpurile.');
        return;
    }
    setLoading(true);
    try {
        await register(name, email, password);
        // Navigația se va face automat
    } catch (error) {
        Alert.alert('Eroare la Înregistrare', error.message);
    } finally {
        setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Creează Cont Nou</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Nume"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Adresă de email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Parolă"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {loading ? (
        <ActivityIndicator size="large" color="#1a73e8" />
      ) : (
        <Button title="Înregistrează-te" onPress={handleRegister} />
      )}


      <TouchableOpacity onPress={() => navigation.navigate('Login')} disabled={loading}>
        <Text style={styles.switchText}>Ai deja cont? Autentifică-te</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#f0f2f5',
      },
      title: {
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 30,
      },
      input: {
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 15,
        borderRadius: 8,
        marginBottom: 15,
        fontSize: 16,
      },
      switchText: {
        color: '#1a73e8',
        textAlign: 'center',
        marginTop: 20,
        fontSize: 16,
      },
});

export default RegisterScreen;
