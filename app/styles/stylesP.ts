import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f3f4f6' },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
    marginBottom: 20,
    elevation: 2,
  },
  title: { fontSize: 18, fontWeight: '600', marginBottom: 8 },
  percent: { fontSize: 22, fontWeight: 'bold', marginTop: 4 },
  barBackground: {
    height: 10,
    backgroundColor: '#e5e7eb',
    borderRadius: 999,
    marginTop: 10,
  },
  barFill: {
    height: 10,
    backgroundColor: '#10b981',
    borderRadius: 999,
  },
  button: {
    backgroundColor: '#2563eb',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: { color: '#fff', fontWeight: '600' },
  form: {
    backgroundColor: '#f9fafb',
    padding: 16,
    borderRadius: 10,
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  formRow: { flexDirection: 'row', justifyContent: 'space-between' },
  cancelBtn: { padding: 10 },
  saveBtn: {
    backgroundColor: '#10b981',
    padding: 10,
    borderRadius: 6,
  },
  error: { color: 'red', marginBottom: 10 },
  recordRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
});
