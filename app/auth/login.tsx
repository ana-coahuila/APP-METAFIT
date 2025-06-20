import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Alert } from 'react-native';
import { Link, useRouter } from 'expo-router';
import Input from '../components/Input';
import Button from '../components/Button';
import { Activity } from 'lucide-react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
        // Guardar el token en AsyncStorage
        await AsyncStorage.setItem('userToken', response.data.token);
        
        // Opcional: Guardar información básica del usuario
        await AsyncStorage.setItem('userEmail', email);
        
        // Navegar al dashboard
        router.push('/(tabs)/dashboard');
      } else {
        setError('No se recibió token de autenticación');
      }
    } catch (err) {
      console.error('Error en login:', err);
      
      if (axios.isAxiosError(err)) {
        if (err.response) {
          // Error del servidor (400, 500, etc.)
          setError(err.response.data.message || 'Error en las credenciales');
        } else if (err.request) {
          // No se recibió respuesta
          setError('No se pudo conectar al servidor. Verifica tu conexión.');
        } else {
          // Error al configurar la petición
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
    <View style={styles.container}>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#f8fafc',
  },
  card: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: 'white',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    padding: 24,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  iconBackground: {
    backgroundColor: '#3b82f6',
    padding: 16,
    borderRadius: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#1e293b',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#64748b',
    marginBottom: 32,
  },
  errorContainer: {
    backgroundColor: '#fee2e2',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#fca5a5',
  },
  errorText: {
    color: '#dc2626',
    textAlign: 'center',
  },
  form: {
    marginBottom: 24,
  },
  buttonContainer: {
    marginTop: 16,
  },
  footer: {
    marginTop: 16,
    alignItems: 'center',
  },
  footerText: {
    color: '#64748b',
  },
  linkText: {
    color: '#3b82f6',
    fontWeight: '600',
  },
});

export default Login;