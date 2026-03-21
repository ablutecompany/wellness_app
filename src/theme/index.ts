import { TextStyle } from 'react-native';

export const palette = {
  background: '#030303', // Deep charcoal / almost black
  card: 'rgba(255, 255, 255, 0.02)', // Floating not heavy solid
  cardBorder: 'rgba(255, 255, 255, 0.05)',
  primary: '#0055FF', // Elegant controlled blue
  wellnessGreen: '#00A86B', // Contained green, not fluorescent
  success: '#00A86B', 
  warning: '#D4AF37', // More refined gold/warning
  error: '#FF3B30',
  text: '#FAFAFA', // Off-white soft
  textSecondary: '#8E8E93',
  textMuted: '#48484A',
  overlay: 'rgba(0,0,0,0.8)',
  glass: 'rgba(255, 255, 255, 0.03)',
  glassBorder: 'rgba(255, 255, 255, 0.08)',
  biologicalBlue: '#0A84FF', // Tech intelligence blue
  biologicalGreen: '#00A86B', // Clean wellness green
  transparent: 'transparent',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const typography = {
  h1: {
    fontSize: 34,
    fontWeight: '700',
    lineHeight: 41,
  },
  h2: {
    fontSize: 28,
    fontWeight: '700',
    lineHeight: 34,
  },
  h3: {
    fontSize: 22,
    fontWeight: '600',
    lineHeight: 28,
  },
  body: {
    fontSize: 17,
    fontWeight: '400',
    lineHeight: 22,
  },
  caption: {
    fontSize: 13,
    fontWeight: '400',
    lineHeight: 18,
    color: palette.textSecondary,
  },
  button: {
    fontSize: 17,
    fontWeight: '600',
    lineHeight: 22,
  },
};

export const theme = {
  colors: palette,
  spacing,
  typography: typography as Record<string, TextStyle>,
};
