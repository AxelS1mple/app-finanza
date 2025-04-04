import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

interface Tarjeta {
  id: string;
  tipo: string;
  banco: string;
  numero: string;
  saldo: number;
  fecha_expiracion: string;
}

const CardDetailScreen = () => {
  const router = useRouter();
  const { tarjetaId, userName } = useLocalSearchParams(); // Obtener tarjetaId y userName de la URL
  const [cardData, setCardData] = useState<Tarjeta | null>(null);

  useEffect(() => {
    const tarjetas: Tarjeta[] = [
      { id: 'card1', tipo: 'Crédito', banco: 'Banco Nacional', numero: '1234 5678 9012 3456', saldo: 5000.00, fecha_expiracion: '12/25' },
      { id: 'card2', tipo: 'Débito', banco: 'Banco Local', numero: '9876 5432 1098 7654', saldo: 1200.00, fecha_expiracion: '05/24' },
    ];

    const card = tarjetas.find((card) => card.id === tarjetaId);
    setCardData(card || null);
  }, [tarjetaId]);

  if (!cardData) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Detalles de la tarjeta</Text>
      <Text>Tipo: {cardData.tipo}</Text>
      <Text>Banco: {cardData.banco}</Text>
      <Text>Número: {cardData.numero}</Text>
      <Text>Saldo: ${cardData.saldo.toFixed(2)}</Text>
      <Text>Expiración: {cardData.fecha_expiracion}</Text>

      {/* Botón para regresar al menú, pasando el nombre del usuario */}
      <Button title="Regresar al Menú" onPress={() => router.push(`/menu?name=${userName}`)} />
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
});

export default CardDetailScreen;
