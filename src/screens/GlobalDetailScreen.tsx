import React from 'react';
import { StyleSheet, View, TouchableOpacity, ScrollView } from 'react-native';
import { Container, Typography } from '../components/Base';
import { theme } from '../theme';
import { X, TrendingUp, ShieldCheck, Zap } from 'lucide-react-native';

export const GlobalDetailScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  return (
    <Container safe style={styles.container}>
      <View style={styles.header}>
        <View>
          <Typography variant="h2">Detalhe Global</Typography>
          <Typography variant="caption">Composição do teu Score (82)</Typography>
        </View>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeBtn}>
          <X size={24} color={theme.colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.scoreBreakdown}>
          <View style={styles.breakdownItem}>
            <View style={styles.itemHeader}>
              <TrendingUp size={20} color={theme.colors.success} />
              <Typography style={styles.itemTitle}>Fisiológico</Typography>
              <Typography variant="h3">88</Typography>
            </View>
            <Typography variant="caption">Dados provenientes de ECG e Bioimpedância.</Typography>
          </View>

          <View style={styles.breakdownItem}>
            <View style={styles.itemHeader}>
              <ShieldCheck size={20} color={theme.colors.primary} />
              <Typography style={styles.itemTitle}>Comportamental</Typography>
              <Typography variant="h3">76</Typography>
            </View>
            <Typography variant="caption">Aderência a hábitos e padrões de sono.</Typography>
          </View>

          <View style={styles.breakdownItem}>
            <View style={styles.itemHeader}>
              <Zap size={20} color={theme.colors.warning} />
              <Typography style={styles.itemTitle}>Líquidos e Nutrição</Typography>
              <Typography variant="h3">82</Typography>
            </View>
            <Typography variant="caption">Análises urinárias e hidratação.</Typography>
          </View>
        </View>

        <View style={styles.explanationCard}>
          <Typography variant="h3" style={{ marginBottom: 12 }}>O que isto significa?</Typography>
          <Typography color={theme.colors.textSecondary}>
            O teu score de 82 reflete uma excelente frescura fisiológica, mas indica que o teu comportamento (sono tardio) está a impedir um topo de forma. 
            A nutrição está estável, garantindo os substratos necessários para o dia.
          </Typography>
        </View>
      </ScrollView>
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
    marginBottom: theme.spacing.xxl,
  },
  closeBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreBreakdown: {
    marginBottom: theme.spacing.xl,
  },
  breakdownItem: {
    backgroundColor: theme.colors.card,
    padding: theme.spacing.lg,
    borderRadius: 24,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  itemTitle: {
    flex: 1,
    marginLeft: theme.spacing.sm,
    fontWeight: '600',
  },
  explanationCard: {
    backgroundColor: theme.colors.card,
    padding: theme.spacing.xl,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    marginBottom: theme.spacing.xxl,
  }
});
