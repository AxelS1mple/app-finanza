import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Dimensions
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

const { width } = Dimensions.get('window');

interface Tarjeta {
  id: string;
  username: string;
  password: string;
  name: string;
  edad: number;
  tipo: string;
  banco: string;
  numero: string;
  saldo: string;
  fecha_expiracion: string;
  color: string;
}

const MenuScreen = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [userData, setUserData] = useState<Tarjeta[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`https://lemonchiffon-dragonfly-545545.hostingersite.com/apitarjetas.php?id=${id}`);
        const data = await response.json();
        setUserData(data);
      } catch (error) {
        console.error("Error al obtener los datos del usuario:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchUserData();
    }
  }, [id]);

  const handleAddCard = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push(`/agregartarjeta?id=${id}`);
  };

  const handleCardPress = (tarjetaId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push(`/detalletarjeta?tarjetaId=${tarjetaId}&id=${id}`);
  };

  const handleProfilePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push(`/perfil?id=${id}`);
  };

  const handleLogout = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push('/');
  };

  const renderCard = ({ item }: { item: Tarjeta }) => (
    <TouchableOpacity onPress={() => handleCardPress(item.id)} activeOpacity={0.9}>
      <LinearGradient
        colors={['#015958', '#023535']}
        style={styles.card}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.cardBank}>{item.banco}</Text>
          <Text style={styles.cardType}>{item.tipo}</Text>
        </View>
        <View style={styles.cardNumberContainer}>
          {item.numero.split(' ').map((part, index) => (
            <Text key={index} style={styles.cardNumberPart}>{part}</Text>
          ))}
        </View>
        <View style={styles.cardFooter}>
          <Text style={styles.cardExpiry}>Expira {item.fecha_expiracion}</Text>
          <Text style={styles.cardBalance}>${item.saldo}</Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Cargando...</Text>
      </View>
    );
  }

  if (userData.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>No se encontraron tarjetas</Text>
      </View>
    );
  }

  const userName = userData[0]?.name || 'Usuario';
  const userAge = userData[0]?.edad || '';

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient colors={['#015958', '#011F1F']} style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <View style={styles.userInfo}>
              <View>
                <Text style={styles.welcomeText}>Bienvenido</Text>
                <Text style={styles.userName}>{userName}</Text>
              </View>
            </View>

            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{userData.length}</Text>
                <Text style={styles.statLabel}>Tarjetas</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>
                  ${userData.reduce((sum, card) => sum + parseFloat(card.saldo), 0).toFixed(2)}
                </Text>
                <Text style={styles.statLabel}>Saldo total</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{userAge}</Text>
                <Text style={styles.statLabel}>Edad</Text>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Tus tarjetas</Text>
            <FlatList
              data={userData}
              renderItem={renderCard}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.cardsContainer}
            />
          </View>

          <View style={styles.quickActions}>
            <TouchableOpacity style={styles.actionButton} onPress={handleAddCard}>
              <LinearGradient colors={['#015958', '#023535']} style={styles.actionButtonGradient}>
                <MaterialIcons name="add-card" size={24} color="white" />
                <Text style={styles.actionButtonText}>Agregar tarjeta</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </ScrollView>

        <View style={styles.bottomMenu}>
          <TouchableOpacity style={styles.menuButton} onPress={handleProfilePress}>
            <Ionicons name="person-outline" size={24} color="#ffffff" />
            <Text style={styles.menuButtonText}>Perfil</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuButton} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={24} color="#ff6b6b" />
            <Text style={[styles.menuButtonText, { color: '#ff6b6b' }]}>Salir</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#011F1F' },
  container: { flex: 1 },
  scrollContent: { paddingBottom: 100 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { fontSize: 18, color: '#fff' },
  header: { padding: 24, paddingTop: 16 },
  userInfo: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
  welcomeText: { fontSize: 14, color: '#ccc', marginBottom: 4 },
  userName: { fontSize: 22, fontWeight: '700', color: '#fff' },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#023535',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  statItem: { alignItems: 'center' },
  statValue: { fontSize: 24, fontWeight: '600', color: '#fff' },
  statLabel: { fontSize: 12, color: '#ccc' },
  section: { paddingHorizontal: 24, marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#fff', marginBottom: 16 },
  cardsContainer: { flexDirection: 'row' },
  card: {
    width: 220,
    height: 130,
    borderRadius: 14,
    marginRight: 16,
    padding: 14,
    justifyContent: 'space-between',
    backgroundColor: '#015958'
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between' },
  cardBank: { fontSize: 13, fontWeight: '700', color: 'white' },
  cardType: { fontSize: 11, fontWeight: '600', color: 'white' },
  cardNumberContainer: { flexDirection: 'row', justifyContent: 'space-between' },
  cardNumberPart: { fontSize: 15, color: 'white' },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between' },
  cardExpiry: { fontSize: 11, color: 'white' },
  cardBalance: { fontSize: 18, fontWeight: '700', color: 'white' },
  quickActions: { paddingHorizontal: 24, marginBottom: 24 },
  actionButton: { marginVertical: 10 },
  actionButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 10,
    paddingHorizontal: 24,
  },
  actionButtonText: { fontSize: 16, fontWeight: '700', color: 'white', marginLeft: 10 },
  bottomMenu: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    backgroundColor: '#011F1F',
  },
  menuButton: { alignItems: 'center' },
  menuButtonText: { fontSize: 12, color: '#ffffff', marginTop: 4 },
});

export default MenuScreen;
