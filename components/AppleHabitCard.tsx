import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
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

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.3;

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
  const translateX = useSharedValue(0);

  const panGesture = Gesture.Pan()
    .enabled(!trackedToday)
    .onUpdate((event) => {
      // Small vibration when starting to move
      if (Math.abs(translateX.value) === 0 && Math.abs(event.translationX) > 1) {
        runOnJS(Haptics.selectionAsync)();
      }

      // Feedback when crossing threshold
      const wasBelow = Math.abs(translateX.value) < SWIPE_THRESHOLD;
      const isAbove = Math.abs(event.translationX) >= SWIPE_THRESHOLD;

      if (wasBelow && isAbove) {
        runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Medium);
      }

      translateX.value = event.translationX;
    })
    .onEnd((event) => {
      if (translateX.value > SWIPE_THRESHOLD) {
        translateX.value = withSpring(0);
        runOnJS(() => {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          onComplete?.();
        })();
      } else if (translateX.value < -SWIPE_THRESHOLD) {
        translateX.value = withSpring(0);
        runOnJS(() => {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          onFail?.();
        })();
      } else {
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

      <GestureDetector gesture={panGesture}>
        <Animated.View style={[styles.card, rStyle]}>
          <View style={styles.content}>
            <View style={[styles.iconContainer, { backgroundColor: isCompleted ? color : color + '15' }]}>
              {icon ? (
                React.createElement((LucideIcons as any)[icon], { size: 20, color: isCompleted ? '#FFF' : color })
              ) : (
                <LucideIcons.Activity size={20} color={isCompleted ? '#FFF' : color} />
              )}
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

          <View style={styles.progressContainer}>
            <View style={[styles.progressBar, { backgroundColor: 'rgba(255,255,255,0.05)' }]}>
              <View style={[styles.progressFill, { backgroundColor: color, width: isCompleted ? '100%' : '0%' }]} />
            </View>
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
    marginVertical: 6,
    height: 110,
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
    paddingHorizontal: 32,
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
    backgroundColor: AppleColors.surface.glassLow,
    borderRadius: 24,
    padding: 20,
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
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
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
  progressContainer: {
    marginTop: 16,
  },
  progressBar: {
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
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
    paddingHorizontal: 32,
    paddingVertical: 12,
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
