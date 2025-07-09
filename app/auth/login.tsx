import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { Link, useRouter } from 'expo-router';
import Input from '../components/Input';
import Button from '../components/Button';
import { Activity } from 'lucide-react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import styles from '../styles/stylesLog'; // Importando estilos separados
import { ScrollView } from 'react-native';



const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const handleSubmit = async () => {
    setError('');
    setIsLoading(true);

    try {
      const response = await axios.post('http://192.168.1.95:5000/api/auth/login', {
        email,
        password
      });

      if (response.data?.token) {
        await AsyncStorage.setItem('userToken', response.data.token);
        await AsyncStorage.setItem('userEmail', email);
        router.push('/(tabs)/dashboard');
      } else {
        setError('No se recibió token de autenticación');
      }
    } catch (err) {
      console.error('Error en login:', err);

      if (axios.isAxiosError(err)) {
        if (err.response) {
          setError(err.response.data.message || 'Error en las credenciales');
        } else if (err.request) {
          setError('No se pudo conectar al servidor. Verifica tu conexión.');
        } else {
          setError('Error al configurar la petición de login');
        }
      } else {
        setError('Error desconocido al iniciar sesión');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    
    <LinearGradient
      colors={['#00C9FF', '#92FE9D']} // Colores del degradado (azul-verde claro)
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}>
      
      
      <View style={styles.card}>
        <View style={styles.iconContainer}>
          <View style={styles.iconBackground}>
            <Activity size={40} color="#FFFFFF" />
          </View>
        </View>

        <Text style={styles.title}>Bienvenido a METAFIT</Text>
        <Text style={styles.subtitle}>Inicia Sesión para continuar</Text>

        {error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        <View style={styles.form}>
          <Input
            id="email"
            label="Correo Electrónico"
            value={email}
            onChangeText={setEmail}
            placeholder="tu@email.com"
            keyboardType="email-address"
            autoCapitalize="none"
            required
          />

          <Input
            id="password"
            label="Contraseña"
            value={password}
            onChangeText={setPassword}
            placeholder="••••••••"
            secureTextEntry
            required
          />

          <View style={styles.buttonContainer}>
            <Button
              onPress={handleSubmit}
              variant="primary"
              fullWidth
              disabled={isLoading}
            >
              {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </Button>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            ¿No tienes una cuenta?{' '}
            <Link href="/auth/register" asChild>
              <Pressable>
                <Text style={styles.linkText}>Regístrate</Text>
              </Pressable>
            </Link>
          </Text>
        </View>
      </View>
    </LinearGradient>
  );
};

export default Login;
