import React, { useMemo } from 'react';
import { StyleSheet, useWindowDimensions } from 'react-native';
import {
  Canvas,
  Group,
  Circle,
  Blur,
  Rect,
  vec,
  LinearGradient,
} from '@shopify/react-native-skia';
import Animated, {
    useSharedValue,
    withRepeat,
    withTiming,
    Easing,
    useDerivedValue,
} from 'react-native-reanimated';

export const AuroraBackground = () => {
  const { width, height } = useWindowDimensions();

  // Shared values for animation
  const animValue = useSharedValue(0);

  React.useEffect(() => {
    animValue.value = withRepeat(
      withTiming(1, {
        duration: 15000,
        easing: Easing.inOut(Easing.sine),
      }),
      -1,
      true
    );
  }, []);

  // Bubble base stats
  const bubbles = useMemo(() => [
    {
      color: '#5856D6', // systemIndigo
      baseX: width * 0.2,
      baseY: height * 0.2,
      size: width * 0.8,
      driftX: width * 0.2,
      driftY: height * 0.1,
    },
    {
      color: '#AF52DE', // systemPurple
      baseX: width * 0.8,
      baseY: height * 0.4,
      size: width * 0.7,
      driftX: -width * 0.15,
      driftY: height * 0.2,
    },
    {
      color: '#007AFF', // systemBlue
      baseX: width * 0.4,
      baseY: height * 0.7,
      size: width * 0.9,
      driftX: width * 0.1,
      driftY: -height * 0.15,
    },
  ], [width, height]);

  return (
    <Canvas style={[StyleSheet.absoluteFill, { backgroundColor: '#001' }]}>
      <Rect x={0} y={0} width={width} height={height}>
        <LinearGradient
          start={vec(0, 0)}
          end={vec(width, height)}
          colors={['#000', '#111827']}
        />
      </Rect>
      
      <Group>
        <Blur blur={100} />
        {bubbles.map((bubble, i) => (
          <AuroraBubble 
            key={i} 
            bubble={bubble} 
            animValue={animValue} 
          />
        ))}
      </Group>
    </Canvas>
  );
};

const AuroraBubble = ({ bubble, animValue }: { bubble: any, animValue: Animated.SharedValue<number> }) => {
  const cx = useDerivedValue(() => {
    return bubble.baseX + bubble.driftX * animValue.value;
  });

  const cy = useDerivedValue(() => {
    return bubble.baseY + bubble.driftY * animValue.value;
  });

  return (
    <Circle
      cx={cx}
      cy={cy}
      r={bubble.size}
      color={bubble.color}
      opacity={0.12}
    />
  );
};
