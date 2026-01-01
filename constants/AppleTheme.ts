// constants/AppleTheme.ts
// iOS App Style Guide Implementation

export const AppleColors = {
  // Primary Colors
  background: {
    primary: '#000000', // Pure Black
    secondary: '#18181B', // Zinc 900
    tertiary: '#27272A', // Zinc 800 (Surface Hover)
  },

  // Accent Colors (Emerald)
  primary: '#10B981', // Emerald 500
  primaryDark: '#059669', // Emerald 600
  primaryHover: '#047857', // Emerald 700
  primarySurface: '#064E3B', // Emerald 950

  // Semantic Colors
  success: '#10B981', // Emerald 500
  warning: '#F59E0B', // Amber 500
  error: '#EF4444', // Red 500
  info: '#3B82F6', // Blue 500

  // Surface Variants
  variants: {
    blue: '#172554', // Blue 950
    teal: '#134E4A', // Teal 950
    purple: '#3B0764', // Purple 950
    amber: '#451A03', // Amber 950
  },

  // Text Colors
  label: {
    primary: '#FFFFFF', // White
    secondary: '#9CA3AF', // Gray 400
    tertiary: '#6B7280', // Gray 500
    quaternary: '#4B5563', // Gray 600 (Disabled)
  },

  // Keeping legacy system colors for parts of the app not yet migrated
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
  systemGray: '#8E8E93',
  systemGray2: '#AEAEB2',
  systemGray6: '#F2F2F7',

  // Separator
  separator: {
    opaque: '#27272A',
    nonOpaque: 'rgba(39, 39, 42, 0.6)',
  },

  // Compatibility Fills (for older screens)
  fill: {
    primary: 'rgba(120, 120, 128, 0.35)',
    secondary: 'rgba(120, 120, 128, 0.28)',
    tertiary: 'rgba(118, 118, 128, 0.22)',
    quaternary: 'rgba(116, 116, 128, 0.16)',
  },
};

export const AppleTypography = {
  // Display
  displayLarge: {
    fontSize: 48,
    fontWeight: '700' as const,
    lineHeight: 52,
    letterSpacing: -0.5,
  },
  display: {
    fontSize: 40,
    fontWeight: '700' as const,
    lineHeight: 44,
    letterSpacing: -0.5,
  },

  // Headings
  h1: {
    fontSize: 34,
    fontWeight: '700' as const,
    lineHeight: 41,
    letterSpacing: -0.4,
  },
  h2: {
    fontSize: 28,
    fontWeight: '700' as const,
    lineHeight: 34,
    letterSpacing: -0.3,
  },
  h3: {
    fontSize: 22,
    fontWeight: '600' as const,
    lineHeight: 28,
  },
  h4: {
    fontSize: 20,
    fontWeight: '600' as const,
    lineHeight: 25,
  },
  title1: {
    fontSize: 28,
    fontWeight: '700' as const,
    lineHeight: 34,
    letterSpacing: -0.3,
  },
  title2: {
    fontSize: 22,
    fontWeight: '600' as const,
    lineHeight: 28,
  },
  title3: {
    fontSize: 20,
    fontWeight: '600' as const,
    lineHeight: 25,
  },

  // Body
  bodyLarge: {
    fontSize: 19,
    fontWeight: '400' as const,
    lineHeight: 24,
  },
  body: {
    fontSize: 17,
    fontWeight: '400' as const,
    lineHeight: 22,
  },
  bodySmall: {
    fontSize: 15,
    fontWeight: '400' as const,
    lineHeight: 20,
  },

  // Labels
  labelLarge: {
    fontSize: 16,
    fontWeight: '600' as const,
    lineHeight: 21,
  },
  label: {
    fontSize: 15,
    fontWeight: '600' as const,
    lineHeight: 20,
  },
  labelSmall: {
    fontSize: 13,
    fontWeight: '600' as const,
    lineHeight: 18,
    letterSpacing: 0.5,
    textTransform: 'uppercase' as const,
  },

  // Caption
  caption: {
    fontSize: 12,
    fontWeight: '400' as const,
    lineHeight: 16,
  },
  captionSmall: {
    fontSize: 11,
    fontWeight: '400' as const,
    lineHeight: 13,
  },

  // Keep legacy mappings for compatibility during migration
  largeTitle: {
    fontSize: 34,
    lineHeight: 41,
    fontWeight: '700' as const,
    letterSpacing: -0.4,
  },
  headline: {
    fontSize: 17,
    lineHeight: 22,
    fontWeight: '600' as const,
  },
  callout: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: '600' as const,
  },
  footnote: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '400' as const,
  },
  caption1: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '400' as const,
  },
  caption2: {
    fontSize: 11,
    lineHeight: 13,
    fontWeight: '400' as const,
  },
  subheadline: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '500' as const,
  },
};

export const AppleSpacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xl2: 40,
  xl3: 48,
  xl4: 64,
  xl5: 80,
  xl6: 96,
  screenPadding: 32,

  // Compatibility mappings
  base: 16,
  xxl: 32,
  xxxl: 40,
};

export const AppleBorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xl2: 24,
  xl3: 32,
  full: 9999,

  // Compatibility mappings
  pill: 9999,
  card: 24,
  button: 16,
};

export const AppleShadows = {
  level1: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 2,
  },
  level2: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 4,
  },
  level3: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 8,
  },
  level4: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.6,
    shadowRadius: 25,
    elevation: 12,
  },
  // Compatibility mappings
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 4,
  },
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
};
