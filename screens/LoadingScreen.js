import { StyleSheet, Text, View, Animated } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef } from 'react';

export default function LoadingScreen({ route, navigation }) {
  const { audioUri } = route.params;
  const spinAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();

    // Spinning animation
    Animated.loop(
      Animated.timing(spinAnim, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      })
    ).start();

    // Pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Navigate to confirmation after 3 seconds
    const timer = setTimeout(() => {
      navigation.navigate('Confirmation');
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const spin = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <Animated.View
        style={[
          styles.content,
          { opacity: fadeAnim }
        ]}
      >
        {/* Loading Spinner */}
        <Animated.View
          style={[
            styles.spinnerContainer,
            { transform: [{ scale: pulseAnim }] }
          ]}
        >
          <Animated.View
            style={[
              styles.spinner,
              { transform: [{ rotate: spin }] }
            ]}
          >
            <View style={styles.spinnerArc} />
          </Animated.View>
        </Animated.View>

        {/* Loading Text */}
        <View style={styles.textContainer}>
          <Text style={styles.loadingTitle}>Processing Your Note</Text>
          <Text style={styles.loadingSubtitle}>
            Transcribing and polishing your recording...
          </Text>
        </View>

        {/* Loading Steps */}
        <View style={styles.stepsContainer}>
          <View style={styles.stepItem}>
            <View style={[styles.stepDot, styles.stepDotActive]} />
            <Text style={styles.stepText}>Transcribing audio</Text>
          </View>
          <View style={styles.stepItem}>
            <View style={[styles.stepDot, styles.stepDotActive]} />
            <Text style={styles.stepText}>Polishing text</Text>
          </View>
          <View style={styles.stepItem}>
            <View style={styles.stepDot} />
            <Text style={[styles.stepText, styles.stepTextInactive]}>Saving to Notion</Text>
          </View>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  spinnerContainer: {
    marginBottom: 48,
  },
  spinner: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    borderColor: '#E9D5FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  spinnerArc: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    borderColor: 'transparent',
    borderTopColor: '#8B5CF6',
    borderRightColor: '#8B5CF6',
  },
  textContainer: {
    marginBottom: 48,
    alignItems: 'center',
  },
  loadingTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 12,
    textAlign: 'center',
  },
  loadingSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  stepsContainer: {
    width: '100%',
    maxWidth: 300,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  stepDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#E5E7EB',
    marginRight: 12,
  },
  stepDotActive: {
    backgroundColor: '#8B5CF6',
  },
  stepText: {
    fontSize: 15,
    color: '#4B5563',
    fontWeight: '500',
  },
  stepTextInactive: {
    color: '#9CA3AF',
  },
});
