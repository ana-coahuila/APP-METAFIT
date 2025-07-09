import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';
import { User as IconUser, Settings, LogOut } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import styles from '../styles/stylesPer'; 
import { LinearGradient } from 'expo-linear-gradient';

interface User {
  fullName: string;
  email: string;
  age: number;
  weight: number;
  height: number;
  targetWeight: number;
  bmi?: number;
  bmiCategory?: string;
}



const Profile: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState('');
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [targetWeight, setTargetWeight] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    setIsLoading(true);
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        router.push('/auth/login');
        return;
      }

      const response = await axios.get('http://192.168.1.95:5000/api/auth/user', {
        headers: {
          'x-auth-token': token,
        },
      });

      const data = response.data;
      setUser(data);
      setFullName(data.fullName || '');
      setAge(data.age?.toString() || '');
      setWeight(data.weight?.toString() || '');
      setHeight(data.height?.toString() || '');
      setTargetWeight(data.targetWeight?.toString() || '');
    } catch (error) {
      console.error('Error fetching user data:', error);
      Alert.alert('Error', 'No se pudo cargar el perfil. Por favor, intenta nuevamente.');
      await AsyncStorage.removeItem('userToken');
      router.push('/auth/login');
    } finally {
      setIsLoading(false);
    }
  };

  const updateUserProfile = async (data: Partial<User>) => {
    setIsLoading(true);
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        router.push('/auth/login');
        return;
      }

      await axios.put('http://192.168.1.13:5000/api/auth/user', data, {
        headers: {
          'x-auth-token': token,
        },
      });

      Alert.alert('Éxito', 'Perfil actualizado correctamente');
      await fetchUserData();
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'No se pudo actualizar el perfil. Verifica los datos e intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('userToken');
      router.replace('/auth/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleSubmit = async () => {
    const newErrors: Record<string, string> = {};

    if (!fullName.trim()) newErrors.fullName = 'El nombre es requerido';
    if (!age || isNaN(parseInt(age)) || parseInt(age) < 18 || parseInt(age) > 30)
      newErrors.age = 'Edad inválida (18-30 años)';
    if (!weight || isNaN(parseFloat(weight)) || parseFloat(weight) < 30 || parseFloat(weight) > 300)
      newErrors.weight = 'Peso inválido (30-300 kg)';
    if (!height || isNaN(parseInt(height)) || parseInt(height) < 100 || parseInt(height) > 250)
      newErrors.height = 'Altura inválida (100-250 cm)';
    if (!targetWeight || isNaN(parseFloat(targetWeight)) || parseFloat(targetWeight) < 30 || parseFloat(targetWeight) > 300)
      newErrors.targetWeight = 'Objetivo inválido (30-300 kg)';

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    const updatedData = {
      fullName,
      age: parseInt(age),
      weight: parseFloat(weight),
      height: parseInt(height),
      targetWeight: parseFloat(targetWeight),
    };

    await updateUserProfile(updatedData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    if (!user) return;
    setFullName(user.fullName);
    setAge(user.age?.toString() || '');
    setWeight(user.weight?.toString() || '');
    setHeight(user.height?.toString() || '');
    setTargetWeight(user.targetWeight?.toString() || '');
    setErrors({});
    setIsEditing(false);
  };

  if (isLoading && !user) {
    return (

      <LinearGradient
      colors={['#00C9FF', '#92FE9D']} // Colores del degradado (azul-verde claro)
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    
    >
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#1D4ED8" />
        <Text>Cargando perfil...</Text>
      </View> </LinearGradient>
    );
  }

  if (!user) {
    return (
<LinearGradient
      colors={['#00C9FF', '#92FE9D']} // Colores del degradado (azul-verde claro)
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }} >

      <View style={styles.centered}>
        <Text>No se pudo cargar la información del usuario</Text>
        <TouchableOpacity 
          style={styles.retryButton} 
          onPress={fetchUserData}
        >
          <Text style={styles.retryText}>Reintentar</Text>
        </TouchableOpacity>
      </View></LinearGradient>
    );
  }

  const bmiValue = user.weight && user.height 
    ? (user.weight / ((user.height / 100) ** 2)).toFixed(2)
    : 'N/A';

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return 'Bajo peso';
    if (bmi < 25) return 'Normal';
    if (bmi < 30) return 'Sobrepeso';
    if (bmi < 35) return 'Obesidad I';
    if (bmi < 40) return 'Obesidad II';
    return 'Obesidad III';
  };

  const bmiCategory = bmiValue !== 'N/A' 
    ? getBMICategory(parseFloat(bmiValue))
    : 'N/A';

  return (
    <LinearGradient
      colors={['#00C9FF', '#92FE9D']} // Colores del degradado (azul-verde claro)
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }} >
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Tu Perfil</Text>
        <View style={styles.iconContainer}>
          <IconUser size={24} color="#1F2937" />
        </View>
      </View>

      <View style={styles.card}>
        <View style={styles.profileRow}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user.fullName?.charAt(0).toUpperCase() || 'U'}
            </Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{user.fullName}</Text>
            <Text style={styles.profileEmail}>{user.email}</Text>
          </View>
          {!isEditing && (
            <TouchableOpacity 
              onPress={() => setIsEditing(true)} 
              style={styles.editButton}
              disabled={isLoading}
            >
              <Settings size={16} color="#1F2937" />
              <Text style={styles.editText}>Editar</Text>
            </TouchableOpacity>
          )}
        </View>

        {isEditing ? (
          <View style={styles.form}>
            {renderInput('Nombre completo', fullName, setFullName, errors.fullName)}
            {renderInput('Edad', age, setAge, errors.age, 'numeric')}
            {renderInput('Peso actual (kg)', weight, setWeight, errors.weight, 'numeric')}
            {renderInput('Altura (cm)', height, setHeight, errors.height, 'numeric')}
            {renderInput('Objetivo de peso (kg)', targetWeight, setTargetWeight, errors.targetWeight, 'numeric')}

            <View style={styles.buttonRow}>
              <TouchableOpacity 
                style={[styles.cancelButton, isLoading && styles.disabledButton]} 
                onPress={handleCancel}
                disabled={isLoading}
              >
                <Text style={styles.cancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.saveButton, isLoading && styles.disabledButton]} 
                onPress={handleSubmit}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text style={styles.saveText}>Guardar cambios</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.infoGrid}>
            {renderInfo('Edad', `${user.age} años`)}
            {renderInfo('Altura', `${user.height} cm`)}
            {renderInfo('Peso actual', `${user.weight} kg`)}
            {renderInfo('Objetivo de peso', `${user.targetWeight} kg`)}
            {renderInfo('IMC', bmiValue)}
            {renderInfo('Clasificación', bmiCategory)}
            {user.bmi && renderInfo('IMC calculado', user.bmi.toFixed(2))}
            {user.bmiCategory && renderInfo('Categoría', user.bmiCategory)}
          </View>
        )}
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Configuración de la cuenta</Text>
        <TouchableOpacity 
          style={styles.logoutButton} 
          onPress={logout}
          disabled={isLoading}
        >
          <LogOut size={16} color="#DC2626" />
          <Text style={styles.logoutText}>Cerrar sesión</Text>
        </TouchableOpacity>
      </View>
    </ScrollView></LinearGradient>
  );
};

// Función reutilizable para inputs
const renderInput = (
  label: string,
  value: string,
  setValue: (val: string) => void,
  error?: string,
  keyboardType: 'default' | 'numeric' = 'default'
) => (
  <View style={styles.inputContainer}>
    <Text style={styles.inputLabel}>{label}</Text>
    <TextInput 
      value={value} 
      onChangeText={setValue} 
      style={[styles.input, error ? styles.inputError : null]} 
      keyboardType={keyboardType}
    />
    {error && <Text style={styles.errorText}>{error}</Text>}
  </View>
);

// Función reutilizable para mostrar información
const renderInfo = (label: string, value: string) => (
  <View style={styles.infoItem}>
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={styles.infoValue}>{value}</Text>
  </View>
);

export default Profile;
