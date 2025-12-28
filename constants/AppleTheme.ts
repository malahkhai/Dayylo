// constants/AppleTheme.ts
// Complete Apple-style design system for iOS

export const AppleColors = {
  // iOS System Colors
  systemBlue: '#007AFF',
  systemIndigo: '#5856D6',
  systemPurple: '#AF52DE',
  systemPink: '#FF2D55',
  systemRed: '#FF3B30',
  systemOrange: '#FF9500',
  systemYellow: '#FFCC00',
  systemGreen: '#34C759',
  systemTeal: '#5AC8FA',
  systemMint: '#00C7BE',
  systemCyan: '#32ADE6',

  // Grays
  systemGray: '#8E8E93',
  systemGray2: '#AEAEB2',
  systemGray3: '#C7C7CC',
  systemGray4: '#D1D1D6',
  systemGray5: '#E5E5EA',
  systemGray6: '#F2F2F7',

  // Dayylo Premium Palette
  primary: '#30e8ab',
  backgroundDark: '#0a0a0a',
  surfaceDark: '#1c1c1e',
  surfaceDarkAlt: '#2c2c2e',

  // Backgrounds
  background: {
    primary: '#000000',
    secondary: '#0a0a0a',
    tertiary: '#1c1c1e',
  },

  // Labels
  label: {
    primary: '#FFFFFF',
    secondary: 'rgba(255,255,255,0.7)',
    tertiary: 'rgba(255,255,255,0.45)',
    quaternary: 'rgba(255,255,255,0.25)',
  },

  // Fills
  fill: {
    primary: 'rgba(120, 120, 128, 0.35)',
    secondary: 'rgba(120, 120, 128, 0.28)',
    tertiary: 'rgba(118, 118, 128, 0.22)',
    quaternary: 'rgba(116, 116, 128, 0.16)',
  },

  // Separator
  separator: {
    opaque: '#38383A',
    nonOpaque: 'rgba(84, 84, 88, 0.6)',
  },
};

export const AppleTypography = {
  // iOS Dynamic Type Scale
  largeTitle: {
    fontSize: 34,
    lineHeight: 41,
    fontWeight: '900' as const,
    letterSpacing: 0.37,
  },
  title1: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '900' as const,
    letterSpacing: 0.36,
  },
  title2: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '800' as const,
    letterSpacing: 0.35,
  },
  title3: {
    fontSize: 20,
    lineHeight: 25,
    fontWeight: '700' as const,
    letterSpacing: 0.38,
  },
  headline: {
    fontSize: 17,
    lineHeight: 22,
    fontWeight: '900' as const,
    letterSpacing: -0.41,
  },
  body: {
    fontSize: 17,
    lineHeight: 22,
    fontWeight: '600' as const,
    letterSpacing: -0.41,
  },
  callout: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: '700' as const,
    letterSpacing: -0.32,
  },
  subheadline: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '500' as const,
    letterSpacing: -0.24,
  },
  footnote: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '500' as const,
    letterSpacing: -0.08,
  },
  caption1: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '400' as const,
    letterSpacing: 0,
  },
  caption2: {
    fontSize: 11,
    lineHeight: 13,
    fontWeight: '400' as const,
    letterSpacing: 0.06,
  },
};

export const AppleSpacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 40,
};

export const AppleBorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 28,
  card: 12,
  button: 10,
  pill: 999,
};

export const AppleShadows = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 5,
  },
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
  },
};

export const AppleAnimations = {
  spring: {
    damping: 20,
    stiffness: 300,
    mass: 0.8,
  },
  timing: {
    duration: 300,
    easing: 'ease-in-out',
  },
  quick: {
    duration: 150,
  },
  slow: {
    duration: 500,
  },
};
