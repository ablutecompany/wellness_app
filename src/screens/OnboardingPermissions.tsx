import React from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity } from 'react-native';
import { Container, Typography } from '../components/Base';
import { Button } from './OnboardingWelcome';
import { theme } from '../theme';
import { 
  Activity, 
  Bluetooth, 
  Heart, 
  MapPin, 
  Mic, 
  Smartphone 
} from 'lucide-react-native';

const PERMISSIONS = [
  { id: 'health', icon: Heart, title: 'Saúde e Biomarcadores', desc: 'Sincronização com Apple Health / Google Fit.' },
  { id: 'sensors', icon: Smartphone, title: 'Sensores do Dispositivo', desc: 'Acesso a acelerómetro e giroscópio.' },
  { id: 'motion', icon: Activity, title: 'Movimento e Atividade', desc: 'Deteção automática de passos e exercícios.' },
  { id: 'location', icon: MapPin, title: 'Localização', desc: 'Contexto ambiental e meteorológico.' },
  { id: 'bluetooth', icon: Bluetooth, title: 'Bluetooth', desc: 'Ligação ao teu equipamento ablute_.' },
  { id: 'microphone', icon: Mic, title: 'Microfone', desc: 'Para interações de voz com o chat.' },
];

export const OnboardingPermissions: React.FC<{ navigation: any }> = ({ navigation }) => {
  const handleFinalize = () => {
    // In a real app, request permissions here
    navigation.replace('Main');
  };

  return (
    <Container safe style={styles.container}>
      <View style={styles.header}>
        <Typography variant="caption" color={theme.colors.primary}>PASSO 2 DE 2</Typography>
        <Typography variant="h2" style={styles.title}>
          Para uma leitura real do teu estado, precisamos de aceder aos sinais do teu corpo.
        </Typography>
        <Typography color={theme.colors.textSecondary}>
          Garantimos a máxima privacidade. O teu consentimento permite a interpretação funcional.
        </Typography>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {PERMISSIONS.map((p) => (
          <View key={p.id} style={styles.permissionItem}>
            <View style={styles.iconContainer}>
              <p.icon size={24} color={theme.colors.primary} />
            </View>
            <View style={styles.permText}>
              <Typography variant="body" style={styles.permTitle}>{p.title}</Typography>
              <Typography variant="caption">{p.desc}</Typography>
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <Button 
          title="Ativar tudo e Continuar" 
          onPress={handleFinalize}
        />
        <TouchableOpacity style={styles.skip} onPress={handleFinalize}>
          <Typography variant="caption" style={{ textAlign: 'center' }}>Configurar manualmente depois</Typography>
        </TouchableOpacity>
      </View>
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.xl,
  },
  header: {
    marginBottom: theme.spacing.xl,
  },
  title: {
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  scroll: {
    paddingBottom: theme.spacing.xl,
  },
  permissionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: theme.colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  permText: {
    flex: 1,
  },
  permTitle: {
    fontWeight: '600',
    marginBottom: 2,
  },
  footer: {
    marginTop: theme.spacing.md,
  },
  skip: {
    marginTop: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  }
});
