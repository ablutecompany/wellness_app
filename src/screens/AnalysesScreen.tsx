import React from 'react';
import { StyleSheet, View, FlatList } from 'react-native';
import { Container, Typography } from '../components/Base';
import { theme } from '../theme';
import { LineChart } from 'lucide-react-native';

interface BiomarkerProps {
  name: string;
  value: string;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  lastChecked: string;
}

const BiomarkerRow: React.FC<BiomarkerProps> = ({ name, value, unit, trend, lastChecked }) => (
  <View style={styles.row}>
    <View style={styles.leftCol}>
      <Typography variant="body" style={styles.name}>{name}</Typography>
      <Typography variant="caption">{lastChecked}</Typography>
    </View>
    <View style={styles.rightCol}>
      <View style={styles.valueContainer}>
        <Typography variant="h3" color={theme.colors.text}>{value}</Typography>
        <Typography variant="caption" style={styles.unit}>{unit}</Typography>
      </View>
      <LineChart size={16} color={theme.colors.primary} />
    </View>
  </View>
);

const MOCK_BIOMARKERS: BiomarkerProps[] = [
  { name: 'Magnésio (Urina)', value: '72', unit: 'mg/L', trend: 'stable', lastChecked: 'Há 2h' },
  { name: 'Hidratação', value: '1.015', unit: 'sp. gr.', trend: 'down', lastChecked: 'Há 2h' },
  { name: 'pH Urinário', value: '6.4', unit: 'pH', trend: 'stable', lastChecked: 'Há 2h' },
  { name: 'Frequência Cardíaca (PPG)', value: '68', unit: 'bpm', trend: 'up', lastChecked: 'Há 15m' },
  { name: 'HRV (RMSSD)', value: '45', unit: 'ms', trend: 'stable', lastChecked: 'Há 15m' },
];

export const AnalysesScreen: React.FC = () => {
  return (
    <Container safe style={styles.container}>
      <View style={styles.header}>
        <Typography variant="h2">Dados Crus</Typography>
        <Typography variant="caption">Biomarcadores sem interpretação AI</Typography>
      </View>

      <FlatList
        data={MOCK_BIOMARKERS}
        keyExtractor={(item) => item.name}
        renderItem={({ item }) => <BiomarkerRow {...item} />}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: theme.spacing.lg,
  },
  header: {
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.lg,
  },
  list: {
    paddingBottom: theme.spacing.xxl,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
  },
  leftCol: {
    flex: 1,
  },
  rightCol: {
    alignItems: 'flex-end',
  },
  name: {
    fontWeight: '600',
    marginBottom: 2,
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 4,
  },
  unit: {
    marginLeft: 4,
    color: theme.colors.textSecondary,
  },
  separator: {
    height: 1,
    backgroundColor: theme.colors.cardBorder,
  }
});
