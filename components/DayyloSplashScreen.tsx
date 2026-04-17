import React, { useEffect } from 'react';
import { StyleSheet, View, Image, Dimensions } from 'react-native';
import { MotiView, MotiText } from 'moti';
import { AppleColors, AppleTypography } from '../constants/AppleTheme';

const { width } = Dimensions.get('window');

interface DayyloSplashScreenProps {
  onAnimationComplete?: () => void;
}

export const DayyloSplashScreen: React.FC<DayyloSplashScreenProps> = ({ onAnimationComplete }) => {
  
  useEffect(() => {
    // Keep it visible for at least 2 seconds for a premium feel
    const timer = setTimeout(() => {
      if (onAnimationComplete) onAnimationComplete();
    }, 2800);

    return () => clearTimeout(timer);
  }, [onAnimationComplete]);

  return (
    <View style={styles.container}>
      {/* Pure black background per request for stability and premium feel */}
      
      <View style={styles.content}>
        <MotiView
          from={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            type: 'spring',
            duration: 1200,
            delay: 400,
          }}
          style={styles.logoContainer}
        >
          <Image
            source={require('../assets/splash-icon.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </MotiView>

        <MotiView
          from={{ opacity: 0, translateY: 10 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{
            type: 'timing',
            duration: 800,
            delay: 1200,
          }}
          style={styles.textContainer}
        >
          <MotiText 
            style={styles.appName}
            from={{ letterSpacing: 6 }}
            animate={{ letterSpacing: 10 }}
            transition={{ type: 'timing', duration: 2000 }}
          >
            DAYYLO
          </MotiText>
          <MotiText style={styles.tagline}>MIND YOUR HABITS</MotiText>
        </MotiView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 99999,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 50,
    height: 50,
  },
  textContainer: {
    marginTop: 30,
    alignItems: 'center',
  },
  appName: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900',
    textAlign: 'center',
    opacity: 0.8,
  },
  tagline: {
    color: 'rgba(255,255,255,0.2)',
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 2,
    marginTop: 8,
    textAlign: 'center',
  },
});
