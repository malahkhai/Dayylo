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
import { AppleColors, AppleTypography, AppleShadows, AppleSpacing } from '../constants/AppleTheme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.3;

interface HabitCardProps {
  id: string;
  title: string;
  description?: string;
  streak: number;
  isCompleted: boolean;
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
  color = AppleColors.primary,
  icon,
  onPress,
  onComplete,
  onFail,
}) => {
  const translateX = useSharedValue(0);

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      translateX.value = event.translationX;
    })
    .onEnd((event) => {
      if (translateX.value > SWIPE_THRESHOLD) {
        translateX.value = withSpring(SCREEN_WIDTH);
        runOnJS(onComplete!)();
      } else if (translateX.value < -SWIPE_THRESHOLD) {
        translateX.value = withSpring(-SCREEN_WIDTH);
        runOnJS(onFail!)();
      } else {
        translateX.value = withSpring(0);
      }
    });

  const rStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <View style={styles.container}>
      {/* Background Actions */}
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

            {streak > 0 && (
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
        </Animated.View>
      </GestureDetector>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: AppleSpacing.base,
    marginVertical: AppleSpacing.sm,
    height: 110,
    justifyContent: 'center',
  },
  backgroundContainer: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 32,
    overflow: 'hidden',
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
    letterSpacing: 1,
  },
  card: {
    backgroundColor: AppleColors.background.tertiary,
    borderRadius: 32,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    ...AppleShadows.card,
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
    marginRight: 16,
  },
  iconEmoji: {
    fontSize: 22,
  },
  info: {
    flex: 1,
    marginRight: AppleSpacing.sm,
  },
  title: {
    ...AppleTypography.body,
    fontWeight: '900',
    color: AppleColors.label.primary,
    marginBottom: 4,
  },
  description: {
    ...AppleTypography.footnote,
    fontWeight: '600',
    color: AppleColors.label.secondary,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
  },
  streakEmoji: {
    fontSize: 14,
    marginRight: 4,
  },
  streakText: {
    ...AppleTypography.caption1,
    fontWeight: '900',
    color: '#000000',
  },
  progressContainer: {
    marginTop: 12,
  },
  progressBar: {
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
});
