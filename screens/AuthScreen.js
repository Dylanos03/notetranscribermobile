import { StyleSheet, Text, View, TouchableOpacity, Animated } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef } from 'react';

export default function AuthScreen({ navigation }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleGoogleLogin = () => {
    // TODO: Implement Google OAuth
    console.log('Google login pressed');
    // For now, just navigate to home
    navigation.navigate('Home');
  };

  const handleAppleLogin = () => {
    // TODO: Implement Apple OAuth
    console.log('Apple login pressed');
    // For now, just navigate to home
    navigation.navigate('Home');
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.6}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }
        ]}
      >
        {/* Title Section */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>Sign In</Text>
          <Text style={styles.subtitle}>
            Choose your preferred sign-in method
          </Text>
        </View>

        {/* OAuth Buttons */}
        <View style={styles.buttonContainer}>
          {/* Google Sign In */}
          <TouchableOpacity
            style={[styles.oauthButton, styles.googleButton]}
            onPress={handleGoogleLogin}
            activeOpacity={0.8}
          >
            <View style={styles.buttonContent}>
              <View style={[styles.iconPlaceholder, styles.googleIcon]}>
                <Text style={styles.iconText}>G</Text>
              </View>
              <Text style={styles.oauthButtonText}>Continue with Google</Text>
            </View>
          </TouchableOpacity>

          {/* Apple Sign In */}
          <TouchableOpacity
            style={[styles.oauthButton, styles.appleButton]}
            onPress={handleAppleLogin}
            activeOpacity={0.8}
          >
            <View style={styles.buttonContent}>
              <View style={[styles.iconPlaceholder, styles.appleIcon]}>
                <Text style={styles.iconTextWhite}></Text>
              </View>
              <Text style={styles.oauthButtonTextWhite}>Continue with Apple</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Info Text */}
        <Text style={styles.infoText}>
          Sign in to save your notes to Notion and access them across all your devices
        </Text>
      </Animated.View>

      {/* Terms */}
      <View style={styles.termsContainer}>
        <Text style={styles.termsText}>
          By continuing, you agree to our{' '}
          <Text style={styles.termsLink}>Terms of Service</Text>
          {' '}and{' '}
          <Text style={styles.termsLink}>Privacy Policy</Text>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FB',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  backButtonText: {
    fontSize: 28,
    color: '#1A1A1A',
  },
  content: {
    flex: 1,
    paddingHorizontal: 32,
    justifyContent: 'center',
  },
  titleSection: {
    marginBottom: 48,
  },
  title: {
    fontSize: 36,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 17,
    color: '#6B7280',
    lineHeight: 24,
  },
  buttonContainer: {
    gap: 16,
    marginBottom: 32,
  },
  oauthButton: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  googleButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  appleButton: {
    backgroundColor: '#000000',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconPlaceholder: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  googleIcon: {
    backgroundColor: '#FFFFFF',
  },
  appleIcon: {
    backgroundColor: '#FFFFFF',
  },
  iconText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#4285F4',
  },
  iconTextWhite: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000000',
  },
  oauthButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  oauthButtonTextWhite: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  infoText: {
    marginTop: 32,
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 20,
  },
  termsContainer: {
    paddingHorizontal: 32,
    paddingBottom: 32,
  },
  termsText: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 18,
  },
  termsLink: {
    color: '#8B5CF6',
    fontWeight: '500',
  },
});
