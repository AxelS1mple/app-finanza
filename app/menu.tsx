import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  Animated, 
  Image, 
  ScrollView,
  Dimensions,
  SafeAreaView
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialIcons, FontAwesome } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

const { width } = Dimensions.get('window');

interface Tarjeta {
  id: string;
  tipo: string;
  banco: string;
  numero: string;
  saldo: number;
  fecha_expiracion: string;
  color: string;
}

interface User {
  id: number;
  username: string;
  password: string;
  name: string;
  edad: number;
  tarjetas: Tarjeta[];
  avatar?: string;
}

const MenuScreen = () => {
  const router = useRouter();
  const { name } = useLocalSearchParams();
  const [userData, setUserData] = useState<User | null>(null);
  const fadeAnim = new Animated.Value(0);
  const slideAnim = new Animated.Value(30);

  useEffect(() => {
    // Animación de entrada
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      })
    ]).start();

    // Datos de usuario con más detalle
    const users: User[] = [
      {
        id: 1,
        username: 'axel',
        password: '123',
        name: 'Axel',
        edad: 20,
        avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
        tarjetas: [
          {
            id: 'card1',
            tipo: 'Crédito',
            banco: 'Banco Nacional',
            numero: '1234 5678 9012 3456',
            saldo: 5000.00,
            fecha_expiracion: '12/25',
            color: '#3a7bd5'
          },
          {
            id: 'card2',
            tipo: 'Débito',
            banco: 'Banco Local',
            numero: '9876 5432 1098 7654',
            saldo: 1200.00,
            fecha_expiracion: '05/24',
            color: '#00d2ff'
          }
        ]
      },
      {
        id: 2,
        username: 'usuario2',
        password: 'securePass456',
        name: 'María López',
        edad: 25,
        avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
        tarjetas: [
          {
            id: 'card1',
            tipo: 'Crédito',
            banco: 'BBVA',
            numero: '1111 2222 3333 4444',
            saldo: 1500.00,
            fecha_expiracion: '08/26',
            color: '#a8ff78'
          }
        ]
      }
    ];

    const user = users.find((u) => u.name === name);
    setUserData(user || null);
  }, [name]);

  const handleAddCard = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push(`/agregartarjeta?name=${userData?.name}`);
  };

  const handleCardPress = (tarjetaId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push(`/detalletarjeta?tarjetaId=${tarjetaId}&userName=${userData?.name}`);
  };

  const handleProfilePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push(`/perfil?name=${userData?.name}`);
  };

  const handleLogout = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push('/');
  };

  const renderCard = ({ item }: { item: Tarjeta }) => (
    <TouchableOpacity 
      onPress={() => handleCardPress(item.id)}
      activeOpacity={0.9}
    >
      <LinearGradient
        colors={[item.color, darkenColor(item.color, 20)]}
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
            <Text key={index} style={styles.cardNumberPart}>
              {part}
            </Text>
          ))}
        </View>
        
        <View style={styles.cardFooter}>
          <Text style={styles.cardExpiry}>Expira {item.fecha_expiracion}</Text>
          <Text style={styles.cardBalance}>${item.saldo.toFixed(2)}</Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  if (!userData) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Cargando...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient
        colors={['#f5f7fa', '#e4e8f0']}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Animated.View 
            style={[
              styles.header,
              { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
            ]}
          >
            <View style={styles.userInfo}>
              <Image
                source={{ uri: userData.avatar }}
                style={styles.avatar}
              />
              <View>
                <Text style={styles.welcomeText}>Bienvenido</Text>
                <Text style={styles.userName}>{userData.name}</Text>
              </View>
            </View>
            
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{userData.tarjetas.length}</Text>
                <Text style={styles.statLabel}>Tarjetas</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>
                  ${userData.tarjetas.reduce((sum, card) => sum + card.saldo, 0).toFixed(2)}
                </Text>
                <Text style={styles.statLabel}>Saldo total</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{userData.edad}</Text>
                <Text style={styles.statLabel}>Edad</Text>
              </View>
            </View>
          </Animated.View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Tus tarjetas</Text>
            {userData.tarjetas.length > 0 ? (
              <FlatList
                data={userData.tarjetas}
                renderItem={renderCard}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.cardsContainer}
              />
            ) : (
              <View style={styles.emptyCards}>
                <Ionicons name="card-outline" size={48} color="#ccc" />
                <Text style={styles.emptyText}>No tienes tarjetas registradas</Text>
              </View>
            )}
          </View>

          <View style={styles.quickActions}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={handleAddCard}
            >
              <LinearGradient
                colors={['#0CABA8', '#008F8C']}
                style={styles.actionButtonGradient}
              >
                <MaterialIcons name="add-card" size={24} color="white" />
                <Text style={styles.actionButtonText}>Agregar tarjeta</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </ScrollView>

        <View style={styles.bottomMenu}>
          <TouchableOpacity 
            style={styles.menuButton}
            onPress={handleProfilePress}
          >
            <Ionicons name="person-outline" size={24} color="#0CABA8" />
            <Text style={styles.menuButtonText}>Perfil</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.menuButton}
            onPress={handleLogout}
          >
            <Ionicons name="log-out-outline" size={24} color="#ff6b6b" />
            <Text style={[styles.menuButtonText, { color: '#ff6b6b' }]}>Salir</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

// Función auxiliar para oscurecer colores
const darkenColor = (color: string, percent: number) => {
  // Implementación simplificada - en una app real usarías una librería como polished
  return color; // Retornamos el mismo color por simplicidad
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 80,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f7fa',
  },
  loadingText: {
    fontSize: 18,
    color: '#666',
  },
  header: {
    padding: 24,
    paddingTop: 16,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
    borderWidth: 2,
    borderColor: '#0CABA8',
  },
  welcomeText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  userName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  statItem: {
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0CABA8',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  section: {
    marginTop: 8,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  cardsContainer: {
    paddingBottom: 8,
  },
  card: {
    width: width * 0.75,
    height: 200,
    borderRadius: 16,
    padding: 20,
    marginRight: 16,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardBank: {
    fontSize: 16,
    fontWeight: '700',
    color: 'white',
  },
  cardType: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  cardNumberContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 20,
  },
  cardNumberPart: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
    marginHorizontal: 6,
    letterSpacing: 1,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  cardExpiry: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  cardBalance: {
    fontSize: 22,
    fontWeight: '700',
    color: 'white',
  },
  emptyCards: {
    height: 160,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 16,
    marginTop: 8,
  },
  emptyText: {
    marginTop: 12,
    color: '#999',
    fontSize: 16,
  },
  quickActions: {
    paddingHorizontal: 24,
    marginTop: 24,
  },
  actionButton: {
    borderRadius: 12,
    overflow: 'hidden',
    height: 60,
    shadowColor: '#0CABA8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  actionButtonGradient: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 12,
  },
  bottomMenu: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'white',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  menuButton: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  menuButtonText: {
    marginTop: 4,
    fontSize: 12,
    color: '#0CABA8',
    fontWeight: '500',
  },
});

export default MenuScreen;