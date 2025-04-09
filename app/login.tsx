import React, { useState, useEffect, useRef } from 'react';
import { 
  TextInput, 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Animated, 
  KeyboardAvoidingView, 
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
  Dimensions,
  Easing
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient'; // Asegúrate de haber instalado expo-linear-gradient
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

interface User {
  id: string;
  username: string;
  password: string;
  name: string;
}

const LoginScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isFocused, setIsFocused] = useState({
    username: false,
    password: false
  });
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const router = useRouter();

  // Animaciones
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideUpAnim = useRef(new Animated.Value(30)).current;
  const logoScale = useRef(new Animated.Value(1)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Animación de entrada
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
        easing: Easing.out(Easing.ease)
      }),
      Animated.timing(slideUpAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
        easing: Easing.out(Easing.ease)
      })
    ]).start();

    // Fetch de usuarios
    const fetchUsers = async () => {
      try {
        const response = await fetch('https://lemonchiffon-dragonfly-545545.hostingersite.com/api.php?endpoint=usuarios');
        const data = await response.json();
        setUsers(data);
      } catch (err) {
        console.error('Error al obtener usuarios:', err);
        setError('Loding...');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleLogin = () => {
    // Efecto de pulsación del botón
    Animated.sequence([
      Animated.timing(buttonScale, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true
      }),
      Animated.timing(buttonScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true
      })
    ]).start();

    // Validación
    if (!username || !password) {
      setError('Por favor, completa todos los campos');
      shakeAnimation();
      return;
    }

    // Busca el usuario en la lista local
    const user = users.find((u) => u.username === username && u.password === password);

    if (user) {
      // Animación de éxito antes de navegar
      Animated.sequence([
        Animated.timing(logoScale, {
          toValue: 1.1,
          duration: 200,
          useNativeDriver: true
        }),
        Animated.timing(logoScale, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true
        }),
        Animated.delay(300)
      ]).start(() => {
        console.log("id mandando al menu",user.id);
        router.push(`/menu?id=${user.id}`);
      });
    } else {
      setError('Usuario o contraseña incorrectos');
      shakeAnimation();
    }
  };

  const shakeAnimation = () => {
    const shake = new Animated.Value(0);
    
    Animated.sequence([
      Animated.timing(shake, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shake, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(shake, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shake, { toValue: 0, duration: 50, useNativeDriver: true })
    ]).start();
    
    return shake;
  };

  const handleFocus = (field: 'username' | 'password') => {
    setIsFocused({ ...isFocused, [field]: true });
  };

  const handleBlur = (field: 'username' | 'password') => {
    setIsFocused({ ...isFocused, [field]: false });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <LinearGradient
          colors={['#015958', '#023535', '#011F1F']}
          style={styles.gradient}
        >
          <Animated.View 
            style={[styles.content, { opacity: fadeAnim, transform: [{ translateY: slideUpAnim }] }]}
          >
            <Animated.View style={{ transform: [{ scale: logoScale }] }}>
              <Image 
                source={require('../assets/images/logo.png')} // Reemplaza con tu logo
                style={styles.logo}
                resizeMode="contain"
              />
            </Animated.View>

            <Text style={styles.title}>Bienvenido</Text>
            <Text style={styles.subtitle}>Inicia sesión para continuar</Text>

            <View style={styles.formContainer}>
              <View style={[styles.inputContainer, isFocused.username && styles.inputContainerFocused]}>
                <Ionicons 
                  name="person-outline" 
                  size={20} 
                  color={isFocused.username ? '#0CABA8' : '#aaa'} 
                  style={styles.icon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Nombre de usuario"
                  placeholderTextColor="#aaa"
                  value={username}
                  onChangeText={setUsername}
                  onFocus={() => handleFocus('username')}
                  onBlur={() => handleBlur('username')}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>

              <View style={[styles.inputContainer, isFocused.password && styles.inputContainerFocused]}>
                <Ionicons 
                  name="lock-closed-outline" 
                  size={20} 
                  color={isFocused.password ? '#0CABA8' : '#aaa'} 
                  style={styles.icon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Contraseña"
                  placeholderTextColor="#aaa"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={secureTextEntry}
                  onFocus={() => handleFocus('password')}
                  onBlur={() => handleBlur('password')}
                />
                <TouchableOpacity 
                  onPress={() => setSecureTextEntry(!secureTextEntry)}
                  style={styles.eyeIcon}
                >
                  <Ionicons 
                    name={secureTextEntry ? 'eye-off-outline' : 'eye-outline'} 
                    size={20} 
                    color="#aaa" 
                  />
                </TouchableOpacity>
              </View>

              {error ? (
                <Animated.View style={[styles.errorContainer, { transform: [{ translateX: shakeAnimation() }] }]}>
                  <Ionicons name="alert-circle" size={16} color="#ff6b6b" />
                  <Text style={styles.errorText}>{error}</Text>
                </Animated.View>
              ) : null}

              <TouchableOpacity 
                onPress={handleLogin}
                activeOpacity={0.8}
              >
                <Animated.View style={[styles.button, { transform: [{ scale: buttonScale }] }]}>
                  <LinearGradient
                    colors={['#0CABA8', '#008F8C']}
                    style={styles.buttonGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    <Text style={styles.buttonText}>Acceder</Text>
                    <Ionicons name="arrow-forward" size={20} color="#fff" />
                  </LinearGradient>
                </Animated.View>
              </TouchableOpacity>

              <View style={styles.footer}>
                <TouchableOpacity>
                  <Text style={styles.footerText}>¿Olvidaste tu contraseña?</Text>
                </TouchableOpacity>
                <View style={styles.divider} />
                <TouchableOpacity>
                  <Text style={styles.footerText}>Crear una cuenta</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Animated.View>
        </LinearGradient>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  content: {
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 8,
    fontFamily: 'Roboto', // Usa tu fuente preferida
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 32,
    fontFamily: 'Roboto', // Usa tu fuente preferida
  },
  formContainer: {
    width: '100%',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    height: 56,
  },
  inputContainerFocused: {
    borderColor: '#0CABA8',
    backgroundColor: 'rgba(12, 171, 168, 0.1)',
  },
  icon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: '100%',
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Roboto', // Usa tu fuente preferida
  },
  eyeIcon: {
    padding: 8,
  },
  button: {
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 24,
    elevation: 5,
    shadowColor: '#0CABA8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginRight: 8,
    fontFamily: 'Roboto', // Usa tu fuente preferida
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  errorText: {
    color: '#ff6b6b',
    marginLeft: 8,
    fontSize: 14,
    fontFamily: 'Roboto', // Usa tu fuente preferida
  },
  footer: {
    marginTop: 24,
    alignItems: 'center',
  },
  footerText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
    textDecorationLine: 'underline',
    fontFamily: 'Roboto', // Usa tu fuente preferida
  },
  divider: {
    height: 1,
    width: '40%',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginVertical: 12,
  },
});

export default LoginScreen;