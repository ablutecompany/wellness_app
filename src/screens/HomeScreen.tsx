import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Container, Typography } from '../components/Base';
import { Nucleus } from '../components/Nucleus';
import { theme } from '../theme';
import { useStore } from '../store/useStore';
import { Zap, CreditCard, Activity } from 'lucide-react-native';

export const HomeScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { globalScore, setGlobalScore } = useStore();
  
  const handleNfcTap = () => {
    // Simulate NFC trigger
    console.log('NFC Analysis triggered');
  };

  const handleLongPress = () => {
    navigation.navigate('GlobalDetail');
  };

  const handleProfilePress = () => {
    navigation.navigate('Profile');
  };

  return (
    <Container safe style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleProfilePress}>
          <Typography variant="caption">Bom dia,</Typography>
          <Typography variant="h2">Nuno</Typography>
        </TouchableOpacity>
        <View style={styles.creditsContainer}>
          <CreditCard size={16} color={theme.colors.textSecondary} />
          <Typography variant="caption" style={styles.creditsText}>12 Créditos</Typography>
        </View>
      </View>

      <View style={styles.nucleusWrapper}>
        <Nucleus 
          score={globalScore || 82} 
          status="forte" 
          onPress={handleNfcTap}
          onLongPress={handleLongPress}
        />
      </View>

      <View style={styles.footer}>
        <View style={styles.infoRow}>
          <Activity size={20} color={theme.colors.primary} />
          <Typography style={styles.infoText}>Última análise: há 2h</Typography>
        </View>
        
        <View style={styles.ctaCard}>
          <Zap size={24} color={theme.colors.success} />
          <View style={styles.ctaContent}>
            <Typography variant="h3">Tua frescura está alta</Typography>
            <Typography variant="caption">Pronto para o próximo treino</Typography>
          </View>
        </View>
      </View>
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: theme.spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: theme.spacing.xl,
  },
  creditsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.card,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: 12,
  },
  creditsText: {
    marginLeft: theme.spacing.xs,
    fontWeight: '600',
  },
  nucleusWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    marginBottom: theme.spacing.xl,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.lg,
  },
  infoText: {
    marginLeft: theme.spacing.sm,
    color: theme.colors.textSecondary,
  },
  ctaCard: {
    backgroundColor: theme.colors.card,
    borderRadius: 20,
    padding: theme.spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
  },
  ctaContent: {
    marginLeft: theme.spacing.md,
  }
});
