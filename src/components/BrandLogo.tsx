import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Typography } from './Base';
import { theme } from '../theme';

interface BrandLogoProps {
  size?: 'small' | 'large';
}

export const BrandLogo: React.FC<BrandLogoProps> = ({ size = 'small' }) => {
  const isLarge = size === 'large';
  
  return (
    <View style={styles.container}>
      <Typography 
        variant={isLarge ? 'h2' : 'caption'} 
        style={[styles.baseText, isLarge && { fontSize: 28 }]}
      >
        ablute
        <Typography 
          variant={isLarge ? 'h2' : 'caption'} 
          style={[styles.underscore, isLarge && { fontSize: 28 }]}
        >
          _
        </Typography>
        <Typography 
          variant={isLarge ? 'h2' : 'caption'} 
          style={[styles.wellness, isLarge && { fontSize: 28 }]}
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
    fontWeight: '600',
    opacity: 0.8,
  },
});
