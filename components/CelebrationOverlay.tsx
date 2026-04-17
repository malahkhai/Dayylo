import React, { useRef, useEffect } from 'react';
import { StyleSheet, View, Animated } from 'react-native';
import LottieView from 'lottie-react-native';

interface CelebrationOverlayProps {
  onFinish: () => void;
  visible: boolean;
}

export const CelebrationOverlay: React.FC<CelebrationOverlayProps> = ({ onFinish, visible }) => {
  const animationRef = useRef<LottieView>(null);
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        animationRef.current?.play();
      });
    } else {
      Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Animated.View style={[styles.container, { opacity }]}>
      <LottieView
        ref={animationRef}
        source={{ uri: 'https://assets9.lottiefiles.com/packages/lf20_u4j3pbc7.json' }}
        autoPlay={false}
        loop={false}
        onAnimationFinish={onFinish}
        style={styles.lottie}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.1)',
    zIndex: 9999,
    pointerEvents: 'none',
    alignItems: 'center',
    justifyContent: 'center',
  },
  lottie: {
    width: '100%',
    height: '100%',
  },
});
