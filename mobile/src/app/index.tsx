import { Image } from 'expo-image';
import { router } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function HomeScreen() {
  return (
    <View style={styles.container}>

      <View style={styles.hero}>

        <View style={styles.logoBox}>
          <Image
            source={require('../../assets/icon.png')}
            style={styles.logo}
            contentFit="contain"
          />
        </View>

        <Text style={styles.title}>
          Welcome to AgriConnect 🌱
        </Text>

        <View style={styles.messageCard}>

          <Text style={styles.message}>
            Your farming journey matters to us.
          </Text>

          <Text style={styles.messageSecondary}>
            Here, you can find the guidance, information, and support you need for your farm.
          </Text>

          <Text style={styles.message}>
            We warmly welcome you to AgriConnect. ❤️
          </Text>

        </View>

      </View>

      <View style={styles.actions}>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push('/profile-setup')}
        >
          <Text style={styles.buttonText}>
            Get Started
          </Text>
        </TouchableOpacity>

        <View style={styles.loginRow}>
          <Text style={styles.loginText}>
            Already have an account?
          </Text>

          <TouchableOpacity
            onPress={() => router.push('/login')}
          >
            <Text style={styles.loginButton}>
              Login
            </Text>
          </TouchableOpacity>
        </View>

      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F3EA',
    paddingHorizontal: 25,
    justifyContent: 'center',
  },

  hero: {
    alignItems: 'center',
  },

  logoBox: {
    width: 200,
    height: 200,
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#F2C94C',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 25,
  },

  logo: {
    width: 180,
    height: 180,
  },

  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1B5E20',
    textAlign: 'center',
    marginBottom: 20,
  },

  messageCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#DDDDDD',
    paddingVertical: 20,
    paddingHorizontal: 18,
  },

  message: {
    fontSize: 16,
    color: '#333333',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 10,
  },

  messageSecondary: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 10,
  },

  actions: {
    marginTop: 25,
  },

  button: {
    backgroundColor: '#2E7D32',
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: 'bold',
  },

  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 18,
  },

  loginText: {
    color: '#555555',
    fontSize: 14,
  },

  loginButton: {
    color: '#2E7D32',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 5,
  },
});