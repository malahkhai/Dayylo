import React, { useEffect, useMemo } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import Animated, { 
  useSharedValue, 
  withTiming, 
  withDelay, 
  Easing, 
  useAnimatedStyle,
  interpolate
} from 'react-native-reanimated';

const COLORS = ['#FFD700', '#FF4500', '#1E90FF', '#32CD32', '#BA55D3', '#FF69B4', '#00FFFF', '#FFFFFF'];
const PARTICLE_COUNT = 60;

const Particle = ({ delay }: { delay: number }) => {
  const { width, height } = useWindowDimensions();
  const centerX = width / 2;
  const centerY = height / 2;

  const progress = useSharedValue(0);
  const color = useMemo(() => COLORS[Math.floor(Math.random() * COLORS.length)], []);
  const size = useMemo(() => Math.random() * 8 + 4, []);
  
  // Random trajectory
  const angle = useMemo(() => Math.random() * Math.PI * 2, []);
  const distance = useMemo(() => Math.random() * 300 + 100, []);
  const targetX = useMemo(() => Math.cos(angle) * distance, [angle, distance]);
  const targetY = useMemo(() => Math.sin(angle) * distance - 100, [angle, distance]); // Burst up/out then fall
  const fallY = useMemo(() => targetY + 500, [targetY]);

  useEffect(() => {
    progress.value = withDelay(delay, withTiming(1, { 
      duration: 3000, 
      easing: Easing.out(Easing.cubic) 
    }));
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    const translateX = interpolate(progress.value, [0, 0.3, 1], [0, targetX, targetX * 1.2]);
    const translateY = interpolate(progress.value, [0, 0.3, 1], [0, targetY, fallY]);
    const rotate = interpolate(progress.value, [0, 1], [0, 720]);
    const opacity = interpolate(progress.value, [0, 0.7, 1], [1, 1, 0]);
    const scale = interpolate(progress.value, [0, 0.1, 0.8, 1], [0, 1, 1, 0]);

    return {
      transform: [
        { translateX },
        { translateY },
        { rotate: `${rotate}deg` },
        { scale }
      ],
      opacity,
    };
  });

  return (
    <Animated.View
      style={[{
        position: 'absolute',
        top: centerY,
        left: centerX,
        width: size,
        height: size * 1.5,
        backgroundColor: color,
        borderRadius: size / 4,
      }, animatedStyle]}
    />
  );
};

export const ConfettiExplosion = () => {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {[...Array(PARTICLE_COUNT)].map((_, i) => (
        <Particle key={i} delay={i * 20} />
      ))}
    </View>
  );
};
