import { router } from 'expo-router';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import AuthFlow from './AuthFlow';

export default function AuthIndex() {
  return <AuthFlow/> ;
//    (
//     <ImageBackground source={require('../../assets/images/bench_press.png')} style={styles.background}>
//       <View style={styles.overlay} />

//       <View style={styles.container}>
//         <Text style={styles.title}>Welcome to FitBharat</Text>
//         <Text style={styles.subtitle}>Your fitness journey starts here.</Text>

//         <TouchableOpacity style={styles.button} onPress={() => router.push('/login')}>
//           <Text style={styles.buttonText}>Login</Text>
//         </TouchableOpacity>

//         <TouchableOpacity style={[styles.button, styles.signupButton]} onPress={() => router.push('/signup')}>
//           <Text style={[styles.buttonText, styles.signupText]}>Sign Up</Text>
//         </TouchableOpacity>

//         <Text style={styles.footerText}>
//           By continuing, you agree to our <Text style={styles.link}>Terms & Privacy Policy</Text>.
//         </Text>
//       </View>
//     </ImageBackground>
//   );
}

// const styles = StyleSheet.create({
//   background: {
//     flex: 1,
//     resizeMode: 'cover',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   overlay: {
//     ...StyleSheet.absoluteFillObject,
//     backgroundColor: 'rgba(0, 0, 0, 0.4)', // Dark overlay for text visibility
//   },
//   container: {
//     width: '85%',
//     alignItems: 'center',
//   },
//   title: {
//     fontSize: 28,
//     fontWeight: 'bold',
//     color: '#fff',
//     marginBottom: 10,
//   },
//   subtitle: {
//     fontSize: 16,
//     color: '#ddd',
//     marginBottom: 30,
//     textAlign: 'center',
//   },
//   button: {
//     width: '100%',
//     backgroundColor: '#007AFF',
//     paddingVertical: 12,
//     borderRadius: 25,
//     alignItems: 'center',
//     marginBottom: 15,
//     shadowColor: '#007AFF',
//     shadowOffset: { width: 0, height: 3 },
//     shadowOpacity: 0.3,
//     shadowRadius: 4,
//     elevation: 5,
//   },
//   buttonText: {
//     fontSize: 18,
//     color: '#fff',
//     fontWeight: 'bold',
//   },
//   signupButton: {
//     backgroundColor: 'transparent',
//     borderWidth: 2,
//     borderColor: '#fff',
//   },
//   signupText: {
//     color: '#fff',
//   },
//   footerText: {
//     fontSize: 12,
//     color: '#ccc',
//     textAlign: 'center',
//     marginTop: 20,
//   },
//   link: {
//     color: '#fff',
//     fontWeight: 'bold',
//   },
// });
