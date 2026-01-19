// components/AppleButton.tsx
import React, { useState } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  Animated,
  ActivityIndicator,
  View,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { AppleColors, AppleTypography, AppleShadows, AppleBorderRadius, AppleSpacing } from '../constants/AppleTheme';

interface AppleButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'tertiary' | 'destructive';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  style?: any;
}

export const AppleButton: React.FC<AppleButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  fullWidth = false,
  icon,
  style,
}) => {
  const [scaleAnim] = useState(new Animated.Value(1));

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.97, // Per style guide
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

  const getButtonStyle = () => {
    const baseStyle: any[] = [styles.button];

    // Size
    if (size === 'small') baseStyle.push(styles.buttonSmall);
    if (size === 'large') baseStyle.push(styles.buttonLarge);

    // Variant
    if (variant === 'primary') baseStyle.push(styles.buttonPrimary);
    if (variant === 'secondary') baseStyle.push(styles.buttonSecondary);
    if (variant === 'tertiary') baseStyle.push(styles.buttonTertiary);
    if (variant === 'destructive') baseStyle.push(styles.buttonDestructive);

    // States
    if (disabled) baseStyle.push(styles.buttonDisabled);
    if (fullWidth) baseStyle.push(styles.buttonFullWidth);

    return baseStyle;
  };

  const getTextStyle = () => {
    const baseStyle: any[] = [styles.buttonText];

    if (size === 'small') baseStyle.push(styles.buttonTextSmall);
    if (size === 'large') baseStyle.push(styles.buttonTextLarge);

    if (variant === 'primary') baseStyle.push(styles.buttonTextPrimary);
    if (variant === 'secondary') baseStyle.push(styles.buttonTextSecondary);
    if (variant === 'tertiary') baseStyle.push(styles.buttonTextTertiary);
    if (variant === 'destructive') baseStyle.push(styles.buttonTextDestructive);

    if (disabled) baseStyle.push(styles.buttonTextDisabled);

    return baseStyle;
  };

  return (
    <Animated.View style={[{ transform: [{ scale: scaleAnim }] }, style]}>
      <TouchableOpacity
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || loading}
        activeOpacity={0.8}
        style={getButtonStyle()}
      >
        {loading ? (
          <ActivityIndicator
            color={variant === 'primary' || variant === 'destructive' ? '#FFFFFF' : AppleColors.primary}
          />
        ) : (
          <View style={styles.buttonContent}>
            {icon && <View style={styles.iconContainer}>{icon}</View>}
            <Text style={getTextStyle()}>{title}</Text>
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

// Floating Action Button
export const AppleFAB: React.FC<{
  onPress: () => void;
  icon: any;
  color?: string;
}> = ({ onPress, icon: Icon, color = AppleColors.info }) => {
  const [scaleAnim] = useState(new Animated.Value(1));

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.9,
      useNativeDriver: true,
      damping: 15,
      stiffness: 300,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      damping: 15,
      stiffness: 300,
    }).start();
  };

  return (
    <Animated.View style={[styles.fab, { transform: [{ scale: scaleAnim }] }]}>
      <TouchableOpacity
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[styles.fabButton, { backgroundColor: color }]}
        activeOpacity={0.8}
      >
        <Icon size={32} color="white" />
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: AppleBorderRadius.md, // 12px per Skill guide
    paddingVertical: 12, // 12pt vertical per Skill guide
    paddingHorizontal: 20, // 20pt horizontal per Skill guide
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  buttonSmall: {
    paddingVertical: AppleSpacing.sm,
    paddingHorizontal: AppleSpacing.base,
    minHeight: 40,
    borderRadius: AppleBorderRadius.sm,
  },
  buttonLarge: {
    paddingVertical: 20, // Per guide: 20px vertical
    paddingHorizontal: 32, // Per guide: 32px horizontal
    minHeight: 56, // Per guide: 56px min
  },
  buttonFullWidth: {
    width: '100%',
  },
  buttonPrimary: {
    backgroundColor: AppleColors.primary, // System Blue
  },
  buttonSecondary: {
    backgroundColor: AppleColors.background.secondary, // Zinc 900
  },
  buttonTertiary: {
    backgroundColor: 'transparent',
  },
  buttonDestructive: {
    backgroundColor: AppleColors.error,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    marginRight: 16,
  },
  buttonText: {
    ...AppleTypography.label, // 14px Semibold
    color: '#FFFFFF',
  },
  buttonTextSmall: {
    ...AppleTypography.labelSmall,
  },
  buttonTextLarge: {
    ...AppleTypography.labelLarge, // 16px Semibold per guide (using Label Large for 18px-like feel in small sets)
    fontSize: 18, // Manually set to match "18px Semibold" from guide
  },
  buttonTextPrimary: {
    color: '#FFFFFF',
  },
  buttonTextSecondary: {
    color: '#FFFFFF',
  },
  buttonTextTertiary: {
    color: AppleColors.primary,
  },
  buttonTextDestructive: {
    color: '#FFFFFF',
  },
  buttonTextDisabled: {
    color: AppleColors.label.quaternary,
  },
  fab: {
    position: 'absolute',
    bottom: 96, // 96px per guide
    right: 32, // 32px per guide
    zIndex: 1000,
  },
  fabButton: {
    width: 64, // 64x64 per guide
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    ...AppleShadows.level4,
  },
});
