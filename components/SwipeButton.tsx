import React from 'react';
import { StyleSheet, View, Text, Dimensions } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolate,
  Extrapolate,
  runOnJS,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { ChevronRight } from 'lucide-react-native';
import { AppleColors, AppleBorderRadius } from '../constants/AppleTheme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const BUTTON_WIDTH = SCREEN_WIDTH - 64; // Matching standard padding
const BUTTON_HEIGHT = 64;
const THUMB_SIZE = 52;
const SWIPE_RANGE = BUTTON_WIDTH - THUMB_SIZE - 12; // 6px padding on each side

interface SwipeButtonProps {
  title?: string;
  onSwipeComplete: () => void;
}

export const SwipeButton: React.FC<SwipeButtonProps> = ({ 
  title = 'Swipe to get started', 
  onSwipeComplete 
}) => {
  const translateX = useSharedValue(0);
  const isComplete = useSharedValue(false);

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      if (isComplete.value) return;
      
      // Limit translation between 0 and SWIPE_RANGE
      translateX.value = Math.max(0, Math.min(event.translationX, SWIPE_RANGE));
      
      // Subtle haptic as we move
      if (translateX.value > 0 && translateX.value < SWIPE_RANGE) {
        // Optional: Add very light haptics here if desired
      }
    })
    .onEnd(() => {
      if (isComplete.value) return;

      if (translateX.value > SWIPE_RANGE * 0.8) {
        // Success!
        translateX.value = withSpring(SWIPE_RANGE, { damping: 20, stiffness: 200 });
        isComplete.value = true;
        
        runOnJS(Haptics.notificationAsync)(Haptics.NotificationFeedbackType.Success);
        runOnJS(onSwipeComplete)();
      } else {
        // Snap back
        translateX.value = withSpring(0, { damping: 20, stiffness: 200 });
        runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Light);
      }
    });

  const thumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const textStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      translateX.value,
      [0, SWIPE_RANGE * 0.5],
      [1, 0],
      Extrapolate.CLAMP
    ),
    transform: [
      {
        translateX: interpolate(
          translateX.value,
          [0, SWIPE_RANGE],
          [0, 20],
          Extrapolate.CLAMP
        ),
      },
    ],
  }));

  const trackStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolate(
      translateX.value,
      [0, SWIPE_RANGE],
      [0.05, 0.15],
      Extrapolate.CLAMP
    ).toString(), // This is a bit tricky with Reanimated colors, using hex/rgba is better
  }));

  return (
    <View style={styles.container}>
      <View style={styles.track}>
        <Animated.View style={[styles.textWrapper, textStyle]}>
          <Text style={styles.title}>{title}</Text>
        </Animated.View>

        <GestureDetector gesture={panGesture}>
          <Animated.View style={[styles.thumb, thumbStyle]}>
            <View style={styles.thumbInner}>
              <ChevronRight color="white" size={24} strokeWidth={3} />
            </View>
          </Animated.View>
        </GestureDetector>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: BUTTON_HEIGHT,
    marginVertical: 12,
  },
  track: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: BUTTON_HEIGHT / 2,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    padding: 6,
  },
  thumb: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    backgroundColor: AppleColors.systemGreen, // GROWTH
    shadowColor: AppleColors.systemGreen,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
    zIndex: 10,
  },
  thumbInner: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textWrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  title: {
    color: 'rgba(255, 255, 255, 0.4)',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: -0.2,
    textTransform: 'uppercase',
  },
});
