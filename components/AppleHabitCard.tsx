import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Pressable,
} from 'react-native';
import * as LucideIcons from 'lucide-react-native';
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
  color = AppleColors.primary,
  icon,
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

  const renderIcon = () => {
    if (!icon) return null;
    const IconComponent = (LucideIcons as any)[icon];
    if (IconComponent) {
      return <IconComponent size={20} color={color} />;
    }
    return <Text style={styles.iconEmoji}>{icon}</Text>;
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
          <View style={styles.leftSection}>
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

            <View style={[styles.iconContainer, { backgroundColor: color + '15' }]}>
              {renderIcon()}
            </View>
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
    borderRadius: 32,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    ...AppleShadows.card,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: AppleSpacing.md,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: AppleSpacing.md,
  },
  completionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: AppleSpacing.sm,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconEmoji: {
    fontSize: 18,
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
    fontWeight: '900',
    color: '#000000',
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
