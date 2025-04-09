import { useLocalSearchParams } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, ActivityIndicator, Modal, TextInput, Button } from 'react-native';

type Tarjeta = {
  id: number;
  tipo: string;
  banco: string;
  numero: string;
  saldo: string;
  fecha_expiracion: string;
  color: string;
  numero_masked?: string;
};

type FormData = {
  tipo: string;
  banco: string;
  numero: string;
  saldo: string;
  fecha_expiracion: string;
  color: string;
};

export default function App() {
  const { id } = useLocalSearchParams();
  const [tarjetas, setTarjetas] = useState<Tarjeta[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    tipo: '',
    banco: '',
    numero: '',
    saldo: '',
    fecha_expiracion: '',
    color: '#3a7bd5'
  });
  const [editMode, setEditMode] = useState(false); // Para saber si estamos editando una tarjeta

  // Obtener tarjetas
  const fetchTarjetas = async () => {
    try {
      const response = await fetch(`https://lemonchiffon-dragonfly-545545.hostingersite.com/apitarjetas.php?id=${id}`);
      const data = await response.json();
      console.log(data);
        setTarjetas(data);
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar las tarjetas');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Cargar datos iniciales
  useEffect(() => {
    fetchTarjetas();
  }, []);

  // Manejar refrescar
  const handleRefresh = () => {
    setRefreshing(true);
    fetchTarjetas();
  };

  // Manejar cambio en el formulario
  const handleChange = (name: keyof FormData, value: string) => {
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Crear nueva tarjeta
  const handleCreate = async () => {
    try {
      const response = await fetch(`https://lemonchiffon-dragonfly-545545.hostingersite.com/apitarjetas.php?id=${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      // Verificar la respuesta de la API
      const data = await response.json();
      console.log('Respuesta de la API:', data);  // Verificar los datos de la respuesta
      
      if (response.ok) {  // Verificar si la respuesta fue exitosa
        if (data.status === 'success') {
          setModalVisible(false);
          setFormData({
            tipo: '',
            banco: '',
            numero: '',
            saldo: '',
            fecha_expiracion: '',
            color: '#3a7bd5',
          });
          fetchTarjetas();
          Alert.alert('Éxito', 'Tarjeta creada correctamente');
        } else {
          Alert.alert('Error', 'Hubo un problema al crear la tarjeta');
        }
      } else {
        Alert.alert('Error', 'Hubo un problema con la solicitud');
      }
  
    } catch (error) {
      console.error('Error al enviar datos:', error);  // Log para ver el error
      Alert.alert('Error', 'No se pudo crear la tarjeta');
    }
  };
  

  // Editar tarjeta
  const handleEdit = async () => {
    try {
      const response = await fetch(`https://lemonchiffon-dragonfly-545545.hostingersite.com/apitarjetas.php?id=${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...formData, id: formData.id }) // Incluye el ID de la tarjeta
      });
      const data = await response.json();
      if (data.status === 'success') {
        setModalVisible(false);
        setEditMode(false);
        setFormData({
          tipo: '',
          banco: '',
          numero: '',
          saldo: '',
          fecha_expiracion: '',
          color: '#3a7bd5'
        });
        fetchTarjetas();
        Alert.alert('Éxito', 'Tarjeta editada correctamente');
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo editar la tarjeta');
    }
  };

  // Eliminar tarjeta
  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`https://lemonchiffon-dragonfly-545545.hostingersite.com/apitarjetas.php?id=${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      if (data.status === 'success') {
        fetchTarjetas();
        Alert.alert('Éxito', 'Tarjeta eliminada correctamente');
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo eliminar la tarjeta');
    }
  };

  // Renderizar item de tarjeta
  const renderItem = ({ item }: { item: Tarjeta }) => (
    <View style={[styles.card, { backgroundColor: item.color }]}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{item.banco}</Text>
        <Text style={styles.cardType}>{item.tipo}</Text>
      </View>
      <Text style={styles.cardNumber}>{item.numero_masked || item.numero}</Text>
      <View style={styles.cardFooter}>
        <Text style={styles.cardBalance}>Saldo: ${parseFloat(item.saldo).toFixed(2)}</Text>
        <Text style={styles.cardExpiry}>Expira: {item.fecha_expiracion}</Text>
      </View>
      <View style={styles.cardActions}>
        <Button title="Editar" onPress={() => {
          setFormData({
            tipo: item.tipo,
            banco: item.banco,
            numero: item.numero,
            saldo: item.saldo,
            fecha_expiracion: item.fecha_expiracion,
            color: item.color
          });
          setEditMode(true);
          setModalVisible(true);
        }} />
        <Button title="Eliminar" onPress={() => handleDelete(item.id)} />
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#3a7bd5" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={tarjetas}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        contentContainerStyle={styles.list}
      />

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.addButtonText}>Agregar Tarjeta</Text>
      </TouchableOpacity>

      {/* Modal para agregar o editar tarjeta */}
      <Modal
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
        animationType="slide"
      >
        <View style={styles.modalContainer}>
          <TextInput
            placeholder="Tipo (Crédito/Débito)"
            value={formData.tipo}
            onChangeText={(text) => handleChange('tipo', text)}
            style={styles.input}
          />
          <TextInput
            placeholder="Banco"
            value={formData.banco}
            onChangeText={(text) => handleChange('banco', text)}
            style={styles.input}
          />
          <TextInput
            placeholder="Número de tarjeta"
            value={formData.numero}
            onChangeText={(text) => handleChange('numero', text)}
            keyboardType="numeric"
            style={styles.input}
          />
          <TextInput
            placeholder="Saldo"
            value={formData.saldo}
            onChangeText={(text) => handleChange('saldo', text)}
            keyboardType="numeric"
            style={styles.input}
          />
          <TextInput
            placeholder="Fecha de expiración (MM/AA)"
            value={formData.fecha_expiracion}
            onChangeText={(text) => handleChange('fecha_expiracion', text)}
            style={styles.input}
          />
          <TextInput
            placeholder="Color (código HEX)"
            value={formData.color}
            onChangeText={(text) => handleChange('color', text)}
            style={styles.input}
          />

          <View style={styles.modalActions}>
            <Button title="Cancelar" onPress={() => setModalVisible(false)} />
            <Button title={editMode ? "Actualizar" : "Guardar"} onPress={editMode ? handleEdit : handleCreate} />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: 20,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    paddingBottom: 80,
  },
  card: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 10,
    elevation: 3,
    padding: 15,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  cardType: {
    fontSize: 14,
    color: 'white',
    textTransform: 'uppercase',
  },
  cardNumber: {
    fontSize: 16,
    letterSpacing: 2,
    color: 'white',
    marginVertical: 15,
    fontFamily: 'monospace',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardBalance: {
    fontSize: 14,
    color: 'white',
  },
  cardExpiry: {
    fontSize: 14,
    color: 'white',
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#3a7bd5',
    padding: 15,
    borderRadius: 30,
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: 'white',
  },
  input: {
    marginBottom: 15,
    borderBottomWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  modalActions: {
    marginTop: 20,
  },
});
