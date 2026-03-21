import React, { useEffect } from 'react';
import { StyleSheet, View, Animated, Easing, TouchableOpacity } from 'react-native';
import { Container, Typography } from '../components/Base';
import { theme } from '../theme';
import { Smartphone, RefreshCw } from 'lucide-react-native';
import { BrandLogo } from '../components/BrandLogo';

import { useStore } from '../store/useStore';

export const PairingScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { user, credits } = useStore();
  const [status, setStatus] = React.useState<'searching' | 'connected' | 'error' | 'no_credits'>('searching');
  const [errorMessage, setErrorMessage] = React.useState('');
  
  const pulseAnim = React.useRef(new Animated.Value(1)).current;
  const rotateAnim = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.2, duration: 1500, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 1500, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ])
    ).start();

    // Spin animation for loader
    Animated.loop(
      Animated.timing(rotateAnim, { toValue: 1, duration: 2000, easing: Easing.linear, useNativeDriver: true })
    ).start();

    // Logic Simulation
    const timer = setTimeout(() => {
      if (credits <= 0) {
        setStatus('no_credits');
      } else {
        setStatus('connected');
        setTimeout(() => navigation.replace('Main'), 1500);
      }
    }, 4000);

    return () => clearTimeout(timer);
  }, [credits]);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });

  return (
    <Container safe style={styles.container}>
      <View style={styles.header}>
        <BrandLogo size="small" />
        <View style={styles.creditBadge}>
          <Typography variant="caption" style={styles.creditText}>{credits} Créditos</Typography>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.animationArea}>
          <Animated.View style={[styles.pulseCircle, { transform: [{ scale: pulseAnim }], opacity: status === 'searching' ? 0.2 : 0 }]} />
          <View style={[styles.iconContainer, status === 'error' && styles.iconError]}>
            {status === 'error' ? (
              <Smartphone size={48} color={theme.colors.error} />
            ) : status === 'no_credits' ? (
              <Smartphone size={48} color={theme.colors.warning} />
            ) : (
              <Smartphone size={64} color={status === 'connected' ? theme.colors.primary : theme.colors.textMuted} />
            )}
          </View>
        </View>

        <Typography variant="h2" style={styles.title}>
          {status === 'searching' ? 'Encoste para Iniciar' : 
           status === 'connected' ? 'Equipamento Detetado' :
           status === 'no_credits' ? 'Créditos Insuficientes' : 'Erro de Ligação'}
        </Typography>
        
        <Typography color={theme.colors.textSecondary} style={styles.subtitle}>
          {status === 'searching' ? 'Aproxima o teu telemóvel do sensor do equipamento ablute_ para ativar a análise.' :
           status === 'connected' ? 'Sincronização em curso... A tua inteligência biológica está a ser processada.' :
           status === 'no_credits' ? 'Precisas de pelo menos 1 crédito para realizar esta análise.' :
           'Não foi possível encontrar o equipamento. Tenta novamente ou verifica o NFC.'}
        </Typography>
      </View>

      <View style={styles.footer}>
        {status === 'searching' && (
          <View style={styles.loaderContainer}>
            <Animated.View style={{ transform: [{ rotate: spin }] }}>
              <RefreshCw size={20} color={theme.colors.primary} />
            </Animated.View>
            <Typography variant="caption" style={{ marginLeft: theme.spacing.sm }}>
              À procura de hardware...
            </Typography>
          </View>
        )}
        
        {status === 'no_credits' && (
          <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('Main', { screen: 'Profile' })}>
            <Typography variant="button" color={theme.colors.background}>Adquirir Créditos</Typography>
          </TouchableOpacity>
        )}

        {(status === 'error' || status === 'no_credits') && (
          <TouchableOpacity style={styles.retryButton} onPress={() => setStatus('searching')}>
            <Typography variant="caption" color={theme.colors.primary}>Tentar Novamente</Typography>
          </TouchableOpacity>
        )}
      </View>
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: theme.spacing.xl,
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.xl,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  creditBadge: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 4,
    borderRadius: 20,
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
  },
  creditText: {
    fontWeight: '700',
    color: theme.colors.primary,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: theme.spacing.xxl,
  },
  animationArea: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 300,
    width: '100%',
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: theme.colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    zIndex: 2,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
  },
  iconError: {
    borderColor: theme.colors.error + '40',
  },
  pulseCircle: {
    position: 'absolute',
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: theme.colors.primary,
    zIndex: 1,
  },
  title: {
    textAlign: 'center',
    marginBottom: theme.spacing.md,
    fontSize: 26,
  },
  subtitle: {
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: theme.spacing.lg,
    opacity: 0.8,
  },
  footer: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
    minHeight: 100,
  },
  loaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    opacity: 0.6,
  },
  actionButton: {
    backgroundColor: theme.colors.text,
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.md,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
  },
  retryButton: {
    marginTop: theme.spacing.lg,
    padding: theme.spacing.sm,
  }
});

