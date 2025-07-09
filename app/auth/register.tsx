import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { Link, useRouter } from 'expo-router';
import Input from '../components/Input';
import Button from '../components/Button';
import { Activity } from 'lucide-react-native';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';
import styles from '../styles/stylesLog'; // Estilos importados

const Register: React.FC = () => {
  const [step, setStep] = useState(1);
  const [fullName, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setConfirmPassword] = useState('');
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [targetWeight, setTargetWeight] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const handleNextStep = () => {
    if (step === 1) {
      if (!fullName || !email || !password || !passwordConfirm) {
        setError('Por favor completa todos los campos');
        return;
      }
      if (password !== passwordConfirm) {
        setError('Las contraseñas no coinciden');
        return;
      }
    }
    setError('');
    setStep(step + 1);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setError('');

    const data = {
      fullName,
      email,
      password,
      passwordConfirm,
      age,
      weight,
      height,
      targetWeight,
    };

    try {
      await axios.post('http://192.168.1.95:5000/api/auth/register', data);
      router.push('/(tabs)/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al registrar. Por favor intente de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  return(
      <LinearGradient
      colors={['#A0EACF', '#6BCBDF']} // Colores del degradado (azul-verde claro)
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    > 
    
    <View style={styles.card}>
      <View>
        <View style={styles.iconContainer}>
          <View style={styles.iconBackground}>
            <Activity size={40} color="#1f2937" />
          </View>
        </View>

        <Text style={styles.title}>
          {step === 1 ? 'Crear una cuenta' : 'Información adicional'}
        </Text>

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <ScrollView>
          {step === 1 ? (
            <>
              <Input id="name" label="Nombre completo" value={fullName} onChangeText={setName} placeholder="Tu nombre" required />
              <Input id="email" label="Correo Electrónico" type="email" value={email} onChangeText={setEmail} placeholder="tu@email.com" required />
              <Input id="password" label="Contraseña" type="password" value={password} onChangeText={setPassword} required />
              <Input id="confirmPassword" label="Confirmar Contraseña" type="password" value={passwordConfirm} onChangeText={setConfirmPassword} required />
            </>
          ) : (
            <>
              <Input id="age" label="Edad" type="number" value={age} onChangeText={setAge} placeholder="Ej. 28" required />
              <Input id="weight" label="Peso actual (kg)" type="number" value={weight} onChangeText={setWeight} placeholder="Ej. 70" required />
              <Input id="height" label="Altura (cm)" type="number" value={height} onChangeText={setHeight} placeholder="Ej. 175" required />
              <Input id="goalWeight" label="Peso objetivo (kg)" type="number" value={targetWeight} onChangeText={setTargetWeight} placeholder="Ej. 65" required />
            </>
          )}
        </ScrollView>

        <View style={styles.form}>
          {step === 1 ? (
            <Button onPress={handleNextStep} variant="primary" fullWidth>
              Siguiente
            </Button>
          ) : (
            <Button onPress={handleSubmit} variant="primary" fullWidth disabled={isLoading}>
              {isLoading ? 'Registrando...' : 'Completar Registro'}
            </Button>
          )}
        </View>

        {step === 2 && (
          <Pressable onPress={() => setStep(1)} style={styles.buttonContainer}>
            <Text style={styles.errorText}>Volver</Text>
          </Pressable>
        )}

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            ¿Ya tienes una cuenta?{' '}
            <Link href="/auth/login" asChild>
              <Pressable>
                <Text style={styles.linkText}>Iniciar Sesión</Text>
              </Pressable>
            </Link>
          </Text>
        </View>
      </View>
    </View>
    </LinearGradient>
  );
};

export default Register;
