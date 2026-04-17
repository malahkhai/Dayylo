import React, { useEffect } from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import { 
    Canvas, 
    Rect, 
    useSharedValueEffect, 
    useValue, 
    runOnJS,
    Group,
    Circle,
    Skia,
    useComputedValue,
    Selector
} from '@shopify/react-native-skia';
import Animated, { 
    useSharedValue, 
    useAnimatedStyle, 
    withTiming, 
    withDelay, 
    runOnUI,
    Easing
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

const CONFETTI_COUNT = 100;
const COLORS = [
    '#FF3B30', // systemRed
    '#FF9500', // systemOrange
    '#FFCC00', // systemYellow
    '#34C759', // systemGreen
    '#007AFF', // systemBlue
    '#5856D6', // systemPurple
    '#FF2D55', // systemPink
];

interface Particle {
    x: Animated.SharedValue<number>;
    y: Animated.SharedValue<number>;
    rotation: Animated.SharedValue<number>;
    color: string;
    size: number;
    delay: number;
}

const ParticleComponent = ({ particle }: { particle: Particle }) => {
    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [
                { translateX: particle.x.value },
                { translateY: particle.y.value },
                { rotate: `${particle.rotation.value}deg` },
            ],
            opacity: withTiming(particle.y.value > height - 100 ? 0 : 1, { duration: 500 }),
        };
    });

    return (
        <Animated.View 
            style={[
                styles.particle, 
                { 
                    backgroundColor: particle.color, 
                    width: particle.size, 
                    height: particle.size * 1.5,
                    borderRadius: particle.size / 4
                }, 
                animatedStyle
            ]} 
        />
    );
};

export const ConfettiExplosion = () => {
    const particles = React.useRef<Particle[]>(
        Array.from({ length: CONFETTI_COUNT }).map(() => ({
            x: useSharedValue(width / 2),
            y: useSharedValue(height / 2),
            rotation: useSharedValue(0),
            color: COLORS[Math.floor(Math.random() * COLORS.length)],
            size: Math.random() * 8 + 4,
            delay: Math.random() * 500,
        }))
    ).current;

    useEffect(() => {
        particles.forEach((p) => {
            const angle = Math.random() * Math.PI * 2;
            const velocity = Math.random() * 400 + 200;
            const targetX = width / 2 + Math.cos(angle) * velocity;
            const targetY = height / 2 + Math.sin(angle) * velocity;
            
            // Explosion phase
            p.x.value = withDelay(p.delay, withTiming(targetX, { duration: 1000, easing: Easing.out(Easing.quad) }));
            p.y.value = withDelay(p.delay, withTiming(targetY, { duration: 1000, easing: Easing.out(Easing.quad) }));
            p.rotation.value = withDelay(p.delay, withTiming(Math.random() * 1000, { duration: 3000 }));

            // Gravity phase
            setTimeout(() => {
                p.y.value = withTiming(height + 100, { duration: 3000 + Math.random() * 2000, easing: Easing.in(Easing.quad) });
                p.x.value = withTiming(p.x.value + (Math.random() - 0.5) * 200, { duration: 3000 });
            }, 1000 + p.delay);
        });
    }, []);

    return (
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
            {particles.map((p, i) => (
                <ParticleComponent key={i} particle={p} />
            ))}
        </View>
    );
};

import { View } from 'react-native';

const styles = StyleSheet.create({
    particle: {
        position: 'absolute',
        left: 0,
        top: 0,
    },
});
