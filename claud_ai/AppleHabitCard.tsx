// components/AppleHabitCard.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Pressable,
} from 'react-native';
import { AppleColors, AppleTypography, AppleShadows, AppleBorderRadius, AppleSpacing } from '../constants/AppleTheme';

interface HabitCardProps {
  title: string;
  description?: string;
  streak: number;
  isCompleted: boolean;
  color?: string;
  icon?: string;
  onPress?: () => void;
  onComplete?: () => void;
}

export const AppleHabitCard: React.FC<HabitCardProps> = ({
  title,
  description,
  streak,
  isCompleted,
  color = AppleColors.systemBlue,
  icon = '✓',
  onPress,
  onComplete,
}) => {
  const [scaleAnim] = useState(new Animated.Value(1));
  const [completionAnim] = useState(new Animated.Value(isCompleted ? 1 : 0));

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.96,
      useNativeDriver: true,
      damping: 20,
      stiffness: 300,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      damping: 20,
      stiffness: 300,
    }).start();
  };

  const handleComplete = () => {
    Animated.spring(completionAnim, {
      toValue: isCompleted ? 0 : 1,
      useNativeDriver: true,
      damping: 15,
      stiffness: 300,
    }).start();
    onComplete?.();
  };

  return (
    <Animated.View style={[styles.container, { transform: [{ scale: scaleAnim }] }]}>
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={styles.card}
      >
        <View style={styles.content}>
          {/* Completion Button */}
          <TouchableOpacity
            onPress={handleComplete}
            style={[
              styles.completionButton,
              { borderColor: color },
              isCompleted && { backgroundColor: color },
            ]}
            activeOpacity={0.7}
          >
            <Animated.Text
              style={[
                styles.checkmark,
                {
                  opacity: completionAnim,
                  transform: [{ scale: completionAnim }],
                },
              ]}
            >
              ✓
            </Animated.Text>
          </TouchableOpacity>

          {/* Habit Info */}
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

          {/* Streak Badge */}
          {streak > 0 && (
            <View style={[styles.streakBadge, { backgroundColor: color }]}>
              <Text style={styles.streakEmoji}>🔥</Text>
              <Text style={styles.streakText}>{streak}</Text>
            </View>
          )}
        </View>

        {/* Progress Indicator */}
        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, { backgroundColor: AppleColors.fill.tertiary }]}>
            <Animated.View
              style={[
                styles.progressFill,
                {
                  backgroundColor: color,
                  width: completionAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0%', '100%'],
                  }),
                },
              ]}
            />
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: AppleSpacing.base,
    marginVertical: AppleSpacing.sm,
  },
  card: {
    backgroundColor: AppleColors.background.tertiary,
    borderRadius: AppleBorderRadius.card,
    padding: AppleSpacing.base,
    ...AppleShadows.card,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: AppleSpacing.md,
  },
  completionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: AppleSpacing.md,
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  info: {
    flex: 1,
    marginRight: AppleSpacing.sm,
  },
  title: {
    ...AppleTypography.headline,
    color: AppleColors.label.primary,
    marginBottom: 2,
  },
  description: {
    ...AppleTypography.footnote,
    color: AppleColors.label.secondary,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: AppleSpacing.sm,
    paddingVertical: 4,
    borderRadius: AppleBorderRadius.pill,
  },
  streakEmoji: {
    fontSize: 14,
    marginRight: 4,
  },
  streakText: {
    ...AppleTypography.caption1,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  progressContainer: {
    marginTop: AppleSpacing.sm,
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
