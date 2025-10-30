import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, Animated, Alert } from 'react-native';
import { useState, useRef, useEffect } from 'react';
import { Audio } from 'expo-av';

export default function HomeScreen({ navigation }) {
  const [isRecording, setIsRecording] = useState(false);
  const [timeLeft, setTimeLeft] = useState(10);
  const [recording, setRecording] = useState(null);
  const [recordingUri, setRecordingUri] = useState(null);
  const [sound, setSound] = useState(null);
  const [audioLevel, setAudioLevel] = useState(0);
  const [waveHeights, setWaveHeights] = useState(Array(25).fill(0));
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const meteringInterval = useRef(null);
  const waveIndex = useRef(0);

  // Request audio permissions on mount
  useEffect(() => {
    (async () => {
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Please grant audio recording permissions to use this app.');
      }
    })();
  }, []);

  // Cleanup sound on unmount
  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  // Pulse animation for the recording button
  useEffect(() => {
    if (isRecording) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isRecording]);

  // Countdown timer
  useEffect(() => {
    let interval = null;

    if (isRecording && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            // Stop recording when time runs out
            stopRecording();
            return 10;
          }
          return prevTime - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isRecording, timeLeft]);

  const startRecording = async () => {
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording: newRecording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY,
        undefined,
        10 // Update metering every 100ms
      );

      setRecording(newRecording);
      setIsRecording(true);
      setTimeLeft(10);

      // Start monitoring audio levels
      newRecording.setOnRecordingStatusUpdate((status) => {
        if (status.metering !== undefined) {
          // Normalize metering value (-160 to 0) to a 0-1 range
          // Metering is in dB, typical range is -160 (silent) to 0 (loudest)
          const normalized = Math.max(0, Math.min(1, (status.metering + 160) / 160));
          // Apply exponential curve for more dramatic effect
          const dramatic = Math.pow(normalized, 2) * 1.5;
          setAudioLevel(dramatic);

          // Update wave animation - shift wave to the right
          setWaveHeights((prevHeights) => {
            const newHeights = [...prevHeights];
            // Shift all values to the right
            for (let i = newHeights.length - 1; i > 0; i--) {
              newHeights[i] = newHeights[i - 1];
            }
            // Add new value on the left
            newHeights[0] = dramatic;
            return newHeights;
          });
        }
      });
    } catch (err) {
      console.error('Failed to start recording', err);
      Alert.alert('Recording Error', 'Failed to start recording. Please try again.');
    }
  };

  const stopRecording = async () => {
    if (!recording) return;

    try {
      setIsRecording(false);
      setAudioLevel(0); // Reset audio level
      setWaveHeights(Array(25).fill(0)); // Reset wave
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setRecordingUri(uri);
      setRecording(null);
      setTimeLeft(10);

      console.log('Recording saved to:', uri);
    } catch (err) {
      console.error('Failed to stop recording', err);
      Alert.alert('Recording Error', 'Failed to stop recording.');
    }
  };

  const handleRecordPress = async () => {
    if (isRecording) {
      await stopRecording();
    } else {
      // Delete previous recording when starting a new one
      if (recordingUri) {
        setRecordingUri(null);
        if (sound) {
          await sound.unloadAsync();
          setSound(null);
        }
      }
      await startRecording();
    }
  };

  const handleReview = () => {
    if (!recordingUri) {
      Alert.alert('No Recording', 'Please record something first.');
      return;
    }

    // Navigate to playback screen with the audio URI
    navigation.navigate('Playback', { audioUri: recordingUri });
  };

  const formatTime = (seconds) => {
    return `00:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Voice Note</Text>
        <Text style={styles.subtitle}>
          {isRecording ? 'Recording your thoughts...' : 'Tap to start recording'}
        </Text>
      </View>

      {/* Main Recording Area */}
      <View style={styles.recordingArea}>
        {/* Waveform Animation */}
        <View style={styles.waveformContainer}>
          {isRecording && waveHeights.map((height, index) => (
            <View
              key={index}
              style={[
                styles.waveLine,
                { height: Math.max(height * 50, 0) }
              ]}
            />
          ))}
        </View>

        {/* Timer */}
        <Text style={styles.timer}>{formatTime(timeLeft)}</Text>

        {/* Recording Button */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handleRecordPress}
          style={styles.buttonWrapper}
        >
          <Animated.View
            style={[
              styles.recordButtonOuter,
              isRecording && styles.recordButtonOuterActive,
              { transform: [{ scale: pulseAnim }] }
            ]}
          >
            <View style={[
              styles.recordButtonInner,
              isRecording && styles.recordButtonInnerActive
            ]}>
              {!isRecording ? (
                <View style={styles.micIcon}>
                  <View style={styles.micCircle} />
                  <View style={styles.micLine} />
                </View>
              ) : (
                <View style={styles.pauseIcon}>
                  <View style={styles.pauseBar} />
                  <View style={styles.pauseBar} />
                </View>
              )}
            </View>
          </Animated.View>
        </TouchableOpacity>

        {/* Status Text */}
        <Text style={styles.statusText}>
          {isRecording ? 'Tap to stop' : 'Ready to record'}
        </Text>
      </View>

      {/* Bottom Info */}
      <View style={styles.bottomInfo}>
        <Text style={styles.infoText}>
          Maximum recording time: 10 seconds
        </Text>
      </View>

      {/* Review Button (Bottom) */}
      {recordingUri && (
        <View style={styles.reviewButtonContainer}>
          <TouchableOpacity
            style={styles.reviewButton}
            onPress={handleReview}
            activeOpacity={0.8}
          >
            <Text style={styles.reviewButtonText}>Review & Send</Text>
          </TouchableOpacity>
        </View>
      )}
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
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '400',
  },
  recordingArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  waveformContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 60,
    marginBottom: 40,
    gap: 6,
    width: '90%',
  },
  waveLine: {
    flex: 1,
    backgroundColor: '#8B5CF6',
    borderRadius: 2,
    minWidth: 2,
  },
  timer: {
    fontSize: 48,
    fontWeight: '300',
    color: '#1A1A1A',
    marginBottom: 60,
    fontVariant: ['tabular-nums'],
  },
  buttonWrapper: {
    marginBottom: 24,
  },
  recordButtonOuter: {
    width: 160,
    height: 160,
    borderRadius: 80,
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
  recordButtonOuterActive: {
    backgroundColor: '#C084FC',
    shadowOpacity: 0.5,
  },
  recordButtonInner: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#8B5CF6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordButtonInnerActive: {
    backgroundColor: '#7C3AED',
  },
  micIcon: {
    alignItems: 'center',
  },
  micCircle: {
    width: 24,
    height: 32,
    borderRadius: 12,
    borderWidth: 3,
    borderColor: '#FFFFFF',
    marginBottom: 4,
  },
  micLine: {
    width: 3,
    height: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
  },
  pauseIcon: {
    flexDirection: 'row',
    gap: 8,
  },
  pauseBar: {
    width: 4,
    height: 32,
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
  },
  statusText: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '500',
  },
  bottomInfo: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    alignItems: 'center',
  },
  infoText: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  reviewButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
    paddingBottom: 40,
    backgroundColor: '#F8F9FB',
  },
  reviewButton: {
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
  reviewButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
});
