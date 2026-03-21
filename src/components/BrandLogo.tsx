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
        variant={isLarge ? 'h1' : 'body'} 
        style={[styles.baseText, isLarge && { fontSize: 32 }]}
      >
        ablute
        <Typography 
          variant={isLarge ? 'h1' : 'body'} 
          style={[styles.underscore, isLarge && { fontSize: 32 }]}
        >
          _
        </Typography>
        {' '}
        <Typography 
          variant={isLarge ? 'h1' : 'body'} 
          style={[styles.wellness, isLarge && { fontSize: 32 }]}
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
  },
  underscore: {
    color: theme.colors.primary,
    fontWeight: '900',
  },
  wellness: {
    color: theme.colors.wellnessGreen,
    fontWeight: '400',
  },
});
