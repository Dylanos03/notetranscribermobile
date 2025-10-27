import { StyleSheet, Text, View, TouchableOpacity, Animated } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef } from 'react';

export default function WelcomeScreen({ navigation }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    // Fade in and scale animation on mount
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* Content */}
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          }
        ]}
      >
        {/* Logo/Icon Area */}
        <View style={styles.logoContainer}>
          <View style={styles.logoCircle}>
            <View style={styles.micIcon}>
              <View style={styles.micCircle} />
              <View style={styles.micLine} />
            </View>
          </View>
        </View>

        {/* Headline */}
        <Text style={styles.headline}>
          Turn Voice Notes into{'\n'}Polished Notion Pages
        </Text>

        {/* Subheadline */}
        <Text style={styles.subheadline}>
          Record your thoughts, we'll organize them automatically
        </Text>

        {/* Features List */}
        <View style={styles.featuresList}>
          <View style={styles.featureItem}>
            <View style={styles.featureDot} />
            <Text style={styles.featureText}>Quick 10-second recordings</Text>
          </View>
          <View style={styles.featureItem}>
            <View style={styles.featureDot} />
            <Text style={styles.featureText}>AI-powered transcription</Text>
          </View>
          <View style={styles.featureItem}>
            <View style={styles.featureDot} />
            <Text style={styles.featureText}>Auto-save to Notion</Text>
          </View>
        </View>
      </Animated.View>

      {/* Bottom CTA */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={styles.getStartedButton}
          onPress={() => navigation.navigate('Auth')}
          activeOpacity={0.8}
        >
          <Text style={styles.getStartedText}>Get Started</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FB',
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  logoContainer: {
    marginBottom: 40,
  },
  logoCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#E9D5FF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#8B5CF6',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  micIcon: {
    alignItems: 'center',
  },
  micCircle: {
    width: 32,
    height: 42,
    borderRadius: 16,
    borderWidth: 4,
    borderColor: '#8B5CF6',
    marginBottom: 6,
  },
  micLine: {
    width: 4,
    height: 12,
    backgroundColor: '#8B5CF6',
    borderRadius: 2,
  },
  headline: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1A1A1A',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 40,
  },
  subheadline: {
    fontSize: 17,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 48,
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  featuresList: {
    width: '100%',
    maxWidth: 320,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  featureDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#8B5CF6',
    marginRight: 12,
  },
  featureText: {
    fontSize: 16,
    color: '#4B5563',
    fontWeight: '500',
  },
  bottomContainer: {
    paddingHorizontal: 32,
    paddingBottom: 48,
  },
  getStartedButton: {
    backgroundColor: '#8B5CF6',
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#8B5CF6',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  getStartedText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
});
