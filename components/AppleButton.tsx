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

  const getButtonStyle = () => {
    const baseStyle = [styles.button];
    
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
    const baseStyle = [styles.buttonText];
    
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
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || loading}
        activeOpacity={0.8}
        style={getButtonStyle()}
      >
        {loading ? (
          <ActivityIndicator
            color={variant === 'primary' || variant === 'destructive' ? '#FFFFFF' : AppleColors.systemBlue}
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
  icon: string;
  color?: string;
}> = ({ onPress, icon, color = AppleColors.systemBlue }) => {
  const [scaleAnim] = useState(new Animated.Value(1));

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
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[styles.fabButton, { backgroundColor: color }]}
        activeOpacity={0.8}
      >
        <Text style={styles.fabIcon}>{icon}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: AppleBorderRadius.button,
    paddingVertical: AppleSpacing.md,
    paddingHorizontal: AppleSpacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
  },
  buttonSmall: {
    paddingVertical: AppleSpacing.sm,
    paddingHorizontal: AppleSpacing.base,
    minHeight: 40,
  },
  buttonLarge: {
    paddingVertical: AppleSpacing.base,
    paddingHorizontal: AppleSpacing.xl,
    minHeight: 56,
  },
  buttonFullWidth: {
    width: '100%',
  },
  buttonPrimary: {
    backgroundColor: AppleColors.systemBlue,
    ...AppleShadows.small,
  },
  buttonSecondary: {
    backgroundColor: AppleColors.fill.secondary,
  },
  buttonTertiary: {
    backgroundColor: 'transparent',
  },
  buttonDestructive: {
    backgroundColor: AppleColors.systemRed,
    ...AppleShadows.small,
  },
  buttonDisabled: {
    opacity: 0.4,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    marginRight: AppleSpacing.sm,
  },
  buttonText: {
    ...AppleTypography.headline,
    fontWeight: '600',
  },
  buttonTextSmall: {
    ...AppleTypography.callout,
    fontWeight: '600',
  },
  buttonTextLarge: {
    ...AppleTypography.title3,
  },
  buttonTextPrimary: {
    color: '#FFFFFF',
  },
  buttonTextSecondary: {
    color: AppleColors.systemBlue,
  },
  buttonTextTertiary: {
    color: AppleColors.systemBlue,
  },
  buttonTextDestructive: {
    color: '#FFFFFF',
  },
  buttonTextDisabled: {
    color: AppleColors.label.quaternary,
  },
  fab: {
    position: 'absolute',
    bottom: AppleSpacing.xl,
    right: AppleSpacing.base,
    zIndex: 1000,
  },
  fabButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    ...AppleShadows.large,
  },
  fabIcon: {
    fontSize: 28,
    color: '#FFFFFF',
  },
});
