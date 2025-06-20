import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

type PesoRecord = {
  date: string;
  peso: number;
};

type Meal = {
  name: string;
};

type Exercise = {
  id: string;
  name: string;
  duration: number;
};

type DailyPlan = {
  date: string;
  meals: {
    breakfast: Meal;
    lunch: Meal;
    dinner: Meal;
  };
  exercises: Exercise[];
};

const Dashboard: React.FC = () => {
  // Simulamos usuario
  const [user, setUser] = useState({
    fullName: 'Ana Coahuila',
    peso: 70,
    objetivopeso: 65,
  });

  // Simulamos registros de peso
  const [pesoRecords, setPesoRecords] = useState<PesoRecord[]>([
    { date: '2025-06-01', peso: 72 },
    { date: '2025-06-10', peso: 70 },
  ]);

  // Simulamos planes diarios
  const [dailyPlans, setDailyPlans] = useState<DailyPlan[]>([
    {
      date: new Date().toISOString().split('T')[0],
      meals: {
        breakfast: { name: 'Avena con frutas' },
        lunch: { name: 'Ensalada de pollo' },
        dinner: { name: 'Sopa de verduras' },
      },
      exercises: [
        { id: 'e1', name: 'Caminata', duration: 30 },
        { id: 'e2', name: 'Yoga', duration: 45 },
      ],
    },
  ]);

  const [progress, setProgress] = useState(0);

  // Función para calcular progreso
  const calculateProgress = useCallback(() => {
    if (!user) return;

    if (pesoRecords.length > 0 && user.objetivopeso) {
      const sortedRecords = [...pesoRecords].sort((a, b) =>
        new Date(a.date).getTime() - new Date(b.date).getTime()
      );

      const initialPeso = sortedRecords[0].peso;
      const currentPeso = sortedRecords[sortedRecords.length - 1].peso;
      const goalPeso = user.objetivopeso;

      let calculatedProgress = 0;

      if (goalPeso < initialPeso) {
        // Perder peso
        if (currentPeso <= goalPeso) {
          calculatedProgress = 100;
        } else if (currentPeso >= initialPeso) {
          calculatedProgress = 0;
        } else {
          calculatedProgress = ((initialPeso - currentPeso) / (initialPeso - goalPeso)) * 100;
        }
      } else if (goalPeso > initialPeso) {
        // Ganar peso
        if (currentPeso >= goalPeso) {
          calculatedProgress = 100;
        } else if (currentPeso <= initialPeso) {
          calculatedProgress = 0;
        } else {
          calculatedProgress = ((currentPeso - initialPeso) / (goalPeso - initialPeso)) * 100;
        }
      } else {
        calculatedProgress = 100;
      }

      setProgress(Math.min(Math.max(calculatedProgress, 0), 100));
    }
  }, [user, pesoRecords]);

  useEffect(() => {
    calculateProgress();
  }, [calculateProgress]);

  // Obtener plan de hoy
  const todayPlan = dailyPlans.find(plan => 
    plan.date === new Date().toISOString().split('T')[0]
  );

  // Diferencia de peso para mensaje
  const getWeightDifference = () => {
    if (pesoRecords.length > 1) {
      const sortedRecords = [...pesoRecords].sort((a, b) =>
        new Date(a.date).getTime() - new Date(b.date).getTime()
      );
      const initialWeight = sortedRecords[0].peso;
      const currentWeight = sortedRecords[sortedRecords.length - 1].peso;
      const difference = currentWeight - initialWeight;

      if (difference < 0) {
        return `Has perdido ${Math.abs(difference).toFixed(1)} kg`;
      } else if (difference > 0) {
        return `Has ganado ${difference.toFixed(1)} kg`;
      }
      return 'Mismo peso que al inicio';
    }
    return 'Comienza tu viaje';
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Hola, {user.fullName.split(' ')[0]}</Text>
        <View style={styles.iconContainer}>
          <Icon name="activity" size={24} color="#1E3A8A" />
        </View>
      </View>

      {/* Barra de progreso */}
      <View style={styles.progressCard}>
        <View style={styles.progressHeader}>
          <View>
            <Text style={styles.progressTitle}>Tu progreso</Text>
            <Text style={styles.progressSubtitle}>
              {pesoRecords.length > 1 ? getWeightDifference() : 'Comienza tu viaje'}
            </Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={styles.progressSubtitle}>Objetivo: {user.objetivopeso ?? '-' } kg</Text>
            <Text style={styles.progressPercentage}>{progress.toFixed(1)}%</Text>
          </View>
        </View>

        <View style={styles.progressBarBackground}>
          <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
        </View>

        <TouchableOpacity style={styles.detailsButton} onPress={() => alert('Ir a detalles')}>
          <Text style={styles.detailsButtonText}>Ver detalles</Text>
        </TouchableOpacity>
      </View>

      {/* Plan de hoy y registro de peso */}
      <View style={styles.grid}>
        {/* Plan de hoy */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Plan de hoy</Text>
          {todayPlan ? (
            <View>
              <View style={{ marginBottom: 16 }}>
                <Text style={styles.sectionTitle}>Comidas</Text>
                <View style={styles.listItem}>
                  <Icon name="coffee" size={16} color="#4B5563" style={styles.listIcon} />
                  <Text>Desayuno: {todayPlan.meals.breakfast.name}</Text>
                </View>
                <View style={styles.listItem}>
                  <Icon name="coffee" size={16} color="#4B5563" style={styles.listIcon} />
                  <Text>Almuerzo: {todayPlan.meals.lunch.name}</Text>
                </View>
                <View style={styles.listItem}>
                  <Icon name="coffee" size={16} color="#4B5563" style={styles.listIcon} />
                  <Text>Cena: {todayPlan.meals.dinner.name}</Text>
                </View>
              </View>

              <View style={{ marginBottom: 16 }}>
                <Text style={styles.sectionTitle}>Ejercicios</Text>
                {todayPlan.exercises.map(exercise => (
                  <View key={exercise.id} style={styles.listItem}>
                    <Icon name="video" size={16} color="#4B5563" style={styles.listIcon} />
                    <Text>{exercise.name} ({exercise.duration} min)</Text>
                  </View>
                ))}
              </View>

              <TouchableOpacity
                style={[styles.button, styles.primaryButton]}
                onPress={() => alert('Ir a plan completo')}
              >
                <Text style={styles.primaryButtonText}>Ver plan completo</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={{ alignItems: 'center', paddingVertical: 20 }}>
              <Text style={{ marginBottom: 16, color: '#6B7280' }}>No hay un plan para hoy</Text>
              <TouchableOpacity
                style={[styles.button, styles.primaryButton]}
                onPress={() => alert('Generar plan')}
              >
                <Text style={styles.primaryButtonText}>Generar plan</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Registro de peso */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Registro de peso</Text>
          <View style={styles.weightCurrentContainer}>
            <View>
              <Text style={styles.weightLabel}>Peso actual</Text>
              <Text style={styles.weightValue}>
                {pesoRecords.length > 0
                  ? pesoRecords[pesoRecords.length - 1].peso
                  : user.peso} kg
              </Text>
            </View>
            <Icon name="trending-up" size={24} color="#15803D" />
          </View>

          <TouchableOpacity
            style={[styles.button, styles.primaryButton, { flexDirection: 'row', justifyContent: 'center' }]}
            onPress={() => alert('Registrar peso')}
          >
            <Icon name="plus" size={18} color="#fff" style={{ marginRight: 8 }} />
            <Text style={styles.primaryButtonText}>Registrar peso</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 40,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  iconContainer: {
    backgroundColor: '#3B82F6', // azul
    padding: 8,
    borderRadius: 9999,
  },
  progressCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  progressSubtitle: {
    color: '#4B5563',
  },
  progressPercentage: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: '#D1D5DB',
    borderRadius: 9999,
    marginTop: 12,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: 8,
    backgroundColor: '#15803D',
    borderRadius: 9999,
  },
  detailsButton: {
    marginTop: 12,
    backgroundColor: 'rgba(255,255,255,0.7)',
    paddingVertical: 8,
    paddingHorizontal: 14,
    alignSelf: 'flex-end',
    borderRadius: 6,
  },
  detailsButtonText: {
    color: '#1F2937',
    fontWeight: '600',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
    width: '48%',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: '#1F2937',
  },
  sectionTitle: {
    fontWeight: '600',
    marginBottom: 8,
    color: '#374151',
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  listIcon: {
    marginRight: 8,
  },
  weightCurrentContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  weightLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  weightValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  button: {
    paddingVertical: 12,
    borderRadius: 6,
  },
  primaryButton: {
    backgroundColor: '#15803D',
  },
  primaryButtonText: {
    color: 'white',
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default Dashboard;
