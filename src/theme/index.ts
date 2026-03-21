import { TextStyle } from 'react-native';

export const palette = {
  background: '#050505',
  card: '#0F0F0F',
  cardBorder: '#1F1F1F',
  primary: '#0070FF', // ablute_ blue
  success: '#00F5A0', // Living nucleus - Strong
  warning: '#FFD600',
  error: '#FF3B30',
  text: '#FFFFFF',
  textSecondary: '#8E8E93',
  textMuted: '#48484A',
  overlay: 'rgba(0,0,0,0.6)',
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
