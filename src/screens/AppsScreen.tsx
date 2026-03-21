import React from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity } from 'react-native';
import { Container, Typography } from '../components/Base';
import { theme } from '../theme';
import { ShoppingBag, Star, Download } from 'lucide-react-native';

const APPS = [
  { name: 'Sleep Deep+', dev: 'ablute_ Labs', desc: 'Integração profunda com o teu sono.', rating: 4.8 },
  { name: 'Metabolic Tracker', dev: 'BioSync', desc: 'Leitura contínua de biomarcadores.', rating: 4.9 },
  { name: 'Yoga Flow', dev: 'ZenITH', desc: 'Sugestão de treinos baseados na tua frescura.', rating: 4.7 },
];

export const AppsScreen: React.FC = () => {
  return (
    <Container safe style={styles.container}>
      <View style={styles.header}>
        <Typography variant="h2">App Store</Typography>
        <Typography variant="caption">Extensões para o teu ecossistema</Typography>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {APPS.map((app, index) => (
          <View key={index} style={styles.appCard}>
            <View style={styles.appIcon}>
              <ShoppingBag size={24} color={theme.colors.primary} />
            </View>
            <View style={styles.appInfo}>
              <Typography variant="body" style={{ fontWeight: '600' }}>{app.name}</Typography>
              <Typography variant="caption">{app.desc}</Typography>
              <View style={styles.ratingRow}>
                <Star size={12} color={theme.colors.warning} fill={theme.colors.warning} />
                <Typography variant="caption" style={styles.ratingText}>{app.rating}</Typography>
              </View>
            </View>
            <TouchableOpacity style={styles.downloadBtn}>
              <Download size={16} color={theme.colors.text} />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
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
  appCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.card,
    padding: theme.spacing.md,
    borderRadius: 20,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
  },
  appIcon: {
    width: 50,
    height: 50,
    borderRadius: 12,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  appInfo: {
    flex: 1,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  ratingText: {
    marginLeft: 4,
    color: theme.colors.warning,
  },
  downloadBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.cardBorder,
    alignItems: 'center',
    justifyContent: 'center',
  }
});
