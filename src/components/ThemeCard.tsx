import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { theme } from '../theme';
import { Typography } from './Base';
import { ArrowRight, ChevronRight } from 'lucide-react-native';

interface Optimization {
  type: string;
  description: string;
}

interface ThemeProps {
  title: string;
  score: number;
  state: string;
  summary: string;
  explanation: string;
  optimizations: Optimization[];
  potential: string;
}

export const ThemeCard: React.FC<ThemeProps> = ({
  title,
  score,
  state,
  summary,
  explanation,
  optimizations,
  potential
}) => {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View>
          <Typography variant="h3">{title}</Typography>
          <Typography variant="caption" style={{ color: theme.colors.primary }}>
            {state.toUpperCase()}
          </Typography>
        </View>
        <View style={styles.scoreBadge}>
          <Typography variant="h3" style={styles.scoreText}>{score}</Typography>
        </View>
      </View>

      <Typography style={styles.summary}>{summary}</Typography>
      
      <Typography variant="caption" style={styles.explanation}>
        {explanation}
      </Typography>

      <View style={styles.divider} />

      <View style={styles.optimizationsHeader}>
        <Typography variant="caption" style={styles.sectionTitle}>OTIMIZAÇÕES</Typography>
        <View style={styles.potentialContainer}>
          <Typography variant="caption">Potencial: </Typography>
          <Typography variant="caption" style={{ color: theme.colors.success }}>{potential}</Typography>
        </View>
      </View>

      {optimizations.map((opt, index) => (
        <View key={index} style={styles.optimizationRow}>
          <View style={styles.bullet} />
          <View style={styles.optContent}>
            <Typography variant="caption" style={styles.optType}>{opt.type}</Typography>
            <Typography style={styles.optDesc}>{opt.description}</Typography>
          </View>
          <ChevronRight size={16} color={theme.colors.textMuted} />
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: 24,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.md,
  },
  scoreBadge: {
    backgroundColor: theme.colors.background,
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
  },
  scoreText: {
    color: theme.colors.primary,
  },
  summary: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: theme.spacing.sm,
  },
  explanation: {
    lineHeight: 20,
    marginBottom: theme.spacing.md,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.cardBorder,
    marginBottom: theme.spacing.md,
  },
  optimizationsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.sm,
  },
  sectionTitle: {
    letterSpacing: 1,
    fontWeight: '700',
  },
  potentialContainer: {
    flexDirection: 'row',
  },
  optimizationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.colors.primary,
    marginRight: theme.spacing.md,
  },
  optContent: {
    flex: 1,
  },
  optType: {
    fontSize: 10,
    fontWeight: '700',
    color: theme.colors.textMuted,
  },
  optDesc: {
    fontSize: 15,
  }
});
