import React from 'react';
import { View, Text, TextInput, StyleSheet, KeyboardTypeOptions } from 'react-native';

interface InputProps {
  id: string;
  label: string;
  type?: string;
  value: string | number;
  onChangeText: (text: string) => void; 
  placeholder?: string;
  required?: boolean;
  error?: string;
  min?: number;
  max?: number;
  step?: number;
}

const Input: React.FC<InputProps> = ({
  id,
  label,
  type = 'text',
  value,
  onChangeText,
  placeholder = '',
  required = false,
  error,
}) => {
  const keyboardType: KeyboardTypeOptions =
    type === 'email'
      ? 'email-address'
      : type === 'number'
      ? 'numeric'
      : 'default';

  const secureTextEntry = type === 'password';

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {label} {required && <Text style={styles.required}>*</Text>}
      </Text>
      <TextInput
        style={[styles.input, error ? styles.inputError : null]}
        value={String(value)}
        onChangeText={onChangeText} 
        placeholder={placeholder}
        keyboardType={keyboardType}
        secureTextEntry={secureTextEntry}
      />
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};

// cambia estos stylos en otra carpeta que se llame styles ejemplo (input.styles.js) mi flaca 

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#4B5563', 
    marginBottom: 4,
  },
  required: {
    color: '#EF4444', 
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB', 
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  inputError: {
    borderColor: '#EF4444', 
  },
  error: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: 4,
  },
});

export default Input;
