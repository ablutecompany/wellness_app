import React from 'react';
import { StyleSheet, View, TouchableOpacity, Platform } from 'react-native';
import { Typography } from '../components/Base';
import { theme } from '../theme';
import { Smartphone } from 'lucide-react-native';
import { BrandLogo } from '../components/BrandLogo';
import { BlurView } from 'expo-blur';
import { useStore } from '../store/useStore';

type PairingStatus = 'searching' | 'connected';

export const PairingScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { credits } = useStore();
  const [status, setStatus] = React.useState<PairingStatus>('searching');

  const handleTap = () => {
    if (status === 'searching') {
      setStatus('connected');
      // After showing "Equipamento Detetado", navigate to Main after a brief pause
      setTimeout(() => navigation.replace('Main'), 2000);
    }
  };

  // ── "Equipamento Detetado" — full screen, only text ──────────────────────
  if (status === 'connected') {
    return (
      <View style={styles.detectedScreen}>
        <Typography style={styles.detectedText}>Equipamento Detetado</Typography>
      </View>
    );
  }

  // ── "Encoste para Iniciar" — glassmorphism floating card ─────────────────
  return (
    <View style={styles.backdrop}>
      {/* Header stays visible above the modal */}
      <View style={styles.header}>
        <BrandLogo size="small" />
        <View style={styles.creditBadge}>
          <Typography variant="caption" style={styles.creditText}>{credits} Créditos</Typography>
        </View>
      </View>

      {/* Floating glass modal — tap anywhere on it to proceed */}
      <TouchableOpacity style={styles.modalWrapper} onPress={handleTap} activeOpacity={0.95}>
        <BlurView intensity={Platform.OS === 'web' ? 20 : 60} tint="dark" style={styles.modal}>
          <View style={styles.modalInner}>
            {/* Icon */}
            <View style={styles.iconCircle}>
              <Smartphone size={40} color="#ffffff" />
            </View>

            {/* Title */}
            <Typography style={styles.title}>Encoste para Iniciar</Typography>

            {/* Subtitle */}
            <Typography style={styles.subtitle}>
              Aproxima o teu telemóvel do sensor do equipamento ablute_ para ativar a análise.
            </Typography>

            {/* Tap hint */}
            <View style={styles.tapHint}>
              <Typography style={styles.tapHintText}>Toca aqui para simular</Typography>
            </View>
          </View>
        </BlurView>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  // ── Backdrop ──────────────────────────────────────────────────────────────
  backdrop: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingTop: 16,
  },

  // ── Header ────────────────────────────────────────────────────────────────
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.sm,
    zIndex: 10,
  },
  creditBadge: {
    paddingHorizontal: 14,
    paddingVertical: 4,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  creditText: {
    fontWeight: '700',
    color: theme.colors.primary,
  },

  // ── Floating modal ────────────────────────────────────────────────────────
  modalWrapper: {
    marginHorizontal: 12,
    marginTop: 60,
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  modal: {
    borderRadius: 24,
    overflow: 'hidden',
  },
  modalInner: {
    padding: 32,
    backgroundColor: 'rgba(5, 10, 24, 0.6)',
    alignItems: 'center',
  },

  // ── Icon ──────────────────────────────────────────────────────────────────
  iconCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(0, 168, 230, 0.15)',
    borderWidth: 2,
    borderColor: 'rgba(0, 168, 230, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },

  // ── Text ──────────────────────────────────────────────────────────────────
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#ffffff',
    letterSpacing: -0.3,
    marginBottom: 14,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.45)',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 8,
    marginBottom: 28,
  },

  // ── Tap hint ──────────────────────────────────────────────────────────────
  tapHint: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: 'rgba(0, 168, 230, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(0, 168, 230, 0.2)',
  },
  tapHintText: {
    fontSize: 13,
    color: 'rgba(0, 212, 170, 0.8)',
    letterSpacing: 0.3,
    fontWeight: '500',
  },

  // ── Equipamento Detetado ──────────────────────────────────────────────────
  detectedScreen: {
    flex: 1,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detectedText: {
    fontSize: 28,
    fontWeight: '600',
    color: '#ffffff',
    letterSpacing: -0.5,
    textAlign: 'center',
  },
});
