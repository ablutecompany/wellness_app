import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { Typography } from './Base';
import { theme } from '../theme';

interface BrandLogoProps {
  size?: 'small' | 'medium' | 'large';
}

export const BrandLogo: React.FC<BrandLogoProps> = ({ size = 'small' }) => {
  const isLarge = size === 'large';
  const isMedium = size === 'medium';
  
  const getFontSize = () => {
    if (isLarge) return 28;
    if (isMedium) return 18;
    return undefined; // falls back to caption/h2 defaults
  };
  
  return (
    <View style={styles.container}>
      <Typography 
        variant={isLarge ? 'h2' : 'caption'} 
        style={[styles.baseText, { fontSize: getFontSize() }]}
      >
        ablute
        <Typography 
          variant={isLarge ? 'h2' : 'caption'} 
          style={[styles.underscore, { fontSize: getFontSize() }]}
        >
          _
        </Typography>
        <Typography 
          variant={isLarge ? 'h2' : 'caption'} 
          style={[styles.wellness, { fontSize: getFontSize() }]}
        >
           wellness
        </Typography>
      </Typography>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  baseText: {
    fontFamily: Platform.OS === 'web' ? '"Comfortaa", sans-serif' : undefined,
    fontWeight: '700',
    letterSpacing: -0.5,
    opacity: 0.9,
  },
  underscore: {
    color: theme.colors.primary,
    fontWeight: '800',
  },
  wellness: {
    color: theme.colors.wellnessGreen, // the contained green
    fontWeight: '300', // thinner font requested by user
    opacity: 0.8,
  },
});
