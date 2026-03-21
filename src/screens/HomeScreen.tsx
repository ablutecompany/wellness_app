import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Container, Typography } from '../components/Base';
import { Nucleus } from '../components/Nucleus';
import { theme } from '../theme';
import { useStore } from '../store/useStore';
import { BrandLogo } from '../components/BrandLogo';
import { Utensils, Zap, Map, Settings, Activity } from 'lucide-react-native';

export const HomeScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { globalScore, setGlobalScore, setIsMeasuring, isMeasuring } = useStore();
  
  const handleNfcTap = () => {
    console.log('NFC Analysis triggered');
  };

  const handleLongPress = async () => {
    setIsMeasuring(true);
    // Simulate Ingestion -> scoring process
    setTimeout(() => {
      setIsMeasuring(false);
      setGlobalScore(84);
      navigation.navigate('GlobalDetail');
    }, 4000);
  };

  return (
    <Container safe style={styles.container}>
      <View style={styles.header}>
        <BrandLogo size="small" />
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerIcon} onPress={() => {}}>
            <Map size={24} color={theme.colors.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerIcon} onPress={() => navigation.navigate('Profile')}>
            <Settings size={24} color={theme.colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.nucleusWrapper}>
        <Nucleus 
          score={globalScore || 82} 
          status={isMeasuring ? 'forte' : 'fraco'} 
          onPress={handleNfcTap}
          onLongPress={handleLongPress}
        />
      </View>

      <View style={styles.footer}>
        <View style={styles.platformBar}>
          <TouchableOpacity style={styles.appIcon} onPress={() => {}}>
            <Utensils size={28} color={theme.colors.primary} />
            <Typography variant="caption" style={styles.appLabel}>Nutri Plan</Typography>
          </TouchableOpacity>
          <TouchableOpacity style={styles.appIcon} onPress={() => {}}>
            <Zap size={28} color={theme.colors.wellnessGreen} />
            <Typography variant="caption" style={styles.appLabel}>Female H</Typography>
          </TouchableOpacity>
          <TouchableOpacity style={styles.appIcon} onPress={() => {}}>
            <Activity size={28} color="#FF9500" />
            <Typography variant="caption" style={styles.appLabel}>My suplement</Typography>
          </TouchableOpacity>
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
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIcon: {
    marginLeft: theme.spacing.md,
  },
  nucleusWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    marginBottom: theme.spacing.xl,
  },
  platformBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: theme.colors.card,
    borderRadius: 30,
    paddingVertical: theme.spacing.md,
    marginBottom: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
  },
  appIcon: {
    alignItems: 'center',
  },
  appLabel: {
    fontSize: 10,
    marginTop: 4,
  }
});
