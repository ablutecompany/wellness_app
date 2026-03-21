import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Container, Typography } from '../components/Base';
import { theme } from '../theme';
import { ArrowRight } from 'lucide-react-native';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ 
  title, 
  onPress, 
  variant = 'primary',
  icon 
}) => {
  const isPrimary = variant === 'primary';
  const isOutline = variant === 'outline';

  return (
    <TouchableOpacity 
      activeOpacity={0.8}
      onPress={onPress}
      style={[
        styles.button,
        isPrimary && styles.buttonPrimary,
        isOutline && styles.buttonOutline,
      ]}
    >
      <Typography 
        variant="button" 
        color={isPrimary ? theme.colors.background : theme.colors.text}
      >
        {title}
      </Typography>
      {icon && <View style={styles.icon}>{icon}</View>}
    </TouchableOpacity>
  );
};

import { BrandLogo } from '../components/BrandLogo';

export const WelcomeScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  return (
    <Container safe style={styles.container}>
      <View /> {/* Top spacing for negative space */}
      
      <View style={styles.centerContent}>
        <BrandLogo size="large" />
        <View style={styles.sloganContainer}>
          <Typography variant="h2" style={styles.slogan}>
            Biological Intelligence.
          </Typography>
          <View style={styles.underline} />
        </View>
        <Typography color={theme.colors.textSecondary} style={styles.introText}>
          Uma interpretação funcional e profunda do teu corpo. 
          Clareza absoluta para o teu bem-estar.
        </Typography>
      </View>
      
      <View style={styles.footer}>
        <Button 
          title="Iniciar Jornada" 
          onPress={() => navigation.navigate('Pairing')}
          icon={<ArrowRight size={20} color={theme.colors.background} />}
        />
      </View>
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: theme.spacing.xl,
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.xxl,
    backgroundColor: theme.colors.background,
  },
  centerContent: {
    alignItems: 'center',
    marginTop: -theme.spacing.xxl,
  },
  sloganContainer: {
    marginTop: theme.spacing.xl,
    alignItems: 'center',
  },
  slogan: {
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: -0.5,
    textAlign: 'center',
  },
  underline: {
    height: 3,
    width: 40,
    backgroundColor: theme.colors.primary,
    marginTop: theme.spacing.xs,
    borderRadius: 2,
  },
  introText: {
    marginTop: theme.spacing.xl,
    textAlign: 'center',
    lineHeight: 28,
    fontSize: 16,
    paddingHorizontal: theme.spacing.lg,
    opacity: 0.8,
  },
  subtitle: {
    lineHeight: 24,
  },
  footer: {
    marginBottom: theme.spacing.lg,
  },
  button: {
    height: 56,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.lg,
  },
  buttonPrimary: {
    backgroundColor: theme.colors.text,
  },
  buttonOutline: {
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
  },
  icon: {
    marginLeft: theme.spacing.sm,
  }
});
