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

export const WelcomeScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  return (
    <Container safe style={styles.container}>
      <View style={styles.content}>
        <Typography variant="h1" style={styles.logo}>
          ablute<Typography variant="h1" color={theme.colors.primary}>_</Typography>
        </Typography>
        <Typography variant="h2" style={styles.title}>
          Compreende o teu corpo como nunca antes.
        </Typography>
        <Typography color={theme.colors.textSecondary} style={styles.subtitle}>
          Uma interpretação inteligente dos teus sinais vitais para uma vida com mais clareza.
        </Typography>
      </View>
      
      <View style={styles.footer}>
        <Button 
          title="Começar" 
          onPress={() => navigation.navigate('OnboardingGoals')}
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
  },
  content: {
    marginTop: theme.spacing.xxl,
  },
  logo: {
    fontSize: 42,
    marginBottom: theme.spacing.xl,
    letterSpacing: -1,
  },
  title: {
    marginBottom: theme.spacing.md,
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
