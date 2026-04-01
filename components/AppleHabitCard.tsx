import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  useWindowDimensions,
  Pressable,
} from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import * as LucideIcons from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { AppleColors, AppleTypography, AppleShadows, AppleSpacing } from '../constants/AppleTheme';

// const { width: SCREEN_WIDTH } = Dimensions.get('window'); // Replaced by hook

// ─── Safe Icon Component ─────────────────────────────────────────────────────
const SafeIcon = ({ name, size, color }: { name: string; size: number; color: string }) => {
  const IconComponent = (LucideIcons as any)[name] || LucideIcons.Activity;
  try {
    return React.createElement(IconComponent, { size, color });
  } catch (error) {
    console.error(`Error rendering icon ${name}:`, error);
    return <LucideIcons.Activity size={size} color={color} />;
  }
};

interface HabitCardProps {
  id: string;
  title: string;
  description?: string;
  streak: number;
  isCompleted: boolean;
  trackedToday: boolean;
  color?: string;
  icon?: string;
  onPress?: () => void;
  onComplete?: () => void;
  onFail?: () => void;
}

export const AppleHabitCard: React.FC<HabitCardProps> = ({
  title,
  description,
  streak,
  isCompleted,
  trackedToday,
  color = AppleColors.primary,
  icon,
  onPress,
  onComplete,
  onFail,
}) => {
  const { width: SCREEN_WIDTH } = useWindowDimensions();
  const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.3;
  const translateX = useSharedValue(0);
  const hasTriggeredHaptic = useSharedValue(0); // 0=none, 1=right, 2=left

  const handleHaptic = (type: number) => {
    'worklet';
    if (hasTriggeredHaptic.value !== type) {
      hasTriggeredHaptic.value = type;
      runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Medium);
    }
  };

  const handleCompleteJS = () => {
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      if (onComplete) onComplete();
    } catch (e) {
      console.error('onComplete error:', e);
    }
  };

  const handleFailJS = () => {
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      if (onFail) onFail();
    } catch (e) {
      console.error('onFail error:', e);
    }
  };

  const gesture = Gesture.Pan()
    .enabled(!trackedToday)
    .activeOffsetX([-10, 10])
    .onUpdate((event) => {
      translateX.value = event.translationX;

      if (event.translationX > SWIPE_THRESHOLD) {
        handleHaptic(1);
      } else if (event.translationX < -SWIPE_THRESHOLD) {
        handleHaptic(2);
      } else {
        hasTriggeredHaptic.value = 0;
      }
    })
    .onEnd((event) => {
      if (event.translationX > SWIPE_THRESHOLD) {
        translateX.value = withSpring(SCREEN_WIDTH, { velocity: event.velocityX });
        runOnJS(handleCompleteJS)();
      } else if (event.translationX < -SWIPE_THRESHOLD) {
        translateX.value = withSpring(-SCREEN_WIDTH, { velocity: event.velocityX });
        runOnJS(handleFailJS)();
      } else {
        hasTriggeredHaptic.value = 0;
        translateX.value = withSpring(0);
      }
    });

  const rStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
    opacity: trackedToday ? 0.6 : 1,
  }));

  return (
    <View style={styles.container}>
      {/* Background Actions - Only show if not tracked */}
      {!trackedToday && (
        <View style={styles.backgroundContainer}>
          <View style={[styles.actionSide, styles.doneSide]}>
            <LucideIcons.CheckCircle2 size={24} color="white" />
            <Text style={styles.actionText}>DONE</Text>
          </View>
          <View style={[styles.actionSide, styles.missedSide]}>
            <Text style={styles.actionText}>MISSED</Text>
            <LucideIcons.XCircle size={24} color="white" />
          </View>
        </View>
      )}

      <GestureDetector gesture={gesture}>
        <Animated.View style={[styles.card, rStyle]}>
          <View style={styles.content}>
            <View style={[styles.iconContainer, { backgroundColor: isCompleted ? color : `${color}20` }]}>
              <SafeIcon name={icon || 'Activity'} size={20} color={isCompleted ? '#FFF' : color} />
            </View>

            <View style={styles.info}>
              <Text style={styles.title} numberOfLines={1}>
                {title}
              </Text>
              {description && (
                <Text style={styles.description} numberOfLines={2}>
                  {description}
                </Text>
              )}
            </View>

            {streak > 0 && !trackedToday && (
              <View style={[styles.streakBadge, { backgroundColor: color }]}>
                <Text style={styles.streakEmoji}>🔥</Text>
                <Text style={styles.streakText}>{streak}</Text>
              </View>
            )}
          </View>



          {/* Watermark Overlay */}
          {trackedToday && (
            <View style={styles.watermarkOverlay}>
              <View style={[
                styles.watermarkBadge,
                { backgroundColor: isCompleted ? AppleColors.systemGreen : AppleColors.systemRed }
              ]}>
                <Text style={styles.watermarkText}>{isCompleted ? 'DONE' : 'MISSED'}</Text>
              </View>
            </View>
          )}
        </Animated.View>
      </GestureDetector>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: AppleSpacing.base,
    marginVertical: 4,
    height: 85,
    justifyContent: 'center',
  },
  backgroundContainer: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: '#000',
  },
  actionSide: {
    flex: 1,
    height: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    gap: 12,
  },
  doneSide: {
    backgroundColor: AppleColors.systemGreen,
    justifyContent: 'flex-start',
  },
  missedSide: {
    backgroundColor: AppleColors.systemRed,
    justifyContent: 'flex-end',
  },
  actionText: {
    ...AppleTypography.caption1,
    fontWeight: '900',
    color: 'white',
    letterSpacing: 2,
    fontSize: 13,
  },
  card: {
    backgroundColor: AppleColors.background.secondary,
    borderRadius: 24,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    ...AppleShadows.level1,
    height: '100%',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  iconEmoji: {
    fontSize: 24,
  },
  info: {
    flex: 1,
    marginRight: AppleSpacing.sm,
    justifyContent: 'center',
  },
  title: {
    ...AppleTypography.bodyLarge,
    fontWeight: '700',
    color: AppleColors.label.primary,
    marginBottom: 2,
    letterSpacing: -0.2,
  },
  description: {
    ...AppleTypography.caption1,
    fontWeight: '500',
    color: AppleColors.label.tertiary,
    letterSpacing: 0.2,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  streakEmoji: {
    fontSize: 12,
    marginRight: 4,
  },
  streakText: {
    ...AppleTypography.caption2,
    fontWeight: '800',
    color: AppleColors.label.secondary,
  },

  watermarkOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 24,
    zIndex: 10,
  },
  watermarkBadge: {
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 20,
    transform: [{ rotate: '-10deg' }],
    borderWidth: 4,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 10,
  },
  watermarkText: {
    ...AppleTypography.title2,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 4,
  },
});
