import { StyleSheet, Text, View, TouchableOpacity, Animated } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef } from 'react';

export default function ConfirmationScreen({ navigation }) {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const checkmarkAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Success animation sequence
    Animated.sequence([
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 6,
          tension: 40,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(checkmarkAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleOk = () => {
    navigation.navigate('Home');
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <Animated.View
        style={[
          styles.content,
          { opacity: fadeAnim }
        ]}
      >
        {/* Success Icon */}
        <Animated.View
          style={[
            styles.iconContainer,
            { transform: [{ scale: scaleAnim }] }
          ]}
        >
          <View style={styles.successCircle}>
            <Animated.View
              style={{
                opacity: checkmarkAnim,
                transform: [
                  {
                    scale: checkmarkAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.5, 1],
                    }),
                  },
                ],
              }}
            >
              <View style={styles.checkmark}>
                <View style={styles.checkmarkStem} />
                <View style={styles.checkmarkKick} />
              </View>
            </Animated.View>
          </View>
        </Animated.View>

        {/* Success Message */}
        <View style={styles.messageContainer}>
          <Text style={styles.successTitle}>Note Saved Successfully!</Text>
          <Text style={styles.successSubtitle}>
            Your voice note has been transcribed, polished, and saved to Notion
          </Text>
        </View>

        {/* Success Details */}
        <View style={styles.detailsContainer}>
          <View style={styles.detailItem}>
            <View style={styles.detailIcon}>
              <View style={styles.detailIconCircle} />
            </View>
            <Text style={styles.detailText}>Transcribed with AI</Text>
          </View>
          <View style={styles.detailItem}>
            <View style={styles.detailIcon}>
              <View style={styles.detailIconCircle} />
            </View>
            <Text style={styles.detailText}>Text polished & formatted</Text>
          </View>
          <View style={styles.detailItem}>
            <View style={styles.detailIcon}>
              <View style={styles.detailIconCircle} />
            </View>
            <Text style={styles.detailText}>Saved to your Notion workspace</Text>
          </View>
        </View>
      </Animated.View>

      {/* Bottom Button */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={styles.okButton}
          onPress={handleOk}
          activeOpacity={0.8}
        >
          <Text style={styles.okButtonText}>Done</Text>
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
  iconContainer: {
    marginBottom: 40,
  },
  successCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#D1FAE5',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#10B981',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  checkmark: {
    width: 60,
    height: 60,
    position: 'relative',
  },
  checkmarkStem: {
    position: 'absolute',
    width: 6,
    height: 32,
    backgroundColor: '#10B981',
    borderRadius: 3,
    left: 28,
    top: 18,
    transform: [{ rotate: '45deg' }],
  },
  checkmarkKick: {
    position: 'absolute',
    width: 6,
    height: 16,
    backgroundColor: '#10B981',
    borderRadius: 3,
    left: 16,
    top: 30,
    transform: [{ rotate: '-45deg' }],
  },
  messageContainer: {
    marginBottom: 48,
    alignItems: 'center',
  },
  successTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 12,
    textAlign: 'center',
  },
  successSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  detailsContainer: {
    width: '100%',
    maxWidth: 320,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  detailIcon: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  detailIconCircle: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
  },
  detailText: {
    fontSize: 15,
    color: '#4B5563',
    fontWeight: '500',
  },
  bottomContainer: {
    paddingHorizontal: 32,
    paddingBottom: 48,
  },
  okButton: {
    backgroundColor: '#8B5CF6',
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#8B5CF6',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  okButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
});
