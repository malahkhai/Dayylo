// utils/AppleAnimations.ts
// Reusable animation utilities for Apple-style interactions

import { Animated, Easing } from 'react-native';

export class AppleAnimations {
  // Spring animation preset (iOS default)
  static spring(value: Animated.Value, toValue: number, config = {}) {
    return Animated.spring(value, {
      toValue,
      useNativeDriver: true,
      damping: 20,
      stiffness: 300,
      mass: 0.8,
      ...config,
    });
  }

  // Smooth timing animation
  static timing(value: Animated.Value, toValue: number, duration = 300) {
    return Animated.timing(value, {
      toValue,
      duration,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1), // iOS standard curve
      useNativeDriver: true,
    });
  }

  // Quick fade in
  static fadeIn(value: Animated.Value, duration = 300, delay = 0) {
    return Animated.timing(value, {
      toValue: 1,
      duration,
      delay,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    });
  }

  // Quick fade out
  static fadeOut(value: Animated.Value, duration = 300) {
    return Animated.timing(value, {
      toValue: 0,
      duration,
      easing: Easing.in(Easing.ease),
      useNativeDriver: true,
    });
  }

  // Scale bounce (for button press)
  static pressScale(value: Animated.Value) {
    return Animated.sequence([
      Animated.spring(value, {
        toValue: 0.96,
        useNativeDriver: true,
        damping: 20,
        stiffness: 300,
      }),
      Animated.spring(value, {
        toValue: 1,
        useNativeDriver: true,
        damping: 20,
        stiffness: 300,
      }),
    ]);
  }

  // Slide in from right (for modals)
  static slideInRight(value: Animated.Value, duration = 300) {
    return Animated.timing(value, {
      toValue: 0,
      duration,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      useNativeDriver: true,
    });
  }

  // Slide out to right
  static slideOutRight(value: Animated.Value, screenWidth: number, duration = 300) {
    return Animated.timing(value, {
      toValue: screenWidth,
      duration,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      useNativeDriver: true,
    });
  }

  // Stagger animation for lists
  static stagger(animations: Animated.CompositeAnimation[], delay = 50) {
    return Animated.stagger(delay, animations);
  }

  // Parallel animations
  static parallel(animations: Animated.CompositeAnimation[]) {
    return Animated.parallel(animations);
  }

  // Sequence animations
  static sequence(animations: Animated.CompositeAnimation[]) {
    return Animated.sequence(animations);
  }

  // Loop animation
  static loop(animation: Animated.CompositeAnimation, iterations = -1) {
    return Animated.loop(animation, { iterations });
  }

  // Shake animation (for errors)
  static shake(value: Animated.Value) {
    return Animated.sequence([
      Animated.timing(value, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(value, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(value, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(value, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(value, { toValue: 0, duration: 50, useNativeDriver: true }),
    ]);
  }

  // Success pulse
  static successPulse(value: Animated.Value) {
    return Animated.sequence([
      Animated.spring(value, {
        toValue: 1.1,
        useNativeDriver: true,
        damping: 10,
        stiffness: 300,
      }),
      Animated.spring(value, {
        toValue: 1,
        useNativeDriver: true,
        damping: 15,
        stiffness: 300,
      }),
    ]);
  }

  // Progress animation
  static progress(value: Animated.Value, toValue: number, duration = 1000) {
    return Animated.timing(value, {
      toValue,
      duration,
      easing: Easing.bezier(0.42, 0, 0.58, 1), // iOS ease-in-out
      useNativeDriver: false, // Width animations need this
    });
  }

  // Rotate animation
  static rotate(value: Animated.Value, duration = 1000) {
    return Animated.loop(
      Animated.timing(value, {
        toValue: 1,
        duration,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
  }

  // Card flip animation
  static flip(frontValue: Animated.Value, backValue: Animated.Value) {
    return Animated.parallel([
      Animated.timing(frontValue, {
        toValue: 180,
        duration: 300,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        useNativeDriver: true,
      }),
      Animated.timing(backValue, {
        toValue: 0,
        duration: 300,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        useNativeDriver: true,
      }),
    ]);
  }
}

// Hook for press animation
export const usePressAnimation = () => {
  const scaleValue = new Animated.Value(1);

  const handlePressIn = () => {
    AppleAnimations.spring(scaleValue, 0.96).start();
  };

  const handlePressOut = () => {
    AppleAnimations.spring(scaleValue, 1).start();
  };

  return {
    scaleValue,
    handlePressIn,
    handlePressOut,
  };
};

// Hook for fade animation
export const useFadeAnimation = (initialValue = 0) => {
  const fadeValue = new Animated.Value(initialValue);

  const fadeIn = (duration?: number, delay?: number) => {
    AppleAnimations.fadeIn(fadeValue, duration, delay).start();
  };

  const fadeOut = (duration?: number) => {
    AppleAnimations.fadeOut(fadeValue, duration).start();
  };

  return {
    fadeValue,
    fadeIn,
    fadeOut,
  };
};
