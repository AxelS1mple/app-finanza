import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

interface User {
  id: number;
  username: string;
  password: string;
  name: string;
  edad: number;
  tarjetas: any[]; // Aquí puedes usar el tipo Tarjeta si es necesario
}

const ProfileScreen = () => {
  const router = useRouter();
  const { name } = useLocalSearchParams(); // Obtener el nombre del usuario de la URL
  const [userData, setUserData] = useState<User | null>(null);

  useEffect(() => {
    // Simulamos los datos del usuario, normalmente aquí iría la llamada al backend
    const users: User[] = [
      {
        id: 1,
        username: 'axel',
        password: '123',
        name: 'Axel',
        edad: 20,
        tarjetas: [
          { id: 'card1', tipo: 'Crédito', banco: 'Banco Nacional', numero: '1234 5678 9012 3456', saldo: 5000.00, fecha_expiracion: '12/25' },
          { id: 'card2', tipo: 'Débito', banco: 'Banco Local', numero: '9876 5432 1098 7654', saldo: 1200.00, fecha_expiracion: '05/24' }
        ]
      },
      {
        id: 2,
        username: 'usuario2',
        password: 'securePass456',
        name: 'María López',
        edad: 25,
        tarjetas: [{ id: 'card1', tipo: 'Crédito', banco: 'BBVA', numero: '1111 2222 3333 4444', saldo: 1500.00, fecha_expiracion: '08/26' }]
      }
    ];

    // Buscar al usuario por nombre
    const user = users.find((u) => u.name === name);
    setUserData(user || null); // Asignamos los datos del usuario
  }, [name]);

  if (!userData) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
      <Text>Perfil de {userData.name}</Text>
      <Text>Edad: {userData.edad}</Text>
      <Text>Username: {userData.username}</Text>
      <Button title="Regresar al Menú" onPress={() => router.push(`/menu?name=${userData.name}`)} /> 
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
});

export default ProfileScreen;
