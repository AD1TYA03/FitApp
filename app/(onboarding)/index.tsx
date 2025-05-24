import { useRouter } from 'expo-router';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';

export default function Page1() {
  const router = useRouter();

  return (
    <ImageBackground
      source={require('../../assets/images/fitness_image.png')}
      style={styles.background}
      resizeMode="cover"
    >
      {/* Dark Overlay */}
      <View style={styles.overlay} />

      {/* Centered Content */}
      <View style={styles.content}>
        <Text style={styles.brand}>
          <Text style={{ color: 'red' }}>FIT</Text>Bharat
        </Text>
        <Text style={styles.quote}>“Consistency is what transforms average into excellence.”</Text>
      </View>

      {/* Button */}
      <TouchableOpacity style={styles.button} onPress={() => router.push('/page2')}>
        <Text style={styles.buttonText}>Start Now</Text>
      </TouchableOpacity>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Darker overlay for better contrast
  },
  content: {
    alignItems: 'center',
    marginTop: '-20%', // Centers text vertically
  },
  brand: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  quote: {
    fontSize: 16,
    color: '#f1f1f1',
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: 10,
    paddingHorizontal: 30,
  },
  button: {
    position: 'absolute',
    bottom: 60,
    backgroundColor: '#FFD700',
    paddingVertical: 14,
    paddingHorizontal: 60,
    borderRadius: 25,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
  },
  buttonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
