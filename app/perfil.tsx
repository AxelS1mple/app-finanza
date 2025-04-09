import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

interface User {
  id: number;
  username: string;
  password: string;
  name: string;
  edad: number;
  tarjetas: any[];
}

const ProfileScreen = () => {
  const router = useRouter();
  const { name } = useLocalSearchParams();
  const [userData, setUserData] = useState<User | null>(null);

  useEffect(() => {
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

    const user = users.find((u) => u.name === name);
    setUserData(user || null);
  }, [name]);

  if (!userData) {
    return <Text style={styles.loading}>Cargando perfil...</Text>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>👤 Perfil</Text>
        <Text style={styles.label}>Nombre:</Text>
        <Text style={styles.info}>{userData.name}</Text>

        <Text style={styles.label}>Edad:</Text>
        <Text style={styles.info}>{userData.edad} años</Text>

        <Text style={styles.label}>Usuario:</Text>
        <Text style={styles.info}>{userData.username}</Text>

        <View style={styles.buttonContainer}>
          <Button
            title="🔙 Regresar al Menú"
            color="#4682B4"
            onPress={() => router.push(`/menu?name=${userData.name}`)}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f8',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: '#fff',
    width: '100%',
    maxWidth: 350,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    alignSelf: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#444',
    marginTop: 10,
  },
  info: {
    fontSize: 18,
    color: '#222',
  },
  loading: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    marginTop: 50,
  },
  buttonContainer: {
    marginTop: 30,
  },
});

export default ProfileScreen;
