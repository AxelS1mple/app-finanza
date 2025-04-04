import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

const AddCardScreen = () => {
  const router = useRouter();
  const { name } = useLocalSearchParams(); // Obtener el nombre del usuario de la URL

  const [tipo, setTipo] = useState('');
  const [banco, setBanco] = useState('');
  const [numero, setNumero] = useState('');
  const [saldo, setSaldo] = useState('');
  const [fechaExpiracion, setFechaExpiracion] = useState('');

  const handleSaveCard = () => {
    // Crear el objeto tarjeta
    const newCard = {
      id: `card${new Date().getTime()}`, // Generar un id único basado en el tiempo
      tipo,
      banco,
      numero,
      saldo: parseFloat(saldo),
      fecha_expiracion: fechaExpiracion,
    };

    // Aquí podrías guardar la tarjeta en el estado global o una base de datos
    // Por ahora solo redirigimos al menú
    router.push(`/menu?name=${name}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Agregar Nueva Tarjeta</Text>
      <TextInput
        style={styles.input}
        placeholder="Tipo"
        value={tipo}
        onChangeText={setTipo}
      />
      <TextInput
        style={styles.input}
        placeholder="Banco"
        value={banco}
        onChangeText={setBanco}
      />
      <TextInput
        style={styles.input}
        placeholder="Número"
        value={numero}
        onChangeText={setNumero}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Saldo"
        value={saldo}
        onChangeText={setSaldo}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Fecha de Expiración"
        value={fechaExpiracion}
        onChangeText={setFechaExpiracion}
      />
      <Button title="Guardar Tarjeta" onPress={handleSaveCard} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 8,
  },
});

export default AddCardScreen;
